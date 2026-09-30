(()=>{
  if(window.__vyrdictSpaNavigationFastV3)return;
  window.__vyrdictSpaNavigationFastV3=1;

  const normPath=p=>{try{return new URL(p,location.href).pathname}catch{return String(p||'')}};
  const onProduct=()=>/^\/product\/[^/]+\/?$/i.test(location.pathname||'');
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const needsCompactTitle=()=>/^\/(?:collection(?:\/|$)|saved\/?$|search\/?$)/i.test(location.pathname||'');

  function hardTop(){
    try{history.scrollRestoration='manual'}catch{}
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{if(document.scrollingElement)document.scrollingElement.scrollTop=0}catch{}
    try{document.documentElement.scrollTop=0}catch{}
    try{document.body.scrollTop=0}catch{}
    try{window.scrollTo(0,0)}catch{}
  }

  function settleHomeTop(){
    if(!isHome())return;
    window.__vyrdictRestoreSerial=Date.now();
    hardTop();
    requestAnimationFrame(hardTop);
    setTimeout(hardTop,50);
    setTimeout(hardTop,160);
  }

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
      if(/^BROWSE\s+\d+\+\s+VERIFIED PRODUCTS$/i.test(text)||/^BROWSE\s+250\+\s+VERIFIED PRODUCTS$/i.test(text))el.textContent='BROWSE 250+ VERIFIED PRODUCTS';
    }
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const t=e.target instanceof Element?e.target:null;if(!t)return;

    const home=t.closest?.('a[data-vyrdict-home="1"],button[data-vyrdict-home="1"]');
    const anchor=t.closest?.('a[href]');
    let plainHome=false;
    if(anchor&&anchor.target!=='_blank'&&!anchor.hasAttribute('download')){
      try{const u=new URL(anchor.href,location.href);plainHome=u.origin===location.origin&&u.pathname==='/'&&!u.search&&!u.hash}catch{}
    }
    if(home||plainHome){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(isHome()){
        try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}
        settleHomeTop();
      }else location.assign('/');
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
    if(isHome()&&!location.hash)settleHomeTop();
    setTimeout(()=>{syncRouteUi();lockVerifiedCount()},80);
    setTimeout(()=>{syncRouteUi();lockVerifiedCount()},350);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('pageshow',apply);
  addEventListener('popstate',()=>{
    syncRouteUi();
    if(isHome()&&!location.hash)settleHomeTop();
    apply();
  });
  new MutationObserver(()=>{
    clearTimeout(window.__vyrdictRouteStabilityTimer);
    window.__vyrdictRouteStabilityTimer=setTimeout(()=>{syncRouteUi();lockVerifiedCount()},30);
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
