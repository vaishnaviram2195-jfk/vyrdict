(()=>{
  if(window.__vyrdictTrendingFreshnessGuardV3)return;
  window.__vyrdictTrendingFreshnessGuardV2=1;

  // The shared live-data tracker loads one server-validated list. Avoid 20 redundant category fetches.
  function updateEmptyCopy(){
    const section=document.querySelector('.vyrdict-index-claw');
    if(!section)return;
    const tray=section.querySelector('.vti-products');
    const ph=section.querySelector('.vti-placeholder');
    if(!tray||!ph)return;
    if(tray.children.length===0)ph.textContent='No fresh breakout verified this week.';
    else ph.textContent='The claw is choosing what’s next.';
  }
  const mo=new MutationObserver(updateEmptyCopy);
  const start=()=>{
    const app=document.getElementById('app')||document.body;
    if(app)mo.observe(app,{childList:true,subtree:true});
    setTimeout(updateEmptyCopy,500);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
