const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/vyrdict_stories';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';

module.exports=async function handler(req,res){
  try{
    const requested=Number(req.query?.limit||4);
    const limit=Math.max(1,Math.min(Number.isFinite(requested)?requested:4,8));
    const qs=new URLSearchParams({
      select:'id,slug,headline,dek,category,image_url,image_alt,source_label,source_url,instagram_url,published_at,is_featured',
      is_active:'eq.true',
      status:'eq.published',
      published_at:`lte.${new Date().toISOString()}`,
      image_url:'not.is.null',
      order:'is_featured.desc,published_at.desc',
      limit:String(limit)
    });
    const r=await fetch(`${SB}?${qs}`,{
      headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}
    });
    if(!r.ok)throw new Error(`stories ${r.status}`);
    const stories=await r.json();
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({stories});
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({stories:[],error:'stories_feed_unavailable'});
  }
};
