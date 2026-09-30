(()=>{
  // Legacy compact VYRDICT Stories rail retired from the homepage.
  // Keep this file as a kill switch because older homepage bundles may still reference it.
  window.__vyrdictStoriesV4=1;

  const SECTION_ID='vyrdict-editorial-now';
  const OLD_STYLE_ID='vyrdict-stories-style-v4';
  const KILL_STYLE_ID='vyrdict-stories-retired';

  function hideLegacyRail(){
    if(!document.getElementById(KILL_STYLE_ID)){
      const style=document.createElement('style');
      style.id=KILL_STYLE_ID;
      style.textContent=`#${SECTION_ID}{display:none!important}`;
      (document.head||document.documentElement).appendChild(style);
    }
    document.getElementById(SECTION_ID)?.remove();
    document.getElementById(OLD_STYLE_ID)?.remove();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',hideLegacyRail,{once:true});
  }else{
    hideLegacyRail();
  }

  // A few bounded cleanups cover async homepage hydration without adding a mutation loop.
  [120,500,1200].forEach(ms=>setTimeout(hideLegacyRail,ms));
  addEventListener('pageshow',()=>setTimeout(hideLegacyRail,40),{passive:true});
})();
