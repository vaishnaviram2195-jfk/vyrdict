(()=>{
  if(window.__vyrdictTrendingEditorialLiveV1)return;
  window.__vyrdictTrendingEditorialLiveV1=1;

  const STYLE_ID='vyrdict-trending-editorial-live-v1';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  let section=null,lastTarget='',refreshAt=Date.now(),timer=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-index-claw{transition:background .55s ease!important}
      .vyrdict-index-claw .vti-head-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;max-width:520px}
      .vyrdict-index-claw .vti-sub{max-width:520px!important;font-size:14px!important;line-height:1.45!important}
      .vyrdict-index-claw .vti-live-status{display:inline-flex;align-items:center;gap:7px;font:900 8px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#665f59;white-space:nowrap}
      .vyrdict-index-claw .vti-live-status i{display:block;width:7px;height:7px;border-radius:50%;background:#d94d73;box-shadow:0 0 0 5px rgba(217,77,115,.08);animation:vtiPulse 2.4s ease-in-out infinite}
      @keyframes vtiPulse{0%,100%{box-shadow:0 0 0 4px rgba(217,77,115,.07)}50%{box-shadow:0 0 0 8px rgba(217,77,115,.02)}}

      .vyrdict-index-claw .vti-window{transition:box-shadow .28s ease,background .28s ease}
      .vyrdict-index-claw .vti-window:after{content:'';position:absolute;z-index:15;left:var(--vti-spot-x,50%);bottom:31px;width:122px;height:154px;transform:translateX(-50%) scale(.82);border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,255,255,.58) 0%,rgba(255,244,247,.28) 42%,rgba(217,138,157,.08) 62%,transparent 74%);opacity:0;pointer-events:none;transition:opacity .24s ease,transform .32s ease}
      .vyrdict-index-claw .vti-window.vti-selecting{box-shadow:inset 0 0 0 1px rgba(255,255,255,.78),inset 0 -28px 38px rgba(74,68,65,.055),inset 0 0 70px rgba(94,83,82,.055)}
      .vyrdict-index-claw .vti-window.vti-selecting:after{opacity:1;transform:translateX(-50%) scale(1)}
      .vyrdict-index-claw .vti-window.vti-selecting .vti-product:not(.is-target){opacity:.38;filter:saturate(.68) drop-shadow(0 5px 5px rgba(54,41,34,.08))}
      .vyrdict-index-claw .vti-window.vti-selecting .vti-product.is-target{opacity:1;z-index:18;transform:translateX(-50%) scale(1.08);filter:drop-shadow(0 0 16px rgba(255,255,255,.95)) drop-shadow(0 10px 12px rgba(86,53,60,.22))}
      .vyrdict-index-claw .vti-window.vti-selecting .vti-product.is-target.is-grabbed{opacity:.12!important;transform:translate(-50%,-74px) scale(.96)!important}

      .vyrdict-index-claw .vti-product:nth-child(1){width:47px!important;height:91px!important;bottom:7px!important}
      .vyrdict-index-claw .vti-product:nth-child(2){width:58px!important;height:109px!important;bottom:15px!important}
      .vyrdict-index-claw .vti-product:nth-child(3){width:53px!important;height:101px!important;bottom:5px!important}
      .vyrdict-index-claw .vti-product:nth-child(4){width:48px!important;height:94px!important;bottom:17px!important}
      .vyrdict-index-claw .vti-product:nth-child(5){width:56px!important;height:108px!important;bottom:9px!important}

      .vyrdict-index-claw .vti-reveal-card{isolation:isolate}
      .vyrdict-index-claw .vti-reveal-card:before{content:'';position:absolute;z-index:0;inset:8% -5% 8% 6%;background:radial-gradient(ellipse at 56% 45%,rgba(255,255,255,.44),rgba(255,255,255,0) 64%);pointer-events:none}
      .vyrdict-index-claw .vti-panel-top{z-index:7!important}
      .vyrdict-index-claw .vti-now{color:#6e615d!important}
      .vyrdict-index-claw .vti-panel-cat{color:#8d6b78!important}
      .vyrdict-index-claw .vti-signal{position:absolute;left:28px;top:49px;z-index:7;font:900 9px/1.25 Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#8c5367;opacity:0;transform:translateY(5px);transition:.25s ease}
      .vyrdict-index-claw .vti-signal.is-on{opacity:1;transform:none}
      .vyrdict-index-claw .vti-reveal-link{inset:58px -4px 132px 4px!important;z-index:2!important;transition:opacity .2s ease,transform .34s cubic-bezier(.18,.85,.2,1)!important}
      .vyrdict-index-claw .vti-reveal-link img{width:96%!important;height:98%!important;object-fit:contain!important;filter:drop-shadow(0 28px 32px rgba(67,43,33,.16))!important;transform:scale(1.03);transition:transform .5s cubic-bezier(.18,.85,.2,1)}
      .vyrdict-index-claw .vti-reveal-link.is-on img{transform:scale(1)}
      .vyrdict-index-claw .vti-panel-copy{bottom:22px!important;z-index:8!important;max-width:88%}
      .vyrdict-index-claw .vti-brand{color:#7a6c68!important}
      .vyrdict-index-claw .vti-name{font-size:clamp(32px,3.35vw,52px)!important;line-height:.94!important;max-width:95%!important;text-wrap:balance}
      .vyrdict-index-claw .vti-momentum-copy{display:block;margin-top:9px;max-width:470px;font:600 11.5px/1.45 Arial,sans-serif;color:#665e59;letter-spacing:.005em}
      .vyrdict-index-claw .vti-open{margin-top:10px!important}
      .vyrdict-index-claw .vti-next-tease{position:absolute;right:28px;top:48px;z-index:7;max-width:195px;text-align:right;font:800 8px/1.35 Arial,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#81756f;opacity:.82;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vyrdict-index-claw .vti-next-tease b{font-weight:900;color:#403a36}
      .vyrdict-index-claw .vti-foot{align-items:center!important}
      .vyrdict-index-claw .vti-updated{display:flex;align-items:center;gap:7px}
      .vyrdict-index-claw .vti-updated:before{content:'';width:6px;height:6px;border-radius:50%;background:#d94d73;display:inline-block}

      @media(max-width:760px){
        .vyrdict-index-claw .vti-head-right{align-items:flex-start;max-width:none}
        .vyrdict-index-claw .vti-live-status{margin-bottom:5px}
        .vyrdict-index-claw .vti-reveal-card{height:520px!important}
        .vyrdict-index-claw .vti-signal{left:24px;top:48px;font-size:8px}
        .vyrdict-index-claw .vti-next-tease{right:24px;top:47px;max-width:145px;font-size:7px}
        .vyrdict-index-claw .vti-reveal-link{inset:64px -8px 150px -8px!important}
        .vyrdict-index-claw .vti-reveal-link img{width:100%!important;height:100%!important}
        .vyrdict-index-claw .vti-panel-copy{left:24px!important;right:24px!important;bottom:23px!important;max-width:92%}
        .vyrdict-index-claw .vti-name{font-size:clamp(29px,9vw,40px)!important;line-height:.96!important}
        .vyrdict-index-claw .vti-momentum-copy{font-size:11px;max-width:92%}
      }

      @media(prefers-reduced-motion:reduce){
        .vyrdict-index-claw .vti-live-status i{animation:none}
        .vyrdict-index-claw,.vyrdict-index-claw *{transition-duration:.01ms!important;animation-duration:.01ms!important}
      }
    `;
    document.head.appendChild(s);
  }

  const palettes={
    default:['#d9e3d4','#dfe5db','#e3dfdf','#e2dbe8','#ded5e7'],
    beauty:['#dbe3d8','#e1e5dd','#e5dfdf','#e5d8e7','#dfd1e7'],
    fashion:['#dbe2d6','#e2e5dc','#e5dfdf','#e5d9e5','#dfd2e4'],
    fitness:['#d4e2d3','#dce5d9','#e1e2dc','#dedde4','#d9d9e3'],
    tech:['#d7e1dc','#dde4df','#e1e1e1','#dedde7','#d9d9e7'],
    paper:['#d8e2d4','#e0e5da','#e5e1da','#e3dce3','#ddd5e1']
  };

  function paletteFor(cat){
    const c=norm(cat);
    if(/beauty|makeup|skincare|perfume|hair/.test(c))return palettes.beauty;
    if(/fashion|shoes/.test(c))return palettes.fashion;
    if(/fitness|wellness|home|kitchen|food|travel|pets|kids/.test(c))return palettes.fitness;
    if(/tech/.test(c))return palettes.tech;
    if(/books|stationery|toys/.test(c))return palettes.paper;
    return palettes.default;
  }

  function activeCategory(){return section?.querySelector('.vti-cat.is-active')?.dataset?.cat||'All'}

  function setAtmosphere(cat){
    if(!section)return;
    const p=paletteFor(cat);
    ['--vti-sage','--vti-sage-mid','--vti-blend','--vti-lavender-mid','--vti-lavender'].forEach((k,i)=>section.style.setProperty(k,p[i]));
    section.dataset.vtiCategory=norm(cat).replace(/\s+/g,'-')||'all';
  }

  function productList(){
    const data=window.__vyrdictTrendingLiveData?.products||[];
    const cat=activeCategory();
    const rows=data.filter(p=>p&&p.slug&&p.image_url&&(cat==='All'||norm(p.category)===norm(cat)));
    const seen=new Set();
    return rows.filter(p=>!seen.has(p.slug)&&(seen.add(p.slug),true)).slice(0,5);
  }

  function signalFor(p){
    const cat=(p.category||activeCategory()).toUpperCase();
    if(p.is_new)return `NEW ENTRY · ${cat}`;
    if(Number(p.weekly_rank)===1)return `#1 FASTEST RISING · ${cat}`;
    if(Number(p.movement)>0)return `↑ ${Number(p.movement)} ${Number(p.movement)===1?'PLACE':'PLACES'} · ${cat}`;
    return `TRENDING NOW · ${cat}`;
  }

  function momentumFor(p){
    if(p.is_new)return 'New this week and breaking out fast.';
    if(Number(p.movement)>0)return `Climbing ${Number(p.movement)} ${Number(p.movement)===1?'place':'places'} in this week’s trend ranking.`;
    const score=Number(p.trend_score||0);
    if(score>=98)return 'One of this week’s fastest-moving products.';
    if(score>=95)return 'Strong fresh momentum verified this week.';
    return 'Fresh trend momentum verified this week.';
  }

  function updateRefreshStatus(){
    if(!section)return;
    const el=section.querySelector('.vti-live-status span');
    if(!el)return;
    const mins=Math.max(0,Math.floor((Date.now()-refreshAt)/60000));
    el.textContent=mins<1?'LIVE · REFRESHED NOW':mins===1?'LIVE · REFRESHED 1 MIN AGO':`LIVE · REFRESHED ${mins} MIN AGO`;
  }

  function updateEmpty(){
    if(!section)return;
    const tray=section.querySelector('.vti-products');
    const ph=section.querySelector('.vti-placeholder');
    if(!tray||!ph)return;
    ph.textContent=tray.children.length?'The claw is choosing what’s next.':'No fresh breakout verified this week.';
  }

  function revealEditorial(p,index,target){
    if(!section||!p||!target?.classList.contains('is-target'))return;
    const link=section.querySelector('.vti-reveal-link'),img=link?.querySelector('img'),copy=section.querySelector('.vti-panel-copy');
    if(!link||!img||!copy)return;
    const href='/product/'+encodeURIComponent(p.slug)+'/';
    link.classList.remove('is-on');copy.classList.remove('is-on');
    img.src=p.image_url;img.alt=(p.brand?p.brand+' ':'')+p.name;link.href=href;
    const open=section.querySelector('.vti-open');if(open)open.href=href;
    const brand=section.querySelector('.vti-brand');if(brand)brand.textContent=p.brand||p.category||'';
    const name=section.querySelector('.vti-name');if(name)name.textContent=p.name||'';
    const signal=section.querySelector('.vti-signal');if(signal){signal.textContent=signalFor(p);signal.classList.add('is-on')}
    const momentum=section.querySelector('.vti-momentum-copy');if(momentum)momentum.textContent=momentumFor(p);
    const list=productList(),next=list.length>1?list[(index+1)%list.length]:null;
    const teaser=section.querySelector('.vti-next-tease');if(teaser)teaser.innerHTML=next?`NEXT → <b>${String(next.name||'').replace(/[<>&]/g,'')}</b>`:'';
    requestAnimationFrame(()=>requestAnimationFrame(()=>{link.classList.add('is-on');copy.classList.add('is-on')}));
  }

  function onTarget(target){
    if(!target||!section)return;
    const index=Number(target.dataset.i||0),list=productList(),p=list[index];
    const key=(p?.slug||'')+':'+index;
    if(!p||key===lastTarget)return;
    lastTarget=key;
    const win=section.querySelector('.vti-window');
    if(win){
      const wb=win.getBoundingClientRect(),tb=target.getBoundingClientRect();
      const x=((tb.left+tb.width/2)-wb.left)/Math.max(1,wb.width)*100;
      win.style.setProperty('--vti-spot-x',Math.max(8,Math.min(92,x))+'%');
      win.classList.add('vti-selecting');
    }
    setTimeout(()=>revealEditorial(p,index,target),520);
  }

  function decorate(){
    if(!section)return;
    const sub=section.querySelector('.vti-sub');
    if(sub&&!sub.closest('.vti-head-right')){
      const wrap=document.createElement('div');wrap.className='vti-head-right';
      sub.parentNode.insertBefore(wrap,sub);wrap.appendChild(sub);
      sub.textContent='What the internet is buying, searching, saving & talking about — right now.';
      const live=document.createElement('div');live.className='vti-live-status';live.innerHTML='<i></i><span>LIVE · REFRESHED NOW</span>';wrap.appendChild(live);
    }
    const reveal=section.querySelector('.vti-reveal-card');
    if(reveal&&!reveal.querySelector('.vti-signal')){
      const signal=document.createElement('div');signal.className='vti-signal';reveal.appendChild(signal);
      const next=document.createElement('div');next.className='vti-next-tease';reveal.appendChild(next);
    }
    const name=section.querySelector('.vti-name');
    if(name&&!section.querySelector('.vti-momentum-copy')){
      const m=document.createElement('span');m.className='vti-momentum-copy';name.insertAdjacentElement('afterend',m);
    }
    const now=section.querySelector('.vti-now');if(now)now.textContent='LIVE SELECTION';
    const foot=section.querySelector('.vti-updated');if(foot)foot.textContent='LIVE PRODUCT INDEX · FRESH SIGNALS ONLY';
    setAtmosphere(activeCategory());
    updateEmpty();updateRefreshStatus();
  }

  function observe(){
    const tray=section.querySelector('.vti-products'),win=section.querySelector('.vti-window');
    if(tray){
      const mo=new MutationObserver(muts=>{
        for(const m of muts){
          if(m.type==='childList')updateEmpty();
          if(m.type==='attributes'&&m.target.classList?.contains('is-target'))onTarget(m.target);
        }
        if(win&&!tray.querySelector('.vti-product.is-target'))win.classList.remove('vti-selecting');
      });
      mo.observe(tray,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    }
    section.addEventListener('click',e=>{
      const cat=e.target.closest?.('.vti-cat');
      if(!cat)return;
      setTimeout(()=>{lastTarget='';setAtmosphere(cat.dataset.cat||'All');updateEmpty()},0);
    },true);
  }

  function mount(attempt=0){
    section=document.querySelector('.vyrdict-index-claw');
    if(!section){if(attempt<60)setTimeout(()=>mount(attempt+1),80);return}
    addStyle();decorate();observe();
    clearInterval(timer);timer=setInterval(updateRefreshStatus,60000);
  }

  window.addEventListener('vyrdict:trending-data',()=>{refreshAt=Date.now();if(section){decorate();lastTarget='';updateRefreshStatus()}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});else mount();
})();