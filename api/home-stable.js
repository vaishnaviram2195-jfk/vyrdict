const homeHandler=require('./home');

const REV='20261003-stability-freeze-1';
const HOME_CONFLICTS=[
  'homepage-simplify.js','homepage-editorial-now.js','homepage-hero-variety.js','mobile-current-hero.js',
  'home-featured-rows.js','weekly-ranking-expand.js','skip-list-reliable.js','trending-index-claw.js',
  'mobile-home-section-guard.js','homepage-layout-restore.js','homepage-signal-landscape.js',
  'homepage-editorial-bootstrap.js','homepage-editorial-legacy-guard.js','mobile-home-stability.js',
  'top-nav-section-fix.js','category-expander-failsafe.js','social-links-fix.js',
  'product-card-alignment.js','worth-show-less-fix.js','navigation-context.js','navigation-guard.js'
]

function removeScriptByName(html,name){
  return html.replace(/<script\b[^>]*\bsrc=(["'])([^"']*)\1[^>]*>\s*<\/script>/gi,(tag,_q,src)=>src.includes(name)?'':tag);
}

function currentHomePatch(input){
  let html=String(input||'');
  for(const name of HOME_CONFLICTS)html=removeScriptByName(html,name);

  if(html.includes('<html')&&!html.includes('data-vyrdict-home-rev=')){
    html=html.replace('<html','<html data-vyrdict-home-rev="'+REV+'"');
  }

  const css=`<style id="vyrdict-editorial-restore-${REV}">html,body{background:#f1efe9!important}</style>`;

  const editorial=`<script src="/homepage-editorial-reference.js?v=${REV}" defer><\/script>`;

  if(html.includes('</head>'))html=html.replace('</head>',css+editorial+'</head>');
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
