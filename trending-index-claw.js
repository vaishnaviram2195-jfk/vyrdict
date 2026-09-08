(()=>{
  try{
    if(window.__vyrdictTrendingReferenceV4)return;
    window.__vyrdictTrendingReferenceV4=1;

    const WEEKLY_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
    const CATEGORIES=['All','Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
    const STYLE_ID='vyrdict-trending-reference-v4-style';
    const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
    const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    const isHome=()=>location.pathname==='/'||location.pathname==='';

    let section=null,products=[],weeklyRows=[],activeCategory='All',activeIndex=0;
    let autoTimer=0,finishTimer=0,animating=false,bootTimer=0;

    function addStyle(){
      if(document.getElementById(STYLE_ID))return;
      const s=document.createElement('style');
      s.id=STYLE_ID;
      s.textContent=`
      .vyrdict-index-gallery{--stone:#e5ded4;--ink:#171511;--muted:#746d66;position:relative;overflow:hidden;background:var(--stone)!important;color:var(--ink);padding:52px 0 26px!important;border:0!important}
      .vyrdict-index-gallery *{box-sizing:border-box}
      .vyrdict-index-gallery .vtg-wrap{width:min(1240px,calc(100% - 32px));margin:0 auto}
      .vyrdict-index-gallery .vtg-head{text-align:center;max-width:760px;margin:0 auto 14px}
      .vyrdict-index-gallery .vtg-kicker{margin:0 0 7px;font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#746d66}
      .vyrdict-index-gallery .vtg-title{margin:0;font:400 clamp(39px,4.7vw,63px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.05em;color:#171511}
      .vyrdict-index-gallery .vtg-sub{margin:9px auto 0;max-width:560px;font:500 13px/1.48 Arial,Helvetica,sans-serif;color:#69635d}
      .vyrdict-index-gallery .vtg-cats{display:flex;align-items:center;justify-content:flex-start;gap:21px;overflow-x:auto;padding:7px 6px 13px;margin:0 auto 0;scrollbar-width:none;overscroll-behavior-inline:contain}
      .vyrdict-index-gallery .vtg-cats::-webkit-scrollbar{display:none}
      .vyrdict-index-gallery .vtg-cat{position:relative;flex:0 0 auto;border:0;background:transparent!important;padding:7px 0 9px;color:#756f68;font:800 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.045em;white-space:nowrap;cursor:pointer}
      .vyrdict-index-gallery .vtg-cat:after{content:'';position:absolute;left:0;right:0;bottom:2px;height:1px;background:#171511;transform:scaleX(0);transform-origin:center;transition:transform .22s ease}
      .vyrdict-index-gallery .vtg-cat.is-active{color:#171511}
      .vyrdict-index-gallery .vtg-cat.is-active:after{transform:scaleX(1)}

      .vyrdict-index-gallery .vtg-stage{--step:320px;position:relative;height:505px;max-width:1180px;margin:0 auto;perspective:1150px;transform-style:preserve-3d;touch-action:pan-y;isolation:isolate}
      .vyrdict-index-gallery .vtg-focus{position:absolute;z-index:1;left:50%;top:14px;width:354px;height:455px;transform:translateX(-50%);border:1.5px dashed rgba(23,21,17,.58);border-radius:38px;background:rgba(255,255,255,.075);pointer-events:none}
      .vyrdict-index-gallery .vtg-focus-top{position:absolute;left:29px;right:29px;top:26px;display:flex;align-items:center;justify-content:space-between;gap:18px;font:800 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.05em;color:#49433e}
      .vyrdict-index-gallery .vtg-mark{display:inline-flex;align-items:flex-end;font-weight:950;font-size:11px;letter-spacing:-.02em}
      .vyrdict-index-gallery .vtg-mark:after{content:'';width:4px;height:4px;background:#df7187;margin:0 0 1px 2px}
      .vyrdict-index-gallery .vtg-focus-bottom{position:absolute;left:29px;right:29px;bottom:23px;border-top:1px solid rgba(23,21,17,.13);padding-top:15px;min-height:52px}
      .vyrdict-index-gallery .vtg-brand{margin:0 0 5px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#80786f}
      .vyrdict-index-gallery .vtg-name{margin:0;max-width:245px;font:700 12px/1.28 Arial,Helvetica,sans-serif;color:#2c2926;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vyrdict-index-gallery .vtg-view{position:absolute;right:0;bottom:1px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#5d5751}

      .vyrdict-index-gallery .vtg-items{position:absolute;inset:0;z-index:3;transform-style:preserve-3d;overflow:visible}
      .vyrdict-index-gallery .vtg-item{--x:0px;--y:0px;--s:1;--o:1;position:absolute;left:50%;top:50%;width:278px;height:332px;margin:-181px 0 0 -139px;border:0!important;padding:0!important;background:transparent!important;appearance:none;display:flex;align-items:center;justify-content:center;transform:translate3d(var(--x),var(--y),0) scale(var(--s));opacity:var(--o);transition:transform .48s cubic-bezier(.2,.82,.18,1),opacity .28s ease,filter .28s ease;cursor:pointer;will-change:transform,opacity;outline:0;filter:drop-shadow(0 16px 17px rgba(65,49,40,.10));transform-style:preserve-3d}
      .vyrdict-index-gallery .vtg-item img{display:block;width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;mix-blend-mode:multiply;image-rendering:auto;user-select:none;-webkit-user-drag:none;pointer-events:none;backface-visibility:hidden}
      .vyrdict-index-gallery .vtg-item[data-rel="0"]{z-index:8;filter:drop-shadow(0 25px 24px rgba(65,49,40,.15))}
      .vyrdict-index-gallery .vtg-item[data-rel="-1"],.vyrdict-index-gallery .vtg-item[data-rel="1"]{z-index:5}
      .vyrdict-index-gallery .vtg-item.is-hidden{pointer-events:none}
      .vyrdict-index-gallery .vtg-item:focus-visible{outline:1px solid rgba(23,21,17,.62);outline-offset:8px;border-radius:18px}
      .vyrdict-index-gallery .vtg-item.is-center:after{content:'VIEW VYRDICT';position:absolute;left:50%;bottom:-13px;transform:translateX(-50%) translateY(4px);padding:7px 10px;border-radius:999px;background:rgba(239,233,225,.88);color:#2f2b27;font:900 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.09em;opacity:0;transition:.18s ease;white-space:nowrap}
      .vyrdict-index-gallery .vtg-item.is-center:hover:after,.vyrdict-index-gallery .vtg-item.is-center:focus-visible:after{opacity:1;transform:translateX(-50%) translateY(0)}

      .vyrdict-index-gallery .vtg-item.motion-out-next{z-index:15!important;transition:none!important;animation:vtgOutNext .64s cubic-bezier(.22,.72,.18,1) both}
      .vyrdict-index-gallery .vtg-item.motion-in-next{z-index:14!important;transition:none!important;animation:vtgInNext .64s cubic-bezier(.22,.72,.18,1) both}
      .vyrdict-index-gallery .vtg-item.motion-out-prev{z-index:15!important;transition:none!important;animation:vtgOutPrev .64s cubic-bezier(.22,.72,.18,1) both}
      .vyrdict-index-gallery .vtg-item.motion-in-prev{z-index:14!important;transition:none!important;animation:vtgInPrev .64s cubic-bezier(.22,.72,.18,1) both}
      @keyframes vtgOutNext{
        0%{transform:translate3d(0,0,0) scale(1) rotateY(0deg);opacity:1}
        18%{transform:translate3d(0,-7px,72px) scale(1.24) rotateY(0deg);opacity:1}
        52%{transform:translate3d(calc(var(--step)*-.30),-5px,46px) scale(1.08) rotateY(76deg);opacity:.99}
        78%{transform:translate3d(calc(var(--step)*-.70),8px,12px) scale(.79) rotateY(34deg);opacity:.90}
        100%{transform:translate3d(calc(var(--step)*-1),18px,0) scale(.64) rotateY(0deg);opacity:.80}
      }
      @keyframes vtgInNext{
        0%{transform:translate3d(var(--step),18px,0) scale(.64) rotateY(0deg);opacity:.80}
        22%{transform:translate3d(calc(var(--step)*.72),10px,10px) scale(.80) rotateY(-30deg);opacity:.90}
        54%{transform:translate3d(calc(var(--step)*.30),-5px,46px) scale(1.07) rotateY(-76deg);opacity:.99}
        81%{transform:translate3d(0,-7px,72px) scale(1.22) rotateY(0deg);opacity:1}
        100%{transform:translate3d(0,0,0) scale(1) rotateY(0deg);opacity:1}
      }
      @keyframes vtgOutPrev{
        0%{transform:translate3d(0,0,0) scale(1) rotateY(0deg);opacity:1}
        18%{transform:translate3d(0,-7px,72px) scale(1.24) rotateY(0deg);opacity:1}
        52%{transform:translate3d(calc(var(--step)*.30),-5px,46px) scale(1.08) rotateY(-76deg);opacity:.99}
        78%{transform:translate3d(calc(var(--step)*.70),8px,12px) scale(.79) rotateY(-34deg);opacity:.90}
        100%{transform:translate3d(var(--step),18px,0) scale(.64) rotateY(0deg);opacity:.80}
      }
      @keyframes vtgInPrev{
        0%{transform:translate3d(calc(var(--step)*-1),18px,0) scale(.64) rotateY(0deg);opacity:.80}
        22%{transform:translate3d(calc(var(--step)*-.72),10px,10px) scale(.80) rotateY(30deg);opacity:.90}
        54%{transform:translate3d(calc(var(--step)*-.30),-5px,46px) scale(1.07) rotateY(76deg);opacity:.99}
        81%{transform:translate3d(0,-7px,72px) scale(1.22) rotateY(0deg);opacity:1}
        100%{transform:translate3d(0,0,0) scale(1) rotateY(0deg);opacity:1}
      }

      .vyrdict-index-gallery .vtg-arrow{position:absolute;z-index:20;top:50%;width:40px;height:40px;margin-top:-20px;border:1px solid rgba(23,21,17,.14);border-radius:50%;background:rgba(237,231,223,.76);backdrop-filter:blur(5px);display:grid;place-items:center;color:#302c28;font:400 18px/1 Arial,sans-serif;cursor:pointer;transition:background .18s ease,transform .18s ease}
      .vyrdict-index-gallery .vtg-arrow:hover{background:rgba(247,243,237,.94);transform:scale(1.04)}
      .vyrdict-index-gallery .vtg-prev{left:12px}.vyrdict-index-gallery .vtg-next{right:12px}
      .vyrdict-index-gallery .vtg-count{position:absolute;z-index:7;left:50%;bottom:5px;transform:translateX(-50%);font:800 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.13em;color:#716a63}

      @media(max-width:800px){
        .vyrdict-index-gallery{padding:44px 0 24px!important}
        .vyrdict-index-gallery .vtg-wrap{width:min(100% - 18px,680px)}
        .vyrdict-index-gallery .vtg-head{text-align:left;padding:0 5px;margin-bottom:11px}
        .vyrdict-index-gallery .vtg-title{font-size:clamp(36px,11vw,50px)}
        .vyrdict-index-gallery .vtg-sub{margin-left:0;font-size:12px}
        .vyrdict-index-gallery .vtg-cats{gap:18px;padding-left:6px;padding-right:6px}
        .vyrdict-index-gallery .vtg-stage{height:440px;--step:245px;perspective:900px}
        .vyrdict-index-gallery .vtg-focus{top:8px;width:min(73vw,306px);height:397px;border-radius:32px}
        .vyrdict-index-gallery .vtg-focus-top{left:23px;right:23px;top:22px}
        .vyrdict-index-gallery .vtg-focus-bottom{left:23px;right:23px;bottom:19px;padding-top:13px}
        .vyrdict-index-gallery .vtg-name{max-width:180px;font-size:11px}
        .vyrdict-index-gallery .vtg-item{width:214px;height:264px;margin:-149px 0 0 -107px;transition-duration:.42s}
        .vyrdict-index-gallery .vtg-arrow{width:36px;height:36px;margin-top:-18px}
        .vyrdict-index-gallery .vtg-prev{left:0}.vyrdict-index-gallery .vtg-next{right:0}
      }
      @media(max-width:430px){
        .vyrdict-index-gallery .vtg-stage{height:431px;--step:205px}
        .vyrdict-index-gallery .vtg-focus{width:74vw;max-width:288px;height:392px}
        .vyrdict-index-gallery .vtg-item{width:194px;height:244px;margin:-141px 0 0 -97px}
        .vyrdict-index-gallery .vtg-arrow{top:auto;bottom:5px}
        .vyrdict-index-gallery .vtg-prev{left:calc(50% - 66px)}.vyrdict-index-gallery .vtg-next{right:calc(50% - 66px)}
        .vyrdict-index-gallery .vtg-count{bottom:18px}
      }
      @media(prefers-reduced-motion:reduce){.vyrdict-index-gallery *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `;
      document.head.appendChild(s);
    }

    function targetSection(){
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

    async function getWeekly(){
      if(weeklyRows.length)return weeklyRows;
      try{
        const r=await fetch(WEEKLY_ENDPOINT,{cache:'no-store'});
        if(!r.ok)return [];
        const d=await r.json();
        const a=Array.isArray(d)?d:Array.isArray(d?.rankings)?d.rankings:Array.isArray(d?.data)?d.data:[];
        weeklyRows=a.map(unwrapWeekly).filter(Boolean);
      }catch{}
      return weeklyRows;
    }

    function selectProducts(rows,cat){
      const base=catalog().filter(p=>p&&p.slug&&p.image_url);
      const ranked=(rows||[]).filter(p=>p&&p.slug&&p.image_url);
      const wanted=cat==='All'?null:norm(cat),map=new Map();
      [...ranked,...base].forEach(p=>{if(wanted&&norm(p.category)!==wanted)return;if(!map.has(p.slug))map.set(p.slug,p)});
      const list=[...map.values()].sort((a,b)=>{
        const ar=Number(a.weekly_rank||9999),br=Number(b.weekly_rank||9999);
        if(ar!==br)return ar-br;
        return Number(b.trend_score||b.viral_score||0)-Number(a.trend_score||a.viral_score||0)||Number(b.worth_score||0)-Number(a.worth_score||0);
      });
      if(cat!=='All')return list.slice(0,10);
      const out=[],seen=new Set();
      for(const p of list){const c=norm(p.category);if(c&&!seen.has(c)){seen.add(c);out.push(p)}if(out.length>=10)break}
      if(out.length<8){for(const p of list){if(!out.some(x=>x.slug===p.slug))out.push(p);if(out.length>=10)break}}
      return out.slice(0,10);
    }

    function template(){
      return `<div class="vtg-wrap">
        <div class="vtg-head"><p class="vtg-kicker">VYRDICT LIVE</p><h2 class="vtg-title">Trending Index</h2><p class="vtg-sub">Move through what’s getting attention now. Tap the product in focus for the full VYRDICT.</p></div>
        <div class="vtg-cats" role="tablist" aria-label="Trending product categories">${CATEGORIES.map(c=>`<button class="vtg-cat${c==='All'?' is-active':''}" type="button" role="tab" aria-selected="${c==='All'}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
        <div class="vtg-stage" aria-live="polite">
          <div class="vtg-focus" aria-hidden="true"><div class="vtg-focus-top"><span class="vtg-mark">VYRDICT</span><span class="vtg-focus-cat">ALL</span></div><div class="vtg-focus-bottom"><p class="vtg-brand">VYRDICT</p><p class="vtg-name">What’s trending now</p><span class="vtg-view">View →</span></div></div>
          <div class="vtg-items"></div>
          <button class="vtg-arrow vtg-prev" type="button" aria-label="Previous trending product">←</button><button class="vtg-arrow vtg-next" type="button" aria-label="Next trending product">→</button><div class="vtg-count" aria-hidden="true"></div>
        </div>
      </div>`;
    }

    function relFor(i,index,n){let d=i-index;if(n>2){if(d>n/2)d-=n;if(d<-n/2)d+=n}return d}
    function step(){return parseFloat(getComputedStyle(section.querySelector('.vtg-stage')).getPropertyValue('--step'))||320}
    function href(p){return '/product/'+encodeURIComponent(p.slug)+'/'}

    function updateMeta(){
      if(!section||!products.length)return;
      const p=products[activeIndex];
      const brand=section.querySelector('.vtg-brand'),name=section.querySelector('.vtg-name'),cat=section.querySelector('.vtg-focus-cat'),count=section.querySelector('.vtg-count');
      if(brand)brand.textContent=p.brand||p.category||'VYRDICT';
      if(name)name.textContent=p.name||'';
      if(cat)cat.textContent=(p.category||activeCategory||'All').toUpperCase();
      if(count)count.textContent=`${String(activeIndex+1).padStart(2,'0')} / ${String(products.length).padStart(2,'0')}`;
    }

    function positionItems(){
      if(!section||!products.length)return;
      const st=step(),items=[...section.querySelectorAll('.vtg-item')],n=products.length;
      items.forEach((el,i)=>{
        if(el.dataset.motion==='1')return;
        const rel=relFor(i,activeIndex,n),abs=Math.abs(rel);
        let scale=1,opacity=1,y=0,x=rel*st;
        if(abs===1){scale=.64;opacity=.80;y=18}
        else if(abs===2){scale=.43;opacity=.25;y=39;x=rel*st*.92}
        else if(abs>2){scale=.32;opacity=0;y=48}
        el.dataset.rel=String(rel);el.classList.toggle('is-center',rel===0);el.classList.toggle('is-hidden',abs>2);
        el.style.setProperty('--x',`${x}px`);el.style.setProperty('--y',`${y}px`);el.style.setProperty('--s',String(scale));el.style.setProperty('--o',String(opacity));
        el.tabIndex=abs<=1?0:-1;
      });
      updateMeta();
    }

    function clearTimers(){clearTimeout(autoTimer);clearTimeout(finishTimer);autoTimer=finishTimer=0}
    function scheduleAuto(delay=2250){
      clearTimeout(autoTimer);
      if(!section||products.length<2||document.visibilityState==='hidden')return;
      if(matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
      autoTimer=setTimeout(()=>advance(1,false),delay);
    }

    function cleanupMotion(){
      if(!section)return;
      section.querySelectorAll('.vtg-item').forEach(el=>{el.dataset.motion='0';el.classList.remove('motion-out-next','motion-in-next','motion-out-prev','motion-in-prev')});
      animating=false;positionItems();scheduleAuto();
    }

    function advance(dir,manual=true){
      try{
        if(animating||!section||products.length<2)return;
        clearTimeout(autoTimer);animating=true;
        const items=[...section.querySelectorAll('.vtg-item')],n=products.length,oldIndex=activeIndex,newIndex=(activeIndex+dir+n)%n;
        const oldEl=items[oldIndex],newEl=items[newIndex];
        if(!oldEl||!newEl){animating=false;return scheduleAuto()}
        oldEl.dataset.motion='1';newEl.dataset.motion='1';
        activeIndex=newIndex;positionItems();updateMeta();
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          oldEl.classList.add(dir>0?'motion-out-next':'motion-out-prev');
          newEl.classList.remove('is-hidden');newEl.classList.add(dir>0?'motion-in-next':'motion-in-prev');
        }));
        finishTimer=setTimeout(cleanupMotion,680);
      }catch(e){animating=false;positionItems();scheduleAuto(2600)}
    }

    function buildItems(){
      const box=section?.querySelector('.vtg-items');if(!box)return;
      box.replaceChildren();
      products.forEach((p,i)=>{
        const b=document.createElement('button');b.type='button';b.className='vtg-item';b.dataset.i=String(i);
        const img=document.createElement('img');img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+(p.name||'');img.loading=Math.abs(i-activeIndex)<=1?'eager':'lazy';img.decoding='async';
        b.appendChild(img);
        b.addEventListener('click',()=>{
          if(animating)return;
          const rel=relFor(i,activeIndex,products.length);
          if(rel===0){location.assign(href(p));return}
          advance(rel>0?1:-1,true);
        });
        box.appendChild(b);
      });
      positionItems();scheduleAuto(1850);
    }

    async function switchCategory(cat){
      try{
        clearTimers();animating=false;activeCategory=cat;activeIndex=0;
        section.querySelectorAll('.vtg-cat').forEach(b=>{const on=b.dataset.cat===cat;b.classList.toggle('is-active',on);b.setAttribute('aria-selected',String(on));if(on)b.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})});
        const rows=await getWeekly();const next=selectProducts(rows,cat);
        if(!next.length){scheduleAuto();return}
        products=next;buildItems();
      }catch{scheduleAuto()}
    }

    function bind(){
      section.querySelectorAll('.vtg-cat').forEach(b=>b.addEventListener('click',()=>switchCategory(b.dataset.cat||'All')));
      section.querySelector('.vtg-prev')?.addEventListener('click',()=>advance(-1,true));
      section.querySelector('.vtg-next')?.addEventListener('click',()=>advance(1,true));
      const stage=section.querySelector('.vtg-stage');
      let downX=null;
      stage?.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.pointerType==='pen')downX=e.clientX});
      stage?.addEventListener('pointerup',e=>{if(downX==null)return;const dx=e.clientX-downX;downX=null;if(Math.abs(dx)>42)advance(dx<0?1:-1,true)});
      addEventListener('resize',()=>requestAnimationFrame(positionItems),{passive:true});
      document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')scheduleAuto(700);else clearTimeout(autoTimer)});
    }

    async function mount(){
      if(!isHome()||document.querySelector('.vyrdict-index-gallery'))return true;
      const old=targetSection();if(!old)return false;
      const rows=await getWeekly();
      const initial=selectProducts(rows,'All');
      if(initial.length<2)return false;
      addStyle();
      // Build off-DOM first; only replace the existing section after the enhancement is complete.
      const shell=document.createElement('section');shell.className='section vyrdict-index-gallery';shell.id='trending-index';shell.innerHTML=template();
      old.replaceWith(shell);section=shell;products=initial;bind();buildItems();
      return true;
    }

    function boot(attempt=0){
      clearTimeout(bootTimer);
      Promise.resolve(mount()).then(ok=>{if(!ok&&attempt<40)bootTimer=setTimeout(()=>boot(attempt+1),125)}).catch(()=>{if(attempt<40)bootTimer=setTimeout(()=>boot(attempt+1),160)});
    }

    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
    addEventListener('popstate',()=>{if(isHome())setTimeout(()=>boot(),80)});
  }catch(e){console.warn('[VYRDICT] Trending Index enhancement skipped safely.');}
})();
