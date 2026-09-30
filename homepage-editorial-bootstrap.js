(()=>{
  if(window.__vyrdictEditorialBootstrapV1)return;
  window.__vyrdictEditorialBootstrapV1=1;
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  if(!isHome())return;

  const BRIDGE_ID='vyrdict-editorial-product-bridge';
  const addScript=(src,id)=>{
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;s.src=src;s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  };

  function bridgeProducts(){
    if(document.getElementById(BRIDGE_ID))return true;
    let rows=[];
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      if(Array.isArray(c?.p))rows=c.p;
    }catch{}
    rows=rows.filter(p=>p?.slug&&p?.name&&p?.image_url).slice(0,24);
    if(rows.length<6)return false;
    const wrap=document.createElement('div');
    wrap.id=BRIDGE_ID;
    wrap.setAttribute('aria-hidden','true');
    Object.assign(wrap.style,{position:'fixed',left:'-99999px',top:'0',width:'1px',height:'1px',overflow:'hidden',pointerEvents:'none'});
    for(const p of rows){
      const a=document.createElement('a');
      a.href='/product/'+encodeURIComponent(p.slug)+'/';
      a.innerHTML='<img src="'+String(p.image_url).replace(/"/g,'&quot;')+'" alt=""><h3></h3><small class="brand"></small><span class="scores"></span>';
      a.querySelector('h3').textContent=p.name;
      a.querySelector('.brand').textContent=p.brand||'VYRDICT';
      a.querySelector('.scores').textContent='Viral '+(p.viral_score??'')+' Worth '+(p.worth_score??'');
      wrap.appendChild(a);
    }
    (document.getElementById('app')||document.body).appendChild(wrap);
    return true;
  }

  function load(){
    if(!isHome())return;
    bridgeProducts();
    addScript('/homepage-editorial-reference.js?v=4-20260929-force','vyrdict-editorial-reference-force');
    addScript('/homepage-editorial-legacy-guard.js?v=3-20260929-force','vyrdict-editorial-legacy-force');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
  [120,350,700,1200,2200,3800].forEach(ms=>setTimeout(()=>{if(!document.getElementById('vyrdict-editorial-home')){bridgeProducts();load()}},ms));
})();
