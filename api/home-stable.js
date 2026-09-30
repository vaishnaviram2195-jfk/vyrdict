const homeHandler=require('./home');

const REV='20260930-layout-restore-13';
const SCRIPT_REVISIONS=[
  ['/product-navigation-market-fix.js?v=3-20260907',`/product-navigation-market-fix.js?v=${REV}`],
  ['/navigation-context.js?v=3-20260907',`/navigation-context.js?v=${REV}`],
  ['/navigation-guard.js?v=1',`/navigation-guard.js?v=${REV}`],
  ['/top-nav-section-fix.js?v=3',`/top-nav-section-fix.js?v=${REV}`],
  ['/spa-navigation-fast.js?v=1-20260905-perf',`/spa-navigation-fast.js?v=${REV}`],
  ['/homepage-simplify.js?v=14',`/homepage-simplify.js?v=${REV}`],
  ['/homepage-editorial-now.js?v=2-20260917',`/homepage-editorial-now.js?v=${REV}`],
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
html.vyrdict-home-entry-lock body{overflow:hidden!important;scroll-behavior:auto!important}
html.vyrdict-home-entry-lock::before{content:none!important;display:none!important}
html.vyrdict-home-entry-lock::after{content:none!important;display:none!important}
body.vyrdict-home-current .hero h1{font-size:clamp(42px,5vw,68px)!important;line-height:.94!important;letter-spacing:-.045em!important}
body.vyrdict-home-current .section .head h2{font-size:clamp(32px,3.65vw,46px)!important;line-height:1!important;letter-spacing:-.04em!important}
body.vyrdict-home-current .section .head h3{font-size:clamp(26px,3vw,38px)!important;line-height:1.03!important}
@media(max-width:700px){
  body.vyrdict-home-current .hero h1{font-size:clamp(38px,10.5vw,50px)!important;line-height:.96!important}
  body.vyrdict-home-current .section .head h2{font-size:clamp(28px,8.5vw,36px)!important;line-height:1!important}
  body.vyrdict-home-current .section .head h3{font-size:clamp(24px,7vw,32px)!important}
}
</style>`;

  const navBootstrap=`<script src="/top-nav-section-fix.js?v=${REV}"><\/script>`;
  const layoutBootstrap=`<script src="/homepage-layout-restore.js?v=${REV}" defer><\/script>`;

  const disableLegacy=`<script id="vyrdict-disable-legacy-home-${REV}">(()=>{
    window.__vyrdictHeroV10=1;
    window.__vyrdictHeroV8=1;
    window.__vyrdictMobileCurrentHeroV2=1;
    window.__vyrdictFeaturedRowsV3=1;
    window.__vyrdictGrowthRetentionV4=1;
  })();<\/script>`;

  const guard=`<script id="vyrdict-home-revision-${REV}">(()=>{
    window.__VYRDICT_HOME_REV='${REV}';
    let completed=false;
    const legacyDeep=()=>/^#\\/(?:product|category|collection|search|saved|rankings)(?:\\/|$)/i.test(location.hash||'');
    const onHome=()=>((location.pathname==='/'||location.pathname==='')&&!legacyDeep());
    const pinTop=()=>{
      if(!onHome()||completed)return;
      try{history.scrollRestoration='manual'}catch{}
      try{window.scrollTo(0,0)}catch{}
      try{document.documentElement.scrollTop=0}catch{}
      try{if(document.body)document.body.scrollTop=0}catch{}
    };
    const lock=()=>{
      if(!onHome()||completed)return;
      document.documentElement.classList.add('vyrdict-home-entry-lock');
      pinTop();
    };
    const unlock=()=>{
      if(completed)return;
      completed=true;
      document.documentElement.classList.remove('vyrdict-home-entry-lock');
    };
    lock();
    try{for(const k of Object.keys(localStorage)){if(/^vyrdict:(?:bundle-cache|home|hero|homepage)/i.test(k))localStorage.removeItem(k)}}catch{}
    const start=()=>{
      if(!onHome()){unlock();return}
      if(completed)return;
      document.body?.classList.add('vyrdict-home-current');
      let tries=0;
      const check=()=>{
        if(completed)return;
        pinTop();
        const app=document.getElementById('app');
        const ready=!!(app&&app.innerHTML&&app.innerHTML.trim().length>0);
        if(ready||tries++>28){
          requestAnimationFrame(()=>requestAnimationFrame(unlock));
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
    addEventListener('pageshow',e=>{
      if(!e.persisted||!onHome())return;
      document.documentElement.classList.remove('vyrdict-home-entry-lock');
    });
  })();<\/script>`;

  if(html.includes('<html')&&!html.includes('data-vyrdict-home-rev=')){
    html=html.replace('<html','<html data-vyrdict-home-rev="'+REV+'"');
  }
  if(html.includes('</head>'))html=html.replace('</head>',css+disableLegacy+navBootstrap+layoutBootstrap+guard+'</head>');
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
