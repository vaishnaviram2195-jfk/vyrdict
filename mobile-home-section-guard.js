(()=>{
  if(window.__vyrdictMobileHomeSectionGuardV1)return;
  window.__vyrdictMobileHomeSectionGuardV1=1;

  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const MOBILE=()=>matchMedia('(max-width:760px)').matches;
  let observer=null,timer=0;

  function load(src,id){
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;s.src=src;s.defer=true;
    document.head.appendChild(s);
  }

  function cleanupLegacyViral(){
    const current=document.querySelector('.vyrdict-index-gallery,#trending-index.vyrdict-index-gallery');
    const legacy=document.getElementById('viral');
    if(current&&legacy&&legacy!==current)legacy.remove();
  }

  function healthySkip(sec){
    if(!sec)return false;
    const rail=sec.querySelector('.rail,[data-rail]');
    return !!rail&&rail.children.length>0;
  }

  function restoreSkip(){
    let sec=document.getElementById('skip-list');
    if(sec&&!healthySkip(sec)){
      sec.remove();sec=null;
      try{delete window.__vyrdictSkipReliableV1}catch{}
    }
    if(sec){
      sec.hidden=false;
      sec.removeAttribute('hidden');
      sec.style.removeProperty('display');
      sec.style.removeProperty('visibility');
      sec.style.removeProperty('opacity');
      return;
    }
    load('/skip-list-reliable.js?v=2-20260909-mobilefix','vyrdict-mobile-skip-current');
    load('/skip-cta-fix.js?v=2-20260909-mobilefix','vyrdict-mobile-skip-cta-current');
  }

  function ensureTrending(){
    if(document.querySelector('.vyrdict-index-gallery')){
      cleanupLegacyViral();
      return;
    }
    load('/trending-index-claw.js?v=5-20260909-mobilefix','vyrdict-mobile-trending-current');
  }

  function apply(){
    if(!HOME()||!MOBILE())return;
    ensureTrending();
    cleanupLegacyViral();
    restoreSkip();
  }

  function schedule(){
    clearTimeout(timer);timer=setTimeout(apply,40);
    [150,400,900,1800,3500].forEach(ms=>setTimeout(apply,ms));
  }

  function watch(){
    if(observer)return;
    const target=document.getElementById('app')||document.body;
    if(!target)return;
    observer=new MutationObserver(()=>{
      if(!HOME()||!MOBILE())return;
      clearTimeout(timer);timer=setTimeout(()=>{
        cleanupLegacyViral();restoreSkip();ensureTrending();
      },70);
    });
    observer.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
  }

  const start=()=>{watch();schedule()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',schedule);
  addEventListener('popstate',schedule);
  addEventListener('resize',schedule,{passive:true});
})();
