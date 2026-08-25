(()=>{
  if(window.__vyrdictProductFastV2)return;
  window.__vyrdictProductFastV2=1;
  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-product-detail';
  const inflight=new Map();
  const prefetched=new Set();
  const TTL=10*60*1000;

  function cacheKey(id){return `vyrdict:product-detail:v2:${id}`}
  function readCache(id){
    try{const x=JSON.parse(localStorage.getItem(cacheKey(id))||'null');if(x?.data&&Date.now()-Number(x.ts||0)<TTL)return x.data}catch{}
    return null;
  }
  function writeCache(id,data){try{localStorage.setItem(cacheKey(id),JSON.stringify({ts:Date.now(),data}))}catch{}}
  async function getDetail(id){
    const cached=readCache(id);if(cached)return cached;
    if(inflight.has(id))return inflight.get(id);
    const p=fetch(`${ENDPOINT}?id=${encodeURIComponent(id)}`,{cache:'default'}).then(async r=>{if(!r.ok)throw new Error(`detail ${r.status}`);const d=await r.json();writeCache(id,d);return d}).finally(()=>inflight.delete(id));
    inflight.set(id,p);return p;
  }
  window.vyrdictGetProductDetail=getDetail;

  function parseRequest(x){
    const s=String(x||'');
    const m=s.match(/product_id=eq\.(\d+)/);if(!m)return null;
    const id=Number(m[1]);
    if(s.startsWith('product_profiles?'))return{id,kind:'profile'};
    if(s.startsWith('product_evidence?'))return{id,kind:'evidence'};
    if(s.startsWith('product_metrics?'))return{id,kind:'metrics'};
    if(s.startsWith('product_retailers?'))return{id,kind:'retailers'};
    return null;
  }

  function install(attempt=0){
    if(typeof api!=='function'){if(attempt<40)setTimeout(()=>install(attempt+1),30);return}
    if(api.__vyrdictFast)return;
    const baseApi=api;
    const fast=async x=>{
      const q=parseRequest(x);if(!q)return baseApi(x);
      try{
        const d=await getDetail(q.id);
        if(q.kind==='profile')return d.profile&&Object.keys(d.profile).length?[d.profile]:[];
        if(q.kind==='evidence')return Array.isArray(d.evidence)?d.evidence:[];
        if(q.kind==='metrics')return Array.isArray(d.metrics)?d.metrics:[];
        if(q.kind==='retailers')return Array.isArray(d.retailers)?d.retailers:[];
      }catch{}
      return baseApi(x);
    };
    fast.__vyrdictFast=1;
    api=fast;
  }

  function prefetch(target){
    const b=target?.closest?.('[data-product]');if(!b)return;
    const slug=String(b.dataset.product||'');if(!slug||prefetched.has(slug))return;
    try{
      if(typeof S!=='undefined'&&Array.isArray(S.p)){
        const p=S.p.find(x=>x.slug===slug);
        if(p?.id){prefetched.add(slug);getDetail(p.id).catch(()=>prefetched.delete(slug))}
      }
    }catch{}
  }

  document.addEventListener('pointerover',e=>prefetch(e.target),{capture:true,passive:true});
  document.addEventListener('pointerdown',e=>prefetch(e.target),{capture:true,passive:true});
  document.addEventListener('focusin',e=>prefetch(e.target),{capture:true,passive:true});
  install();
})();
