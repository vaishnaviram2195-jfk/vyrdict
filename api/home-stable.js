const homeHandler=require('./home');

const REV='20260927-home-stable-1';
const SCRIPT_REVISIONS=[
  ['/spa-navigation-fast.js?v=1-20260905-perf',`/spa-navigation-fast.js?v=${REV}`],
  ['/homepage-simplify.js?v=14',`/homepage-simplify.js?v=${REV}`],
  ['/homepage-editorial-now.js?v=2-20260917',`/homepage-editorial-now.js?v=${REV}`],
  ['/homepage-hero-variety.js?v=8',`/homepage-hero-variety.js?v=${REV}`],
  ['/mobile-current-hero.js?v=3-20260909',`/mobile-current-hero.js?v=${REV}`],
  ['/home-featured-rows.js?v=6',`/home-featured-rows.js?v=${REV}`],
  ['/weekly-ranking-expand.js?v=32-20260909',`/weekly-ranking-expand.js?v=${REV}`],
  ['/skip-list-reliable.js?v=2-20260909-mobilefix',`/skip-list-reliable.js?v=${REV}`],
  ['/trending-index-claw.js?v=6-20260909-mobilefix',`/trending-index-claw.js?v=${REV}`],
  ['/mobile-home-section-guard.js?v=3-20260909',`/mobile-home-section-guard.js?v=${REV}`]
];

function currentHomePatch(input){
  let html=String(input||'');
  for(const [from,to] of SCRIPT_REVISIONS)html=html.replaceAll(from,to);

  const css=`<style id="vyrdict-home-stable-${REV}">
body.vyrdict-home-calm .hero h1{font-size:clamp(42px,5vw,68px)!important;line-height:.94!important;letter-spacing:-.045em!important}
body.vyrdict-home-calm .section .head h2{font-size:clamp(32px,3.65vw,46px)!important;line-height:1!important;letter-spacing:-.04em!important}
body.vyrdict-home-calm .section .head h3{font-size:clamp(26px,3vw,38px)!important;line-height:1.03!important}
body.vyrdict-home-calm #vyrdict-hero-v8-layer,
body.vyrdict-home-calm #vyrdict-mobile-current-static-layer,
body.vyrdict-home-calm #vyrdict-mobile-motion-layer,
body.vyrdict-home-calm #vyrdict-mobile-hero-primary-layer{display:none!important}
@media(max-width:700px){
  body.vyrdict-home-calm .hero h1{font-size:clamp(38px,10.5vw,50px)!important;line-height:.96!important}
  body.vyrdict-home-calm .section .head h2{font-size:clamp(28px,8.5vw,36px)!important;line-height:1!important}
  body.vyrdict-home-calm .section .head h3{font-size:clamp(24px,7vw,32px)!important}
}
</style>`;
  const guard=`<script id="vyrdict-home-revision-${REV}">(()=>{window.__VYRDICT_HOME_REV='${REV}';try{for(const k of Object.keys(localStorage)){if(/^vyrdict:bundle-cache:v(?:1[0-8]|[1-9])$/.test(k))localStorage.removeItem(k)}}catch{}})();<\/script>`;

  if(html.includes('<html')&&!html.includes('data-vyrdict-home-rev=')){
    html=html.replace('<html','<html data-vyrdict-home-rev="'+REV+'"');
  }
  if(html.includes('</head>'))html=html.replace('</head>',css+guard+'</head>');
  return html;
}

module.exports=async function handler(req,res){
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
