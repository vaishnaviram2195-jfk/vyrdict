(()=>{
  if(window.__vyrdictHomepageLayoutRestoreV3)return;
  window.__vyrdictHomepageLayoutRestoreV3=1;
  if((location.pathname||'/')!=='/')return;
  const ROOT='vyrdict-editorial-home';
  function ensureStories(){
    document.getElementById('ve-home-stories-retired-v2')?.remove();
    document.getElementById('vyrdict-stories-retired')?.remove();
    if(document.getElementById('vyrdict-editorial-now'))return;
    if(document.getElementById('vyrdict-stories-restored-loader'))return;
    try{window.__vyrdictStoriesV4=0}catch{}
    const s=document.createElement('script');s.id='vyrdict-stories-restored-loader';
    s.src='/homepage-editorial-now.js?v=5-20261001-restored';s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }
  function ensureNews(){
    if(document.getElementById('ve-news-desk')||document.getElementById('vyrdict-news-layout-loader'))return;
    try{window.__vyrdictHomepageNewsDeskV1=0}catch{}
    const s=document.createElement('script');s.id='vyrdict-news-layout-loader';s.src='/homepage-news-desk.js?v=3-20261001-stable';s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }
  function apply(){
    const root=document.getElementById(ROOT);if(!root)return false;
    ensureStories();if(!matchMedia('(max-width:900px)').matches)ensureNews();return true;
  }
  let n=0;const tick=()=>{if(apply()||++n>20)return;setTimeout(tick,120)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  [500,1400].forEach(ms=>setTimeout(apply,ms));
})();
