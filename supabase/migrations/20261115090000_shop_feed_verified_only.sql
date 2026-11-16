-- VYRDICT Shop the Feed: a fully scored, evidence-backed product-only source.
-- Readable only by the service role; browser requests go through the public,
-- read-only Edge Function that exposes only safe catalog fields.
CREATE OR REPLACE VIEW public.vyrdict_shop_verified_products
WITH (security_invoker = true)
AS
SELECT
  p.id,
  p.slug,
  p.brand,
  p.name,
  p.category,
  p.viral_score,
  p.worth_score,
  p.verdict,
  p.image_url,
  p.published_at,
  p.last_verified_at,
  (a.readiness->>'source_domains')::integer AS evidence_source_domains,
  (a.readiness->>'url_sources')::integer AS evidence_url_sources,
  (a.readiness->>'linked_score_inputs')::integer AS linked_score_inputs
FROM public.products p
CROSS JOIN LATERAL (SELECT public.vyrdict_evidence_readiness(p.id) AS readiness) a
WHERE p.is_active = true
  AND p.evidence_status = 'verified'
  AND p.evidence_confidence = 'high'
  AND p.score_methodology_version = 'v2-evidence'
  AND p.viral_score BETWEEN 0 AND 100
  AND p.worth_score BETWEEN 0 AND 100
  AND p.image_url ~ '^https://'
  AND p.last_verified_at IS NOT NULL
  AND COALESCE((a.readiness->>'ready')::boolean,false) = true
  AND (a.readiness->>'confidence') = 'high'
  AND COALESCE((a.readiness->>'linked_score_inputs')::integer,0) = 11
  AND EXISTS (
    SELECT 1 FROM public.product_retailers r
    WHERE r.product_id=p.id AND r.is_active = true
      AND r.retailer_url ~ '^https://'
  );
REVOKE ALL ON public.vyrdict_shop_verified_products FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.vyrdict_shop_verified_products TO service_role;
COMMENT ON VIEW public.vyrdict_shop_verified_products IS
'Service-only verified Shop the Feed catalog: high-confidence evidence, 11 linked scoring inputs, real HTTPS image and active retailer.';


-- Only show an Instagram/Shop the Feed edit when EVERY linked product passes.
CREATE OR REPLACE VIEW public.vyrdict_shop_feed_verified_edits
WITH (security_invoker = true)
AS
SELECT
 e.id,e.slug,e.title,e.dek,e.category,e.published_at,e.instagram_url,
 ARRAY_AGG(ep.product_id ORDER BY ep.sort_order,ep.product_id) AS product_ids,
 COUNT(ep.product_id)::integer AS product_count,
 (ARRAY_AGG(vp.image_url ORDER BY ep.sort_order,ep.product_id))[1] AS cover_image
FROM public.vyrdict_social_edits e
JOIN public.vyrdict_social_edit_products ep ON ep.edit_id=e.id
LEFT JOIN public.vyrdict_shop_verified_products vp ON vp.id=ep.product_id
WHERE e.status='published' AND e.published_at <= now()
GROUP BY e.id,e.slug,e.title,e.dek,e.category,e.published_at,e.instagram_url
HAVING COUNT(ep.product_id)>0 AND COUNT(ep.product_id)=COUNT(vp.id);
REVOKE ALL ON public.vyrdict_shop_feed_verified_edits FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.vyrdict_shop_feed_verified_edits TO service_role;
COMMENT ON VIEW public.vyrdict_shop_feed_verified_edits IS
'Only fully evidence-verified Instagram edits: an edit is exposed if ALL linked products qualify in the verified-product view.';
