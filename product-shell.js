(()=>{
  if(window.__vyrdictProductShellV4)return;
  window.__vyrdictProductShellV4=1;
  const match=decodeURIComponent(location.pathname).match(/^\/product\/([^/]+)\/?$/i);if(!match)return;
  const slug=match[1],clean='/product/'+encodeURIComponent(slug)+'/';
  const BUNDLE='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-bundle-fast';
  const CACHE_KEY='vyrdict:bundle-cache:v5';
  const seo={title:document.title,description:document.querySelector('meta[name="description"]')?.content||'',canonical:document.querySelector('link[rel="canonical"]')?.href||('https://vyrdict.com'+clean),ogTitle:document.querySelector('meta[property="og:title"]')?.content||document.title,ogDescription:document.querySelector('meta[property="og:description"]')?.content||'',ogImage:document.querySelector('meta[property="og:image"]')?.content||'https://vyrdict.com/vyrdict-social-preview.jpg'};
  const attr=s=>String(s||'').replace(/[&"<>]/g,c=>({'&':'&amp;','"':'&quot;','<':'&lt;','>':'&gt;'}[c]));
  const save=d=>{try{if(d?.html)localStorage.setItem(CACHE_KEY,JSON.stringify({ts:Date.now(),html:d.html}))}catch{}};
  async function bundle(){
    try{const c=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');if(c?.html&&Date.now()-Number(c.ts||0)<15*60*1000){const refresh=()=>fetch(BUNDLE,{cache:'default'}).then(r=>r.ok?r.json():null).then(save).catch(()=>{});if('requestIdleCallback'in window)requestIdleCallback(refresh,{timeout:1800});else setTimeout(refresh,700);return{html:c.html}}}catch{}
    let last;for(let i=0;i<3;i++){try{const r=await fetch(BUNDLE,{cache:'default'});if(!r.ok)throw new Error('HTTP '+r.status);const d=await r.json();if(d?.html){save(d);return d}throw new Error('Missing bundle')}catch(e){last=e;if(i<2)await new Promise(x=>setTimeout(x,[120,350][i]))}}throw last||new Error('bundle')
  }
  function patchApp(h){
    h=h.replaceAll('order=viral_score.desc,worth_score.desc&limit=250','order=viral_score.desc,worth_score.desc&limit=1000').replaceAll('product_collections?select=product_id,collection_id&limit=500','product_collections?select=product_id,collection_id&limit=5000');
    const old="let sel='id,slug,brand,name,category,subcategory,viral_score,worth_score,verdict,viral_status,viral_summary,product_description,image_url';[S.p,S.c,S.l]=await Promise.all([api(`products?select=${sel}&is_active=eq.true&evidence_status=eq.verified&order=viral_score.desc,worth_score.desc&limit=1000`),api('collections?select=id,slug,name,description,collection_type&is_active=eq.true'),api('product_collections?select=product_id,collection_id&limit=5000')]);route()}";
    const fast="let sel='id,slug,brand,name,category,subcategory,viral_score,worth_score,verdict,viral_status,viral_summary,product_description,image_url';const dm=(location.pathname||'').match(/^\\/product\\/([^/?#]+)/);if(dm){const ds=decodeURIComponent(dm[1]);S.p=await api(`products?select=${sel}&slug=eq.${encodeURIComponent(ds)}&is_active=eq.true&evidence_status=eq.verified&limit=1`);S.c=[];S.l=S.p[0]?await api(`product_collections?select=product_id,collection_id&product_id=eq.${S.p[0].id}&limit=20`):[];route();return}[S.p,S.c,S.l]=await Promise.all([api(`products?select=${sel}&is_active=eq.true&evidence_status=eq.verified&order=viral_score.desc,worth_score.desc&limit=1000`),api('collections?select=id,slug,name,description,collection_type&is_active=eq.true'),api('product_collections?select=product_id,collection_id&limit=5000')]);route()}";
    h=h.replace(old,fast);
    h=h.replace("async function route(){let raw=location.hash.startsWith('#/')?location.hash.slice(1):'/';let qpos=raw.indexOf('?');let path=qpos>=0?raw.slice(0,qpos):raw;let query=qpos>=0?raw.slice(qpos+1):'';","async function route(){let path=location.pathname||'/';let query=(location.search||'').replace(/^\\?/, '');");
    h=h.replace("function nav(u){let from=location.hash.startsWith('#/')?location.hash.slice(1):'/';history.pushState({vyrdict:true,from},'',location.pathname+location.search+'#'+u);route()}","function nav(u){let from=location.pathname+location.search;history.pushState({vyrdict:true,from},'',u);route()}");
    h=h.replace("function smartBack(){if(history.state?.vyrdict&&history.state?.from){history.back()}else{history.replaceState({vyrdict:true,from:null},'',location.pathname+location.search+'#/');route()}}","function smartBack(){if(history.state?.vyrdict&&history.state?.from){history.back()}else{history.replaceState({vyrdict:true,from:null},'','/');route()}}");
    h=h.replace("async function boot(){if(!location.hash.startsWith('#/'))history.replaceState({vyrdict:true,from:null},'',location.pathname+location.search+'#/');else if(!history.state?.vyrdict)history.replaceState({vyrdict:true,from:null},'',location.href);","async function boot(){if(location.hash.startsWith('#/')){let legacy=location.hash.slice(1);history.replaceState({vyrdict:true,from:null},'',legacy)}else if(!history.state?.vyrdict)history.replaceState({vyrdict:true,from:null},'',location.pathname+location.search);");
    h=h.replaceAll("decodeURIComponent(location.hash||'').match(/#\\/product\\/([^?#]+)/i)","decodeURIComponent(location.pathname||'').match(/\\/product\\/([^/?#]+)/i)");
    return h;
  }
  (async()=>{try{
    const d=await bundle();if(!d?.html)throw new Error('html');let h=patchApp(d.html);
    const tags='<base href="/"><title>'+attr(seo.title)+'</title><meta name="description" content="'+attr(seo.description)+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+attr(seo.canonical)+'"><meta property="og:site_name" content="VYRDICT"><meta property="og:type" content="product"><meta property="og:url" content="'+attr(seo.canonical)+'"><meta property="og:title" content="'+attr(seo.ogTitle)+'"><meta property="og:description" content="'+attr(seo.ogDescription)+'"><meta property="og:image" content="'+attr(seo.ogImage)+'"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="'+attr(seo.ogTitle)+'"><meta name="twitter:description" content="'+attr(seo.ogDescription)+'"><meta name="twitter:image" content="'+attr(seo.ogImage)+'">';
    h=h.replace(/<title[\s\S]*?<\/title>/i,'').replace(/<meta[^>]+name=["']description["'][^>]*>/i,'').replace(/<link[^>]+rel=["']canonical["'][^>]*>/i,'');h=h.replace('<head>','<head>'+tags);
    const tail='<script src="/product-fast.js?v=2" defer><\/script><script src="/analytics.js?v=restore-original-type-2" defer><\/script><script src="/product-detail-consistency.js?v=3" defer><\/script><script src="/social-links-fix.js?v=7" defer><\/script>';
    h=h.replace('</body>',tail+'</body>');document.open();document.write(h);document.close();
  }catch(e){console.error('VYRDICT product shell',e)}})();
})();
