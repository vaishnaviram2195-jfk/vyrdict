(()=>{
  if(window.__vyrdictTrendingClawV4)return;
  window.__vyrdictTrendingClawV4=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let section=null,products=[],active='All',cycle=0,runId=0,observer=null;

  function catalog(){
    try{if(typeof S!=='undefined'&&Array.isArray(S.p))return S.p}catch{}
    try{if(Array.isArray(window.S?.p))return window.S.p}catch{}
    return [];
  }

  function weeklySection(){
    const existing=document.querySelector('.vyrdict-index-claw');
    if(existing)return existing;
    const hs=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=hs.find(x=>norm(x.textContent).includes('weekly viral rankings'))||hs.find(x=>norm(x.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function addStyle(){
    if(document.getElementById('vyrdict-trending-claw-v4-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-trending-claw-v4-style';
    s.textContent=`
      .vyrdict-index-claw{--ink:#171511;--paper:#fffaf6;--cream:#f4ede5;--rose:#d96b78;--rose2:#c98287;--blush:#e6cbc4;--metal:#b7aea8;position:relative;overflow:hidden;background:linear-gradient(180deg,#f8f1eb 0%,#eee0d8 100%)!important;padding:62px 0 72px!important;border:0!important}
      .vyrdict-index-claw:before{content:'';position:absolute;inset:-24% -8% auto;height:72%;background:radial-gradient(ellipse at 22% 18%,rgba(255,255,255,.78),transparent 48%),radial-gradient(ellipse at 82% 24%,rgba(225,188,186,.28),transparent 45%);pointer-events:none}
      .vyrdict-index-claw .vti-wrap{position:relative;z-index:1;width:min(1220px,calc(100% - 40px));margin:0 auto}
      .vyrdict-index-claw .vti-head{display:grid;grid-template-columns:1fr auto;align-items:end;gap:28px;margin-bottom:20px}
      .vyrdict-index-claw .vti-kicker{margin:0 0 9px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#826f66}
      .vyrdict-index-claw .vti-title{margin:0;font:400 clamp(44px,5.25vw,72px)/.92 Georgia,'Times New Roman',serif;letter-spacing:-.055em;color:var(--ink)}
      .vyrdict-index-claw .vti-title i{font-weight:400}
      .vyrdict-index-claw .vti-sub{max-width:405px;margin:0 0 7px;font:500 14px/1.55 Arial,Helvetica,sans-serif;color:#6e625c;text-align:right}
      .vyrdict-index-claw .vti-cats{display:flex;gap:8px;overflow-x:auto;padding:2px 1px 15px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      .vyrdict-index-claw .vti-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-claw .vti-cat{flex:0 0 auto;appearance:none;border:1px solid rgba(23,21,17,.13);background:rgba(255,250,246,.78);color:#675d57;border-radius:999px;padding:11px 15px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.065em;text-transform:uppercase;cursor:pointer;transition:.18s ease}
      .vyrdict-index-claw .vti-cat:hover{border-color:rgba(23,21,17,.35);color:var(--ink);transform:translateY(-1px)}
      .vyrdict-index-claw .vti-cat.is-active{background:var(--ink);border-color:var(--ink);color:#fff}

      .vyrdict-index-claw .vti-grid{display:grid;grid-template-columns:minmax(0,1.03fr) minmax(0,.97fr);gap:22px;align-items:stretch}
      .vyrdict-index-claw .vti-machine-card,.vyrdict-index-claw .vti-reveal-card{min-width:0;height:548px;border-radius:31px;overflow:hidden;box-shadow:0 25px 68px rgba(72,50,40,.12)}

      /* FULL VYRDICT VENDING / CLAW MACHINE */
      .vyrdict-index-claw .vti-machine-card{position:relative;padding:12px;box-sizing:border-box;background:linear-gradient(140deg,#eee9e5 0%,#aaa09a 17%,#f5f0ec 41%,#968c86 65%,#e7e0db 100%)}
      .vyrdict-index-claw .vti-vendor{position:relative;width:100%;height:100%;overflow:hidden;border-radius:22px;background:linear-gradient(180deg,#dfbeb5 0 17%,#f6e8df 17% 77%,#d8b5aa 77% 100%);border:1px solid rgba(255,255,255,.76);box-shadow:inset 0 0 0 1px rgba(43,33,29,.045),inset 0 -65px 80px rgba(95,63,49,.1)}
      .vyrdict-index-claw .vti-vendor:after{content:'';position:absolute;inset:0;background:linear-gradient(110deg,rgba(255,255,255,.33) 0 8%,transparent 9% 75%,rgba(255,255,255,.14) 76% 82%,transparent 83%);pointer-events:none;z-index:50}
      .vyrdict-index-claw .vti-marquee{position:absolute;left:0;right:0;top:0;height:88px;display:grid;grid-template-columns:1fr auto;align-items:center;padding:0 24px;box-sizing:border-box;background:linear-gradient(180deg,#ead2ca,#dcbdb4);border-bottom:1px solid rgba(67,47,39,.14);z-index:32;box-shadow:0 8px 18px rgba(68,46,36,.08)}
      .vyrdict-index-claw .vti-marquee-brand{font:400 40px/1 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#342823}
      .vyrdict-index-claw .vti-marquee-brand:after{content:'';display:inline-block;width:7px;height:7px;background:var(--rose);margin-left:4px}
      .vyrdict-index-claw .vti-marquee-copy{text-align:right;font:900 7px/1.5 Arial,Helvetica,sans-serif;letter-spacing:.17em;text-transform:uppercase;color:#8e5d5c}

      .vyrdict-index-claw .vti-glass{position:absolute;left:17px;right:17px;top:102px;bottom:119px;overflow:hidden;border-radius:15px;background:linear-gradient(180deg,rgba(255,255,255,.62),rgba(251,241,234,.58) 64%,rgba(217,188,174,.62));border:2px solid rgba(255,255,255,.78);box-shadow:inset 0 0 0 1px rgba(72,54,46,.07),inset 0 -44px 55px rgba(113,75,58,.08),0 9px 22px rgba(78,51,39,.08);z-index:8}
      .vyrdict-index-claw .vti-glass:before{content:'';position:absolute;inset:0;background:linear-gradient(112deg,rgba(255,255,255,.52) 0 10%,transparent 11% 72%,rgba(255,255,255,.21) 73% 79%,transparent 80%);pointer-events:none;z-index:40}
      .vyrdict-index-claw .vti-side-rail{position:absolute;top:0;bottom:0;width:12px;background:linear-gradient(90deg,#d6cfc9,#9b918b,#eee8e3);z-index:18;opacity:.78}
      .vyrdict-index-claw .vti-side-rail.l{left:0}.vyrdict-index-claw .vti-side-rail.r{right:0}
      .vyrdict-index-claw .vti-rail{position:absolute;left:8%;right:8%;top:15px;height:7px;border-radius:99px;background:linear-gradient(180deg,#eeeae7,#918782);box-shadow:0 3px 9px rgba(43,35,31,.12);z-index:18}
      .vyrdict-index-claw .vti-claw{--drop:0px;position:absolute;left:50%;top:10px;width:98px;height:245px;transform:translateX(-50%);transition:left .72s cubic-bezier(.22,.8,.22,1);z-index:24;pointer-events:none}
      .vyrdict-index-claw .vti-carriage{position:absolute;top:0;left:50%;width:48px;height:25px;transform:translateX(-50%);border-radius:7px;background:linear-gradient(135deg,#f0ece9,#948a84 56%,#e9e3df);border:1px solid rgba(50,43,39,.12);box-shadow:0 4px 9px rgba(46,37,32,.12)}
      .vyrdict-index-claw .vti-wire{position:absolute;top:22px;left:50%;width:2px;height:calc(74px + var(--drop));transform:translateX(-50%);background:linear-gradient(#827b76,#ddd7d2);transition:height .46s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber{position:absolute;top:calc(91px + var(--drop));left:50%;width:67px;height:58px;transform:translateX(-50%);transition:top .46s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber:before{content:'';position:absolute;left:50%;top:0;width:28px;height:20px;transform:translateX(-50%);border-radius:0 0 12px 12px;background:linear-gradient(145deg,#e4ded9,#918781)}
      .vyrdict-index-claw .vti-arm{position:absolute;top:13px;width:25px;height:41px;border:4px solid #9f9690;border-top:0;border-radius:0 0 24px 24px;transition:transform .2s ease;transform-origin:top center}
      .vyrdict-index-claw .vti-arm.a{left:4px;transform:rotate(22deg)}.vyrdict-index-claw .vti-arm.b{right:4px;transform:rotate(-22deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .a{transform:rotate(-2deg)}.vyrdict-index-claw .vti-grabber.is-grab .b{transform:rotate(2deg)}

      .vyrdict-index-claw .vti-products{position:absolute;inset:93px 5% 31px;z-index:10}
      .vyrdict-index-claw .vti-product{--x:50%;--y:70%;--r:0deg;position:absolute;left:var(--x);top:var(--y);width:clamp(76px,7.8vw,112px);height:clamp(94px,9.4vw,137px);padding:0;border:0;background:transparent;transform:translate(-50%,-50%) rotate(var(--r));transition:transform .3s ease,opacity .26s ease,filter .26s ease;cursor:pointer;filter:drop-shadow(0 9px 10px rgba(54,41,34,.16));z-index:11}
      .vyrdict-index-claw .vti-product img{width:100%;height:100%;display:block;object-fit:contain;object-position:center;pointer-events:none}
      .vyrdict-index-claw .vti-product:hover{transform:translate(-50%,-50%) rotate(var(--r)) scale(1.05);z-index:16}
      .vyrdict-index-claw .vti-product.is-target{z-index:19;filter:drop-shadow(0 16px 17px rgba(52,37,30,.24))}
      .vyrdict-index-claw .vti-product.is-grabbed{opacity:.11;transform:translate(-50%,-74%) rotate(0deg) scale(.88)}
      .vyrdict-index-claw .vti-ball-bed{position:absolute;left:-2%;right:-2%;bottom:-15px;height:100px;z-index:5;background:radial-gradient(circle at 4% 63%,#f2d8d2 0 25px,transparent 26px),radial-gradient(circle at 14% 46%,#fff0e8 0 24px,transparent 25px),radial-gradient(circle at 24% 68%,#e8c6bf 0 27px,transparent 28px),radial-gradient(circle at 36% 43%,#f8e6df 0 26px,transparent 27px),radial-gradient(circle at 47% 68%,#e3beb7 0 28px,transparent 29px),radial-gradient(circle at 59% 45%,#f8eae4 0 25px,transparent 26px),radial-gradient(circle at 70% 68%,#e8c5be 0 27px,transparent 28px),radial-gradient(circle at 82% 45%,#fff0e9 0 25px,transparent 26px),radial-gradient(circle at 94% 66%,#e5c1ba 0 28px,transparent 29px)}

      .vyrdict-index-claw .vti-console{position:absolute;left:17px;right:17px;bottom:15px;height:91px;border-radius:16px;background:linear-gradient(180deg,#e4c8bf,#d2aaa0);border:1px solid rgba(79,56,46,.15);box-shadow:inset 0 1px 0 rgba(255,255,255,.48);display:grid;grid-template-columns:84px 1fr 93px;align-items:center;gap:10px;padding:10px 13px;box-sizing:border-box;z-index:34}
      .vyrdict-index-claw .vti-control-cluster{display:flex;align-items:center;gap:12px}
      .vyrdict-index-claw .vti-stick{position:relative;width:34px;height:48px}
      .vyrdict-index-claw .vti-stick:before{content:'';position:absolute;width:6px;height:29px;left:14px;bottom:3px;border-radius:99px;background:linear-gradient(90deg,#847a75,#e0d8d3,#8d837d)}
      .vyrdict-index-claw .vti-stick:after{content:'';position:absolute;width:25px;height:25px;left:4px;top:0;border-radius:50%;background:linear-gradient(145deg,#e9bbb6,#bd6d75);box-shadow:inset 0 2px 2px rgba(255,255,255,.45),0 5px 8px rgba(86,52,49,.16)}
      .vyrdict-index-claw .vti-button{width:24px;height:24px;border-radius:50%;background:linear-gradient(145deg,#f5d4ce,#c88287);box-shadow:inset 0 2px 2px rgba(255,255,255,.48),0 3px 6px rgba(86,52,49,.13)}
      .vyrdict-index-claw .vti-console-copy{text-align:center}
      .vyrdict-index-claw .vti-console-copy b{display:block;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#744f4f;margin-bottom:6px}
      .vyrdict-index-claw .vti-console-copy span{display:block;font:500 8px/1.35 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:rgba(63,43,38,.55)}
      .vyrdict-index-claw .vti-chute{height:50px;border-radius:10px;background:linear-gradient(180deg,#8e7770,#594943 58%,#7d6760);border:3px solid rgba(245,224,216,.65);box-shadow:inset 0 9px 12px rgba(38,27,24,.3);display:grid;place-items:center;color:#ead9d2;font:900 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase}

      /* RIGHT-SIDE PRODUCT REVEAL */
      .vyrdict-index-claw .vti-reveal-card{position:relative;background:linear-gradient(145deg,#fffaf6 0%,#f7ece6 56%,#ead9d1 100%);border:1px solid rgba(255,255,255,.72)}
      .vyrdict-index-claw .vti-reveal-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 76% 18%,rgba(255,255,255,.82),transparent 33%),linear-gradient(118deg,transparent 0 67%,rgba(255,255,255,.16) 68% 75%,transparent 76%);pointer-events:none}
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

      @media(max-width:900px){.vyrdict-index-claw .vti-grid{grid-template-columns:1fr .92fr;gap:16px}.vyrdict-index-claw .vti-machine-card,.vyrdict-index-claw .vti-reveal-card{height:520px}.vyrdict-index-claw .vti-marquee-brand{font-size:34px}.vyrdict-index-claw .vti-console{grid-template-columns:72px 1fr 82px}}
      @media(max-width:720px){
        .vyrdict-index-claw{padding:50px 0 58px!important}
        .vyrdict-index-claw .vti-wrap{width:min(100% - 28px,620px)}
        .vyrdict-index-claw .vti-head{grid-template-columns:1fr;gap:10px;margin-bottom:16px}
        .vyrdict-index-claw .vti-sub{text-align:left;margin:0;max-width:500px}
        .vyrdict-index-claw .vti-title{font-size:52px}
        .vyrdict-index-claw .vti-grid{grid-template-columns:1fr;gap:14px}
        .vyrdict-index-claw .vti-machine-card{height:505px;border-radius:26px}
        .vyrdict-index-claw .vti-reveal-card{height:440px;border-radius:26px}
        .vyrdict-index-claw .vti-product{width:88px;height:112px}
        .vyrdict-index-claw .vti-foot{align-items:flex-start;flex-direction:column;gap:6px}.vyrdict-index-claw .vti-hint{text-align:left}
      }
      @media(max-width:420px){.vyrdict-index-claw .vti-title{font-size:45px}.vyrdict-index-claw .vti-machine-card{height:475px}.vyrdict-index-claw .vti-marquee{height:78px;padding:0 18px}.vyrdict-index-claw .vti-marquee-brand{font-size:29px}.vyrdict-index-claw .vti-marquee-copy{font-size:6px}.vyrdict-index-claw .vti-glass{top:91px;bottom:112px}.vyrdict-index-claw .vti-console{height:84px;grid-template-columns:65px 1fr 72px;padding:8px 10px}.vyrdict-index-claw .vti-reveal-card{height:405px}}
      @media(prefers-reduced-motion:reduce){.vyrdict-index-claw *{scroll-behavior:auto!important;transition-duration:.01ms!important;animation-duration:.01ms!important}}
    `;
    document.head.appendChild(s);
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
    if(category==='All')list=[...all].sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    else if(!list.length)list=all.filter(p=>norm(p.category)===norm(category)).sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    const seen=new Set();
    return list.filter(p=>p&&p.slug&&p.image_url&&!seen.has(p.slug)&&(seen.add(p.slug),true)).slice(0,7);
  }

  function layoutProducts(list){
    const pos=[[16,73,-8],[32,62,7],[48,73,-4],[64,60,6],[82,72,9],[40,46,-7],[70,45,5]];
    return list.map((p,i)=>{const [x,y,r]=pos[i%pos.length];return `<button class="vti-product" type="button" data-i="${i}" aria-label="Open ${esc((p.brand?p.brand+' ':'')+p.name)}" style="--x:${x}%;--y:${y}%;--r:${r}deg"><img src="${esc(p.image_url)}" alt="${esc((p.brand?p.brand+' ':'')+p.name)}" loading="eager"></button>`}).join('');
  }

  function template(){
    return `<div class="vti-wrap">
      <div class="vti-head">
        <div><p class="vti-kicker">VYRDICT · LIVE DISCOVERY</p><h2 class="vti-title">Trending <i>Index</i></h2></div>
        <p class="vti-sub">What’s going viral right now. Pick a category and watch the VYRDICT machine pull what’s making noise.</p>
      </div>
      <div class="vti-cats" role="tablist" aria-label="Trending Index categories">${CATEGORIES.map(c=>`<button class="vti-cat${c==='All'?' is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="vti-grid">
        <div class="vti-machine-card">
          <div class="vti-vendor">
            <div class="vti-marquee"><span class="vti-marquee-brand">VYRDICT</span><span class="vti-marquee-copy">TREND MACHINE<br>THE INTERNET, CURATED</span></div>
            <div class="vti-glass">
              <span class="vti-side-rail l"></span><span class="vti-side-rail r"></span>
              <div class="vti-rail"></div>
              <div class="vti-claw"><div class="vti-carriage"></div><div class="vti-wire"></div><div class="vti-grabber"><i class="vti-arm a"></i><i class="vti-arm b"></i></div></div>
              <div class="vti-products"></div>
              <div class="vti-ball-bed"></div>
            </div>
            <div class="vti-console">
              <div class="vti-control-cluster"><span class="vti-stick"></span><span class="vti-button"></span></div>
              <div class="vti-console-copy"><b>NOW PICKING</b><span>viral things we can’t ignore</span></div>
              <div class="vti-chute">PICK UP</div>
            </div>
          </div>
        </div>
        <div class="vti-reveal-card">
          <div class="vti-panel-top"><span class="vti-now">Trending now</span><span class="vti-panel-cat">All</span></div>
          <div class="vti-placeholder">The machine is choosing what’s next.</div>
          <a class="vti-reveal-link" href="#" aria-label="Open trending product"><img alt=""></a>
          <div class="vti-panel-copy"><span class="vti-brand"></span><span class="vti-name"></span><a class="vti-open" href="#">Open product <span>→</span></a></div>
        </div>
      </div>
      <div class="vti-foot"><span class="vti-updated">LIVE PRODUCT INDEX · REFRESHES WITH VYRDICT DATA</span><span class="vti-hint">Click a product to see its full Viral Score, Worth Score and verdict.</span></div>
    </div>`;
  }

  function href(p){return '/product/'+encodeURIComponent(p.slug)+'/'}

  function bind(){
    section.querySelectorAll('.vti-cat').forEach(btn=>btn.addEventListener('click',async()=>{
      const cat=btn.dataset.cat||'All';if(cat===active)return;active=cat;
      section.querySelectorAll('.vti-cat').forEach(x=>x.classList.toggle('is-active',x===btn));
      section.querySelector('.vti-panel-cat').textContent=cat;
      await load(cat);
    }));
    section.addEventListener('click',e=>{
      const pbtn=e.target.closest('.vti-product');if(!pbtn)return;
      const p=products[Number(pbtn.dataset.i)];if(p)location.assign(href(p));
    });
  }

  async function load(cat){
    const id=++runId;cycle=0;products=await getProducts(cat);
    if(id!==runId||!section?.isConnected)return;
    const holder=section.querySelector('.vti-products');holder.innerHTML=layoutProducts(products);
    section.querySelector('.vti-placeholder')?.classList.toggle('is-off',products.length>0);
    section.querySelector('.vti-reveal-link')?.classList.remove('is-on');
    section.querySelector('.vti-panel-copy')?.classList.remove('is-on');
    if(products.length)animateLoop(id);
  }

  async function showProduct(p,index,id){
    if(id!==runId||!section?.isConnected)return;
    const els=[...section.querySelectorAll('.vti-product')],target=els[index];if(!target)return;
    els.forEach(x=>x.classList.remove('is-target','is-grabbed'));target.classList.add('is-target');
    const glass=section.querySelector('.vti-glass'),claw=section.querySelector('.vti-claw'),grabber=section.querySelector('.vti-grabber');
    const gb=glass.getBoundingClientRect(),tb=target.getBoundingClientRect();
    const center=((tb.left+tb.width/2)-gb.left)/gb.width*100;
    claw.style.left=Math.max(12,Math.min(88,center))+'%';claw.style.setProperty('--drop','0px');grabber.classList.remove('is-grab');
    await sleep(640);if(id!==runId)return;
    claw.style.setProperty('--drop','92px');await sleep(470);if(id!==runId)return;
    grabber.classList.add('is-grab');await sleep(220);if(id!==runId)return;
    target.classList.add('is-grabbed');claw.style.setProperty('--drop','0px');await sleep(510);if(id!==runId)return;

    const link=section.querySelector('.vti-reveal-link'),img=link.querySelector('img'),copy=section.querySelector('.vti-panel-copy');
    link.classList.remove('is-on');copy.classList.remove('is-on');await sleep(110);if(id!==runId)return;
    img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+p.name;link.href=href(p);section.querySelector('.vti-open').href=href(p);
    section.querySelector('.vti-brand').textContent=p.brand||p.category||'';section.querySelector('.vti-name').textContent=p.name||'';
    link.classList.add('is-on');copy.classList.add('is-on');await sleep(2650);if(id!==runId)return;
    target.classList.remove('is-grabbed','is-target');grabber.classList.remove('is-grab');
  }

  async function animateLoop(id){
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      const p=products[0];if(p){const link=section.querySelector('.vti-reveal-link'),img=link.querySelector('img'),copy=section.querySelector('.vti-panel-copy');img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+p.name;link.href=href(p);section.querySelector('.vti-open').href=href(p);section.querySelector('.vti-brand').textContent=p.brand||'';section.querySelector('.vti-name').textContent=p.name||'';link.classList.add('is-on');copy.classList.add('is-on')}return;
    }
    while(id===runId&&section?.isConnected&&products.length){const i=cycle%products.length;cycle++;await showProduct(products[i],i,id);await sleep(330)}
  }

  function mount(){
    if(!isHome())return false;
    const old=weeklySection();if(!old)return false;
    addStyle();old.className='section vyrdict-index-claw';old.id='trending-index';old.innerHTML=template();section=old;bind();load('All');return true;
  }

  function boot(attempt=0){if(mount())return;if(attempt<32)setTimeout(()=>boot(attempt+1),100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  observer=new MutationObserver(()=>{if(isHome()&&!document.querySelector('.vyrdict-index-claw'))boot()});
  const target=document.getElementById('app')||document.body;if(target)observer.observe(target,{childList:true,subtree:false});
  addEventListener('popstate',()=>setTimeout(()=>boot(),40));
})();