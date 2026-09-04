(()=>{
  if(window.__vyrdictMobileLegacyDisabledV2)return;
  window.__vyrdictMobileLegacyDisabledV2=1;

  // This file used to rewrite the homepage back to the legacy static mobile hero.
  // It is intentionally retained as a compatibility shim because older cached
  // homepage shells may still request /homepage-mobile-final.js?v=1.
  const isHome=()=>location.pathname==='/'||location.pathname==='';

  function cleanup(){
    document.getElementById('vyrdict-mobile-final-style')?.remove();
    document.querySelectorAll('.v-home-category-more').forEach(el=>el.remove());
    const hero=document.querySelector('.hero');
    if(hero){
      hero.classList.remove('vyrdict-current-static');
      document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    }
  }

  function loadCurrentHero(){
    if(!isHome())return;
    cleanup();
    if(document.getElementById('vyrdict-hero-v9-mobile-rescue'))return;
    const s=document.createElement('script');
    s.id='vyrdict-hero-v9-mobile-rescue';
    s.src='/homepage-hero-variety.js?v=9-20260904-mobile-rescue';
    s.async=false;
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCurrentHero,{once:true});
  else loadCurrentHero();
  addEventListener('pageshow',()=>setTimeout(loadCurrentHero,0));
  addEventListener('popstate',()=>setTimeout(loadCurrentHero,20));
})();
