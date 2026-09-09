(()=>{
  if(window.__vyrdictMobileHomeSectionGuardV2)return;
  window.__vyrdictMobileHomeSectionGuardV2=1;

  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const MOBILE=()=>matchMedia('(max-width:760px)').matches;
  let observer=null,timer=0;

  function load(src,id){
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;s.src=src;s.defer=true;
    document.head.appendChild(s);
  }

  function removeLegacyTrendSections(){
    if(!HOME()||!MOBILE())return;
    const current=document.querySelector('.vyrdict-index-gallery,#trending-index.vyrdict-index-gallery');
    document.querySelectorAll('#viral,.weekly-ranking,.weekly-rankings,[data-section="weekly-ranking"],[data-section="weekly-rankings"]').forEach(el=>{
      if(el&&el!==current)el.remove();
    });
    document.querySelectorAll('section,div').forEach(el=>{
      if(el===current||current?.contains(el))return;
      const txt=(el.querySelector('h1,h2,h3')?.textContent||'').trim().toLowerCase();
      if(txt==='weekly viral rankings.'||txt==='weekly viral rankings'){
        const section=el.closest('section')||el;
        if(section!==current)section.remove();
      }
    });
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
      removeLegacyTrendSections();
      return;
    }
    load('/trending-index-claw.js?v=5-20260909-mobilefix','vyrdict-mobile-trending-current');
  }

  function suppressOldHeroFlash(){
    if(!HOME()||!MOBILE())return;
    const hero=document.querySelector('.hero');
    if(!hero)return;
    hero.classList.add('vyrdict-mobile-hero-booting');
    const reveal=()=>hero.classList.remove('vyrdict-mobile-hero-booting');
    if(document.querySelector('[data-vyrdict-current-hero],.vyrdict-current-hero,.hero-current'))reveal();
    else setTimeout(reveal,1200);
  }

  function injectBootStyle(){
    if(document.getElementById('vyrdict-mobile-home-boot-style'))return;
    const st=document.createElement('style');
    st.id='vyrdict-mobile-home-boot-style';
    st.textContent='@media(max-width:760px){.hero.vyrdict-mobile-hero-booting .stage img,.hero.vyrdict-mobile-hero-booting .stage picture{visibility:hidden!important}}';
    document.head.appendChild(st);
  }

  function apply(){
    if(!HOME()||!MOBILE())return;
    injectBootStyle();
    suppressOldHeroFlash();
    ensureTrending();
    removeLegacyTrendSections();
    restoreSkip();
  }

  function schedule(){
    clearTimeout(timer);timer=setTimeout(apply,20);
    [100,250,500,900,1500,2500,4000].forEach(ms=>setTimeout(apply,ms));
  }

  function watch(){
    if(observer)return;
    const target=document.getElementById('app')||document.body;
    if(!target)return;
    observer=new MutationObserver(()=>{
      if(!HOME()||!MOBILE())return;
      clearTimeout(timer);timer=setTimeout(()=>{
        removeLegacyTrendSections();restoreSkip();ensureTrending();
      },40);
    });
    observer.observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','class']});
  }

  const start=()=>{injectBootStyle();watch();schedule()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',schedule);
  addEventListener('popstate',schedule);
  addEventListener('resize',schedule,{passive:true});
})();
