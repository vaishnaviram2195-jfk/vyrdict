const homeHandler=require('./home');

const REV='20261004-approved-noflicker-1';
const HOME_CONFLICTS=[
  'homepage-simplify.js',
  'homepage-editorial-now.js',
  'homepage-hero-variety.js',
  'mobile-current-hero.js',
  'home-featured-rows.js',
  'weekly-ranking-expand.js',
  'skip-list-reliable.js',
  'trending-index-claw.js',
  'mobile-home-section-guard.js',
  'homepage-layout-restore.js',
  'homepage-signal-landscape.js',
  'homepage-editorial-bootstrap.js',
  'homepage-editorial-legacy-guard.js',
  'mobile-home-stability.js'
];

function removeScriptByName(html,name){
  return html.replace(/<script\b[^>]*\bsrc=(["'])([^"']*)\1[^>]*>\s*<\/script>/gi,(tag,_q,src)=>src.includes(name)?'':tag);
}

function currentHomePatch(input){
  let html=String(input||'');
  for(const name of HOME_CONFLICTS)html=removeScriptByName(html,name);

  if(html.includes('<html')&&!html.includes('data-vyrdict-home-rev=')){
    html=html.replace('<html','<html data-vyrdict-home-rev="'+REV+'"');
  }

  const css=`<style id="vyrdict-editorial-restore-${REV}">
html,body{background:#f1efe9!important}
html.vyrdict-home-entry-lock{scroll-behavior:auto!important}
html[data-vyrdict-home-rev="${REV}"] body .hero,
html[data-vyrdict-home-rev="${REV}"] body .section{display:none!important}
html[data-vyrdict-home-rev="${REV}"] body .ve-hero{display:grid!important}
html[data-vyrdict-home-rev="${REV}"] body .ve-legacy-home{display:none!important}
html[data-vyrdict-home-rev="${REV}"] #vyrdict-editorial-home{display:block!important;visibility:visible!important;opacity:1!important}
html.vyrdict-home-entry-lock #vyrdict-editorial-home{opacity:0!important;pointer-events:none!important}
html.vyrdict-home-entry-lock body:before{
  content:"VYRDICT.";
  position:fixed;inset:0;z-index:999999;
  display:grid;place-items:center;
  background:#f1efe9;color:#171717;
  font:600 22px/1 Arial,Helvetica,sans-serif;
  letter-spacing:-.04em;
}
</style>`;

  const lock=`<script id="vyrdict-editorial-entry-${REV}">(()=>{
    window.__VYRDICT_HOME_REV='${REV}';
    if((location.pathname||'/')!=='/')return;
    const html=document.documentElement;
    html.classList.add('vyrdict-home-entry-lock');
    try{history.scrollRestoration='manual'}catch{}
    let rootSeenAt=0,released=false;
    const release=()=>{
      if(released)return;
      released=true;
      html.classList.remove('vyrdict-home-entry-lock');
    };
    const ready=()=>{
      const root=document.getElementById('vyrdict-editorial-home');
      if(!root)return false;
      if(!rootSeenAt)rootSeenAt=performance.now();
      const moment=!!document.getElementById('ve-moment-top-style-v10')||!!window.__vyrdictMomentTopV10;
      const signal=!!document.querySelector('#vyrdict-editorial-home .ve-signal-motion')||!!window.__vyrdictSignalLandscapeV6;
      const culture=matchMedia('(max-width:900px)').matches||!!document.getElementById('ve-culture-trio');
      return moment&&signal&&culture;
    };
    const started=performance.now();
    const check=()=>{
      if(ready() || performance.now()-started>1800){release();return}
      requestAnimationFrame(check);
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(check),{once:true});
    else requestAnimationFrame(check);
    addEventListener('pageshow',e=>{if(e.persisted)release()});
  })();<\/script>`;

  const editorial=`
<script src="/homepage-editorial-reference.js?v=${REV}" defer><\/script>
<script src="/search-empty-suggest.js?v=${REV}" defer><\/script>
<script id="vyrdict-desktop-editorial-enhancements-${REV}">(()=>{
  if(!matchMedia('(min-width:901px)').matches)return;
  const srcs=[
    '/homepage-editorial-polish.js?v=${REV}',
    '/homepage-video-pass.js?v=${REV}',
    '/homepage-culture-trio.js?v=${REV}',
    '/homepage-culture-horizontal.js?v=${REV}',
    '/homepage-news-desk.js?v=${REV}'
  ];
  const load=()=>{for(const src of srcs){const s=document.createElement('script');s.src=src;s.defer=true;document.head.appendChild(s)}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();<\/script>`;

  if(html.includes('</head>'))html=html.replace('</head>',css+lock+editorial+'</head>');
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
    body='<!doctype html><html><body style="margin:0;background:#f1efe9;font-family:Arial;display:grid;place-items:center;min-height:100vh"><div>VYRDICT is refreshing. Please reload once.</div></body></html>';
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
