const homeHandler=require('./home');

const REV='20260929-top-entry-11';
const SCRIPT_REVISIONS=[
  ['/product-navigation-market-fix.js?v=3-20260907',`/product-navigation-market-fix.js?v=${REV}`],
  ['/navigation-context.js?v=3-20260907',`/navigation-context.js?v=${REV}`],
  ['/navigation-guard.js?v=1',`/navigation-guard.js?v=${REV}`],
  ['/top-nav-section-fix.js?v=3',`/top-nav-section-fix.js?v=${REV}`],
  ['/spa-navigation-fast.js?v=1-20260905-perf',`/spa-navigation-fast.js?v=${REV}`],
  ['/homepage-simplify.js?v=14',`/homepage-simplify.js?v=${REV}`],
  ['/homepage-editorial-now.js?v=2-20260917',`/homepage-editorial-now.js?v=${REV}`],
  ['/homepage-hero-variety.js?v=8',`/homepage-hero-variety.js?v=${REV}`],
  ['/mobile-current-hero.js?v=1',`/mobile-current-hero.js?v=${REV}`],
  ['/mobile-current-hero.js?v=3-20260909',`/mobile-current-hero.js?v=${REV}`],
  ['/home-featured-rows.js?v=6',`/home-featured-rows.js?v=${REV}`],
  ['/weekly-ranking-expand.js?v=32-20260909',`/weekly-ranking-expand.js?v=${REV}`],
  ['/skip-list-reliable.js?v=2-20260909-mobilefix',`/skip-list-reliable.js?v=${REV}`],
  ['/trending-index-claw.js?v=6-20260909-mobilefix',`/trending-index-claw.js?v=${REV}`],
  ['/mobile-home-section-guard.js?v=3-20260909',`/mobile-home-section-guard.js?v=${REV}`]
];

