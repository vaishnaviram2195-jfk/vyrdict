(()=>{
  if(window.__vyrdictMobileHomeStabilityV1)return;
  window.__vyrdictMobileHomeStabilityV1=1;
  if((location.pathname||'/')!=='/'||!matchMedia('(max-width:900px)').matches)return;

  window.__vyrdictDisableLegacyHeroMotion=1;

  const id='vyrdict-mobile-home-stability-style';
  if(!document.getElementById(id)){
    const s=document.createElement('style');
    s.id=id;
    s.textContent=`
      @media(max-width:900px){
        #vyrdict-editorial-home .ve-reveal{opacity:1!important;transform:none!important;transition:none!important}
        #vyrdict-editorial-home .ve-float{animation:none!important;transition:none!important}
        #vyrdict-editorial-home .ve-motion-img{transition:none!important}
        #vyrdict-editorial-home img{content-visibility:auto}
        #vyrdict-editorial-home section{overflow-anchor:none}
      }
    `;
    document.head.appendChild(s);
  }

  function cleanLegacyHero(){
    document.getElementById('vyrdict-hero-v8-layer')?.remove();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.getElementById('vyrdict-mobile-motion-layer')?.remove();
    document.getElementById('vyrdict-mobile-hero-primary-layer')?.remove();
    document.querySelectorAll('.hero.vyrdict-hero-v8,.hero.vyrdict-current-static,.hero.vyrdict-fullwidth-motion').forEach(el=>{
      el.classList.remove('vyrdict-hero-v8','vyrdict-current-static','vyrdict-fullwidth-motion');
      el.style.removeProperty('--vyrdict-static-hero-h');
      el.style.removeProperty('--vyrdict-hero-h');
    });
  }

  cleanLegacyHero();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanLegacyHero,{once:true});
})();
