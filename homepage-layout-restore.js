(()=>{
  if(window.__vyrdictHomepageLayoutRestoreV2)return;
  window.__vyrdictHomepageLayoutRestoreV2=1;
  window.__vyrdictHomepageLayoutRestoreV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STORY_IDS=['ve-home-stories','vyrdict-editorial-now'];
  const KILL_STYLE_ID='ve-home-stories-retired-v2';

  function addKillStyle(){
    if(document.getElementById(KILL_STYLE_ID))return;
    const s=document.createElement('style');
    s.id=KILL_STYLE_ID;
    s.textContent=`#ve-home-stories,#vyrdict-editorial-now{display:none!important}#${ROOT} > .ve-worth{display:none!important}`;
    (document.head||document.documentElement).appendChild(s);
  }

  function ensureNews(){
    if(document.getElementById('ve-news-desk'))return;
    if(document.getElementById('vyrdict-news-layout-loader'))return;
    window.__vyrdictHomepageNewsDeskV1=0;
    const s=document.createElement('script');
    s.id='vyrdict-news-layout-loader';
    s.src='/homepage-news-desk.js?v=20260930-layout-restore-2';
    s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  function clean(){
    addKillStyle();
    document.getElementById('ve-home-stories-style')?.remove();
    document.getElementById('vyrdict-stories-style-v4')?.remove();
    STORY_IDS.forEach(id=>document.getElementById(id)?.remove());
    const root=document.getElementById(ROOT);
    const worth=root?.querySelector(':scope > .ve-worth');
    if(worth){
      worth.hidden=true;
      worth.setAttribute('aria-hidden','true');
      worth.style.setProperty('display','none','important');
    }
    ensureNews();
    return !!root;
  }

  let tries=0;
  const boot=()=>{
    tries++;
    if(clean()||tries>=20)return;
    setTimeout(boot,100);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();

  function observe(){
    const root=document.getElementById(ROOT);
    if(!root||root.dataset.veStoryRetireWatch==='1')return;
    root.dataset.veStoryRetireWatch='1';
    new MutationObserver(()=>STORY_IDS.forEach(id=>document.getElementById(id)?.remove()))
      .observe(root,{childList:true,subtree:false});
  }

  [200,700,1600].forEach(ms=>setTimeout(()=>{clean();observe()},ms));
  addEventListener('pageshow',()=>setTimeout(()=>{clean();observe()},40),{passive:true});
})();