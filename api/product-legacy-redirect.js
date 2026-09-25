module.exports=function handler(req,res){
  const to=String(req.query?.to||'').trim();
  if(!/^[a-z0-9][a-z0-9-]*$/i.test(to)){
    res.statusCode=404;
    res.end('Not found');
    return;
  }
  res.statusCode=308;
  res.setHeader('Location',`/product/${encodeURIComponent(to)}/`);
  res.setHeader('Cache-Control','public, max-age=300, s-maxage=86400');
  res.end();
};
