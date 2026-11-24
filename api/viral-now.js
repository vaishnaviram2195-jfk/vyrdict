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

// A curated editorial companion to the Black Friday Instagram carousel.
// Keep it separate from the homepage's strict "newly published within 30 days" feed.
const BLACK_FRIDAY_SLUGS=Object.freeze([
  'glow-recipe-fresh-slices-eye-mask',
  'touchland-starbucks-seasonal-bearista-set',
  'medicube-nad-egf-firming-multi-balm',
  'shark-depuffi-fh220',
  'oura-ring-5'
]);

async function fetchBlackFriday(){
  const qs=new URLSearchParams({
    select:'id,slug,brand,name,category,image_url,viral_score,worth_score,evidence_status,evidence_confidence,published_at,last_verified_at',
    slug:'in.('+BLACK_FRIDAY_SLUGS.join(',')+')',
    is_active:'eq.true',
    evidence_status:'eq.verified',
    limit:'5'
  });
  const r=await fetch(`${SB}?${qs}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}});
  if(!r.ok)throw new Error('black_friday_verified_feed_'+r.status);
  const rows=await r.json();
  const bySlug=new Map(rows.map(p=>[p.slug,p]));
  return BLACK_FRIDAY_SLUGS.map(slug=>bySlug.get(slug)).filter(p=>
    p&&p.slug&&p.name&&p.image_url&&p.evidence_status==='verified'
    && ['high','medium'].includes(p.evidence_confidence)
    && p.last_verified_at
    && p.viral_score!=null&&p.worth_score!=null
    && Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
    && Number(p.viral_score)>=0&&Number(p.viral_score)<=100
    && Number(p.worth_score)>=0&&Number(p.worth_score)<=100
  );
}

module.exports=async function handler(req,res){
  try{
    const requested=Number(req.query?.limit||12);
    const limit=Math.max(3,Math.min(Number.isFinite(requested)?requested:12,24));
    const now=Date.now();
    if(String(req.query?.mode||'')==='black-friday'){
      const products=await fetchBlackFriday();
      res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=30');
      return res.status(200).json({
        ok:true,
        complete:products.length===BLACK_FRIDAY_SLUGS.length,
        products,
        series:'Black Friday / Your feed says buy. We have notes.',
        policy:'curated_existing_verified_reviews; early_ratings_explicitly_labeled; not_a_promise_of_discounts',
        generated_at:new Date().toISOString()
      });
    }
    // The homepage's newest reviewed products: all checks completed, with genuine publication dates.
    if(String(req.query?.mode||'')==='recent'){
      const rows=await fetchWindow(30);
      const cutoff=Date.now()-30*86400000;
      const recent=rows.filter(p=>
        p&&p.slug&&p.name&&p.image_url
        && p.evidence_status==='verified'&&p.evidence_confidence==='high'
        && p.published_at&&Date.parse(p.published_at)>=cutoff
        && p.last_verified_at&&Date.parse(p.last_verified_at)>=cutoff
        && p.viral_score!=null&&p.worth_score!=null
        && Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
        && Number(p.viral_score)>=0&&Number(p.viral_score)<=100
        && Number(p.worth_score)>=0&&Number(p.worth_score)<=100
      ).sort((a,b)=>Date.parse(b.published_at)-Date.parse(a.published_at)).slice(0,limit);
      res.setHeader('Cache-Control','public, max-age=0, s-maxage=120, stale-while-revalidate=60');
      return res.status(200).json({ok:true,products:recent,window_days:30,generated_at:new Date().toISOString(),policy:'published_and_reviewed_within_30_days_verified_high_confidence_scored_only'});
    }
    // The live viral feed must have actual recent source-backed trend evidence.
    // Rank snapshots are generated only from non-zero publisher/source pulses
    // observed in the last seven days. Do not silently expand to 30-day old scores.
    const rankUrl='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings?category=All';
    const rankResponse=await fetch(rankUrl,{headers:{accept:'application/json'},signal:AbortSignal.timeout(10000)});
    if(!rankResponse.ok)throw new Error('current_trending_'+rankResponse.status);
    const rankData=await rankResponse.json();
    const allowed=Array.isArray(rankData.products)?rankData.products:[];
    const products=allowed.filter(p=>
      p&&p.slug&&p.image_url&&p.current_signal===true&&p.evidence_status==='verified'
      && Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
      && Date.parse(p.newest_mention_at||'')>=now-7*86400000
      && Date.parse(p.published_at||'')>=now-30*86400000
    ).sort((a,b)=>Number(b.trend_score||0)-Number(a.trend_score||0)).slice(0,limit);
    res.setHeader('Cache-Control','public, max-age=0, s-maxage=120, stale-while-revalidate=120');
    return res.status(200).json({
      products,
      window_days:7,
      generated_at:new Date().toISOString(),
      rank_calculated_at:rankData.last_rank_calculated_at||null,
      freshness_policy:'Recently published (30 days) fully scored products with dated source signals in the last 7 days. Older reviews are kept in the archive rather than resurfaced here.'
    });
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({products:[],error:'viral_feed_unavailable'});
  }
};
