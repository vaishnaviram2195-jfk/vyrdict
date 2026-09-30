const SB='https://shmbvkjzeqqxybweyowj.supabase.co/rest/v1/vyrdict_stories';
const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';
const TZ='America/Toronto';

function localDay(value){
  try{
    const parts=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));
    const get=t=>parts.find(p=>p.type===t)?.value||'';
    return `${get('year')}-${get('month')}-${get('day')}`;
  }catch{return ''}
}

function interestScore(story,now=Date.now()){
  const headline=String(story?.headline||'').toLowerCase();
  const category=String(story?.category||'').toLowerCase();
  const published=Date.parse(story?.published_at||0);
  const ageHours=Number.isFinite(published)?Math.max(0,(now-published)/36e5):999;
  let score=0;

  // Same-day manual editorial flag stays the strongest override.
  if(story?.is_featured)score+=80;
  score+=Math.max(0,32-Math.min(32,ageHours*1.15));

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

  // If there are stories today, rank only today's candidates for the homepage lead.
  if(todays.length){
    return [...todays].sort((a,b)=>interestScore(b,now)-interestScore(a,now)||Date.parse(b?.published_at||0)-Date.parse(a?.published_at||0))[0]||null;
  }

  // If nothing has been published today yet, never resurrect an older featured story.
  // Simply keep the module on the freshest available published story.
  return [...rows].sort((a,b)=>Date.parse(b?.published_at||0)-Date.parse(a?.published_at||0))[0]||null;
}

module.exports=async function handler(req,res){
  try{
    const requested=Number(req.query?.limit||4);
    const limit=Math.max(1,Math.min(Number.isFinite(requested)?requested:4,8));
    const poolLimit=Math.max(16,limit*3);
    const qs=new URLSearchParams({
      select:'id,slug,headline,dek,category,image_url,image_alt,source_label,source_url,instagram_url,published_at,is_featured',
      is_active:'eq.true',
      status:'eq.published',
      published_at:`lte.${new Date().toISOString()}`,
      image_url:'not.is.null',
      order:'published_at.desc',
      limit:String(poolLimit)
    });
    const r=await fetch(`${SB}?${qs}`,{
      headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}
    });
    if(!r.ok)throw new Error(`stories ${r.status}`);
    const pool=await r.json();
    const dailyPick=pickDailyLead(pool);
    const rest=[...pool]
      .filter(s=>!dailyPick||s.id!==dailyPick.id)
      .sort((a,b)=>Number(!!b.is_featured)-Number(!!a.is_featured)||Date.parse(b?.published_at||0)-Date.parse(a?.published_at||0));
    const stories=(dailyPick?[dailyPick,...rest]:rest).slice(0,limit);

    res.setHeader('Cache-Control','public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    res.status(200).json({stories,daily_pick:dailyPick||null,selection:'daily_editorial_pick'});
  }catch(e){
    res.setHeader('Cache-Control','no-store');
    res.status(500).json({stories:[],daily_pick:null,error:'stories_feed_unavailable'});
  }
};
