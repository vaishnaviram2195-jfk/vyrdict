const productHandler=require('./product-seo');
const categoryHandler=require('./category-seo');

const REV='20260930-editorial-type-15';

function injectTypography(input){
  let html=String(input||'');
  if(!/<html[\s>]/i.test(html))return html;
  const tag=`<script src="/site-typography-polish.js?v=${REV}" defer><\/script>`;
  if(!html.includes('/site-typography-polish.js')&&html.includes('</head>'))html=html.replace('</head>',tag+'</head>');
  return html;
}

module.exports=async function handler(req,res){
  const kind=String(req?.query?.kind||'').toLowerCase();
  const target=kind==='product'?productHandler:kind==='category'?categoryHandler:null;
  if(!target)return res.status(404).send('Not found');

  let statusCode=200;
  let body='';
  let sent=false;
  const headers={};
  const proxy={
    setHeader(name,value){headers[String(name).toLowerCase()]=value;},
    status(code){statusCode=Number(code)||200;return proxy;},
    send(value){body=value==null?'':String(value);sent=true;return proxy;}
  };

  try{
    await target(req,proxy);
  }catch(err){
    console.error(err);
    statusCode=500;
    body='<!doctype html><title>VYRDICT</title><h1>Page temporarily unavailable</h1>';
    sent=true;
  }

  if(!sent&&statusCode===200)statusCode=500;
  if(/text\/html/i.test(String(headers['content-type']||'text/html')))body=injectTypography(body);
  for(const [name,value] of Object.entries(headers))res.setHeader(name,value);
  if(!headers['content-type'])res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('X-VYRDICT-Type-Revision',REV);
  return res.status(statusCode).send(body);
};
