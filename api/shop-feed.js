// Public, read-only feed. Uses a publishable Supabase key and RLS; never a service-role key.
const BASE='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';
const HEADERS={apikey:KEY,Authorization:'Bearer '+KEY,Accept:'application/json'};
async function rows(table,qs){
  const r=await fetch(BASE+table+'?'+qs.toString(),{headers:HEADERS,signal:AbortSignal.timeout(9500)});
  if(!r.ok)throw Error('feed-data-'+r.status);
  const d=await r.json();return Array.isArray(d)?d:[];
}
const safeSlug=s=>/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s||'')?s:'';
module.exports=async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'method_not_allowed'});
 try{
  const slug=safeSlug(String(req.query?.slug||''));
  const list=new URLSearchParams({select:'id,slug,title,dek,category,cover_url,instagram_url,editorial_url,published_at',status:'eq.published',order:'published_at.desc',limit:slug?'1':'60'});
  list.append('published_at','lte.'+new Date().toISOString());
  if(slug)list.set('slug','eq.'+slug);
  const edits=await rows('vyrdict_social_edits',list);
  if(!edits.length){res.setHeader('Cache-Control','public,max-age=0,s-maxage=60');return res.status(200).json({edits:[],count:0})}
  const ids=edits.map(e=>e.id).filter(Number.isFinite);
  const joins=await rows('vyrdict_social_edit_products',new URLSearchParams({select:'edit_id,product_id,sort_order,editor_note',edit_id:'in.('+ids.join(',')+')',order:'sort_order.asc',limit:'600'}));
  const pids=[...new Set(joins.map(j=>j.product_id).filter(Number.isFinite))];
  let products=[];
  if(pids.length)products=await rows('products',new URLSearchParams({select:'id,slug,brand,name,category,worth_score,viral_score,image_url,verdict',id:'in.('+pids.join(',')+')',is_active:'eq.true',evidence_status:'eq.verified',limit:'600'}));
  const byId=new Map(products.map(p=>[p.id,p]));
  const formatted=edits.map(e=>({
    ...e,
    products:joins.filter(j=>j.edit_id===e.id&&byId.has(j.product_id)).map(j=>({...byId.get(j.product_id),editor_note:j.editor_note||''}))
  }));
  res.setHeader('Cache-Control','public,max-age=0,s-maxage=60,stale-while-revalidate=180');
  res.setHeader('X-Content-Type-Options','nosniff');
  return res.status(200).json({edits:formatted,count:formatted.length});
 }catch(err){res.setHeader('Cache-Control','no-store');return res.status(503).json({edits:[],error:'feed_temporarily_unavailable'})}
};
