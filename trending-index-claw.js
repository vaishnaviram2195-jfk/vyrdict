(()=>{
  if(window.__vyrdictTrendingClawV1)return;
  window.__vyrdictTrendingClawV1=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let root=null, activeCategory='All', products=[], cycle=0, runId=0, observer=null, bootTimer=0;

  function addStyle(){
    if(document.getElementById('vyrdict-trending-claw-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-trending-claw-style';
    s.textContent=`
      .vyrdict-index-claw{--ink:#171511;--cream:#f4ede5;--paper:#fffaf5;--blush:#e8c9c7;--rose:#e75f78;--taupe:#9a8578;--chrome:#d9d3ce;position:relative;overflow:hidden;background:linear-gradient(180deg,#f7efe9 0%,#efe4dc 64%,#eadfd7 100%)!important;border-block:0!important;padding:74px 0 86px!important}
      .vyrdict-index-claw:before{content:'';position:absolute;inset:-30% -20% auto;height:70%;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.72),transparent 48%),radial-gradient(ellipse at 78% 24%,rgba(232,201,199,.42),transparent 45%);pointer-events:none}
      .vyrdict-index-claw .vti-wrap{position:relative;z-index:1;width:min(1240px,calc(100% - 42px));margin:0 auto}
      .vyrdict-index-claw .vti-head{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin:0 0 24px}
      .vyrdict-index-claw .vti-kicker{font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#746a63;margin:0 0 10px}
      .vyrdict-index-claw .vti-title{margin:0;color:var(--ink);font:400 clamp(42px,6.2vw,86px)/.92 Georgia,'Times New Roman',serif;letter-spacing:-.055em}
      .vyrdict-index-claw .vti-title i{font-style:italic;font-weight:400}
      .vyrdict-index-claw .vti-sub{max-width:430px;margin:0 0 7px;font:500 15px/1.55 Arial,Helvetica,sans-serif;color:#685f59}
      .vyrdict-index-claw .vti-sub strong{font-weight:900;color:#27221e}
      .vyrdict-index-claw .vti-cats{display:flex;gap:8px;overflow-x:auto;padding:4px 1px 15px;scrollbar-width:none;-webkit-overflow-scrolling:touch;mask-image:linear-gradient(90deg,transparent 0,#000 12px,#000 calc(100% - 12px),transparent 100%)}
      .vyrdict-index-claw .vti-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-claw .vti-cat{flex:0 0 auto;appearance:none;border:1px solid rgba(23,21,17,.13);background:rgba(255,250,245,.66);backdrop-filter:blur(12px);color:#665d56;border-radius:999px;padding:11px 15px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.075em;text-transform:uppercase;cursor:pointer;transition:.2s ease}
      .vyrdict-index-claw .vti-cat:hover{border-color:rgba(23,21,17,.35);color:var(--ink);transform:translateY(-1px)}
      .vyrdict-index-claw .vti-cat.is-active{background:var(--ink);border-color:var(--ink);color:#fffaf5}
      .vyrdict-index-claw .vti-machine-shell{position:relative;margin-top:8px;border-radius:42px;padding:15px;background:linear-gradient(145deg,#efeae6 0%,#bdb5af 18%,#f7f4f1 41%,#aaa19a 67%,#e9e4df 100%);box-shadow:0 28px 70px rgba(73,52,42,.14),inset 0 1px 0 #fff}
      .vyrdict-index-claw .vti-machine{position:relative;height:650px;overflow:hidden;border-radius:30px;background:linear-gradient(180deg,rgba(255,255,255,.74),rgba(252,247,243,.82) 48%,rgba(227,210,201,.93));border:1px solid rgba(255,255,255,.82);box-shadow:inset 0 0 0 1px rgba(23,21,17,.05),inset 0 -70px 90px rgba(170,135,117,.11)}
      .vyrdict-index-claw .vti-machine:before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.48) 0 12%,transparent 13% 76%,rgba(255,255,255,.22) 77% 82%,transparent 83%);pointer-events:none;z-index:8}
      .vyrdict-index-claw .vti-machine:after{content:'VYRDICT';position:absolute;right:24px;bottom:18px;color:rgba(23,21,17,.13);font:950 46px/1 Arial,Helvetica,sans-serif;letter-spacing:-.065em;pointer-events:none}
      .vyrdict-index-claw .vti-rail{position:absolute;top:28px;left:7%;right:7%;height:9px;border-radius:99px;background:linear-gradient(180deg,#eeeae7,#aaa29c);box-shadow:0 4px 12px rgba(44,36,31,.14),inset 0 1px 0 #fff;z-index:9}
      .vyrdict-index-claw .vti-claw{--x:50%;--drop:0px;position:absolute;top:24px;left:var(--x);width:126px;height:270px;transform:translateX(-50%);transition:left .9s cubic-bezier(.22,.8,.22,1),transform .7s ease;z-index:20;pointer-events:none}
      .vyrdict-index-claw .vti-carriage{position:absolute;top:0;left:50%;width:56px;height:31px;transform:translateX(-50%);border-radius:8px;background:linear-gradient(135deg,#efebe8,#aaa19b 55%,#eee9e5);border:1px solid rgba(50,43,39,.13);box-shadow:0 4px 9px rgba(46,37,32,.14)}
      .vyrdict-index-claw .vti-wire{position:absolute;top:27px;left:50%;width:2px;height:calc(106px + var(--drop));transform:translateX(-50%);background:linear-gradient(#8f8883,#d9d3ce);transition:height .55s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber{position:absolute;top:calc(125px + var(--drop));left:50%;width:78px;height:68px;transform:translateX(-50%);transition:top .55s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber:before{content:'';position:absolute;left:50%;top:0;width:34px;height:25px;transform:translateX(-50%);border-radius:0 0 14px 14px;background:linear-gradient(145deg,#e5dfdb,#99908a);box-shadow:0 3px 8px rgba(43,35,31,.15)}
      .vyrdict-index-claw .vti-arm{position:absolute;top:16px;width:30px;height:48px;border:4px solid #a9a09a;border-top:0;border-radius:0 0 28px 28px;transition:transform .25s ease;transform-origin:top center}
      .vyrdict-index-claw .vti-arm.a{left:5px;transform:rotate(20deg)}
      .vyrdict-index-claw .vti-arm.b{right:5px;transform:rotate(-20deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .a{transform:rotate(-1deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .b{transform:rotate(1deg)}
      .vyrdict-index-claw .vti-floor{position:absolute;left:4%;right:4%;bottom:0;height:122px;border-radius:50% 50% 0 0/28px 28px 0 0;background:linear-gradient(180deg,#decfc6,#c5afa2 56%,#ae9588);box-shadow:inset 0 12px 28px rgba(255,255,255,.28);z-index:2}
      .vyrdict-index-claw .vti-products{position:absolute;inset:155px 5% 80px;z-index:5}
      .vyrdict-index-claw .vti-product{--x:50%;--y:65%;--r:0deg;position:absolute;left:var(--x);top:var(--y);width:clamp(112px,13vw,170px);height:clamp(122px,14vw,185px);padding:0;border:0;background:transparent;transform:translate(-50%,-50%) rotate(var(--r));transition:left .9s cubic-bezier(.2,.8,.2,1),top .7s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.9,.25,1),opacity .35s ease,filter .35s ease;cursor:pointer;z-index:6;filter:drop-shadow(0 12px 12px rgba(54,41,34,.11));outline:none}
      .vyrdict-index-claw .vti-product:hover{filter:drop-shadow(0 18px 18px rgba(54,41,34,.17));z-index:9}
      .vyrdict-index-claw .vti-product img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;pointer-events:none;mix-blend-mode:multiply}
      .vyrdict-index-claw .vti-product.is-target{z-index:13;filter:drop-shadow(0 20px 25px rgba(52,37,30,.18))}
      .vyrdict-index-claw .vti-product.is-lift{top:31%!important;transform:translate(-50%,-50%) rotate(0deg) scale(1.05)!important;z-index:16}
      .vyrdict-index-claw .vti-product.is-hero{left:50%!important;top:51%!important;width:clamp(225px,28vw,370px);height:clamp(260px,34vw,430px);transform:translate(-50%,-50%) rotate(0deg) scale(1)!important;z-index:18;filter:drop-shadow(0 28px 30px rgba(57,39,30,.2))}
      .vyrdict-index-claw .vti-product.is-dim{opacity:.18;filter:blur(1px) saturate(.7)}
      .vyrdict-index-claw .vti-name{position:absolute;left:50%;bottom:27px;transform:translateX(-50%) translateY(8px);z-index:23;width:min(620px,78%);text-align:center;opacity:0;transition:opacity .3s ease,transform .3s ease;pointer-events:none}
      .vyrdict-index-claw .vti-name.is-on{opacity:1;transform:translateX(-50%) translateY(0)}
      .vyrdict-index-claw .vti-name .brand{display:block;margin-bottom:5px;color:#74675e;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.15em;text-transform:uppercase}
      .vyrdict-index-claw .vti-name .name{display:block;color:#1e1a17;font:400 clamp(24px,3.2vw,39px)/1.04 Georgia,'Times New Roman',serif;letter-spacing:-.035em}
      .vyrdict-index-claw .vti-tap{position:absolute;right:25px;top:77px;z-index:21;border:1px solid rgba(23,21,17,.12);border-radius:999px;background:rgba(255,250,245,.7);backdrop-filter:blur(10px);padding:9px 12px;color:#71665e;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase}
      .vyrdict-index-claw .vti-empty{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:32px;color:#72665e;font:600 14px/1.6 Arial,Helvetica,sans-serif;z-index:25}
      .vyrdict-index-claw .vti-foot{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:17px;color:#786d65}
      .vyrdict-index-claw .vti-updated{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase}
      .vyrdict-index-claw .vti-hint{font:500 12px/1.4 Arial,Helvetica,sans-serif}
      @media(max-width:760px){
        .vyrdict-index-claw{padding:56px 0 64px!important}.vyrdict-index-claw .vti-wrap{width:min(100% - 24px,1240px)}.vyrdict-index-claw .vti-head{display:block}.vyrdict-index-claw .vti-sub{margin-top:14px}.vyrdict-index-claw .vti-machine-shell{border-radius:27px;padding:9px}.vyrdict-index-claw .vti-machine{height:530px;border-radius:20px}.vyrdict-index-claw .vti-products{inset:140px 3% 70px}.vyrdict-index-claw .vti-product{width:105px;height:120px}.vyrdict-index-claw .vti-product.is-hero{width:245px;height:300px}.vyrdict-index-claw .vti-machine:after{font-size:30px;right:14px}.vyrdict-index-claw .vti-tap{right:14px;top:65px}.vyrdict-index-claw .vti-foot{display:block}.vyrdict-index-claw .vti-hint{margin-top:7px}.vyrdict-index-claw .vti-name{bottom:20px;width:86%}
      }
      @media(prefers-reduced-motion:reduce){.vyrdict-index-claw *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}}
    `;
    document.head.appendChild(s)
  }

  function findWeeklySection(){
    const hs=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=hs.find(el=>norm(el.textContent).includes('weekly viral rankings'))||hs.find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function catalog(){
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      return Array.isArray(c?.p)?c.p:[];
    }catch{return []}
  }

  function fallbackProducts(category){
    let arr=catalog().filter(p=>p?.image_url&&p?.slug);
    if(category!=='All')arr=arr.filter(p=>norm(p.category)===norm(category));
    return arr.sort((a,b)=>(Number(b.viral_score)||0)-(Number(a.viral_score)||0)||(Number(b.worth_score)||0)-(Number(a.worth_score)||0)).slice(0,10);
  }

  async function fetchWeekly(category){
    try{
      const url=category==='All'?WEEKLY_ENDPOINT:WEEKLY_ENDPOINT+'?category='+encodeURIComponent(category);
      const r=await fetch(url,{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const j=await r.json();
      const arr=(Array.isArray(j?.products)?j.products:Array.isArray(j)?j:[]).filter(p=>p?.image_url&&p?.slug);
      if(arr.length)return arr.slice(0,10);
    }catch{}
    return fallbackProducts(category);
  }

  function productPositions(n){
    const base=[
      [13,68,-10],[28,72,7],[43,66,-4],[58,73,9],[73,65,-7],[86,71,8],[22,52,5],[48,52,-8],[76,51,6],[61,58,-3]
    ];
    return base.slice(0,n);
  }

  function machineMarkup(){
    return `
      <div class="vti-wrap">
        <div class="vti-head">
          <div><div class="vti-kicker">VYRDICT · UPDATED WEEKLY</div><h2 class="vti-title">Trending <i>Index</i></h2></div>
          <p class="vti-sub">The products the internet can’t stop reaching for. <strong>Pick a category and watch what rises.</strong></p>
        </div>
        <div class="vti-cats" role="tablist" aria-label="Trending Index categories"></div>
        <div class="vti-machine-shell">
          <div class="vti-machine" aria-live="polite">
            <div class="vti-rail"></div>
            <div class="vti-claw" aria-hidden="true"><div class="vti-carriage"></div><div class="vti-wire"></div><div class="vti-grabber"><i class="vti-arm a"></i><i class="vti-arm b"></i></div></div>
            <div class="vti-products"></div>
            <div class="vti-floor"></div>
            <div class="vti-name"><span class="brand"></span><span class="name"></span></div>
            <div class="vti-tap">Click the product</div>
          </div>
        </div>
        <div class="vti-foot"><span class="vti-updated">REFRESHES WITH THE WEEK’S VIRAL RANKINGS</span><span class="vti-hint">Tap any category to reload the machine.</span></div>
      </div>`;
  }

  function renderCategories(){
    const rail=root.querySelector('.vti-cats');
    rail.innerHTML='';
    CATEGORIES.forEach(c=>{
      const b=document.createElement('button');
      b.type='button';b.className='vti-cat'+(c===activeCategory?' is-active':'');b.textContent=c;b.setAttribute('role','tab');b.setAttribute('aria-selected',c===activeCategory?'true':'false');
      b.onclick=()=>selectCategory(c,b);
      rail.appendChild(b);
    });
  }

  function renderProducts(list){
    const box=root.querySelector('.vti-products');
    box.innerHTML='';
    if(!list.length){box.innerHTML='<div class="vti-empty">No current viral picks in this category yet.<br>Try another category.</div>';return}
    productPositions(list.length).forEach((pos,i)=>{
      const p=list[i];
      const b=document.createElement('button');
      b.type='button';b.className='vti-product';b.dataset.i=i;b.dataset.slug=p.slug;b.style.setProperty('--x',pos[0]+'%');b.style.setProperty('--y',pos[1]+'%');b.style.setProperty('--r',pos[2]+'deg');
      b.setAttribute('aria-label',[p.brand,p.name].filter(Boolean).join(' — '));
      const img=document.createElement('img');img.src=p.image_url;img.alt=[p.brand,p.name].filter(Boolean).join(' ');img.loading=i<5?'eager':'lazy';img.decoding='async';
      b.appendChild(img);
      b.onclick=e=>{e.preventDefault();location.assign('/product/'+encodeURIComponent(p.slug)+'/')};
      box.appendChild(b);
    });
  }

  async function selectCategory(c,button){
    if(c===activeCategory&&products.length)return;
    activeCategory=c;runId++;
    root.querySelectorAll('.vti-cat').forEach(b=>{const on=b.textContent===c;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on?'true':'false')});
    const box=root.querySelector('.vti-products');box.style.opacity='.34';
    const list=await fetchWeekly(c);
    if(!root?.isConnected)return;
    products=list;cycle=0;box.style.opacity='1';renderProducts(products);startCycle();
  }

  function setName(p,on){
    const n=root.querySelector('.vti-name');
    n.querySelector('.brand').textContent=p?.brand||activeCategory;
    n.querySelector('.name').textContent=p?.name||'';
    n.classList.toggle('is-on',!!on);
  }

  function clearState(){
    root.querySelectorAll('.vti-product').forEach(el=>el.classList.remove('is-target','is-lift','is-hero','is-dim'));
    const claw=root.querySelector('.vti-claw'),grab=root.querySelector('.vti-grabber');
    claw.style.setProperty('--drop','0px');grab.classList.remove('is-grab');setName(null,false);
  }

  async function animateOne(localRun){
    if(!products.length||!root?.isConnected||localRun!==runId)return;
    const els=[...root.querySelectorAll('.vti-product')];
    if(!els.length)return;
    const i=cycle%Math.min(products.length,els.length),target=els[i],p=products[i];cycle++;
    clearState();
    const x=parseFloat(getComputedStyle(target).getPropertyValue('--x'))||50;
    const claw=root.querySelector('.vti-claw'),grab=root.querySelector('.vti-grabber');
    claw.style.left=x+'%';target.classList.add('is-target');
    await sleep(920);if(localRun!==runId)return;
    claw.style.setProperty('--drop','210px');
    await sleep(590);if(localRun!==runId)return;
    grab.classList.add('is-grab');
    await sleep(280);if(localRun!==runId)return;
    target.classList.add('is-lift');claw.style.setProperty('--drop','0px');
    await sleep(620);if(localRun!==runId)return;
    els.forEach((e,j)=>{if(j!==i)e.classList.add('is-dim')});
    target.classList.remove('is-lift');target.classList.add('is-hero');claw.style.left='50%';setName(p,true);
    await sleep(2800);if(localRun!==runId)return;
    setName(p,false);target.classList.remove('is-hero');els.forEach(e=>e.classList.remove('is-dim'));
    await sleep(520);
  }

  async function startCycle(){
    const id=++runId;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced){const first=root.querySelector('.vti-product');if(first){first.classList.add('is-hero');setName(products[0],true)}return}
    while(root?.isConnected&&id===runId&&isHome())await animateOne(id);
  }

  async function build(section){
    if(!section||section.dataset.vyrdictTrendingClaw==='1')return false;
    addStyle();
    section.dataset.vyrdictTrendingClaw='1';section.className='section vyrdict-index-claw';section.id='trending-index';section.innerHTML=machineMarkup();root=section;renderCategories();
    products=await fetchWeekly('All');
    if(!root?.isConnected)return false;
    renderProducts(products);startCycle();return true;
  }

  function boot(attempt=0){
    if(!isHome())return;
    const s=findWeeklySection();
    if(s){build(s);return}
    if(attempt<40){clearTimeout(bootTimer);bootTimer=setTimeout(()=>boot(attempt+1),100)}
  }

  function watch(){
    observer?.disconnect();
    observer=new MutationObserver(()=>{if(!isHome())return;if(!document.getElementById('trending-index'))boot()});
    observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{boot();watch()},{once:true});else{boot();watch()}
  addEventListener('popstate',()=>setTimeout(()=>{runId++;boot()},40));
})();
