const DATA='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-seo-sitemap-data';
const xml=v=>String(v??'').replace(/[<>&'\"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]||c));
const day=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?'':d.toISOString().slice(0,10)};
const slug=s=>String(s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
module.exports=async function handler(req,res){
  try{
    const r=await fetch(DATA,{headers:{accept:'application/json'}});if(!r.ok)throw new Error(`sitemap data ${r.status}`);
    const data=await r.json();const products=Array.isArray(data.products)?data.products:[];
    const staticPages=[
      ['https://vyrdict.com/','daily'],
      ['https://vyrdict.com/how-vyrdict-scores.html','monthly'],
      ['https://vyrdict.com/editorial-policy.html','monthly'],
      ['https://vyrdict.com/suggest-product.html','monthly'],
      ['https://vyrdict.com/careers','weekly']
    ];
    const urls=[];
    for(const [loc,freq] of staticPages)urls.push(`<url><loc>${xml(loc)}</loc><changefreq>${freq}</changefreq></url>`);
    const categoryDates=new Map();
    for(const p of products){if(!p?.category)continue;const key=String(p.category),d=day(p.last_verified_at);if(d&&(!categoryDates.get(key)||d>categoryDates.get(key)))categoryDates.set(key,d);else if(!categoryDates.has(key))categoryDates.set(key,'')}
    for(const [category,last] of [...categoryDates.entries()].sort((a,b)=>a[0].localeCompare(b[0]))){const loc=`https://vyrdict.com/category/${slug(category)}/`;urls.push(`<url><loc>${xml(loc)}</loc>${last?`<lastmod>${last}</lastmod>`:''}<changefreq>weekly</changefreq></url>`)}
    for(const p of products){if(!p?.slug)continue;const loc=`https://vyrdict.com/product/${encodeURIComponent(p.slug)}/`,last=day(p.last_verified_at);urls.push(`<url><loc>${xml(loc)}</loc>${last?`<lastmod>${last}</lastmod>`:''}<changefreq>weekly</changefreq></url>`)}
    const body=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
    res.setHeader('Content-Type','application/xml; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=1800, stale-while-revalidate=86400');return res.status(200).send(body);
  }catch(e){console.error(e);res.setHeader('Cache-Control','no-store');return res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>')}
};
