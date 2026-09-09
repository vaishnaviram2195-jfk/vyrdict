const BUNDLE='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-bundle-fast?v=18';
let mem=null;

function patch(html){
  html=String(html||'')
    .replaceAll('🚩 THE SKIP LIST','🚩 VIRAL ≠ WORTH IT')
    .replaceAll('<h2>Viral ≠ worth it.</h2>','<h2>The Skip List.</h2>')
    .replaceAll('WHAT THE INTERNET CAN’T STOP TALKING ABOUT THIS WEEK','WHAT’S TRENDING NOW')
    .replaceAll('order=viral_score.desc,worth_score.desc&limit=250','order=viral_score.desc,worth_score.desc&limit=1000')
    .replaceAll('product_collections?select=product_id,collection_id&limit=500','product_collections?select=product_id,collection_id&limit=5000');

  const catalogOld="let sel='id,slug,brand,name,category,subcategory,viral_score,worth_score,verdict,viral_status,viral_summary,product_description,image_url';[S.p,S.c,S.l]=await Promise.all([api(`products?select=${sel}&is_active=eq.true&evidence_status=eq.verified&order=viral_score.desc,worth_score.desc&limit=1000`),api('collections?select=id,slug,name,description,collection_type&is_active=eq.true'),api('product_collections?select=product_id,collection_id&limit=5000')]);route()}";
  const catalogNew="let sel='id,slug,brand,name,category,subcategory,viral_score,worth_score,verdict,viral_status,viral_summary,product_description,image_url';const ck='vyrdict:catalog-cache:v5';let cc=null;try{cc=JSON.parse(localStorage.getItem(ck)||'null')}catch{}const dm=(location.pathname||'').match(/^\\/product\\/([^/?#]+)/);if(dm){const ds=decodeURIComponent(dm[1]);const cp=cc?.p?.find?.(x=>x.slug===ds);if(cp){S.p=[cp];S.c=cc.c||[];S.l=(cc.l||[]).filter(x=>Number(x.product_id)===Number(cp.id));route();return}S.p=await api(`products?select=${sel}&slug=eq.${encodeURIComponent(ds)}&is_active=eq.true&evidence_status=eq.verified&limit=1`);S.c=[];S.l=S.p[0]?await api(`product_collections?select=product_id,collection_id&product_id=eq.${S.p[0].id}&limit=20`):[];route();return}if(cc?.p?.length&&Date.now()-Number(cc.ts||0)<300000){S.p=cc.p;S.c=cc.c||[];S.l=cc.l||[];route();Promise.all([api(`products?select=${sel}&is_active=eq.true&evidence_status=eq.verified&order=viral_score.desc,worth_score.desc&limit=1000`),api('collections?select=id,slug,name,description,collection_type&is_active=eq.true'),api('product_collections?select=product_id,collection_id&limit=5000')]).then(([p,c,l])=>{try{localStorage.setItem(ck,JSON.stringify({ts:Date.now(),p,c,l}))}catch{}}).catch(()=>{});return}try{[S.p,S.c,S.l]=await Promise.all([api(`products?select=${sel}&is_active=eq.true&evidence_status=eq.verified&order=viral_score.desc,worth_score.desc&limit=1000`),api('collections?select=id,slug,name,description,collection_type&is_active=eq.true'),api('product_collections?select=product_id,collection_id&limit=5000')]);try{localStorage.setItem(ck,JSON.stringify({ts:Date.now(),p:S.p,c:S.c,l:S.l}))}catch{}route()}catch(e){if(cc?.p?.length){S.p=cc.p;S.c=cc.c||[];S.l=cc.l||[];route();return}throw e}}";
  html=html.replace(catalogOld,catalogNew);
  html=html.replace("async function route(){let raw=location.hash.startsWith('#/')?location.hash.slice(1):'/';let qpos=raw.indexOf('?');let path=qpos>=0?raw.slice(0,qpos):raw;let query=qpos>=0?raw.slice(qpos+1):'';","async function route(){let path=location.pathname||'/';let query=(location.search||'').replace(/^\\?/, '');");
  html=html.replace("function nav(u){let from=location.hash.startsWith('#/')?location.hash.slice(1):'/';history.pushState({vyrdict:true,from},'',location.pathname+location.search+'#'+u);route()}","function nav(u){let from=location.pathname+location.search;history.pushState({vyrdict:true,from},'',u);route()}");
  html=html.replace("function smartBack(){if(history.state?.vyrdict&&history.state?.from){history.back()}else{history.replaceState({vyrdict:true,from:null},'',location.pathname+location.search+'#/');route()}}","function smartBack(){if(history.state?.vyrdict&&history.state?.from){history.back()}else{history.replaceState({vyrdict:true,from:null},'','/');route()}}");
  html=html.replace("async function boot(){if(!location.hash.startsWith('#/'))history.replaceState({vyrdict:true,from:null},'',location.pathname+location.search+'#/');else if(!history.state?.vyrdict)history.replaceState({vyrdict:true,from:null},'',location.href);","async function boot(){if(location.hash.startsWith('#/')){let legacy=location.hash.slice(1);history.replaceState({vyrdict:true,from:null},'',legacy)}else if(!history.state?.vyrdict)history.replaceState({vyrdict:true,from:null},'',location.pathname+location.search);");
  html=html.replaceAll("decodeURIComponent(location.hash||'').match(/#\\/product\\/([^?#]+)/i)","decodeURIComponent(location.pathname||'').match(/\\/product\\/([^/?#]+)/i)");

  const preboot='<style id="vyrdict-server-home-preboot">html,body{background:#f4ede5}.hero .stage{visibility:hidden!important}</style>';
  const categoryCleanup='<script id="vyrdict-category-count-cleanup">(()=>{function clean(){document.querySelectorAll("[data-category]").forEach(el=>{for(const n of el.childNodes){if(n.nodeType===3&&/\\s*[·•]\\s*\\d+\\s*$/.test(n.textContent||""))n.textContent=(n.textContent||"").replace(/\\s*[·•]\\s*\\d+\\s*$/,"")}})}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",clean,{once:true});else clean();setTimeout(clean,350);addEventListener("popstate",()=>setTimeout(clean,50))})();<\/script>';
  const enhancements='<script src="/navigation-context.js?v=3-20260907" defer><\/script><script src="/navigation-guard.js?v=1" defer><\/script><script src="/homepage-simplify.js?v=14" defer><\/script><script src="/category-expander-failsafe.js?v=1" defer><\/script><script src="/product-fast.js?v=8" defer><\/script><script src="/analytics.js?v=perf-4" defer><\/script><script src="/product-detail-consistency.js?v=3" defer><\/script><script src="/product-card-alignment.js?v=2" defer><\/script><script src="/top-nav-section-fix.js?v=3" defer><\/script><script src="/homepage-hero-variety.js?v=8" defer><\/script><script src="/mobile-current-hero.js?v=1" defer><\/script><script src="/home-featured-rows.js?v=6" defer><\/script><script src="/worth-show-less-fix.js?v=3" defer><\/script><script src="/weekly-ranking-expand.js?v=31-20260907" defer><\/script><script src="/social-links-fix.js?v=7" defer><\/script><script src="/skip-list-reliable.js?v=1" defer><\/script><script src="/trending-index-claw.js?v=4-20260909" defer><\/script>';
  if(html.includes('</head>'))html=html.replace('</head>',preboot+'</head>');
  if(html.includes('</body>'))html=html.replace('</body>',categoryCleanup+enhancements+'</body>');
  return html;
}

async function getBundle(){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try{
    // Deliberately do not forward the visitor User-Agent. The homepage markup
    // must be identical on mobile and desktop; responsive behavior belongs in CSS/JS.
    const r=await fetch(BUNDLE,{headers:{accept:'application/json'},cache:'no-store',signal:controller.signal});
    if(!r.ok)throw new Error(`bundle ${r.status}`);
    const d=await r.json();
    if(!d?.html)throw new Error('bundle missing html');
    const html=patch(d.html);
    mem={html,ts:Date.now()};
    return html;
  }finally{clearTimeout(timer)}
}

module.exports=async function handler(req,res){
  let html;
  try{html=await getBundle()}catch(e){
    if(mem?.html)html=mem.html;
    else{
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.setHeader('Cache-Control','no-store');
      return res.status(503).send('<!doctype html><html><body style="margin:0;background:#f4ede5;font-family:Arial;display:grid;place-items:center;min-height:100vh"><div>VYRDICT is refreshing. Please reload once.</div></body></html>');
    }
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=120, must-revalidate');
  return res.status(200).send(html);
};