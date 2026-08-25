const DATA='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-seo-product-data';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]||c));

function textValue(v){
  if(v==null)return '';
  if(typeof v==='string')return v.trim();
  if(typeof v==='number'||typeof v==='boolean')return String(v);
  if(Array.isArray(v))return v.map(textValue).filter(Boolean).join(' · ');
  if(typeof v==='object'){
    for(const k of ['summary','headline','verdict','answer','text','body','description']){const t=textValue(v[k]);if(t)return t}
    return Object.values(v).map(textValue).filter(Boolean).join(' ');
  }
  return '';
}
const date=v=>{if(!v)return'';const d=new Date(v);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)};
const http=v=>/^https?:\/\//i.test(String(v||''));

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

    const fullName=`${p.brand||''} ${p.name||''}`.replace(/\s+/g,' ').trim();
    const verdict=textValue(prof.quick_verdict)||textValue(p.verdict_summary)||p.viral_summary||p.product_description||`${p.verdict||'Reviewed by VYRDICT'}.`;
    const what=textValue(prof.what_it_does)||p.product_description||p.viral_summary||verdict;
    const best=Array.isArray(prof.best_for)?prof.best_for.filter(Boolean).slice(0,6):[];
    const canonical=`https://vyrdict.com/product/${encodeURIComponent(p.slug)}/`;
    const title=`${fullName} Review: Is It Worth It? | VYRDICT`;
    const description=`${fullName}: Viral ${p.viral_score}/100, Worth ${p.worth_score}/100 — ${p.verdict}. ${verdict}`.slice(0,220);
    const reviewed=date(prof.last_reviewed_at||p.last_verified_at)||new Date().toISOString().slice(0,10);
    const image=http(p.image_url)?p.image_url:'https://vyrdict.com/vyrdict-social-preview.jpg';

    const schema={
      '@context':'https://schema.org','@type':'Product','@id':canonical+'#product',name:fullName,
      brand:{'@type':'Brand',name:p.brand||''},image:[image],description:p.product_description||p.viral_summary||verdict,
      category:p.category||'',url:canonical,
      review:{'@type':'Review',name:`${fullName} review`,url:canonical,datePublished:reviewed,dateModified:reviewed,reviewBody:verdict,
        author:{'@type':'Organization',name:'VYRDICT',url:'https://vyrdict.com/'},publisher:{'@type':'Organization',name:'VYRDICT',url:'https://vyrdict.com/'},
        reviewRating:{'@type':'Rating',ratingValue:Number(p.worth_score),bestRating:100,worstRating:0}},
      additionalProperty:[
        {'@type':'PropertyValue',name:'VYRDICT Viral Score',value:Number(p.viral_score),maxValue:100},
        {'@type':'PropertyValue',name:'VYRDICT Worth Score',value:Number(p.worth_score),maxValue:100},
        {'@type':'PropertyValue',name:'VYRDICT Verdict',value:p.verdict||''}
      ]
    };
    const schemaText=JSON.stringify(schema).replace(/</g,'\\u003c');

    const evidenceHtml=evidence.map(e=>{
      const label=e.source_publisher||e.source_label||'Evidence source',note=e.claim_summary||e.note||'';
      const source=http(e.source_url)?`<a href="${esc(e.source_url)}" rel="nofollow noopener noreferrer" target="_blank">${esc(label)}</a>`:`<strong>${esc(label)}</strong>`;
      return `<li>${source}${note?`<span>${esc(note)}</span>`:''}</li>`;
    }).join('');
    const retailerHtml=retailers.filter(r=>http(r.retailer_url)).map(r=>`<a class="shop" href="${esc(r.retailer_url)}" rel="nofollow noopener noreferrer" target="_blank">${esc(r.retailer_name||'Retailer')}${r.is_official?' · Official':''} →</a>`).join('');

    const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"><link rel="canonical" href="${esc(canonical)}"><link rel="preconnect" href="https://shmbvkjzeqqxybweyowj.supabase.co" crossorigin>
