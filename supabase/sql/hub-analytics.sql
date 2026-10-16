-- Hub funnel events are private; existing table RLS and grants remain in effect.
alter table public.vyrdict_analytics_events
  add column if not exists event_id text,
  add column if not exists hub_visit_id text,
  add column if not exists hub_click_id text,
  add column if not exists hub_section text,
  add column if not exists hub_is_entry boolean;
alter table public.vyrdict_analytics_events drop constraint vyrdict_analytics_events_event_name_check;
alter table public.vyrdict_analytics_events add constraint vyrdict_analytics_events_event_name_check check (event_name = any(array[
 'page_view','product_open','retailer_click','search','search_results','search_zero','scores_open','score_discovery_open','suggest_open','save_clicked','account_started','account_link_requested','account_signed_in','guest_saves_synced','account_signed_out','category_open','market_switch','rankings_open','correction_open','hub_view','hub_click','hub_destination_view'
]));
alter table public.vyrdict_analytics_events add constraint vyrdict_hub_section_check check (hub_section is null or hub_section in ('products','studio','work','news','instagram','email'));
create unique index if not exists vyrdict_analytics_event_id_idx on public.vyrdict_analytics_events(event_id);
create unique index if not exists vyrdict_hub_click_event_idx on public.vyrdict_analytics_events(hub_click_id,event_name);
create index if not exists vyrdict_hub_visit_idx on public.vyrdict_analytics_events(hub_visit_id,created_at) where hub_visit_id is not null;

create or replace function public.vyrdict_hub_metrics()
returns jsonb language sql stable security invoker set search_path = '' as $$
with clean as materialized (
 select * from public.vyrdict_analytics_events
 where event_name in ('hub_view','hub_click','hub_destination_view')
 and coalesce(path,'') !~* '(nav-health|[?&]qa=|[?&]studio_nav=)'
 and coalesce(event_source,'') !~* 'qa|test'
), periods(label,start_at) as (values
 ('today',date_trunc('day',now() at time zone 'America/Toronto') at time zone 'America/Toronto'),
 ('last7days',now()-interval '7 days')
), views as (
 select p.label,c.* from periods p join clean c on c.created_at >= p.start_at and c.created_at <= now() and c.event_name='hub_view'
), clicks as (
 select distinct v.label,c.* from views v join clean c on c.hub_visit_id=v.hub_visit_id and c.event_name='hub_click' and c.created_at <= now()
), arrivals as (
 select distinct c.label,a.* from clicks c join clean a on a.hub_click_id=c.hub_click_id and a.hub_visit_id=c.hub_visit_id and a.hub_section=c.hub_section and a.event_name='hub_destination_view'
), summaries as (
 select p.label,jsonb_build_object(
 'page_views',count(v.id),'unique_browsers',count(distinct v.visitor_id),'sessions',count(distinct v.session_id),
 'landing_sessions',count(distinct v.session_id) filter(where v.hub_is_entry),
 'hub_visits',count(distinct v.hub_visit_id),
 'visits_continuing',(select count(distinct c.hub_visit_id) from clicks c where c.label=p.label and c.hub_section in ('products','studio','work','news')),
 'visits_without_section_click',count(distinct v.hub_visit_id)-(select count(distinct c.hub_visit_id) from clicks c where c.label=p.label and c.hub_section in ('products','studio','work','news')),
 'missing_visitor_ids',count(v.id) filter(where v.visitor_id is null)) as data
 from periods p left join views v on v.label=p.label group by p.label
), section_names(section,label,sort) as (values
 ('products','Viral Products + Scores',1),('studio','VYRDICT Studio',2),('work','Our Work + Reach',3),('news','VYRDICT News',4),('instagram','Instagram',5),('email','Email',6)
), sections as (
 select p.label,jsonb_agg(jsonb_build_object(
 'section',s.section,'label',s.label,
 'clicks',(select count(*) from clicks c where c.label=p.label and c.hub_section=s.section),
 'unique_clickers',(select count(distinct c.visitor_id) from clicks c where c.label=p.label and c.hub_section=s.section),
 'visits_clicked',(select count(distinct c.hub_visit_id) from clicks c where c.label=p.label and c.hub_section=s.section),
 'visitor_click_rate',round(100.0*(select count(distinct c.visitor_id) from clicks c where c.label=p.label and c.hub_section=s.section)/nullif((select count(distinct v.visitor_id) from views v where v.label=p.label),0),1),
 'confirmed_arrivals',case when s.section in ('instagram','email') then null else (select count(*) from arrivals a where a.label=p.label and a.hub_section=s.section) end
 ) order by s.sort) as data from periods p cross join section_names s group by p.label
), sources as (
 select acquisition_source,count(*) as page_views,count(distinct visitor_id) as unique_browsers from views where label='last7days' group by 1
)
select jsonb_build_object(
 'generated_at',now(),'tracking_started',(select min(created_at) from clean where event_name='hub_view'),
 'today',(select data from summaries where label='today'),
 'last7days',(select data from summaries where label='last7days'),
 'sections_today',(select data from sections where label='today'),
 'sections_7d',(select data from sections where label='last7days'),
 'sources_7d',coalesce((select jsonb_agg(to_jsonb(s) order by page_views desc) from sources s),'[]'::jsonb),
 'note','Unique browsers are anonymous estimates, not verified people. Browser IDs rotate after 30 days; sessions expire after 30 idle minutes. Marked test traffic is excluded. Section rates can overlap. Destination arrivals confirm that a page loaded, not that it was read. Historical hub traffic cannot be recovered.'
);
$$;
revoke all on function public.vyrdict_hub_metrics() from public, anon, authenticated;
grant execute on function public.vyrdict_hub_metrics() to service_role;
