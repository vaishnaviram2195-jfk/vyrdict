const fs=require('fs');
const path=require('path');

const REV='20260930-editorial-type-15';
const ALLOWED=new Set(['about','careers','editorial-policy','evidence','how-vyrdict-scores','privacy','suggest-product','terms']);

module.exports=function handler(req,res){
  const page=String(req?.query?.page||'').toLowerCase();
  if(!ALLOWED.has(page))return res.status(404).send('Not found');
  try{
    const file=path.join(process.cwd(),page+'.html');
    let html=fs.readFileSync(file,'utf8');
    const tag=`<script src="/site-typography-polish.js?v=${REV}" defer><\/script>`;
    if(!html.includes('/site-typography-polish.js')&&html.includes('</head>'))html=html.replace('</head>',tag+'</head>');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=60, must-revalidate');
    res.setHeader('X-VYRDICT-Type-Revision',REV);
    return res.status(200).send(html);
  }catch(err){
    console.error(err);
    res.setHeader('Cache-Control','no-store');
    return res.status(500).send('<!doctype html><title>VYRDICT</title><h1>Page temporarily unavailable</h1>');
  }
};
