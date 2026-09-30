const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/products';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';

const ACTIVE_STATUSES=new Set(['peak','viral-now','surging','breaking_out','breakout','flash_viral','resurgence','resurgent','viral']);
const STATUS_BOOST={peak:8,'viral-now':7,surging:7,breaking_out:6,breakout:6,flash_viral:5,resurgence:4,resurgent:4,viral:3};

function freshnessTs(p){
  return Math.max(...[p.last_verified_at,p.published_at,p.created_at].map(v=>v?Date.parse(v):0));
}

function ageDays(p,now){
  const ts=freshnessTs(p);
  return ts?Math.max(0,(now-ts)/86400000):999;
}

function score(p,now){
  const age=ageDays(p,now);
  const viral=Number(p.viral_score||0),momentum=Number(p.momentum_score||0),confidence=Number(p.viral_confidence||0),worth=Number(p.worth_score||0);
  const status=String(p.viral_status||'').toLowerCase();
  return viral*.46+momentum*.34+confidence*.12+worth*.08+(STATUS_BOOST[status]||0)-age*2.25;
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
    const now=Date.now();
    const rows=await fetchWindow(10);
    const qualify=(r,maxAge)=>{
      const status=String(r.viral_status||'').toLowerCase();
      const confidence=String(r.evidence_confidence||'').toLowerCase();
      return ACTIVE_STATUSES.has(status)
        && Number(r.viral_score||0)>=85
        && Number(r.momentum_score||0)>=80
        && (confidence==='high'||confidence==='medium')
        && ageDays(r,now)<=maxAge;
    };

    let windowDays=7;
    let products=rows.filter(r=>qualify(r,7));
    if(products.length<Math.min(3,limit)){
      windowDays=10;
      products=rows.filter(r=>qualify(r,10));
    }

    products.sort((a,b)=>score(b,now)-score(a,now)||freshnessTs(b)-freshnessTs(a));
    products=products.slice(0,limit).map(p=>({...p,freshness_at:new Date(freshnessTs(p)).toISOString()}));

    res.setHeader('Cache-Control','public, max-age=0, s-maxage=120, stale-while-revalidate=300');
    res.status(200).json({
      products,
      window_days:windowDays,
      generated_at:new Date().toISOString(),
      freshness_policy:'verified active viral momentum only; 7-day primary window, 10-day emergency fallback'
    });
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({products:[],error:'viral_feed_unavailable'});
  }
};
