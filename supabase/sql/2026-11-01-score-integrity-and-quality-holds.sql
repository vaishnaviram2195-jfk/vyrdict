-- VYRDICT scoring integrity and evidence-quality hold. 2026-11-01.
-- Restore only after real evidence is linked and scored; NEVER invent scores
-- or reset review dates simply to make the catalogue appear fresh.
create table if not exists public.vyrdict_product_score_audit (
 product_id bigint primary key references public.products(id) on delete cascade,
 score_state text not null,input_dimensions integer not null default 0,
 verified_source_count integer not null default 0,
 broken_source_refs integer not null default 0,
 formula_consistent boolean not null default false,
 score_last_verified_at timestamptz,
 reviewed_within_14d boolean not null default false,
 audit_at timestamptz not null default now()
);
alter table public.vyrdict_product_score_audit enable row level security;
revoke all on public.vyrdict_product_score_audit from anon,authenticated;
grant select on public.vyrdict_product_score_audit to service_role;
create table if not exists public.vyrdict_product_score_holds (
 product_id bigint primary key references public.products(id) on delete cascade,
 prior_evidence_status text not null,
 hold_reason text not null,
 held_at timestamptz not null default now(),
 released_at timestamptz
);
alter table public.vyrdict_product_score_holds enable row level security;
revoke all on public.vyrdict_product_score_holds from anon,authenticated;
grant select on public.vyrdict_product_score_holds to service_role;
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
 'scoring_integrity',(
    select jsonb_build_object(
      'fully_evidence_linked',count(*) filter(where a.score_state='fully_evidence_linked'),
      'on_quality_hold',count(*) filter(where a.score_state<>'fully_evidence_linked'),
      'reviewed_within_14d',count(*) filter(where a.reviewed_within_14d),
      'last_audit_at',max(a.audit_at),
      'formula_mismatches',count(*) filter(where a.score_state='formula_mismatch')
    ) from public.vyrdict_product_score_audit a
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

CREATE OR REPLACE FUNCTION private.vyrdict_enforce_public_scoring_gate()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare v_publication boolean;
        v_ready jsonb;
        v_inputs int;
        v_sources int;
begin
  v_publication := new.is_active and new.evidence_status='verified'
    and (TG_OP='INSERT' or not coalesce(old.is_active,false)
      or old.evidence_status is distinct from new.evidence_status
      or old.viral_score is distinct from new.viral_score
      or old.worth_score is distinct from new.worth_score);
  if not v_publication then return new; end if;
  if new.viral_score is null or new.worth_score is null
     or new.viral_score not between 0 and 100 or new.worth_score not between 0 and 100 then
    raise exception 'public_score_guard_invalid_scores';
  end if;
  if new.image_url is null or new.image_url !~ '^https?://'
     or coalesce(trim(new.brand),'')=''
     or coalesce(trim(new.name),'')='' then
    raise exception 'public_score_guard_missing_product_identity_or_image';
  end if;
  select count(distinct si.dimension) into v_inputs
  from public.product_score_inputs si
  where si.product_id=new.id and si.is_public and si.score between 0 and 100 and cardinality(si.evidence_ids)>0;
  select count(distinct e.source_url) into v_sources from public.product_evidence e
  where e.product_id=new.id and e.is_public and e.source_url~'^https?://';
  if v_inputs<>11 or v_sources<3 then
    raise exception 'public_score_guard_incomplete_linked_evidence dimensions=% sources=%',v_inputs,v_sources;
  end if;
  v_ready:=public.vyrdict_evidence_readiness(new.id);
  if not coalesce((v_ready->>'ready')::boolean,false) then
    raise exception 'public_score_guard_evidence_readiness_failed';
  end if;
  if new.viral_score <>
      round(0.40*coalesce(new.social_signal,0)+0.35*coalesce(new.search_signal,0)+0.25*coalesce(new.creator_signal,0))::int
     or new.worth_score <> greatest(0,least(100,round(
        0.45*round(0.50*coalesce(new.review_sentiment,0)+0.30*coalesce(new.rating_signal,0)+0.20*coalesce(new.repurchase_signal,0))+
        0.30*round(0.60*coalesce(new.price_value_signal,0)+0.40*coalesce(new.category_value_signal,0))+
        0.15*coalesce(new.momentum_score,0)+
        0.10*round(0.40*coalesce(new.social_signal,0)+0.35*coalesce(new.search_signal,0)+0.25*coalesce(new.creator_signal,0))-
        0.15*round(0.70*coalesce(new.sponsorship_signal,0)+0.30*coalesce(new.controversy_signal,0))
     )))::int then
    raise exception 'public_score_guard_formula_mismatch';
  end if;
  return new;
end;$function$;

CREATE OR REPLACE FUNCTION public.vyrdict_publish_draft_product(p_product_id bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  p public.products%rowtype;
  c public.vyrdict_research_candidates%rowtype;
  verified_at timestamptz := now();
  has_retailer boolean;
  evidence_ready jsonb;
begin
  select * into p from public.products where id = p_product_id for update;
  if not found then raise exception 'draft_not_found'; end if;
  if p.is_active then return jsonb_build_object('ok', true, 'published', true, 'existing', true, 'product_id', p.id); end if;

  select * into c from public.vyrdict_research_candidates where draft_product_id = p.id limit 1;
  if not found then raise exception 'candidate_link_missing'; end if;
  if c.status <> 'approved_for_catalog' then raise exception 'candidate_not_approved'; end if;
  if not c.product_identity_verified then raise exception 'identity_not_verified'; end if;
  if not c.virality_verified then raise exception 'virality_not_verified'; end if;
  if not c.scoring_complete then raise exception 'scoring_not_complete'; end if;
  if coalesce(trim(p.brand),'') = '' then raise exception 'brand_required'; end if;
  if coalesce(trim(p.name),'') = '' then raise exception 'name_required'; end if;
  if coalesce(trim(p.category),'') = '' then raise exception 'category_required'; end if;
  if coalesce(trim(p.product_description),'') = '' then raise exception 'description_required'; end if;
  if coalesce(trim(p.verdict_summary),'') = '' then raise exception 'verdict_summary_required'; end if;
  if coalesce(trim(p.viral_summary),'') = '' then raise exception 'viral_summary_required'; end if;

  evidence_ready := public.vyrdict_evidence_readiness(p.id);
  if not coalesce((evidence_ready->>'ready')::boolean,false) then raise exception 'evidence_not_ready'; end if;

  perform public.recalculate_product_scores(p.id);
  select * into p from public.products where id=p_product_id;
  if p.viral_score is null or p.worth_score is null then raise exception 'scores_required'; end if;

  select exists(select 1 from public.product_retailers r where r.product_id=p.id and r.is_active) into has_retailer;

  insert into public.product_profiles (
    product_id, what_it_does, best_for, key_ingredients, quick_verdict, claim_checks,
    evidence_strength, last_reviewed_at, updated_at, hype_vs_reality
  ) values (
    p.id,
    jsonb_build_object('summary', p.product_description),
    '{}'::text[],
    '{}'::text[],
    jsonb_build_object('headline',p.verdict,'summary',p.verdict_summary,'verdict', p.verdict, 'viral_score', p.viral_score, 'worth_score', p.worth_score),
    '[]'::jsonb,
    coalesce(p.evidence_confidence, evidence_ready->>'confidence', 'medium'),
    verified_at,
    verified_at,
    jsonb_build_object('hype', p.viral_summary, 'reality', p.verdict_summary)
  )
  on conflict (product_id) do update set
    what_it_does = excluded.what_it_does,
    quick_verdict = excluded.quick_verdict,
    evidence_strength = excluded.evidence_strength,
    last_reviewed_at = excluded.last_reviewed_at,
    updated_at = excluded.updated_at,
    hype_vs_reality = excluded.hype_vs_reality;

  update public.products
  set is_active = true,
      evidence_status = 'verified',
      evidence_confidence = evidence_ready->>'confidence',
      score_methodology_version='v2-evidence',
      published_at = coalesce(published_at, verified_at),
      last_verified_at = verified_at,
      next_review_at = verified_at + interval '30 days',
      image_verified_at = case when image_url is not null then verified_at else image_verified_at end,
      retailer_verified_at = case when has_retailer then verified_at else retailer_verified_at end,
      updated_at = verified_at
  where id = p.id;

  return jsonb_build_object('ok', true, 'published', true, 'product_id', p.id, 'has_image', p.image_url is not null, 'has_retailer', has_retailer, 'evidence', evidence_ready);
end;
$function$;

CREATE OR REPLACE FUNCTION private.vyrdict_refresh_score_integrity()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_rows int;
begin
 with prod as (
   select p.*,
   round(0.40*coalesce(p.social_signal,0)+0.35*coalesce(p.search_signal,0)+0.25*coalesce(p.creator_signal,0))::int as expected_viral,
   greatest(0,least(100,round(
     0.45*round(0.50*coalesce(p.review_sentiment,0)+0.30*coalesce(p.rating_signal,0)+0.20*coalesce(p.repurchase_signal,0))+
     0.30*round(0.60*coalesce(p.price_value_signal,0)+0.40*coalesce(p.category_value_signal,0))+
     0.15*coalesce(p.momentum_score,0)+
     0.10*round(0.40*coalesce(p.social_signal,0)+0.35*coalesce(p.search_signal,0)+0.25*coalesce(p.creator_signal,0))-
     0.15*round(0.70*coalesce(p.sponsorship_signal,0)+0.30*coalesce(p.controversy_signal,0))
   )))::int expected_worth
   from public.products p where p.is_active
 ), inputs as (
   select s.product_id,
    count(distinct s.dimension) filter(where s.is_public and s.score between 0 and 100 and cardinality(s.evidence_ids)>0) dims,
    coalesce(sum((
     select count(*) from unnest(coalesce(s.evidence_ids,'{}'::bigint[])) eid
     where not exists(
       select 1 from public.product_evidence ev
       where ev.id=eid and ev.product_id=s.product_id and ev.is_public
         and ev.source_url ~ '^https?://'
     )
    )),0)::int missing_refs,
    count(*) filter(where not s.is_public or cardinality(s.evidence_ids)=0) incomplete_score_rows
   from public.product_score_inputs s
   where s.product_id in(select id from prod)
   group by 1
 ), evidence as(
   select e.product_id,count(distinct e.source_url) filter(where e.is_public and e.source_url ~ '^https?://') sources
   from public.product_evidence e
   where e.product_id in(select id from prod)
   group by 1
 )
 insert into public.vyrdict_product_score_audit (
   product_id,score_state,input_dimensions,verified_source_count,broken_source_refs,
   formula_consistent,score_last_verified_at,reviewed_within_14d,audit_at
 )
 select p.id,
  case when p.viral_score is null or p.worth_score is null or p.viral_score not between 0 and 100 or p.worth_score not between 0 and 100
      then 'invalid_score'
    when coalesce(i.dims,0)<>11 or coalesce(i.missing_refs,0)>0 or coalesce(i.incomplete_score_rows,0)>0 or coalesce(e.sources,0)<3
      then 'evidence_audit_required'
    when p.viral_score<>p.expected_viral or p.worth_score<>p.expected_worth then 'formula_mismatch'
    else 'fully_evidence_linked' end,
   coalesce(i.dims,0),coalesce(e.sources,0),coalesce(i.missing_refs,0),
   p.viral_score=p.expected_viral and p.worth_score=p.expected_worth,
   p.last_verified_at,coalesce(p.last_verified_at>now()-interval '14 days',false),now()
 from prod p left join inputs i on i.product_id=p.id left join evidence e on e.product_id=p.id
 on conflict(product_id) do update set
   score_state=excluded.score_state,input_dimensions=excluded.input_dimensions,
   verified_source_count=excluded.verified_source_count,broken_source_refs=excluded.broken_source_refs,
   formula_consistent=excluded.formula_consistent,score_last_verified_at=excluded.score_last_verified_at,
   reviewed_within_14d=excluded.reviewed_within_14d,audit_at=now();
 get diagnostics v_rows=row_count;
 return jsonb_build_object('audited',v_rows,'audited_at',now(),
  'fully_evidence_linked',(select count(*) from public.vyrdict_product_score_audit where score_state='fully_evidence_linked'),
  'requires_evidence_audit',(select count(*) from public.vyrdict_product_score_audit where score_state='evidence_audit_required'),
  'formula_mismatches',(select count(*) from public.vyrdict_product_score_audit where score_state='formula_mismatch'));
end;$function$;

CREATE OR REPLACE FUNCTION private.vyrdict_release_score_audit_holds()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare v_count int:=0;
begin
 with released as (
   update public.products p set evidence_status='verified', updated_at=now()
   from public.vyrdict_product_score_audit a
   join public.vyrdict_product_score_holds h on h.product_id=a.product_id
   where p.id=a.product_id and h.released_at is null
     and p.is_active and p.evidence_status='provisional'
     and a.score_state='fully_evidence_linked'
   returning p.id
 ), marked as (
   update public.vyrdict_product_score_holds h set released_at=now()
   where h.product_id in(select id from released)
   returning product_id
 ) select count(*) into v_count from marked;
 return jsonb_build_object('reinstated_after_real_evidence',v_count,'checked_at',now());
end;$function$;

CREATE OR REPLACE FUNCTION public.vyrdict_seo_product_payload(p_slug text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
with p as (
  select id,slug,brand,name,category,subcategory,viral_score,worth_score,verdict,viral_status,viral_summary,product_description,image_url,published_at,last_verified_at,verdict_summary
  from public.products
  where slug = p_slug and is_active = true and evidence_status in ('verified','provisional')
  limit 1
), prof as (
  select pp.quick_verdict,pp.what_it_does,pp.best_for,pp.last_reviewed_at,pp.evidence_strength,pp.hype_vs_reality
  from public.product_profiles pp join p on p.id=pp.product_id
  limit 1
), ev as (
  select pe.source_label,pe.source_type,pe.source_url,pe.note,pe.claim_summary,pe.source_publisher,pe.observed_at
  from public.product_evidence pe join p on p.id=pe.product_id
  where pe.is_public = true
  order by pe.observed_at desc
  limit 5
), rt as (
  select pr.retailer_name,pr.retailer_url,pr.price,pr.currency,pr.country_code,pr.is_official,
         pr.affiliate_url,pr.affiliate_network,pr.affiliate_program,pr.affiliate_status,pr.observed_at
  from public.product_retailers pr join p on p.id=pr.product_id
  where pr.is_active = true
  order by pr.is_official desc, pr.observed_at desc nulls last
  limit 3
)
select case when not exists(select 1 from p) then null else jsonb_build_object(
  'product', (select to_jsonb(p) from p),
  'profile', coalesce((select to_jsonb(prof) from prof),'{}'::jsonb),
  'evidence', coalesce((select jsonb_agg(to_jsonb(ev)) from ev),'[]'::jsonb),
  'retailers', coalesce((select jsonb_agg(to_jsonb(rt)) from rt),'[]'::jsonb),
  'score_audit',coalesce((select jsonb_build_object('state',a.score_state,'dimensions',a.input_dimensions,'sources',a.verified_source_count,'audited_at',a.audit_at) from public.vyrdict_product_score_audit a join p on p.id=a.product_id),'{}'::jsonb)
) end;
$function$;

revoke all on function private.vyrdict_refresh_score_integrity() from public,anon,authenticated;
revoke all on function private.vyrdict_enforce_public_scoring_gate() from public,anon,authenticated;
revoke all on function private.vyrdict_release_score_audit_holds() from public,anon,authenticated;
drop trigger if exists trg_vyrdict_public_score_integrity_gate on public.products;
create trigger trg_vyrdict_public_score_integrity_gate before insert or update of is_active,evidence_status,viral_score,worth_score on public.products for each row execute function private.vyrdict_enforce_public_scoring_gate();
select cron.schedule('vyrdict-score-integrity-hourly','18 * * * *', $$select private.vyrdict_refresh_score_integrity();$$);
select cron.schedule('vyrdict-score-hold-release','19 * * * *', $$select private.vyrdict_release_score_audit_holds();$$);
