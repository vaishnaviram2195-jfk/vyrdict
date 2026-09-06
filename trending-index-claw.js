(()=>{
  if(window.__vyrdictTrendingClawV5)return;
  window.__vyrdictTrendingClawV5=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let section=null,products=[],active='All',runId=0,cycle=0,observer=null;

  function addStyle(){
    if(document.getElementById('vyrdict-trending-claw-v5-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-trending-claw-v5-style';
    s.textContent=`
      .vyrdict-index-claw{--ink:#171511;--paper:#fffaf5;--cream:#f4ede5;--beige:#ead8cd;--blush:#d8aaa7;--rose:#d46f7a;--chrome:#9c938e;position:relative;overflow:hidden;background:linear-gradient(180deg,#f7f0eb 0%,#eee1d9 100%)!important;padding:64px 0 72px!important;border:0!important}
      .vyrdict-index-claw:before{content:'';position:absolute;inset:-25% -10% auto;height:72%;background:radial-gradient(ellipse at 24% 18%,rgba(255,255,255,.76),transparent 46%),radial-gradient(ellipse at 78% 20%,rgba(224,190,185,.25),transparent 44%);pointer-events:none}
      .vyrdict-index-claw .vti-wrap{position:relative;z-index:1;width:min(1210px,calc(100% - 40px));margin:0 auto}
      .vyrdict-index-claw .vti-head{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;margin-bottom:18px}
      .vyrdict-index-claw .vti-kicker{margin:0 0 9px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#7c6a61}
      .vyrdict-index-claw .vti-title{margin:0;font:400 clamp(44px,5vw,70px)/.93 Georgia,'Times New Roman',serif;letter-spacing:-.055em;color:var(--ink)}
      .vyrdict-index-claw .vti-sub{max-width:400px;margin:0 0 6px;font:500 14px/1.5 Arial,Helvetica,sans-serif;color:#6f625c;text-align:right}
      .vyrdict-index-claw .vti-cats{display:flex;gap:8px;overflow-x:auto;padding:2px 1px 15px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
      .vyrdict-index-claw .vti-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-claw .vti-cat{flex:0 0 auto;appearance:none;border:1px solid rgba(23,21,17,.13);background:rgba(255,250,245,.78);color:#675d57;border-radius:999px;padding:11px 15px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.065em;text-transform:uppercase;cursor:pointer;transition:.18s ease}
      .vyrdict-index-claw .vti-cat:hover{border-color:rgba(23,21,17,.34);color:var(--ink)}
      .vyrdict-index-claw .vti-cat.is-active{background:var(--ink);border-color:var(--ink);color:#fff}

      .vyrdict-index-claw .vti-grid{display:grid;grid-template-columns:minmax(350px,.86fr) minmax(0,1.14fr);gap:24px;align-items:stretch}
      .vyrdict-index-claw .vti-machine-stage{height:540px;display:grid;place-items:center;border-radius:30px;background:linear-gradient(145deg,rgba(255,250,245,.55),rgba(231,211,200,.55));box-shadow:0 24px 65px rgba(73,50,40,.10);overflow:hidden}
      .vyrdict-index-claw .vti-arcade{position:relative;width:min(86%,410px);height:500px;filter:drop-shadow(0 18px 26px rgba(67,46,37,.16))}
      .vyrdict-index-claw .vti-arcade-frame{position:absolute;inset:0;border-radius:18px 18px 13px 13px;background:linear-gradient(180deg,#dcc0b7 0%,#d3ada9 9%,#d9b9b2 58%,#c99794 100%);border:1px solid rgba(78,55,47,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.68),inset 0 -10px 24px rgba(84,54,45,.09)}
      .vyrdict-index-claw .vti-marquee{position:absolute;left:10px;right:10px;top:10px;height:63px;border-radius:9px 9px 4px 4px;background:linear-gradient(180deg,#ead9cf,#d9b8b0);border:1px solid rgba(84,59,49,.11);display:flex;align-items:center;justify-content:center;z-index:20;box-shadow:inset 0 0 20px rgba(255,255,255,.38)}
      .vyrdict-index-claw .vti-marquee span{font:400 30px/1 Georgia,'Times New Roman',serif;letter-spacing:.025em;color:#47332e}
      .vyrdict-index-claw .vti-marquee span:after{content:'';display:inline-block;width:6px;height:6px;background:var(--rose);margin-left:4px;margin-bottom:2px}
      .vyrdict-index-claw .vti-glass{position:absolute;left:16px;right:16px;top:77px;height:296px;overflow:hidden;background:linear-gradient(180deg,rgba(255,255,255,.55),rgba(248,241,236,.46));border:3px solid rgba(189,151,141,.84);border-top-width:2px;z-index:3;box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),inset 0 -46px 64px rgba(156,116,98,.09)}
      .vyrdict-index-claw .vti-glass:before,.vyrdict-index-claw .vti-glass:after{content:'';position:absolute;top:0;bottom:0;width:10px;background:linear-gradient(90deg,rgba(255,255,255,.28),rgba(255,255,255,.04));z-index:28;pointer-events:none}
      .vyrdict-index-claw .vti-glass:before{left:10px}.vyrdict-index-claw .vti-glass:after{right:10px;transform:scaleX(-1)}
      .vyrdict-index-claw .vti-glass-shine{position:absolute;inset:0;background:linear-gradient(114deg,rgba(255,255,255,.32) 0 9%,transparent 10% 74%,rgba(255,255,255,.16) 75% 80%,transparent 81%);z-index:30;pointer-events:none}
      .vyrdict-index-claw .vti-rail{position:absolute;left:9%;right:9%;top:24px;height:5px;border-radius:99px;background:linear-gradient(180deg,#ece8e5,#8f8883);box-shadow:0 2px 6px rgba(43,35,31,.12);z-index:13}
      .vyrdict-index-claw .vti-claw{--drop:0px;position:absolute;left:50%;top:20px;width:82px;height:190px;transform:translateX(-50%);transition:left .68s cubic-bezier(.22,.8,.22,1);z-index:22;pointer-events:none}
      .vyrdict-index-claw .vti-carriage{position:absolute;top:0;left:50%;width:40px;height:20px;transform:translateX(-50%);border-radius:5px;background:linear-gradient(135deg,#f0ece9,#928b86 56%,#e9e4e0);border:1px solid rgba(50,43,39,.13);box-shadow:0 3px 7px rgba(46,37,32,.12)}
      .vyrdict-index-claw .vti-wire{position:absolute;top:18px;left:50%;width:2px;height:calc(52px + var(--drop));transform:translateX(-50%);background:linear-gradient(#817b77,#d7d2cf);transition:height .42s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber{position:absolute;top:calc(67px + var(--drop));left:50%;width:58px;height:49px;transform:translateX(-50%);transition:top .42s cubic-bezier(.2,.8,.2,1)}
      .vyrdict-index-claw .vti-grabber:before{content:'';position:absolute;left:50%;top:0;width:25px;height:17px;transform:translateX(-50%);border-radius:0 0 10px 10px;background:linear-gradient(145deg,#e4ded9,#8e8782)}
      .vyrdict-index-claw .vti-arm{position:absolute;top:11px;width:21px;height:35px;border:3px solid #99928d;border-top:0;border-radius:0 0 21px 21px;transition:transform .2s ease;transform-origin:top center}
      .vyrdict-index-claw .vti-arm.a{left:4px;transform:rotate(23deg)}.vyrdict-index-claw .vti-arm.b{right:4px;transform:rotate(-23deg)}
      .vyrdict-index-claw .vti-grabber.is-grab .a{transform:rotate(-2deg)}.vyrdict-index-claw .vti-grabber.is-grab .b{transform:rotate(2deg)}
      .vyrdict-index-claw .vti-balls{position:absolute;left:-4%;right:-4%;bottom:-18px;height:88px;z-index:2;background:
        radial-gradient(circle at 6% 54%,#f0e4dc 0 13px,transparent 14px),radial-gradient(circle at 15% 65%,#e8d9d0 0 15px,transparent 16px),radial-gradient(circle at 25% 52%,#f4e8e0 0 14px,transparent 15px),radial-gradient(circle at 35% 66%,#e5d3ca 0 15px,transparent 16px),radial-gradient(circle at 45% 51%,#f4e9e2 0 15px,transparent 16px),radial-gradient(circle at 56% 66%,#eadbd2 0 14px,transparent 15px),radial-gradient(circle at 67% 52%,#f2e6df 0 16px,transparent 17px),radial-gradient(circle at 78% 66%,#e5d2c8 0 14px,transparent 15px),radial-gradient(circle at 90% 53%,#f1e5dd 0 15px,transparent 16px),linear-gradient(#d6b7a9,#c8a28f)}
      .vyrdict-index-claw .vti-products{position:absolute;inset:105px 7% 42px;z-index:7}
      .vyrdict-index-claw .vti-product{--x:50%;--y:70%;position:absolute;left:var(--x);top:var(--y);width:clamp(58px,6vw,86px);height:clamp(84px,8vw,112px);padding:0;border:0;background:transparent;transform:translate(-50%,-50%);transition:transform .28s ease,opacity .24s ease,filter .24s ease;cursor:pointer;filter:drop-shadow(0 8px 8px rgba(54,41,34,.14));z-index:8}
      .vyrdict-index-claw .vti-product img{width:100%;height:100%;display:block;object-fit:contain;object-position:center;pointer-events:none}
      .vyrdict-index-claw .vti-product:hover{transform:translate(-50%,-50%) scale(1.06);z-index:14}
      .vyrdict-index-claw .vti-product.is-target{z-index:16;filter:drop-shadow(0 14px 14px rgba(52,37,30,.22))}
      .vyrdict-index-claw .vti-product.is-grabbed{opacity:.12;transform:translate(-50%,-78%) scale(.9)}
      .vyrdict-index-claw .vti-lower{position:absolute;left:16px;right:16px;top:382px;height:100px;z-index:12;background:linear-gradient(180deg,#dcb9b0,#cd9d9a);border:1px solid rgba(82,55,47,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.35)}
      .vyrdict-index-claw .vti-control-panel{position:absolute;left:17px;top:18px;width:47%;height:65px;border-radius:10px;background:rgba(237,216,207,.92);border:1px solid rgba(89,62,52,.13);display:flex;align-items:center;padding:0 13px;box-sizing:border-box;gap:14px}
      .vyrdict-index-claw .vti-joystick{position:relative;width:30px;height:30px;border-radius:50%;background:#b9d3d0;box-shadow:inset 0 2px 2px rgba(255,255,255,.45),0 2px 5px rgba(59,47,42,.12)}
      .vyrdict-index-claw .vti-joystick:before{content:'';position:absolute;left:50%;bottom:19px;width:4px;height:16px;transform:translateX(-50%);background:#8a817d;border-radius:3px}
      .vyrdict-index-claw .vti-joystick:after{content:'';position:absolute;left:50%;bottom:31px;width:15px;height:15px;transform:translateX(-50%);background:#8dbfbd;border-radius:50%;box-shadow:inset 0 1px 2px rgba(255,255,255,.5)}
      .vyrdict-index-claw .vti-buttons{display:flex;gap:7px;margin-left:auto}
      .vyrdict-index-claw .vti-buttons i{display:block;width:13px;height:13px;border-radius:50%;background:#d990a1;box-shadow:inset 0 1px 2px rgba(255,255,255,.5)}
      .vyrdict-index-claw .vti-buttons i:nth-child(2){background:#b8cfd0}.vyrdict-index-claw .vti-buttons i:nth-child(3){background:#caa9b3}
      .vyrdict-index-claw .vti-chute{position:absolute;right:17px;top:16px;width:35%;height:69px;border-radius:7px;background:linear-gradient(180deg,#b88882,#9a6864);border:6px solid #e2c0b8;box-sizing:border-box;box-shadow:inset 0 8px 15px rgba(54,34,29,.23)}
      .vyrdict-index-claw .vti-chute:after{content:'PRIZE';position:absolute;left:0;right:0;bottom:5px;text-align:center;font:900 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;color:rgba(255,255,255,.6)}
      .vyrdict-index-claw .vti-base{position:absolute;left:8px;right:8px;bottom:0;height:14px;background:#c88f8d;border-radius:0 0 10px 10px;box-shadow:inset 0 1px 0 rgba(255,255,255,.25)}

      .vyrdict-index-claw .vti-reveal-card{position:relative;height:540px;border-radius:30px;overflow:hidden;background:linear-gradient(145deg,#fffaf6 0%,#f7ece6 56%,#ead9d1 100%);border:1px solid rgba(255,255,255,.75);box-shadow:0 24px 65px rgba(73,50,40,.11)}
      .vyrdict-index-claw .vti-reveal-card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 76% 18%,rgba(255,255,255,.82),transparent 33%),linear-gradient(118deg,transparent 0 67%,rgba(255,255,255,.17) 68% 75%,transparent 76%);pointer-events:none}
      .vyrdict-index-claw .vti-panel-top{position:absolute;left:28px;right:28px;top:25px;display:flex;align-items:center;justify-content:space-between;z-index:5}
      .vyrdict-index-claw .vti-now,.vyrdict-index-claw .vti-panel-cat{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a15f64}
      .vyrdict-index-claw .vti-reveal-link{position:absolute;inset:62px 30px 126px;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.88);transition:opacity .32s ease,transform .5s cubic-bezier(.18,.85,.2,1);z-index:3;cursor:pointer}
      .vyrdict-index-claw .vti-reveal-link.is-on{opacity:1;transform:scale(1)}
      .vyrdict-index-claw .vti-reveal-link img{display:block;width:86%;height:86%;object-fit:contain;filter:drop-shadow(0 26px 28px rgba(67,43,33,.18))}
      .vyrdict-index-claw .vti-panel-copy{position:absolute;left:30px;right:30px;bottom:27px;z-index:5;opacity:0;transform:translateY(8px);transition:opacity .28s ease .08s,transform .35s ease .08s}
      .vyrdict-index-claw .vti-panel-copy.is-on{opacity:1;transform:translateY(0)}
      .vyrdict-index-claw .vti-brand{display:block;margin-bottom:7px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#8f7770}
      .vyrdict-index-claw .vti-name{display:block;max-width:92%;font:400 clamp(29px,3vw,42px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#201916}
      .vyrdict-index-claw .vti-open{display:inline-flex;align-items:center;gap:8px;margin-top:12px;color:#201916;text-decoration:none;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid rgba(32,25,22,.55);padding-bottom:3px}
      .vyrdict-index-claw .vti-placeholder{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:70%;text-align:center;font:italic 26px/1.1 Georgia,'Times New Roman',serif;color:#8a746c;z-index:2}
      .vyrdict-index-claw .vti-placeholder.is-off{opacity:0}
      .vyrdict-index-claw .vti-foot{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:14px;color:#776b64}
      .vyrdict-index-claw .vti-updated{font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase}
      .vyrdict-index-claw .vti-hint{font:500 12px/1.4 Arial,Helvetica,sans-serif;text-align:right}

      @media(max-width:900px){.vyrdict-index-claw .vti-grid{grid-template-columns:minmax(300px,.82fr) minmax(0,1.18fr);gap:16px}.vyrdict-index-claw .vti-arcade{width:92%}}
      @media(max-width:720px){
        .vyrdict-index-claw{padding:52px 0 60px!important}.vyrdict-index-claw .vti-wrap{width:min(100% - 24px,680px)}.vyrdict-index-claw .vti-head{grid-template-columns:1fr;gap:9px}.vyrdict-index-claw .vti-sub{text-align:left;margin:0}.vyrdict-index-claw .vti-grid{grid-template-columns:1fr;gap:14px}.vyrdict-index-claw .vti-machine-stage{height:520px}.vyrdict-index-claw .vti-reveal-card{height:500px}.vyrdict-index-claw .vti-arcade{width:min(82%,390px);height:480px}.vyrdict-index-claw .vti-glass{height:278px}.vyrdict-index-claw .vti-lower{top:364px}.vyrdict-index-claw .vti-foot{align-items:flex-start;flex-direction:column}.vyrdict-index-claw .vti-hint{text-align:left}
      }
    `;
    document.head.appendChild(s);
  }

  function weeklySection(){
    return document.getElementById('viral')||[...document.querySelectorAll('section,.section')].find(el=>/what.?s trending now|weekly viral rankings|viral rankings/i.test(el.textContent||''))||null;
  }

  function catalog(){
    try{if(typeof S!=='undefined'&&Array.isArray(S.p)&&S.p.length)return S.p}catch{}
    for(const key of ['vyrdict:catalog-cache:v5','vyrdict:catalog-cache:v4']){
      try{const c=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(c?.p))return c.p}catch{}
    }
    return [];
  }

  function unwrapWeekly(x){
    if(!x)return null;
    const p=x.product||x.products||x.item||x;
    if(!p||typeof p!=='object')return null;
    return {...p,rank:x.rank??x.weekly_rank??p.rank};
  }

  async function getProducts(category){
    let list=[];
    try{
      const r=await fetch(WEEKLY_ENDPOINT,{cache:'no-store'});
      if(r.ok){
        const d=await r.json();
        const arr=Array.isArray(d)?d:Array.isArray(d?.rankings)?d.rankings:Array.isArray(d?.data)?d.data:[];
        list=arr.map(unwrapWeekly).filter(Boolean);
        if(category!=='All')list=list.filter(p=>norm(p.category)===norm(category));
      }
    }catch{}
    const all=catalog().filter(p=>p&&p.slug&&p.image_url);
    if(category==='All'&&!list.length){
      list=[...all].sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    }else if(category!=='All'&&!list.length){
      list=all.filter(p=>norm(p.category)===norm(category)).sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    }
    const seen=new Set();
    return list.filter(p=>p&&p.slug&&p.image_url&&!seen.has(p.slug)&&(seen.add(p.slug),true)).slice(0,5);
  }

  function layoutProducts(list){
    const pos=[[18,69],[37,67],[56,69],[74,66],[86,69]];
    return list.map((p,i)=>{const [x,y]=pos[i%pos.length];return `<button class="vti-product" type="button" data-i="${i}" aria-label="Open ${esc((p.brand?p.brand+' ':'')+p.name)}" style="--x:${x}%;--y:${y}%"><img src="${esc(p.image_url)}" alt="${esc((p.brand?p.brand+' ':'')+p.name)}" loading="eager"></button>`}).join('');
  }

  function template(){
    return `<div class="vti-wrap">
      <div class="vti-head">
        <div><p class="vti-kicker">VYRDICT · LIVE DISCOVERY</p><h2 class="vti-title">Trending Index</h2></div>
        <p class="vti-sub">What’s going viral right now. Pick a category and watch the machine choose what’s next.</p>
      </div>
      <div class="vti-cats" role="tablist" aria-label="Trending Index categories">${CATEGORIES.map(c=>`<button class="vti-cat${c==='All'?' is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="vti-grid">
        <div class="vti-machine-stage">
          <div class="vti-arcade">
            <div class="vti-arcade-frame"></div>
            <div class="vti-marquee"><span>VYRDICT</span></div>
            <div class="vti-glass">
              <div class="vti-rail"></div>
              <div class="vti-claw"><div class="vti-carriage"></div><div class="vti-wire"></div><div class="vti-grabber"><i class="vti-arm a"></i><i class="vti-arm b"></i></div></div>
              <div class="vti-products"></div>
              <div class="vti-balls"></div>
              <div class="vti-glass-shine"></div>
            </div>
            <div class="vti-lower"><div class="vti-control-panel"><span class="vti-joystick"></span><span class="vti-buttons"><i></i><i></i><i></i></span></div><div class="vti-chute"></div></div>
            <div class="vti-base"></div>
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

  const href=p=>'/product/'+encodeURIComponent(p.slug)+'/';

  function bind(){
    section.querySelectorAll('.vti-cat').forEach(btn=>btn.addEventListener('click',async()=>{
      const cat=btn.dataset.cat||'All';if(cat===active)return;active=cat;
      section.querySelectorAll('.vti-cat').forEach(x=>x.classList.toggle('is-active',x===btn));
      section.querySelector('.vti-panel-cat').textContent=cat;
      await load(cat);
    }));
    section.addEventListener('click',e=>{const b=e.target.closest('.vti-product');if(!b)return;const p=products[Number(b.dataset.i)];if(p)location.assign(href(p))});
  }

  async function load(cat){
    const id=++runId;cycle=0;products=await getProducts(cat);if(id!==runId||!section?.isConnected)return;
    section.querySelector('.vti-products').innerHTML=layoutProducts(products);
    section.querySelector('.vti-placeholder')?.classList.toggle('is-off',products.length>0);
    section.querySelector('.vti-reveal-link')?.classList.remove('is-on');section.querySelector('.vti-panel-copy')?.classList.remove('is-on');
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
    await sleep(600);if(id!==runId)return;
    claw.style.setProperty('--drop','98px');await sleep(440);if(id!==runId)return;
    grabber.classList.add('is-grab');await sleep(210);if(id!==runId)return;
    target.classList.add('is-grabbed');claw.style.setProperty('--drop','0px');await sleep(470);if(id!==runId)return;

    const link=section.querySelector('.vti-reveal-link'),img=link.querySelector('img'),copy=section.querySelector('.vti-panel-copy');
    link.classList.remove('is-on');copy.classList.remove('is-on');await sleep(110);if(id!==runId)return;
    img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+p.name;link.href=href(p);section.querySelector('.vti-open').href=href(p);
    section.querySelector('.vti-brand').textContent=p.brand||p.category||'';section.querySelector('.vti-name').textContent=p.name||'';
    link.classList.add('is-on');copy.classList.add('is-on');
    await sleep(2600);if(id!==runId)return;
    target.classList.remove('is-grabbed','is-target');grabber.classList.remove('is-grab');
  }

  async function animateLoop(id){
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){const p=products[0];if(p){const l=section.querySelector('.vti-reveal-link'),i=l.querySelector('img'),c=section.querySelector('.vti-panel-copy');i.src=p.image_url;l.href=href(p);section.querySelector('.vti-open').href=href(p);section.querySelector('.vti-brand').textContent=p.brand||'';section.querySelector('.vti-name').textContent=p.name||'';l.classList.add('is-on');c.classList.add('is-on')}return}
    while(id===runId&&section?.isConnected&&products.length){const i=cycle%products.length;cycle++;await showProduct(products[i],i,id);await sleep(320)}
  }

  function mount(){
    if(!isHome())return false;const old=weeklySection();if(!old)return false;if(old.classList.contains('vyrdict-index-claw')){section=old;return true}
    addStyle();old.className='section vyrdict-index-claw';old.id='trending-index';old.innerHTML=template();section=old;bind();load('All');return true;
  }

  function boot(attempt=0){if(mount())return;if(attempt<30)setTimeout(()=>boot(attempt+1),100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  observer=new MutationObserver(()=>{if(isHome()&&!document.querySelector('.vyrdict-index-claw'))boot()});const target=document.getElementById('app')||document.body;if(target)observer.observe(target,{childList:true,subtree:false});
  addEventListener('popstate',()=>setTimeout(()=>boot(),40));
})();