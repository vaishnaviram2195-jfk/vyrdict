(()=>{
  if(window.__vyrdictSpaNavigationFastV2)return;
  window.__vyrdictSpaNavigationFastV2=1;

  const INITIAL_PATH=location.pathname||'/';
  const INITIAL_NON_HOME=INITIAL_PATH!=='/'&&INITIAL_PATH!=='';
  const normPath=p=>{try{return new URL(p,location.href).pathname}catch{return String(p||'')}};
  const onProduct=()=>/^\/product\/[^/]+\/?$/i.test(location.pathname||'');
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const needsCompactTitle=()=>/^\/(?:collection(?:\/|$)|saved\/?$|search\/?$)/i.test(location.pathname||'');

  function installStabilityCss(){
    if(document.getElementById('vyrdict-route-stability-v2'))return;
    const s=document.createElement('style');
    s.id='vyrdict-route-stability-v2';
    s.textContent=`
      #vyrdict-growth-entry{display:none!important}
      html[data-vyrdict-compact-title="1"] body h1{font-size:clamp(36px,4vw,54px)!important;line-height:.98!important;letter-spacing:-.045em!important}
      html[data-vyrdict-home="1"] #vyrdict-hero-v8-layer,
      html[data-vyrdict-home="1"] #vyrdict-mobile-current-static-layer,
      html[data-vyrdict-home="1"] #vyrdict-mobile-motion-layer,
      html[data-vyrdict-home="1"] #vyrdict-mobile-hero-primary-layer{display:none!important}
      html[data-vyrdict-home="1"] body .hero .stage .p4,
      html[data-vyrdict-home="1"] body .hero .stage .p5,
      html[data-vyrdict-home="1"] body .hero .stage .p6{display:none!important}
      @media(max-width:700px){html[data-vyrdict-compact-title="1"] body h1{font-size:clamp(34px,10vw,44px)!important;line-height:1!important}}
    `;
    document.head.appendChild(s);
  }

  function syncRouteUi(){
    installStabilityCss();
    document.documentElement.dataset.vyrdictHome=isHome()?'1':'0';
    document.documentElement.dataset.vyrdictCompactTitle=needsCompactTitle()?'1':'0';
    // This section was an unapproved experiment. Hide/remove any copy that may
    // still be alive in an older cached SPA session.
    const growth=document.getElementById('vyrdict-growth-entry');
    if(growth)growth.style.setProperty('display','none','important');
  }

  function productDest(target){
    if(!target||onProduct())return '';
    const weekly=target.closest?.('[data-slug]');
    const ws=weekly?.dataset?.slug;
    if(ws&&weekly.closest?.('.vyrdict-weekly-section-v8,.vyrdict-weekly-section-v7,.vyrdict-weekly-section-v6,.vyrdict-weekly-section-v5'))return '/product/'+encodeURIComponent(ws)+'/';
    const p=target.closest?.('[data-product]');
    if(p?.dataset?.product)return '/product/'+encodeURIComponent(p.dataset.product)+'/';
    const a=target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return '';
    const path=normPath(a.href);
    return /^\/product\/[^/]+\/?$/i.test(path)?path:'';
  }

  function remember(){
    try{history.replaceState({...(history.state||{}),vyrdictReturnY:Math.round(scrollY)},'',location.href)}catch{}
  }

  function lockVerifiedCount(){
    if(!isHome())return;
    const candidates=[...document.querySelectorAll('button,a,[role="button"]')];
    for(const el of candidates){
      const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
      if(/^BROWSE\s+\d+\+\s+VERIFIED PRODUCTS$/i.test(text)||/^BROWSE\s+250\+\s+VERIFIED PRODUCTS$/i.test(text)){
        el.textContent='BROWSE 250+ VERIFIED PRODUCTS';
      }
    }
  }

  function hardHome(){
    if(isHome())return false;
    location.assign('/');
    return true;
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const t=e.target instanceof Element?e.target:null;if(!t)return;

    const home=t.closest?.('[data-vyrdict-home="1"]');
    const anchor=t.closest?.('a[href]');
    const sameOriginHome=anchor&&anchor.target!=='_blank'&&!anchor.hasAttribute('download')&&normPath(anchor.href)==='/';
    if((home||sameOriginHome)&&!isHome()){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      hardHome();
      return;
    }

    const dest=productDest(t);if(!dest||typeof window.nav!=='function')return;
    remember();
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    window.nav(dest);
  },true);

  const apply=()=>{
    syncRouteUi();
    lockVerifiedCount();
    setTimeout(()=>{syncRouteUi();lockVerifiedCount()},80);
    setTimeout(()=>{syncRouteUi();lockVerifiedCount()},350);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('pageshow',apply);
  addEventListener('popstate',()=>{
    syncRouteUi();
    // Collection/saved/search pages are served by the generic SPA shell. If a
    // browser-back transition reaches Home from one of those shells, reload the
    // canonical Home endpoint so an older homepage snapshot cannot resurface.
    if(INITIAL_NON_HOME&&isHome()){
      location.replace('/');
      return;
    }
    apply();
  });
  new MutationObserver(()=>{
    clearTimeout(window.__vyrdictRouteStabilityTimer);
    window.__vyrdictRouteStabilityTimer=setTimeout(()=>{syncRouteUi();lockVerifiedCount()},30);
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
