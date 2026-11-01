-- Show price in structured search data only after independently dated retailer validation.
-- The Vercel product page compares observed_at to today; stale prices and
-- unverifiable in-stock claims are omitted. Retailer destination links remain usable.
CREATE OR REPLACE FUNCTION public.vyrdict_seo_product_payload(p_slug text)
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
with p as (
  select id,slug,brand,name,category,subcategory,viral_score,worth_score,verdict,viral_status,viral_summary,product_description,image_url,published_at,last_verified_at,verdict_summary
  from public.products
  where slug = p_slug and is_active = true and evidence_status = 'verified'
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
  'retailers', coalesce((select jsonb_agg(to_jsonb(rt)) from rt),'[]'::jsonb)
) end;
$function$
;
