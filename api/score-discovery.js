const UPSTREAM='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-score-discovery';

module.exports=async function handler(req,res){
  try{
    const raw=Array.isArray(req.query?.slug)?req.query.slug[0]:req.query?.slug;
    const slug=decodeURIComponent(String(raw||'').trim());
    const market=String(Array.isArray(req.query?.market)?req.query.market[0]:req.query?.market||'CA').toUpperCase()==='US'?'US':'CA';
    if(!slug||!/^[a-z0-9][a-z0-9-]*$/i.test(slug)){
      res.setHeader('Content-Type','text/html; charset=utf-8');
      res.setHeader('Cache-Control','no-store');
      return res.status(400).send('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>VYRDICT</title><p>Product unavailable.</p>');
    }
    const upstream=await fetch(`${UPSTREAM}?slug=${encodeURIComponent(slug)}&market=${market}`,{headers:{accept:'text/html','x-vyrdict-proxy':'1'},cache:'no-store'});
    let html=await upstream.text();
    if(!upstream.ok)throw new Error(`score discovery ${upstream.status}`);
    html=html
      .replaceAll('https://vyrdict.com/#/product/','https://vyrdict.com/product/')
      .replaceAll("const productUrl=slug?'https://vyrdict.com/#/product/'+encodeURIComponent(slug):'https://vyrdict.com/'","const productUrl=slug?'https://vyrdict.com/product/'+encodeURIComponent(slug)+'/':'https://vyrdict.com/'");
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma','no-cache');
    res.setHeader('X-Content-Type-Options','nosniff');
    return res.status(200).send(html);
  }catch(e){
    console.error(e);
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    return res.status(502).send('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>VYRDICT</title><body style="font-family:Arial;background:#f4ede5;color:#171511;padding:28px"><h1>Score Discovery is temporarily unavailable.</h1><p>Please return to the product and try again.</p></body>');
  }
};
