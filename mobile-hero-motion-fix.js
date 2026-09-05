(()=>{
  if(window.__vyrdictMobileHeroMotionFixV1)return;
  window.__vyrdictMobileHeroMotionFixV1=1;

  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const MOBILE=matchMedia('(max-width:700px)');
  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const STYLE_ID='vyrdict-mobile-hero-motion-fix-style';
  const LAYER_ID='vyrdict-mobile-motion-layer';
  let observer=null,timer=0;

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .hero.vyrdict-mobile-motion-fallback{position:relative!important;isolation:isolate!important;overflow:visible!important;background:transparent!important}
      .hero.vyrdict-mobile-motion-fallback .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #${LAYER_ID}{position:absolute;z-index:1;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-static-hero-h,var(--vyrdict-hero-h,520px));transform:translateX(-50%);overflow:hidden;pointer-events:none}
      #${LAYER_ID} .vmf-product{position:absolute;display:block;pointer-events:none;transform-origin:center;will-change:transform,opacity;filter:drop-shadow(0 12px 18px rgba(34,31,29,.20));animation-timing-function:cubic-bezier(.45,0,.2,1);animation-iteration-count:infinite;animation-direction:alternate}
      #${LAYER_ID} .vmf-product img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:transparent!important;border:0!important;box-shadow:none!important}
      #${LAYER_ID} .vmf-product:nth-child(1){animation-name:vyrdict-vmf-a;animation-duration:5.6s}
      #${LAYER_ID} .vmf-product:nth-child(2){animation-name:vyrdict-vmf-b;animation-duration:6.2s;animation-delay:-1.4s}
      #${LAYER_ID} .vmf-product:nth-child(3){animation-name:vyrdict-vmf-c;animation-duration:5.9s;animation-delay:-2.2s}
      #${LAYER_ID} .vmf-product:nth-child(4){animation-name:vyrdict-vmf-d;animation-duration:6.5s;animation-delay:-.8s}
      #vyrdict-hero-v8-layer.vyrdict-mobile-cohesive-motion{animation:vyrdict-vmf-group 6.8s ease-in-out infinite alternate;will-change:transform}
      @keyframes vyrdict-vmf-group{0%{transform:translateX(-50%) translate3d(-6px,0,0)}50%{transform:translateX(-50%) translate3d(7px,-7px,0)}100%{transform:translateX(-50%) translate3d(0,8px,0)}}
      @keyframes vyrdict-vmf-a{0%{transform:translate3d(-5vw,-2vh,0) rotate(-5deg) scale(.96)}45%{transform:translate3d(7vw,8vh,0) rotate(3deg) scale(1.04)}100%{transform:translate3d(-2vw,18vh,0) rotate(-2deg) scale(.98)}}
      @keyframes vyrdict-vmf-b{0%{transform:translate3d(6vw,8vh,0) rotate(4deg) scale(.98)}48%{transform:translate3d(-9vw,-3vh,0) rotate(-4deg) scale(1.05)}100%{transform:translate3d(-2vw,-14vh,0) rotate(2deg) scale(.97)}}
      @keyframes vyrdict-vmf-c{0%{transform:translate3d(-7vw,5vh,0) rotate(-4deg) scale(1)}50%{transform:translate3d(9vw,-8vh,0) rotate(4deg) scale(.95)}100%{transform:translate3d(3vw,-17vh,0) rotate(-1deg) scale(1.04)}}
      @keyframes vyrdict-vmf-d{0%{transform:translate3d(5vw,-5vh,0) rotate(3deg) scale(.96)}50%{transform:translate3d(-8vw,9vh,0) rotate(-3deg) scale(1.03)}100%{transform:translate3d(4vw,16vh,0) rotate(2deg) scale(.99)}}
      @media(prefers-reduced-motion:reduce){#${LAYER_ID} .vmf-product,#vyrdict-hero-v8-layer.vyrdict-mobile-cohesive-motion{animation:none!important}}
    `;document.head.appendChild(s)
  }

  function heroParts(){
    const stage=document.querySelector('.hero .stage,.stage');if(!stage)return {};
    return {stage,hero:stage.closest('.hero')||stage.closest('section')||stage.parentElement}
  }

  function collect(stage){
    const out=[],seen=new Set();
    const push=src=>{src=String(src||'');if(/^https?:\/\//i.test(src)&&!seen.has(src)){seen.add(src);out.push(src)}};
    document.querySelectorAll('#vyrdict-mobile-current-static-layer img').forEach(i=>push(i.currentSrc||i.src));
    stage?.querySelectorAll('img').forEach(i=>push(i.currentSrc||i.src));
    try{(window.__VYRDICT_BOOT_DATA?.p||[]).forEach(p=>push(p?.image_url))}catch{}
    return out
  }

  function cleanupFallback(){
    document.getElementById(LAYER_ID)?.remove();
    const {hero}=heroParts();
    if(hero)hero.classList.remove('vyrdict-mobile-motion-fallback');
    if(document.documentElement.dataset.vyrdictCurrentHero==='motion')delete document.documentElement.dataset.vyrdictCurrentHero
  }

  function enhanceAnimated(){
    const layer=document.getElementById('vyrdict-hero-v8-layer');
    const ready=!!document.querySelector('.hero.vyrdict-hero-v8')&&!!layer&&layer.querySelectorAll('.vh8-product').length>=3;
    if(!ready)return false;
    cleanupFallback();
    if(!REDUCED.matches)layer.classList.add('vyrdict-mobile-cohesive-motion');
    document.documentElement.classList.add('vyrdict-ready');
    requestAnimationFrame(()=>document.getElementById('vyrdict-bundle-loader')?.remove());
    return true
  }

  function mountMotion(){
    if(!HOME()||!MOBILE.matches||enhanceAnimated())return false;
    const {hero,stage}=heroParts();if(!hero||!stage)return false;
    const imgs=collect(stage);if(imgs.length<3)return false;
    style();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    hero.classList.remove('vyrdict-current-static');
    hero.classList.add('vyrdict-mobile-motion-fallback');
    document.getElementById(LAYER_ID)?.remove();
    const layer=document.createElement('div');layer.id=LAYER_ID;hero.appendChild(layer);
    const boxes=[
      {l:'60%',t:'8%',w:'34%',h:'38%'},
      {l:'68%',t:'40%',w:'29%',h:'40%'},
      {l:'43%',t:'54%',w:'27%',h:'34%'},
      {l:'51%',t:'26%',w:'23%',h:'29%'}
    ];
    imgs.slice(0,4).forEach((src,i)=>{const b=boxes[i],d=document.createElement('div');d.className='vmf-product';Object.assign(d.style,{left:b.l,top:b.t,width:b.w,height:b.h});const img=document.createElement('img');img.src=src;img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';img.loading='eager';d.appendChild(img);layer.appendChild(d)});
    document.documentElement.dataset.vyrdictCurrentHero='motion';
    document.documentElement.classList.add('vyrdict-ready');
    requestAnimationFrame(()=>document.getElementById('vyrdict-bundle-loader')?.remove());
    return true
  }

  function tick(){
    clearTimeout(timer);
    if(!HOME()||!MOBILE.matches){cleanupFallback();return}
    if(enhanceAnimated())return;
    mountMotion();
    timer=setTimeout(tick,180)
  }

  function watch(){
    if(observer)return;
    const target=document.getElementById('app')||document.body;if(!target)return;
    observer=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(tick,35)});
    observer.observe(target,{childList:true,subtree:true})
  }

  const start=()=>{style();watch();setTimeout(tick,60);setTimeout(tick,240);setTimeout(tick,700)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',()=>setTimeout(tick,40));
  addEventListener('popstate',()=>setTimeout(tick,40));
  addEventListener('hashchange',()=>setTimeout(tick,40));
  addEventListener('resize',()=>{clearTimeout(timer);timer=setTimeout(tick,100)},{passive:true});
})();
