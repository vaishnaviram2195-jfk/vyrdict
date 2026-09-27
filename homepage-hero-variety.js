(()=>{
  // The original product collage is the homepage design. Keep it in place
  // instead of animating unrelated product images across the copy.
  if(window.__vyrdictStableHero)return;
  window.__vyrdictStableHero=1;
  const STYLE_ID='vyrdict-stable-hero-style';
  const HOME=()=>location.pathname==='/'||location.pathname==='';

  function settle(){
    if(!HOME())return;
    const hero=document.querySelector('.hero');
    const stage=hero?.querySelector('.stage');
    if(!hero||!stage)return;
    if(!document.getElementById(STYLE_ID)){
      const style=document.createElement('style');
      style.id=STYLE_ID;
      style.textContent=`
        body .hero .stage{visibility:visible!important;opacity:1!important;pointer-events:auto!important}
        #vyrdict-hero-v8-layer,#vyrdict-mobile-current-static-layer,
        #vyrdict-mobile-motion-layer,#vyrdict-mobile-hero-primary-layer{display:none!important}
      `;
      document.head.appendChild(style);
    }
    hero.classList.remove('vyrdict-hero-v8','vyrdict-current-static','vyrdict-fullwidth-motion','vyrdict-mobile-motion-fallback','vyrdict-mobile-hero-primary');
    hero.removeAttribute('data-vyrdict-hero-version');
    hero.style.removeProperty('--vyrdict-hero-h');
    hero.style.removeProperty('--vyrdict-static-hero-h');
    for(const id of ['vyrdict-hero-v8-layer','vyrdict-mobile-current-static-layer','vyrdict-mobile-motion-layer','vyrdict-mobile-hero-primary-layer'])document.getElementById(id)?.remove();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
  addEventListener('popstate',()=>setTimeout(settle,20));
  addEventListener('pageshow',()=>setTimeout(settle,20));
})();
