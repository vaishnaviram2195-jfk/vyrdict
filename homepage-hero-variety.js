(()=>{
  // Retired on the editorial homepage. The old animated hero continuously
  // rebuilt its layer and could fight the new Hype Check section for layout,
  // causing visible twitching and scroll-position jumps.
  if(window.__vyrdictHeroV10)return;
  window.__vyrdictHeroV10=1;
  window.__vyrdictDisableLegacyHeroMotion=1;

  const clean=()=>{
    document.getElementById('vyrdict-hero-v8-layer')?.remove();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.getElementById('vyrdict-mobile-motion-layer')?.remove();
    document.getElementById('vyrdict-mobile-hero-primary-layer')?.remove();
    document.getElementById('vyrdict-hero-v8-style')?.remove();
    document.querySelectorAll('.hero.vyrdict-hero-v8,.hero.vyrdict-current-static,.hero.vyrdict-fullwidth-motion').forEach(el=>{
      el.classList.remove('vyrdict-hero-v8','vyrdict-current-static','vyrdict-fullwidth-motion');
      el.style.removeProperty('--vyrdict-hero-h');
    });
  };

  clean();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean,{once:true});
  addEventListener('pageshow',()=>setTimeout(clean,0));
})();
