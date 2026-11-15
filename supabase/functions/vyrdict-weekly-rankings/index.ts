const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const HDR = { apikey: SERVICE_KEY, Authorization: 'Bearer ' + SERVICE_KEY };
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,OPTIONS', 'access-control-allow-headers': 'content-type' };
const DAYS = 7;
const MIN_PULSE = 30;
const allowedCategories = ['Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
const normalize = (value:string) => String(value||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
async function get(path:string){
  const response = await fetch(SUPABASE_URL + '/rest/v1/' + path, { headers: HDR, cache:'no-store' });
  if(!response.ok)throw new Error('trend query '+response.status);
  return await response.json();
}
function startOfWeek():string{
  const today = new Date(), start = new Date(Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - (start.getUTCDay()+6)%7);
  return start.toISOString().slice(0,10);
}
function isQualified(p:any){
  return !!(p&&p.is_active===true&&p.evidence_status==='verified'&&p.slug&&p.image_url&&Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score)));
}
Deno.serve(async (req:Request) => {
  if(req.method==='OPTIONS')return new Response(null,{headers:CORS});
  if(req.method!=='GET')return Response.json({error:'method_not_allowed'},{status:405,headers:CORS});
  try{
    const u = new URL(req.url);
    const category = u.searchParams.get('category') || 'All';
    const normalizedCategory = normalize(category);
    if(normalizedCategory!=='all'&&!allowedCategories.some(c=>normalize(c)===normalizedCategory))return Response.json({error:'invalid_category'},{status:400,headers:CORS});
    const week = startOfWeek();
    const rows = await get('viral_weekly_rankings?select=week_start,category_key,category_label,rank,product_id,trend_score,is_new,calculated_at&week_start=eq.'+week+'&order=category_key.asc,rank.asc&limit=200');
    const ids = [...new Set(rows.map((x:any)=>Number(x.product_id)).filter((id:number)=>Number.isInteger(id)&&id>0))];
    const since = new Date(Date.now()-DAYS*86400000).toISOString();
    const products = ids.length ? await get('products?select=id,slug,brand,name,category,subcategory,image_url,viral_score,worth_score,momentum_score,verdict,viral_status,published_at,last_verified_at,evidence_status,is_active&id=in.('+ids.join(',')+')&limit=200') : [];
    const pulses = ids.length ? await get('vyrdict_trend_pulses?select=product_id,pulse_score,mention_count,unique_publishers,newest_mention_at,source_urls&product_id=in.('+ids.join(',')+')&newest_mention_at=gte.'+encodeURIComponent(since)+'&pulse_score=gte.'+MIN_PULSE+'&mention_count=gte.1&unique_publishers=gte.1&order=newest_mention_at.desc&limit=400') : [];
    const byId = new Map(products.map((p:any)=>[Number(p.id),p]));
    const recent = new Map<number,any>();
    for(const pulse of pulses){
      const id=Number(pulse.product_id);
      if(!recent.has(id)&&Array.isArray(pulse.source_urls)&&pulse.source_urls.some((s:any)=>/^https?:\/\//i.test(String(s||''))))recent.set(id,pulse);
    }
    const qualified=rows.map((r:any)=>{
      const p:any=byId.get(Number(r.product_id)),pulse=recent.get(Number(r.product_id));
      if(!isQualified(p)||!pulse||normalize(p.category)!==normalize(r.category_label))return null;
      return {
        id:p.id,slug:p.slug,brand:p.brand,name:p.name,category:p.category,subcategory:p.subcategory,
        image_url:p.image_url,viral_score:p.viral_score,worth_score:p.worth_score,momentum_score:p.momentum_score,
        verdict:p.verdict,viral_status:p.viral_status,published_at:p.published_at,last_verified_at:p.last_verified_at,evidence_status:p.evidence_status,
        weekly_rank:Number(r.rank),trend_score:Number(r.trend_score),category_key:r.category_key,is_new:Boolean(r.is_new),
        recent_evidence_count:Number(pulse.mention_count),recent_source_domains:Number(pulse.unique_publishers),
        newest_mention_at:pulse.newest_mention_at,current_signal:true
      };
    }).filter(Boolean).filter((p:any)=>normalizedCategory==='all'||normalize(p.category)===normalizedCategory);
    qualified.sort((a:any,b:any)=>b.trend_score-a.trend_score||Date.parse(b.newest_mention_at)-Date.parse(a.newest_mention_at));
    const generatedAt=new Date().toISOString();
    return Response.json({
      category,category_key:normalizedCategory,week_start:week,calculated_at:generatedAt,
      last_rank_calculated_at:rows.reduce((s:string|null,r:any)=>!s||String(r.calculated_at)>s?String(r.calculated_at):s,null),
      methodology:'weekly_rankings_rechecked_against_dated_7_day_source_pulses',
      freshness_days:DAYS,products:qualified
    },{headers:{...CORS,'cache-control':'public, max-age=0, s-maxage=120, stale-while-revalidate=60','x-content-type-options':'nosniff'}});
  }catch(error){
    console.error('weekly-trending-feed',String(error));
    return Response.json({error:'trending_feed_unavailable',products:[]},{status:500,headers:{...CORS,'cache-control':'no-store'}});
  }
});