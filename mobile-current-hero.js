(()=>{
  if(window.__vyrdictMobileCurrentHeroV2)return;
  window.__vyrdictMobileCurrentHeroV2=1;

  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const MOBILE=matchMedia('(max-width:700px)');
  const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const STYLE_ID='vyrdict-mobile-current-hero-style-v2';
  const LAYER_ID='vyrdict-mobile-current-static-layer';
  let busy=false,observer=null,resizeTimer=0;

  const animatedReady=()=>{
    const layer=document.getElementById('vyrdict-hero-v8-layer');
    return !!document.querySelector('.hero.vyrdict-hero-v8')&&!!layer&&layer.querySelectorAll('.vh8-product').length>=3;
  };

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .hero.vyrdict-current-static{position:relative!important;isolation:isolate!important;overflow:visible!important;background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important}
      .hero.vyrdict-current-static::before{content:'';position:absolute;z-index:0;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-static-hero-h,520px);transform:translateX(-50%);pointer-events:none;background:radial-gradient(ellipse at 78% 38%,rgba(52,49,47,.22),transparent 37%),radial-gradient(ellipse at 42% 72%,rgba(255,255,255,.20),transparent 34%),linear-gradient(108deg,#d8d5d1 0%,#d0cdca 33%,#c3c0bd 67%,#b7b4b1 100%)}
      .hero.vyrdict-current-static::after{content:'';position:absolute;z-index:2;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-static-hero-h,520px);transform:translateX(-50%);pointer-events:none;background:linear-gradient(90deg,rgba(218,215,211,.96) 0%,rgba(214,211,207,.91) 32%,rgba(205,202,198,.63) 50%,rgba(193,190,187,.13) 73%,transparent 100%)}
      .hero.vyrdict-current-static>:not(#${LAYER_ID}):not(.section){position:relative;z-index:3}
      .hero.vyrdict-current-static .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #${LAYER_ID}{position:absolute;z-index:1;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-static-hero-h,520px);transform:translateX(-50%);overflow:hidden;pointer-events:none}
      #${LAYER_ID} .vms-product{position:absolute;filter:drop-shadow(0 12px 18px rgba(34,31,29,.20));pointer-events:none}
      #${LAYER_ID} img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:transparent!important;border:0!important;box-shadow:none!important}
    `;
    document.head.appendChild(s)
  }

  function heroParts(){
    const stage=document.querySelector('.hero .stage,.stage');
    if(!stage)return {};
    const hero=stage.closest('.hero')||stage.closest('section')||stage.parentElement;
    return {hero,stage}
  }

  function sync(hero,stage){
    if(!hero||!stage)return;
    const hr=hero.getBoundingClientRect(),sr=stage.getBoundingClientRect();let bottom=sr.bottom;
    for(const el of hero.querySelectorAll('h1,form,input,.search,.actions,.cta,.hero-copy,.heroCopy')){
      const r=el.getBoundingClientRect();
      if(r.top<sr.bottom+100&&r.bottom>hr.top)bottom=Math.max(bottom,r.bottom)
    }
    hero.style.setProperty('--vyrdict-static-hero-h',`${Math.max(430,Math.ceil(bottom-hr.top+28))}px`)
  }

  function stageProducts(stage){
    const out=[],seen=new Set();
    for(const img of stage?.querySelectorAll('img')||[]){
      const src=img.currentSrc||img.src;
      if(/^https?:\/\//i.test(src)&&!seen.has(src)){out.push({image_url:src});seen.add(src)}
    }
    return out
  }

  async function liveProducts(){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),1300);
    try{
      const r=await fetch(FEED,{cache:'no-store',signal:ctrl.signal});
      if(!r.ok)throw 0;
      const d=await r.json(),all=[...(d?.trending||[]),...(d?.worth||[]),...(d?.skip||[])],out=[],seen=new Set();
      for(const p of all){
        const src=String(p?.image_url||'');
        const key=String(p?.slug||src);
        if(/^https:\/\//i.test(src)&&!seen.has(key)){out.push(p);seen.add(key)}
      }
      return out
    }catch{return []}finally{clearTimeout(timer)}
  }

  function render(hero,stage,products){
    if(!hero||!stage||products.length<3||animatedReady())return false;
    addStyle();
    hero.classList.add('vyrdict-current-static');
    sync(hero,stage);
    document.getElementById(LAYER_ID)?.remove();
    const layer=document.createElement('div');layer.id=LAYER_ID;hero.appendChild(layer);
    const boxes=[
      {l:'58%',t:'8%',w:'36%',h:'42%'},
      {l:'67%',t:'42%',w:'30%',h:'43%'},
      {l:'40%',t:'50%',w:'27%',h:'36%'},
      {l:'48%',t:'24%',w:'24%',h:'31%'}
    ];
    products.slice(0,4).forEach((p,i)=>{
      const b=boxes[i],d=document.createElement('div');d.className='vms-product';
      Object.assign(d.style,{left:b.l,top:b.t,width:b.w,height:b.h});
      const img=document.createElement('img');img.src=p.image_url;img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';img.loading='eager';
      d.appendChild(img);layer.appendChild(d)
    });
    document.documentElement.dataset.vyrdictCurrentHero='static';
    return true
  }

  function cleanup(){
    document.getElementById(LAYER_ID)?.remove();
    const hero=document.querySelector('.hero.vyrdict-current-static');
    if(hero){hero.classList.remove('vyrdict-current-static');hero.style.removeProperty('--vyrdict-static-hero-h')}
    if(document.documentElement.dataset.vyrdictCurrentHero==='static')delete document.documentElement.dataset.vyrdictCurrentHero
  }

  async function ensure(){
    if(busy||!HOME()||!MOBILE.matches)return false;
    if(animatedReady()){cleanup();return true}
    const {hero,stage}=heroParts();if(!hero||!stage)return false;
    busy=true;
    try{
      const immediate=stageProducts(stage);
      if(immediate.length>=3)render(hero,stage,immediate);
      const live=await liveProducts();
      if(animatedReady()){cleanup();return true}
      if(live.length>=3)render(hero,stage,live);
      return !!document.getElementById(LAYER_ID)
    }finally{busy=false}
  }

  function boot(attempt=0){
    if(!HOME()||!MOBILE.matches){cleanup();return}
    if(animatedReady()){cleanup();return}
    ensure().then(ok=>{if(!ok&&attempt<30)setTimeout(()=>boot(attempt+1),100)})
  }

  function watch(){
    if(observer)return;
    const target=document.getElementById('app')||document.body;if(!target)return;
    observer=new MutationObserver(()=>{
      if(animatedReady()){cleanup();return}
      if(HOME()&&MOBILE.matches&&!document.getElementById(LAYER_ID))setTimeout(()=>ensure(),40)
    });
    observer.observe(target,{childList:true,subtree:true})
  }

  const start=()=>{addStyle();watch();setTimeout(()=>boot(),80);setTimeout(()=>boot(),450);setTimeout(()=>boot(),900)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(animatedReady()){cleanup();return}const {hero,stage}=heroParts();if(hero&&stage&&document.getElementById(LAYER_ID))sync(hero,stage);else boot()},80)},{passive:true});
  addEventListener('pageshow',()=>setTimeout(()=>boot(),40));
  addEventListener('popstate',()=>setTimeout(()=>boot(),40));
  addEventListener('hashchange',()=>setTimeout(()=>boot(),40));
})();