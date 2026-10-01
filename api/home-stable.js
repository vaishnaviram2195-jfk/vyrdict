const homeHandler=require('./home');

const REV='20261001-editorial-restore-2';
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
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re=new RegExp('<script\\b[^>]*src=["\\'][^"\\']*'+escaped+'[^"\\']*["\\'][^>]*>\\s*<\\/script>','gi');
  return html.replace(re,'');
}

function currentHomePatch(input){
  let html=String(input||'');
  for(const name of HOME_CONFLICTS)html=removeScriptByName(html,name);

  if(html.includes('<html')&&!html.includes('data-vyrdict-home-rev=')){
    html=html.replace('<html','<html data-vyrdict-home-rev="'+REV+'"');
  }

  const css=`<style id="vyrdict-editorial-restore-${REV}">
html,body{background:#f1efe9!important}
html.vyrdict-home-entry-lock{overflow:hidden!important;scroll-behavior:auto!important}
html.vyrdict-home-entry-lock body{overflow:hidden!important}
html[data-vyrdict-home-rev="${REV}"] body .hero,
html[data-vyrdict-home-rev="${REV}"] body .section{display:none!important}
html[data-vyrdict-home-rev="${REV}"] body .ve-hero{display:grid!important}
html[data-vyrdict-home-rev="${REV}"] body .ve-legacy-home{display:none!important}
html[data-vyrdict-home-rev="${REV}"] #vyrdict-editorial-home{display:block!important;visibility:visible!important;opacity:1!important}
</style>`;

  const lock=`<script id="vyrdict-editorial-entry-${REV}">(()=>{
    window.__VYRDICT_HOME_REV='${REV}';
    if((location.pathname||'/')!=='/')return;
    document.documentElement.classList.add('vyrdict-home-entry-lock');
    try{history.scrollRestoration='manual'}catch{}
    try{window.scrollTo(0,0)}catch{}
    try{for(const k of Object.keys(localStorage)){if(/^vyrdict:(?:bundle-cache|home|hero|homepage)/i.test(k))localStorage.removeItem(k)}}catch{}
    const release=()=>{
      const root=document.getElementById('vyrdict-editorial-home');
      if(!root)return false;
      document.documentElement.classList.remove('vyrdict-home-entry-lock');
      try{window.scrollTo(0,0)}catch{}
      return true;
    };
    const start=()=>{
      let tries=0;
      const check=()=>{
        if(release())return;
        if(tries++<90)requestAnimationFrame(check);
        else document.documentElement.classList.remove('vyrdict-home-entry-lock');
      };
      requestAnimationFrame(check);
    };
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
    addEventListener('pageshow',()=>setTimeout(release,20));
  })();<\/script>`;

  const editorial=`
<script src="/homepage-editorial-reference.js?v=${REV}" defer><\/script>
<script src="/homepage-editorial-polish.js?v=${REV}" defer><\/script>
<script src="/homepage-video-pass.js?v=${REV}" defer><\/script>
<script src="/homepage-culture-trio.js?v=${REV}" defer><\/script>
<script src="/homepage-culture-horizontal.js?v=${REV}" defer><\/script>
<script src="/homepage-news-desk.js?v=${REV}" defer><\/script>`;

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