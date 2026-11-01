const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/products';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';

const ACTIVE_STATUSES=new Set(['peak','viral-now','surging','breaking_out','breakout','flash_viral','resurgence','resurgent','viral','rising']);
const STATUS_BOOST={peak:8,'viral-now':7,surging:7,breaking_out:6,breakout:6,flash_viral:5,rising:5,resurgence:4,resurgent:4,viral:3};

function freshnessTs(p){
  return Math.max(0,...[p.last_verified_at,p.published_at,p.created_at].map(v=>v?Date.parse(v):0).filter(Number.isFinite));
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
    order:'last_verified_at.desc.nullslast,published_at.desc.nullslast',
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
    // A separate, fully scored recency mode for the homepage.
    // Unlike the momentum edit, only original publication dates count as new.
    if(String(req.query?.mode||'')==='recent'){
      const rows=await fetchWindow(30);
      const cutoff=Date.now()-7*86400000;
      const recent=rows.filter(p=>
        p.slug&&p.name&&p.image_url
        && p.evidence_status==='verified'
        && p.published_at&&Date.parse(p.published_at)>=cutoff
        && p.viral_score!=null&&p.worth_score!=null
        && Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
        && Number(p.viral_score)>=0&&Number(p.viral_score)<=100
        && Number(p.worth_score)>=0&&Number(p.worth_score)<=100
      ).sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,Math.min(limit,4));
      res.setHeader('Cache-Control','public, max-age=0, s-maxage=300, stale-while-revalidate=300');
      return res.status(200).json({ok:true,products:recent,window_days:7,generated_at:new Date().toISOString(),policy:'newly_published_verified_scored_products_only'});
    }
    // The live viral feed must have actual recent source-backed trend evidence.
    // Rank snapshots are generated only from non-zero publisher/source pulses
    // observed in the last seven days. Do not silently expand to 30-day old scores.
    const rankUrl='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-rankings';
    const rankResponse=await fetch(rankUrl,{headers:{accept:'application/json'},signal:AbortSignal.timeout(10000)});
    if(!rankResponse.ok)throw new Error('current_rankings_'+rankResponse.status);
    const rankData=await rankResponse.json();
    const calculated=Date.parse(rankData.calculated_at||'');
    const freshCalculation=Number.isFinite(calculated)&&now-calculated<12*3600000&&calculated<=now+60000;
    const allowed=freshCalculation&&Array.isArray(rankData.categories)
      ?rankData.categories.flatMap(c=>(c.items||[]).map(i=>({...i.product,trend_score:Number(i.trend_score||0),current_signal:true,rank_week:rankData.week_start,is_new_review:Boolean(i.is_new)})))
      :[];
    const products=allowed.filter(p=>
      p&&p.slug&&p.image_url&&p.evidence_status==='verified'
      && p.viral_score!=null&&p.worth_score!=null
      && Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
    ).sort((a,b)=>b.trend_score-a.trend_score).slice(0,limit);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=120, stale-while-revalidate=120');
    return res.status(200).json({
      products,
      window_days:7,
      generated_at:new Date().toISOString(),
      rank_calculated_at:rankData.calculated_at||null,
      freshness_policy:'Current week: actual recent independently linked trend mentions; older reviews retain original publication and verification dates; no stale fallback'
    });
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({products:[],error:'viral_feed_unavailable'});
  }
};
