-- VYRDICT fresh-product policy and per-category freshness status. November 1, 2026.
-- Publication and score dates are not rewritten. Current weekly rankings
-- require real dated mentions from published sources; older product reviews
-- remain accessible only in clearly labelled earlier-review sections.
create table if not exists public.vyrdict_category_freshness_daily (
 local_day date not null,category text not null,
 active_verified integer not null default 0,
 new_verified_7d integer not null default 0,
 new_verified_14d integer not null default 0,
 evidence_rechecked_7d integer not null default 0,
 genuine_trend_signals_7d integer not null default 0,
 candidates_discovered_7d integer not null default 0,
 candidate_backlog integer not null default 0,
 retailer_records_overdue_30d integer not null default 0,
 latest_published_at timestamptz,
 latest_verified_at timestamptz,
 freshness_status text not null,
 refreshed_at timestamptz not null default now(),
 primary key (local_day,category)
);
alter table public.vyrdict_category_freshness_daily enable row level security;
revoke all on public.vyrdict_category_freshness_daily from anon,authenticated;
grant select on public.vyrdict_category_freshness_daily to service_role;

CREATE OR REPLACE FUNCTION private.refresh_viral_weekly_rankings(p_week_start date DEFAULT (date_trunc('week'::text, timezone('UTC'::text, now())))::date)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_count integer := 0;
begin
  delete from public.viral_weekly_rankings where week_start = p_week_start;

  with pulse as (
    select distinct on (tp.product_id)
      tp.product_id,
      tp.pulse_score,
      tp.observed_on
    from public.vyrdict_trend_pulses tp
    where tp.observed_on >= (p_week_start - 14)
      and tp.newest_mention_at >= now()-interval '7 days'
      and tp.mention_count>=1 and tp.unique_publishers>=1
      and tp.pulse_score>=30
      and cardinality(tp.source_urls)>=1
    order by tp.product_id, tp.observed_on desc
  ), eligible as (
    select
      p.id as product_id,
      p.published_at as review_published_at,
      pulse.pulse_score as current_pulse,
      case
        when p.category = 'Beauty' then 'beauty'
        when p.category = 'Beauty Tech' then 'beauty-tech'
        when p.category = 'Books' then 'books'
        when p.category = 'Fashion' then 'fashion'
        when p.category = 'Fitness' then 'fitness'
        when p.category = 'Gifts' then 'gifts'
        when p.category = 'Food & Drinks' then 'food'
        when p.category = 'Hair' then 'hair'
        when p.category = 'Home' then 'home'
        when p.category = 'Kids & Baby' then 'kids'
        when p.category = 'Kitchen' then 'kitchen'
        when p.category = 'Makeup' then 'makeup'
        when p.category = 'Perfume' then 'perfume'
        when p.category = 'Pets' then 'pets'
        when p.category = 'Shoes' then 'shoes'
        when p.category = 'Skincare' then 'skincare'
        when p.category = 'Stationery & Crafts' then 'stationery'
        when p.category = 'Tech' then 'tech'
        when p.category = 'Toys & Collectibles' then 'toys'
        when p.category = 'Travel' then 'travel'
        when p.category = 'Wellness' then 'wellness'
        else null
      end as category_key,
      case
        when p.category = 'Beauty' then 'Beauty'
        when p.category = 'Beauty Tech' then 'Beauty Tech'
        when p.category = 'Books' then 'Books'
        when p.category = 'Fashion' then 'Fashion'
        when p.category = 'Fitness' then 'Fitness'
        when p.category = 'Gifts' then 'Gifts'
        when p.category = 'Food & Drinks' then 'Food & Drinks'
        when p.category = 'Hair' then 'Hair'
        when p.category = 'Home' then 'Home'
        when p.category = 'Kids & Baby' then 'Kids & Baby'
        when p.category = 'Kitchen' then 'Kitchen'
        when p.category = 'Makeup' then 'Makeup'
        when p.category = 'Perfume' then 'Perfume'
        when p.category = 'Pets' then 'Pets'
        when p.category = 'Shoes' then 'Shoes'
        when p.category = 'Skincare' then 'Skincare'
        when p.category = 'Stationery & Crafts' then 'Stationery & Crafts'
        when p.category = 'Tech' then 'Tech'
        when p.category = 'Toys & Collectibles' then 'Toys & Collectibles'
        when p.category = 'Travel' then 'Travel'
        when p.category = 'Wellness' then 'Wellness'
        else null
      end as category_label,
      round((case
        when pulse.pulse_score is null then
          0.30 * coalesce(p.social_signal,p.viral_score,0) +
          0.25 * coalesce(p.search_signal,p.viral_score,0) +
          0.20 * coalesce(p.creator_signal,p.viral_score,0) +
          0.25 * coalesce(p.momentum_score,p.viral_score,0)
        else
          0.26 * coalesce(p.social_signal,p.viral_score,0) +
          0.22 * coalesce(p.search_signal,p.viral_score,0) +
          0.17 * coalesce(p.creator_signal,p.viral_score,0) +
          0.20 * coalesce(p.momentum_score,p.viral_score,0) +
          0.15 * pulse.pulse_score
      end)::numeric,1) as trend_score,
      coalesce(p.viral_score,0) as viral_score,
      coalesce(p.worth_score,0) as worth_score
    from public.products p
    left join pulse on pulse.product_id = p.id
    where p.is_active = true
      and p.evidence_status = 'verified'
  ), qualified as (
    select * from eligible
    where category_key is not null
      and current_pulse >= 30
      and trend_score >= 60
  ), ranked as (
    select
      q.*,
      row_number() over (
        partition by q.category_key
        order by q.trend_score desc, q.viral_score desc, q.worth_score desc, q.product_id
      )::smallint as rank
    from qualified q
  ), picks as (
    select r.*, prev.rank as previous_rank
    from ranked r
    left join public.viral_weekly_rankings prev
      on prev.week_start = (p_week_start - 7)
     and prev.category_key = r.category_key
     and prev.product_id = r.product_id
    where r.rank <= 3
  )
  insert into public.viral_weekly_rankings(
    week_start,category_key,category_label,rank,product_id,trend_score,
    previous_rank,movement,movement_label,is_new,calculated_at
  )
  select
    p_week_start,
    category_key,
    category_label,
    rank,
    product_id,
    trend_score,
    previous_rank,
    case when previous_rank is null then null else (previous_rank-rank)::smallint end,
    case
      when previous_rank is null then 'FIRST RANK'
      when previous_rank-rank > 0 then '↑ ' || (previous_rank-rank)::text
      when previous_rank-rank < 0 then '↓ ' || abs(previous_rank-rank)::text
      else '—'
    end,
    coalesce((review_published_at >= (p_week_start::timestamp at time zone 'America/Toronto')),false),
    now()
  from picks;

  get diagnostics v_count = row_count;
  return v_count;
