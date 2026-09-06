(()=>{
  if(window.__vyrdictTrendingClawV8)return;
  window.__vyrdictTrendingClawV8=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let section=null,products=[],active='All',runId=0,cycle=0,observer=null;

  function addStyle(){
    if(document.getElementById('vyrdict-trending-claw-v8-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-trending-claw-v8-style';
    s.textContent=`
      .vyrdict-index-claw{--ink:#171511;--cream:#f4ede5;--paper:#fffaf5;--machine:#d9b7ae;--machine2:#c99996;--machine3:#eedbd3;--teal:#9fc8c6;--rose:#d98a9d;--soft-blush:#f3e9e6;position:relative;overflow:hidden;background:var(--soft-blush)!important;padding:60px 0 68px!important;border:0!important}
      .vyrdict-index-claw .vti-wrap{width:min(1200px,calc(100% - 40px));margin:0 auto;position:relative;z-index:1}
      .vyrdict-index-claw .vti-head{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:end;margin-bottom:18px}
      .vyrdict-index-claw .vti-kicker{margin:0 0 9px;font:900 10px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#78675f}
      .vyrdict-index-claw .vti-title{margin:0;font:400 clamp(42px,5vw,68px)/.94 Georgia,'Times New Roman',serif;letter-spacing:-.055em;color:var(--ink)}
      .vyrdict-index-claw .vti-sub{max-width:400px;margin:0 0 6px;font:500 14px/1.5 Arial,sans-serif;color:#6d615b;text-align:right}
      .vyrdict-index-claw .vti-cats{display:flex;gap:8px;overflow-x:auto;padding:2px 1px 15px;scrollbar-width:none}
      .vyrdict-index-claw .vti-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-claw .vti-cat{flex:0 0 auto;border:1px solid rgba(23,21,17,.13);background:rgba(255,250,245,.78);color:#675d57;border-radius:999px;padding:11px 15px;font:900 9px/1 Arial,sans-serif;letter-spacing:.065em;text-transform:uppercase;cursor:pointer}
      .vyrdict-index-claw .vti-cat.is-active{background:var(--ink);border-color:var(--ink);color:#fff}

      .vyrdict-index-claw .vti-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:22px;align-items:stretch}
      .vyrdict-index-claw .vti-machine-stage,.vyrdict-index-claw .vti-reveal-card{height:540px;border-radius:28px;overflow:hidden;box-shadow:0 24px 60px rgba(71,49,40,.10)}
      .vyrdict-index-claw .vti-machine-stage{display:grid;place-items:center;background:var(--soft-blush);position:relative}

      .vyrdict-index-claw .vti-machine{position:relative;width:335px;height:500px;filter:drop-shadow(0 18px 18px rgba(69,47,39,.17));transform:translateY(1px)}
      .vyrdict-index-claw .vti-body{position:absolute;inset:0;background:linear-gradient(180deg,#dfbeb5 0%,#d7aaa7 66%,#ca9895 100%);clip-path:polygon(7% 0,93% 0,96% 5%,96% 94%,91% 100%,9% 100%,4% 94%,4% 5%);box-shadow:inset 0 1px 0 rgba(255,255,255,.62)}
      .vyrdict-index-claw .vti-topcap{position:absolute;left:17px;right:17px;top:12px;height:50px;background:linear-gradient(180deg,#efdcd3,#dcb8ae);border:1px solid rgba(91,63,52,.12);z-index:15;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 13px rgba(255,255,255,.34)}
      .vyrdict-index-claw .vti-topcap:before,.vyrdict-index-claw .vti-topcap:after{content:'';position:absolute;bottom:-10px;width:8px;height:10px;background:#c79290}.vyrdict-index-claw .vti-topcap:before{left:0}.vyrdict-index-claw .vti-topcap:after{right:0}
      .vyrdict-index-claw .vti-topcap span{font:700 18px/1 Arial,sans-serif;letter-spacing:.13em;color:#604842}

      .vyrdict-index-claw .vti-window{position:absolute;left:28px;right:28px;top:63px;height:287px;background:rgba(255,250,245,.58);overflow:hidden;z-index:8;border-left:6px solid #d19f9b;border-right:6px solid #d19f9b;border-bottom:8px solid #d19f9b;box-shadow:inset 0 0 0 1px rgba(255,255,255,.66),inset 0 -28px 38px rgba(129,88,73,.06)}
      .vyrdict-index-claw .vti-window:before{content:'';position:absolute;left:0;right:0;top:0;height:7px;background:#d19f9b;z-index:12}
      .vyrdict-index-claw .vti-post{position:absolute;top:0;bottom:0;width:5px;background:linear-gradient(90deg,#e4c8bf,#bd8582);z-index:14}.vyrdict-index-claw .vti-post.p1{left:11px}.vyrdict-index-claw .vti-post.p2{right:11px}
      .vyrdict-index-claw .vti-glare{position:absolute;inset:0;background:linear-gradient(112deg,rgba(255,255,255,.3) 0 8%,transparent 9% 73%,rgba(255,255,255,.14) 74% 79%,transparent 80%);z-index:40;pointer-events:none}

      .vyrdict-index-claw .vti-track{position:absolute;left:20px;right:20px;top:13px;height:3px;background:#a79791;z-index:18}
      .vyrdict-index-claw .vti-claw{--drop:0px;position:absolute;left:50%;top:11px;width:66px;height:150px;transform:translateX(-50%);transition:left .65s cubic-bezier(.22,.8,.22,1);z-index:25;pointer-events:none}
      .vyrdict-index-claw .vti-slider{position:absolute;top:0;left:50%;width:26px;height:14px;transform:translateX(-50%);border-radius:3px;background:linear-gradient(180deg,#d7d2ce,#8f8884);box-shadow:0 2px 4px rgba(30,25,23,.16)}
      .vyrdict-index-claw .vti-cable{position:absolute;left:50%;top:12px;width:2px;height:calc(54px + var(--drop));transform:translateX(-50%);background:#8e8782;transition:height .42s ease}
      .vyrdict-index-claw .vti-grabber{position:absolute;left:50%;top:calc(63px + var(--drop));width:54px;height:46px;transform:translateX(-50%);transition:top .42s ease}
      .vyrdict-index-claw .vti-grabber:before{content:'';position:absolute;left:50%;top:0;width:22px;height:15px;transform:translateX(-50%);border-radius:0 0 8px 8px;background:#918a86}
      .vyrdict-index-claw .vti-arm{position:absolute;top:9px;width:19px;height:34px;border:3px solid #8f8884;border-top:0;border-radius:0 0 19px 19px;transform-origin:top center;transition:transform .2s ease}.vyrdict-index-claw .vti-arm.a{left:3px;transform:rotate(23deg)}.vyrdict-index-claw .vti-arm.b{right:3px;transform:rotate(-23deg)}.vyrdict-index-claw .vti-grabber.is-grab .a{transform:rotate(-3deg)}.vyrdict-index-claw .vti-grabber.is-grab .b{transform:rotate(3deg)}

      .vyrdict-index-claw .vti-products{position:absolute;left:12px;right:12px;bottom:41px;height:124px;z-index:9}
      .vyrdict-index-claw .vti-product{--x:50%;position:absolute;left:var(--x);bottom:9px;width:52px;height:100px;padding:0;border:0;background:transparent;transform:translateX(-50%);transition:transform .27s ease,opacity .24s ease,filter .24s ease;cursor:pointer;filter:drop-shadow(0 6px 6px rgba(54,41,34,.13));z-index:10}
      .vyrdict-index-claw .vti-product img{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none}
      .vyrdict-index-claw .vti-product.is-target{z-index:16;filter:drop-shadow(0 12px 12px rgba(52,37,30,.22))}
      .vyrdict-index-claw .vti-product.is-grabbed{opacity:.12;transform:translate(-50%,-74px) scale(.92)}
      .vyrdict-index-claw .vti-pebbles{position:absolute;left:-3px;right:-3px;bottom:-3px;height:47px;z-index:5;background:radial-gradient(circle at 5% 45%,#f4eee8 0 8px,transparent 9px),radial-gradient(circle at 14% 67%,#eee5de 0 9px,transparent 10px),radial-gradient(circle at 24% 42%,#f8f2ec 0 9px,transparent 10px),radial-gradient(circle at 35% 66%,#e9ddd5 0 9px,transparent 10px),radial-gradient(circle at 47% 43%,#f6eee8 0 9px,transparent 10px),radial-gradient(circle at 58% 66%,#eadfd8 0 9px,transparent 10px),radial-gradient(circle at 69% 41%,#f7f0ea 0 10px,transparent 11px),radial-gradient(circle at 81% 66%,#eaded7 0 9px,transparent 10px),radial-gradient(circle at 93% 44%,#f5eee7 0 9px,transparent 10px),linear-gradient(#dbc2b6,#cda696)}

      .vyrdict-index-claw .vti-console{position:absolute;left:24px;right:24px;top:356px;height:103px;background:linear-gradient(180deg,#d9aaa5,#ca9290);border:1px solid rgba(83,56,48,.11);z-index:12}
      .vyrdict-index-claw .vti-console-left{position:absolute;left:12px;top:11px;width:53%;height:76px;background:linear-gradient(180deg,#e9cfc6,#ddb9b1);border:1px solid rgba(90,62,52,.12);border-radius:4px;box-shadow:inset 0 1px 0 rgba(255,255,255,.35)}
      .vyrdict-index-claw .vti-stick{position:absolute;left:22px;bottom:15px;width:25px;height:25px;border-radius:50%;background:#c4ddda;box-shadow:inset 0 1px 2px rgba(255,255,255,.55)}
      .vyrdict-index-claw .vti-stick:before{content:'';position:absolute;left:50%;bottom:18px;width:4px;height:18px;transform:translateX(-50%);background:#8b8380;border-radius:2px}.vyrdict-index-claw .vti-stick:after{content:'';position:absolute;left:50%;bottom:31px;width:13px;height:13px;transform:translateX(-50%);background:#8dc7c5;border-radius:50%}
      .vyrdict-index-claw .vti-console-buttons{position:absolute;left:70px;bottom:20px;display:flex;gap:8px}.vyrdict-index-claw .vti-console-buttons i{width:12px;height:12px;border-radius:50%;background:#98c4c4;box-shadow:inset 0 1px 2px rgba(255,255,255,.55)}.vyrdict-index-claw .vti-console-buttons i:first-child{background:#d990a1}.vyrdict-index-claw .vti-console-buttons i:last-child{background:#b5a4bc}
      .vyrdict-index-claw .vti-prize-slot{position:absolute;right:10px;top:9px;width:37%;height:80px;background:linear-gradient(180deg,#d4aaa0,#bd827e);border:7px solid #e6c9c0;box-sizing:border-box;box-shadow:inset 0 10px 14px rgba(57,36,31,.23);border-radius:2px}
      .vyrdict-index-claw .vti-prize-slot:after{content:'';position:absolute;left:10px;right:10px;top:11px;height:7px;background:rgba(77,49,43,.28);border-radius:7px}
      .vyrdict-index-claw .vti-footbar{position:absolute;left:15px;right:15px;bottom:15px;height:14px;background:#bd8382;z-index:9;border-radius:0 0 6px 6px}

      .vyrdict-index-claw .vti-reveal-card{position:relative;background:var(--soft-blush);border:1px solid rgba(255,255,255,.72)}
      .vyrdict-index-claw .vti-panel-top{position:absolute;left:28px;right:28px;top:25px;display:flex;justify-content:space-between;z-index:4}.vyrdict-index-claw .vti-now,.vyrdict-index-claw .vti-panel-cat{font:900 8px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a05f64}
      .vyrdict-index-claw .vti-reveal-link{position:absolute;inset:60px 25px 122px;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.88);transition:opacity .32s ease,transform .52s cubic-bezier(.18,.85,.2,1);z-index:2}.vyrdict-index-claw .vti-reveal-link.is-on{opacity:1;transform:scale(1)}.vyrdict-index-claw .vti-reveal-link img{width:82%;height:84%;object-fit:contain;filter:drop-shadow(0 25px 28px rgba(67,43,33,.18))}
      .vyrdict-index-claw .vti-panel-copy{position:absolute;left:30px;right:30px;bottom:27px;z-index:5;opacity:0;transform:translateY(8px);transition:.3s ease}.vyrdict-index-claw .vti-panel-copy.is-on{opacity:1;transform:none}.vyrdict-index-claw .vti-brand{display:block;margin-bottom:7px;font:900 8px/1 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#8f7770}.vyrdict-index-claw .vti-name{display:block;max-width:90%;font:400 clamp(28px,3vw,42px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#201916}.vyrdict-index-claw .vti-open{display:inline-flex;gap:8px;margin-top:12px;color:#201916;text-decoration:none;font:900 8px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;border-bottom:1px solid rgba(32,25,22,.55);padding-bottom:3px}
      .vyrdict-index-claw .vti-placeholder{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:70%;text-align:center;font:italic 26px/1.1 Georgia,'Times New Roman',serif;color:#8a746c}.vyrdict-index-claw .vti-placeholder.is-off{opacity:0}
      .vyrdict-index-claw .vti-foot{display:flex;justify-content:space-between;gap:18px;margin-top:14px;color:#776b64}.vyrdict-index-claw .vti-updated{font:900 8px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase}.vyrdict-index-claw .vti-hint{font:500 12px/1.4 Arial,sans-serif;text-align:right}
      @media(max-width:760px){.vyrdict-index-claw{padding:50px 0 58px!important}.vyrdict-index-claw .vti-wrap{width:min(100% - 24px,680px)}.vyrdict-index-claw .vti-head{grid-template-columns:1fr;gap:8px}.vyrdict-index-claw .vti-sub{text-align:left}.vyrdict-index-claw .vti-grid{grid-template-columns:1fr;gap:14px}.vyrdict-index-claw .vti-machine-stage{height:525px}.vyrdict-index-claw .vti-reveal-card{height:500px}.vyrdict-index-claw .vti-machine{width:min(335px,88vw)}.vyrdict-index-claw .vti-foot{flex-direction:column}.vyrdict-index-claw .vti-hint{text-align:left}}
    `;
    document.head.appendChild(s);
  }

  function weeklySection(){return document.getElementById('viral')||[...document.querySelectorAll('section,.section')].find(el=>/what.?s trending now|weekly viral rankings|viral rankings/i.test(el.textContent||''))||null}
  function catalog(){try{if(typeof S!=='undefined'&&Array.isArray(S.p)&&S.p.length)return S.p}catch{}for(const key of ['vyrdict:catalog-cache:v5','vyrdict:catalog-cache:v4']){try{const c=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(c?.p))return c.p}catch{}}return []}
  function unwrapWeekly(x){if(!x)return null;const p=x.product||x.products||x.item||x;return p&&typeof p==='object'?{...p,rank:x.rank??x.weekly_rank??p.rank}:null}
  async function getProducts(category){
    let list=[];
    try{const r=await fetch(WEEKLY_ENDPOINT,{cache:'no-store'});if(r.ok){const d=await r.json();const arr=Array.isArray(d)?d:Array.isArray(d?.rankings)?d.rankings:Array.isArray(d?.data)?d.data:[];list=arr.map(unwrapWeekly).filter(Boolean);if(category!=='All')list=list.filter(p=>norm(p.category)===norm(category))}}catch{}
    const all=catalog().filter(p=>p&&p.slug&&p.image_url);
    if(!list.length)list=(category==='All'?all:all.filter(p=>norm(p.category)===norm(category))).sort((a,b)=>Number(b.momentum_score||b.viral_score||0)-Number(a.momentum_score||a.viral_score||0));
    const seen=new Set();return list.filter(p=>p&&p.slug&&p.image_url&&!seen.has(p.slug)&&(seen.add(p.slug),true)).slice(0,5);
  }
  function layoutProducts(list){const pos=[15,33,51,69,86];return list.map((p,i)=>`<button class="vti-product" type="button" data-i="${i}" aria-label="Open ${esc((p.brand?p.brand+' ':'')+p.name)}" style="--x:${pos[i%pos.length]}%"><img src="${esc(p.image_url)}" alt="${esc((p.brand?p.brand+' ':'')+p.name)}" loading="eager"></button>`).join('')}
  function template(){return `<div class="vti-wrap"><div class="vti-head"><div><p class="vti-kicker">VYRDICT · LIVE DISCOVERY</p><h2 class="vti-title">Trending Index</h2></div><p class="vti-sub">What’s going viral right now. Choose a category and watch the machine pick what’s next.</p></div><div class="vti-cats" role="tablist">${CATEGORIES.map(c=>`<button class="vti-cat${c==='All'?' is-active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="vti-grid"><div class="vti-machine-stage"><div class="vti-machine"><div class="vti-body"></div><div class="vti-topcap"><span>VYRDICT</span></div><div class="vti-window"><i class="vti-post p1"></i><i class="vti-post p2"></i><div class="vti-track"></div><div class="vti-claw"><div class="vti-slider"></div><div class="vti-cable"></div><div class="vti-grabber"><i class="vti-arm a"></i><i class="vti-arm b"></i></div></div><div class="vti-products"></div><div class="vti-pebbles"></div><div class="vti-glare"></div></div><div class="vti-console"><div class="vti-console-left"><span class="vti-stick"></span><span class="vti-console-buttons"><i></i><i></i><i></i></span></div><div class="vti-prize-slot"></div></div><div class="vti-footbar"></div></div></div><div class="vti-reveal-card"><div class="vti-panel-top"><span class="vti-now">Trending now</span><span class="vti-panel-cat">All</span></div><div class="vti-placeholder">The claw is choosing what’s next.</div><a class="vti-reveal-link" href="#" aria-label="Open trending product"><img alt=""></a><div class="vti-panel-copy"><span class="vti-brand"></span><span class="vti-name"></span><a class="vti-open" href="#">Open product <span>→</span></a></div></div></div><div class="vti-foot"><span class="vti-updated">LIVE PRODUCT INDEX · REFRESHES WITH VYRDICT DATA</span><span class="vti-hint">Click the product to see the full Viral Score, Worth Score and verdict.</span></div></div>`}
  const href=p=>'/product/'+encodeURIComponent(p.slug)+'/';
  function bind(){section.querySelectorAll('.vti-cat').forEach(btn=>btn.addEventListener('click',async()=>{const cat=btn.dataset.cat||'All';if(cat===active)return;active=cat;section.querySelectorAll('.vti-cat').forEach(x=>x.classList.toggle('is-active',x===btn));section.querySelector('.vti-panel-cat').textContent=cat;await load(cat)}));section.addEventListener('click',e=>{const b=e.target.closest('.vti-product');if(!b)return;const p=products[Number(b.dataset.i)];if(p)location.assign(href(p))})}
  async function load(cat){const id=++runId;cycle=0;products=await getProducts(cat);if(id!==runId||!section?.isConnected)return;section.querySelector('.vti-products').innerHTML=layoutProducts(products);section.querySelector('.vti-placeholder')?.classList.toggle('is-off',products.length>0);section.querySelector('.vti-reveal-link')?.classList.remove('is-on');section.querySelector('.vti-panel-copy')?.classList.remove('is-on');if(products.length)animateLoop(id)}
  async function showProduct(p,index,id){
    if(id!==runId||!section?.isConnected)return;
    const els=[...section.querySelectorAll('.vti-product')],target=els[index];if(!target)return;els.forEach(x=>x.classList.remove('is-target','is-grabbed'));target.classList.add('is-target');
    const win=section.querySelector('.vti-window'),claw=section.querySelector('.vti-claw'),grabber=section.querySelector('.vti-grabber'),wb=win.getBoundingClientRect(),tb=target.getBoundingClientRect();const center=((tb.left+tb.width/2)-wb.left)/wb.width*100;
    claw.style.left=Math.max(11,Math.min(89,center))+'%';claw.style.setProperty('--drop','0px');grabber.classList.remove('is-grab');await sleep(600);if(id!==runId)return;
    claw.style.setProperty('--drop','104px');await sleep(440);if(id!==runId)return;grabber.classList.add('is-grab');await sleep(210);if(id!==runId)return;target.classList.add('is-grabbed');claw.style.setProperty('--drop','0px');await sleep(470);if(id!==runId)return;
    const link=section.querySelector('.vti-reveal-link'),img=link.querySelector('img'),copy=section.querySelector('.vti-panel-copy');link.classList.remove('is-on');copy.classList.remove('is-on');await sleep(110);if(id!==runId)return;img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+p.name;link.href=href(p);section.querySelector('.vti-open').href=href(p);section.querySelector('.vti-brand').textContent=p.brand||p.category||'';section.querySelector('.vti-name').textContent=p.name||'';link.classList.add('is-on');copy.classList.add('is-on');await sleep(2550);if(id!==runId)return;target.classList.remove('is-grabbed','is-target');grabber.classList.remove('is-grab')
  }
  async function animateLoop(id){if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){const p=products[0];if(p){const l=section.querySelector('.vti-reveal-link'),i=l.querySelector('img'),c=section.querySelector('.vti-panel-copy');i.src=p.image_url;l.href=href(p);section.querySelector('.vti-open').href=href(p);section.querySelector('.vti-brand').textContent=p.brand||'';section.querySelector('.vti-name').textContent=p.name||'';l.classList.add('is-on');c.classList.add('is-on')}return}while(id===runId&&section?.isConnected&&products.length){const i=cycle%products.length;cycle++;await showProduct(products[i],i,id);await sleep(320)}}
  function mount(){if(!isHome())return false;const old=weeklySection();if(!old)return false;if(old.classList.contains('vyrdict-index-claw')){section=old;return true}addStyle();old.className='section vyrdict-index-claw';old.id='trending-index';old.innerHTML=template();section=old;bind();load('All');return true}
  function boot(attempt=0){if(mount())return;if(attempt<30)setTimeout(()=>boot(attempt+1),100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();observer=new MutationObserver(()=>{if(isHome()&&!document.querySelector('.vyrdict-index-claw'))boot()});const target=document.getElementById('app')||document.body;if(target)observer.observe(target,{childList:true,subtree:false});addEventListener('popstate',()=>setTimeout(()=>boot(),40));
})();