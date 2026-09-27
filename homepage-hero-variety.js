(()=>{
  if(window.__vyrdictHeroV10)return;
  window.__vyrdictHeroV10=1;
  const MOTION_REV='20260927-motion-5';
  window.__vyrdictHeroMotionRev=MOTION_REV;

  const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const MOBILE=matchMedia('(max-width:700px)');
  const STYLE_ID='vyrdict-hero-v8-style';
  const LAYER_ID='vyrdict-hero-v8-layer';
  const FALLBACK_IDS=['vyrdict-mobile-current-static-layer','vyrdict-mobile-motion-layer','vyrdict-mobile-hero-primary-layer'];
  let hero=null,stage=null,token=0,resizeTimer=0,repairTimer=0,observer=null,mounting=false,heroHeight=520;

  const home=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const important=(el,name,value)=>el.style.setProperty(name,String(value),'important');
  const pct=(v,total)=>String(v).trim().endsWith('%')?total*parseFloat(v)/100:parseFloat(v)||0;

  function style(){
    const old=document.getElementById(STYLE_ID);
    if(old?.dataset?.rev===MOTION_REV)return;
    old?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;s.dataset.rev=MOTION_REV;s.textContent=`
      .hero.vyrdict-hero-v8{position:relative!important;isolation:isolate!important;overflow:visible!important;background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important}
      .hero.vyrdict-hero-v8::before{content:'';position:absolute;z-index:0;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-hero-h,520px);transform:translateX(-50%);pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important;background:radial-gradient(ellipse at 78% 38%,rgba(52,49,47,.22),transparent 37%),radial-gradient(ellipse at 42% 72%,rgba(255,255,255,.20),transparent 34%),linear-gradient(108deg,#d8d5d1 0%,#d0cdca 33%,#c3c0bd 67%,#b7b4b1 100%)}
      .hero.vyrdict-hero-v8::after{content:'';position:absolute;z-index:2;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-hero-h,520px);transform:translateX(-50%);pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important;background:linear-gradient(90deg,rgba(218,215,211,.96) 0%,rgba(216,213,209,.93) 20%,rgba(211,208,204,.82) 36%,rgba(205,202,198,.48) 48%,rgba(194,191,187,.10) 62%,rgba(188,185,182,0) 74%)}
      .hero.vyrdict-hero-v8>:not(#${LAYER_ID}):not(.section){position:relative;z-index:3}
      .hero.vyrdict-hero-v8 .section{position:relative;z-index:auto}
      .hero.vyrdict-hero-v8 .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #${LAYER_ID}{display:block!important;visibility:visible!important;position:absolute!important;z-index:1!important;top:0!important;left:50%!important;width:calc(100vw + 6px)!important;height:var(--vyrdict-hero-h,520px)!important;transform:translateX(-50%)!important;overflow:hidden!important;pointer-events:none!important;border:0!important;outline:0!important;box-shadow:none!important}
      #${LAYER_ID} .vh8-product{position:absolute!important;display:block!important;visibility:visible!important;pointer-events:none!important;transform-origin:center;will-change:transform,opacity,filter;filter:drop-shadow(0 18px 24px rgba(34,31,29,.24))}
      #${LAYER_ID} .vh8-product img{display:block!important;visibility:visible!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;background:transparent!important;padding:0!important;border:0!important;box-shadow:none!important;transform:none!important}
      @media(max-width:700px){.hero.vyrdict-hero-v8::after{background:linear-gradient(90deg,rgba(218,215,211,.96) 0%,rgba(214,211,207,.91) 32%,rgba(205,202,198,.63) 50%,rgba(193,190,187,.13) 73%,transparent 100%)}#${LAYER_ID} .vh8-product{filter:drop-shadow(0 12px 18px rgba(34,31,29,.20))}}
    `;
    document.head.appendChild(s)
  }

  function parts(){
    const s=document.querySelector('.hero .stage,.stage');
    if(!s)return {};
    const h=s.closest('.hero')||s.closest('section')||s.parentElement;
    return {h,s}
  }

  function removeFallbacks(){
    for(const id of FALLBACK_IDS)document.getElementById(id)?.remove();
    document.querySelectorAll('.hero.vyrdict-current-static,.hero.vyrdict-fullwidth-motion').forEach(h=>h.classList.remove('vyrdict-current-static','vyrdict-fullwidth-motion'));
    if(document.documentElement.dataset.vyrdictCurrentHero==='static')delete document.documentElement.dataset.vyrdictCurrentHero;
  }

  function applyLayerGeometry(l){
    if(!l)return;
    const w=Math.max(326,window.innerWidth||document.documentElement.clientWidth||1200)+6;
    important(l,'display','block');important(l,'visibility','visible');important(l,'position','absolute');important(l,'z-index','1');
    important(l,'top','0px');important(l,'left','50%');important(l,'width',`${w}px`);important(l,'height',`${Math.max(MOBILE.matches?430:360,heroHeight)}px`);
    important(l,'transform','translateX(-50%)');important(l,'overflow','hidden');important(l,'pointer-events','none');
  }

  function ownsCurrent(){
    const {h,s}=parts(),l=document.getElementById(LAYER_ID);
    return !!h&&!!s&&h===hero&&s===stage&&hero?.isConnected&&stage?.isConnected&&hero.classList.contains('vyrdict-hero-v8')&&l?.parentElement===hero;
  }

  function syncHeight(){
    if(!hero?.isConnected||!stage?.isConnected)return;
    const hr=hero.getBoundingClientRect(),sr=stage.getBoundingClientRect();let bottom=sr.bottom;
    for(const el of hero.querySelectorAll('h1,form,input,.search,.actions,.cta,.hero-copy,.heroCopy')){
      const r=el.getBoundingClientRect();if(r.top<sr.bottom+100&&r.bottom>hr.top)bottom=Math.max(bottom,r.bottom);
    }
    heroHeight=Math.max(MOBILE.matches?430:360,Math.ceil(bottom-hr.top+28));
    hero.style.setProperty('--vyrdict-hero-h',`${heroHeight}px`);
    applyLayerGeometry(document.getElementById(LAYER_ID));
  }

  function layer(){
    removeFallbacks();
    document.getElementById(LAYER_ID)?.remove();
    const l=document.createElement('div');l.id=LAYER_ID;l.dataset.rev=MOTION_REV;hero.appendChild(l);applyLayerGeometry(l);return l;
  }

  function cutout(l,p,b){
    const lw=Math.max(326,window.innerWidth||document.documentElement.clientWidth||1200)+6;
    const lh=Math.max(MOBILE.matches?430:360,heroHeight);
    const d=document.createElement('div');d.className='vh8-product';
    important(d,'display','block');important(d,'visibility','visible');important(d,'position','absolute');
    important(d,'left',`${pct(b.l,lw)}px`);important(d,'top',`${pct(b.t,lh)}px`);
    important(d,'width',`${Math.max(48,pct(b.w,lw))}px`);important(d,'height',`${Math.max(72,pct(b.h,lh))}px`);
    important(d,'pointer-events','none');
    const i=document.createElement('img');i.src=p.image_url;i.alt='';i.setAttribute('aria-hidden','true');i.decoding='async';i.loading='eager';
    important(i,'display','block');important(i,'visibility','visible');important(i,'width','100%');important(i,'height','100%');important(i,'object-fit','contain');
    d.appendChild(i);l.appendChild(d);return d;
  }

  async function products(){
    const out=[],seen=new Set();
    try{
      const r=await fetch(FEED,{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();
      const all=[...(d.trending||[]),...(d.worth||[]),...(d.skip||[])];
      for(const p of all){const src=String(p?.image_url||''),key=String(p?.slug||src);if(/^https:\/\//i.test(src)&&!seen.has(key)){out.push(p);seen.add(key)}}
    }catch{}
    if(stage?.isConnected){
      [...stage.querySelectorAll('img')].forEach((i,n)=>{const src=i.currentSrc||i.src,key=`fallback-${src}`;if(/^https?:\/\//i.test(src)&&!seen.has(key)){out.push({slug:`fallback-${n}`,image_url:src});seen.add(key)}});
    }
    return out;
  }

  async function preload(ps){
    await Promise.all(ps.slice(0,10).map(p=>new Promise(resolve=>{const i=new Image();let done=0;const end=()=>{if(done)return;done=1;resolve()};i.onload=end;i.onerror=end;i.src=p.image_url;setTimeout(end,1800)})));
  }

  function staticScene(ps){
    const l=layer(),cfg=MOBILE.matches?
      [{l:'58%',t:'8%',w:'36%',h:'42%'},{l:'67%',t:'42%',w:'30%',h:'43%'},{l:'40%',t:'50%',w:'27%',h:'36%'},{l:'48%',t:'24%',w:'24%',h:'31%'}]:
      [{l:'67%',t:'8%',w:'25%',h:'45%'},{l:'73%',t:'45%',w:'22%',h:'43%'},{l:'48%',t:'50%',w:'22%',h:'37%'},{l:'54%',t:'18%',w:'19%',h:'32%'}];
    ps.slice(0,4).forEach((p,i)=>cutout(l,p,cfg[i]));
  }

  async function fall(ps,t){
    const use=ps.slice(0,MOBILE.matches?7:10);await preload(use);if(t!==token||!ownsCurrent())return;
    const l=layer(),spots=MOBILE.matches?[0,15,30,45,60,75,88]:[0,10,20,30,40,50,60,70,80,90];
    use.forEach((p,i)=>{const size=MOBILE.matches?20+(i%3)*3:11+(i%4)*2,el=cutout(l,p,{l:`${spots[i]}%`,t:`${10+(i%3)*24}%`,w:`${size}%`,h:MOBILE.matches?'31%':'36%'}),sx=(i%2?-18:18)+(i%3)*4,rot=i%2?22:-22;el.animate([{opacity:0,transform:`translate3d(${sx}vw,-72vh,0) rotate(${rot}deg) scale(.45)`,filter:'blur(7px)'},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)',filter:'blur(0)'}],{duration:850+(i%4)*90,delay:i*80,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})});
    await sleep(2300);if(t!==token)return;[...l.children].forEach((el,i)=>{const dir=i%2?-1:1;el.animate([{opacity:1,transform:'translate3d(0,0,0) scale(1)'},{opacity:0,transform:`translate3d(${dir*112}vw,${(i%3-1)*8}vh,0) rotate(${dir*18}deg) scale(.72)`,filter:'blur(5px)'}],{duration:680,delay:i*25,easing:'cubic-bezier(.55,0,.75,.1)',fill:'forwards'})});await sleep(850);
  }

  async function cross(ps,t){
    const use=ps.slice(2,8);await preload(use);if(t!==token||!ownsCurrent())return;
    const l=layer(),lanes=MOBILE.matches?[11,35,58,20,48,65]:[9,26,44,17,55,33];
    use.forEach((p,i)=>{const left=i%2===0,size=MOBILE.matches?27-(i%2)*3:18-(i%3)*2,el=cutout(l,p,{l:left?'-24%':'103%',t:`${lanes[i]}%`,w:`${size}%`,h:MOBILE.matches?'36%':'43%'}),travel=MOBILE.matches?134:126;el.animate([{opacity:0,transform:`translate3d(${left?-8:8}vw,0,0) rotate(${left?-12:12}deg) scale(.7)`},{opacity:1,transform:`translate3d(${left?travel*.58:-travel*.58}vw,0,0) rotate(0deg) scale(1.04)`,offset:.55},{opacity:0,transform:`translate3d(${left?travel:-travel}vw,0,0) rotate(${left?13:-13}deg) scale(.72)`}],{duration:3200,delay:i*330,easing:'cubic-bezier(.42,0,.2,1)',fill:'both'})});await sleep(4550);
  }

  async function spotlight(ps,t){
    const use=[ps[1],ps[5],ps[8]||ps[3]].filter(Boolean);await preload(use);if(t!==token||!ownsCurrent())return;
    const l=layer(),cfg=MOBILE.matches?[{l:'1%',t:'15%',w:'43%',h:'58%',from:'-76vw',to:'73vw'},{l:'29%',t:'20%',w:'45%',h:'59%',from:'84vw',to:'-78vw'},{l:'59%',t:'12%',w:'40%',h:'63%',from:'-88vw',to:'63vw'}]:[{l:'3%',t:'10%',w:'28%',h:'68%',from:'-52vw',to:'82vw'},{l:'35%',t:'16%',w:'30%',h:'66%',from:'72vw',to:'-78vw'},{l:'69%',t:'8%',w:'27%',h:'70%',from:'-82vw',to:'52vw'}];
    use.forEach((p,i)=>{const b=cfg[i],el=cutout(l,p,b);el.animate([{opacity:0,transform:`translate3d(${b.from},0,0) rotate(${i%2?-10:10}deg) scale(.62)`,filter:'blur(8px)'},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1.06)',offset:.35,filter:'blur(0)'},{opacity:1,transform:'translate3d(0,0,0) scale(1)',offset:.64},{opacity:0,transform:`translate3d(${b.to},0,0) rotate(${i%2?12:-12}deg) scale(.72)`,filter:'blur(5px)'}],{duration:3500,delay:i*700,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'})});await sleep(5250);
  }

  async function animate(ps,t){
    while(t===token&&home()&&!REDUCED.matches&&ownsCurrent()){
      await fall(ps,t);if(t!==token||!ownsCurrent())break;
      await cross(ps,t);if(t!==token||!ownsCurrent())break;
      await spotlight(ps,t);
    }
    if(t===token&&home()&&!ownsCurrent())scheduleRepair(40);
  }

  async function mount(attempt=0){
    if(!home()){cleanup();return}
    const p=parts();
    if(!p.s||!p.h){if(attempt<40)setTimeout(()=>mount(attempt+1),100);return}
    if(hero===p.h&&stage===p.s&&ownsCurrent()){removeFallbacks();syncHeight();return}
    if(mounting){scheduleRepair(100);return}
    mounting=true;
    try{
      token++;
      style();stage=p.s;hero=p.h;removeFallbacks();
      hero.classList.add('vyrdict-hero-v8');hero.dataset.vyrdictHeroVersion='10';
      syncHeight();requestAnimationFrame(syncHeight);
      const t=token,ps=await products();
      if(t!==token||!hero?.isConnected||!stage?.isConnected){scheduleRepair(60);return}
      if(ps.length<3){scheduleRepair(700);return}
      await preload(ps.slice(0,10));
      if(t!==token||!ownsCurrent()){scheduleRepair(60);return}
      if(REDUCED.matches||typeof Element.prototype.animate!=='function'){staticScene(ps);return}
      const priming=layer();
      ps.slice(0,Math.min(4,ps.length)).forEach((p,i)=>cutout(priming,p,{l:`${48+i*10}%`,t:`${12+(i%2)*35}%`,w:MOBILE.matches?'24%':'15%',h:MOBILE.matches?'31%':'34%'}));
      animate(ps,t);
    }finally{mounting=false}
  }

  function cleanup(){
    token++;clearTimeout(repairTimer);document.getElementById(LAYER_ID)?.remove();
    if(hero){hero.classList.remove('vyrdict-hero-v8');hero.removeAttribute('data-vyrdict-hero-version');hero.style.removeProperty('--vyrdict-hero-h')}
    hero=null;stage=null;
  }

  function scheduleRepair(delay=80){
    clearTimeout(repairTimer);repairTimer=setTimeout(()=>{
      if(!home()){cleanup();return}
      if(ownsCurrent()){removeFallbacks();syncHeight();return}
      mount();
    },delay);
  }

  function watch(){
    if(observer)return;const target=document.getElementById('app')||document.body;if(!target)return;
    observer=new MutationObserver(()=>{if(!home())return;if(ownsCurrent()){removeFallbacks();return}scheduleRepair(70)});
    observer.observe(target,{childList:true,subtree:true});
  }

  const boot=()=>{watch();mount()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(ownsCurrent())syncHeight();else scheduleRepair(20)},80)},{passive:true});
  addEventListener('pageshow',()=>scheduleRepair(20));
  addEventListener('popstate',()=>scheduleRepair(30));
  addEventListener('hashchange',()=>scheduleRepair(30));
  REDUCED.addEventListener?.('change',()=>{token++;document.getElementById(LAYER_ID)?.remove();scheduleRepair(20)});
})();
