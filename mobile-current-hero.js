(()=>{
  if(window.__vyrdictMobileCurrentHeroRetiredV1)return;
  window.__vyrdictMobileCurrentHeroRetiredV1=1;
  window.__vyrdictDisableLegacyHeroMotion=1;

  /*
    Retired: the old mobile hero continuously recreated a layer that the
    current editorial homepage intentionally removes. On slower phones the
    two scripts could fight each other and cause visible layout twitching.
    Keep this tiny cleanup shim for visitors with a cached bundle that still
    references mobile-current-hero.js.
  */
  function clean(){
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.getElementById('vyrdict-mobile-motion-layer')?.remove();
    document.getElementById('vyrdict-mobile-hero-primary-layer')?.remove();
    document.querySelectorAll('.hero.vyrdict-current-static,.hero.vyrdict-fullwidth-motion').forEach(el=>{
      el.classList.remove('vyrdict-current-static','vyrdict-fullwidth-motion');
      el.style.removeProperty('--vyrdict-static-hero-h');
      el.style.removeProperty('--vyrdict-hero-h');
    });
    try{delete document.documentElement.dataset.vyrdictCurrentHero}catch{}
  }

  clean();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
  addEventListener('pageshow',()=>setTimeout(clean,0));
})();
