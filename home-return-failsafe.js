(()=>{
  if(window.__vyrdictHomeReturnFailsafe)return;
  window.__vyrdictHomeReturnFailsafe=1;

  const CACHE_KEY='vyrdict:bundle-cache:v18';
  const BUNDLE_URL='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-bundle-fast?v=18';

  function readCache(){
    try{
      const cached=JSON.parse(localStorage.getItem(CACHE_KEY)||'null');
      return cached?.html?cached:null;
    }catch{return null}
  }

  function keepCacheHot(){
    try{
      const cached=readCache();
      if(!cached)return false;
      localStorage.setItem(CACHE_KEY,JSON.stringify({ts:Date.now(),html:cached.html}));
      return true;
    }catch{return false}
  }

  async function warmHome(){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),2500);
    try{
      const response=await fetch(BUNDLE_URL,{cache:'no-store',signal:controller.signal});
      if(!response.ok)return;
      const data=await response.json();
      if(data?.html){
        try{localStorage.setItem(CACHE_KEY,JSON.stringify({ts:Date.now(),html:data.html}))}catch{}
      }
    }catch{}finally{clearTimeout(timer)}
  }

  function isHomeTarget(target){
    const el=target?.closest?.('a[href],[data-nav]');
    if(!el)return false;
    const raw=el.getAttribute('href')||el.dataset?.nav||'';
    if(!raw)return false;
    try{
      const u=new URL(raw,location.href);
      return u.origin===location.origin&&(u.pathname==='/'||u.pathname==='')&&!u.search&&!u.hash;
    }catch{return false}
  }

  function prepareHome(e){
    if(isHomeTarget(e.target))keepCacheHot();
  }

  document.addEventListener('pointerdown',prepareHome,true);
  document.addEventListener('click',prepareHome,true);

  const startWarm=()=>{
    keepCacheHot();
    if('requestIdleCallback'in window)requestIdleCallback(()=>warmHome(),{timeout:1200});
    else setTimeout(warmHome,250);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startWarm,{once:true});
  else startWarm();
})();
