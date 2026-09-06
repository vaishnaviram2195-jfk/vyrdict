(()=>{
  if(window.__vyrdictTrendingLiveDataV1)return;
  window.__vyrdictTrendingLiveDataV1=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const originalFetch=window.fetch.bind(window);
  const CACHE_MS=60*1000;
  let cached=null,cachedAt=0,inflight=null,meta=null;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const sentinel=category=>({category,name:'',brand:'',slug:'',image_url:'',__vyrdictFreshnessSentinel:true});

  function withCategorySentinels(products){
    const out=Array.isArray(products)?products.slice():[];
    for(const category of CATEGORIES){
      if(!out.some(p=>norm(p?.category)===norm(category)))out.push(sentinel(category));
    }
    return out;
  }

  async function loadAll(force=false){
    if(!force&&cached&&Date.now()-cachedAt<CACHE_MS)return cached;
    if(inflight)return inflight;
    inflight=(async()=>{
      const u=new URL(ENDPOINT);
      u.searchParams.set('category','All');
      u.searchParams.set('_fresh',String(Date.now()));
      const r=await originalFetch(u.toString(),{cache:'no-store',headers:{accept:'application/json'}});
      if(!r.ok)throw new Error('Trending Index data '+r.status);
      const d=await r.json();
      meta={
        calculated_at:d?.calculated_at||null,
        week_start:d?.week_start||null,
        methodology:d?.methodology||null,
        freshness_days:Number(d?.freshness_days||7)
      };
      cached=withCategorySentinels(d?.products||[]);
      cachedAt=Date.now();
      window.__vyrdictTrendingLiveData.products=cached;
      window.__vyrdictTrendingLiveData.meta=meta;
      window.dispatchEvent(new CustomEvent('vyrdict:trending-data',{detail:{products:cached,meta}}));
      return cached;
    })().finally(()=>{inflight=null});
    return inflight;
  }

  window.__vyrdictTrendingLiveData={products:[],meta:null,load:loadAll};

  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input?.url||'');
    if(!String(url).startsWith(ENDPOINT))return originalFetch(input,init);
    try{
      const arr=await loadAll(false);
      return new Response(JSON.stringify(arr),{status:200,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
    }catch{
      return originalFetch(input,{...(init||{}),cache:'no-store'});
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>loadAll().catch(()=>{}),{once:true});
  else loadAll().catch(()=>{});
})();