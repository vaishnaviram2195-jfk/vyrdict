(()=>{
  if(window.__vyrdictHeroMotionV1)return;
  window.__vyrdictHeroMotionV1=1;

  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const MOBILE=matchMedia('(max-width: 700px)');
  const STYLE_ID='vyrdict-hero-motion-style';
  const CATEGORY_ORDER=['Makeup','Tech','Perfume','Fashion','Shoes','Fitness','Beauty Tech','Skincare','Kitchen','Wellness','Pets','Home','Food & Drinks'];
  let timer=null,stage=null,photos=[],pool=[],poolCursor=0,slotCursor=0,hovered=false,focused=false,raf=0;

  function onHome(){return location.pathname==='/'||location.pathname===''}
  function addStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
      .stage.vyrdict-motion-stage{perspective:1000px;isolation:isolate;transform-style:preserve-3d}
      .stage.vyrdict-motion-stage .photo{cursor:pointer;will-change:translate,box-shadow;transition:translate .72s cubic-bezier(.2,.75,.2,1),box-shadow .45s ease,filter .45s ease;box-shadow:0 16px 38px rgba(54,42,34,.09)!important}
      .stage.vyrdict-motion-stage .photo:hover{box-shadow:0 24px 56px rgba(54,42,34,.15)!important;filter:saturate(1.025)}
      .stage.vyrdict-motion-stage .vyrdict-hero-link{width:100%;height:100%;display:grid;place-items:center;text-decoration:none;color:inherit;border-radius:inherit;overflow:hidden;animation:vyrdictHeroFloat var(--vhm-dur,7.4s) cubic-bezier(.45,.05,.55,.95) infinite alternate;transform-origin:center center;will-change:transform,opacity}
      .stage.vyrdict-motion-stage .photo img{display:block;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;padding:8px!important;background:#fff!important;transform:scale(.94)!important;transition:filter .45s ease}
      .stage.vyrdict-motion-stage .p1 .vyrdict-hero-link{--vhm-x:4px;--vhm-y:-8px;--vhm-r:.35deg;--vhm-dur:7.8s}
      .stage.vyrdict-motion-stage .p2 .vyrdict-hero-link{--vhm-x:-5px;--vhm-y:7px;--vhm-r:-.28deg;--vhm-dur:8.7s;animation-delay:-2.4s}
      .stage.vyrdict-motion-stage .p3 .vyrdict-hero-link{--vhm-x:3px;--vhm-y:-5px;--vhm-r:.24deg;--vhm-dur:7.2s;animation-delay:-1.1s}
      .stage.vyrdict-motion-stage .p4 .vyrdict-hero-link{--vhm-x:-3px;--vhm-y:6px;--vhm-r:-.32deg;--vhm-dur:9.1s;animation-delay:-3.2s}
      .stage.vyrdict-motion-stage .p5 .vyrdict-hero-link{--vhm-x:5px;--vhm-y:-6px;--vhm-r:.2deg;--vhm-dur:8.2s;animation-delay:-4.1s}
      .stage.vyrdict-motion-stage .p6 .vyrdict-hero-link{--vhm-x:-4px;--vhm-y:5px;--vhm-r:-.2deg;--vhm-dur:7.6s;animation-delay:-.7s}
      .stage.vyrdict-motion-stage .blob{will-change:transform,opacity;animation:vyrdictBlobBreath 10s ease-in-out infinite alternate}
      .stage.vyrdict-motion-stage .b2{animation-duration:13s;animation-delay:-4s}
      .stage.vyrdict-motion-stage .b3{animation-duration:16s;animation-delay:-7s}
      .stage.vyrdict-motion-stage .spark{animation:vyrdictSparkPulse 4.8s ease-in-out infinite;transform-origin:center}
      .stage.vyrdict-motion-stage:after{content:'';position:absolute;inset:0;z-index:25;pointer-events:none;border-radius:inherit;background:linear-gradient(112deg,transparent 0%,transparent 42%,rgba(255,255,255,.16) 49%,transparent 56%,transparent 100%);transform:translateX(-130%);animation:vyrdictHeroSheen 13s cubic-bezier(.4,0,.2,1) infinite}
      @keyframes vyrdictHeroFloat{0%{transform:translate3d(0,0,0) rotate(0) scale(1)}100%{transform:translate3d(var(--vhm-x),var(--vhm-y),0) rotate(var(--vhm-r)) scale(1.006)}}
      @keyframes vyrdictBlobBreath{0%{transform:translate3d(-2px,2px,0) scale(.985);opacity:.82}100%{transform:translate3d(5px,-4px,0) scale(1.035);opacity:1}}
      @keyframes vyrdictSparkPulse{0%,100%{transform:scale(.96) rotate(-3deg);opacity:.78}45%{transform:scale(1.08) rotate(3deg);opacity:1}65%{transform:scale(1.02) rotate(0);opacity:.92}}
      @keyframes vyrdictHeroSheen{0%,72%{transform:translateX(-130%);opacity:0}76%{opacity:.75}91%{transform:translateX(130%);opacity:.45}100%{transform:translateX(130%);opacity:0}}
      @media(max-width:700px){
        .stage.vyrdict-motion-stage .photo{will-change:transform;box-shadow:0 12px 28px rgba(54,42,34,.08)!important}
        .stage.vyrdict-motion-stage .vyrdict-hero-link{animation-duration:10s}
        .stage.vyrdict-motion-stage .p1 .vyrdict-hero-link,.stage.vyrdict-motion-stage .p2 .vyrdict-hero-link,.stage.vyrdict-motion-stage .p3 .vyrdict-hero-link,.stage.vyrdict-motion-stage .p4 .vyrdict-hero-link,.stage.vyrdict-motion-stage .p5 .vyrdict-hero-link,.stage.vyrdict-motion-stage .p6 .vyrdict-hero-link{--vhm-x:2px;--vhm-y:-3px;--vhm-r:.12deg}
        .stage.vyrdict-motion-stage:after{animation-duration:17s}
      }
      @media(prefers-reduced-motion:reduce){
        .stage.vyrdict-motion-stage .photo,.stage.vyrdict-motion-stage .vyrdict-hero-link,.stage.vyrdict-motion-stage .blob,.stage.vyrdict-motion-stage .spark{animation:none!important;transition:none!important;translate:0 0!important}
        .stage.vyrdict-motion-stage:after{display:none!important}
      }
    `;
  }

  function buildPool(){
    const rows=Array.isArray(window.__VYRDICT_BOOT_DATA?.p)?window.__VYRDICT_BOOT_DATA.p:[];
    const ok=rows.filter(p=>p&&p.slug&&p.image_url&&/^https:\/\//i.test(String(p.image_url))&&Number(p.viral_score)>=85&&Number(p.worth_score)>=65);
    const chosen=[],used=new Set();
    for(const category of CATEGORY_ORDER){
      const p=ok.find(x=>x.category===category&&!used.has(x.slug));
      if(p){chosen.push(p);used.add(p.slug)}
    }
    for(const p of ok){if(chosen.length>=18)break;if(!used.has(p.slug)){chosen.push(p);used.add(p.slug)}}
    return chosen;
  }

  function linkify(card,index){
    let a=card.querySelector(':scope > .vyrdict-hero-link');
    let img=card.querySelector('img');
    if(!img)return null;
    if(!a){
      a=document.createElement('a');
      a.className='vyrdict-hero-link';
      a.setAttribute('aria-label',img.alt?`View ${img.alt} on VYRDICT`:'View product on VYRDICT');
      img.parentNode.insertBefore(a,img);a.appendChild(img);
    }
    card.dataset.vyrdictMotionSlot=String(index+1);
    return {card,a,img};
  }

  function preload(src){return new Promise(resolve=>{const i=new Image();let done=false;const end=ok=>{if(done)return;done=true;resolve(ok)};i.onload=()=>end(true);i.onerror=()=>end(false);i.src=src;setTimeout(()=>end(false),4500)})}

  async function setItem(slot,item,animate=true){
    if(!slot||!item||slot.card.dataset.vyrdictProduct===item.slug)return false;
    const src=String(item.image_url||'');if(!src)return false;
    if(!(await preload(src)))return false;
    const change=()=>{
      slot.img.src=src;slot.img.removeAttribute('srcset');slot.img.alt=`${item.brand||''} ${item.name||''}`.trim();slot.img.loading='eager';slot.img.decoding='async';
      slot.a.href=`/product/${encodeURIComponent(item.slug)}/`;slot.a.title=`${item.brand||''} ${item.name||''} · Viral ${item.viral_score} · Worth ${item.worth_score}`.trim();slot.a.setAttribute('aria-label',`View ${slot.img.alt} on VYRDICT`);slot.card.dataset.vyrdictProduct=item.slug;
    };
    if(!animate||REDUCED.matches||!slot.a.animate){change();return true}
    const out=slot.a.animate([{opacity:1,filter:'blur(0)',transform:'translate3d(0,0,0) scale(1)'},{opacity:0,filter:'blur(3px)',transform:'translate3d(0,8px,0) scale(.965)'}],{duration:310,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
    try{await out.finished}catch{}
    out.cancel();change();
    slot.a.animate([{opacity:0,filter:'blur(3px)',transform:'translate3d(0,-7px,0) scale(.97)'},{opacity:1,filter:'blur(0)',transform:'translate3d(0,0,0) scale(1)'}],{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});
    return true;
  }

  function nextItem(){
    if(pool.length<=photos.length)return null;
    const visible=new Set(photos.map(s=>s.card.dataset.vyrdictProduct).filter(Boolean));
    for(let n=0;n<pool.length;n++){
      const item=pool[poolCursor%pool.length];poolCursor=(poolCursor+1)%pool.length;
      if(!visible.has(item.slug))return item;
    }
    return null;
  }

  async function tick(){
    if(document.hidden||hovered||focused||REDUCED.matches||!onHome())return;
    const slot=photos[slotCursor%photos.length];slotCursor=(slotCursor+1)%photos.length;
    const item=nextItem();if(item)await setItem(slot,item,true);
  }

  function startTimer(){
    if(timer){clearInterval(timer);timer=null}
    if(REDUCED.matches||!pool.length||pool.length<=photos.length)return;
    timer=setInterval(tick,MOBILE.matches?5200:3900);
  }

  function parallax(e){
    if(REDUCED.matches||MOBILE.matches||!stage)return;
    const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>photos.forEach((s,i)=>{const depth=[11,15,8,7,9,12][i]||8;s.card.style.translate=`${(x*depth).toFixed(2)}px ${(y*depth).toFixed(2)}px`}));
  }
  function resetParallax(){if(raf)cancelAnimationFrame(raf);photos.forEach(s=>s.card.style.translate='0 0')}

  async function initialize(){
    if(!onHome())return false;
    addStyle();stage=document.querySelector('.stage');if(!stage)return false;
    const cards=[1,2,3,4,5,6].map(n=>stage.querySelector(`.p${n}`)).filter(Boolean);if(cards.length<3)return false;
    stage.classList.add('vyrdict-motion-stage');photos=cards.map(linkify).filter(Boolean);
    pool=buildPool();if(!pool.length){setTimeout(initialize,350);return true}
    const first=pool.slice(0,photos.length);await Promise.all(photos.map((slot,i)=>first[i]?setItem(slot,first[i],false):Promise.resolve(false)));
    poolCursor=photos.length%pool.length;
    if(!stage.dataset.vyrdictMotionBound){
      stage.dataset.vyrdictMotionBound='1';
      stage.addEventListener('pointerenter',()=>{hovered=true},{passive:true});stage.addEventListener('pointerleave',()=>{hovered=false;resetParallax()},{passive:true});stage.addEventListener('pointermove',parallax,{passive:true});
      stage.addEventListener('focusin',()=>{focused=true});stage.addEventListener('focusout',()=>{focused=false});
    }
    startTimer();return true;
  }

  function boot(attempt=0){if(!onHome()){if(timer){clearInterval(timer);timer=null}return}initialize().then(ok=>{if(!ok&&attempt<24)setTimeout(()=>boot(attempt+1),120)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(()=>boot(),30));addEventListener('hashchange',()=>setTimeout(()=>boot(),30));
  REDUCED.addEventListener?.('change',()=>{resetParallax();startTimer()});
  MOBILE.addEventListener?.('change',()=>{resetParallax();startTimer()});
})();
