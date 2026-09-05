(()=>{
  if(window.__vyrdictSpaNavigationFastV1)return;
  window.__vyrdictSpaNavigationFastV1=1;

  const normPath=p=>{try{return new URL(p,location.href).pathname}catch{return String(p||'')}};
  const onProduct=()=>/^\/product\/[^/]+\/?$/i.test(location.pathname||'');

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

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const t=e.target instanceof Element?e.target:null;if(!t)return;

    const home=t.closest?.('[data-vyrdict-home="1"]');
    if(home&&typeof window.nav==='function'){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      try{window.nav('/')}catch{history.pushState({vyrdict:true,from:location.pathname+location.search},'','/');window.route?.()}
      return;
    }

    const dest=productDest(t);if(!dest||typeof window.nav!=='function')return;
    remember();
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    window.nav(dest);
  },true);
})();
