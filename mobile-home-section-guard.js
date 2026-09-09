(()=>{
  if(window.__vyrdictMobileHomeSectionGuardV3)return;
  window.__vyrdictMobileHomeSectionGuardV3=1;

  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const MOBILE=()=>matchMedia('(max-width:760px)').matches;
  let observer=null,timer=0,trendForceAt=0,trendForceSeq=0;

  function load(src,id){
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;s.src=src;s.defer=true;
    document.head.appendChild(s);
  }

  function legacyTrendSections(){
    const current=document.querySelector('.vyrdict-index-gallery,#trending-index.vyrdict-index-gallery');
    const found=new Set();
    document.querySelectorAll('#viral,.weekly-ranking,.weekly-rankings,[data-section="weekly-ranking"],[data-section="weekly-rankings"]').forEach(el=>{
      if(el&&el!==current)found.add(el.closest('section')||el);
    });
    document.querySelectorAll('section').forEach(sec=>{
      if(sec===current||current?.contains(sec))return;
      const match=[...sec.querySelectorAll('h1,h2,h3')].some(h=>
        (h.textContent||'').trim().toLowerCase().replace(/\.$/,'')==='weekly viral rankings'
      );
      if(match)found.add(sec);
    });
    return [...found].filter(el=>el&&el!==current);
  }

  function concealLegacyTrend(){
    if(!HOME()||!MOBILE())return;
    if(document.querySelector('.vyrdict-index-gallery'))return;
    legacyTrendSections().forEach(el=>{
      if(el.dataset.vyrdictLegacyTrendPending==='1')return;
      el.dataset.vyrdictLegacyTrendPending='1';
      el.style.setProperty('display','none','important');
    });
  }

  function cleanupLegacyAfterCurrent(){
    const current=document.querySelector('.vyrdict-index-gallery,#trending-index.vyrdict-index-gallery');
    if(!current)return false;
    legacyTrendSections().forEach(el=>el.remove());
    return true;
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

  function forceTrending(){
    if(cleanupLegacyAfterCurrent())return;
    const legacy=legacyTrendSections();
    if(!legacy.length)return;
    concealLegacyTrend();
    const now=Date.now();
    if(now-trendForceAt<650)return;
    trendForceAt=now;
    trendForceSeq++;
    try{delete window.__vyrdictTrendingReferenceV5}catch{window.__vyrdictTrendingReferenceV5=0}
    const s=document.createElement('script');
    s.id=`vyrdict-mobile-trending-force-${trendForceSeq}`;
    s.src=`/trending-index-claw.js?v=6-20260909-mobileforce-${trendForceSeq}`;
    s.defer=true;
    document.head.appendChild(s);
  }

  function ensureTrending(){
    if(cleanupLegacyAfterCurrent())return;
    concealLegacyTrend();
    forceTrending();
  }

  function apply(){
    if(!HOME()||!MOBILE())return;
    ensureTrending();
    restoreSkip();
  }

  function schedule(){
    clearTimeout(timer);timer=setTimeout(apply,10);
    [80,180,350,700,1200,2000,3200,5000].forEach(ms=>setTimeout(apply,ms));
  }

  function watch(){
    if(observer)return;
    const target=document.getElementById('app')||document.body;
    if(!target)return;
    observer=new MutationObserver(()=>{
      if(!HOME()||!MOBILE())return;
      clearTimeout(timer);timer=setTimeout(()=>{
        ensureTrending();restoreSkip();
      },35);
    });
    observer.observe(target,{childList:true,subtree:true});
  }

  const start=()=>{watch();schedule()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',schedule);
  addEventListener('popstate',schedule);
  addEventListener('resize',schedule,{passive:true});
})();
