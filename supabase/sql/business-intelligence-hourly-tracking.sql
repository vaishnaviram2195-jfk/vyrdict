-- VYRDICT Business Intelligence: daily tracking + private admin reporting.
-- The two existing source tables are intentionally not copied; aggregation is source-linked.
CREATE TABLE IF NOT EXISTS public.vyrdict_daily_business_stats (
 local_day date PRIMARY KEY, page_views bigint NOT NULL DEFAULT 0,
 identifiable_visitors bigint NOT NULL DEFAULT 0,
 identifiable_sessions bigint NOT NULL DEFAULT 0,
 returning_browsers bigint NOT NULL DEFAULT 0,
 product_opens bigint NOT NULL DEFAULT 0,
 retailer_clicks bigint NOT NULL DEFAULT 0,
 affiliate_clicks bigint NOT NULL DEFAULT 0,
 hub_clicks bigint NOT NULL DEFAULT 0,
 work_inquiries bigint NOT NULL DEFAULT 0,
 new_accounts bigint NOT NULL DEFAULT 0,
 newsletter_signups bigint NOT NULL DEFAULT 0,
 active_subscribers_asof_day bigint NOT NULL DEFAULT 0,
 accounts_asof_day bigint NOT NULL DEFAULT 0,
 last_event_at timestamptz, refreshed_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.vyrdict_daily_category_stats (
 local_day date NOT NULL, category text NOT NULL,
 category_page_views bigint NOT NULL DEFAULT 0,
 category_clicks bigint NOT NULL DEFAULT 0,
 product_page_views bigint NOT NULL DEFAULT 0,
 product_opens bigint NOT NULL DEFAULT 0,
 retailer_clicks bigint NOT NULL DEFAULT 0,
 identifiable_visitors bigint NOT NULL DEFAULT 0,
 refreshed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(local_day,category)
);
CREATE INDEX IF NOT EXISTS vyrdict_daily_category_stats_date_idx
 ON public.vyrdict_daily_category_stats(local_day DESC);
ALTER TABLE public.vyrdict_daily_business_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vyrdict_daily_category_stats ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.vyrdict_daily_business_stats FROM anon,authenticated;
REVOKE ALL ON public.vyrdict_daily_category_stats FROM anon,authenticated;
GRANT SELECT ON public.vyrdict_daily_business_stats TO service_role;
GRANT SELECT ON public.vyrdict_daily_category_stats TO service_role;

CREATE OR REPLACE FUNCTION private.vyrdict_refresh_daily_tracking(p_day date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_rows int;
BEGIN
  IF p_day IS NULL OR p_day > (now() at time zone 'America/Toronto')::date OR p_day < date '2026-08-01' THEN
    RAISE EXCEPTION 'invalid_daily_rollup_date';
  END IF;
  INSERT INTO public.vyrdict_daily_business_stats (
    local_day,page_views,identifiable_visitors,identifiable_sessions,returning_browsers,
    product_opens,retailer_clicks,affiliate_clicks,hub_clicks,work_inquiries,
    new_accounts,newsletter_signups,active_subscribers_asof_day,accounts_asof_day,
    last_event_at,refreshed_at
  )
  WITH events AS (
    SELECT e.* FROM public.vyrdict_analytics_events e
    WHERE (e.created_at at time zone 'America/Toronto')::date=p_day
      AND coalesce(e.path,'') !~* '(finalqa|navqa|uiqa|cloneqa|marketqa|[?&]qa=|[?&]clone=|perfqa|mobileqa|testqa)'
  ),
  subscribers AS (
    SELECT lower(trim(email)) email,
      CASE WHEN status='unsubscribed' AND unsubscribed_at IS NOT NULL
        AND (unsubscribed_at at time zone 'America/Toronto')::date>p_day THEN 'active'
        ELSE status END status, created_at
    FROM public.vyrdict_newsletter_subscribers
    UNION ALL
    SELECT lower(trim(email)) email, 'legacy_active' status,created_at FROM public.newsletter_subscribers
  ),
  latest_email AS (
    SELECT DISTINCT ON (email) email,status FROM subscribers
    WHERE (created_at at time zone 'America/Toronto')::date <= p_day
    ORDER BY email,CASE WHEN status='legacy_active' THEN 0 ELSE 1 END DESC,created_at DESC
  )
  SELECT p_day,
    count(*) FILTER (WHERE e.event_name='page_view'),
    count(DISTINCT e.visitor_id) FILTER(WHERE e.event_name='page_view' AND e.visitor_id IS NOT NULL),
    count(DISTINCT e.session_id) FILTER(WHERE e.event_name='page_view' AND e.session_id IS NOT NULL),
    count(DISTINCT e.visitor_id) FILTER(WHERE e.event_name='page_view' AND e.visitor_id IS NOT NULL
      AND (coalesce(e.visit_number,0)>1 OR e.visit_type='returning'
      OR (e.visitor_first_seen_at at time zone 'America/Toronto')::date<p_day)),
    count(*) FILTER(WHERE e.event_name='product_open'),
    count(*) FILTER(WHERE e.event_name='retailer_click'),
    count(*) FILTER(WHERE e.event_name='retailer_click' AND e.is_affiliate_click),
    count(*) FILTER(WHERE e.event_name='hub_click'),
    (SELECT count(*) FROM public.studio_inquiries i WHERE (i.created_at at time zone 'America/Toronto')::date=p_day),
    (SELECT count(*) FROM auth.users u WHERE u.email IS NOT NULL AND coalesce(u.is_anonymous,false)=false AND (u.created_at at time zone 'America/Toronto')::date=p_day),
    (SELECT count(DISTINCT email) FROM subscribers WHERE (created_at at time zone 'America/Toronto')::date=p_day),
    (SELECT count(*) FROM latest_email WHERE status IN ('active','legacy_active')),
    (SELECT count(*) FROM auth.users u WHERE u.email IS NOT NULL AND coalesce(u.is_anonymous,false)=false AND (u.created_at at time zone 'America/Toronto')::date <=p_day),
    max(e.created_at),now()
  FROM events e
  ON CONFLICT(local_day) DO UPDATE SET
    page_views=excluded.page_views,identifiable_visitors=excluded.identifiable_visitors,
    identifiable_sessions=excluded.identifiable_sessions,returning_browsers=excluded.returning_browsers,
    product_opens=excluded.product_opens,retailer_clicks=excluded.retailer_clicks,
    affiliate_clicks=excluded.affiliate_clicks,hub_clicks=excluded.hub_clicks,
    work_inquiries=excluded.work_inquiries,new_accounts=excluded.new_accounts,
    newsletter_signups=excluded.newsletter_signups,
    active_subscribers_asof_day=excluded.active_subscribers_asof_day,
    accounts_asof_day=excluded.accounts_asof_day,last_event_at=excluded.last_event_at,
    refreshed_at=now();

  DELETE FROM public.vyrdict_daily_category_stats WHERE local_day=p_day;
  INSERT INTO public.vyrdict_daily_category_stats(
    local_day,category,category_page_views,category_clicks,product_page_views,
    product_opens,retailer_clicks,identifiable_visitors,refreshed_at
  )
  WITH ev AS (
    SELECT e.event_name,e.visitor_id,e.path,e.page_kind,e.category,e.product_slug,
      split_part(coalesce(e.path,''),'?',1) plain_path
    FROM public.vyrdict_analytics_events e
    WHERE (e.created_at at time zone 'America/Toronto')::date=p_day
      AND e.event_name IN ('category_open','page_view','product_open','retailer_click')
      AND coalesce(e.path,'') !~* '(finalqa|navqa|uiqa|cloneqa|marketqa|[?&]qa=|[?&]clone=|perfqa|mobileqa|testqa)'
  ), tagged AS (
    SELECT ev.*,
      coalesce(nullif(trim(p.category),''),
               nullif(trim(ev.category),''),
               nullif(initcap(replace(substring(ev.plain_path from '^/category/([^/#?]+)'),'-',' ')),'')
      ) raw_category
    FROM ev LEFT JOIN public.products p
      ON p.slug=coalesce(nullif(ev.product_slug,''),substring(ev.plain_path from '^/product/([^/#?]+)'))
  ), normalized AS (
    SELECT *, CASE
      WHEN lower(raw_category) IN ('kids','baby','kids and baby','kids & baby') THEN 'Kids & Baby'
      WHEN lower(raw_category) IN ('beauty-tech','beauty tech') THEN 'Beauty Tech'
      WHEN lower(raw_category)='food and drinks' THEN 'Food & Drinks'
      WHEN lower(raw_category)='makeup' THEN 'Makeup'
      WHEN lower(raw_category)='skincare' THEN 'Skincare'
      WHEN lower(raw_category)='beauty' THEN 'Beauty'
      ELSE initcap(raw_category) END category_name
    FROM tagged WHERE raw_category IS NOT NULL
  )
  SELECT p_day,category_name,
    count(*) FILTER(WHERE event_name='page_view' AND (plain_path LIKE '/category/%' OR page_kind='category')),
    count(*) FILTER(WHERE event_name='category_open'),
    count(*) FILTER(WHERE event_name='page_view' AND (plain_path LIKE '/product/%' OR page_kind='product')),
    count(*) FILTER(WHERE event_name='product_open'),
    count(*) FILTER(WHERE event_name='retailer_click'),
    count(DISTINCT visitor_id) FILTER(WHERE visitor_id IS NOT NULL
      AND (event_name='page_view' OR event_name='product_open')),
    now()
  FROM normalized
  GROUP BY category_name;
  GET DIAGNOSTICS v_rows=ROW_COUNT;
  RETURN jsonb_build_object('date',p_day,'category_rows',v_rows,'refreshed_at',now());
END;
$function$


REVOKE ALL ON FUNCTION private.vyrdict_refresh_daily_tracking(date) FROM PUBLIC;

CREATE OR REPLACE FUNCTION public.vyrdict_business_tracking_dashboard()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
WITH bounds AS (
 SELECT (now() at time zone 'America/Toronto')::date today
),
today_stats AS (
 SELECT to_jsonb(s) - 'local_day' - 'refreshed_at' - 'last_event_at' AS j
 FROM public.vyrdict_daily_business_stats s,bounds b WHERE s.local_day=b.today
),
week_stats AS (
 SELECT jsonb_build_object(
   'page_views',coalesce(sum(page_views),0),
   'browser_days',coalesce(sum(identifiable_visitors),0),
   'sessions',coalesce(sum(identifiable_sessions),0),
   'retailer_clicks',coalesce(sum(retailer_clicks),0),
   'product_opens',coalesce(sum(product_opens),0),
   'work_inquiries',coalesce(sum(work_inquiries),0),
   'new_accounts',coalesce(sum(new_accounts),0),
   'newsletter_signups',coalesce(sum(newsletter_signups),0),
   'unique_browsers',(select count(distinct visitor_id) from public.vyrdict_analytics_events e,bounds b2
      where event_name='page_view' and visitor_id is not null
      and (e.created_at at time zone 'America/Toronto')::date between b2.today-6 and b2.today
      and coalesce(e.path,'') !~* '(finalqa|navqa|uiqa|cloneqa|marketqa|[?&]qa=|[?&]clone=|perfqa|mobileqa|testqa)')
 ) j FROM public.vyrdict_daily_business_stats s,bounds b WHERE s.local_day between b.today-6 and b.today
),
prior_week AS (
 SELECT jsonb_build_object('page_views',coalesce(sum(page_views),0),
  'product_opens',coalesce(sum(product_opens),0),'retailer_clicks',coalesce(sum(retailer_clicks),0)) j
 FROM public.vyrdict_daily_business_stats s,bounds b
 WHERE s.local_day between b.today-13 and b.today-7
),
daily_history AS (
 SELECT coalesce(jsonb_agg(jsonb_build_object(
    'date',s.local_day,'page_views',s.page_views,'visitors',s.identifiable_visitors,
    'returning_browsers',s.returning_browsers,'product_opens',s.product_opens,
    'retailer_clicks',s.retailer_clicks,'work_inquiries',s.work_inquiries,
    'new_accounts',s.new_accounts,'newsletter_signups',s.newsletter_signups
  ) ORDER BY s.local_day),'[]'::jsonb) j
 FROM public.vyrdict_daily_business_stats s,bounds b
 WHERE s.local_day BETWEEN b.today-13 AND b.today
),
categories AS (
 SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.interactions desc,x.product_opens desc),'[]'::jsonb) j
 FROM (
    SELECT s.category,sum(s.category_page_views) AS category_views,
      sum(s.category_clicks) AS category_clicks,
      sum(s.product_page_views) AS product_views,
      sum(s.product_opens) AS product_opens,
      sum(s.retailer_clicks) AS retailer_clicks,
      sum(s.category_page_views+s.product_page_views+s.product_opens+s.category_clicks) AS interactions
    FROM public.vyrdict_daily_category_stats s,bounds b
    WHERE s.local_day BETWEEN b.today-13 AND b.today
    GROUP BY s.category ORDER BY interactions DESC LIMIT 25
 ) x
),
frequent AS (
  SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY t.sessions DESC,t.page_views DESC),'[]'::jsonb) j
  FROM (
    SELECT substring(md5(e.visitor_id) from 1 for 10) AS browser_code,
      count(*) AS page_views,
      count(distinct e.session_id) AS sessions,
      count(distinct (e.created_at at time zone 'America/Toronto')::date) AS active_days,
      min(e.created_at) AS first_seen_in_period,
      max(e.created_at) AS last_seen
    FROM public.vyrdict_analytics_events e,bounds b
    WHERE e.event_name='page_view' AND e.visitor_id IS NOT NULL AND e.session_id IS NOT NULL
      AND (e.created_at at time zone 'America/Toronto')::date BETWEEN b.today-29 AND b.today
      AND coalesce(e.path,'') !~* '(finalqa|navqa|uiqa|cloneqa|marketqa|[?&]qa=|[?&]clone=|perfqa|mobileqa|testqa)'
    GROUP BY e.visitor_id
    HAVING count(distinct e.session_id)>=3 AND count(distinct (e.created_at at time zone 'America/Toronto')::date)>=2
    ORDER BY sessions DESC,page_views DESC LIMIT 15
  ) t
),
frequent_count AS (
  SELECT count(*) AS n FROM (
    SELECT e.visitor_id
    FROM public.vyrdict_analytics_events e,bounds b
    WHERE e.event_name='page_view' AND e.visitor_id IS NOT NULL AND e.session_id IS NOT NULL
      AND (e.created_at at time zone 'America/Toronto')::date BETWEEN b.today-29 AND b.today
      AND coalesce(e.path,'') !~* '(finalqa|navqa|uiqa|cloneqa|marketqa|[?&]qa=|[?&]clone=|perfqa|mobileqa|testqa)'
    GROUP BY e.visitor_id
    HAVING count(distinct e.session_id)>=3 AND count(distinct (e.created_at at time zone 'America/Toronto')::date)>=2
  ) f
),
work_recent AS (
 SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.created_at DESC),'[]'::jsonb) j
 FROM (
   SELECT id,created_at,name,company,email,service,source,
     left(brief,260) AS brief_preview
   FROM public.studio_inquiries
   ORDER BY created_at DESC LIMIT 12
 ) x
),
accounts_recent AS (
 SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.created_at DESC),'[]'::jsonb) j
 FROM (
   SELECT email,created_at,email_confirmed_at IS NOT NULL AS email_confirmed,
     last_sign_in_at
   FROM auth.users
   WHERE email IS NOT NULL AND coalesce(is_anonymous,false)=false
   ORDER BY created_at DESC LIMIT 15
 ) x
),
newsletter_recent AS (
 SELECT coalesce(jsonb_agg(to_jsonb(x) ORDER BY x.created_at DESC),'[]'::jsonb) j
 FROM (
   SELECT email,status,source,created_at,unsubscribed_at
   FROM public.vyrdict_newsletter_subscribers
   UNION ALL
   SELECT email,'legacy_active' status,source,created_at,null::timestamptz
   FROM public.newsletter_subscribers
   ORDER BY created_at DESC LIMIT 20
 ) x
),
health AS (
 SELECT jsonb_build_object(
  'last_received_event',(SELECT max(created_at) FROM public.vyrdict_analytics_events),
  'last_rollup',(SELECT max(refreshed_at) FROM public.vyrdict_daily_business_stats),
  'rollup_days',(SELECT count(*) FROM public.vyrdict_daily_business_stats),
  'last_inquiry',(SELECT max(created_at) FROM public.studio_inquiries),
  'last_newsletter',(SELECT max(created_at) FROM public.vyrdict_newsletter_subscribers),
  'last_account',(SELECT max(created_at) FROM auth.users),
  'rollup_job_active',(SELECT exists(SELECT 1 FROM cron.job WHERE jobname='vyrdict-business-tracking-hourly' AND active)),
  'snapshot_stale',(SELECT coalesce(max(refreshed_at)<now()-interval '2 hours',true) FROM public.vyrdict_daily_business_stats)
 ) j
)
SELECT jsonb_build_object(
 'generated_at',now(),
 'timezone','America/Toronto',
 'today',(SELECT j FROM today_stats),
 'last7d',(SELECT j FROM week_stats),
 'prior7d',(SELECT j FROM prior_week),
 'daily',(SELECT j FROM daily_history),
 'categories',(SELECT j FROM categories),
 'frequent_visitors',(SELECT j FROM frequent),
 'frequent_visitor_count',(SELECT n FROM frequent_count),
 'work_inquiries',(SELECT j FROM work_recent),
 'account_list',(SELECT j FROM accounts_recent),
 'newsletter_list',(SELECT j FROM newsletter_recent),
 'work_total',(SELECT count(*) FROM public.studio_inquiries),
 'account_total',(SELECT count(*) FROM auth.users WHERE email IS NOT NULL AND coalesce(is_anonymous,false)=false),
 'newsletter_active',(SELECT count(*) FROM public.vyrdict_newsletter_subscribers WHERE status='active')
     +(SELECT count(*) FROM public.newsletter_subscribers old
       WHERE NOT EXISTS (SELECT 1 FROM public.vyrdict_newsletter_subscribers nw WHERE lower(nw.email)=lower(old.email))),
 'newsletter_unsubscribed',(SELECT count(*) FROM public.vyrdict_newsletter_subscribers WHERE status='unsubscribed'),
 'health',(SELECT j FROM health),
 'definitions',jsonb_build_object(
    'frequent','Anonymous browser with 3+ sessions on at least 2 different days in the past 30 days',
    'visitors','Only browsers with an available anonymous visitor ID; not verified unique people',
    'categories','Category page views, clicks, product page views, product opens and retailer clicks from tracked events. Missing historic page tags are not estimated.',
    'newsletter','Confirmed subscription records across the primary and legacy forms; active excludes unsubscribed in primary'
 )
);
$function$


REVOKE ALL ON FUNCTION public.vyrdict_business_tracking_dashboard() FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.vyrdict_business_tracking_dashboard() TO service_role;
-- Runs every hour; updates current and prior Toronto day, including after DST changes.
SELECT cron.schedule('vyrdict-business-tracking-hourly','14 * * * *',
  $$SELECT private.vyrdict_refresh_daily_tracking((now() at time zone 'America/Toronto')::date);
    SELECT private.vyrdict_refresh_daily_tracking((now() at time zone 'America/Toronto')::date - 1);$$);