<meta property="og:site_name" content="VYRDICT"><meta property="og:type" content="article"><meta property="og:url" content="${esc(canonical)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${esc(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(image)}"><script type="application/ld+json">${schemaText}</script>
<style>*{box-sizing:border-box}html,body{margin:0;background:#f4ede5;color:#171511;font-family:Arial,Helvetica,sans-serif}a{color:inherit}.seo{width:min(1080px,calc(100% - 36px));margin:0 auto;padding:28px 0 70px}.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:30px}.logo{font-weight:950;font-size:25px;letter-spacing:-.06em;text-decoration:none}.logo b{color:#e65f72}.method{font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}.hero{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:36px;align-items:center;background:#fffdf8;border:1px solid #d8cec4;border-radius:30px;padding:28px}.media{background:#f7f1eb;border-radius:24px;min-height:390px;display:grid;place-items:center;padding:22px}.media img{max-width:100%;max-height:410px;object-fit:contain}.eyebrow{font-size:10px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;color:#756d65}.hero h1{font:500 clamp(38px,5.2vw,68px)/.96 Georgia,serif;letter-spacing:-.05em;margin:10px 0 17px}.answer{font:700 18px/1.45 Arial,sans-serif;margin:0 0 18px}.scores{display:flex;gap:10px;flex-wrap:wrap;margin:20px 0}.score{border:1px solid #d8cec4;border-radius:999px;padding:10px 13px;font-size:11px;font-weight:900}.verdict{background:#171511;color:#fff}.summary{color:#655e57;line-height:1.7;font-size:15px}.content{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;margin-top:24px}.content section{background:#fffdf8;border:1px solid #d8cec4;border-radius:24px;padding:24px}.content h2{font:500 28px/1.05 Georgia,serif;margin:0 0 12px}.content p{line-height:1.7;color:#655e57}.best,.sources{padding:0;margin:0;list-style:none}.best li{padding:8px 0}.sources li{padding:12px 0;border-top:1px solid #ebe2da;display:flex;flex-direction:column;gap:5px}.sources li:first-child{border-top:0}.sources span{color:#716a63;font-size:13px;line-height:1.45}.shops{display:flex;gap:8px;flex-wrap:wrap}.shop{display:inline-block;padding:11px 14px;border-radius:999px;background:#171511;color:#fff;text-decoration:none;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.reviewed{margin-top:24px;color:#817971;font-size:12px}.loading-note{margin-top:18px;font-size:11px;color:#817971}@media(max-width:760px){.hero,.content{grid-template-columns:1fr}.hero{padding:18px}.media{min-height:280px}.seo{width:min(100% - 24px,1080px);padding-top:18px}.hero h1{font-size:42px}}</style><script src="/product-shell.js?v=6" defer></script></head><body><main class="seo"><div class="top"><a class="logo" href="/">VYRDICT<b>.</b></a><a class="method" href="/how-vyrdict-scores.html">How scoring works</a></div><article class="hero"><div class="media"><img src="${esc(image)}" alt="${esc(fullName)}" fetchpriority="high"></div><div><div class="eyebrow">${esc(p.category)} · VYRDICT product review</div><h1>${esc(fullName)} Review: Is It Worth It?</h1><p class="answer">VYRDICT: ${esc(p.verdict)} — Worth ${esc(p.worth_score)}/100.</p><div class="scores"><span class="score">🔥 Viral ${esc(p.viral_score)}/100</span><span class="score">✓ Worth ${esc(p.worth_score)}/100</span><span class="score verdict">${esc(p.verdict)}</span></div><p class="summary">${esc(verdict)}</p><div class="reviewed">Last reviewed ${esc(reviewed)} · Viral measures attention; Worth measures evidence-backed value.</div></div></article><div class="content"><section><h2>What it does</h2><p>${esc(what)}</p></section>${best.length?`<section><h2>Who is it best for?</h2><ul class="best">${best.map(x=>`<li>✓ ${esc(x)}</li>`).join('')}</ul></section>`:''}${evidenceHtml?`<section><h2>Why VYRDICT scored it this way</h2><ul class="sources">${evidenceHtml}</ul></section>`:''}${retailerHtml?`<section><h2>Where to buy</h2><div class="shops">${retailerHtml}</div></section>`:''}</div><p class="loading-note">Loading the full interactive VYRDICT experience…</p></main></body></html>`;

    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=86400');
    res.setHeader('X-Robots-Tag','index, follow');
    return res.status(200).send(html);
  }catch(e){
    console.error(e);res.setHeader('Cache-Control','no-store');return res.status(500).send('<!doctype html><title>VYRDICT</title><h1>Product temporarily unavailable</h1>');
  }
};

function notFound(res){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('X-Robots-Tag','noindex, follow');res.setHeader('Cache-Control','public, s-maxage=60');
  return res.status(404).send('<!doctype html><html><head><meta name="robots" content="noindex,follow"><title>Product not found | VYRDICT</title></head><body><h1>Product not found</h1><a href="/">Back to VYRDICT</a></body></html>');
}
