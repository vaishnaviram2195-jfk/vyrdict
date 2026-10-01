const fs=require('fs');
const path=require('path');

const REV='20261001-search-suggest-1';
let shell='';

module.exports=function handler(req,res){
  try{
    if(!shell)shell=fs.readFileSync(path.join(process.cwd(),'index.html'),'utf8');
    const tag=`<script src="/search-empty-suggest.js?v=${REV}" defer></script>`;
    let html=shell;
    if(!html.includes('/search-empty-suggest.js')){
      html=html.includes('</body>')?html.replace('</body>',tag+'</body>'):html+tag;
    }
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).send(html);
  }catch(err){
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    return res.status(500).send('Search is temporarily unavailable.');
  }
};
