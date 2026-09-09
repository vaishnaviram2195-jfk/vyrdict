(()=>{
  if(window.__vyrdictTrendingHeadingCleanupV1)return;
  window.__vyrdictTrendingHeadingCleanupV1=1;

  function clean(attempt=0){
    const section=document.querySelector('.vyrdict-index-gallery');
    if(!section){if(attempt<80)setTimeout(()=>clean(attempt+1),80);return}

    const kicker=section.querySelector('.vtg-kicker');
    if(kicker)kicker.remove();

    const sub=section.querySelector('.vtg-sub');
    if(sub)sub.textContent='See what’s trending now.';
  }

  window.addEventListener('vyrdict:trending-data',()=>setTimeout(()=>clean(),30));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>clean(),{once:true});
  else clean();
  setTimeout(()=>clean(),400);
  setTimeout(()=>clean(),1200);
})();
