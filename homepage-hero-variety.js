(()=>{
  if(window.__vyrdictFullWidthHeroV4)return;
  window.__vyrdictFullWidthHeroV4=1;

  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const MOBILE=matchMedia('(max-width:700px)');
  const STYLE_ID='vyrdict-full-width-hero-v4-style';
  const PICKS=[
    'owala-freesip','dji-osmo-pocket-3','sol-de-janeiro-cheirosa-62',
    'mfk-baccarat-rouge-540','longchamp-le-pliage','dyson-airwrap-id',
    'hatch-restore-3','rare-beauty-soft-pinch-liquid-blush','puma-speedcat-ballet',
    'ninja-slushi','lattafa-khamrah','keana-nadeshiko-rice-mask'
  ];

  let hero=null,stage=null,layer=null,runToken=0;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const onHome=()=>location.pathname==='/'||location.pathname==='';
  const catalog=()=>Array.isArray(window.__VYRDICT_BOOT_DATA?.p)?window.__VYRDICT_BOOT_DATA.p:[];
  const item=slug=>catalog().find(p=>p?.slug===slug&&p.image_url&&/^https:\/\//i.test(String(p.image_url)))||null;

  function addStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
      .hero.vyrdict-fullwidth-motion{
        position:relative!important;
        isolation:isolate!important;
        overflow:hidden!important;
        background:transparent!important;
      }
      .hero.vyrdict-fullwidth-motion::before{
        content:'';
        position:absolute;
        z-index:0;
        inset:0 auto 0 50%;
        width:100vw;
        transform:translateX(-50%);
        pointer-events:none;
        background:
          radial-gradient(ellipse at 78% 38%,rgba(52,49,47,.22),transparent 37%),
          radial-gradient(ellipse at 42% 72%,rgba(255,255,255,.20),transparent 34%),
          linear-gradient(108deg,#d8d5d1 0%,#d0cdca 33%,#c3c0bd 67%,#b7b4b1 100%);
      }
      .hero.vyrdict-fullwidth-motion::after{
        content:'';
        position:absolute;
        z-index:2;
        inset:0 auto 0 50%;
        width:100vw;
        transform:translateX(-50%);
        pointer-events:none;
        background:linear-gradient(90deg,
          rgba(218,215,211,.96) 0%,
          rgba(216,213,209,.93) 20%,
          rgba(211,208,204,.82) 36%,
          rgba(205,202,198,.48) 48%,
          rgba(194,191,187,.10) 62%,
          rgba(188,185,182,0) 74%);
      }
      .hero.vyrdict-fullwidth-motion>:not(.vyrdict-fullwidth-product-layer){
        position:relative;
        z-index:3;
      }
      .hero.vyrdict-fullwidth-motion .stage{
        visibility:hidden!important;
        opacity:0!important;
        pointer-events:none!important;
      }
      .hero.vyrdict-fullwidth-motion .vyrdict-fullwidth-product-layer{
        position:absolute;
        z-index:1;
        inset:0 auto 0 50%;
        width:100vw;
        transform:translateX(-50%);
        overflow:hidden;
        pointer-events:none;
      }
      .vyrdict-fullwidth-product-layer .vyrdict-product-cutout{
        position:absolute;
        display:block;
        pointer-events:none;
        transform-origin:center;
        will-change:transform,opacity,filter;
        filter:drop-shadow(0 18px 24px rgba(34,31,29,.24));
      }
      .vyrdict-fullwidth-product-layer .vyrdict-product-cutout img{
        display:block;
        width:100%;
        height:100%;
        object-fit:contain;
        object-position:center;
        background:transparent!important;
        padding:0!important;
        border:0!important;
        box-shadow:none!important;
        mix-blend-mode:normal!important;
        transform:none!important;
      }
      @media(max-width:700px){
        .hero.vyrdict-fullwidth-motion::after{
          background:linear-gradient(90deg,
            rgba(218,215,211,.95) 0%,
            rgba(214,211,207,.88) 34%,
            rgba(205,202,198,.58) 51%,
            rgba(193,190,187,.10) 74%,
            transparent 100%);
        }
        .vyrdict-fullwidth-product-layer .vyrdict-product-cutout{
          filter:drop-shadow(0 12px 18px rgba(34,31,29,.20));
        }
      }
      @media(prefers-reduced-motion:reduce){
        .hero.vyrdict-fullwidth-motion .vyrdict-fullwidth-product-layer{display:none!important}
        .hero.vyrdict-fullwidth-motion .stage{visibility:visible!important;opacity:1!important}
      }
    `;
  }

  function clearLayer(){
    runToken++;
    layer?.remove();
    layer=null;
  }

  function ensureLayer(){
    layer?.remove();
    layer=document.createElement('div');
    layer.className='vyrdict-fullwidth-product-layer';
    hero.appendChild(layer);
    return layer;
  }

  function makeCutout(p,box){
    const wrap=document.createElement('div');
    wrap.className='vyrdict-product-cutout';
    Object.assign(wrap.style,{left:box.left,top:box.top,width:box.width,height:box.height});
    const img=document.createElement('img');
    img.src=p.image_url;
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.decoding='async';
    img.loading='eager';
    wrap.appendChild(img);
    layer.appendChild(wrap);
    return wrap;
  }

  async function preload(products){
    await Promise.all(products.map(p=>new Promise(resolve=>{
      const i=new Image();let done=false;
      const finish=()=>{if(done)return;done=true;resolve()};
      i.onload=finish;i.onerror=finish;i.src=p.image_url;setTimeout(finish,2500);
    })));
  }

  function pool(){
    const chosen=PICKS.map(item).filter(Boolean);
    if(chosen.length>=8)return chosen;
    const more=catalog().filter(p=>p?.image_url&&/^https:\/\//i.test(String(p.image_url))&&Number(p.viral_score)>=90&&Number(p.worth_score)>=70);
    const seen=new Set(chosen.map(p=>p.slug));
    for(const p of more){if(chosen.length>=14)break;if(!seen.has(p.slug)){chosen.push(p);seen.add(p.slug)}}
    return chosen;
  }

  async function fallingScene(products,token){
    ensureLayer();
    const count=MOBILE.matches?7:10;
    const use=products.slice(0,count);
    await preload(use);
    if(token!==runToken)return;
    const spots=MOBILE.matches?
      [2,16,30,44,58,72,86]:[0,10,20,30,40,50,60,70,80,90];
    use.forEach((p,i)=>{
      const size=MOBILE.matches?18+(i%3)*3:11+(i%4)*2;
      const top=12+(i%3)*23;
      const el=makeCutout(p,{left:`${spots[i]}%`,top:`${top}%`,width:`${size}%`,height:`${MOBILE.matches?30:36}%`});
      const startX=(i%2===0?-18:18)+(i%3)*5;
      const rot=i%2===0?-22:22;
      el.animate([
        {opacity:0,transform:`translate3d(${startX}vw,-78vh,0) rotate(${rot}deg) scale(.45)`,filter:'blur(7px)'},
        {opacity:1,transform:`translate3d(${i%2?2:-2}vw,2vh,0) rotate(${rot/4}deg) scale(1.06)`,offset:.82},
        {opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)',filter:'blur(0)'}
      ],{duration:900+(i%4)*90,delay:i*85,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    });
    await sleep(2350);
    if(token!==runToken)return;
    [...layer.children].forEach((el,i)=>{
      const dir=i%2===0?-1:1;
      el.animate([
        {opacity:1,transform:'translate3d(0,0,0) scale(1)'},
        {opacity:0,transform:`translate3d(${dir*115}vw,${(i%3-1)*8}vh,0) rotate(${dir*18}deg) scale(.7)`,filter:'blur(5px)'}
      ],{duration:680,delay:i*28,easing:'cubic-bezier(.55,0,.75,.1)',fill:'forwards'});
    });
    await sleep(850);
  }

  async function crossScreenScene(products,token){
    ensureLayer();
    const use=products.slice(2,8);
    await preload(use);
    if(token!==runToken)return;
    const lanes=MOBILE.matches?[15,37,59,22,49,66]:[10,26,45,18,54,34];
    use.forEach((p,i)=>{
      const fromLeft=i%2===0;
      const size=MOBILE.matches?26-(i%2)*3:18-(i%3)*2;
      const el=makeCutout(p,{left:fromLeft?'-22%':'102%',top:`${lanes[i]}%`,width:`${size}%`,height:`${MOBILE.matches?35:43}%`});
      const travel=MOBILE.matches?132:126;
      el.animate([
        {opacity:0,transform:`translate3d(${fromLeft?-8:8}vw,0,0) rotate(${fromLeft?-12:12}deg) scale(.7)`},
        {opacity:1,transform:`translate3d(${fromLeft?travel*.48:-travel*.48}vw,0,0) rotate(${fromLeft?3:-3}deg) scale(1.03)`,offset:.42},
        {opacity:1,transform:`translate3d(${fromLeft?travel*.66:-travel*.66}vw,0,0) rotate(0deg) scale(1.05)`,offset:.62},
        {opacity:0,transform:`translate3d(${fromLeft?travel:-travel}vw,0,0) rotate(${fromLeft?13:-13}deg) scale(.72)`}
      ],{duration:3300,delay:i*360,easing:'cubic-bezier(.42,0,.2,1)',fill:'both'});
    });
    await sleep(4750);
  }

  async function spotlightScene(products,token){
    ensureLayer();
    const use=[products[1],products[5],products[8]||products[3]].filter(Boolean);
    await preload(use);
    if(token!==runToken)return;
    const cfg=MOBILE.matches?
      [
        {left:'2%',top:'16%',width:'42%',height:'58%',from:'-72vw',to:'70vw'},
        {left:'30%',top:'22%',width:'44%',height:'58%',from:'82vw',to:'-74vw'},
        {left:'58%',top:'13%',width:'39%',height:'62%',from:'-85vw',to:'60vw'}
      ]:[
        {left:'3%',top:'10%',width:'28%',height:'68%',from:'-52vw',to:'82vw'},
        {left:'35%',top:'16%',width:'30%',height:'66%',from:'72vw',to:'-78vw'},
        {left:'69%',top:'8%',width:'27%',height:'70%',from:'-82vw',to:'52vw'}
      ];
    use.forEach((p,i)=>{
      const b=cfg[i],el=makeCutout(p,b);
      el.animate([
        {opacity:0,transform:`translate3d(${b.from},0,0) rotate(${i%2?-10:10}deg) scale(.62)`,filter:'blur(8px)'},
        {opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1.08)',offset:.35,filter:'blur(0)'},
        {opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)',offset:.64},
        {opacity:0,transform:`translate3d(${b.to},0,0) rotate(${i%2?12:-12}deg) scale(.72)`,filter:'blur(5px)'}
      ],{duration:3600,delay:i*720,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
    });
    await sleep(5400);
  }

  async function loop(token){
    const products=pool();
    if(products.length<6)return;
    while(token===runToken&&onHome()&&!REDUCED.matches){
      await fallingScene(products,token);
      if(token!==runToken)break;
      await crossScreenScene(products,token);
      if(token!==runToken)break;
      await spotlightScene(products,token);
    }
  }

  function stop(){
    clearLayer();
    hero?.classList.remove('vyrdict-fullwidth-motion');
  }

  function init(attempt=0){
    if(!onHome()||REDUCED.matches){stop();return}
    addStyle();
    stage=document.querySelector('.stage');
    if(!stage){if(attempt<30)setTimeout(()=>init(attempt+1),120);return}
    hero=stage.closest('.hero')||stage.closest('section')||stage.parentElement;
    if(!hero){if(attempt<30)setTimeout(()=>init(attempt+1),120);return}
    if(catalog().length<6){if(attempt<30)setTimeout(()=>init(attempt+1),160);return}
    hero.classList.remove('vyrdict-wide-story','vyrdict-motion-stage','vyrdict-story-stage');
    hero.classList.add('vyrdict-fullwidth-motion');
    clearLayer();
    const token=runToken;
    loop(token);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>init(),{once:true});else init();
  addEventListener('popstate',()=>setTimeout(()=>init(),50));
  addEventListener('hashchange',()=>setTimeout(()=>init(),50));
  REDUCED.addEventListener?.('change',()=>setTimeout(()=>init(),20));
})();
