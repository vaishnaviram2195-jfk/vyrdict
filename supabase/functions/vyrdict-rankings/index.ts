const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const HDR = { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` };
const PREFERRED = ['beauty','beauty-tech','skincare','makeup','hair','perfume','gifts','fashion','shoes','home','wellness','fitness','tech','food','pets','travel','kids','toys','stationery','books','kitchen'];

async function getJson(path:string){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{headers:HDR});
  if(!r.ok) throw new Error(`REST ${r.status}: ${await r.text()}`);
  return r.json();
}
function addDays(iso:string,days:number){
  const d=new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate()+days);
  return d.toISOString().slice(0,10);
}
function categoryOrder(key:string){
  const i=PREFERRED.indexOf(key);
  return i === -1 ? 1000 : i;
}

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS') return new Response(null,{headers:{
    'access-control-allow-origin':'*',
    'access-control-allow-methods':'GET,OPTIONS',
    'access-control-allow-headers':'content-type'
  }});
  if(req.method!=='GET') return new Response('Method not allowed',{status:405});

  try{
    const latest=await getJson('viral_weekly_rankings?select=week_start&order=week_start.desc&limit=1');
    if(!latest.length){
      return new Response(JSON.stringify({week_start:null,week_end:null,categories:[]}),{headers:{
        'content-type':'application/json; charset=utf-8',
        'cache-control':'no-store',
        'access-control-allow-origin':'*'
      }});
    }

    const weekStart=latest[0].week_start;
    const rows=await getJson(`viral_weekly_rankings?select=week_start,category_key,category_label,rank,product_id,trend_score,previous_rank,movement,movement_label,is_new,calculated_at&week_start=eq.${weekStart}&order=category_key.asc,rank.asc`);
    const ids=[...new Set(rows.map((r:any)=>Number(r.product_id)).filter(Boolean))];
    const products=ids.length
      ? await getJson(`products?select=id,slug,brand,name,category,viral_score,worth_score,verdict,viral_status,image_url,published_at,last_verified_at,evidence_status,momentum_score&id=in.(${ids.join(',')})`)
      : [];
    const byId=new Map(products.map((p:any)=>[Number(p.id),p]));

    const keys=[...new Set(rows.map((r:any)=>String(r.category_key)).filter(Boolean))]
      .sort((a,b)=>categoryOrder(a)-categoryOrder(b) || a.localeCompare(b));

    const categories=keys.map(key=>{
      const categoryRows=rows.filter((r:any)=>r.category_key===key);
      const items=categoryRows
        .sort((a:any,b:any)=>Number(a.rank)-Number(b.rank))
        .map((r:any)=>({
          rank:Number(r.rank),
          trend_score:Number(r.trend_score),
          previous_rank:r.previous_rank==null?null:Number(r.previous_rank),
          movement:r.movement==null?null:Number(r.movement),
          movement_label:r.movement_label,
          is_new:Boolean(r.is_new),
          product:byId.get(Number(r.product_id))||null
        }))
        .filter((x:any)=>x.product);
      const label=categoryRows[0]?.category_label||key;
      return {key,label,mode:items.length>=3?'top3':'emerging',items};
    }).filter((c:any)=>c.items.length);

    const calculatedAt=rows.reduce((max:string|null,r:any)=>!max||r.calculated_at>max?r.calculated_at:max,null);
    return new Response(JSON.stringify({
      week_start:weekStart,
      week_end:addDays(weekStart,6),
      calculated_at:calculatedAt,
      methodology:'weekly-trend-v2-current-source-backed-pulse-only',
      qualification:{minimum_trend_score:60,top3_minimum_items:3},
      categories
    }),{headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'public, max-age=300, stale-while-revalidate=3600',
      'access-control-allow-origin':'*',
      'x-content-type-options':'nosniff'
    }});
  }catch(e){
    console.error('rankings',String(e));
    return new Response(JSON.stringify({error:'rankings_unavailable'}),{status:500,headers:{
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
      'access-control-allow-origin':'*'
    }});
  }
});