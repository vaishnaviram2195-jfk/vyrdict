const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/vyrdict_stories';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';
const DAILY=require('../data/daily-news.json');
const TZ='America/Toronto';
const MAX_AGE_DAYS=7;
const LEAD_MAX_AGE_HOURS=72;

function localDay(value){
  try{
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
    const get=t=>parts.find(p=>p.type===t)?.value||'';
    return `${get('year')}-${get('month')}-${get('day')}`;
  }catch{return ''}
}

function ageHours(story,now=Date.now()){
  const published=Date.parse(story?.published_at||0);
  return Number.isFinite(published)?Math.max(0,(now-published)/36e5):9999;
}

function interestScore(story,now=Date.now()){
  const headline=String(story?.headline||'').toLowerCase();
  const category=String(story?.category||'').toLowerCase();
  const age=ageHours(story,now);
  let score=0;
  if(story?.is_featured)score+=50;
  score+=Math.max(0,48-Math.min(48,age*1.35));
  const strongSignals=[
    /\b(collab|collaboration|launch|launched|drop|drops|limited|exclusive|sold out|sellout|restock|viral|comeback|debut|campaign)\b/,
    /\b(celebrity|creator|internet|culture|ai|fashion|beauty|tech|luxury|collector|collectible)\b/,
    /[×x]/
  ];
  if(strongSignals[0].test(headline))score+=12;
  if(strongSignals[1].test(headline))score+=8;
  if(strongSignals[2].test(story?.headline||''))score+=6;
  if(/brand culture|celebrity effect|internet culture|luxury design|collab|collaboration/.test(category))score+=10;
  else if(/beauty|fashion|tech|shoes|food|toys|collectibles/.test(category))score+=5;
  if(story?.dek)score+=5;
  if(story?.source_url)score+=4;
  if(story?.instagram_url)score+=2;
  if(story?.image_url)score+=3;
  return score;
}

function pickDailyLead(stories){
  const rows=Array.isArray(stories)?stories:[];
  if(!rows.length)return null;
  const now=Date.now();
  const today=localDay(now);
  const todays=rows.filter(s=>localDay(s?.published_at)===today);
  const candidates=todays.length?todays:rows.filter(s=>ageHours(s,now)<=LEAD_MAX_AGE_HOURS);
  if(!candidates.length)return null;
  return [...candidates].sort((a,b)=>interestScore(b,now)-interestScore(a,now)||Date.parse(b?.published_at||0)-Date.parse(a?.published_at||0))[0]||null;
}

function dedupe(rows){
  const out=[],seen=new Set();
  for(const s of rows){
    if(!s?.headline||!s?.image_url)continue;
    const key=String(s.slug||s.source_url||s.headline).toLowerCase();
    if(!key||seen.has(key))continue;
    seen.add(key);out.push(s);
  }
  return out;
}

module.exports=async function handler(req,res){
  try{
    const requested=Number(req.query?.limit||4);
    const limit=Math.max(1,Math.min(Number.isFinite(requested)?requested:4,8));
    const poolLimit=Math.max(16,limit*3);
    const now=new Date();
    const cutoff=new Date(now.getTime()-MAX_AGE_DAYS*86400000).toISOString();
    const qs=new URLSearchParams({
      select:'id,slug,headline,dek,category,image_url,image_alt,source_label,source_url,instagram_url,published_at,is_featured',
      is_active:'eq.true',
      status:'eq.published',
      image_url:'not.is.null',
      order:'published_at.desc',
      limit:String(poolLimit)
    });
    qs.append('published_at',`gte.${cutoff}`);
    qs.append('published_at',`lte.${now.toISOString()}`);

    const r=await fetch(`${SB}?${qs}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}});
    if(!r.ok)throw new Error(`stories ${r.status}`);
    const dbPool=await r.json();
    const maxAgeMs=MAX_AGE_DAYS*86400000;
    const editorial=(Array.isArray(DAILY)?DAILY:[]).filter(s=>{
      const ts=Date.parse(s?.published_at||0);
      return s?.headline&&s?.image_url&&Number.isFinite(ts)&&ts<=now.getTime()&&now.getTime()-ts<=maxAgeMs;
    });
    const pool=dedupe([...editorial,...dbPool]).filter(s=>{
      const ts=Date.parse(s?.published_at||0);
      return Number.isFinite(ts)&&ts<=now.getTime()&&now.getTime()-ts<=maxAgeMs;
    });
    const dailyPick=pickDailyLead(pool);
    const rest=[...pool]
      .filter(s=>!dailyPick||s.id!==dailyPick.id)
      .sort((a,b)=>Date.parse(b?.published_at||0)-Date.parse(a?.published_at||0)||interestScore(b)-interestScore(a));
    const stories=(dailyPick?[dailyPick,...rest]:rest).slice(0,limit);

    res.setHeader('Cache-Control','public, max-age=0, s-maxage=120, stale-while-revalidate=300');
    res.status(200).json({
      stories,
      daily_pick:dailyPick||null,
      selection:'fresh_daily_editorial_pick',
      max_age_days:MAX_AGE_DAYS,
      lead_max_age_hours:LEAD_MAX_AGE_HOURS,
      editorial_feed_count:editorial.length
    });
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({stories:[],daily_pick:null,error:'stories_feed_unavailable'});
  }
};
