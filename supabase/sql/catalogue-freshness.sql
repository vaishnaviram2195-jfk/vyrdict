CREATE OR REPLACE FUNCTION private.run_vyrdict_category_freshness_watchdog()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_category text;
  v_signal_at timestamptz;
  v_verified_at timestamptz;
  v_queue_count int;
  v_review_overdue int;
  v_review_total int := 0;
  v_review_categories jsonb := '[]'::jsonb;
  v_stale_categories text[] := '{}'::text[];
  v_stale_count int := 0;
  v_backlog_count int := 0;
  v_discovery_dispatch bigint;
  v_extract_dispatch bigint;
  v_research_dispatch bigint;
  v_verify jsonb;
  v_published int := 0;
  v_collections jsonb;
  v_rankings int := 0;
  v_story jsonb := '{}'::jsonb;
  v_local timestamp := timezone('America/Toronto', now());
  v_story_exists boolean := false;
begin
  foreach v_category in array array[
    'Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Gifts','Hair',
    'Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare',
    'Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'
  ]
  loop
    select max(coalesce(l.last_seen_at,l.published_at,l.first_seen_at))
      into v_signal_at
    from public.vyrdict_trend_leads l
    join public.vyrdict_research_candidates c on c.id=l.candidate_id
    where c.category=v_category
      and c.status<>'rejected'
      and c.verified_image_url is not null
      and l.lead_score>=45;

    select max(p.last_verified_at)
      into v_verified_at
    from public.products p
    where p.category=v_category
      and p.is_active=true
      and p.evidence_status='verified';

    -- A recent trend signal does not mean existing catalogue products were reviewed.
    select count(*) into v_review_overdue
    from public.products p
    where p.category=v_category and p.is_active=true
      and (p.last_verified_at is null or p.next_review_at<=now()
        or (p.next_review_at is null and p.last_verified_at<now()-interval '14 days'));
    v_review_total := v_review_total + v_review_overdue;
    if v_review_overdue>0 then
      v_review_categories := v_review_categories || jsonb_build_array(
        jsonb_build_object('category',v_category,'overdue',v_review_overdue));
      insert into public.vyrdict_pipeline_incidents(
        incident_key,component_type,component_key,incident_type,severity,status,summary,
        occurrence_count,first_seen_at,last_seen_at,resolved_at,metadata,updated_at)
      values(
        'catalog-review-overdue:'||regexp_replace(lower(v_category),'[^a-z0-9]+','-','g'),
        'source',v_category,'catalog_review_overdue','warning','open',
        v_review_overdue::text||' active catalogue products require a verified review in '||v_category||'.',
        1,now(),now(),null,
        jsonb_build_object('category',v_category,'overdue_products',v_review_overdue,
          'latest_verified_at',v_verified_at,'watchdog','category-freshness-v2'),now())
      on conflict(incident_key) do update set status='open',severity='warning',
        summary=excluded.summary,metadata=excluded.metadata,
        occurrence_count=public.vyrdict_pipeline_incidents.occurrence_count+1,
        last_seen_at=now(),resolved_at=null,updated_at=now();
    else
      update public.vyrdict_pipeline_incidents set status='resolved',
        resolved_at=coalesce(resolved_at,now()),last_seen_at=now(),updated_at=now(),
        metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object('overdue_products',0,'resolved_by','category-freshness-v2')
      where incident_key='catalog-review-overdue:'||regexp_replace(lower(v_category),'[^a-z0-9]+','-','g')
        and status='open';
    end if;

    select count(*)
      into v_queue_count
    from public.vyrdict_research_candidates c
    where c.category=v_category
      and c.source_platform='Trend Intelligence'
      and c.status in ('queued','researching','ready_to_score','approved_for_catalog')
      and c.created_at>=now()-interval '14 days';

    v_backlog_count := v_backlog_count + v_queue_count;

    if v_signal_at is null or v_signal_at < now()-interval '7 days' then
      v_stale_count := v_stale_count+1;
      v_stale_categories := array_append(v_stale_categories,v_category);

      insert into public.vyrdict_pipeline_incidents(
        incident_key,component_type,component_key,incident_type,severity,status,summary,
        occurrence_count,first_seen_at,last_seen_at,resolved_at,metadata,updated_at
      )
      values(
        'category-freshness:'||lower(regexp_replace(v_category,'[^a-z0-9]+','-','g')),
        'source',v_category,'category_freshness','warning','open',
        'No qualifying fresh VYRDICT trend signal in the last 7 days for '||v_category||'.',
        1,now(),now(),null,
        jsonb_build_object(
          'category',v_category,
          'latest_signal_at',v_signal_at,
          'latest_verified_at',v_verified_at,
          'queued_recent_candidates',v_queue_count,
          'watchdog','category-freshness-v1'
        ),
        now()
      )
      on conflict (incident_key) do update
      set status='open',
          severity='warning',
          summary=excluded.summary,
          occurrence_count=public.vyrdict_pipeline_incidents.occurrence_count+1,
          last_seen_at=now(),
          resolved_at=null,
          metadata=excluded.metadata,
          updated_at=now();
    else
      update public.vyrdict_pipeline_incidents
      set status='resolved',
          resolved_at=coalesce(resolved_at,now()),
          last_seen_at=now(),
          metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object(
            'latest_signal_at',v_signal_at,
            'latest_verified_at',v_verified_at,
            'resolved_by','category-freshness-v1'
          ),
          updated_at=now()
      where incident_key='category-freshness:'||lower(regexp_replace(v_category,'[^a-z0-9]+','-','g'))
        and status='open';
    end if;
  end loop;

  -- If any category is stale, immediately kick the discovery/extraction chain.
  if v_stale_count>0 then
    begin
      v_discovery_dispatch := private.vyrdict_dispatch_edge_job('vyrdict-trend-discovery');
    exception when others then
      v_discovery_dispatch := null;
    end;
    begin
      v_extract_dispatch := private.vyrdict_dispatch_edge_job('vyrdict-trend-product-extract');
    exception when others then
      v_extract_dispatch := null;
    end;
  end if;

  -- If fresh candidates are waiting, give them an extra balanced research/verification pass.
  if v_backlog_count>0 then
    begin
      v_research_dispatch := private.run_vyrdict_candidate_research_now();
    exception when others then
      v_research_dispatch := null;
    end;
    begin
      v_verify := private.run_vyrdict_candidate_verification_scoring();
    exception when others then
      v_verify := jsonb_build_object('ok',false,'error',sqlerrm);
    end;
  else
    v_verify := jsonb_build_object('ok',true,'checked',0,'reason','no_recent_backlog');
  end if;

  begin
    v_published := private.auto_publish_trend_ready_products();
  exception when others then
    v_published := 0;
  end;

  begin
    v_collections := private.refresh_vyrdict_dynamic_collections();
  exception when others then
    v_collections := jsonb_build_object('ok',false,'error',sqlerrm);
  end;

  begin
    v_rankings := private.refresh_viral_weekly_rankings();
  exception when others then
    v_rankings := 0;
  end;

  -- Story safeguard: from 8am Toronto onward, publish if today's Story is still missing.
  select exists(
    select 1
    from public.vyrdict_stories
    where status='published'
      and is_active=true
      and (published_at at time zone 'America/Toronto')::date=v_local::date
  ) into v_story_exists;

  if extract(hour from v_local)>=8 and not v_story_exists then
    begin
      v_story := private.publish_vyrdict_daily_story();
    exception when others then
      v_story := jsonb_build_object('status','error','error',sqlerrm);
    end;
  else
    v_story := jsonb_build_object(
      'status',case when v_story_exists then 'already_published_today' else 'before_daily_story_window' end,
      'date',v_local::date
    );
  end if;

  return jsonb_build_object(
    'ok',true,
    'checked_at',now(),
    'toronto_time',v_local,
    'stale_category_count',v_stale_count,
    'stale_categories',to_jsonb(v_stale_categories),
    'catalogue_overdue_reviews',v_review_total,
    'catalogue_overdue_categories',v_review_categories,
    'recent_candidate_backlog',v_backlog_count,
    'discovery_dispatch_id',v_discovery_dispatch,
    'extract_dispatch_id',v_extract_dispatch,
    'research_dispatch_id',v_research_dispatch,
    'verification',v_verify,
    'products_auto_published',v_published,
    'collections',v_collections,
    'weekly_rankings_refreshed',v_rankings,
    'story',v_story
  );
end;
$function$


-- Bounded batches can use the existing server-side authenticated dispatcher.
update public.vyrdict_job_registry set timeout_ms=110000,updated_at=now(),
  metadata=coalesce(metadata,'{}'::jsonb)||jsonb_build_object('bounded_batch_fix','2026-10-15','request_budget_ms',110000)
where job_name in ('vyrdict-trend-pulse-refresh','vyrdict-candidate-research');
