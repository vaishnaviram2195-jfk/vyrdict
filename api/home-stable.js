const fs=require('fs');
const path=require('path');
const REV='20261006-product-engagement-1';
let cached='';

function html(){
  if(cached)return cached;
  cached=fs.readFileSync(path.join(process.cwd(),'stable-home.html'),'utf8');
  return cached;
}

module.exports=async function handler(req,res){
  const incomingHost=String(req?.headers?.['x-forwarded-host']||req?.headers?.host||'').split(',')[0].trim().toLowerCase();
  if(incomingHost==='www.vyrdict.com'){
    res.setHeader('Location','https://vyrdict.com/');
    res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
    return res.status(308).send('');
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','no-store, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control','no-store');
  res.setHeader('Surrogate-Control','no-store');
  res.setHeader('Pragma','no-cache');
  res.setHeader('X-VYRDICT-Home-Revision',REV);
  return res.status(200).send(html());
};
