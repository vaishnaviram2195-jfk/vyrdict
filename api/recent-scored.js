// Public, evidence-verified recent scores only. Do not show score-pending candidates.
const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/products';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';
module.exports=async function(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'method_not_allowed'});
  try{
    const cutoff=new Date(Date.now()-30*86400000).toISOString();
    const qs=new URLSearchParams({
      select:'slug,brand,name,category,viral_score,worth_score,published_at',
      is_active:'eq.true',evidence_status:'eq.verified',
      published_at:'gte.'+cutoff,order:'published_at.desc',limit:'12'
    });
    const r=await fetch(ENDPOINT+'?'+qs.toString(),{
      headers:{apikey:KEY,Authorization:'Bearer '+KEY,accept:'application/json'},
      signal:AbortSignal.timeout(8000)
    });
    if(!r.ok)throw new Error('source_status_'+r.status);
    const data=await r.json();
    const rows=(Array.isArray(data)?data:[]).filter(p=>
      p.slug&&p.name&&p.viral_score!=null&&p.worth_score!=null
      &&Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
      &&Number(p.viral_score)>=0&&Number(p.viral_score)<=100
      &&Number(p.worth_score)>=0&&Number(p.worth_score)<=100
    ).slice(0,4);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=300');
    return res.status(200).json({ok:true,products:rows,window_days:30,updated_at:new Date().toISOString()});
  }catch{
    res.setHeader('Cache-Control','no-store');
    return res.status(503).json({ok:false,products:[],error:'recent_verified_reviews_unavailable'});
  }
};