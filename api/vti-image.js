module.exports=async function handler(req,res){
  try{
    const raw=Array.isArray(req.query?.url)?req.query.url[0]:req.query?.url;
    if(!raw)return res.status(400).send('Missing url');
    let u;
    try{u=new URL(raw)}catch{return res.status(400).send('Invalid url')}
    if(!/^https?:$/.test(u.protocol))return res.status(400).send('Unsupported protocol');
    const h=u.hostname.toLowerCase();
    if(h==='localhost'||h==='127.0.0.1'||h==='::1'||h.endsWith('.local')||/^10\./.test(h)||/^192\.168\./.test(h)||/^169\.254\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h))return res.status(403).send('Blocked host');

    const r=await fetch(u.toString(),{
      redirect:'follow',
      headers:{'user-agent':'Mozilla/5.0 VYRDICT/1.0','accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'}
    });
    if(!r.ok)return res.status(r.status).send('Image fetch failed');
    const type=(r.headers.get('content-type')||'').toLowerCase();
    if(!type.startsWith('image/'))return res.status(415).send('Not an image');
    const buf=Buffer.from(await r.arrayBuffer());
    if(buf.length>8*1024*1024)return res.status(413).send('Image too large');
    res.setHeader('Content-Type',type.split(';')[0]);
    res.setHeader('Cache-Control','public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');
    res.setHeader('X-Content-Type-Options','nosniff');
    return res.status(200).send(buf);
  }catch(e){
    return res.status(502).send('Image proxy error');
  }
};
