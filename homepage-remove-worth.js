(()=>{
  if(window.__vyrdictRemoveWorthV1)return;
  window.__vyrdictRemoveWorthV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT_ID='vyrdict-editorial-home';
  const NEWS_ID='ve-news-desk';

  function removeWorth(){
    const root=document.getElementById(ROOT_ID);
    if(!root||!document.getElementById(NEWS_ID))return false;
    let removed=false;
    root.querySelectorAll('.ve-worth').forEach(el=>{el.remove();removed=true});
    return removed;
  }

  let tries=0;
  const tick=()=>{
    tries++;
    if(!removeWorth()&&tries<40)setTimeout(tick,150);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();

  const app=document.getElementById('app')||document.body;
  new MutationObserver(()=>{
    if(document.getElementById(NEWS_ID))removeWorth();
  }).observe(app,{childList:true,subtree:true});

  addEventListener('pageshow',()=>setTimeout(removeWorth,80));
})();
