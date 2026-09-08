(()=>{
  if(window.__vyrdictTrendingGalleryV3)return;
  window.__vyrdictTrendingGalleryV3=1;

  const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const STYLE_ID='vyrdict-trending-gallery-v3-style';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const esc=v=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  let section=null,products=[],weeklyCache=[],activeCategory='All',activeIndex=0,autoTimer=0,observer=null,dragX=null,animating=false,animationToken=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-index-gallery{--stone:#e6e0d7;--ink:#171511;position:relative;overflow:hidden;background:var(--stone)!important;padding:58px 0 34px!important;border:0!important;color:var(--ink)}
      .vyrdict-index-gallery .vtg-wrap{width:min(1240px,calc(100% - 36px));margin:0 auto}
      .vyrdict-index-gallery .vtg-head{text-align:center;margin:0 auto 18px;max-width:760px}
      .vyrdict-index-gallery .vtg-kicker{margin:0 0 8px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#776f67}
      .vyrdict-index-gallery .vtg-title{margin:0;font:400 clamp(38px,4.6vw,62px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.05em;color:var(--ink)}
      .vyrdict-index-gallery .vtg-sub{margin:10px auto 0;max-width:560px;font:500 13px/1.5 Arial,Helvetica,sans-serif;color:#6e6861}
      .vyrdict-index-gallery .vtg-cats{display:flex;align-items:center;gap:22px;overflow-x:auto;padding:8px 6px 15px;margin:0 auto 2px;scrollbar-width:none;overscroll-behavior-inline:contain}
      .vyrdict-index-gallery .vtg-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-gallery .vtg-cat{position:relative;flex:0 0 auto;border:0;background:transparent;padding:7px 0 9px;color:#756f68;font:800 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.045em;white-space:nowrap;cursor:pointer}
      .vyrdict-index-gallery .vtg-cat:after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:var(--ink);transform:scaleX(0);transform-origin:center;transition:transform .22s ease}
      .vyrdict-index-gallery .vtg-cat.is-active{color:var(--ink)}
      .vyrdict-index-gallery .vtg-cat.is-active:after{transform:scaleX(1)}

      .vyrdict-index-gallery .vtg-stage{position:relative;height:520px;max-width:1180px;margin:0 auto;touch-action:pan-y;perspective:1100px;transform-style:preserve-3d;transition:opacity .14s ease,transform .14s ease}
      .vyrdict-index-gallery .vtg-stage.is-switching{opacity:.35;transform:translateY(3px)}
      .vyrdict-index-gallery .vtg-frame{position:absolute;z-index:1;left:50%;top:15px;width:354px;height:472px;transform:translateX(-50%);border:1.5px dashed rgba(23,21,17,.62);border-radius:38px;background:rgba(255,255,255,.095);pointer-events:none;box-sizing:border-box}
      .vyrdict-index-gallery .vtg-frame-top{position:absolute;left:30px;right:30px;top:28px;display:flex;align-items:center;justify-content:space-between;gap:18px;font:800 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.04em;color:#3f3b37}
      .vyrdict-index-gallery .vtg-wordmark{display:inline-flex;align-items:flex-end;font-weight:950;letter-spacing:-.025em;font-size:11px}
      .vyrdict-index-gallery .vtg-wordmark:after{content:'';width:4px;height:4px;background:#df7187;margin:0 0 1px 2px}
      .vyrdict-index-gallery .vtg-frame-bottom{position:absolute;left:30px;right:30px;bottom:25px;border-top:1px solid rgba(23,21,17,.15);padding-top:17px;min-height:54px}
      .vyrdict-index-gallery .vtg-brand{margin:0 0 5px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#817970}
      .vyrdict-index-gallery .vtg-name{margin:0;max-width:245px;font:700 12px/1.28 Arial,Helvetica,sans-serif;color:#2c2926;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vyrdict-index-gallery .vtg-view{position:absolute;right:0;bottom:1px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#5c5650}

      .vyrdict-index-gallery .vtg-items{position:absolute;inset:0;z-index:2;overflow:visible;transform-style:preserve-3d}
      .vyrdict-index-gallery .vtg-item{--x:0px;--y:0px;--scale:1;--opacity:1;position:absolute;left:50%;top:50%;width:270px;height:330px;margin:-183px 0 0 -135px;border:0;padding:0;background:transparent!important;display:flex;align-items:center;justify-content:center;transform:translate3d(var(--x),var(--y),0) scale(var(--scale));opacity:var(--opacity);transition:transform .48s cubic-bezier(.2,.8,.18,1),opacity .3s ease,filter .3s ease;cursor:pointer;will-change:transform,opacity,filter;filter:drop-shadow(0 18px 18px rgba(70,53,43,.11));outline:0;transform-style:preserve-3d}
      .vyrdict-index-gallery .vtg-item img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;background:transparent!important;mix-blend-mode:multiply;image-rendering:auto;user-select:none;-webkit-user-drag:none;pointer-events:none;backface-visibility:hidden}
      .vyrdict-index-gallery .vtg-item[data-rel="0"]{z-index:6;filter:drop-shadow(0 28px 28px rgba(70,53,43,.17))}
      .vyrdict-index-gallery .vtg-item[data-rel="-1"],.vyrdict-index-gallery .vtg-item[data-rel="1"]{z-index:3}
      .vyrdict-index-gallery .vtg-item.is-hidden{pointer-events:none}
      .vyrdict-index-gallery .vtg-item:focus-visible{outline:1px solid rgba(23,21,17,.65);outline-offset:8px;border-radius:18px}
      .vyrdict-index-gallery .vtg-item.is-center:after{content:'VIEW VYRDICT';position:absolute;left:50%;bottom:-14px;transform:translateX(-50%) translateY(4px);padding:7px 10px;border-radius:999px;background:rgba(247,243,237,.84);color:#2f2b27;font:900 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.09em;opacity:0;transition:.18s ease;white-space:nowrap}
      .vyrdict-index-gallery .vtg-item.is-center:hover:after,.vyrdict-index-gallery .vtg-item.is-center:focus-visible:after{opacity:1;transform:translateX(-50%) translateY(0)}

      .vyrdict-index-gallery .vtg-arrow{position:absolute;z-index:20;top:50%;width:42px;height:42px;margin-top:-21px;border:1px solid rgba(23,21,17,.14);border-radius:50%;background:rgba(241,237,231,.68);backdrop-filter:blur(5px);display:grid;place-items:center;color:#2f2c28;font:400 19px/1 Arial,sans-serif;cursor:pointer;transition:background .18s ease,transform .18s ease}
      .vyrdict-index-gallery .vtg-arrow:hover{background:rgba(248,245,240,.94);transform:scale(1.04)}
      .vyrdict-index-gallery .vtg-prev{left:13px}.vyrdict-index-gallery .vtg-next{right:13px}
      .vyrdict-index-gallery .vtg-count{position:absolute;z-index:7;left:50%;bottom:5px;transform:translateX(-50%);font:800 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.13em;color:#716a63}
      .vyrdict-index-gallery .vtg-empty{height:420px;display:grid;place-items:center;text-align:center;color:#716a63;font:700 12px/1.5 Arial,sans-serif}

      @media(max-width:800px){
        .vyrdict-index-gallery{padding:46px 0 26px!important}
        .vyrdict-index-gallery .vtg-wrap{width:min(100% - 20px,680px)}
        .vyrdict-index-gallery .vtg-head{text-align:left;padding:0 5px;margin-bottom:12px}
        .vyrdict-index-gallery .vtg-title{font-size:clamp(36px,11vw,50px)}
        .vyrdict-index-gallery .vtg-sub{margin-left:0;font-size:12px}
        .vyrdict-index-gallery .vtg-cats{gap:18px;padding-left:6px;padding-right:6px;margin-bottom:4px}
        .vyrdict-index-gallery .vtg-stage{height:448px;perspective:900px}
        .vyrdict-index-gallery .vtg-frame{top:8px;width:min(72vw,310px);height:405px;border-radius:32px}
        .vyrdict-index-gallery .vtg-frame-top{left:23px;right:23px;top:22px}
        .vyrdict-index-gallery .vtg-frame-bottom{left:23px;right:23px;bottom:20px;padding-top:13px}
        .vyrdict-index-gallery .vtg-name{max-width:180px;font-size:11px}
        .vyrdict-index-gallery .vtg-item{width:220px;height:270px;margin:-153px 0 0 -110px;transition-duration:.42s}
        .vyrdict-index-gallery .vtg-arrow{width:38px;height:38px;margin-top:-19px;background:rgba(241,237,231,.8)}
        .vyrdict-index-gallery .vtg-prev{left:0}.vyrdict-index-gallery .vtg-next{right:0}
        .vyrdict-index-gallery .vtg-count{bottom:2px}
      }
      @media(max-width:430px){
        .vyrdict-index-gallery .vtg-frame{width:74vw;max-width:292px;height:398px}
        .vyrdict-index-gallery .vtg-stage{height:438px}
        .vyrdict-index-gallery .vtg-item{width:200px;height:250px;margin:-145px 0 0 -100px}
        .vyrdict-index-gallery .vtg-arrow{top:auto;bottom:7px}
        .vyrdict-index-gallery .vtg-prev{left:calc(50% - 68px)}.vyrdict-index-gallery .vtg-next{right:calc(50% - 68px)}
        .vyrdict-index-gallery .vtg-count{bottom:22px}
      }
      @media(prefers-reduced-motion:reduce){.vyrdict-index-gallery *{transition-duration:.01ms!important;animation-duration:.01ms!important}}
    `;
    document.head.appendChild(s);
  }

  function targetSection(){
    const existing=document.querySelector('.vyrdict-index-gallery');
    if(existing)return existing;
    return document.getElementById('viral')||document.getElementById('trending-index')||[...document.querySelectorAll('section,.section')].find(el=>/what.?s trending now|weekly viral rankings|viral rankings/i.test(el.textContent||''))||null;
  }

  function catalog(){
    try{if(typeof S!=='undefined'&&Array.isArray(S.p)&&S.p.length)return S.p}catch{}
    for(const key of ['vyrdict:catalog-cache:v5','vyrdict:catalog-cache:v4']){
      try{const c=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(c?.p)&&c.p.length)return c.p}catch{}
    }
    return [];
  }

  function unwrapWeekly(x){
    if(!x)return null;
    const p=x.product||x.products||x.item||x;
    return p&&typeof p==='object'?{...p,weekly_rank:x.rank??x.weekly_rank??p.weekly_rank,trend_score:x.trend_score??p.trend_score}:null;
  }

  async function weekly(){
    if(weeklyCache.length)return weeklyCache;
    try{
      const r=await fetch(WEEKLY_ENDPOINT,{cache:'no-store'});
      if(!r.ok)return [];
      const d=await r.json();
      const arr=Array.isArray(d)?d:Array.isArray(d?.rankings)?d.rankings:Array.isArray(d?.data)?d.data:[];
      weeklyCache=arr.map(unwrapWeekly).filter(Boolean);
      return weeklyCache;
    }catch{return []}
  }

  function mergeProducts(rows,cat){
    const base=catalog().filter(p=>p&&p.slug&&p.image_url);
    const ranked=(rows||[]).filter(p=>p&&p.slug&&p.image_url);
    const wanted=cat==='All'?null:norm(cat);
    const map=new Map();
    [...ranked,...base].forEach(p=>{if(wanted&&norm(p.category)!==wanted)return;if(!map.has(p.slug))map.set(p.slug,p)});
    const list=[...map.values()].sort((a,b)=>{
      const ar=Number(a.weekly_rank||9999),br=Number(b.weekly_rank||9999);
      if(ar!==br)return ar-br;
      return Number(b.trend_score||b.viral_score||0)-Number(a.trend_score||a.viral_score||0)||Number(b.worth_score||0)-Number(a.worth_score||0);
    });
    if(cat!=='All')return list.slice(0,10);
    const out=[],seenCats=new Set();
    for(const p of list){const c=norm(p.category);if(c&&!seenCats.has(c)){seenCats.add(c);out.push(p)}if(out.length>=10)break}
    if(out.length<8){for(const p of list){if(!out.some(x=>x.slug===p.slug))out.push(p);if(out.length>=10)break}}
    return out.slice(0,10);
  }

  function template(){
    return `<div class="vtg-wrap">
      <div class="vtg-head">
        <p class="vtg-kicker">VYRDICT LIVE</p>
        <h2 class="vtg-title">Trending Index</h2>
        <p class="vtg-sub">Move through what’s getting attention now. Tap the product in focus for the full VYRDICT.</p>
      </div>
      <div class="vtg-cats" role="tablist" aria-label="Trending product categories">${CATEGORIES.map(c=>`<button class="vtg-cat${c==='All'?' is-active':''}" type="button" role="tab" aria-selected="${c==='All'}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="vtg-stage" aria-live="polite">
        <div class="vtg-frame" aria-hidden="true">
          <div class="vtg-frame-top"><span class="vtg-wordmark">VYRDICT</span><span class="vtg-frame-cat">ALL</span></div>
          <div class="vtg-frame-bottom"><p class="vtg-brand">VYRDICT</p><p class="vtg-name">Loading what’s trending…</p><span class="vtg-view">View →</span></div>
        </div>
        <div class="vtg-items"></div>
        <button class="vtg-arrow vtg-prev" type="button" aria-label="Previous trending product">←</button>
        <button class="vtg-arrow vtg-next" type="button" aria-label="Next trending product">→</button>
        <div class="vtg-count" aria-hidden="true"></div>
      </div>
    </div>`;
  }

  function href(p){return '/product/'+encodeURIComponent(p.slug)+'/'}
  function relative(i,index,n){let d=i-index;if(n>2){if(d>n/2)d-=n;if(d<-n/2)d+=n}return d}
  function stepSize(){const w=section?.querySelector('.vtg-stage')?.clientWidth||1000;return Math.max(228,Math.min(345,w*.30))}

  function updateMeta(){
    if(!section||!products.length)return;
    const p=products[activeIndex];
    const brand=section.querySelector('.vtg-brand'),name=section.querySelector('.vtg-name'),cat=section.querySelector('.vtg-frame-cat'),count=section.querySelector('.vtg-count');
    if(brand)brand.textContent=p.brand||p.category||'VYRDICT';
    if(name)name.textContent=p.name||'';
    if(cat)cat.textContent=(p.category||activeCategory||'All').toUpperCase();
    if(count)count.textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(products.length).padStart(2,'0')}`;
  }

  function positionItems(){
    if(!section||!products.length)return;
    const step=stepSize(),items=[...section.querySelectorAll('.vtg-item')],n=products.length;
    items.forEach((el,i)=>{
      if(el.dataset.motion==='1')return;
      const rel=relative(i,activeIndex,n),abs=Math.abs(rel);
      el.dataset.rel=String(rel);
      el.classList.toggle('is-center',rel===0);
      el.classList.toggle('is-hidden',abs>2);
      let scale=1,opacity=1,y=0,x=rel*step;
      if(abs===1){scale=.64;opacity=.8;y=18}
      else if(abs===2){scale=.44;opacity=.28;y=40;x=rel*step*.92}
      else if(abs>2){scale=.34;opacity=0;y=48}
      el.style.setProperty('--x',`${x}px`);
      el.style.setProperty('--y',`${y}px`);
      el.style.setProperty('--scale',String(scale));
      el.style.setProperty('--opacity',String(opacity));
      el.tabIndex=abs<=1?0:-1;
    });
    updateMeta();
  }

  function clearAuto(){clearTimeout(autoTimer);autoTimer=0}
  function scheduleAuto(){
    clearAuto();
    if(products.length<2||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
    autoTimer=setTimeout(()=>{if(document.visibilityState==='visible')animateMove(1,false);else scheduleAuto()},2600);
  }

  function finishMotion(oldEl,newEl,token){
    if(token!==animationToken)return;
    oldEl?.removeAttribute('data-motion');newEl?.removeAttribute('data-motion');
    positionItems();animating=false;scheduleAuto();
  }

  function animateMove(delta,manual=false){
    if(animating||products.length<2)return;
    clearAuto();
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){activeIndex=(activeIndex+delta+products.length)%products.length;positionItems();scheduleAuto();return}
    animating=true;
    const token=++animationToken;
    const items=[...section.querySelectorAll('.vtg-item')],oldIndex=activeIndex,newIndex=(activeIndex+delta+products.length)%products.length;
    const oldEl=items[oldIndex],newEl=items[newIndex],step=stepSize(),dir=delta>0?1:-1;
    if(!oldEl||!newEl){activeIndex=newIndex;positionItems();animating=false;scheduleAuto();return}
    oldEl.dataset.motion='1';newEl.dataset.motion='1';
    activeIndex=newIndex;
    positionItems();
    updateMeta();

    const oldFrames=[
      {transform:'translate3d(0,0,0) scale(1) rotateY(0deg)',opacity:1,offset:0},
      {transform:'translate3d(0,-8px,72px) scale(1.28) rotateY(0deg)',opacity:1,offset:.20},
      {transform:`translate3d(${-dir*step*.30}px,-5px,48px) scale(1.10) rotateY(${dir*78}deg)`,opacity:.98,offset:.55},
      {transform:`translate3d(${-dir*step*.68}px,8px,12px) scale(.82) rotateY(${dir*32}deg)`,opacity:.90,offset:.80},
      {transform:`translate3d(${-dir*step}px,18px,0) scale(.64) rotateY(0deg)`,opacity:.8,offset:1}
    ];
    const newFrames=[
      {transform:`translate3d(${dir*step}px,18px,0) scale(.64) rotateY(0deg)`,opacity:.8,offset:0},
      {transform:`translate3d(${dir*step*.72}px,10px,10px) scale(.80) rotateY(${-dir*30}deg)`,opacity:.90,offset:.22},
      {transform:`translate3d(${dir*step*.30}px,-5px,48px) scale(1.08) rotateY(${-dir*78}deg)`,opacity:.98,offset:.55},
      {transform:'translate3d(0,-8px,72px) scale(1.28) rotateY(0deg)',opacity:1,offset:.82},
      {transform:'translate3d(0,0,0) scale(1) rotateY(0deg)',opacity:1,offset:1}
    ];
    const opts={duration:640,easing:'cubic-bezier(.22,.72,.18,1)',fill:'forwards'};
    const a=oldEl.animate(oldFrames,opts),b=newEl.animate(newFrames,opts);
    Promise.allSettled([a.finished,b.finished]).then(()=>finishMotion(oldEl,newEl,token));
  }

  function buildItems(){
    const box=section?.querySelector('.vtg-items');if(!box)return;
    box.replaceChildren();
    if(!products.length){box.innerHTML='<div class="vtg-empty">No current VYRDICT products are available in this category yet.</div>';section.querySelector('.vtg-count').textContent='';clearAuto();return}
    products.forEach((p,i)=>{
      const b=document.createElement('button');b.type='button';b.className='vtg-item';b.dataset.i=String(i);
      const img=document.createElement('img');img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+(p.name||'');img.loading=Math.abs(i-activeIndex)<=1?'eager':'lazy';img.decoding='async';
      b.appendChild(img);
      b.addEventListener('click',()=>{
        if(animating)return;
        const rel=relative(i,activeIndex,products.length);
        if(rel===0){if(typeof nav==='function')nav(href(p));else location.href=href(p);return}
        animateMove(rel>0?1:-1,true);
      });
      box.appendChild(b);
    });
    positionItems();scheduleAuto();
  }

  async function selectCategory(cat){
    animationToken++;animating=false;clearAuto();
    activeCategory=cat;activeIndex=0;
    section.querySelectorAll('.vtg-cat').forEach(b=>{const on=b.dataset.cat===cat;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));if(on)b.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})});
    const stage=section.querySelector('.vtg-stage');stage?.classList.add('is-switching');
    const rows=await weekly();products=mergeProducts(rows,cat);
    setTimeout(()=>{if(!section?.isConnected)return;buildItems();stage?.classList.remove('is-switching')},110);
  }

  function bind(){
    section.querySelectorAll('.vtg-cat').forEach(b=>b.addEventListener('click',()=>selectCategory(b.dataset.cat||'All')));
    section.querySelector('.vtg-prev')?.addEventListener('click',()=>animateMove(-1,true));
    section.querySelector('.vtg-next')?.addEventListener('click',()=>animateMove(1,true));
    const stage=section.querySelector('.vtg-stage');
    stage?.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen')dragX=e.clientX});
    stage?.addEventListener('pointerup',e=>{if(dragX==null)return;const dx=e.clientX-dragX;dragX=null;if(Math.abs(dx)>42)animateMove(dx<0?1:-1,true)});
    addEventListener('resize',()=>requestAnimationFrame(positionItems),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')scheduleAuto();else clearAuto()});
  }

  async function mount(){
    if(!isHome())return false;
    const old=targetSection();if(!old)return false;
    if(old.classList.contains('vyrdict-index-gallery')){section=old;return true}
    addStyle();old.className='section vyrdict-index-gallery';old.id='trending-index';old.innerHTML=template();section=old;bind();
    const rows=await weekly();products=mergeProducts(rows,'All');buildItems();return true;
  }

  function boot(attempt=0){Promise.resolve(mount()).then(ok=>{if(!ok&&attempt<35)setTimeout(()=>boot(attempt+1),100)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  observer=new MutationObserver(()=>{if(isHome()&&!document.querySelector('.vyrdict-index-gallery'))boot()});
  const target=document.getElementById('app')||document.body;if(target)observer.observe(target,{childList:true,subtree:false});
  addEventListener('popstate',()=>setTimeout(()=>boot(),50));
})();