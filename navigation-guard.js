(()=>{
  if(window.__vyrdictNavigationGuardV7)return;
  window.__vyrdictNavigationGuardV7=1;

  const COVER_ID='vyrdict-route-cover';
  const SCORE_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-seo-product-data';
  const onProduct=()=>/^\/product\//i.test(location.pathname);
  const onCategory=()=>/^\/category\//i.test(location.pathname);

  try{
    if(localStorage.getItem('vyrdict:catalog-repair:v1')!=='1'){
      localStorage.removeItem('vyrdict:catalog-cache:v5');
      localStorage.setItem('vyrdict:catalog-repair:v1','1');
    }
  }catch{}

  function hardTop(){
    try{history.scrollRestoration='manual'}catch{}
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{if(document.scrollingElement)document.scrollingElement.scrollTop=0}catch{}
    try{document.documentElement.scrollTop=0}catch{}
    try{document.body.scrollTop=0}catch{}
    try{window.scrollTo(0,0)}catch{}
  }

  function installStableLoadingPaint(){
    if(document.getElementById('vyrdict-stable-loading-paint'))return;
    const style=document.createElement('style');
    style.id='vyrdict-stable-loading-paint';
    style.textContent=`
      html,body{min-height:100%}
      body{min-height:100vh}
      body #app.loading{
        min-height:calc(100vh - 122px)!important;
        margin:18px 0 24px!important;
        padding:28px!important;
        display:grid!important;
        place-items:center!important;
        background:#fffdf8!important;
        border:1px solid #d8cec4!important;
        border-radius:24px!important;
        color:#6d675f!important;
        text-align:center!important;
        box-shadow:0 16px 44px rgba(58,43,32,.05)!important;
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function installCategoryCardLayout(){
    if(!onCategory()||document.getElementById('vyrdict-category-card-layout-v1'))return;
    const style=document.createElement('style');
    style.id='vyrdict-category-card-layout-v1';
    style.textContent=`
      @media(max-width:620px){
        body .wrap .grid{gap:14px!important}
        body .wrap .grid .card{border-radius:22px!important;overflow:hidden!important;background:#fffdf8!important}
        body .wrap .grid .card .pic{height:165px!important;min-height:165px!important;max-height:165px!important;padding:14px!important;display:grid!important;place-items:center!important;overflow:hidden!important;background:#f7f1eb!important;border-bottom:1px solid #e8ddd4!important}
        body .wrap .grid .card .pic img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:137px!important;object-fit:contain!important;object-position:center!important;margin:0 auto!important;position:static!important;transform:none!important}
        body .wrap .grid .card .body{position:relative!important;z-index:2!important;margin:0!important;padding:16px 17px 18px!important;background:#fffdf8!important;transform:none!important}
        body .wrap .grid .card .body h2{position:static!important;inset:auto!important;transform:none!important;max-width:100%!important;margin:7px 0 12px!important;font:500 24px/1.06 Georgia,serif!important;letter-spacing:-.02em!important;overflow-wrap:anywhere!important;word-break:normal!important;color:#171511!important}
        body .wrap .grid .card .scores{margin:0 0 11px!important;gap:7px!important}
        body .wrap .grid .card .scores span{padding:6px 9px!important;font-size:9px!important}
        body .wrap .grid .card .body>strong{display:block!important;margin-top:2px!important;font-size:12px!important}
        body .wrap .grid .card .body p{position:static!important;transform:none!important;min-height:0!important;max-width:100%!important;margin:12px 0 15px!important;font-size:12.5px!important;line-height:1.5!important}
        body .wrap .grid .card .open{display:inline-block!important;margin-top:2px!important;font-size:9px!important}
        body .wrap .grid .rank{top:10px!important;left:10px!important}
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  installStableLoadingPaint();
  installCategoryCardLayout();

  function makeCover(){
    let cover=document.getElementById(COVER_ID);
    if(cover)return cover;
    cover=document.createElement('div');
    cover.id=COVER_ID;
    cover.setAttribute('role','status');
    cover.setAttribute('aria-live','polite');
    cover.innerHTML='<div style="width:min(420px,calc(100% - 40px));background:#fffdf8;border:1px solid #d8cec4;border-radius:24px;padding:28px;text-align:center;box-shadow:0 18px 55px rgba(58,43,32,.08)"><div style="font:950 27px/1 Arial,Helvetica,sans-serif;letter-spacing:-1.6px;display:inline-flex;align-items:flex-end">VYRDICT<span style="width:7px;height:7px;background:#e65f72;display:inline-block;margin:0 0 2px 2px"></span></div><div style="margin-top:14px;font:800 10px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f">Loading the verdict…</div></div>';
    Object.assign(cover.style,{position:'fixed',inset:'0',zIndex:'2147483647',background:'#f4ede5',display:'grid',placeItems:'center',fontFamily:'Arial,Helvetica,sans-serif'});
    (document.body||document.documentElement).appendChild(cover);
    return cover;
  }

  function showCover(){hardTop();makeCover()}

  function slug(v){
    return String(v||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function productSlug(){
    const m=decodeURIComponent(location.pathname||'').match(/^\/product\/([^/?#]+)/i);
    return m?m[1]:'';
  }

  let scoreRequest='';
  async function repairProductScores(){
    if(!onProduct())return;
    const rings=[...document.querySelectorAll('.productHero .ring')];
    if(rings.length<2)return;
    const values=rings.slice(0,2).map(r=>(r.querySelector('b')?.textContent||'').trim());
    if(values.every(v=>/^\d{1,3}$/.test(v)))return;
    const s=productSlug();
    if(!s||scoreRequest===s)return;
    scoreRequest=s;
    try{
      const r=await fetch(SCORE_ENDPOINT+'?slug='+encodeURIComponent(s),{cache:'no-store',headers:{accept:'application/json'}});
      if(!r.ok)throw new Error('score '+r.status);
      const d=await r.json(),p=d?.product||{};
      if(productSlug()!==s)return;
      const scores=[Number(p.viral_score),Number(p.worth_score)];
      scores.forEach((n,i)=>{
        if(!Number.isFinite(n)||!rings[i])return;
        const value=Math.max(0,Math.min(100,Math.round(n)));
        rings[i].style.setProperty('--s',String(value));
        const b=rings[i].querySelector('b');if(b)b.textContent=String(value);
      });
    }catch{}finally{if(productSlug()!==s)scoreRequest=''}
  }

  function scheduleScoreRepair(){[0,120,450,1000,2200].forEach(ms=>setTimeout(repairProductScores,ms))}

  function normalizePath(raw){
    if(!raw)return null;
    try{
      const u=new URL(raw,location.href);
      if(u.origin!==location.origin)return null;
      let out='';
      if(/^#\//.test(u.hash||''))out=u.hash.slice(1);
      else out=u.pathname+u.search+u.hash;
      const m=out.match(/^\/(product|category|collection)\/([^/?#]+)\/?(\?[^#]*)?(#.*)?$/i);
      if(m)return '/'+m[1].toLowerCase()+'/'+encodeURIComponent(decodeURIComponent(m[2]))+'/'+(m[3]||'')+(m[4]||'');
      if(/^\/(saved|search)(\?|#|$)/i.test(out))return out;
      return out||'/';
    }catch{return null}
  }

  function previousInternal(){
    if(onProduct())return '/';
    const here=location.pathname+location.search+location.hash;
    const stateFrom=normalizePath(history.state?.from);
    if(stateFrom&&stateFrom!==here)return stateFrom;
    const ref=normalizePath(document.referrer);
    if(ref&&ref!==here)return ref;
    return '/';
  }

  function destination(target){
    if(!target)return null;
    if(target.closest?.('input,textarea,select,option'))return null;

    const weeklyCard=target.closest?.('.vyrdict-weekly-extra-v8[data-slug],.vyrdict-weekly-extra-v7[data-slug],.vyrdict-weekly-extra-v6[data-slug],.vyrdict-weekly-extra-v5[data-slug],.vyrdict-weekly-extra-v4[data-slug]');
    if(weeklyCard?.dataset?.slug)return '/product/'+encodeURIComponent(weeklyCard.dataset.slug)+'/';

    const product=target.closest?.('[data-product]');
    if(product?.dataset?.product)return '/product/'+encodeURIComponent(product.dataset.product)+'/';

    const category=target.closest?.('[data-category]');
    if(category?.dataset?.category){const s=slug(category.dataset.category);if(s)return '/category/'+s+'/'}

    const collection=target.closest?.('[data-collection]');
    if(collection?.dataset?.collection)return '/collection/'+encodeURIComponent(collection.dataset.collection)+'/';

    if(target.closest?.('[data-back]'))return onProduct()?'/':previousInternal();

    if(target.closest?.('[data-search]')){
      const q=document.getElementById('q')?.value?.trim();
      return q?'/search?q='+encodeURIComponent(q):null;
    }

    const nav=target.closest?.('[data-nav]');
    if(nav){const href=nav.getAttribute('href')||nav.dataset.nav||'';return normalizePath(href)}

    const a=target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return null;
    const raw=a.getAttribute('href')||'';
    if(!raw||/^(mailto:|tel:|javascript:)/i.test(raw)||raw.startsWith('#'))return null;
    if(/history\.back\s*\(/i.test(a.getAttribute('onclick')||''))return onProduct()?'/':previousInternal();
    const dest=normalizePath(a.href);
    if(!dest)return null;
    const here=location.pathname+location.search+location.hash;
    if(dest===here)return null;
    if(dest.startsWith(location.pathname+location.search+'#'))return null;
    return dest;
  }

  function go(dest,replace=false){
    const d=normalizePath(dest)||'/';
    showCover();
    setTimeout(()=>{replace?location.replace(d):location.assign(d)},0);
  }

  function ownNavigation(e,dest,replace=false){
    if(!dest)return false;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    go(dest,replace);
    return true;
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    ownNavigation(e,destination(e.target));
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.target?.id!=='q')return;
    const q=String(e.target.value||'').trim();
    if(q)ownNavigation(e,'/search?q='+encodeURIComponent(q));
  },true);

  function takeRouterOwnership(attempt=0){
    let installed=false;
    try{
      if(typeof window.nav==='function'&&!window.nav.__vyrdictCanonical){
        const stableNav=function(u){go(u)};
        stableNav.__vyrdictCanonical=1;
        window.nav=stableNav;
        installed=true;
      }
      if(typeof window.smartBack==='function'&&!window.smartBack.__vyrdictCanonical){
        const stableBack=function(){go(onProduct()?'/':previousInternal())};
        stableBack.__vyrdictCanonical=1;
        window.smartBack=stableBack;
        installed=true;
      }
    }catch{}
    if(attempt<30&&(!installed||typeof window.nav!=='function'))setTimeout(()=>takeRouterOwnership(attempt+1),50);
  }
  takeRouterOwnership();

  function stabilizeHistory(e){
    try{e?.stopImmediatePropagation?.()}catch{}
    const dest=normalizePath(location.href)||'/';
    showCover();
    setTimeout(()=>location.replace(dest),0);
  }
  addEventListener('popstate',stabilizeHistory,true);
  addEventListener('hashchange',()=>{if(/^#\//.test(location.hash||''))stabilizeHistory()},true);

  addEventListener('pageshow',()=>{
    hardTop();
    installStableLoadingPaint();
    installCategoryCardLayout();
    document.getElementById(COVER_ID)?.remove();
    scheduleScoreRepair();
    requestAnimationFrame(()=>requestAnimationFrame(hardTop));
  },true);

  const observeApp=()=>{const app=document.getElementById('app');if(app)new MutationObserver(()=>scheduleScoreRepair()).observe(app,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{observeApp();installCategoryCardLayout();scheduleScoreRepair()},{once:true});else{observeApp();installCategoryCardLayout();scheduleScoreRepair()}

  hardTop();
})();