(()=>{
  if(window.__vyrdictEditorialBootstrapV7)return;
  window.__vyrdictEditorialBootstrapV7=1;
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  if(!isHome())return;

  const BRIDGE_ID='vyrdict-editorial-product-bridge';
  const SCRIPT_ID='vyrdict-editorial-reference-force-v7';
  const LEGACY_ID='vyrdict-editorial-legacy-force-v7';
  const POLISH_ID='vyrdict-editorial-polish-v2';
  const VIDEO_ID='vyrdict-editorial-video-pass-v1';
  const CULTURE_ID='vyrdict-culture-trio-stable-v1';
  const CULTURE_HORIZONTAL_ID='vyrdict-culture-horizontal-stable-v1';
  const NEWS_ID='vyrdict-news-desk-stable-v1';
  const MOBILE_STABILITY_ID='vyrdict-mobile-home-stability-v1';
  const FALLBACK=[
    {slug:'coach-tabby-shoulder-bag-20',name:'Tabby Shoulder Bag 20',brand:'Coach',image_url:'https://www.houseoffraser.co.uk/images/imgzoom/70/70618101_xxl.jpg'},
    {slug:'ray-ban-rb3025-aviator-classic',name:'RB3025 Aviator Classic',brand:'Ray-Ban',image_url:'https://images.ray-ban.com/is/image/RayBan/8056597259811_0001.png?impolicy=SEO_4x3'},
    {slug:'jacques-marie-mage-eclipse-sunglasses',name:'Eclipse Sunglasses',brand:'Jacques Marie Mage',image_url:'https://twelvesixtynine.com/cdn/shop/files/Jacques-Marie-Mage-Eclipse-2-Sunglasses-2.jpg?v=1728141663&width=1600'},
    {slug:'birkenstock-tokio-super-grip',name:'Tokio Super Grip',brand:'Birkenstock',image_url:'https://www.birkenstock.com/on/demandware.static/-/Sites-master-catalog/default/dwbce7c443/61196/61196_side.jpg'},
    {slug:'carhartt-wip-og-detroit-jacket',name:'OG Detroit Jacket',brand:'Carhartt WIP',image_url:'https://cdn.shopify.com/s/files/1/2193/5809/files/I035614_3XA_4O-OF-01.jpg?crop=center&height=2251&v=1783618330&width=1501'},
    {slug:'birkenstock-arizona-big-buckle-high-shine-light-rose',name:'Arizona Big Buckle High Shine',brand:'Birkenstock',image_url:'https://thh2.ca/cdn/shop/files/1029352_1029392-medium.jpg?v=1741716988&width=2200'},
    {slug:'anthropologie-kallie-flowy-maxi-dress',name:'Kallie Flowy Maxi Dress',brand:'Anthropologie',image_url:'https://images.urbndata.com/is/image/Anthropologie/4145916210079_009_b?$a15-pdp-detail-shot$=&fit=constrain&qlt=80&wid=640'},
    {slug:'cambridge-satchel-small-portrait-backpack',name:'Small Portrait Backpack',brand:'Cambridge Satchel',image_url:'https://cdna.lystit.com/1040/1300/n/photos/cambridgesatchel/4092f7e3/cambridge-satchel-company-Black-The-Small-Portrait-Backpack.jpeg'},
    {slug:'alo-yoga-in-motion-vest',name:'In Motion Vest',brand:'Alo Yoga',image_url:'https://cdn.shopify.com/s/files/1/2185/2813/files/W4477R_01_b1_s1_a4_m18_750x.jpg?v=1759176072'},
    {slug:'charles-j-wahba-tortoiseshell-headband',name:'Tortoiseshell Headband',brand:'Charles J. Wahba',image_url:'https://bigelowchemists.com/cdn/shop/files/TortoiseWahbaHeadband-COBEdition.jpg?v=1762974217&width=900'},
    {slug:'la-ligne-molly-jeans',name:'Molly Jeans',brand:'La Ligne',image_url:'https://vader-prod.s3.amazonaws.com/1678732514-la-ligne-molly-jeans-640f6cc921252.png'}
  ];

  let mounting=false,lastAttempt=0,recoveries=0,observerTimer=0;

  function rows(){
    let data=[];
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      if(Array.isArray(c?.p))data=c.p;
    }catch{}
    data=data.filter(p=>p?.slug&&p?.name&&p?.image_url).slice(0,24);
    return data.length>=6?data:FALLBACK;
  }

  function bridgeProducts(){
    if(document.getElementById(BRIDGE_ID))return;
    const wrap=document.createElement('div');
    wrap.id=BRIDGE_ID;
    wrap.setAttribute('aria-hidden','true');
    Object.assign(wrap.style,{position:'fixed',left:'-99999px',top:'0',width:'1px',height:'1px',overflow:'hidden',pointerEvents:'none',opacity:'0'});
    for(const p of rows()){
      const a=document.createElement('a');
      a.href='/product/'+encodeURIComponent(p.slug)+'/';
      a.innerHTML='<img src="'+String(p.image_url).replace(/"/g,'&quot;')+'" alt=""><h3></h3><small class="brand"></small><span class="scores"></span>';
      a.querySelector('h3').textContent=p.name;
      a.querySelector('.brand').textContent=p.brand||'VYRDICT';
      const viral=Number.isFinite(Number(p.viral_score))?Number(p.viral_score):'';
      const worth=Number.isFinite(Number(p.worth_score))?Number(p.worth_score):'';
      a.querySelector('.scores').textContent=(viral!==''?'Viral '+viral+' ':'')+(worth!==''?'Worth '+worth:'');
      wrap.appendChild(a);
    }
    (document.getElementById('app')||document.body).appendChild(wrap);
  }

  function addScript(src,id){
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;s.src=src;s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  function loadCore(){
    addScript('/homepage-editorial-legacy-guard.js?v=7-20261001-stable',LEGACY_ID);
    if(matchMedia('(max-width:900px)').matches)addScript('/mobile-home-stability.js?v=1-20261001',MOBILE_STABILITY_ID);
  }

  function loadEnhancements(){
    if(!document.getElementById('vyrdict-editorial-home'))return;
    addScript('/homepage-editorial-polish.js?v=2-20260929-audiofix',POLISH_ID);
    addScript('/homepage-video-pass.js?v=1-20260929-video685',VIDEO_ID);
    addScript('/homepage-culture-trio.js?v=3-20261001-stable',CULTURE_ID);
    addScript('/homepage-culture-horizontal.js?v=2-20261001-stable',CULTURE_HORIZONTAL_ID);
    addScript('/homepage-news-desk.js?v=3-20261001-stable',NEWS_ID);
  }

  function finishMount(){
    mounting=false;
    const root=document.getElementById('vyrdict-editorial-home');
    if(root){
      recoveries=0;
      loadEnhancements();
      document.getElementById(BRIDGE_ID)?.remove();
      return true;
    }
    return false;
  }

  function mount(recovery=false){
    if(!isHome())return;
    const root=document.getElementById('vyrdict-editorial-home');
    if(root){loadEnhancements();return;}
    if(mounting)return;
    const now=Date.now();
    if(now-lastAttempt<1800)return;
    lastAttempt=now;
    mounting=true;
    bridgeProducts();
    loadCore();

    if(recovery){
      window.__vyrdictHomepageEditorialRefV1=0;
      document.getElementById(SCRIPT_ID)?.remove();
    }

    let s=document.getElementById(SCRIPT_ID);
    if(!s){
      s=document.createElement('script');
      s.id=SCRIPT_ID;
      s.src='/homepage-editorial-reference.js?v=8-20261001-stable'+(recovery?'&r='+now:'');
      s.defer=true;
      s.onload=()=>setTimeout(finishMount,40);
      s.onerror=()=>{mounting=false};
      (document.head||document.documentElement).appendChild(s);
    }else{
      setTimeout(finishMount,100);
    }

    setTimeout(()=>{
      if(finishMount())return;
      if(recoveries<1){recoveries++;mount(true)}
    },2600);
  }

  function ensure(){
    if(!isHome())return;
    if(document.getElementById('vyrdict-editorial-home')){loadEnhancements();return;}
    if(!mounting&&Date.now()-lastAttempt>3000&&recoveries<1){recoveries++;mount(true)}
  }

  const start=()=>{
    loadCore();
    mount(false);
    [900,2200,5000].forEach(ms=>setTimeout(ensure,ms));
    const app=document.getElementById('app')||document.body;
    if(app&&!window.__vyrdictEditorialStableObserver){
      window.__vyrdictEditorialStableObserver=new MutationObserver(()=>{
        clearTimeout(observerTimer);
        observerTimer=setTimeout(ensure,180);
      });
      window.__vyrdictEditorialStableObserver.observe(app,{childList:true,subtree:false});
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',e=>{if(e.persisted)setTimeout(ensure,60)});
})();
