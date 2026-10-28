-- VYRDICT weekly newsletter reliability (October 28, 2026)
-- Sources: Supabase curated stories + verified, scored catalogue products.
-- Monday 09:00 Toronto automatic queue, retries at 10:00 and 11:00.
-- Sending: existing email outbox and Resend dispatcher; unique_key avoids duplicates.
-- Silent missing/partial sends raise a pipeline incident through hourly health audit.
-- A news-only or honest verification-status digest is the fallback when no new products qualify.
-- The private Command Center shows current-week send counts.

CREATE OR REPLACE FUNCTION public.vyrdict_weekly_digest_payload_products()
 RETURNS TABLE(subject text, text_body text, html_body text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  local_now timestamp := timezone('America/Toronto',now());
  r record;
  n integer := 0;
  trending_html text := '';
  worth_html text := '';
  caution_html text := '';
  trending_text text := '';
  worth_text text := '';
  caution_text text := '';
  used_ids bigint[] := '{}';
  b text; nm text; cat text; vd text; img text; url text;
  freshness text;
begin
  /* TRENDING NOW: prioritize genuinely fresh catalog additions and suppress
     products already used in a sent weekly digest during the previous 28 days. */
  for r in
    with ev as (
      select product_id,
             count(*) filter (where coalesce(observed_at,verified_at)>=now()-interval '14 days') ev14, count(*) evidence_total, count(distinct lower(split_part(regexp_replace(source_url,'^https?://(www\\.)?','','i'),'/',1))) filter(where source_url ~ '^https?://') evidence_domains,
             count(distinct lower(split_part(regexp_replace(source_url,'^https?://(www\\.)?','','i'),'/',1)))
               filter (where coalesce(observed_at,verified_at)>=now()-interval '14 days' and source_url is not null) domains14
      from public.product_evidence
      where coalesce(is_public,true)=true
      group by product_id
    ), base as (
      select prod.*,coalesce(ev.ev14,0) ev14,coalesce(ev.domains14,0) domains14,
             coalesce(prod.published_at,prod.created_at) fresh_at
      from public.products prod
      join ev on ev.product_id=prod.id
      where prod.is_active=true
        and prod.evidence_status='verified'
        and prod.last_verified_at>=now()-interval '60 days'
        and coalesce(prod.published_at,prod.created_at)>=now()-interval '45 days'
        and prod.viral_score>=55
        and coalesce(prod.momentum_score,0)>=0
        and ev.evidence_total>=1 and ev.evidence_domains>=1
        and prod.image_url is not null
        and not exists (
          select 1 from public.vyrdict_email_outbox o
          where o.kind='weekly_digest' and o.status='sent'
            and o.sent_at>=now()-interval '28 days'
            and (
              coalesce(o.html_body,'') like '%/product/'||prod.slug||'/%'
              or coalesce(o.text_body,'') ilike '%'||prod.name||'%'
            )
        )
    ), ranked as (
      select base.*,row_number() over(
        partition by category
        order by fresh_at desc,viral_score desc,id desc
      ) rn
      from base
    )
    select * from ranked
    where rn=1
    order by fresh_at desc,viral_score desc
    limit 5
  loop
    n:=n+1; used_ids:=array_append(used_ids,r.id);
    b:=replace(replace(replace(coalesce(r.brand,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    nm:=replace(replace(replace(coalesce(r.name,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    cat:=replace(replace(replace(coalesce(r.category,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    img:=replace(replace(coalesce(r.image_url,''),'&','&amp;'),'"','&quot;');
    url:='https://vyrdict.com/product/'||r.slug||'/';
    freshness:=case
      when r.fresh_at>=now()-interval '3 days' then 'NEW THIS WEEK'
      else 'VERIFIED PICK'
    end;
    trending_html:=trending_html||
      '<tr><td style="padding:18px 0;border-top:'||case when n=1 then '0' else '1px solid #c7d0c0' end||';">'
      ||'<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
      ||'<td width="118" valign="top" style="width:118px;padding-right:16px;"><a href="'||url||'"><img src="'||img||'" width="118" height="118" border="0" alt="'||b||' '||nm||'" style="width:118px;height:118px;object-fit:contain;display:block;background:#fffdf9;"></a></td>'
      ||'<td valign="middle"><p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.2px;text-transform:uppercase;color:#65705d;">'||freshness||' · '||cat||'</p>'
      ||'<p style="margin:0 0 7px;font:19px/23px Georgia,serif;color:#171511;">'||b||' '||nm||'</p>'
      ||'<p style="margin:0 0 9px;font:11px/15px Arial;color:#625d57;">Viral '||r.viral_score||' · Worth '||r.worth_score||'</p>'
      ||'<p style="margin:0;font:900 9px/12px Arial;text-transform:uppercase;"><a href="'||url||'" style="color:#171511;text-decoration:none;">SEE THE VERDICT →</a></p></td></tr></table></td></tr>';
    trending_text:=trending_text||case when trending_text<>'' then E'\n' else '' end||b||' '||nm||' — Viral '||r.viral_score||', Worth '||r.worth_score;
  end loop;

  /* WORTH IT: still fresh, but optimized for value. */
  n:=0;
  for r in
    with ev as (
      select product_id,
             count(*) filter (where coalesce(observed_at,verified_at)>=now()-interval '21 days') ev21,
             count(distinct lower(split_part(regexp_replace(source_url,'^https?://(www\\.)?','','i'),'/',1)))
               filter (where coalesce(observed_at,verified_at)>=now()-interval '21 days' and source_url is not null) domains21
      from public.product_evidence
      where coalesce(is_public,true)=true
      group by product_id
    ), base as (
      select prod.*,coalesce(prod.published_at,prod.created_at) fresh_at
      from public.products prod join ev on ev.product_id=prod.id
      where prod.is_active=true
        and prod.evidence_status='verified'
        and prod.last_verified_at>=now()-interval '21 days'
        and coalesce(prod.published_at,prod.created_at)>=now()-interval '14 days'
        and prod.worth_score>=85
        and prod.viral_score>=75
        and ev.ev21>=1 and ev.domains21>=1
        and prod.image_url is not null
        and not (prod.id=any(used_ids))
        and not exists (
          select 1 from public.vyrdict_email_outbox o
          where o.kind='weekly_digest' and o.status='sent'
            and o.sent_at>=now()-interval '28 days'
            and (
              coalesce(o.html_body,'') like '%/product/'||prod.slug||'/%'
              or coalesce(o.text_body,'') ilike '%'||prod.name||'%'
            )
        )
    ), ranked as (
      select base.*,row_number() over(partition by category order by worth_score desc,viral_score desc,fresh_at desc,id desc) rn
      from base
    )
    select * from ranked where rn=1
    order by worth_score desc,viral_score desc,fresh_at desc
    limit 3
  loop
    n:=n+1; used_ids:=array_append(used_ids,r.id);
    b:=replace(replace(replace(coalesce(r.brand,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    nm:=replace(replace(replace(coalesce(r.name,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    cat:=replace(replace(replace(coalesce(r.category,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    vd:=replace(replace(replace(coalesce(r.verdict,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    img:=replace(replace(coalesce(r.image_url,''),'&','&amp;'),'"','&quot;');
    url:='https://vyrdict.com/product/'||r.slug||'/';
    worth_html:=worth_html||'<tr><td style="padding:17px 0;border-top:'||case when n=1 then '0' else '1px solid #d5ccdb' end||';"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="108" valign="top" style="width:108px;padding-right:16px;"><a href="'||url||'"><img src="'||img||'" width="108" height="108" border="0" alt="'||b||' '||nm||'" style="width:108px;height:108px;object-fit:contain;display:block;background:#fffdf9;"></a></td><td valign="middle"><p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.1px;text-transform:uppercase;color:#73647d;">'||cat||' · WORTH '||r.worth_score||'</p><p style="margin:0 0 7px;font:19px/23px Georgia,serif;color:#171511;">'||b||' '||nm||'</p><p style="margin:0;font:900 9px/12px Arial;text-transform:uppercase;"><a href="'||url||'" style="color:#171511;text-decoration:none;">SEE WHY IT’S WORTH IT →</a></p></td></tr></table></td></tr>';
    worth_text:=worth_text||case when worth_text<>'' then E'\n' else '' end||b||' '||nm||' — Worth '||r.worth_score||' ('||vd||')';
  end loop;

  /* THINK TWICE: only include if there is a recent, genuinely relevant caution pick. */
  n:=0;
  for r in
    with ev as (
      select product_id,count(*) filter (where coalesce(observed_at,verified_at)>=now()-interval '21 days') ev21
      from public.product_evidence where coalesce(is_public,true)=true group by product_id
    )
    select prod.*,coalesce(prod.published_at,prod.created_at) fresh_at
    from public.products prod join ev on ev.product_id=prod.id
    where prod.is_active=true
      and prod.evidence_status='verified'
      and prod.last_verified_at>=now()-interval '21 days'
      and coalesce(prod.published_at,prod.created_at)>=now()-interval '21 days'
      and prod.viral_score>=75
      and (prod.verdict in ('Skip','Overhyped','Mixed') or prod.worth_score<70)
      and ev.ev21>=1
      and prod.image_url is not null
      and not (prod.id=any(used_ids))
      and not exists (
        select 1 from public.vyrdict_email_outbox o
        where o.kind='weekly_digest' and o.status='sent'
          and o.sent_at>=now()-interval '28 days'
          and (
            coalesce(o.html_body,'') like '%/product/'||prod.slug||'/%'
            or coalesce(o.text_body,'') ilike '%'||prod.name||'%'
          )
      )
    order by fresh_at desc,prod.viral_score desc,prod.worth_score asc
    limit 2
  loop
    n:=n+1;
    b:=replace(replace(replace(coalesce(r.brand,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    nm:=replace(replace(replace(coalesce(r.name,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    cat:=replace(replace(replace(coalesce(r.category,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    vd:=replace(replace(replace(coalesce(r.verdict,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    img:=replace(replace(coalesce(r.image_url,''),'&','&amp;'),'"','&quot;');
    url:='https://vyrdict.com/product/'||r.slug||'/';
    caution_html:=caution_html||'<tr><td style="padding:17px 0;border-top:'||case when n=1 then '0' else '1px solid #ddc7cc' end||';"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td width="108" valign="top" style="width:108px;padding-right:16px;"><a href="'||url||'"><img src="'||img||'" width="108" height="108" border="0" alt="'||b||' '||nm||'" style="width:108px;height:108px;object-fit:contain;display:block;background:#fffdf9;"></a></td><td valign="middle"><p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.1px;text-transform:uppercase;color:#8a6772;">'||cat||' · VIRAL '||r.viral_score||'</p><p style="margin:0 0 7px;font:19px/23px Georgia,serif;color:#171511;">'||b||' '||nm||'</p><p style="margin:0;font:900 9px/12px Arial;text-transform:uppercase;"><a href="'||url||'" style="color:#171511;text-decoration:none;">READ BEFORE YOU BUY →</a></p></td></tr></table></td></tr>';
    caution_text:=caution_text||case when caution_text<>'' then E'\n' else '' end||b||' '||nm||' — Viral '||r.viral_score||', Worth '||r.worth_score||' ('||vd||')';
  end loop;

  if trending_html='' then return; end if;

  subject:='Weekly VYRDICT — '||to_char(date_trunc('week',local_now),'Mon FMDD');
  text_body:='WEEKLY VYRDICT'||E'\n\n'||'The internet moved fast. We edited it down.'||E'\n\n'||'THE VERIFIED EDIT'||E'\n'||trending_text||E'\n\n'
    ||case when worth_text<>'' then 'ACTUALLY WORTH THE HYPE'||E'\n'||worth_text||E'\n\n' else '' end
    ||case when caution_text<>'' then 'VIRAL, BUT THINK TWICE'||E'\n'||caution_text||E'\n\n' else '' end
    ||'Explore VYRDICT: https://vyrdict.com/'||E'\n\n'||'Unsubscribe: {{UNSUBSCRIBE_URL}}';

  html_body:='<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head><body style="margin:0;background:#f4efe9;"><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4efe9"><tr><td align="center" style="padding:22px 12px 28px;"><table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#fffdf9" style="width:100%;max-width:600px;background:#fffdf9;border:1px solid #ded5cd;">'
    ||'<tr><td style="padding:27px 34px 22px;"><table width="100%"><tr><td><p style="margin:0;font:950 27px/30px Arial;letter-spacing:-1.5px;color:#171511;">VYRDICT<span style="color:#d94d73;">.</span></p></td><td align="right"><p style="margin:0;font:900 9px/12px Arial;letter-spacing:1.2px;text-transform:uppercase;color:#756f68;">WEEKLY EDIT<br>'||to_char(local_now,'Mon FMDD, YYYY')||'</p></td></tr></table></td></tr>'
    ||'<tr><td bgcolor="#eadde1" style="padding:34px;background:#eadde1;"><p style="margin:0 0 10px;font:900 9px/12px Arial;letter-spacing:1.6px;text-transform:uppercase;color:#7a5561;">THE INTERNET, EDITED</p><p style="margin:0 0 13px;font:38px/41px Georgia,serif;letter-spacing:-1px;color:#171511;">What’s actually new<br>this week.</p><p style="margin:0;font:13px/20px Arial;color:#5f5658;">Verified product reviews and the cultural stories worth your attention.</p></td></tr>'
    ||'<tr><td bgcolor="#dfe6db" style="padding:30px 34px 22px;background:#dfe6db;"><p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.6px;text-transform:uppercase;color:#65705d;">01 · THE VERIFIED EDIT</p><p style="margin:0 0 12px;font:29px/33px Georgia,serif;color:#171511;">This week’s verified picks.</p><table width="100%" cellpadding="0" cellspacing="0" border="0">'||trending_html||'</table></td></tr>'
    ||case when worth_html<>'' then '<tr><td bgcolor="#eee8f3" style="padding:30px 34px 22px;background:#eee8f3;"><p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.6px;text-transform:uppercase;color:#73647d;">02 · ACTUALLY WORTH THE HYPE</p><p style="margin:0 0 12px;font:29px/33px Georgia,serif;color:#171511;">Fresh finds worth your money.</p><table width="100%" cellpadding="0" cellspacing="0" border="0">'||worth_html||'</table></td></tr>' else '' end
    ||case when caution_html<>'' then '<tr><td bgcolor="#f0dfe2" style="padding:30px 34px 22px;background:#f0dfe2;"><p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.6px;text-transform:uppercase;color:#8a6772;">03 · VIRAL, BUT THINK TWICE</p><p style="margin:0 0 12px;font:29px/33px Georgia,serif;color:#171511;">New hype, weaker value.</p><table width="100%" cellpadding="0" cellspacing="0" border="0">'||caution_html||'</table></td></tr>' else '' end
    ||'<tr><td align="center" style="padding:30px 34px;"><p style="margin:0 0 16px;font:23px/27px Georgia,serif;color:#171511;">Everything going viral.<br>One verdict.</p><a href="https://vyrdict.com/" style="display:inline-block;background:#171511;color:#fff;text-decoration:none;padding:13px 22px;border-radius:999px;font:900 10px/13px Arial;letter-spacing:.7px;text-transform:uppercase;">EXPLORE THIS WEEK →</a></td></tr>'
    ||'<tr><td bgcolor="#f7f2ed" style="padding:20px 34px 24px;background:#f7f2ed;border-top:1px solid #e1d8d0;"><p style="margin:0 0 6px;font:10px/16px Arial;color:#756f68;">You subscribed to Weekly VYRDICT.</p><p style="margin:0;font:10px/16px Arial;color:#756f68;"><a href="{{UNSUBSCRIBE_URL}}" style="color:#756f68;text-decoration:underline;">Unsubscribe</a> anytime.</p></td></tr>'
    ||'</table></td></tr></table></body></html>';

  return next;
end;
$function$;

CREATE OR REPLACE FUNCTION public.vyrdict_weekly_digest_news_section()
 RETURNS TABLE(news_text text, news_html text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record;
  n integer := 0;
  h text := '';
  t text := '';
  headline_safe text;
  dek_safe text;
  category_safe text;
  source_safe text;
  link_url text;
begin
  for r in
    select s.*
    from public.vyrdict_stories s
    where coalesce(s.is_active,true)=true
      and s.status='published'
      and coalesce(s.published_at,s.created_at)>=now()-interval '14 days'
      and s.headline !~* '(just hit the trend radar|is having a viral moment|just landed on vyrdict|is turning into a sellout story)' 
      and length(coalesce(s.dek,''))>=60
      and coalesce(s.source_url,'') ~ '^https://' 
      and not exists (
        select 1
        from public.vyrdict_email_outbox o
        where o.kind='weekly_digest'
          and o.status='sent'
          and o.sent_at>=now()-interval '21 days'
          and coalesce(o.text_body,'') ilike '%'||s.headline||'%'
      )
    order by coalesce(s.is_featured,false) desc,
             coalesce(s.published_at,s.created_at) desc,
             s.id desc
    limit 3
  loop
    n := n + 1;
    headline_safe := replace(replace(replace(coalesce(r.headline,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    dek_safe := replace(replace(replace(coalesce(r.dek,''),'&','&amp;'),'<','&lt;'),'>','&gt;');
    category_safe := replace(replace(replace(coalesce(r.category,'Viral News'),'&','&amp;'),'<','&lt;'),'>','&gt;');
    source_safe := replace(replace(replace(coalesce(r.source_label,'Source'),'&','&amp;'),'<','&lt;'),'>','&gt;');
    link_url := coalesce(nullif(r.source_url,''),nullif(r.instagram_url,''),'https://vyrdict.com/#culture');

    h := h ||
      '<tr><td style="padding:18px 0;border-top:'||case when n=1 then '0' else '1px solid #decfbe' end||';">'
      ||'<p style="margin:0 0 6px;font:900 9px/12px Arial;letter-spacing:1.2px;text-transform:uppercase;color:#86664f;">0'||n||' · '||category_safe||'</p>'
      ||'<p style="margin:0 0 8px;font:21px/25px Georgia,serif;color:#171511;">'||headline_safe||'</p>'
      ||case when dek_safe<>'' then '<p style="margin:0 0 10px;font:12px/18px Arial;color:#625d57;">'||case when length(dek_safe)>240 then left(dek_safe,237)||'…' else dek_safe end||'</p>' else '' end
      ||'<p style="margin:0;font:900 9px/12px Arial;text-transform:uppercase;"><a href="'||replace(replace(link_url,'&','&amp;'),'"','&quot;')||'" style="color:#171511;text-decoration:none;">READ THE UPDATE →</a><span style="color:#8d8379;font-weight:400;text-transform:none;"> &nbsp;·&nbsp; '||source_safe||'</span></p>'
      ||'</td></tr>';

    t := t || case when t<>'' then E'\n\n' else '' end
      || n || '. ' || coalesce(r.headline,'')
      || case when coalesce(r.dek,'')<>'' then E'\n' || case when length(r.dek)>240 then left(r.dek,237)||'…' else r.dek end else '' end
      || E'\n' || link_url;
  end loop;

  if h='' then return; end if;

  news_text := t;
  news_html := '<tr><td bgcolor="#f3e7d8" style="padding:30px 34px 22px;background:#f3e7d8;">'
    ||'<p style="margin:0 0 5px;font:900 9px/12px Arial;letter-spacing:1.6px;text-transform:uppercase;color:#86664f;">01 · VIRAL NEWS</p>'
    ||'<p style="margin:0 0 8px;font:29px/33px Georgia,serif;color:#171511;">The three stories everyone’s talking about.</p>'
    ||'<p style="margin:0 0 13px;font:12px/18px Arial;color:#625d57;">The freshest launches, collabs, celebrity moments and internet culture worth knowing this week.</p>'
    ||'<table width="100%" cellpadding="0" cellspacing="0" border="0">'||h||'</table></td></tr>';
  return next;
end;
$function$;

CREATE OR REPLACE FUNCTION public.vyrdict_weekly_digest_payload()
 RETURNS TABLE(subject text, text_body text, html_body text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  base record;
  news record;
  txt text;
  html text;
begin
  select * into base from public.vyrdict_weekly_digest_payload_products() limit 1;
  if base.subject is null then
    -- Never silently skip a scheduled weekly digest when no new products pass.
    -- Prefer independently linked editorial updates; otherwise state the
    -- absence of new verified picks transparently without invented scores.
    select * into news from public.vyrdict_weekly_digest_news_section() limit 1;
    subject := 'Weekly VYRDICT — '||to_char(date_trunc('week',timezone('America/Toronto',now())),'Mon FMDD');
    txt := 'WEEKLY VYRDICT'||E'\n\n'||'The internet moved fast. We edited it down.'||E'\n\n'
       ||case when coalesce(news.news_text,'')<>'' then 'VIRAL NEWS'||E'\n'||news.news_text||E'\n\n'
                else 'This week, no additional new releases cleared our full evidence and scoring checks. We would rather be accurate than invent a score.'||E'\n\n' end
       ||'Explore evidence-verified VYRDICT products: https://vyrdict.com/collection/viral-right-now/'||E'\n\n'
       ||'Unsubscribe: {{UNSUBSCRIBE_URL}}';
    html := '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
       ||'<body style="background:#f4efe9;margin:0;"><table width="100%" bgcolor="#f4efe9" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:26px 12px;">'
       ||'<table width="600" cellpadding="0" cellspacing="0" bgcolor="#fffdf9" style="width:100%;max-width:600px;border:1px solid #ded5cd;">'
       ||'<tr><td style="padding:28px 34px;"><div style="font:900 27px Arial;color:#171511;letter-spacing:-1px;">VYRDICT<span style="color:#d94d73;">.</span></div>'
       ||'<p style="font:900 10px Arial;letter-spacing:1.3px;color:#776a61;text-transform:uppercase;">WEEKLY EDIT · '
       ||to_char(date_trunc('week',timezone('America/Toronto',now())),'Mon FMDD, YYYY')||'</p>'
       ||'<h1 style="font:34px/39px Georgia,serif;margin:14px 0;color:#171511;">The internet, edited.</h1>'
       ||'<p style="font:13px/20px Arial;color:#655e58;">Our coverage never depends on inventing Viral or Worth scores.</p></td></tr>'
       ||coalesce(news.news_html,'')
       ||case when coalesce(news.news_html,'')='' then '<tr><td style="padding:26px 34px;background:#f3e7d8;font:13px/20px Arial;color:#171511;">No new releases passed our complete verification checks this week. Explore our existing independently scored products instead.</td></tr>' else '' end
       ||'<tr><td align="center" style="padding:28px 34px;"><a href="https://vyrdict.com/collection/viral-right-now/" style="display:inline-block;padding:13px 20px;background:#171511;color:#fff;text-decoration:none;font:900 10px Arial;">EXPLORE VERIFIED FINDS</a></td></tr>'
       ||'<tr><td style="padding:22px 34px;background:#f7f2ed;font:11px/18px Arial;color:#756f68;">You subscribed to Weekly VYRDICT. <a style="color:#756f68;" href="{{UNSUBSCRIBE_URL}}">Unsubscribe</a>.</td></tr>'
       ||'</table></td></tr></table></body></html>';
    text_body := txt; html_body := html;
    return next;
    return;
  end if;

  subject := base.subject;
  txt := base.text_body;
  html := base.html_body;

  select * into news from public.vyrdict_weekly_digest_news_section() limit 1;
  if coalesce(news.news_text,'')<>'' then
    txt := replace(txt,'THE VERIFIED EDIT','TOP 3 VIRAL NEWS'||E'\n'||news.news_text||E'\n\nTHE VERIFIED EDIT');

    html := replace(html,'03 · VIRAL, BUT THINK TWICE','04 · VIRAL, BUT THINK TWICE');
    html := replace(html,'02 · ACTUALLY WORTH THE HYPE','03 · ACTUALLY WORTH THE HYPE');
    html := replace(html,'01 · THE VERIFIED EDIT','02 · THE VERIFIED EDIT');
    html := replace(html,'Verified product reviews and the cultural stories worth your attention.','Fresh viral stories and product drops — edited, ranked, checked, and separated from recycled hype.');
    html := replace(html,'<tr><td bgcolor="#dfe6db"',news.news_html||'<tr><td bgcolor="#dfe6db"');
  end if;

  text_body := txt;
  html_body := html;
  return next;
end;
$function$;

CREATE OR REPLACE FUNCTION public.vyrdict_queue_weekly_digest()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  local_now timestamp := timezone('America/Toronto',now());
  week_key text;
  sub record;
  payload record;
  n integer := 0;
  unsub_url text;
begin
  if extract(isodow from local_now)<>1 or extract(hour from local_now)<9 or extract(hour from local_now)>11 then return 0; end if;
  week_key:=to_char(date_trunc('week',local_now)::date,'YYYY-MM-DD');

  select * into payload from public.vyrdict_weekly_digest_payload() limit 1;
  if payload.subject is null then return 0; end if;

  for sub in select id,email,unsubscribe_token from public.vyrdict_newsletter_subscribers where status='active' loop
    unsub_url := 'https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-unsubscribe?token='||sub.unsubscribe_token;
    insert into public.vyrdict_email_outbox(kind,to_email,subject,text_body,html_body,unique_key,related_subscriber_id)
    values(
      'weekly_digest',lower(trim(sub.email)),payload.subject,
      replace(payload.text_body,'{{UNSUBSCRIBE_URL}}',unsub_url),
      replace(payload.html_body,'{{UNSUBSCRIBE_URL}}',unsub_url),
      'weekly-digest:'||week_key||':'||sub.id,
      sub.id
    ) on conflict (unique_key) do nothing;
    if found then n:=n+1; end if;
  end loop;
  return n;
end;
$function$;

CREATE OR REPLACE FUNCTION private.vyrdict_audit_weekly_newsletter()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_now timestamp := timezone('America/Toronto',now());
  v_week date := date_trunc('week',timezone('America/Toronto',now()))::date;
  v_key text := to_char(date_trunc('week',timezone('America/Toronto',now()))::date,'YYYY-MM-DD');
  v_expected int;
  v_queued int;
  v_sent int;
  v_pending int;
  v_error int;
  v_issue text := 'weekly-newsletter-'||to_char(date_trunc('week',timezone('America/Toronto',now()))::date,'YYYY-MM-DD');
  v_active bool;
begin
  -- Don't report an incident before the first Monday delivery window.
  if extract(isodow from v_now)=1 and extract(hour from v_now)<12 then
    return jsonb_build_object('ok',true,'state','delivery_window_open','week_start',v_week);
  end if;
  select count(*) into v_expected from public.vyrdict_newsletter_subscribers
  where status='active' and (consent_at at time zone 'America/Toronto')<v_week::timestamp+interval '12 hours';
  select count(*),
    count(*) filter(where status='sent'),
    count(*) filter(where status='pending'),
    count(*) filter(where status not in ('sent','pending'))
  into v_queued,v_sent,v_pending,v_error
  from public.vyrdict_email_outbox
  where kind='weekly_digest' and unique_key like 'weekly-digest:'||v_key||':%';
  v_active := v_expected>0 and v_sent<v_expected;
  if v_active then
    insert into public.vyrdict_pipeline_incidents (
      incident_key,component_type,component_key,incident_type,severity,status,
      summary,occurrence_count,first_seen_at,last_seen_at,resolved_at,metadata,updated_at
    ) values (
      v_issue,'queue','vyrdict_weekly_digest_queue','weekly_newsletter_delivery','warning','open',
      'Weekly newsletter was not sent to every eligible active subscriber.',1,now(),now(),null,
      jsonb_build_object('week_start',v_week,'eligible_subscribers',v_expected,'outbox_rows',v_queued,
       'sent',v_sent,'pending',v_pending,'not_sent',v_error),now()
    ) on conflict (incident_key) do update
      set status='open',summary=excluded.summary,severity='warning',resolved_at=null,
        occurrence_count=public.vyrdict_pipeline_incidents.occurrence_count+1,
        metadata=excluded.metadata,last_seen_at=now(),updated_at=now();
  else
    update public.vyrdict_pipeline_incidents
    set status='resolved',resolved_at=coalesce(resolved_at,now()),last_seen_at=now(),updated_at=now(),
        metadata=metadata||jsonb_build_object('resolved_by','newsletter_delivery_audit','sent',v_sent)
    where incident_key=v_issue and status='open';
  end if;
  return jsonb_build_object('week_start',v_week,'eligible_subscribers',v_expected,
    'queued',v_queued,'sent',v_sent,'pending',v_pending,'not_sent',v_error,
    'healthy',not v_active,'audited_at',now());
end; $function$;

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
 'health',(SELECT j FROM health),
 'definitions',jsonb_build_object(
    'frequent','Anonymous browser with 3+ sessions on at least 2 different days in the past 30 days',
    'visitors','Only browsers with an available anonymous visitor ID; not verified unique people',
    'categories','Category page views, clicks, product page views, product opens and retailer clicks from tracked events. Missing historic page tags are not estimated.',
    'newsletter','Confirmed subscription records across the primary and legacy forms; active excludes unsubscribed in primary'
 )
);
$function$;

SELECT cron.schedule('vyrdict_weekly_digest_queue','0 * * * *',
  $$select public.vyrdict_queue_weekly_digest();$$);
SELECT cron.schedule('vyrdict-weekly-newsletter-health','42 * * * *',
  $$select private.vyrdict_audit_weekly_newsletter();$$);
