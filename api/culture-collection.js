const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-culture-feed';

const CONFIG={
  'celebrity-effect':{
    title:'Celebrity Effect',
    kicker:'CULTURE / PEOPLE',
    description:'The products and launches moving because a celebrity wore it, used it, launched it or turned it into the next obsession.',
    signalTitle:'Fresh celebrity signals',
    signalCopy:'New launches and celebrity-driven product moments VYRDICT is tracking right now.'
  },
  'seen-on-screen':{
    title:'Seen on Screen',
    kicker:'TV / FILM / SCREEN CULTURE',
    description:'The fashion, beauty and objects people start searching for the second they appear on screen.',
    signalTitle:'Fresh screen IDs',
    signalCopy:'Structured on-screen product identifications discovered from current screen appearances. Full VYRDICT scoring follows only after verification.'
  }
};

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const http=v=>/^https?:\/\//i.test(String(v||''));
const date=v=>{const d=new Date(v||'');return Number.isNaN(d.getTime())?'':d.toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'})};

module.exports=async function handler(req,res){
  const raw=Array.isArray(req.query?.slug)?req.query.slug[0]:req.query?.slug;
  const slug=String(raw||'').trim().toLowerCase();
  const cfg=CONFIG[slug];
  if(!cfg)return res.status(404).send('Not found');
  try{
    const r=await fetch(`${FEED}?slug=${encodeURIComponent(slug)}`,{headers:{accept:'application/json'},cache:'no-store'});
    if(!r.ok)throw new Error(`culture feed ${r.status}`);
    const data=await r.json();
    const products=Array.isArray(data.products)?data.products:[];
    const signals=Array.isArray(data.signals)?data.signals:[];
    const canonical=`https://vyrdict.com/collection/${slug}/`;
    const title=`${cfg.title} \u2014 VYRDICT`;
    const productCards=products.map((p,i)=>`<a class="card product" href="/product/${encodeURIComponent(p.slug)}/"><div class="media"><img ${i<4?'fetchpriority="high"':'loading="lazy"'} decoding="async" src="${esc(p.image_url)}" alt="${esc(`${p.brand||''} ${p.name||''}`.trim())}"><span class="pill">Verified VYRDICT</span></div><div class="copy"><div class="meta">${esc(p.category||cfg.title)} \u00b7 ${esc(p.brand||'')}</div><h2>${esc(p.name||'')}</h2><div class="scores"><span>Viral <b>${Math.round(Number(p.viral_score||0))}</b></span><span>Worth <b>${Math.round(Number(p.worth_score||0))}</b></span></div>${p.published_at?`<div class="when">Added ${esc(date(p.published_at))}</div>`:''}</div></a>`).join('');
    const signalCards=signals.map((s,i)=>{
      const href=http(s.product_slug)?s.product_slug:(s.product_slug?`/product/${encodeURIComponent(s.product_slug)}/`:s.source_url);
      const internal=String(href||'').startsWith('/');
      const label=slug==='seen-on-screen'?'Exact screen ID \u00b7 Score in progress':'Fresh celebrity signal';
      const eyebrow=slug==='seen-on-screen'?[s.show_title,s.brand].filter(Boolean).join(' \u00b7 '):[s.category,s.source_label].filter(Boolean).join(' \u00b7 ');
      return `<a class="card signal-card" href="${esc(href||'#')}" ${internal?'':`target="_blank" rel="nofollow noopener noreferrer"`}><div class="media signal-media"><img ${i<4?'fetchpriority="high"':'loading="lazy"'} decoding="async" src="${esc(s.image_url)}" alt="${esc(s.product_name||s.headline||'VYRDICT signal')}"><span class="pill signal-pill">${esc(label)}</span></div><div class="copy"><div class="meta">${esc(eyebrow||cfg.kicker)}</div><h2>${esc(s.product_name||s.headline||'Fresh signal')}</h2>${s.character?`<p class="dek">Seen on ${esc(s.show_title||'screen')}${s.character?` \u00b7 ${esc(s.character)}`:''}</p>`:(s.dek?`<p class="dek">${esc(s.dek)}</p>`:'')}<div class="when">${esc(date(s.seen_at||s.published_at))}${internal?' \u00b7 Open VYRDICT':' \u00b7 View source \u2197'}</div></div></a>`;
    }).join('');

    const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(cfg.description)}"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${canonical}"><link rel="icon" href="/vyrdict-logo.svg" type="image/svg+xml"><style>
:root{--ink:#171717;--muted:#68645f;--paper:#f6f4ef;--card:#fbfaf7;--line:rgba(0,0,0,.12);--serif:"Iowan Old Style",Baskerville,"Times New Roman",Georgia,serif;--sans:"Helvetica Neue",Helvetica,Arial,sans-serif}*{box-sizing:border-box}html,body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans)}a{color:inherit}.head{position:sticky;top:0;z-index:30;background:rgba(246,244,239,.96);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}.headin{width:min(1320px,calc(100% - 80px));margin:auto;min-height:66px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{text-decoration:none;font:900 25px/1 Arial,sans-serif;letter-spacing:-1.5px}.brand:after{content:"";display:inline-block;width:6px;height:6px;background:#d94d73;margin:0 0 2px 2px}.tabs{display:flex;gap:8px;overflow:auto;scrollbar-width:none}.tabs::-webkit-scrollbar{display:none}.tabs a{white-space:nowrap;text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:9px 11px;font:800 8px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;background:#fbfaf7}.tabs a.active{background:#171717;color:#fff}.home{text-decoration:none;font:800 9px/1 var(--sans);letter-spacing:.1em;text-transform:uppercase}.wrap{width:min(1320px,calc(100% - 80px));margin:auto}.hero{padding:58px 0 36px;border-bottom:1px solid var(--line)}.kicker{font:800 9px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;color:#66615b;margin-bottom:14px}.hero h1{font:400 clamp(42px,5vw,72px)/.96 var(--serif);letter-spacing:-.05em;margin:0}.hero p{max-width:720px;color:var(--muted);font:15px/1.65 var(--sans);margin:18px 0 0}.section{padding:38px 0 70px}.section+.section{border-top:1px solid var(--line);padding-top:54px}.section-head{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:24px}.section-head h2{font:400 clamp(30px,3.2vw,45px)/1 var(--serif);letter-spacing:-.04em;margin:0}.section-head p{max-width:520px;margin:0;color:var(--muted);font:13px/1.55 var(--sans)}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:30px 18px}.card{text-decoration:none;min-width:0}.media{position:relative;aspect-ratio:.88;background:#e7e4de;overflow:hidden;display:grid;place-items:center}.media img{width:88%;height:88%;object-fit:contain;display:block;filter:drop-shadow(0 12px 20px rgba(0,0,0,.07))}.signal-media img{width:100%;height:100%;object-fit:cover;filter:none}.pill{position:absolute;left:10px;top:10px;padding:7px 8px;background:rgba(246,244,239,.92);font:800 7px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase}.signal-pill{background:rgba(23,23,23,.86);color:#fff}.copy{padding:13px 1px 0}.meta{font:800 8px/1.25 var(--sans);letter-spacing:.1em;text-transform:uppercase;color:#74706a;margin-bottom:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.copy h2{font:500 15.5px/1.28 var(--sans);margin:0}.scores{display:flex;gap:13px;margin-top:10px;font:700 8.5px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;color:#68645f}.scores b{color:#171717}.when{margin-top:9px;font:700 8px/1.25 var(--sans);color:#7a746d;letter-spacing:.05em;text-transform:uppercase}.dek{font:12.5px/1.5 var(--sans);color:#66615b;margin:8px 0 0}.empty{padding:28px;border:1px solid var(--line);background:#fbfaf7;color:#68645f}.stamp{padding:18px 0 0;color:#7a746d;font:700 8px/1.3 var(--sans);text-transform:uppercase;letter-spacing:.08em}@media(max-width:980px){.headin,.wrap{width:min(100% - 42px,900px)}.headin{flex-wrap:wrap;padding:10px 0}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.home{display:none}}@media(max-width:620px){.headin,.wrap{width:calc(100% - 24px)}.headin{display:grid;grid-template-columns:1fr;gap:10px;padding:11px 0}.brand{font-size:22px}.tabs{width:100%;padding-bottom:1px}.tabs a{font-size:7px;padding:8px 9px}.hero{padding:34px 0 25px}.hero h1{font-size:40px}.hero p{font-size:13px;line-height:1.52}.section{padding:27px 0 48px}.section+.section{padding-top:38px}.section-head{display:block}.section-head p{margin-top:10px}.grid{gap:24px 10px}.media{aspect-ratio:.94}.copy{padding-top:9px}.copy h2{font-size:12.5px}.meta{font-size:6.8px}.scores{font-size:7px;gap:8px}.when{font-size:6.8px}.dek{font-size:10.8px}.pill{font-size:6px;left:7px;top:7px;padding:6px}}
</style></head><body><header class="head"><div class="headin"><a class="brand" href="/">VYRDICT</a><nav class="tabs" aria-label="Culture collections"><a href="/collection/viral-right-now/">Viral Right Now</a><a class="${slug==='celebrity-effect'?'active':''}" href="/collection/celebrity-effect/">Celebrity Effect</a><a class="${slug==='seen-on-screen'?'active':''}" href="/collection/seen-on-screen/">Seen on Screen</a></nav><a class="home" href="/">Back home</a></div></header><main><section class="hero"><div class="wrap"><div class="kicker">${esc(cfg.kicker)}</div><h1>${esc(cfg.title)}</h1><p>${esc(cfg.description)}</p><div class="stamp">Updated ${esc(date(data.generated_at||new Date().toISOString()))}</div></div></section><section class="section"><div class="wrap"><div class="section-head"><h2>Verified on VYRDICT</h2><p>Fully published products with evidence-backed Viral and Worth scores.</p></div><div class="grid">${productCards||'<div class="empty">No fully scored products are ready in this collection yet.</div>'}</div></div></section><section class="section"><div class="wrap"><div class="section-head"><h2>${esc(cfg.signalTitle)}</h2><p>${esc(cfg.signalCopy)}</p></div><div class="grid">${signalCards||'<div class="empty">Fresh signals are being refreshed now.</div>'}</div></div></section></main></body></html>`;
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).send(html);
  }catch(e){
    console.error(e);
    res.setHeader('Cache-Control','no-store');
    return res.status(500).send('<!doctype html><title>VYRDICT</title><h1>Collection temporarily unavailable</h1><a href="/">Back home</a>');
  }
};
