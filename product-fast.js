(()=>{
  if(window.__vyrdictProductFastV6)return;
  window.__vyrdictProductFastV6=1;

  // VYRDICT swaps route content in-place. Keep the viewport at the top before
  // the old document can shrink, and keep a visible transition layer over the
  // viewport until the destination has actually rendered.
  function hardTop(){
    try{history.scrollRestoration='manual'}catch{}
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{document.documentElement.scrollTop=0}catch{}
    try{document.body.scrollTop=0}catch{}
    try{window.scrollTo(0,0)}catch{}
  }

  let coverToken=0;
  function showRouteCover(){
    hardTop();
    const token=++coverToken;
    let cover=document.getElementById('vyrdict-route-cover');
    if(!cover){
      cover=document.createElement('div');
      cover.id='vyrdict-route-cover';
      cover.setAttribute('aria-live','polite');
      cover.innerHTML='<div class="vyrdict-route-card"><div class="vyrdict-route-logo">VYRDICT<span></span></div><div class="vyrdict-route-label">Loading the verdict…</div></div>';
      Object.assign(cover.style,{position:'fixed',inset:'0',zIndex:'2147483645',background:'#f4ede5',display:'grid',placeItems:'center',padding:'24px',fontFamily:'Arial,Helvetica,sans-serif',color:'#171511'});
      const card=cover.firstElementChild;
      Object.assign(card.style,{width:'min(420px,100%)',background:'#fffdf8',border:'1px solid #d8cec4',borderRadius:'24px',padding:'28px',textAlign:'center',boxShadow:'0 18px 55px rgba(58,43,32,.08)'});
      const logo=card.querySelector('.vyrdict-route-logo');
      Object.assign(logo.style,{fontSize:'27px',fontWeight:'950',letterSpacing:'-1.6px',display:'inline-flex',alignItems:'flex-end'});
      const dot=logo.querySelector('span');
      Object.assign(dot.style,{width:'7px',height:'7px',background:'#e65f72',display:'inline-block',margin:'0 0 3px 2px'});
      const label=card.querySelector('.vyrdict-route-label');
      Object.assign(label.style,{marginTop:'14px',fontSize:'10px',fontWeight:'800',letterSpacing:'.08em',textTransform:'uppercase',color:'#6d675f'});
      document.body.appendChild(cover);
    }else cover.style.display='grid';

    const app=document.getElementById('app');
    let observer=null;
    let timer=null;
    const destinationReady=()=>{
      if(token!==coverToken)return true;
      const a=document.getElementById('app');
      if(!a)return false;
      const text=(a.textContent||'').trim();
      const loading=/^loading\b|loading the vyrdict|loading the verdict/i.test(text);
      return text.length>80&&!loading;
    };
    const finish=()=>{
      if(token!==coverToken)return;
      if(observer)observer.disconnect();
      if(timer)clearTimeout(timer);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(token!==coverToken)return;
        hardTop();
        const c=document.getElementById('vyrdict-route-cover');
        if(c)c.remove();
      }));
    };
    const check=()=>{if(destinationReady())finish()};
    if(app){observer=new MutationObserver(check);observer.observe(app,{childList:true,subtree:true,characterData:true})}
    timer=setTimeout(finish,4500);
    setTimeout(check,0);
  }

  hardTop();
  const routeSelector='[data-product],[data-category],[data-collection],[data-back],[data-nav],[data-search]';
  document.addEventListener('click',e=>{
    const target=e.target?.closest?.(routeSelector);
    if(!target)return;
    // Search inputs themselves do not navigate on click; actual search action does.
    if(target.matches('input,textarea'))return;
    showRouteCover();
  },{capture:true,passive:true});
  addEventListener('popstate',showRouteCover,true);
  addEventListener('hashchange',showRouteCover,true);
  addEventListener('pageshow',()=>{hardTop();const a=document.getElementById('app');if(a&&/(loading the vyrdict|loading the verdict)/i.test(a.textContent||''))showRouteCover()},true);

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
