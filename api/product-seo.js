const DATA='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-seo-product-data';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const date=v=>{if(!v)return'';const d=new Date(v);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)};
const http=v=>/^https?:\/\//i.test(String(v||''));
const secureImage=v=>{const s=String(v||'').trim();if(/^https:\/\//i.test(s))return s;if(/^http:\/\//i.test(s))return s.replace(/^http:/i,'https:');return''};
const catSlug=v=>String(v||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function textValue(v){
  if(v==null)return'';
  if(typeof v==='string')return v.trim();
  if(typeof v==='number'||typeof v==='boolean')return String(v);
  if(Array.isArray(v))return v.map(textValue).filter(Boolean).join(' · ');
  if(typeof v==='object'){
    for(const k of ['summary','headline','verdict','answer','text','body','description']){const t=textValue(v[k]);if(t)return t}
    return Object.values(v).map(textValue).filter(Boolean).join(' ');
  }
  return'';
}
function trimAtWord(v,max){
  const s=String(v||'').trim();if(s.length<=max)return s;
  const probe=s.slice(0,max+1),i=probe.lastIndexOf(' ');
  return(i>Math.floor(max*.55)?probe.slice(0,i):s.slice(0,max)).replace(/[,:;—–-]+$/,'').trim();
}
function buildTitle(fullName,question){
  const intent=`${fullName} Review: ${question} | VYRDICT`;
  if(intent.length<=70)return intent;
  let base=String(fullName||'').replace(/\s+[—–]\s+.*$/,'').trim();
  const suffix=' Review | VYRDICT';
  if((base+suffix).length>70)base=trimAtWord(base,70-suffix.length);
  return`${base}${suffix}`;
}

module.exports=async function handler(req,res){
  try{
    const raw=Array.isArray(req.query?.slug)?req.query.slug[0]:req.query?.slug;
    const slug=decodeURIComponent(String(raw||'').trim());
    if(!slug||!/^[a-z0-9][a-z0-9-]*$/i.test(slug))return notFound(res);

    const upstream=await fetch(`${DATA}?slug=${encodeURIComponent(slug)}`,{headers:{accept:'application/json'}});
    if(upstream.status===404)return notFound(res);
    if(!upstream.ok)throw new Error(`product data ${upstream.status}`);
    const data=await upstream.json();
    const p=data.product||{},prof=data.profile||{},evidence=Array.isArray(data.evidence)?data.evidence:[],retailers=Array.isArray(data.retailers)?data.retailers:[];
    const indexable=evidence.length>=2;
    const isBook=String(p.category||'').toLowerCase()==='books';
    const brand=String(p.brand||'').trim(),name=String(p.name||'').trim();
    const fullName=brand&&name.toLowerCase().startsWith(brand.toLowerCase())?name:`${brand} ${name}`.replace(/\s+/g,' ').trim();
    const verdict=textValue(prof.quick_verdict)||textValue(p.verdict_summary)||p.viral_summary||p.product_description||`${p.verdict||'Reviewed by VYRDICT'}.`;
    const what=textValue(prof.what_it_does)||p.product_description||p.viral_summary||verdict;
    const best=Array.isArray(prof.best_for)?prof.best_for.filter(Boolean).slice(0,6):[];
    const hype=textValue(prof.hype_vs_reality?.hype),reality=textValue(prof.hype_vs_reality?.reality);
    const canonical=`https://vyrdict.com/product/${encodeURIComponent(p.slug)}/`;
    const categoryUrl=`https://vyrdict.com/category/${catSlug(p.category)}/`;
    const question=isBook?'Worth Reading?':'Is It Worth It?';
    const title=buildTitle(fullName,question);
    const description=trimAtWord(`${fullName}: Viral ${p.viral_score}/100, Worth ${p.worth_score}/100 — ${p.verdict}. ${verdict}`,160);
    const published=date(p.published_at),reviewed=date(prof.last_reviewed_at||p.last_verified_at);
    const image=secureImage(p.image_url)||'https://vyrdict.com/vyrdict-social-preview.jpg';
    const reviewBody=[verdict,hype&&reality?`Hype: ${hype} Reality: ${reality}`:''].filter(Boolean).join(' ');
    const robots=indexable?'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1':'noindex,follow';

    const orgId='https://vyrdict.com/#organization',siteId='https://vyrdict.com/#website',crumbId=canonical+'#breadcrumb',pageId=canonical+'#webpage',entityId=canonical+(isBook?'#book':'#product');
    const organization={'@type':'Organization','@id':orgId,name:'VYRDICT',url:'https://vyrdict.com/',description:'Product scoring for the viral economy.',sameAs:['https://www.tiktok.com/@vyrdict']};
    const website={'@type':'WebSite','@id':siteId,url:'https://vyrdict.com/',name:'VYRDICT',publisher:{'@id':orgId}};
    const breadcrumb={'@type':'BreadcrumbList','@id':crumbId,itemListElement:[
      {'@type':'ListItem',position:1,name:'VYRDICT',item:'https://vyrdict.com/'},
      {'@type':'ListItem',position:2,name:p.category||'Products',item:categoryUrl},
      {'@type':'ListItem',position:3,name:fullName,item:canonical}
    ]};
    const webpage={'@type':'WebPage','@id':pageId,url:canonical,name:title,description,isPartOf:{'@id':siteId},breadcrumb:{'@id':crumbId},about:{'@id':entityId},publisher:{'@id':orgId}};
    if(published)webpage.datePublished=published;if(reviewed)webpage.dateModified=reviewed;
    const review={'@type':'Review',name:`${fullName} review`,url:canonical,reviewBody,author:{'@id':orgId},publisher:{'@id':orgId},reviewRating:{'@type':'Rating',ratingValue:Number(p.worth_score),bestRating:100,worstRating:0}};
    if(published)review.datePublished=published;if(reviewed)review.dateModified=reviewed;
    const entity={
      '@type':isBook?'Book':'Product','@id':entityId,name:fullName,image:[image],description:p.product_description||p.viral_summary||verdict,url:canonical,mainEntityOfPage:{'@id':pageId},review,
      additionalProperty:[
        {'@type':'PropertyValue',name:'VYRDICT Viral Score',value:Number(p.viral_score),maxValue:100},
        {'@type':'PropertyValue',name:'VYRDICT Worth Score',value:Number(p.worth_score),maxValue:100},
        {'@type':'PropertyValue',name:'VYRDICT Verdict',value:p.verdict||''},
        {'@type':'PropertyValue',name:'Evidence Strength',value:prof.evidence_strength||''}
      ].filter(x=>x.value!==''&&x.value!=null)
    };
    if(isBook){if(brand)entity.author={'@type':'Person',name:brand}}else{entity.category=p.category||'';if(brand)entity.brand={'@type':'Brand',name:brand}}
    const schema={'@context':'https://schema.org','@graph':[organization,website,breadcrumb,webpage,entity]};
    const schemaText=JSON.stringify(schema).replace(/</g,'\\u003c');

    const evidenceHtml=evidence.map(e=>{
      const label=e.source_publisher||e.source_label||'Evidence source',note=e.claim_summary||e.note||'';
      const source=http(e.source_url)?`<a href="${esc(e.source_url)}" rel="nofollow noopener noreferrer" target="_blank">${esc(label)}</a>`:`<strong>${esc(label)}</strong>`;
      return`<li>${source}${note?`<span>${esc(note)}</span>`:''}</li>`;
    }).join('');
    const retailerHtml=retailers.filter(r=>http(r.retailer_url)).map(r=>`<a class="shop" href="${esc(r.retailer_url)}" rel="nofollow noopener noreferrer" target="_blank">${esc(r.retailer_name||'Retailer')}${r.is_official?' · Official':''} →</a>`).join('');
    const hypeHtml=hype&&reality?`<section><h2>Hype vs reality</h2><div class="hvr"><div><b>THE HYPE</b><p>${esc(hype)}</p></div><div><b>THE REALITY</b><p>${esc(reality)}</p></div></div></section>`:'';

    const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${esc(canonical)}"><link rel="preconnect" href="https://shmbvkjzeqqxybweyowj.supabase.co" crossorigin>
<meta property="og:site_name" content="VYRDICT"><meta property="og:type" content="article"><meta property="og:url" content="${esc(canonical)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image)}"><script type="application/ld+json">${schemaText}</script><script src="/navigation-guard.js?v=1" defer></script>
<style>*{box-sizing:border-box}html,body{margin:0;background:#f4ede5;color:#171511;font-family:Arial,Helvetica,sans-serif}a{color:inherit}.seo{width:min(1080px,calc(100% - 36px));margin:0 auto;padding:28px 0 70px}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}.logo{font-weight:950;font-size:25px;letter-spacing:-.06em;text-decoration:none}.logo b{color:#e65f72}.method{font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.crumbs{font-size:11px;color:#817971;margin:0 0 24px}.crumbs a{text-decoration:none}.hero{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:36px;align-items:center;background:#fffdf8;border:1px solid #d8cec4;border-radius:30px;padding:28px}.media{background:#f7f1eb;border-radius:24px;min-height:390px;display:grid;place-items:center;padding:22px}.media img{max-width:100%;max-height:410px;object-fit:contain}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#756d65}.hero h1{font:500 clamp(38px,5.2vw,68px)/.96 Georgia,serif;letter-spacing:-.05em;margin:10px 0 17px}.answer{font:700 18px/1.45 Arial,sans-serif;margin:0 0 18px}.scores{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.score{border:1px solid #d8cec4;border-radius:999px;padding:10px 13px;font-size:11px;font-weight:900}.verdict{background:#171511;color:#fff}.summary{color:#655e57;line-height:1.7;font-size:15px}.content{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;margin-top:24px}.content section{background:#fffdf8;border:1px solid #d8cec4;border-radius:24px;padding:24px}.content h2{font:500 28px/1.05 Georgia,serif;margin:0 0 12px}.content p{line-height:1.7;color:#655e57}.best,.sources{padding:0;margin:0;list-style:none}.best li{padding:8px 0}.sources li{padding:12px 0;border-top:1px solid #ebe2da;display:flex;flex-direction:column;gap:5px}.sources li:first-child{border-top:0}.sources span{color:#716a63;font-size:13px;line-height:1.45}.hvr{display:grid;gap:14px}.hvr>div{border-top:1px solid #ebe2da;padding-top:12px}.hvr>div:first-child{border-top:0;padding-top:0}.hvr b{font-size:9px;letter-spacing:.1em}.hvr p{margin:5px 0 0}.shops{display:flex;gap:8px;flex-wrap:wrap}.shop{display:inline-block;padding:11px 14px;border-radius:999px;background:#171511;color:#fff;text-decoration:none;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.reviewed{margin-top:24px;color:#817971;font-size:12px}.loading-note{margin-top:18px;font-size:11px;color:#817971}@media(max-width:760px){.hero,.content{grid-template-columns:1fr}.hero{padding:18px}.media{min-height:280px}.seo{width:min(100% - 24px,1080px);padding-top:18px}.hero h1{font-size:42px}}</style><script src="/product-shell.js?v=9" defer></script></head><body><main class="seo"><div class="top"><a class="logo" href="/">VYRDICT<b>.</b></a><a class="method" href="/how-vyrdict-scores.html">How scoring works</a></div><nav class="crumbs" aria-label="Breadcrumb"><a href="/">VYRDICT</a> › <a href="/category/${catSlug(p.category)}/">${esc(p.category)}</a> › ${esc(fullName)}</nav><article class="hero"><div class="media"><img src="${esc(image)}" alt="${esc(fullName)}" fetchpriority="high"></div><div><div class="eyebrow">${esc(p.category)} · VYRDICT ${isBook?'book':'product'} review</div><h1>${esc(fullName)} Review: ${esc(question)}</h1><p class="answer">VYRDICT: ${esc(p.verdict)} — Worth ${esc(p.worth_score)}/100.</p><div class="scores"><span class="score">🔥 Viral ${esc(p.viral_score)}/100</span><span class="score">✓ Worth ${esc(p.worth_score)}/100</span><span class="score verdict">${esc(p.verdict)}</span></div><p class="summary">${esc(verdict)}</p><div class="reviewed">${reviewed?`Last reviewed ${esc(reviewed)} · `:''}Viral measures attention; Worth measures evidence-backed value.</div></div></article><div class="content"><section><h2>${isBook?'What it’s about':'What it does'}</h2><p>${esc(what)}</p></section>${hypeHtml}${best.length?`<section><h2>${isBook?'Who is it for?':'Who is it best for?'}</h2><ul class="best">${best.map(x=>`<li>✓ ${esc(x)}</li>`).join('')}</ul></section>`:''}${evidenceHtml?`<section><h2>Why VYRDICT scored it this way</h2><ul class="sources">${evidenceHtml}</ul></section>`:''}${retailerHtml?`<section><h2>Where to buy</h2><div class="shops">${retailerHtml}</div></section>`:''}</div><p class="loading-note">Loading the full interactive VYRDICT experience…</p></main></body></html>`;

    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=86400');
    res.setHeader('X-Robots-Tag',indexable?'index, follow':'noindex, follow');
    return res.status(200).send(html);
  }catch(e){
    console.error(e);res.setHeader('Cache-Control','no-store');return res.status(500).send('<!doctype html><title>VYRDICT</title><h1>Product temporarily unavailable</h1>');
  }
};

function notFound(res){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('X-Robots-Tag','noindex, follow');res.setHeader('Cache-Control','public, s-maxage=60');
  return res.status(404).send('<!doctype html><html><head><meta name="robots" content="noindex,follow"><title>Product not found | VYRDICT</title><script src="/navigation-guard.js?v=1" defer></script></head><body><h1>Product not found</h1><a href="/">Back to VYRDICT</a></body></html>');
}