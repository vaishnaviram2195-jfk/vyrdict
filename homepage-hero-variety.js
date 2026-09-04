(()=>{
  if(window.__vyrdictHeroStoryV2)return;
  window.__vyrdictHeroStoryV2=1;

  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const MOBILE=matchMedia('(max-width:700px)');
  const STYLE_ID='vyrdict-hero-story-style';
  let stage=null,layer=null,timer=null,sceneToken=0;

  const SCATTER=['owala-freesip','mfk-baccarat-rouge-540','sol-de-janeiro-cheirosa-62','dji-osmo-pocket-3','ryse-loaded-protein','longchamp-le-pliage','fruit-riot-sour-grapes','hydrojug-traveler'];
  const BAG=['longchamp-le-pliage','mfk-baccarat-rouge-540'];
  const HERO=['dyson-airwrap-id','dji-osmo-pocket-3','sol-de-janeiro-cheirosa-62'];

  function onHome(){return location.pathname==='/'||location.pathname===''}
  function catalog(){return Array.isArray(window.__VYRDICT_BOOT_DATA?.p)?window.__VYRDICT_BOOT_DATA.p:[]}
  function item(slug){return catalog().find(p=>p?.slug===slug&&p.image_url&&/^https:\/\//i.test(String(p.image_url)))||null}
  function preload(src){return new Promise(resolve=>{const i=new Image();let done=false;const finish=ok=>{if(done)return;done=true;resolve(ok)};i.onload=()=>finish(true);i.onerror=()=>finish(false);i.src=src;setTimeout(()=>finish(false),3500)})}

  function addStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
      .stage.vyrdict-story-stage{overflow:hidden!important;isolation:isolate!important;background:linear-gradient(145deg,#f5eee8 0%,#f1e7df 52%,#eee4dc 100%)!important}
      .stage.vyrdict-story-stage>.photo,.stage.vyrdict-story-stage>.sticker{opacity:0!important;pointer-events:none!important}
      .stage.vyrdict-story-stage>.blob{opacity:.58!important;filter:saturate(.82)!important;transition:opacity .35s ease}
      .stage.vyrdict-story-stage .vyrdict-story-layer{position:absolute;inset:0;z-index:20;overflow:hidden;border-radius:inherit;pointer-events:none}
      .vyrdict-story-layer .vyrdict-story-word{position:absolute;z-index:0;left:6%;right:4%;top:12%;font:950 clamp(25px,3.25vw,48px)/.93 Arial,Helvetica,sans-serif;letter-spacing:-.055em;text-transform:lowercase;color:rgba(255,255,255,.72);text-wrap:balance;pointer-events:none;user-select:none}
      .vyrdict-story-layer .vyrdict-story-word em{font-family:Georgia,'Times New Roman',serif;font-weight:500;font-style:italic;color:rgba(173,75,92,.68)}
      .vyrdict-story-layer .vyrdict-story-kicker{position:absolute;left:7%;bottom:7%;z-index:2;padding:7px 10px;border:1px solid rgba(23,21,17,.16);border-radius:999px;background:rgba(255,253,248,.82);backdrop-filter:blur(8px);font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#514a44;opacity:0;pointer-events:none}
      .vyrdict-story-layer .vyrdict-story-object{position:absolute;z-index:5;display:block;pointer-events:auto;text-decoration:none;will-change:transform,opacity,filter;transform-origin:center center;filter:drop-shadow(0 14px 15px rgba(46,34,27,.13))}
      .vyrdict-story-layer .vyrdict-story-object img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:transparent!important;padding:0!important;mix-blend-mode:normal!important;transform:none!important}
      .vyrdict-story-layer .vyrdict-story-object:hover{filter:drop-shadow(0 18px 20px rgba(46,34,27,.2));z-index:9}
      .vyrdict-story-layer .vyrdict-story-object:focus-visible{outline:2px solid #171511;outline-offset:4px;border-radius:10px}
      .vyrdict-story-layer .vyrdict-story-object.is-idle{animation:vyrdictStoryIdle var(--idle,2.8s) ease-in-out infinite alternate}
      .vyrdict-story-layer .vyrdict-story-object.is-spin{animation:vyrdictStorySpin var(--idle,3.4s) ease-in-out infinite alternate}
      .vyrdict-story-layer .vyrdict-story-glow{position:absolute;z-index:1;width:48%;height:48%;left:28%;top:26%;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.78),rgba(255,255,255,0) 70%);filter:blur(10px);opacity:.82;pointer-events:none}
      @keyframes vyrdictStoryIdle{from{translate:0 -4px;rotate:-1deg}to{translate:3px 5px;rotate:1.4deg}}
      @keyframes vyrdictStorySpin{from{translate:-2px -3px;rotate:-3deg}to{translate:3px 4px;rotate:3deg}}
      @media(max-width:700px){
        .vyrdict-story-layer .vyrdict-story-word{font-size:clamp(23px,8.2vw,39px);left:5%;right:3%;top:10%}
        .vyrdict-story-layer .vyrdict-story-kicker{left:6%;bottom:5%}
      }
      @media(prefers-reduced-motion:reduce){
        .stage.vyrdict-story-stage>.photo{opacity:1!important;pointer-events:auto!important}
        .stage.vyrdict-story-stage>.sticker{opacity:1!important}
        .stage.vyrdict-story-stage .vyrdict-story-layer{display:none!important}
      }
    `;
  }

  function clearLayer(){
    if(timer){clearTimeout(timer);timer=null}
    sceneToken++;
    layer?.remove();
    layer=null;
  }

  function makeLayer(copy,kicker){
    clearLayer();
    const token=sceneToken;
    layer=document.createElement('div');
    layer.className='vyrdict-story-layer';
    layer.innerHTML=`<div class="vyrdict-story-glow"></div><div class="vyrdict-story-word">${copy}</div><div class="vyrdict-story-kicker">${kicker}</div>`;
    stage.appendChild(layer);
    const k=layer.querySelector('.vyrdict-story-kicker');
    k?.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:500,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});
    return token;
  }

  function makeObject(p,box,cls='is-idle'){
    const a=document.createElement('a');
    a.className=`vyrdict-story-object ${cls}`;
    a.href=`/product/${encodeURIComponent(p.slug)}/`;
    a.setAttribute('aria-label',`View ${p.brand||''} ${p.name||''} on VYRDICT`.trim());
    a.title=`${p.brand||''} ${p.name||''} · Viral ${p.viral_score} · Worth ${p.worth_score}`.trim();
    Object.assign(a.style,{left:box.left,top:box.top,width:box.width,height:box.height,'--idle':box.idle||'3s'});
    const img=document.createElement('img');img.src=p.image_url;img.alt=`${p.brand||''} ${p.name||''}`.trim();img.decoding='async';img.loading='eager';
    a.appendChild(img);layer.appendChild(a);return a;
  }

  async function scatterScene(){
    const products=SCATTER.map(item).filter(Boolean);if(products.length<5)return false;
    await Promise.all(products.map(p=>preload(p.image_url)));
    const token=makeLayer(`what the internet <em>can't stop</em> talking about`,`viral, but make it useful`);
    const desktop=[
      {left:'7%',top:'23%',width:'16%',height:'22%',from:'translate3d(-150%,-80%,0) rotate(-26deg) scale(.4)',rot:'-7deg'},
      {left:'28%',top:'11%',width:'14%',height:'22%',from:'translate3d(-20%,-170%,0) rotate(24deg) scale(.5)',rot:'5deg'},
      {left:'48%',top:'24%',width:'14%',height:'20%',from:'translate3d(0,-190%,0) rotate(-18deg) scale(.45)',rot:'-4deg'},
      {left:'69%',top:'13%',width:'17%',height:'24%',from:'translate3d(140%,-130%,0) rotate(28deg) scale(.45)',rot:'7deg'},
      {left:'14%',top:'56%',width:'18%',height:'24%',from:'translate3d(-150%,120%,0) rotate(26deg) scale(.45)',rot:'5deg'},
      {left:'38%',top:'48%',width:'22%',height:'30%',from:'translate3d(0,165%,0) rotate(-20deg) scale(.55)',rot:'-5deg'},
      {left:'64%',top:'52%',width:'14%',height:'22%',from:'translate3d(160%,120%,0) rotate(-24deg) scale(.45)',rot:'-4deg'},
      {left:'78%',top:'46%',width:'14%',height:'21%',from:'translate3d(180%,30%,0) rotate(34deg) scale(.45)',rot:'8deg'}
    ];
    const mobile=[
      {left:'5%',top:'24%',width:'19%',height:'22%',from:'translate3d(-150%,-90%,0) rotate(-25deg) scale(.45)',rot:'-6deg'},
      {left:'28%',top:'13%',width:'18%',height:'22%',from:'translate3d(-20%,-180%,0) rotate(22deg) scale(.5)',rot:'5deg'},
      {left:'52%',top:'26%',width:'17%',height:'20%',from:'translate3d(0,-190%,0) rotate(-16deg) scale(.45)',rot:'-4deg'},
      {left:'74%',top:'15%',width:'18%',height:'23%',from:'translate3d(130%,-120%,0) rotate(26deg) scale(.45)',rot:'6deg'},
      {left:'10%',top:'57%',width:'21%',height:'23%',from:'translate3d(-140%,110%,0) rotate(24deg) scale(.45)',rot:'4deg'},
      {left:'37%',top:'49%',width:'25%',height:'28%',from:'translate3d(0,160%,0) rotate(-18deg) scale(.52)',rot:'-4deg'},
      {left:'65%',top:'55%',width:'17%',height:'21%',from:'translate3d(150%,110%,0) rotate(-22deg) scale(.45)',rot:'-3deg'},
      {left:'80%',top:'48%',width:'15%',height:'20%',from:'translate3d(170%,30%,0) rotate(32deg) scale(.45)',rot:'7deg'}
    ];
    const layout=MOBILE.matches?mobile:desktop;
    products.slice(0,layout.length).forEach((p,i)=>{
      const el=makeObject(p,layout[i],i%3===0?'is-spin':'is-idle');
      el.style.setProperty('--idle',`${2.6+(i%4)*.35}s`);
      el.animate([{opacity:0,transform:layout[i].from,filter:'blur(5px) drop-shadow(0 6px 5px rgba(46,34,27,.04))'},{opacity:1,transform:`translate3d(0,0,0) rotate(${layout[i].rot}) scale(1.06)`,offset:.78},{opacity:1,transform:`translate3d(0,0,0) rotate(${layout[i].rot}) scale(1)`,filter:'blur(0) drop-shadow(0 14px 15px rgba(46,34,27,.13))'}],{duration:760+(i%3)*90,delay:i*65,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    });
    timer=setTimeout(()=>transitionOut(token,singleScene),3350);
    return true;
  }

  async function singleScene(){
    const main=item(BAG[0]),accent=item(BAG[1]);if(!main)return scatterScene();
    await Promise.all([main,accent].filter(Boolean).map(p=>preload(p.image_url)));
    const token=makeLayer(`the one you <em>keep seeing</em> everywhere`,`seen. saved. scored.`);
    const m=makeObject(main,MOBILE.matches?{left:'26%',top:'24%',width:'48%',height:'54%',idle:'2.8s'}:{left:'31%',top:'20%',width:'40%',height:'58%',idle:'2.8s'},'is-idle');
    m.animate([{opacity:0,transform:'translate3d(-110%,-120%,0) rotate(-24deg) scale(.65)'},{opacity:1,transform:'translate3d(7%,5%,0) rotate(7deg) scale(1.05)',offset:.76},{opacity:1,transform:'translate3d(0,0,0) rotate(4deg) scale(1)'}],{duration:900,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    if(accent){
      const a=makeObject(accent,MOBILE.matches?{left:'67%',top:'53%',width:'18%',height:'25%',idle:'2.3s'}:{left:'69%',top:'49%',width:'15%',height:'27%',idle:'2.3s'},'is-spin');
      a.animate([{opacity:0,transform:'translate3d(130%,-80%,0) rotate(20deg) scale(.45)'},{opacity:1,transform:'translate3d(0,0,0) rotate(-5deg) scale(1)'}],{duration:650,delay:470,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    }
    timer=setTimeout(()=>transitionOut(token,heroScene),2350);
  }

  async function heroScene(){
    const main=item(HERO[0]),one=item(HERO[1]),two=item(HERO[2]);if(!main)return scatterScene();
    await Promise.all([main,one,two].filter(Boolean).map(p=>preload(p.image_url)));
    const token=makeLayer(`viral is easy. <em>worth it</em> is the verdict.`,`the verdict on what's trending`);
    const m=makeObject(main,MOBILE.matches?{left:'28%',top:'20%',width:'48%',height:'58%',idle:'3.1s'}:{left:'30%',top:'17%',width:'43%',height:'63%',idle:'3.1s'},'is-idle');
    m.animate([{opacity:0,transform:'translate3d(0,130%,0) rotate(-11deg) scale(.72)'},{opacity:1,transform:'translate3d(0,-3%,0) rotate(2deg) scale(1.04)',offset:.78},{opacity:1,transform:'translate3d(0,0,0) rotate(0) scale(1)'}],{duration:980,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    if(one){
      const a=makeObject(one,MOBILE.matches?{left:'8%',top:'47%',width:'23%',height:'28%',idle:'2.5s'}:{left:'8%',top:'44%',width:'21%',height:'30%',idle:'2.5s'},'is-spin');
      a.animate([{opacity:0,transform:'translate3d(-140%,35%,0) rotate(-30deg) scale(.55)'},{opacity:1,transform:'translate3d(0,0,0) rotate(-6deg) scale(1)'}],{duration:720,delay:520,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    }
    if(two){
      const b=makeObject(two,MOBILE.matches?{left:'74%',top:'34%',width:'17%',height:'27%',idle:'2.2s'}:{left:'75%',top:'31%',width:'15%',height:'29%',idle:'2.2s'},'is-idle');
      b.animate([{opacity:0,transform:'translate3d(100%,-160%,0) rotate(18deg) scale(.45)'},{opacity:1,transform:'translate3d(0,0,0) rotate(5deg) scale(1)'}],{duration:760,delay:760,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'});
    }
    timer=setTimeout(()=>transitionOut(token,scatterScene),4550);
  }

  function transitionOut(token,next){
    if(token!==sceneToken||!layer)return;
    const nodes=[...layer.querySelectorAll('.vyrdict-story-object')];
    nodes.forEach((el,i)=>el.animate([{opacity:1},{opacity:0,transform:`translate3d(${i%2?120:-120}px,${i%3===0?-90:90}px,0) rotate(${i%2?18:-18}deg) scale(.7)`,filter:'blur(4px)'}],{duration:430+(i%3)*60,delay:i*22,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'}));
    layer.querySelector('.vyrdict-story-word')?.animate([{opacity:1},{opacity:0}],{duration:340,fill:'forwards'});
    layer.querySelector('.vyrdict-story-kicker')?.animate([{opacity:1},{opacity:0}],{duration:280,fill:'forwards'});
    timer=setTimeout(()=>{if(token===sceneToken)next()},520);
  }

  async function init(attempt=0){
    if(!onHome()){clearLayer();return}
    if(REDUCED.matches){clearLayer();return}
    addStyle();stage=document.querySelector('.stage');
    if(!stage){if(attempt<24)setTimeout(()=>init(attempt+1),120);return}
    if(catalog().length<8){if(attempt<24)setTimeout(()=>init(attempt+1),160);return}
    stage.classList.remove('vyrdict-motion-stage');
    stage.classList.add('vyrdict-story-stage');
    scatterScene();
  }

  function boot(){clearLayer();setTimeout(()=>init(),40)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',boot);addEventListener('hashchange',boot);
  REDUCED.addEventListener?.('change',boot);MOBILE.addEventListener?.('change',boot);
})();
