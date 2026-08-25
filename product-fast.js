(()=>{
  if(window.__vyrdictProductFastV7)return;
  window.__vyrdictProductFastV7=1;

  // Navigation safety: never leave the viewport stranded below a route that
  // has temporarily shrunk while async content is loading.
  function hardTop(){
    try{history.scrollRestoration='manual'}catch{}
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{if(document.scrollingElement)document.scrollingElement.scrollTop=0}catch{}
    try{document.documentElement.scrollTop=0}catch{}
    try{document.body.scrollTop=0}catch{}
    try{window.scrollTo({top:0,left:0,behavior:'instant'})}catch{try{window.scrollTo(0,0)}catch{}}
  }

  let coverToken=0;
  function showRouteCover(){
    hardTop();
    const token=++coverToken;
    const started=performance.now();
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
    let sawMutation=false;
    const destinationReady=()=>{
      if(token!==coverToken)return true;
      const a=document.getElementById('app');
      if(!a)return false;
      const text=(a.textContent||'').trim();
      const loading=/^loading\b|loading the vyrdict|loading the verdict|loading product/i.test(text);
      // The previous route may already contain >80 characters when popstate
      // fires. Do not mistake that old DOM for the destination. Require an
      // actual mutation (or a small settle window for full-document restores).
      const changed=sawMutation||performance.now()-started>700;
      return changed&&text.length>80&&!loading;
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
    if(app){
      observer=new MutationObserver(()=>{sawMutation=true;check()});
      observer.observe(app,{childList:true,subtree:true,characterData:true,attributes:true});
    }
    timer=setTimeout(finish,5000);
    setTimeout(check,750);
  }

  hardTop();

  function isInternalNavigation(target){
    const known=target?.closest?.('[data-product],[data-category],[data-collection],[data-back],[data-nav],[data-search],[data-section]');
    if(known&&!known.matches('input,textarea'))return true;
    const a=target?.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return false;
    try{
      const u=new URL(a.href,location.href);
      if(u.origin!==location.origin)return false;
      const here=location.pathname+location.search+location.hash;
      const there=u.pathname+u.search+u.hash;
      if(there===here||a.getAttribute('href')==='#')return false;
      return true;
    }catch{return false}
  }

  document.addEventListener('click',e=>{
    if(!isInternalNavigation(e.target))return;
    showRouteCover();
  },{capture:true,passive:true});

  addEventListener('popstate',showRouteCover,true);
  addEventListener('hashchange',showRouteCover,true);
  addEventListener('pageshow',()=>{
    hardTop();
    const a=document.getElementById('app');
    if(a&&/(loading the vyrdict|loading the verdict|loading product)/i.test(a.textContent||''))showRouteCover();
    else document.getElementById('vyrdict-route-cover')?.remove();
  },true);

  // Retire stale app-bundle copies left by earlier navigation builds. This does
  // not remove user account/saved-product data.
  try{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i)||'';
      if(/^vyrdict:bundle-cache:v[1-7]$/.test(k))localStorage.removeItem(k);
    }
  }catch{}

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