function currentHomePatch(input){
  let html=String(input||'');
  html=html.replaceAll('/site-footer.js?v=', '/site-footer.js?rev='+REV+'&v=');
  for(const [from,to] of SCRIPT_REVISIONS)html=html.replaceAll(from,to);

  const css=`<style id="vyrdict-home-stable-${REV}">
html,body{background:#f4ede5}
html.vyrdict-home-entry-lock{scroll-behavior:auto!important;overflow:hidden!important;background:#f4ede5!important}
html.vyrdict-home-entry-lock body{visibility:hidden!important;overflow:hidden!important;scroll-behavior:auto!important}
html.vyrdict-home-entry-lock::before{content:'VYRDICT';position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#f4ede5;color:#171511;font:950 27px/1 Arial,Helvetica,sans-serif;letter-spacing:-1.6px;visibility:visible!important;pointer-events:none}
html.vyrdict-home-entry-lock::after{content:'';position:fixed;z-index:2147483647;left:calc(50% + 49px);top:calc(50% + 8px);width:7px;height:7px;background:#e65f72;visibility:visible!important;pointer-events:none}
body.vyrdict-home-current .hero h1{font-size:clamp(42px,5vw,68px)!important;line-height:.94!important;letter-spacing:-.045em!important}
body.vyrdict-home-current .section .head h2{font-size:clamp(32px,3.65vw,46px)!important;line-height:1!important;letter-spacing:-.04em!important}
body.vyrdict-home-current .section .head h3{font-size:clamp(26px,3vw,38px)!important;line-height:1.03!important}
@media(max-width:700px){
  body.vyrdict-home-current .hero h1{font-size:clamp(38px,10.5vw,50px)!important;line-height:.96!important}
  body.vyrdict-home-current .section .head h2{font-size:clamp(28px,8.5vw,36px)!important;line-height:1!important}
  body.vyrdict-home-current .section .head h3{font-size:clamp(24px,7vw,32px)!important}
}
</style>`;

  // Synchronous on purpose: register the primary-nav capture listener before
  // any inline bundle router can claim those same header clicks.
  const navBootstrap=`<script src="/top-nav-section-fix.js?v=${REV}"><\/script>`;

  // This runs in <head>, before the homepage body can paint. We deliberately
  // lock the document at scrollY=0 and keep the body hidden behind a tiny
  // branded cover until the app has rendered at the top. That prevents the
  // browser's restored scroll position from flashing the footer/bottom first.
  const guard=`<script id="vyrdict-home-revision-${REV}">(()=>{
    window.__VYRDICT_HOME_REV='${REV}';
    const legacyDeep=()=>/^#\\/(?:product|category|collection|search|saved|rankings)(?:\\/|$)/i.test(location.hash||'');
    const onHome=()=>((location.pathname==='/'||location.pathname==='')&&!legacyDeep());
    const pinTop=()=>{
      if(!onHome())return;
      try{history.scrollRestoration='manual'}catch{}
      try{window.scrollTo(0,0)}catch{}
      try{document.documentElement.scrollTop=0}catch{}
      try{if(document.body)document.body.scrollTop=0}catch{}
    };
    const lock=()=>{
      if(!onHome())return;
      document.documentElement.classList.add('vyrdict-home-entry-lock');
      pinTop();
    };
    const unlock=()=>{
      pinTop();
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        pinTop();
        document.documentElement.classList.remove('vyrdict-home-entry-lock');
      }));
    };
    lock();
    let entryFrames=0;
    const holdTop=()=>{
      if(!onHome()||!document.documentElement.classList.contains('vyrdict-home-entry-lock'))return;
      pinTop();
      if(entryFrames++<45)requestAnimationFrame(holdTop);
    };
    requestAnimationFrame(holdTop);
    try{for(const k of Object.keys(localStorage)){if(/^vyrdict:(?:bundle-cache|home|hero|homepage)/i.test(k))localStorage.removeItem(k)}}catch{}
    const mark=()=>{
      if(!onHome())return;
      document.body?.classList.add('vyrdict-home-current');
    };
    const holdMotion=()=>{
      if(!onHome())return;
      const hero=document.querySelector('.hero.vyrdict-hero-v8');
      if(!hero)return;
      document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
      document.getElementById('vyrdict-mobile-motion-layer')?.remove();
      document.getElementById('vyrdict-mobile-hero-primary-layer')?.remove();
      hero.classList.remove('vyrdict-current-static','vyrdict-fullwidth-motion');
      if(document.documentElement.dataset.vyrdictCurrentHero==='static')delete document.documentElement.dataset.vyrdictCurrentHero;
      if(!document.getElementById('vyrdict-hero-v8-layer')){
        const layer=document.createElement('div');
        layer.id='vyrdict-hero-v8-layer';
        layer.dataset.bootstrap='${REV}';
        hero.appendChild(layer);
      }
    };
    const revealWhenReady=()=>{
      if(!onHome()){document.documentElement.classList.remove('vyrdict-home-entry-lock');return}
      let tries=0;
      const check=()=>{
        pinTop();
        const app=document.getElementById('app');
        const ready=!!(app&&app.innerHTML&&app.innerHTML.trim().length>0);
        if(ready||tries++>36){unlock();return}
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    };
    const start=()=>{
      if(!onHome()){document.documentElement.classList.remove('vyrdict-home-entry-lock');return}
      lock();
      mark();
      pinTop();
      const began=Date.now();
      const timer=setInterval(()=>{
        if(!onHome()||Date.now()-began>8000){clearInterval(timer);return}
        holdMotion();
      },40);
      setTimeout(holdMotion,0);
      setTimeout(holdMotion,80);
      setTimeout(holdMotion,250);
      setTimeout(holdMotion,700);
      setTimeout(holdMotion,1600);
      setTimeout(holdMotion,3200);
      revealWhenReady();
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
    addEventListener('pageshow',e=>{
      if(!onHome())return;
      if(e.persisted)lock();
      setTimeout(()=>{pinTop();start()},0);
    });
    addEventListener('popstate',()=>setTimeout(()=>{if(onHome()){lock();start()}},0));
  })();<\/script>`;

  if(html.includes('<html')&&!html.includes('data-vyrdict-home-rev=')){
    html=html.replace('<html','<html data-vyrdict-home-rev="'+REV+'"');
  }
  if(html.includes('</head>'))html=html.replace('</head>',css+navBootstrap+guard+'</head>');
  return html;
}

module.exports=async function handler(req,res){
  const incomingHost=String(req?.headers?.['x-forwarded-host']||req?.headers?.host||'').split(',')[0].trim().toLowerCase();
  if(incomingHost==='www.vyrdict.com'){
    res.setHeader('Location','https://vyrdict.com/');
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    return res.status(308).send('');
  }

  let statusCode=200;
  let body='';
  const capturedHeaders={};
  let sent=false;

  const proxy={
    setHeader(name,value){capturedHeaders[String(name).toLowerCase()]=value;},
    status(code){statusCode=Number(code)||200;return proxy;},
    send(value){body=value==null?'':String(value);sent=true;return proxy;}
  };

  try{
    await homeHandler(req,proxy);
  }catch(err){
    statusCode=503;
    body='<!doctype html><html><body style="margin:0;background:#f4ede5;font-family:Arial;display:grid;place-items:center;min-height:100vh"><div>VYRDICT is refreshing. Please reload once.</div></body></html>';
  }

  if(!sent&&statusCode===200)statusCode=503;
  if(statusCode===200)body=currentHomePatch(body);

  res.setHeader('Content-Type',capturedHeaders['content-type']||'text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control','no-store');
  res.setHeader('Surrogate-Control','no-store');
  res.setHeader('Pragma','no-cache');
  res.setHeader('X-VYRDICT-Home-Revision',REV);
  return res.status(statusCode).send(body);
};
