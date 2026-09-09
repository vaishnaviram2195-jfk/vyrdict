const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/products';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';

module.exports=async function handler(req,res){
  try{
    const qs=new URLSearchParams({
      select:'id,slug,brand,name,category,viral_score,worth_score,verdict,viral_status,image_url',
      is_active:'eq.true',
      evidence_status:'eq.verified',
      viral_score:'gte.90',
      worth_score:'lt.70',
      image_url:'not.is.null',
      order:'viral_score.desc,worth_score.asc',
      limit:'12'
    });
    const r=await fetch(`${SB}?${qs}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}});
    if(!r.ok)throw new Error(`products ${r.status}`);
    const products=await r.json();
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=120, stale-while-revalidate=300');
    res.status(200).json({products});
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({products:[],error:'skip_feed_unavailable'});
  }
};
