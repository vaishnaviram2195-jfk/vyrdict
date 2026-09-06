(()=>{
  if(window.__vyrdictTrendingActiveCategoriesV2)return;
  window.__vyrdictTrendingActiveCategoriesV2=1;
  function sync(attempt=0){
    const section=document.querySelector('.vyrdict-index-claw');
    if(!section){if(attempt<60)setTimeout(()=>sync(attempt+1),80);return}
    [...section.querySelectorAll('.vti-cat')].forEach(btn=>{btn.classList.remove('vti-cat-unavailable');btn.removeAttribute('aria-hidden');btn.tabIndex=0;btn.style.removeProperty('display')});
    const ph=section.querySelector('.vti-placeholder');if(ph)ph.textContent='Scanning today’s live signals…';
    const hint=section.querySelector('.vti-hint');if(hint)hint.textContent='Fresh products refresh continuously across every category.';
  }
  window.addEventListener('vyrdict:trending-data',()=>sync());
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>sync(),{once:true});else sync();
  setTimeout(()=>sync(),500);setTimeout(()=>sync(),1400);
})();