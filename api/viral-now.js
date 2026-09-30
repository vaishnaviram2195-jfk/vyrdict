const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/products';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';

const STATUS_BOOST={
  peak:7,'viral-now':6,surging:6,breaking_out:5,breakout:5,flash_viral:4,resurgence:3,resurgent:3,viral:3,mainstay:1
};

function freshnessTs(p){
  return Math.max(...[p.published_at,p.last_verified_at,p.created_at].map(v=>v?Date.parse(v):0));
}

function score(p,now){
  const ageDays=Math.max(0,(now-freshnessTs(p))/86400000);
  const viral=Number(p.viral_score||0),momentum=Number(p.momentum_score||0),confidence=Number(p.viral_confidence||0),worth=Number(p.worth_score||0);
  const status=String(p.viral_status||'').toLowerCase();
  return viral*.48+momentum*.32+confidence*.12+worth*.08+(STATUS_BOOST[status]||0)-ageDays*1.35;
}

async function fetchWindow(days){
  const cutoff=new Date(Date.now()-days*86400000).toISOString();
  const qs=new URLSearchParams({
    select:'id,slug,brand,name,category,image_url,viral_score,worth_score,momentum_score,viral_status,viral_confidence,evidence_status,evidence_confidence,created_at,published_at,last_verified_at',
    is_active:'eq.true',
    evidence_status:'eq.verified',
    image_url:'not.is.null',
    or:`(published_at.gte.${cutoff},last_verified_at.gte.${cutoff},created_at.gte.${cutoff})`,
    limit:'120'
  });
  const r=await fetch(`${SB}?${qs}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}});
  if(!r.ok)throw new Error(`viral-now ${r.status}`);
  return r.json();
}

module.exports=async function handler(req,res){
  try{
    const requested=Number(req.query?.limit||12);
    const limit=Math.max(3,Math.min(Number.isFinite(requested)?requested:12,24));
    let windowDays=10;
    let rows=await fetchWindow(windowDays);
    const qualify=r=>{
      const status=String(r.viral_status||'').toLowerCase();
      const confidence=String(r.evidence_confidence||'').toLowerCase();
      return Number(r.viral_score||0)>=85&&Number(r.momentum_score||0)>=80&&status!=='niche'&&(confidence==='high'||confidence==='medium');
    };
    let products=rows.filter(qualify);
    if(products.length<Math.min(6,limit)){
      windowDays=21;
      rows=await fetchWindow(windowDays);
      products=rows.filter(qualify);
    }
    const now=Date.now();
    products.sort((a,b)=>score(b,now)-score(a,now)||freshnessTs(b)-freshnessTs(a));
    products=products.slice(0,limit).map(p=>({...p,freshness_at:new Date(freshnessTs(p)).toISOString()}));
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=900');
    res.status(200).json({products,window_days:windowDays,generated_at:new Date().toISOString()});
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({products:[],error:'viral_feed_unavailable'});
  }
};
