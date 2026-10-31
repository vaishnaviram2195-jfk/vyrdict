-- Verified editorial source/product matching guard, 2026-10-31.
-- A trend article must overlap at least two meaningful exact-product tokens
-- before it can become a public VYRDICT story. Suppress unverified hype claims
-- and unrelated publisher article excerpts.
CREATE OR REPLACE FUNCTION private.publish_vyrdict_daily_story()
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path TO 'public', 'private', 'pg_temp'
AS $function$
declare
  v_today date := (now() at time zone 'America/Toronto')::date;
  v_lead record;
  v_story_id bigint;
  v_brand text;
  v_product text;
  v_display text;
  v_source text;
  v_summary text;
  v_headline text;
  v_dek text;
  v_slug text;
  v_category text;
begin
  if exists (
    select 1
    from public.vyrdict_stories
    where status='published'
      and is_active=true
      and (published_at at time zone 'America/Toronto')::date=v_today
  ) then
    return jsonb_build_object('status','already_published_today','date',v_today);
  end if;

  select
    l.id as lead_id,
    l.title,
    l.publisher,
    l.category_label,
    l.canonical_url,
    l.published_at,
    l.first_seen_at,
    l.summary,
    l.lead_score,
    l.buzz_terms,
    c.brand,
    coalesce(nullif(c.exact_product_name,''),nullif(c.product_name,'')) as product_name,
    c.verified_image_url,
    c.category as candidate_category
  into v_lead
  from public.vyrdict_trend_leads l
  join public.vyrdict_research_candidates c on c.id=l.candidate_id
  where coalesce(l.metadata->>'special_collection','')<>'seen-on-screen'
    and coalesce(l.published_at,l.first_seen_at)>=now()-interval '7 days'
    and l.lead_score>=55
    and l.canonical_url ~* '^https?://'
    and l.canonical_url !~* 'news\.google\.com'
    and c.status<>'rejected'
    -- An article must actually name at least two meaningful words from the
    -- exact candidate product; reject generic roundup-to-product mismatches.
    and (
      select count(distinct token)
      from regexp_split_to_table(
        lower(coalesce(nullif(c.exact_product_name,''),c.product_name,'')),
        '[^a-z0-9]+'
      ) token
      where length(token)>=4
        and token not in ('with','from','best','viral','products','collection','original','edition','small','large','women','2026','2025','just','that','this','daily','favorite','really','until','tried','about','into','look','shop','very','item','pack')
        and lower(l.title) like '%'||token||'%'
    )>=2
    -- Keep obvious product types out of unrelated categories.
    and not (
      c.category='Fashion' and
      l.title ~* '(storybook|advent calendar|face cleanser|foam cleanser|blender|skin care|nail renewal)'
    )
    and not (
      c.category in ('Perfume','Skincare','Makeup') and
      l.title ~* '(blender|lawn mower|storybooks?|pet bed|sneaker)'
    )
    and c.brand is not null
    and length(trim(c.brand))>=2
    and coalesce(nullif(c.exact_product_name,''),nullif(c.product_name,'')) is not null
    and length(coalesce(nullif(c.exact_product_name,''),nullif(c.product_name,''))) between 3 and 140
    and c.verified_image_url ~* '^https?://'
    and l.title !~* '(^|[[:space:]])[0-9]{1,3}[[:space:]]+(products|items|things|ways|ideas|deals|best)'
    and l.title !~* '(prime day|gift guide|shopping guide|sale|deals|cancer|medical|disease|sex|sexual|gooning|election|politic|murder|death)'
    and coalesce(c.category,l.category_label,'') in (
      'Beauty','Beauty Tech','Makeup','Skincare','Hair','Perfume','Fashion','Shoes',
      'Home','Kitchen','Tech','Toys & Collectibles','Food & Drinks','Travel',
      'Fitness','Stationery & Crafts','Kids & Baby','Pets','Wellness','Books','Gifts'
    )
    and not exists (
      select 1
      from public.vyrdict_stories s
      where s.status='published'
        and (s.source_url=l.canonical_url or lower(s.headline)=lower(l.title))
    )
  order by
    (coalesce(l.published_at,l.first_seen_at)>=now()-interval '48 hours') desc,
    l.lead_score desc,
    coalesce(l.published_at,l.first_seen_at) desc
  limit 1;

  if not found then
    return jsonb_build_object('status','no_eligible_fresh_story','date',v_today);
  end if;

  v_brand := replace(replace(trim(v_lead.brand),'&amp;','&'),'&#39;',chr(39));
  v_product := replace(replace(trim(v_lead.product_name),'&amp;','&'),'&#39;',chr(39));

  if lower(v_product) like lower(v_brand)||'%' then
    v_display := v_product;
  else
    v_display := trim(v_brand||' '||v_product);
  end if;

  v_source := case lower(coalesce(v_lead.publisher,''))
    when 'goodhousekeeping' then 'Good Housekeeping'
    when 'good housekeeping' then 'Good Housekeeping'
    when 'elle' then 'ELLE'
    when 'vogue' then 'Vogue'
    when 'buzzfeed' then 'BuzzFeed'
    when 'cosmopolitan' then 'Cosmopolitan'
    when 'allure' then 'Allure'
    when 'esquire' then 'Esquire'
    when 'new york post' then 'New York Post'
    else initcap(replace(coalesce(nullif(v_lead.publisher,''),'Source'),'-',' '))
  end;

  v_summary := regexp_replace(
    replace(replace(replace(replace(coalesce(v_lead.summary,''),'&nbsp;',' '),'&amp;','&'),'&quot;','"'),'&#39;',chr(39)),
    '<[^>]+>',' ','g'
  );
  v_summary := trim(regexp_replace(v_summary,'[[:space:]]+',' ','g'));

  v_headline := left('New coverage: '||v_display,180);

    v_dek := 'Fresh coverage from '||v_source||' is pushing '||v_display||' into the conversation.';
  if length(v_summary)>=18
    and (position(lower(v_brand) in lower(v_summary))>0
      or (select count(distinct t) from regexp_split_to_table(lower(v_product),'[^a-z0-9]+') t
          where length(t)>=5 and position(t in lower(v_summary))>0)>=2)
  then
    v_dek := v_dek||' '||left(v_summary,240);
    if right(v_dek,1) not in ('.','!','?') then v_dek:=v_dek||'.'; end if;
  end if;

  if v_lead.buzz_terms @> array['launch']::text[] then
    v_dek := v_dek||' VYRDICT is tracking the launch momentum while keeping virality separate from Worth.';
  elsif v_lead.buzz_terms @> array['sold out']::text[] then
    v_dek := v_dek||' VYRDICT is tracking the sellout signal while keeping attention separate from product value.';
  else
    v_dek := v_dek||' VYRDICT is tracking the momentum as a trend signal while keeping virality separate from Worth.';
  end if;

  v_category := coalesce(nullif(v_lead.candidate_category,''),nullif(v_lead.category_label,''),'Trend')||' · Trend Watch';

  v_slug := trim(both '-' from regexp_replace(
    lower(v_brand||'-'||v_product||'-'||to_char(v_today,'YYYY-MM-DD')),
    '[^a-z0-9]+','-','g'
  ));
  v_slug := left(v_slug,125)||'-'||v_lead.lead_id::text;

  insert into public.vyrdict_stories
    (slug,headline,dek,category,image_url,image_alt,source_label,source_url,
     instagram_url,is_active,status,published_at,created_at,updated_at,is_featured)
  values
    (v_slug,v_headline,left(v_dek,600),v_category,v_lead.verified_image_url,
     left(v_display,220),v_source,v_lead.canonical_url,
     null,true,'published',now(),now(),now(),true)
  returning id into v_story_id;

  return jsonb_build_object(
    'status','published','date',v_today,'story_id',v_story_id,
    'lead_id',v_lead.lead_id,'slug',v_slug,'headline',v_headline
  );
