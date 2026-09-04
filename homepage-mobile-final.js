(()=>{
  if(window.__vyrdictMobileLegacyDisabledV3)return;
  window.__vyrdictMobileLegacyDisabledV3=1;

  // Compatibility rescue for older cached homepage shells. This file used to
  // force the legacy static mobile homepage. It now does the opposite: remove
  // legacy mobile overrides and load the current homepage modules.
  const isHome=()=>location.pathname==='/'||location.pathname==='';

  function cleanup(){
    document.getElementById('vyrdict-mobile-final-style')?.remove();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.querySelectorAll('.v-home-category-more').forEach(el=>el.remove());
    const hero=document.querySelector('.hero');
    hero?.classList.remove('vyrdict-current-static');
    try{
      for(const k of Object.keys(localStorage)){
        if(/^vyrdict:bundle-cache:v(?:15|16|17)$/.test(k))localStorage.removeItem(k);
      }
    }catch{}
  }

  function add(src,id){
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }

  function rescue(){
    if(location.hostname==='www.vyrdict.com'){
      location.replace('https://vyrdict.com'+location.pathname+location.search+location.hash);
      return;
    }
    if(!isHome())return;
    cleanup();
    add('/homepage-hero-variety.js?v=9-20260904-mobile-rescue','vyrdict-hero-v9-mobile-rescue');
    add('/growth-retention.js?v=2-20260904-mobile-rescue','vyrdict-growth-v2-mobile-rescue');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',rescue,{once:true});else rescue();
  addEventListener('pageshow',()=>setTimeout(rescue,0));
  addEventListener('popstate',()=>setTimeout(rescue,20));
})();
