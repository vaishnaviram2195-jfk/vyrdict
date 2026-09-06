(()=>{
  if(window.__vyrdictTrendingClawV2)return;
  window.__vyrdictTrendingClawV2=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let root=null,activeCategory='All',products=[],runId=0,cycleIndex=0,bootTimer=0;

  function addStyle(){
    if(document.getElementById('vyrdict-trending-claw-v2-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-trending-claw-v2-style';
    s.textContent=`
      .vyrdict-index-claw{--ink:#171511;--cream:#f4ede5;--paper:#fffaf5;--rose:#e8677d;--blush:#e5c7c2;--taupe:#9c887d;position:relative;overflow:hidden;background:linear-gradient(180deg,#f6efe9 0%,#eee2da 100%)!important;border-block:0!important;padding:68px 0 78px!important}
      .vyrdict-index-claw:before{content:'';position:absolute;inset:-35% -18% auto;height:75%;background:radial-gradient(ellipse at 28% 20%,rgba(255,255,255,.72),transparent 48%),radial-gradient(ellipse at 78% 28%,rgba(226,190,188,.34),transparent 46%);pointer-events:none}
      .vyrdict-index-claw .vti-wrap{position:relative;z-index:1;width:min(1240px,calc(100% - 42px));margin:0 auto}
      .vyrdict-index-claw .vti-head{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:20px}
      .vyrdict-index-claw .vti-kicker{margin:0 0 9px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#786b63}
      .vyrdict-index-claw .vti-title{margin:0;font:400 clamp(42px,5.7vw,78px)/.93 Georgia,'Times New Roman',serif;letter-spacing:-.055em;color:var(--ink)}
      .vyrdict-index-claw .vti-title i{font-style:italic;font-weight:400}
      .vyrdict-index-claw .vti-sub{max-width:430px;margin:0 0 7px;font:500 14px/1.55 Arial,Helvetica,sans-serif;color:#6b6059}
      .vyrdict-index-claw .vti-cats{display:flex;gap:8px;overflow-x:auto;padding:3px 1px 14px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      .vyrdict-index-claw .vti-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-claw .vti-cat{flex:0 0 auto;appearance:none;border:1px solid rgba(23,21,17,.13);background:rgba(255,250,245,.72);color:#685f59;border-radius:999px;padding:11px 15px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.075em;text-transform:uppercase;cursor:pointer;transition:.18s ease}
      .vyrdict-index-claw .vti-cat:hover{border-color:rgba(23,21,17,.34);color:var(--ink);transform:translateY(-1px)}
      .vyrdict-index-claw .vti-cat.is-active{background:var(--ink);border-color:var(--ink);color:#fffaf5}

      .vyrdict-index-claw .vti-stage{display:grid;grid-template-columns:minmax(0,1.22fr) minmax(330px,.78fr);gap:18px;align-items:stretch;margin-top:6px}
      .vyrdict-index-claw .vti-machine-shell{position:relative;border-radius:34px;padding:12px;background:linear-gradient(145deg,#eee9e5 0%,#aaa19b 20%,#f5f1ed 43%,#9f9690 67%,#e7e1dc 100%);box-shadow:0 26px 66px rgba(72,50,40,.14),inset 0 1px 0 rgba(255,255,255,.9)}
      .vyrdict-index-claw .vti-machine{position:relative;height:558px;overflow:hidden;border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.83),rgba(249,242,237,.88) 56%,rgba(221,199,188,.96));border:1px solid rgba(255,255,255,.84);box-shadow:inset 0 0 0 1px rgba(23,21,17,.04),inset 0 -70px 80px rgba(133,96,77,.12)}
      .vyrdict-index-claw .vti-machine:before{content:'';position:absolute;inset:0;background:linear-gradient(112deg,rgba(255,255,255,.48) 0 10%,transparent 11% 73%,rgba(255,255,255,.19) 74% 79%,transparent 80%);pointer-events:none;z-index:25}
      .vyrdict-index-claw .vti-machine-brand{position:absolute;left:22px;top:19px;z-index:30;font:950 17px/1 Arial,Helvetica,sans-serif;letter-spacing:-.055em;color:rgba(23,21,17,.76)}
      .vyrdict-index-claw .vti-machine-brand:after{content:'';display:inline-block;width:5px;height:5px;margin:0 0 1px 2px;background:var(--rose)}
      .vyrdict-index-claw .vti-rail{position:absolute;left:7%;right:7%;top:30px;height:8px;border-radius:99px;background:linear-gradient(180deg,#ebe7e4,#9c948f);box-shadow:0 3px 9px rgba(43,35,31,.13),inset 0 1px 0 #fff;z-index:11}
      .vyrdict-index-claw .vti-claw{--drop:0px;position:absolute;left:50%;top:26px;width:112px;height:244px;transform:translateX(-50%);transition:left .75s cubic-bezier(.22,.8,.22,1);z-index:20;pointer-events:none}
      .vyrdict-index-claw .vti-carriage{position:absolute;top:0;left:50%;width:51px;height:27px;transform:translateX(-50%);border-radius:7px;background:linear-gradient(135deg,#efebe8,#9f9690 55%,#eee9e5);border:1px solid rgba(50,43,39,.12);box-shadow:0 4px 9px rgba(46,37,32,.12)}
      .vyrdict-index-claw .vti-wire{position:absolute;top:24px;left:50%;width:2px;height:calc(92px + var(--drop));transform:translateX(-50%);background:linear-gradient(#8b847f,#d9d3ce);transition:height .5s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber{position:absolute;top:calc(108px + var(--drop));left:50%;width:72px;height:62px;transform:translateX(-50%);transition:top .5s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber:before{content:'';position:absolute;left:50%;top:0;width:31px;height:22px;transform:translateX(-50%);border-radius:0 0 13px 13px;background:linear-gradient(145deg,#e6e0dc,#938a84);box-shadow:0 3px 8px rgba(43,35,31,.14)}
      .vyrdict-index-claw .vti-arm{position:absolute;top:14px;width:28px;height:44px;border:4px solid #a49b95;border-top:0;border-radius:0 0 26px 26px;transition:transform .22s ease;transform-origin:top center}
      .vyrdict-index-claw .vti-arm.a{left:4px;transform:rotate(21deg)}
      .vyrdict-index-claw .vti-arm.b{right:4px;transform:rotate(-21deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .a{transform:rotate(-2deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .b{transform:rotate(2deg)}
      .vyrdict-index-claw .vti-floor{position:absolute;left:3%;right:3%;bottom:-18px;height:140px;border-radius:50% 50% 0 0/32px 32px 0 0;background:linear-gradient(180deg,#ddc9be,#c5a99b 58%,#ac8c7d);box-shadow:inset 0 12px 28px rgba(255,255,255,.25);z-index:2}
      .vyrdict-index-claw .vti-products{position:absolute;inset:132px 5% 64px;z-index:5}
      .vyrdict-index-claw .vti-product{--x:50%;--y:72%;--r:0deg;position:absolute;left:var(--x);top:var(--y);width:clamp(94px,9.8vw,140px);height:clamp(108px,11.2vw,158px);padding:0;border:0;background:transparent;transform:translate(-50%,-50%) rotate(var(--r));transition:transform .35s ease,opacity .28s ease,filter .28s ease;cursor:pointer;z-index:6;filter:drop-shadow(0 10px 11px rgba(54,41,34,.12));outline:none}
      .vyrdict-index-claw .vti-product img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;pointer-events:none;mix-blend-mode:multiply}
      .vyrdict-index-claw .vti-product:hover{transform:translate(-50%,-50%) rotate(var(--r)) scale(1.06);z-index:10}
      .vyrdict-index-claw .vti-product.is-target{z-index:14;filter:drop-shadow(0 18px 18px rgba(52,37,30,.2))}
      .vyrdict-index-claw .vti-product.is-grabbed{transform:translate(-50%,-72%) rotate(0deg) scale(.9);opacity:.16}
      .vyrdict-index-claw .vti-machine-note{position:absolute;left:20px;bottom:17px;z-index:30;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(23,21,17,.46)}

      .vyrdict-index-claw .vti-reveal{position:relative;height:582px;overflow:hidden;border-radius:34px;background:linear-gradient(145deg,#d9c1bb 0%,#ead8d1 42%,#cbb0aa 100%);box-shadow:0 26px 66px rgba(72,50,40,.12),inset 0 1px 0 rgba(255,255,255,.45)}
      .vyrdict-index-claw .vti-reveal:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 72% 19%,rgba(255,255,255,.55),transparent 33%),linear-gradient(118deg,transparent 0 60%,rgba(255,255,255,.13) 61% 69%,transparent 70%);pointer-events:none}
      .vyrdict-index-claw .vti-reveal-inner{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:30px 30px 28px;box-sizing:border-box}
      .vyrdict-index-claw .vti-rank{position:absolute;left:26px;top:24px;font:400 clamp(58px,7vw,92px)/.8 Georgia,'Times New Roman',serif;letter-spacing:-.07em;color:rgba(255,250,245,.62);z-index:2;user-select:none}
      .vyrdict-index-claw .vti-picked{position:absolute;right:24px;top:26px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:rgba(23,21,17,.48);z-index:2}
      .vyrdict-index-claw .vti-hero-link{position:absolute;left:50%;top:45%;width:72%;height:61%;transform:translate(-50%,-50%) scale(.86);opacity:0;transition:opacity .36s ease,transform .55s cubic-bezier(.18,.85,.2,1);z-index:4;cursor:pointer}
      .vyrdict-index-claw .vti-hero-link.is-on{opacity:1;transform:translate(-50%,-50%) scale(1)}
      .vyrdict-index-claw .vti-hero-link img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 27px 26px rgba(61,39,31,.23));mix-blend-mode:multiply}
      .vyrdict-index-claw .vti-copy{position:relative;z-index:6;padding-right:8px;opacity:0;transform:translateY(9px);transition:opacity .3s ease .08s,transform .38s ease .08s}
      .vyrdict-index-claw .vti-copy.is-on{opacity:1;transform:translateY(0)}
      .vyrdict-index-claw .vti-brand{display:block;margin-bottom:7px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:rgba(23,21,17,.55)}
      .vyrdict-index-claw .vti-name{display:block;max-width:94%;font:400 clamp(28px,3.2vw,43px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#211b18}
      .vyrdict-index-claw .vti-view{display:inline-flex;align-items:center;gap:10px;margin-top:13px;color:#211b18;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid rgba(33,27,24,.58);padding-bottom:3px}
      .vyrdict-index-claw .vti-view:hover{opacity:.62}
      .vyrdict-index-claw .vti-placeholder{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);width:72%;text-align:center;color:rgba(33,27,24,.48);font:400 28px/1.12 Georgia,'Times New Roman',serif;font-style:italic;z-index:1}
      .vyrdict-index-claw .vti-placeholder.is-off{opacity:0}
      .vyrdict-index-claw .vti-foot{display:flex;justify-content:space-between;gap:20px;margin-top:15px;color:#786d65}
      .vyrdict-index-claw .vti-updated{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase}
      .vyrdict-index-claw .vti-hint{font:500 12px/1.45 Arial,Helvetica,sans-serif}
      .vyrdict-index-claw .vti-empty{height:100%;display:grid;place-items:center;text-align:center;padding:30px;box-sizing:border-box;color:#71665f;font:600 14px/1.6 Arial,Helvetica,sans-serif}

      @media(max-width:900px){.vyrdict-index-claw .vti-stage{grid-template-columns:1.05fr .95fr}.vyrdict-index-claw .vti-machine{height:520px}.vyrdict-index-claw .vti-reveal{height:544px}}
      @media(max-width:720px){
        .vyrdict-index-claw{padding:54px 0 62px!important}.vyrdict-index-claw .vti-wrap{width:min(100% - 24px,1240px)}.vyrdict-index-claw .vti-head{display:block}.vyrdict-index-claw .vti-sub{margin-top:13px}.vyrdict-index-claw .vti-stage{grid-template-columns:1fr;gap:12px}.vyrdict-index-claw .vti-machine-shell{border-radius:25px;padding:8px}.vyrdict-index-claw .vti-machine{height:430px;border-radius:18px}.vyrdict-index-claw .vti-products{inset:116px 3% 54px}.vyrdict-index-claw .vti-product{width:88px;height:102px}.vyrdict-index-claw .vti-reveal{height:430px;border-radius:25px}.vyrdict-index-claw .vti-hero-link{width:68%;height:62%;top:43%}.vyrdict-index-claw .vti-reveal-inner{padding:24px}.vyrdict-index-claw .vti-foot{display:block}.vyrdict-index-claw .vti-hint{margin-top:6px}}
      @media(prefers-reduced-motion:reduce){.vyrdict-index-claw *{transition-duration:.01ms!important;animation-duration:.01ms!important}}
    `;
    document.head.appendChild(s)
  }

  function findWeeklySection(){
    const hs=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=hs.find(el=>norm(el.textContent).includes('weekly viral rankings'))||hs.find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function catalog(){
    try{const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');return Array.isArray(c?.p)?c.p:[]}catch{return []}
  }

  function uniqueProducts(arr){
    const seen=new Set();
    return (arr||[]).filter(p=>{const k=String(p?.slug||p?.id||'');if(!k||seen.has(k)||!p?.image_url)return false;seen.add(k);return true})
  }

  function fallbackProducts(category){
    let arr=catalog().filter(p=>p?.image_url&&p?.slug);
    if(category!=='All')arr=arr.filter(p=>norm(p.category)===norm(category));
    return uniqueProducts(arr).sort((a,b)=>(Number(b.viral_score)||0)-(Number(a.viral_score)||0)||(Number(b.worth_score)||0)-(Number(a.worth_score)||0)).slice(0,9);
  }

  async function fetchProducts(category){
    let live=[];
    try{
      const url=category==='All'?WEEKLY_ENDPOINT:WEEKLY_ENDPOINT+'?category='+encodeURIComponent(category);
      const r=await fetch(url,{cache:'no-store'});
      if(r.ok){const d=await r.json();live=Array.isArray(d?.products)?d.products:Array.isArray(d)?d:[]}
    }catch{}
    live=uniqueProducts(live).filter(p=>p?.slug&&p?.image_url);
    if(category!=='All')live=live.filter(p=>!p?.category||norm(p.category)===norm(category));
    const merged=uniqueProducts([...live,...fallbackProducts(category)]);
    return merged.slice(0,9);
  }

  function goProduct(p){if(!p?.slug)return;location.assign('/product/'+encodeURIComponent(p.slug)+'/')}

  function build(section){
    section.className=(section.className||'')+' vyrdict-index-claw';
    section.id='trending-index';
    section.innerHTML=`
      <div class="vti-wrap">
        <div class="vti-head">
          <div><div class="vti-kicker">VYRDICT TRENDING INDEX</div><h2 class="vti-title">What the internet <i>wants now.</i></h2></div>
          <p class="vti-sub">The products making noise this week, picked one by one. Choose a category and watch the index move.</p>
        </div>
        <div class="vti-cats" role="tablist" aria-label="Trending Index categories"></div>
        <div class="vti-stage">
          <div class="vti-machine-shell">
            <div class="vti-machine">
              <div class="vti-machine-brand">VYRDICT</div>
              <div class="vti-rail"></div>
              <div class="vti-claw"><div class="vti-carriage"></div><div class="vti-wire"></div><div class="vti-grabber"><i class="vti-arm a"></i><i class="vti-arm b"></i></div></div>
              <div class="vti-products"></div><div class="vti-floor"></div>
              <div class="vti-machine-note">Weekly viral picks</div>
            </div>
          </div>
          <aside class="vti-reveal" aria-live="polite">
            <div class="vti-rank">01</div><div class="vti-picked">Picked from the index</div>
            <div class="vti-placeholder">Watch the claw choose what’s viral.</div>
            <a class="vti-hero-link" href="#" aria-label="Open selected product"><img alt=""></a>
            <div class="vti-reveal-inner"><div class="vti-copy"><span class="vti-brand"></span><span class="vti-name"></span><a class="vti-view" href="#">View product <span>↗</span></a></div></div>
          </aside>
        </div>
        <div class="vti-foot"><span class="vti-updated">UPDATED WEEKLY</span><span class="vti-hint">Tap any product to open its full VYRDICT page.</span></div>
      </div>`;
    root=section;
    const cats=section.querySelector('.vti-cats');
    CATEGORIES.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='vti-cat'+(c==='All'?' is-active':'');b.textContent=c;b.dataset.category=c;b.setAttribute('role','tab');b.setAttribute('aria-selected',c==='All'?'true':'false');b.addEventListener('click',()=>selectCategory(c));cats.appendChild(b)});
  }

  const POS=[
    [13,70,-7],[27,77,7],[40,67,-4],[54,78,5],[67,66,-6],[80,76,7],[20,54,4],[49,53,-5],[75,52,4]
  ];

  function renderPile(){
    if(!root)return;
    const box=root.querySelector('.vti-products');box.innerHTML='';
    if(!products.length){box.innerHTML='<div class="vti-empty">No verified weekly picks in this category yet.</div>';return}
    products.forEach((p,i)=>{
      const pos=POS[i%POS.length];const b=document.createElement('button');b.type='button';b.className='vti-product';b.style.setProperty('--x',pos[0]+'%');b.style.setProperty('--y',pos[1]+'%');b.style.setProperty('--r',pos[2]+'deg');b.dataset.i=i;b.title=[p.brand,p.name].filter(Boolean).join(' — ');const img=document.createElement('img');img.src=p.image_url;img.alt=[p.brand,p.name].filter(Boolean).join(' ');b.appendChild(img);b.addEventListener('click',()=>goProduct(p));box.appendChild(b)
    });
  }

  function clearReveal(){
    if(!root)return;
    root.querySelector('.vti-placeholder')?.classList.remove('is-off');
    root.querySelector('.vti-hero-link')?.classList.remove('is-on');
    root.querySelector('.vti-copy')?.classList.remove('is-on');
  }

  function reveal(p,index){
    if(!root||!p)return;
    const hero=root.querySelector('.vti-hero-link'),img=hero.querySelector('img'),copy=root.querySelector('.vti-copy'),brand=root.querySelector('.vti-brand'),name=root.querySelector('.vti-name'),view=root.querySelector('.vti-view'),rank=root.querySelector('.vti-rank');
    root.querySelector('.vti-placeholder')?.classList.add('is-off');hero.classList.remove('is-on');copy.classList.remove('is-on');
    setTimeout(()=>{img.src=p.image_url;img.alt=[p.brand,p.name].filter(Boolean).join(' ');brand.textContent=p.brand||p.category||'VYRDICT';name.textContent=p.name||'Trending product';rank.textContent=String(index+1).padStart(2,'0');hero.href='/product/'+encodeURIComponent(p.slug)+'/';view.href=hero.href;hero.onclick=e=>{e.preventDefault();goProduct(p)};view.onclick=e=>{e.preventDefault();goProduct(p)};requestAnimationFrame(()=>{hero.classList.add('is-on');copy.classList.add('is-on')})},120)
  }

  async function animate(localRun){
    const claw=root?.querySelector('.vti-claw'),grab=root?.querySelector('.vti-grabber');if(!claw||!grab||!products.length)return;
    while(localRun===runId&&root?.isConnected&&products.length){
      const i=cycleIndex%products.length,p=products[i],el=root.querySelector(`.vti-product[data-i="${i}"]`);if(!el){cycleIndex++;continue}
      root.querySelectorAll('.vti-product').forEach(x=>x.classList.remove('is-target','is-grabbed'));
      const x=parseFloat(getComputedStyle(el).getPropertyValue('--x'))||50;
      claw.style.left=x+'%';el.classList.add('is-target');
      await sleep(780);if(localRun!==runId)return;
      claw.style.setProperty('--drop','145px');await sleep(520);if(localRun!==runId)return;
      grab.classList.add('is-grab');await sleep(260);if(localRun!==runId)return;
      el.classList.add('is-grabbed');claw.style.setProperty('--drop','0px');await sleep(520);if(localRun!==runId)return;
      reveal(p,i);await sleep(2700);if(localRun!==runId)return;
      grab.classList.remove('is-grab');el.classList.remove('is-target','is-grabbed');await sleep(450);cycleIndex=(cycleIndex+1)%products.length
    }
  }

  async function selectCategory(category){
    if(!root)return;activeCategory=category;runId++;cycleIndex=0;const myRun=runId;
    root.querySelectorAll('.vti-cat').forEach(b=>{const on=b.dataset.category===category;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',on?'true':'false')});
    clearReveal();const box=root.querySelector('.vti-products');box.innerHTML='<div class="vti-empty">Loading this week’s picks…</div>';
    products=await fetchProducts(category);if(myRun!==runId)return;renderPile();if(products[0])reveal(products[0],0);setTimeout(()=>animate(myRun),500)
  }

  async function mount(){
    if(!isHome())return false;addStyle();const section=findWeeklySection();if(!section)return false;build(section);await selectCategory('All');return true
  }

  function boot(attempt=0){clearTimeout(bootTimer);bootTimer=setTimeout(async()=>{if(await mount())return;if(attempt<22)boot(attempt+1)},attempt?90:10)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>{runId++;root=null;if(isHome())boot()});
})();
