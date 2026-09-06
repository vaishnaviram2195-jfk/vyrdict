(()=>{
  if(window.__vyrdictTrendingFreshnessGuardV1)return;
  window.__vyrdictTrendingFreshnessGuardV1=1;

  const ENDPOINT='vyrdict-weekly-rankings';
  const MAX_AGE_MS=7*24*60*60*1000;
  const MIN_VIRAL=90;
  const MIN_MOMENTUM=90;
  const CATEGORIES=['Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const originalFetch=window.fetch.bind(window);

  const productOf=x=>x?.product||x?.products||x?.item||x||{};
  const freshEnough=x=>{
    const p=productOf(x);
    const verified=Date.parse(p.last_verified_at||x?.last_verified_at||'');
    const viral=Number(p.viral_score??x?.viral_score??0);
    const momentum=Number(p.momentum_score??x?.momentum_score??0);
    return Number.isFinite(verified) && verified>=(Date.now()-MAX_AGE_MS) && viral>=MIN_VIRAL && momentum>=MIN_MOMENTUM;
  };
  const catOf=x=>productOf(x)?.category||x?.category_label||x?.category||'';
  const sentinel=category=>({
    category,
    name:'',brand:'',slug:'',image_url:'',
    last_verified_at:new Date().toISOString(),
    viral_score:0,momentum_score:0,
    __vyrdictFreshnessSentinel:true
  });

  function guardedArray(arr){
    const fresh=(Array.isArray(arr)?arr:[]).filter(freshEnough);
    for(const category of CATEGORIES){
      if(!fresh.some(x=>norm(catOf(x))===norm(category))) fresh.push(sentinel(category));
    }
    return fresh;
  }

  window.fetch=async function(input,init){
    const res=await originalFetch(input,init);
    const url=typeof input==='string'?input:(input?.url||'');
    if(!String(url).includes(ENDPOINT))return res;
    try{
      const data=await res.clone().json();
      let out;
      if(Array.isArray(data)) out=guardedArray(data);
      else if(Array.isArray(data?.rankings)) out={...data,rankings:guardedArray(data.rankings)};
      else if(Array.isArray(data?.data)) out={...data,data:guardedArray(data.data)};
      else return res;
      const headers=new Headers(res.headers);headers.delete('content-length');headers.set('content-type','application/json');
      return new Response(JSON.stringify(out),{status:res.status,statusText:res.statusText,headers});
    }catch{return res}
  };

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