end;
$function$;

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
 'weekly_digest',jsonb_build_object(
   'week_start',date_trunc('week',timezone('America/Toronto',now()))::date,
   'last_subject',(SELECT o.subject FROM public.vyrdict_email_outbox o WHERE o.kind='weekly_digest' AND o.status='sent' ORDER BY o.sent_at DESC LIMIT 1),
   'last_sent_at',(SELECT max(o.sent_at) FROM public.vyrdict_email_outbox o WHERE o.kind='weekly_digest' AND o.status='sent'),
   'eligible_this_week',(SELECT count(*) FROM public.vyrdict_newsletter_subscribers s WHERE s.status='active' AND (s.consent_at at time zone 'America/Toronto')<date_trunc('week',timezone('America/Toronto',now()))+interval '12 hours'),
   'sent_this_week',(SELECT count(*) FROM public.vyrdict_email_outbox o WHERE o.kind='weekly_digest' AND o.status='sent' AND o.unique_key LIKE 'weekly-digest:'||to_char(date_trunc('week',timezone('America/Toronto',now()))::date,'YYYY-MM-DD')||':%'),
   'pending_this_week',(SELECT count(*) FROM public.vyrdict_email_outbox o WHERE o.kind='weekly_digest' AND o.status='pending' AND o.unique_key LIKE 'weekly-digest:'||to_char(date_trunc('week',timezone('America/Toronto',now()))::date,'YYYY-MM-DD')||':%'),
   'weekly_issues_sent',(SELECT count(DISTINCT substring(o.unique_key from 'weekly-digest:([0-9]{4}-[0-9]{2}-[0-9]{2}):')) FROM public.vyrdict_email_outbox o WHERE o.kind='weekly_digest' AND o.status='sent'),
   'schedule','Monday 9 AM Toronto with retries through 11 AM',
   'delivery_status','Provider delivery status is checked separately; the database records dispatch success.'
 ),
 'catalog_freshness',(
   SELECT coalesce(jsonb_agg(to_jsonb(f) - 'refreshed_at' ORDER BY
       f.new_verified_7d ASC,f.genuine_trend_signals_7d ASC,f.category),'[]'::jsonb)
   FROM public.vyrdict_category_freshness_daily f
   WHERE f.local_day=(now() at time zone 'America/Toronto')::date
 ),
 'catalog_freshness_summary',(
   SELECT jsonb_build_object(
     'categories_audited',count(*),
     'categories_with_new_scores',count(*) FILTER(WHERE new_verified_7d>0),
     'categories_with_current_signals',count(*) FILTER(WHERE genuine_trend_signals_7d>0),
     'categories_without_new_scores',count(*) FILTER(WHERE new_verified_7d=0),
     'newly_scored_7d',coalesce(sum(new_verified_7d),0),
     'unverified_backlog',coalesce(sum(candidate_backlog),0),
     'retailer_records_overdue_30d',coalesce(sum(retailer_records_overdue_30d),0),
     'last_refreshed_at',max(refreshed_at))
   FROM public.vyrdict_category_freshness_daily
   WHERE local_day=(now() at time zone 'America/Toronto')::date
 ),
 'health',(SELECT j FROM health),
 'definitions',jsonb_build_object(
    'frequent','Anonymous browser with 3+ sessions on at least 2 different days in the past 30 days',
    'visitors','Only browsers with an available anonymous visitor ID; not verified unique people',
    'categories','Category page views, clicks, product page views, product opens and retailer clicks from tracked events. Missing historic page tags are not estimated.',
    'newsletter','Confirmed subscription records across the primary and legacy forms; active excludes unsubscribed in primary'
 )
);
$function$;

