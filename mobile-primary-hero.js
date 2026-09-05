(()=>{
  if(window.__vyrdictMobilePrimaryHeroV1)return;
  window.__vyrdictMobilePrimaryHeroV1=1;
  const MOBILE=matchMedia('(max-width:700px)');
  if(!MOBILE.matches)return;
  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const STYLE_ID='vyrdict-mobile-primary-hero-style';
  const LAYER_ID='vyrdict-mobile-primary-hero';
  let retry=0,observer=null;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      @media(max-width:700px){
        .hero.vyrdict-mobile-primary{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:linear-gradient(108deg,#d8d5d1 0%,#d0cdca 35%,#c4c1be 68%,#b9b6b3 100%)!important}
        .hero.vyrdict-mobile-primary .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
        .hero.vyrdict-mobile-primary::after{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(90deg,rgba(218,215,211,.98) 0%,rgba(216,213,209,.95) 28%,rgba(210,207,203,.78) 44%,rgba(202,199,195,.34) 62%,rgba(191,188,184,.04) 82%)}
        .hero.vyrdict-mobile-primary>:not(#${LAYER_ID}):not(.section){position:relative;z-index:3}
        #${LAYER_ID}{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none;transform:translate3d(0,0,0);animation:vyrdictMobileGroup 17s ease-in-out infinite alternate;will-change:transform}
        #${LAYER_ID} .vmp-item{position:absolute;display:block;opacity:.96;filter:drop-shadow(0 14px 18px rgba(34,31,29,.18));will-change:transform;animation:vyrdictMobileFloat 7.5s ease-in-out infinite alternate}
        #${LAYER_ID} .vmp-item:nth-child(2){animation-duration:8.4s;animation-delay:-1.7s}
        #${LAYER_ID} .vmp-item:nth-child(3){animation-duration:6.9s;animation-delay:-2.8s}
        #${LAYER_ID} .vmp-item:nth-child(4){animation-duration:9.1s;animation-delay:-3.2s}
        #${LAYER_ID} .vmp-item:nth-child(5){animation-duration:7.9s;animation-delay:-4.1s}
        #${LAYER_ID} .vmp-item:nth-child(6){animation-duration:8.8s;animation-delay:-5.2s}
        #${LAYER_ID} img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:transparent!important;border:0!important;box-shadow:none!important}
        @keyframes vyrdictMobileGroup{0%{transform:translate3d(-2.5vw,0,0) scale(1)}100%{transform:translate3d(3vw,-1.8vh,0) scale(1.025)}}
        @keyframes vyrdictMobileFloat{0%{transform:translate3d(-7px,-4px,0) rotate(-2deg)}100%{transform:translate3d(8px,9px,0) rotate(2.5deg)}}
        @media(prefers-reduced-motion:reduce){#${LAYER_ID}{animation:none!important}#${LAYER_ID} .vmp-item{animation:none!important}}
      }
    `;
    document.head.appendChild(s)
  }

  function hero(){
    const stage=document.querySelector('.hero .stage,.stage');
    return stage?.closest('.hero')||document.querySelector('.hero');
  }

  function cleanProducts(data){
    const all=[...(data?.trending||[]),...(data?.worth||[]),...(data?.skip||[])],out=[],seen=new Set();
    for(const p of all){
      const src=String(p?.image_url||'');
      const key=String(p?.slug||src);
      if(/^https:\/\//i.test(src)&&!seen.has(key)){out.push({src,key});seen.add(key)}
      if(out.length>=6)break;
    }
    return out;
  }

  function render(h,ps){
    if(!h||ps.length<4)return false;
    addStyle();
    h.classList.remove('vyrdict-hero-v8','vyrdict-current-static','vyrdict-fullwidth-motion');
    h.classList.add('vyrdict-mobile-primary');
    document.getElementById('vyrdict-hero-v8-layer')?.remove();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.getElementById('vyrdict-mobile-motion-layer')?.remove();
    document.getElementById(LAYER_ID)?.remove();
    const l=document.createElement('div');l.id=LAYER_ID;
    const boxes=[
      {l:'66%',t:'14%',w:'29%',h:'27%'},
      {l:'59%',t:'36%',w:'37%',h:'31%'},
      {l:'42%',t:'61%',w:'31%',h:'24%'},
      {l:'72%',t:'66%',w:'27%',h:'22%'},
      {l:'48%',t:'26%',w:'25%',h:'22%'},
      {l:'77%',t:'48%',w:'20%',h:'18%'}
    ];
    ps.slice(0,6).forEach((p,i)=>{
      const b=boxes[i],d=document.createElement('div');d.className='vmp-item';
      Object.assign(d.style,{left:b.l,top:b.t,width:b.w,height:b.h});
      const img=document.createElement('img');img.src=p.src;img.alt='';img.decoding='async';img.loading='eager';img.setAttribute('aria-hidden','true');
      d.appendChild(img);l.appendChild(d)
    });
    h.appendChild(l);
    document.documentElement.dataset.vyrdictMobileHero='primary';
    document.documentElement.classList.add('vyrdict-ready');
    requestAnimationFrame(()=>document.getElementById('vyrdict-bundle-loader')?.remove());
    return true;
  }

  async function mount(){
    if(!HOME()||!MOBILE.matches)return;
    const h=hero();if(!h){if(retry++<35)setTimeout(mount,100);return}
    try{
      const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),1800);
      const r=await fetch(FEED,{cache:'no-store',signal:ctrl.signal});clearTimeout(timer);
      if(!r.ok)throw 0;
      const ps=cleanProducts(await r.json());
      if(render(h,ps))return;
    }catch{}
    if(retry++<8)setTimeout(mount,650);
  }

  function watch(){
    if(observer)return;
    observer=new MutationObserver(()=>{
      if(!HOME()||document.getElementById(LAYER_ID))return;
      setTimeout(mount,60)
    });
    observer.observe(document.documentElement,{childList:true,subtree:true})
  }

  const start=()=>{addStyle();watch();setTimeout(mount,20);setTimeout(mount,250)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('pageshow',()=>setTimeout(mount,30));
  addEventListener('popstate',()=>setTimeout(mount,30));
  addEventListener('hashchange',()=>setTimeout(mount,30));
})();