end
$function$
;

-- Correct and moderate known mismatched article/category pairs.
UPDATE public.vyrdict_stories SET status='archived',is_active=false,updated_at=now()
WHERE source_url='https://www.elle.com/beauty/makeup-skin-care/a74273181/best-espresso-martini-nails-designs/'
AND headline ILIKE '%Kerasal%';
UPDATE public.vyrdict_stories SET category='Kids & Baby · Trend Watch',
 headline='Disney’s Storybook Collection Advent Calendar returns for 2026',
 dek='Good Housekeeping reports that the Igloo Books calendar contains 24 short Disney and Pixar storybooks for families with children aged 4 and up. The article describes the 2026 edition and its stock availability; VYRDICT has not assigned this product a Worth Score.',
 updated_at=now()
WHERE source_url='https://www.goodhousekeeping.com/holidays/christmas-ideas/a74284681/disney-storybook-advent-calendar-2026/'
AND headline ILIKE '%Storybook%';
UPDATE public.vyrdict_stories SET headline='Medicube Zero Foam Cleanser gets a new month-long editor review',
 dek='A Cosmopolitan beauty editor published a hands-on review on October 30 after using Medicube Zero Foam Cleanser for a month. The review describes a deep-clean feeling without tightness and a better cleansing routine. This is editorial review coverage, not an independently verified VYRDICT Worth Score.',
 updated_at=now()
WHERE source_url='https://www.cosmopolitan.com/style-beauty/beauty/a74286336/medicube-zero-foam-cleanser-review/'
AND headline ILIKE '%Medicube%';