CREATE OR REPLACE FUNCTION private.vyrdict_refresh_category_freshness()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_today date := (now() at time zone 'America/Toronto')::date;
        v_rows integer := 0;
begin
 insert into public.vyrdict_category_freshness_daily(
   local_day,category,active_verified,new_verified_7d,new_verified_14d,
   evidence_rechecked_7d,genuine_trend_signals_7d,candidates_discovered_7d,
   candidate_backlog,retailer_records_overdue_30d,latest_published_at,
   latest_verified_at,freshness_status,refreshed_at)
 with categories as (
   select distinct category from public.products where is_active and category is not null
   union select distinct category from public.vyrdict_research_candidates where category is not null
 ), cat as (
   select c.category,
   (select count(*) from public.products p where p.category=c.category and p.is_active and p.evidence_status='verified') active_verified,
   (select count(*) from public.products p where p.category=c.category and p.is_active and p.evidence_status='verified' and p.published_at>=now()-interval '7 days') new_verified_7d,
   (select count(*) from public.products p where p.category=c.category and p.is_active and p.evidence_status='verified' and p.published_at>=now()-interval '14 days') new_verified_14d,
   (select count(*) from public.products p where p.category=c.category and p.is_active and p.evidence_status='verified' and p.last_verified_at>=now()-interval '7 days') evidence_rechecked_7d,
   (select count(distinct tp.product_id) from public.vyrdict_trend_pulses tp join public.products p on p.id=tp.product_id
     where p.category=c.category and p.is_active and p.evidence_status='verified'
       and tp.observed_on>=(now() at time zone 'America/Toronto')::date-7
       and tp.newest_mention_at>=now()-interval '7 days' and tp.mention_count>=1
       and tp.unique_publishers>=1 and tp.pulse_score>=30 and cardinality(tp.source_urls)>=1) genuine_trend_signals_7d,
   (select count(*) from public.vyrdict_research_candidates a where a.category=c.category and a.created_at>=now()-interval '7 days'
       and a.status<>'rejected') candidates_discovered_7d,
   (select count(*) from public.vyrdict_research_candidates a where a.category=c.category
       and a.status in ('queued','researching','ready_to_score') and a.scoring_complete=false) candidate_backlog,
   (select count(*) from public.product_retailers r join public.products p on p.id=r.product_id
     where p.category=c.category and p.is_active and r.is_active and
       (r.observed_at is null or r.observed_at<now()-interval '30 days')) retailer_records_overdue_30d,
   (select max(p.published_at) from public.products p where p.category=c.category and p.is_active) latest_published_at,
   (select max(p.last_verified_at) from public.products p where p.category=c.category and p.is_active) latest_verified_at
   from categories c
 )
 select v_today,category,active_verified,new_verified_7d,new_verified_14d,evidence_rechecked_7d,
        genuine_trend_signals_7d,candidates_discovered_7d,candidate_backlog,retailer_records_overdue_30d,
        latest_published_at,latest_verified_at,
        case when new_verified_7d>0 then 'new_scored_products'
             when genuine_trend_signals_7d>0 then 'current_trend_signal_only'
             when candidates_discovered_7d>0 then 'awaiting_verification'
             else 'no_fresh_verified_product_or_signal' end,now()
 from cat
 on conflict (local_day,category) do update set
   active_verified=excluded.active_verified,
   new_verified_7d=excluded.new_verified_7d,new_verified_14d=excluded.new_verified_14d,
   evidence_rechecked_7d=excluded.evidence_rechecked_7d,
   genuine_trend_signals_7d=excluded.genuine_trend_signals_7d,
   candidates_discovered_7d=excluded.candidates_discovered_7d,
   candidate_backlog=excluded.candidate_backlog,
   retailer_records_overdue_30d=excluded.retailer_records_overdue_30d,
   latest_published_at=excluded.latest_published_at,latest_verified_at=excluded.latest_verified_at,
   freshness_status=excluded.freshness_status,refreshed_at=now();
 get diagnostics v_rows=row_count;
 return jsonb_build_object('date',v_today,'categories',v_rows,'checked_at',now());
end;
$function$;

revoke all on function private.vyrdict_refresh_category_freshness() from public,anon,authenticated;
revoke all on function public.vyrdict_business_tracking_dashboard() from public,anon,authenticated;
grant execute on function public.vyrdict_business_tracking_dashboard() to service_role;
select cron.schedule('vyrdict-category-freshness-snapshot','26 */2 * * *',
  $$select private.vyrdict_refresh_category_freshness();$$);
