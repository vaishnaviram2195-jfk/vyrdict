(()=>{
  if(window.__vyrdictTrendingClawV3)return;
  window.__vyrdictTrendingClawV3=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let section=null,products=[],active='All',cycle=0,runId=0,observer=null;

  function addStyle(){
    if(document.getElementById('vyrdict-trending-claw-v3-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-trending-claw-v3-style';
    s.textContent=`
      .vyrdict-index-claw{--ink:#171511;--paper:#fffaf5;--cream:#f4ede5;--blush:#e5c9c3;--rose:#d96b78;--taupe:#9a8277;position:relative;overflow:hidden;background:linear-gradient(180deg,#f7efe9 0%,#efe2da 100%)!important;padding:64px 0 72px!important;border:0!important}
      .vyrdict-index-claw:before{content:'';position:absolute;inset:-20% -10% auto;height:70%;background:radial-gradient(ellipse at 25% 15%,rgba(255,255,255,.74),transparent 47%),radial-gradient(ellipse at 78% 22%,rgba(226,190,188,.28),transparent 44%);pointer-events:none}
      .vyrdict-index-claw .vti-wrap{position:relative;z-index:1;width:min(1220px,calc(100% - 40px));margin:0 auto}
      .vyrdict-index-claw .vti-head{display:grid;grid-template-columns:1fr auto;align-items:end;gap:26px;margin-bottom:20px}
      .vyrdict-index-claw .vti-kicker{margin:0 0 9px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7f6c63}
      .vyrdict-index-claw .vti-title{margin:0;font:400 clamp(44px,5.3vw,72px)/.93 Georgia,'Times New Roman',serif;letter-spacing:-.055em;color:var(--ink)}
      .vyrdict-index-claw .vti-title i{font-weight:400}
      .vyrdict-index-claw .vti-sub{max-width:390px;margin:0 0 7px;font:500 14px/1.5 Arial,Helvetica,sans-serif;color:#70645e;text-align:right}
      .vyrdict-index-claw .vti-cats{display:flex;gap:8px;overflow-x:auto;padding:2px 1px 15px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      .vyrdict-index-claw .vti-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-claw .vti-cat{flex:0 0 auto;appearance:none;border:1px solid rgba(23,21,17,.13);background:rgba(255,250,245,.75);color:#675d57;border-radius:999px;padding:11px 15px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.065em;text-transform:uppercase;cursor:pointer;transition:.18s ease}
      .vyrdict-index-claw .vti-cat:hover{border-color:rgba(23,21,17,.35);color:var(--ink)}
      .vyrdict-index-claw .vti-cat.is-active{background:var(--ink);border-color:var(--ink);color:#fff}

      .vyrdict-index-claw .vti-grid{display:grid;grid-template-columns:minmax(0,1.03fr) minmax(0,.97fr);gap:22px;align-items:stretch}
      .vyrdict-index-claw .vti-machine-card,.vyrdict-index-claw .vti-reveal-card{min-width:0;height:520px;border-radius:30px;overflow:hidden;box-shadow:0 24px 65px rgba(74,52,42,.12)}

      .vyrdict-index-claw .vti-machine-card{position:relative;padding:11px;box-sizing:border-box;background:linear-gradient(140deg,#efe9e4 0%,#a99d96 18%,#f3efeb 43%,#9c918b 67%,#e5ded9 100%)}
      .vyrdict-index-claw .vti-machine{position:relative;width:100%;height:100%;overflow:hidden;border-radius:21px;background:linear-gradient(180deg,#f7e9dd 0%,#f4e5d9 64%,#d5b8a9 100%);border:1px solid rgba(255,255,255,.7);box-shadow:inset 0 0 0 1px rgba(23,21,17,.04),inset 0 -56px 70px rgba(109,77,61,.11)}
      .vyrdict-index-claw .vti-machine:after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,rgba(255,255,255,.37) 0 9%,transparent 10% 75%,rgba(255,255,255,.16) 76% 81%,transparent 82%);pointer-events:none;z-index:30}
      .vyrdict-index-claw .vti-marquee{position:absolute;left:0;right:0;top:0;height:76px;display:flex;align-items:center;justify-content:center;background:linear-gradient(180deg,#ead6cb,#d8bbb0);border-bottom:1px solid rgba(66,48,40,.14);z-index:19;box-shadow:0 8px 18px rgba(67,45,35,.08)}
      .vyrdict-index-claw .vti-marquee span{font:400 38px/1 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#3a2c27}
      .vyrdict-index-claw .vti-marquee span:after{content:'';display:inline-block;width:7px;height:7px;background:var(--rose);margin-left:4px}
      .vyrdict-index-claw .vti-rail{position:absolute;left:8%;right:8%;top:94px;height:7px;border-radius:99px;background:linear-gradient(180deg,#ece8e5,#958b85);box-shadow:0 3px 9px rgba(43,35,31,.12);z-index:14}
      .vyrdict-index-claw .vti-claw{--drop:0px;position:absolute;left:50%;top:89px;width:98px;height:236px;transform:translateX(-50%);transition:left .72s cubic-bezier(.22,.8,.22,1);z-index:22;pointer-events:none}
      .vyrdict-index-claw .vti-carriage{position:absolute;top:0;left:50%;width:48px;height:25px;transform:translateX(-50%);border-radius:7px;background:linear-gradient(135deg,#f0ece9,#948a84 56%,#e9e3df);border:1px solid rgba(50,43,39,.12);box-shadow:0 4px 9px rgba(46,37,32,.12)}
      .vyrdict-index-claw .vti-wire{position:absolute;top:22px;left:50%;width:2px;height:calc(74px + var(--drop));transform:translateX(-50%);background:linear-gradient(#827b76,#ddd7d2);transition:height .46s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber{position:absolute;top:calc(91px + var(--drop));left:50%;width:67px;height:58px;transform:translateX(-50%);transition:top .46s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber:before{content:'';position:absolute;left:50%;top:0;width:28px;height:20px;transform:translateX(-50%);border-radius:0 0 12px 12px;background:linear-gradient(145deg,#e4ded9,#918781)}
      .vyrdict-index-claw .vti-arm{position:absolute;top:13px;width:25px;height:41px;border:4px solid #9f9690;border-top:0;border-radius:0 0 24px 24px;transition:transform .2s ease;transform-origin:top center}
      .vyrdict-index-claw .vti-arm.a{left:4px;transform:rotate(22deg)}.vyrdict-index-claw .vti-arm.b{right:4px;transform:rotate(-22deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .a{transform:rotate(-2deg)}.vyrdict-index-claw .vti-grabber.is-grab .b{transform:rotate(2deg)}
      .vyrdict-index-claw .vti-floor{position:absolute;left:3%;right:3%;bottom:-24px;height:128px;border-radius:50% 50% 0 0/30px 30px 0 0;background:linear-gradient(180deg,#dbc4b7,#c3a495 62%,#aa8778);box-shadow:inset 0 12px 26px rgba(255,255,255,.22);z-index:2}
      .vyrdict-index-claw .vti-products{position:absolute;inset:175px 6% 69px;z-index:6}
      .vyrdict-index-claw .vti-product{--x:50%;--y:70%;--r:0deg;position:absolute;left:var(--x);top:var(--y);width:clamp(80px,8.4vw,120px);height:clamp(96px,10vw,142px);padding:0;border:0;background:transparent;transform:translate(-50%,-50%) rotate(var(--r));transition:transform .3s ease,opacity .26s ease,filter .26s ease;cursor:pointer;filter:drop-shadow(0 9px 10px rgba(54,41,34,.15));z-index:7}
      .vyrdict-index-claw .vti-product img{width:100%;height:100%;display:block;object-fit:contain;object-position:center;pointer-events:none}
      .vyrdict-index-claw .vti-product:hover{transform:translate(-50%,-50%) rotate(var(--r)) scale(1.05);z-index:12}
      .vyrdict-index-claw .vti-product.is-target{z-index:15;filter:drop-shadow(0 15px 15px rgba(52,37,30,.22))}
      .vyrdict-index-claw .vti-product.is-grabbed{opacity:.12;transform:translate(-50%,-72%) rotate(0deg) scale(.88)}
      .vyrdict-index-claw .vti-controls{position:absolute;left:18px;right:18px;bottom:15px;height:54px;border-radius:15px;background:rgba(231,211,201,.9);border:1px solid rgba(80,57,47,.14);display:flex;align-items:center;justify-content:space-between;padding:0 16px;box-sizing:border-box;z-index:24}
      .vyrdict-index-claw .vti-joystick{width:25px;height:25px;border-radius:50%;background:linear-gradient(145deg,#e9c3bc,#c57979);box-shadow:inset 0 2px 2px rgba(255,255,255,.45)}
      .vyrdict-index-claw .vti-machine-note{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(23,21,17,.45)}
      .vyrdict-index-claw .vti-play{width:88px;height:29px;border-radius:999px;background:#d08a8c;color:#fffaf5;display:grid;place-items:center;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;box-shadow:inset 0 1px 0 rgba(255,255,255,.35)}

      .vyrdict-index-claw .vti-reveal-card{position:relative;background:linear-gradient(145deg,#fffaf6 0%,#f7ece6 56%,#ead9d1 100%);border:1px solid rgba(255,255,255,.7)}
      .vyrdict-index-claw .vti-reveal-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 76% 18%,rgba(255,255,255,.8),transparent 33%),linear-gradient(118deg,transparent 0 67%,rgba(255,255,255,.16) 68% 75%,transparent 76%);pointer-events:none}
      .vyrdict-index-claw .vti-panel-top{position:absolute;left:28px;right:28px;top:25px;display:flex;align-items:center;justify-content:space-between;z-index:5}
      .vyrdict-index-claw .vti-now,.vyrdict-index-claw .vti-panel-cat{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a15f64}
      .vyrdict-index-claw .vti-reveal-link{position:absolute;inset:62px 24px 118px;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.88);transition:opacity .32s ease,transform .52s cubic-bezier(.18,.85,.2,1);z-index:3;cursor:pointer}
      .vyrdict-index-claw .vti-reveal-link.is-on{opacity:1;transform:scale(1)}
      .vyrdict-index-claw .vti-reveal-link img{display:block;width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 26px 28px rgba(67,43,33,.18))}
      .vyrdict-index-claw .vti-panel-copy{position:absolute;left:30px;right:30px;bottom:26px;z-index:5;opacity:0;transform:translateY(8px);transition:opacity .28s ease .08s,transform .35s ease .08s}
      .vyrdict-index-claw .vti-panel-copy.is-on{opacity:1;transform:translateY(0)}
      .vyrdict-index-claw .vti-brand{display:block;margin-bottom:7px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#8f7770}
      .vyrdict-index-claw .vti-name{display:block;max-width:90%;font:400 clamp(28px,3vw,42px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#201916}
      .vyrdict-index-claw .vti-open{display:inline-flex;align-items:center;gap:8px;margin-top:12px;color:#201916;text-decoration:none;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid rgba(32,25,22,.55);padding-bottom:3px}
      .vyrdict-index-claw .vti-placeholder{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:70%;text-align:center;font:italic 26px/1.1 Georgia,'Times New Roman',serif;color:#8a746c;z-index:2}
      .vyrdict-index-claw .vti-placeholder.is-off{opacity:0}
      .vyrdict-index-claw .vti-foot{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:14px;color:#776b64}
      .vyrdict-index-claw .vti-updated{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase}
      .vyrdict-index-claw .vti-hint{font:500 12px/1.4 Arial,Helvetica,sans-serif;text-align:right}

      @media(max-width:900px){
        .vyrdict-index-claw .vti-grid{grid-template-columns:1fr .92fr;gap:16px}
        .vyrdict-index-claw .vti-machine-card,.vyrdict-index-claw .vti-reveal-card{height:480px}
      }
      @media(max-width:720px){
        .vyrdict-index-claw{padding:50px 0 58px!important}
        .vyrdict-index-claw .vti-wrap{width:min(100% - 24px,620px)}
        .vyrdict-index-claw .vti-head{grid-template-columns:1fr;gap:10px;margin-bottom:14px}
        .vyrdict-index-claw .vti-sub{text-align:left;max-width:100%}
        .vyrdict-index-claw .vti-title{font-size:49px}
        .vyrdict-index-claw .vti-grid{grid-template-columns:1fr;gap:14px}
        .vyrdict-index-claw .vti-machine-card{height:430px;border-radius:24px}
        .vyrdict-index-claw .vti-reveal-card{height:445px;border-radius:24px}
        .vyrdict-index-claw .vti-marquee{height:64px}.vyrdict-index-claw .vti-marquee span{font-size:31px}
        .vyrdict-index-claw .vti-rail{top:80px}.vyrdict-index-claw .vti-claw{top:76px}
        .vyrdict-index-claw .vti-products{inset:152px 5% 63px}
        .vyrdict-index-claw .vti-product{width:82px;height:104px}
        .vyrdict-index-claw .vti-foot{align-items:flex-start;flex-direction:column}.vyrdict-index-claw .vti-hint{text-align:left}
      }
      @media(prefers-reduced-motion:reduce){.vyrdict-index-claw *{transition:none!important;animation:none!important}}
    `;
    document.head.appendChild(s);
  }

  function weeklySection(){
    const heads=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=heads.find(x=>norm(x.textContent).includes('weekly viral rankings'))||heads.find(x=>norm(x.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function catalog(){
    try{return Array.isArray(window.S?.p)?window.S.p:[]}catch{return []}
  }

  async function getProducts(category){
    let list=[];
    if(category!=='All'){
      try{
        const r=await fetch(WEEKLY_ENDPOINT+'?category='+encodeURIComponent(category),{cache:'no-store'});
        if(r.ok){const d=await r.json();list=Array.isArray(d?.products)?d.products:[]}
      }catch{}
    }
    const all=catalog().filter(p=>p&&p.slug&&p.image_url);
    if(category==='All'){
      list=[...all].sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    }else if(!list.length){
      list=all.filter(p=>norm(p.category)===norm(category)).sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    }
    const seen=new Set();
    return list.filter(p=>p&&p.slug&&p.image_url&&!seen.has(p.slug)&&(seen.add(p.slug),true)).slice(0,7);
  }

  function layoutProducts(list){
    const pos=[
      [17,72,-9],[34,61,7],[50,72,-4],[65,60,6],[82,71,10],[42,49,-8],[70,46,5]
    ];
    return list.map((p,i)=>{
      const [x,y,r]=pos[i%pos.length];
      return `<button class="vti-product" type="button" data-i="${i}" aria-label="Open ${esc((p.brand? p.brand+' ':'')+p.name)}" style="--x:${x}%;--y:${y}%;--r:${r}deg"><img src="${esc(p.image_url)}" alt="${esc((p.brand? p.brand+' ':'')+p.name)}" loading="eager"></button>`
    }).join('');
  }

  function esc(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}

  function template(){
    return `<div class="vti-wrap">
      <div class="vti-head">
        <div><p class="vti-kicker">VYRDICT · LIVE DISCOVERY</p><h2 class="vti-title">Trending <i>Index</i></h2></div>
        <p class="vti-sub">What’s going viral right now. Pick a category and watch the machine pull what’s making noise.</p>
      </div>
      <div class="vti-cats" role="tablist" aria-label="Trending Index categories">${CATEGORIES.map(c=>`<button class="vti-cat${c==='All'?' is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="vti-grid">
        <div class="vti-machine-card">
          <div class="vti-machine">
            <div class="vti-marquee"><span>VYRDICT</span></div>
            <div class="vti-rail"></div>
            <div class="vti-claw"><div class="vti-carriage"></div><div class="vti-wire"></div><div class="vti-grabber"><i class="vti-arm a"></i><i class="vti-arm b"></i></div></div>
            <div class="vti-products"></div>
            <div class="vti-floor"></div>
            <div class="vti-controls"><span class="vti-joystick"></span><span class="vti-machine-note">THE INTERNET, CURATED</span><span class="vti-play">TRENDING</span></div>
          </div>
        </div>
        <div class="vti-reveal-card">
          <div class="vti-panel-top"><span class="vti-now">Trending now</span><span class="vti-panel-cat">All</span></div>
          <div class="vti-placeholder">The claw is choosing what’s next.</div>
          <a class="vti-reveal-link" href="#" aria-label="Open trending product"><img alt=""></a>
          <div class="vti-panel-copy"><span class="vti-brand"></span><span class="vti-name"></span><a class="vti-open" href="#">Open product <span>→</span></a></div>
        </div>
      </div>
      <div class="vti-foot"><span class="vti-updated">LIVE PRODUCT INDEX · REFRESHES WITH VYRDICT DATA</span><span class="vti-hint">Click the product to see the full Viral Score, Worth Score and verdict.</span></div>
    </div>`;
  }

  function href(p){return '/product/'+encodeURIComponent(p.slug)+'/'}

  function bind(){
    section.querySelectorAll('.vti-cat').forEach(btn=>btn.addEventListener('click',async()=>{
      const cat=btn.dataset.cat||'All';
      if(cat===active)return;
      active=cat;
      section.querySelectorAll('.vti-cat').forEach(x=>x.classList.toggle('is-active',x===btn));
      section.querySelector('.vti-panel-cat').textContent=cat;
      await load(cat);
    }));
    section.addEventListener('click',e=>{
      const pbtn=e.target.closest('.vti-product');
      if(!pbtn)return;
      const p=products[Number(pbtn.dataset.i)];
      if(p)location.assign(href(p));
    });
  }

  async function load(cat){
    const id=++runId;
    cycle=0;
    products=await getProducts(cat);
    if(id!==runId||!section?.isConnected)return;
    const holder=section.querySelector('.vti-products');
    holder.innerHTML=layoutProducts(products);
    section.querySelector('.vti-placeholder')?.classList.toggle('is-off',products.length>0);
    section.querySelector('.vti-reveal-link')?.classList.remove('is-on');
    section.querySelector('.vti-panel-copy')?.classList.remove('is-on');
    if(products.length)animateLoop(id);
  }

  async function showProduct(p,index,id){
    if(id!==runId||!section?.isConnected)return;
    const productEls=[...section.querySelectorAll('.vti-product')];
    const target=productEls[index];
    if(!target)return;
    productEls.forEach(x=>x.classList.remove('is-target','is-grabbed'));
    target.classList.add('is-target');

    const machine=section.querySelector('.vti-machine');
    const claw=section.querySelector('.vti-claw');
    const grabber=section.querySelector('.vti-grabber');
    const mb=machine.getBoundingClientRect(),tb=target.getBoundingClientRect();
    const center=((tb.left+tb.width/2)-mb.left)/mb.width*100;
    claw.style.left=Math.max(12,Math.min(88,center))+'%';
    claw.style.setProperty('--drop','0px');
    grabber.classList.remove('is-grab');
    await sleep(620); if(id!==runId)return;
    claw.style.setProperty('--drop','92px');
    await sleep(470); if(id!==runId)return;
    grabber.classList.add('is-grab');
    await sleep(220); if(id!==runId)return;
    target.classList.add('is-grabbed');
    claw.style.setProperty('--drop','0px');
    await sleep(500); if(id!==runId)return;

    const link=section.querySelector('.vti-reveal-link');
    const img=link.querySelector('img');
    const copy=section.querySelector('.vti-panel-copy');
    link.classList.remove('is-on');copy.classList.remove('is-on');
    await sleep(120); if(id!==runId)return;
    img.src=p.image_url;img.alt=(p.brand? p.brand+' ':'')+p.name;
    link.href=href(p);section.querySelector('.vti-open').href=href(p);
    section.querySelector('.vti-brand').textContent=p.brand||p.category||'';
    section.querySelector('.vti-name').textContent=p.name||'';
    link.classList.add('is-on');copy.classList.add('is-on');
    await sleep(2600); if(id!==runId)return;
    target.classList.remove('is-grabbed','is-target');
    grabber.classList.remove('is-grab');
  }

  async function animateLoop(id){
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      const p=products[0];if(p){const link=section.querySelector('.vti-reveal-link'),img=link.querySelector('img'),copy=section.querySelector('.vti-panel-copy');img.src=p.image_url;img.alt=(p.brand? p.brand+' ':'')+p.name;link.href=href(p);section.querySelector('.vti-open').href=href(p);section.querySelector('.vti-brand').textContent=p.brand||'';section.querySelector('.vti-name').textContent=p.name||'';link.classList.add('is-on');copy.classList.add('is-on')}return;
    }
    while(id===runId&&section?.isConnected&&products.length){
      const i=cycle%products.length;cycle++;
      await showProduct(products[i],i,id);
      await sleep(320);
    }
  }

  function mount(){
    if(!isHome())return false;
    const old=weeklySection();
    if(!old)return false;
    if(old.classList.contains('vyrdict-index-claw')){section=old;return true}
    addStyle();
    old.className='section vyrdict-index-claw';
    old.id='trending-index';
    old.innerHTML=template();
    section=old;
    bind();
    load('All');
    return true;
  }

  function boot(attempt=0){
    if(mount())return;
    if(attempt<30)setTimeout(()=>boot(attempt+1),100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  observer=new MutationObserver(()=>{if(isHome()&&!document.querySelector('.vyrdict-index-claw'))boot()});
  const target=document.getElementById('app')||document.body;if(target)observer.observe(target,{childList:true,subtree:false});
  addEventListener('popstate',()=>setTimeout(()=>boot(),40));
})();
