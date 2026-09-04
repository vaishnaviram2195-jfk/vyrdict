(()=>{
  if(window.__vyrdictHeroStoryV3)return;
  window.__vyrdictHeroStoryV3=1;

  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const MOBILE=matchMedia('(max-width:700px)');
  const STYLE_ID='vyrdict-hero-story-wide-style';
  let stage=null,hero=null,layer=null,timer=null,sceneToken=0;

  const SCATTER=['owala-freesip','mfk-baccarat-rouge-540','sol-de-janeiro-cheirosa-62','dji-osmo-pocket-3','ryse-loaded-protein','longchamp-le-pliage','fruit-riot-sour-grapes','hydrojug-traveler'];
  const SWEEP=['dyson-airwrap-id','dji-osmo-pocket-3','longchamp-le-pliage','sol-de-janeiro-cheirosa-62'];
  const RETURN=['puma-speedcat-ballet','rare-beauty-soft-pinch-liquid-blush','ninja-slushi','mfk-baccarat-rouge-540'];

  function onHome(){return location.pathname==='/'||location.pathname===''}
  function catalog(){return Array.isArray(window.__VYRDICT_BOOT_DATA?.p)?window.__VYRDICT_BOOT_DATA.p:[]}
  function item(slug){return catalog().find(p=>p?.slug===slug&&p.image_url&&/^https:\/\//i.test(String(p.image_url)))||null}
  function preload(src){return new Promise(resolve=>{const i=new Image();let done=false;const finish=ok=>{if(done)return;done=true;resolve(ok)};i.onload=()=>finish(true);i.onerror=()=>finish(false);i.src=src;setTimeout(()=>finish(false),3500)})}

  function addStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
      .hero.vyrdict-wide-story{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:transparent!important}
      .hero.vyrdict-wide-story::before{content:'';position:absolute;z-index:0;inset:0 auto 0 50%;width:100vw;transform:translateX(-50%);pointer-events:none;background:
        radial-gradient(ellipse at 77% 42%,rgba(74,70,67,.22),transparent 38%),
        radial-gradient(ellipse at 33% 78%,rgba(255,255,255,.22),transparent 35%),
        linear-gradient(105deg,#d9d6d2 0%,#cfccc8 42%,#c2bfbb 70%,#b7b4b1 100%)}
      .hero.vyrdict-wide-story::after{content:'';position:absolute;z-index:2;inset:0 auto 0 50%;width:100vw;transform:translateX(-50%);pointer-events:none;background:linear-gradient(90deg,rgba(225,222,218,.94) 0%,rgba(221,218,214,.90) 28%,rgba(216,213,209,.68) 47%,rgba(205,202,198,.24) 61%,rgba(195,192,188,0) 73%)}
      .hero.vyrdict-wide-story>:not(.vyrdict-wide-story-layer){position:relative;z-index:3}
      .hero.vyrdict-wide-story .stage{opacity:0!important;pointer-events:none!important}
      .hero.vyrdict-wide-story .vyrdict-wide-story-layer{position:absolute;z-index:1;top:0;bottom:0;left:50%;width:100vw;transform:translateX(-50%);overflow:hidden;pointer-events:none}
      .vyrdict-wide-story-layer .vyrdict-story-object{position:absolute;display:block;pointer-events:auto;text-decoration:none;transform-origin:center center;will-change:transform,opacity,filter;filter:drop-shadow(0 18px 22px rgba(38,34,31,.22))}
      .vyrdict-wide-story-layer .vyrdict-story-object img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:transparent!important;padding:0!important;mix-blend-mode:normal!important;transform:none!important}
      .vyrdict-wide-story-layer .vyrdict-story-object:hover{filter:drop-shadow(0 24px 28px rgba(38,34,31,.30));z-index:8}
      .vyrdict-wide-story-layer .vyrdict-story-object:focus-visible{outline:2px solid #171511;outline-offset:4px;border-radius:10px}
      @media(max-width:700px){
        .hero.vyrdict-wide-story::after{background:linear-gradient(90deg,rgba(225,222,218,.90) 0%,rgba(218,215,211,.70) 49%,rgba(198,195,191,.12) 76%,transparent 100%)}
        .vyrdict-wide-story-layer .vyrdict-story-object{filter:drop-shadow(0 12px 15px rgba(38,34,31,.18))}
      }
      @media(prefers-reduced-motion:reduce){
        .hero.vyrdict-wide-story .stage{opacity:1!important;pointer-events:auto!important}
        .hero.vyrdict-wide-story .vyrdict-wide-story-layer{display:none!important}
      }
    `;
  }

  function clearLayer(){
    if(timer){clearTimeout(timer);timer=null}
    sceneToken++;
    layer?.remove();
    layer=null;
  }

  function makeLayer(){
    clearLayer();
    const token=sceneToken;
    layer=document.createElement('div');
    layer.className='vyrdict-wide-story-layer';
    hero.appendChild(layer);
    return token;
  }

  function makeObject(p,box){
    const a=document.createElement('a');
    a.className='vyrdict-story-object';
    a.href=`/product/${encodeURIComponent(p.slug)}/`;
    a.setAttribute('aria-label',`View ${p.brand||''} ${p.name||''} on VYRDICT`.trim());
    Object.assign(a.style,{left:box.left,top:box.top,width:box.width,height:box.height});
    const img=document.createElement('img');
    img.src=p.image_url;img.alt=`${p.brand||''} ${p.name||''}`.trim();img.decoding='async';img.loading='eager';
    a.appendChild(img);layer.appendChild(a);return a;
  }

  async function scatterScene(){
    const products=SCATTER.map(item).filter(Boolean);if(products.length<5)return false;
    await Promise.all(products.map(p=>preload(p.image_url)));
    const token=makeLayer();
    const desktop=[
      {left:'1%',top:'17%',width:'11%',height:'31%',from:'translate3d(-120vw,-9vh,0) rotate(-24deg) scale(.55)',rot:'-7deg'},
      {left:'15%',top:'54%',width:'10%',height:'27%',from:'translate3d(-110vw,7vh,0) rotate(20deg) scale(.55)',rot:'5deg'},
      {left:'29%',top:'22%',width:'11%',height:'32%',from:'translate3d(105vw,-6vh,0) rotate(-18deg) scale(.50)',rot:'-4deg'},
      {left:'44%',top:'48%',width:'14%',height:'35%',from:'translate3d(-105vw,5vh,0) rotate(19deg) scale(.55)',rot:'5deg'},
      {left:'58%',top:'14%',width:'11%',height:'31%',from:'translate3d(105vw,-7vh,0) rotate(-22deg) scale(.50)',rot:'-5deg'},
      {left:'70%',top:'46%',width:'13%',height:'35%',from:'translate3d(105vw,8vh,0) rotate(21deg) scale(.52)',rot:'5deg'},
      {left:'83%',top:'18%',width:'10%',height:'30%',from:'translate3d(115vw,-5vh,0) rotate(-24deg) scale(.50)',rot:'6deg'},
      {left:'91%',top:'52%',width:'9%',height:'27%',from:'translate3d(-120vw,9vh,0) rotate(24deg) scale(.50)',rot:'-5deg'}
    ];
    const mobile=[
      {left:'-2%',top:'17%',width:'19%',height:'30%',from:'translate3d(-120vw,-6vh,0) rotate(-22deg) scale(.55)',rot:'-6deg'},
      {left:'14%',top:'56%',width:'17%',height:'25%',from:'translate3d(-110vw,7vh,0) rotate(18deg) scale(.55)',rot:'5deg'},
      {left:'29%',top:'23%',width:'18%',height:'29%',from:'translate3d(105vw,-5vh,0) rotate(-17deg) scale(.52)',rot:'-4deg'},
      {left:'43%',top:'49%',width:'22%',height:'33%',from:'translate3d(-105vw,6vh,0) rotate(18deg) scale(.55)',rot:'4deg'},
      {left:'60%',top:'15%',width:'18%',height:'30%',from:'translate3d(105vw,-6vh,0) rotate(-20deg) scale(.50)',rot:'-5deg'},
      {left:'72%',top:'48%',width:'20%',height:'32%',from:'translate3d(105vw,7vh,0) rotate(20deg) scale(.52)',rot:'5deg'},
      {left:'86%',top:'19%',width:'16%',height:'27%',from:'translate3d(115vw,-5vh,0) rotate(-22deg) scale(.50)',rot:'5deg'},
      {left:'91%',top:'56%',width:'14%',height:'24%',from:'translate3d(-120vw,8vh,0) rotate(22deg) scale(.50)',rot:'-5deg'}
    ];
    const layout=MOBILE.matches?mobile:desktop;
    products.slice(0,layout.length).forEach((p,i)=>{
      const b=layout[i],el=makeObject(p,b);
      el.animate([
        {opacity:0,transform:b.from,filter:'blur(5px) drop-shadow(0 5px 5px rgba(38,34,31,.05))'},
        {opacity:1,transform:`translate3d(${i%2?2:-2}vw,0,0) rotate(${b.rot}) scale(1.06)`,offset:.76},
        {opacity:1,transform:`translate3d(0,0,0) rotate(${b.rot}) scale(1)`,filter:'blur(0) drop-shadow(0 18px 22px rgba(38,34,31,.22))'}
      ],{duration:800+(i%3)*90,delay:i*75,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    });
    timer=setTimeout(()=>transitionOut(token,sweepScene,'alternating'),3200);
    return true;
  }

  async function sweepScene(){
    const products=SWEEP.map(item).filter(Boolean);if(products.length<3)return scatterScene();
    await Promise.all(products.map(p=>preload(p.image_url)));
    const token=makeLayer();
    const lanes=MOBILE.matches?
      [{top:'13%',width:'28%',height:'42%'},{top:'51%',width:'24%',height:'36%'},{top:'23%',width:'25%',height:'39%'},{top:'48%',width:'24%',height:'36%'}]:
      [{top:'10%',width:'18%',height:'46%'},{top:'50%',width:'16%',height:'38%'},{top:'21%',width:'17%',height:'43%'},{top:'48%',width:'16%',height:'39%'}];
    products.slice(0,4).forEach((p,i)=>{
      const fromLeft=i%2===0,el=makeObject(p,{left:fromLeft?'-20%':'102%',top:lanes[i].top,width:lanes[i].width,height:lanes[i].height});
      const start=fromLeft?'translate3d(-10vw,0,0) rotate(-12deg) scale(.8)':'translate3d(10vw,0,0) rotate(12deg) scale(.8)';
      const middle=fromLeft?`translate3d(${MOBILE.matches?62:70}vw,0,0) rotate(3deg) scale(1.05)`:`translate3d(${MOBILE.matches?-64:-72}vw,0,0) rotate(-3deg) scale(1.05)`;
      const end=fromLeft?'translate3d(132vw,0,0) rotate(12deg) scale(.8)':'translate3d(-132vw,0,0) rotate(-12deg) scale(.8)';
      el.animate([{opacity:0,transform:start},{opacity:1,transform:middle,offset:.44},{opacity:1,transform:middle,offset:.64},{opacity:0,transform:end}],{duration:3000,delay:i*430,easing:'cubic-bezier(.42,0,.2,1)',fill:'both'});
    });
    timer=setTimeout(()=>{if(token===sceneToken)returnScene()},4700);
  }

  async function returnScene(){
    const products=RETURN.map(item).filter(Boolean);if(products.length<3)return scatterScene();
    await Promise.all(products.map(p=>preload(p.image_url)));
    const token=makeLayer();
    const positions=MOBILE.matches?
      [{left:'6%',top:'22%',width:'25%',height:'38%'},{left:'32%',top:'47%',width:'22%',height:'34%'},{left:'57%',top:'18%',width:'27%',height:'42%'},{left:'79%',top:'50%',width:'21%',height:'31%'}]:
      [{left:'5%',top:'19%',width:'16%',height:'42%'},{left:'30%',top:'47%',width:'14%',height:'34%'},{left:'56%',top:'16%',width:'17%',height:'45%'},{left:'80%',top:'47%',width:'14%',height:'35%'}];
    products.slice(0,4).forEach((p,i)=>{
      const b=positions[i],fromRight=i%2===1,el=makeObject(p,b);
      el.animate([
        {opacity:0,transform:`translate3d(${fromRight?'115vw':'-115vw'},0,0) rotate(${fromRight?20:-20}deg) scale(.6)`},
        {opacity:1,transform:`translate3d(${fromRight?-2:2}vw,0,0) rotate(${fromRight?-5:5}deg) scale(1.05)`,offset:.78},
        {opacity:1,transform:'translate3d(0,0,0) rotate(0) scale(1)'}
      ],{duration:900,delay:i*180,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    });
    timer=setTimeout(()=>transitionOut(token,scatterScene,'alternating'),3300);
  }

  function transitionOut(token,next,mode){
    if(token!==sceneToken||!layer)return;
    const nodes=[...layer.querySelectorAll('.vyrdict-story-object')];
    nodes.forEach((el,i)=>{
      const x=mode==='alternating'?(i%2?120:-120):(i%2?130:-130);
      el.animate([{opacity:1},{opacity:0,transform:`translate3d(${x}vw,${i%3===0?-4:4}vh,0) rotate(${i%2?18:-18}deg) scale(.72)`,filter:'blur(4px)'}],{duration:520+(i%3)*50,delay:i*24,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});
    });
    timer=setTimeout(()=>{if(token===sceneToken)next()},620);
  }

  async function init(attempt=0){
    if(!onHome()){clearLayer();hero?.classList.remove('vyrdict-wide-story');return}
    if(REDUCED.matches){clearLayer();hero?.classList.remove('vyrdict-wide-story');return}
    addStyle();stage=document.querySelector('.stage');
    if(!stage){if(attempt<24)setTimeout(()=>init(attempt+1),120);return}
    hero=stage.closest('.hero')||stage.closest('section')||stage.parentElement;
    if(!hero){if(attempt<24)setTimeout(()=>init(attempt+1),120);return}
    if(catalog().length<8){if(attempt<24)setTimeout(()=>init(attempt+1),160);return}
    hero.classList.add('vyrdict-wide-story');
    stage.classList.remove('vyrdict-motion-stage','vyrdict-story-stage');
    scatterScene();
  }

  function boot(){clearLayer();setTimeout(()=>init(),40)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',boot);addEventListener('hashchange',boot);
  REDUCED.addEventListener?.('change',boot);MOBILE.addEventListener?.('change',boot);
})();
