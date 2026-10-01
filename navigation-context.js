(()=>{
  if(window.__vyrdictNavigationContextV7)return;
  window.__vyrdictNavigationContextV7=1;

  const STORE_PREFIX='vyrdict:return-context:v2:';
  const LAST_NAV_KEY='vyrdict:last-product-nav:v2';
  const onHome=()=>location.pathname==='/'||location.pathname==='';
  const onProduct=()=>/^\/product\//i.test(location.pathname||'');
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const nativeScrollTo=window.scrollTo.bind(window);

  try{history.scrollRestoration='manual'}catch{}

  const coreNav=typeof window.nav==='function'?window.nav.bind(window):null;
  const coreBack=typeof window.smartBack==='function'?window.smartBack.bind(window):null;
  try{if(typeof window.nav==='function')window.nav.__vyrdictCanonical=1}catch{}
  try{if(typeof window.smartBack==='function')window.smartBack.__vyrdictCanonical=1}catch{}

  function clearCatalogCaches(){
    try{
      for(const k of Object.keys(localStorage)){
        if(/^vyrdict:catalog-cache:v\d+$/i.test(k))localStorage.removeItem(k);
      }
    }catch{}
  }

  function topOnce(){
    window.__vyrdictRestoreSerial=Date.now();
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{nativeScrollTo({top:0,left:0,behavior:'auto'})}catch{try{nativeScrollTo(0,0)}catch{}}
  }

  function internalPath(raw){
    if(!raw)return null;
    try{
      const u=new URL(raw,location.href);
      if(u.origin!==location.origin)return null;
      if(/^#\//.test(u.hash||''))return u.hash.slice(1);
      return u.pathname+u.search+u.hash;
    }catch{return null}
  }

  function normalizePath(raw){
    const p=internalPath(raw);
    if(!p)return null;
    if(p.startsWith('#'))return null;
    const m=p.match(/^\/(product|category|collection)\/([^/?#]+)\/?(\?[^#]*)?(#.*)?$/i);
    if(m)return '/'+m[1].toLowerCase()+'/'+encodeURIComponent(decodeURIComponent(m[2]))+'/'+(m[3]||'')+(m[4]||'');
    if(/^\/(saved|search)(\?|#|$)/i.test(p))return p;
    if(p==='/'||p.startsWith('/?')||p.startsWith('/#'))return p;
    return p;
  }

  function isPlainHomeTarget(target){
    const el=target?.closest?.('a[href],a[data-vyrdict-home="1"],button[data-vyrdict-home="1"]');
    if(!el)return false;
    if(el.matches?.('[data-vyrdict-home="1"]'))return true;
    const raw=el.getAttribute?.('href')||'';
    if(!raw)return false;
    try{
      const u=new URL(raw,location.href);
      return u.origin===location.origin&&u.pathname==='/'&&!u.search&&!u.hash;
    }catch{return false}
  }

  function sectionContext(target){
    const sec=target?.closest?.('section,.section,[data-section]')||null;
    const heading=sec?.querySelector?.('h1,h2,h3,h4,[role="heading"]')||null;
    return {id:sec?.id||'',label:norm(heading?.textContent||''),top:sec?Math.round(scrollY+sec.getBoundingClientRect().top):Math.round(scrollY)};
  }

  function saveProductOrigin(target,dest){
    const from=location.pathname+location.search+location.hash;
    const section=sectionContext(target);
    const state={...(history.state||{}),vyrdictReturnY:Math.round(scrollY),vyrdictReturnSection:section};
    try{history.replaceState(state,'',location.href)}catch{}
    const ctx={from,dest:dest.split('#')[0],y:Math.round(scrollY),section,ts:Date.now()};
    try{
      sessionStorage.setItem(STORE_PREFIX+ctx.dest,JSON.stringify(ctx));
      sessionStorage.setItem(LAST_NAV_KEY,JSON.stringify(ctx));
    }catch{}
    return ctx;
  }

  function markProductState(ctx){
    if(!ctx||!onProduct())return;
    try{history.replaceState({...(history.state||{}),vyrdictProductFrom:ctx.from},'',location.href)}catch{}
  }

  function spaGo(dest,{replace=false,productCtx=null}={}){
    const d=normalizePath(dest)||'/';
    const here=location.pathname+location.search+location.hash;
    if(d===here)return;
    let routed=false;
    try{
      if(!replace&&coreNav){coreNav(d);routed=true}
      else if(typeof window.route==='function'){
        const from=location.pathname+location.search;
        replace?history.replaceState({vyrdict:true,from},'',d):history.pushState({vyrdict:true,from},'',d);
        window.route();
        routed=true;
      }
    }catch{}
    if(!routed){replace?location.replace(d):location.assign(d);return}
    if(productCtx)markProductState(productCtx);
    requestAnimationFrame(topOnce);
  }

  function homeNavKind(target){
    const a=target?.closest?.('a,button');
    if(!a)return null;
    const text=norm(a.textContent||'');
    const href=String(a.getAttribute?.('href')||'').toLowerCase();
    if(text==='explore'||href==='/#viral'||href==='#viral'||href==='/#explore'||href==='#explore')return 'explore';
    if(text==='categories'||href==='/#categories'||href==='#categories')return 'categories';
    if(text==='culture'||href==='/#culture'||href==='#culture')return 'culture';
    return null;
  }

  function findHomeTarget(kind){
    if(kind==='explore')return document.getElementById('viral')||document.getElementById('trending-index')||document.querySelector('[data-section="viral"],.vyrdict-index-gallery');
    if(kind==='categories')return document.getElementById('categories')||document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category');
    if(kind==='culture')return document.getElementById('culture')||document.querySelector('[data-section="culture"],.culture-section,#ve-culture-trio');
    return null;
  }

  function scrollHome(kind,attempt=0){
    const target=findHomeTarget(kind);
    if(!target){if(attempt<20)setTimeout(()=>scrollHome(kind,attempt+1),120);return false}
    const y=Math.max(0,target.getBoundingClientRect().top+window.scrollY-92);
    nativeScrollTo({top:y,left:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}
    return true;
  }

  function hardDestination(target){
    const a=target?.closest?.('a[href]');
    if(!a)return null;
    const raw=a.getAttribute('href')||'';
    if(!raw)return null;
    try{
      const u=new URL(raw,location.href);
      if(u.origin!==location.origin)return null;
      if(u.pathname==='/account.html')return '/account.html';
      if(u.pathname==='/saved'||u.pathname==='/saved/')return '/saved';
      if(/^\/collection\/viral-right-now\/?$/i.test(u.pathname))return u.pathname+(u.search||'?live=1');
      if(/\.html$/i.test(u.pathname))return u.pathname+u.search+u.hash;
    }catch{}
    return null;
  }

  function destination(target){
    if(!target||target.closest?.('input,textarea,select,option'))return null;
    const product=target.closest?.('[data-product]');
    if(product?.dataset?.product)return '/product/'+encodeURIComponent(product.dataset.product)+'/';
    const weekly=target.closest?.('[data-slug]');
    if(weekly?.dataset?.slug&&weekly.closest?.('.vyrdict-weekly-section-v8,.vyrdict-weekly-section-v7,.vyrdict-weekly-section-v6,.vyrdict-weekly-section-v5,.vyrdict-weekly-extra-v8,.vyrdict-weekly-extra-v7,.vyrdict-weekly-extra-v6,.vyrdict-weekly-extra-v5'))return '/product/'+encodeURIComponent(weekly.dataset.slug)+'/';
    const category=target.closest?.('[data-category]');
    if(category?.dataset?.category){const s=String(category.dataset.category).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');if(s)return '/category/'+s+'/'}
    const collection=target.closest?.('[data-collection]');
    if(collection?.dataset?.collection)return '/collection/'+encodeURIComponent(collection.dataset.collection)+'/';
    const nav=target.closest?.('[data-nav]');
    if(nav){const p=normalizePath(nav.getAttribute('href')||nav.dataset.nav||'');if(p)return p}
    const a=target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return null;
    const raw=a.getAttribute('href')||'';
    if(!raw||/^(mailto:|tel:|javascript:)/i.test(raw)||raw.startsWith('#'))return null;
    return normalizePath(a.href);
  }

  function currentProductContext(){
    const key=STORE_PREFIX+(location.pathname+location.search).split('#')[0];
    try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch{return null}
  }

  function isBackTarget(target){
    if(!target)return false;
    if(target.closest?.('[data-back]'))return true;
    const c=target.closest?.('a,button,[role="button"]');
    if(!c)return false;
    const text=norm(c.textContent||c.getAttribute?.('aria-label')||'');
    return text==='back'||text==='go back'||/^back to\b/.test(text)||/history\.back\s*\(|smartBack\s*\(/i.test(c.getAttribute?.('onclick')||'');
  }

  function restorePosition(state){
    if(onProduct())return;
    const y=Number(state?.vyrdictReturnY);
    const saved=state?.vyrdictReturnSection;
    if(!Number.isFinite(y)&&!saved)return;
    const serial=Date.now();
    window.__vyrdictRestoreSerial=serial;
    [0,70,180,420].forEach(ms=>setTimeout(()=>{
      if(window.__vyrdictRestoreSerial!==serial||onProduct())return;
      const maxY=Math.max(0,document.documentElement.scrollHeight-innerHeight);
      if(Number.isFinite(y))nativeScrollTo({top:Math.min(Math.max(0,y),maxY),left:0,behavior:'auto'});
      else if(saved?.id)document.getElementById(saved.id)?.scrollIntoView({block:'start',behavior:'auto'});
    },ms));
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const target=e.target;

    if(isPlainHomeTarget(target)){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(onHome()){
        try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}
        topOnce();
      }else location.assign('/');
      return;
    }

    const kind=homeNavKind(target);
    if(kind){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(onHome())scrollHome(kind);
      else location.assign('/#'+(kind==='explore'?'viral':kind));
      return;
    }

    const hard=hardDestination(target);
    if(hard){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(/^\/collection\/viral-right-now\//i.test(hard))clearCatalogCaches();
      location.assign(hard);
      return;
    }

    if(isBackTarget(target)&&onProduct()){
      const ctx=currentProductContext();
      if(ctx&&history.length>1){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();history.back();return}
      if(coreBack){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();coreBack();return}
    }

    const dest=destination(target);
    if(!dest)return;
    const here=location.pathname+location.search+location.hash;
    if(dest===here)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    const productDest=/^\/product\//i.test(dest);
    const ctx=productDest?saveProductOrigin(target,dest):null;
    spaGo(dest,{productCtx:ctx});
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.target?.id!=='q')return;
    const q=String(e.target.value||'').trim();
    if(!q)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    spaGo('/search?q='+encodeURIComponent(q));
  },true);

  function handleInitialHomeHash(){
    if(!onHome())return;
    const h=(location.hash||'').toLowerCase();
    if(h==='#viral'||h==='#explore')scrollHome('explore');
    else if(h==='#categories')scrollHome('categories');
    else if(h==='#culture')scrollHome('culture');
  }

  addEventListener('popstate',()=>{
    window.__vyrdictRestoreSerial=Date.now();
    const state=history.state||{};
    if(onHome()){
      if(location.hash){setTimeout(handleInitialHomeHash,40);return}
      if(Number.isFinite(Number(state.vyrdictReturnY))||state.vyrdictReturnSection){restorePosition(state);return}
      requestAnimationFrame(topOnce);
      return;
    }
    if(!onProduct()&&(Number.isFinite(Number(state.vyrdictReturnY))||state.vyrdictReturnSection))restorePosition(state);
    else requestAnimationFrame(topOnce);
  },true);

  addEventListener('pageshow',e=>{
    if(!e.persisted)return;
    window.__vyrdictRestoreSerial=Date.now();
    if(onHome()&&location.hash){setTimeout(handleInitialHomeHash,40);return}
    const state=history.state||{};
    if(!onProduct()&&(Number.isFinite(Number(state.vyrdictReturnY))||state.vyrdictReturnSection))restorePosition(state);
  },true);
})();
