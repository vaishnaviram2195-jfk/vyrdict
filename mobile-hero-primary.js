(()=>{
  if(window.__vyrdictMobileHeroPrimaryV1)return;
  window.__vyrdictMobileHeroPrimaryV1=1;

  const MOBILE=matchMedia('(max-width:700px)');
  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const STYLE_ID='vyrdict-mobile-hero-primary-style';
  const LAYER_ID='vyrdict-mobile-hero-primary-layer';
  let retryTimer=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      @media(max-width:700px){
        .hero.vyrdict-mobile-hero-primary{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:linear-gradient(108deg,#d8d5d1 0%,#d0cdca 34%,#c4c1be 68%,#b9b6b2 100%)!important}
        .hero.vyrdict-mobile-hero-primary::before{content:'';position:absolute!important;inset:0!important;z-index:2!important;pointer-events:none!important;background:linear-gradient(90deg,rgba(218,215,211,.97) 0%,rgba(216,213,209,.92) 34%,rgba(207,204,200,.62) 57%,rgba(196,193,189,.14) 82%,transparent 100%)!important}
        .hero.vyrdict-mobile-hero-primary>:not(#${LAYER_ID}):not(.stage){position:relative!important;z-index:3!important}
        .hero.vyrdict-mobile-hero-primary .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important;min-height:260px!important}
        #${LAYER_ID}{position:absolute!important;z-index:1!important;inset:0!important;overflow:hidden!important;pointer-events:none!important;contain:layout paint style!important}
        #${LAYER_ID} .vmhp-group{position:absolute!important;inset:0!important;animation:vmhpGroupDrift 16s ease-in-out infinite alternate!important;will-change:transform!important}
        #${LAYER_ID} .vmhp-product{position:absolute!important;display:block!important;transform-origin:center!important;filter:drop-shadow(0 13px 18px rgba(34,31,29,.20))!important;will-change:transform!important;animation:vmhpFloat 8s ease-in-out infinite alternate!important}
        #${LAYER_ID} .vmhp-product img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}
        #${LAYER_ID} .vmhp-product:nth-child(2){animation-duration:9.5s!important;animation-delay:-2.1s!important}
        #${LAYER_ID} .vmhp-product:nth-child(3){animation-duration:10.5s!important;animation-delay:-4.2s!important}
        #${LAYER_ID} .vmhp-product:nth-child(4){animation-duration:8.8s!important;animation-delay:-1.5s!important}
        #${LAYER_ID} .vmhp-product:nth-child(5){animation-duration:11.2s!important;animation-delay:-5.3s!important}
        #${LAYER_ID} .vmhp-product:nth-child(6){animation-duration:9.1s!important;animation-delay:-3.2s!important}
        @keyframes vmhpGroupDrift{0%{transform:translate3d(-1.5vw,-.8vh,0) scale(1)}100%{transform:translate3d(3vw,1.2vh,0) scale(1.025)}}
        @keyframes vmhpFloat{0%{transform:translate3d(0,-7px,0) rotate(-2deg)}100%{transform:translate3d(7px,9px,0) rotate(2deg)}}
        @media(prefers-reduced-motion:reduce){#${LAYER_ID} .vmhp-group,#${LAYER_ID} .vmhp-product{animation:none!important}}
      }
    `;
    document.head.appendChild(s);
  }

  function uniqueProducts(d){
    const all=[...(d?.trending||[]),...(d?.worth||[]),...(d?.skip||[])],out=[],seen=new Set(),brands=new Set();
    for(const p of all){
      const src=String(p?.image_url||'');
      const key=String(p?.slug||src);
      if(!/^https:\/\//i.test(src)||seen.has(key))continue;
      if(brands.has(String(p?.brand||'').toLowerCase())&&out.length<4)continue;
      out.push(p);seen.add(key);brands.add(String(p?.brand||'').toLowerCase());
      if(out.length>=6)break;
    }
    if(out.length<6){
      for(const p of all){
        const src=String(p?.image_url||''),key=String(p?.slug||src);
        if(/^https:\/\//i.test(src)&&!seen.has(key)){out.push(p);seen.add(key);if(out.length>=6)break}
      }
    }
    return out;
  }

  async function loadProducts(){
    const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),2200);
    try{
      const r=await fetch(FEED,{cache:'no-store',signal:ctrl.signal});
      if(!r.ok)throw new Error('feed '+r.status);
      return uniqueProducts(await r.json());
    }catch{return []}
    finally{clearTimeout(timer)}
  }

  function findHero(){
    return document.querySelector('.hero')||document.querySelector('#app .hero')||null;
  }

  function build(hero,products){
    if(!hero||products.length<3)return false;
    addStyle();
    hero.classList.remove('vyrdict-hero-v8','vyrdict-current-static','vyrdict-fullwidth-motion');
    hero.classList.add('vyrdict-mobile-hero-primary');
    hero.dataset.vyrdictHeroVersion='mobile-primary-1';
    document.getElementById('vyrdict-hero-v8-layer')?.remove();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.getElementById('vyrdict-mobile-motion-layer')?.remove();
    document.getElementById(LAYER_ID)?.remove();

    const layer=document.createElement('div');layer.id=LAYER_ID;
    const group=document.createElement('div');group.className='vmhp-group';layer.appendChild(group);
    const boxes=[
      {l:'63%',t:'7%',w:'31%',h:'24%'},
      {l:'69%',t:'29%',w:'28%',h:'24%'},
      {l:'48%',t:'49%',w:'32%',h:'23%'},
      {l:'72%',t:'61%',w:'28%',h:'21%'},
      {l:'43%',t:'70%',w:'27%',h:'20%'},
      {l:'66%',t:'82%',w:'29%',h:'17%'}
    ];
    products.slice(0,6).forEach((p,i)=>{
      const b=boxes[i],wrap=document.createElement('div');wrap.className='vmhp-product';
      Object.assign(wrap.style,{left:b.l,top:b.t,width:b.w,height:b.h});
      const img=document.createElement('img');img.src=p.image_url;img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';img.loading='eager';
      img.onerror=()=>{wrap.style.display='none'};
      wrap.appendChild(img);group.appendChild(wrap);
    });
    hero.appendChild(layer);
    document.documentElement.dataset.vyrdictCurrentHero='mobile-primary';
    document.documentElement.classList.add('vyrdict-ready');
    requestAnimationFrame(()=>document.getElementById('vyrdict-bundle-loader')?.remove());
    return true;
  }

  async function mount(attempt=0){
    if(!MOBILE.matches||!HOME())return;
    const hero=findHero();
    if(!hero){if(attempt<40)setTimeout(()=>mount(attempt+1),75);return}
    const products=await loadProducts();
    if(build(hero,products))return;
    if(attempt<8){clearTimeout(retryTimer);retryTimer=setTimeout(()=>mount(attempt+1),350)}
  }

  function boot(){
    if(!MOBILE.matches||!HOME())return;
    mount();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('pageshow',()=>setTimeout(boot,40));
  addEventListener('hashchange',()=>setTimeout(boot,40));
  addEventListener('popstate',()=>setTimeout(boot,40));
})();
