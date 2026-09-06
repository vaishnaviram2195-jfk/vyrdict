(()=>{
  if(window.__vyrdictTrendingFreshnessGuardV2)return;
  window.__vyrdictTrendingFreshnessGuardV2=1;

  const ENDPOINT='vyrdict-weekly-rankings';
  const CATEGORIES=['Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const originalFetch=window.fetch.bind(window);

  const sentinel=category=>({
    category,
    name:'',brand:'',slug:'',image_url:'',
    viral_score:0,momentum_score:0,trend_score:0,
    __vyrdictFreshnessSentinel:true
  });

  async function fetchFreshCategory(base,category){
    const u=new URL(base,location.href);
    u.searchParams.set('category',category);
    u.searchParams.set('_fresh',String(Date.now()));
    const r=await originalFetch(u.toString(),{cache:'no-store'});
    if(!r.ok)return [];
    const d=await r.json();
    return Array.isArray(d?.products)?d.products:[];
  }

  async function buildFreshIndex(base){
    const batches=await Promise.all(CATEGORIES.map(c=>fetchFreshCategory(base,c).catch(()=>[])));
    const out=[];
    const seen=new Set();
    CATEGORIES.forEach((category,i)=>{
      const rows=(batches[i]||[]).filter(p=>p&&norm(p.category)===norm(category));
      if(!rows.length){out.push(sentinel(category));return}
      for(const p of rows){
        const key=p.slug||`${p.brand||''}:${p.name||''}`;
        if(seen.has(key))continue;
        seen.add(key);
        out.push(p);
      }
    });
    out.sort((a,b)=>Number(b.trend_score||0)-Number(a.trend_score||0));
    return out;
  }

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input?.url||'');
    if(!String(url).includes(ENDPOINT))return originalFetch(input,init);
    try{
      const fresh=await buildFreshIndex(String(url));
      return new Response(JSON.stringify(fresh),{
        status:200,
        headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}
      });
    }catch{
      return originalFetch(input,{...(init||{}),cache:'no-store'});
    }
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
