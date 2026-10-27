import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.56.0";

const SB=Deno.env.get('SUPABASE_URL')!;
const KEY=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CRON_HASH='dcdee1df5d6aa92618e225aae7e0c08d780960d7a570f96f9c133862886df774';
const sb=createClient(SB,KEY,{auth:{persistSession:false}});
const BLOCK=/(^|\.)(localhost|local|internal|metadata\.google\.internal)$/i;
const SOCIAL=/(^|\.)(facebook\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|pinterest\.com|youtube\.com)$/i;
const STOP=new Set(['cream','serum','mask','balm','stick','retinol','retinoid','lotion','moisturizer','cleanser','toner','sunscreen','product','products','review','reviews','vitamin','pommade','with','the','and','for']);
const POS=['love','loved','favorite','favourite','effective','works','worked','amazing','great','smooth','smoother','recommend','worth it','impressed','glow','glowing','hydrating','soft','better','best'];
const NEG=['irritation','irritating','burning','burned','dryness','drying','peeling','redness','breakout','broke out','greasy','sticky','disappointed','return','returned','waste','not worth','itch','itchy','sensitive'];
const REP=['repurchase','buy again','bought again','second tube','second bottle','third tube','third bottle','restock','staple','lifetime product','keep buying','reordered','reorder'];

const norm=(s:any)=>String(s||'').toLowerCase().replace(/&amp;/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
const clean=(s:any)=>String(s||'').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const num=(v:any)=>{if(v===null||v===undefined||v==='')return null;const n=Number(String(v).replace(/[^0-9.\-]/g,''));return Number.isFinite(n)?n:null};
const clamp=(n:number)=>Math.max(0,Math.min(100,Math.round(n)));

async function sha(s:string){
  const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
function safe(raw:string,base?:string){
  try{
    const u=new URL(raw,base);
    if(!/^https?:$/.test(u.protocol))return null;
    const h=u.hostname.toLowerCase();
    if(BLOCK.test(h)||SOCIAL.test(h)||h==='127.0.0.1'||h==='::1'||/^10\./.test(h)||/^192\.168\./.test(h)||/^169\.254\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h))return null;
    return u;
  }catch{return null;}
}
async function sf(raw:string){
  let u=safe(raw); if(!u)throw new Error('unsafe_url');
  for(let i=0;i<3;i++){
    const ac=new AbortController(); const tm=setTimeout(()=>ac.abort(),6000);
    try{
      const r=await fetch(u.href,{redirect:'manual',signal:ac.signal,headers:{'user-agent':'Mozilla/5.0 (compatible; VYRDICTConsumerResearch/1.1; +https://vyrdict.com)','accept':'text/html,application/xhtml+xml'}});
      if(r.status>=300&&r.status<400){
        const loc=r.headers.get('location'); const n=loc?safe(loc,u.href):null;
        if(!n)throw new Error('unsafe_redirect'); u=n; continue;
      }
      return r;
    }finally{clearTimeout(tm);}
  }
  throw new Error('redirect_loop');
}
function toks(s:any){return norm(s).split(' ').filter(x=>x.length>=3&&!STOP.has(x));}
function aliases(c:any){return [...new Set([c.exact_product_name,c.product_name].filter(Boolean).map(clean))];}
function matches(text:string,c:any){
  const t=` ${norm(text)} `;
  for(const a of aliases(c)){const n=norm(a);if(n&&t.includes(` ${n} `))return true;}
  const b=norm(c.brand),ts=[...new Set(aliases(c).flatMap(toks).filter((x:string)=>!b.split(' ').includes(x)))];
  return !!(b&&t.includes(` ${b} `)&&ts.some((x:string)=>t.includes(` ${x} `)));
}
function hasType(o:any,t:string){const v=o?.['@type'];return Array.isArray(v)?v.includes(t):v===t;}
function flatten(x:any,out:any[]=[]){
  if(Array.isArray(x)){x.forEach(v=>flatten(v,out));return out;}
  if(x&&typeof x==='object'){out.push(x);if(x['@graph'])flatten(x['@graph'],out);}
  return out;
}
function cnt(texts:string[],terms:string[]){
  let n=0;
  for(const s of texts){const t=norm(s);for(const x of terms)if(t.includes(norm(x)))n++;}
  return n;
}
function signals(html:string,c:any){
  const out:any[]=[];
  for(const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    try{
      const nodes=flatten(JSON.parse(m[1].trim().replace(/^<!--|-->$/g,'')));
      for(const o of nodes){
        if(hasType(o,'Product')&&matches(String(o.name||''),c)){
          const a=o.aggregateRating||{};
          const revs=Array.isArray(o.review)?o.review:(o.review?[o.review]:[]);
          const bodies=revs.map((r:any)=>clean(r.reviewBody||r.description||'')).filter(Boolean);
          const rr=revs.map((r:any)=>num(r.reviewRating?.ratingValue)).filter((x:any)=>x&&x>0);
          const rating=num(a.ratingValue)??(rr.length?rr.reduce((x:number,y:number)=>x+y,0)/rr.length:null);
          const rc=num(a.reviewCount??a.ratingCount)??(bodies.length||null);
          const pos=cnt(bodies,POS),neg=cnt(bodies,NEG),rep=cnt(bodies,REP);
          if(rating||rc||bodies.length){
            out.push({name:clean(o.name),brand:clean(typeof o.brand==='string'?o.brand:o.brand?.name||c.brand||''),rating,review_count:rc,sample_size:Math.max(bodies.length,rc||0),consumer_signal_score:rating?clamp(rating*20):clamp(50+pos*6-neg*7+rep*5),positive_mentions:pos,caution_mentions:neg,repurchase_mentions:rep,signal_type:'product_aggregate_reviews'});
          }
        }
        if(hasType(o,'Review')){
          const item=typeof o.itemReviewed==='string'?o.itemReviewed:(o.itemReviewed?.name||o.name||'');
          if(item&&matches(String(item),c)){
            const body=clean(o.reviewBody||o.description||'');
            const rating=num(o.reviewRating?.ratingValue);
            const texts=body?[body]:[];
            const pos=cnt(texts,POS),neg=cnt(texts,NEG),rep=cnt(texts,REP);
            if(rating||body){
              out.push({name:clean(item),brand:c.brand||null,rating,review_count:rating?1:null,sample_size:1,consumer_signal_score:rating?clamp(rating*20):clamp(50+pos*8-neg*9+rep*6),positive_mentions:pos,caution_mentions:neg,repurchase_mentions:rep,signal_type:'structured_hands_on_review'});
            }
          }
        }
      }
    }catch{}
  }
  return out;
}
function editorial(html:string,url:string,c:any){
  const title=clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'');
  if(!/(review|tested|worth|try|tried|using|used|week|month)/i.test(`${title} ${url}`))return null;
  const text=norm(clean(html.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')).slice(0,90000));
  if(!matches(`${title} ${text.slice(0,18000)}`,c))return null;
  const wins:string[]=[];
  for(const a of aliases(c)){const n=norm(a),i=text.indexOf(n);if(i>=0)wins.push(text.slice(Math.max(0,i-1800),Math.min(text.length,i+2800)));}
  if(!wins.length&&c.brand){const i=text.indexOf(norm(c.brand));if(i>=0)wins.push(text.slice(Math.max(0,i-1800),Math.min(text.length,i+2800)));}
  if(!wins.length)return null;
  const pos=cnt(wins,POS),neg=cnt(wins,NEG),rep=cnt(wins,REP);
  if(pos+neg+rep<2)return null;
  return {name:c.exact_product_name||c.product_name,brand:c.brand||null,rating:null,review_count:null,sample_size:1,consumer_signal_score:clamp(50+Math.min(30,pos*6)-Math.min(35,neg*7)+Math.min(10,rep*5)),positive_mentions:pos,caution_mentions:neg,repurchase_mentions:rep,signal_type:'editorial_hands_on_review'};
}
async function save(c:any,url:string,label:string,sourceType:string,s:any){
  const direction=s.consumer_signal_score>=65?'supports':s.consumer_signal_score<=40?'cautions':'neutral';
  const metrics={name:s.name||c.exact_product_name||c.product_name,brand:s.brand||c.brand,rating:s.rating??null,review_count:s.review_count??null,sample_size:s.sample_size||0,consumer_signal_score:s.consumer_signal_score,positive_mentions:s.positive_mentions||0,caution_mentions:s.caution_mentions||0,repurchase_mentions:s.repurchase_mentions||0,signal_type:s.signal_type};
  const {data:ev}=await sb.from('vyrdict_candidate_evidence').select('id').eq('candidate_id',c.id).eq('evidence_bucket','consumer').eq('source_url',url).maybeSingle();
  let eid:any=ev?.id;
  const payload={source_label:label,source_type:sourceType,source_publisher:label,source_quality:sourceType==='structured_review'?'high':'medium',claim_summary:`Consumer proof observed from ${label}: ${s.rating?`${Number(s.rating).toFixed(2)}/5 rating`:s.signal_type}${s.review_count?` across ${s.review_count} reviews`:''}.`,supports_direction:direction,observed_metrics:metrics,verification_status:'observed',is_public:true,observed_at:new Date().toISOString(),updated_at:new Date().toISOString()};
  if(eid){
    const {error}=await sb.from('vyrdict_candidate_evidence').update(payload).eq('id',eid); if(error)throw error;
  }else{
    const {data,error}=await sb.from('vyrdict_candidate_evidence').insert({candidate_id:c.id,evidence_bucket:'consumer',source_url:url,...payload}).select('id').single(); if(error)throw error; eid=data.id;
  }
  const domain=new URL(url).hostname.replace(/^www\./,'').toLowerCase();
  const lt=sourceType==='retailer_reviews'?'retailer_pool':sourceType==='official_reviews'?'official_reviews':sourceType==='structured_review'?'structured_review':'editorial_review';
  const row={candidate_id:c.id,source_url:url,source_domain:domain,source_label:label,source_type:lt,rating:s.rating??null,review_count:s.review_count??null,sample_size:s.sample_size||0,consumer_signal_score:s.consumer_signal_score,positive_mentions:s.positive_mentions||0,caution_mentions:s.caution_mentions||0,repurchase_mentions:s.repurchase_mentions||0,theme_metrics:{signal_type:s.signal_type},source_evidence_id:eid,verification_status:'observed',observed_at:new Date().toISOString(),checked_at:new Date().toISOString(),updated_at:new Date().toISOString()};
  const {data:ex}=await sb.from('vyrdict_candidate_consumer_sources').select('id').eq('candidate_id',c.id).eq('source_url',url).maybeSingle();
  if(ex?.id){const {error}=await sb.from('vyrdict_candidate_consumer_sources').update(row).eq('id',ex.id);if(error)throw error;}
  else {const {error}=await sb.from('vyrdict_candidate_consumer_sources').insert(row);if(error)throw error;}
}
async function pageList(c:any){
  const out:any[]=[],hosts=new Set<string>();
  const add=(url:any,label:any,type:any)=>{const u=url?safe(String(url)):null;if(!u||/news\.google\.com$/i.test(u.hostname)||hosts.has(u.hostname))return;hosts.add(u.hostname);out.push({url:u.href,label:clean(label)||u.hostname.replace(/^www\./,''),type});};
  const {data:rr}=await sb.from('vyrdict_candidate_retailers').select('*').eq('candidate_id',c.id).neq('verification_status','rejected').order('verified_at',{ascending:false,nullsFirst:false}).limit(8);
  for(const r of rr||[])add(r.retailer_url,r.retailer_name,r.is_official?'official_reviews':'retailer_reviews');
  if(c.official_product_url)add(c.official_product_url,c.brand||'Official source','official_reviews');
  const {data:ev}=await sb.from('vyrdict_candidate_evidence').select('source_url,source_publisher').eq('candidate_id',c.id).in('evidence_bucket',['product_value','virality']).not('source_url','is',null).order('observed_at',{ascending:false}).limit(12);
  for(const e of ev||[])add(e.source_url,e.source_publisher||'Editorial source','editorial_review');
  return out.slice(0,4);
}
async function one(c:any){
  const now=new Date().toISOString();
  await sb.from('vyrdict_research_candidates').update({consumer_expansion_state:'searching'}).eq('id',c.id);
  const pages=await pageList(c);
  const fetched=await Promise.all(pages.map(async p=>{
    try{const r=await sf(p.url);if(!r.ok||!(r.headers.get('content-type')||'').includes('text/html'))return {p,ok:false};return {p,ok:true,url:r.url||p.url,html:await r.text()};}
    catch{return {p,ok:false};}
  }));
  let checked=0,created=0,ratings=0,hands=0;
  for(const f of fetched){
    if(!f.ok)continue; checked++;
    let ss=signals(f.html!,c);
    if(!ss.length&&f.p.type==='editorial_review'){const e=editorial(f.html!,f.url!,c);if(e)ss=[e];}
    if(!ss.length)continue;
    const s=ss.sort((a,b)=>(b.review_count||0)-(a.review_count||0))[0];
    const st=s.signal_type==='structured_hands_on_review'?'structured_review':s.signal_type==='editorial_hands_on_review'?'editorial_review':f.p.type;
    await save(c,f.url!,f.p.label,st,s);
    created++; if((s.rating||0)>0||(s.review_count||0)>0)ratings++; if(/hands_on/.test(s.signal_type))hands++;
  }
  await sb.from('vyrdict_research_candidates').update({last_consumer_expanded_at:now,consumer_expansion_state:created?'partial':'pending',updated_at:now}).eq('id',c.id);
  return {candidate_id:c.id,product:c.product_name,pages_checked:checked,consumer_sources_observed:created,rating_sources_observed:ratings,hands_on_sources_observed:hands};
}
Deno.serve(async(req:Request)=>{
  if(req.method!=='POST')return new Response('{"error":"method_not_allowed"}',{status:405});
  const t=req.headers.get('x-vyrdict-cron')||''; if(!t||await sha(t)!==CRON_HASH)return new Response('{"error":"unauthorized"}',{status:401});
  try{const reqBody=await req.json().catch(()=>({}));
if(Array.isArray(reqBody.candidate_ids)&&reqBody.candidate_ids.length>0){
  const targetIds=[...new Set(reqBody.candidate_ids.map((v:any)=>Number(v)).filter((v:number)=>Number.isSafeInteger(v)&&v>0))].slice(0,4);
  if(targetIds.length===0)throw new Error('no_valid_candidate_ids');
  const {data:targets,error:targetError}=await sb.from('vyrdict_research_candidates').select('*').in('id',targetIds).in('status',['queued','researching','ready_to_score']).eq('scoring_complete',false);
  if(targetError)throw targetError;
  const results=[];
  for(const item of targets||[])results.push(await one(item));
  return new Response(JSON.stringify({ok:true,mode:'explicit_verified_candidate_research',candidates_checked:results.length,results}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
}

    const {data:run}=await sb.from('vyrdict_trend_runs').insert({run_type:'expand',metadata:{pipeline:'consumer-proof-expansion-v2'}}).select('id').single();
    const cutoff=new Date(Date.now()-12*3600000).toISOString();
    const {data:cs,error}=await sb.from('vyrdict_research_candidates').select('*').eq('source_platform','Trend Intelligence').eq('product_identity_verified',true).in('status',['researching','ready_to_score']).eq('scoring_complete',false).or(`last_consumer_expanded_at.is.null,last_consumer_expanded_at.lt.${cutoff}`).order('last_consumer_expanded_at',{ascending:true,nullsFirst:true}).limit(2);
    if(error)throw error;
    const results=[];let sources=0,ratings=0;
    for(const c of cs||[]){const r=await one(c);results.push(r);sources+=r.consumer_sources_observed;ratings+=r.rating_sources_observed;}
    if(run?.id)await sb.from('vyrdict_trend_runs').update({status:'succeeded',finished_at:new Date().toISOString(),products_checked:(cs||[]).length,metadata:{pipeline:'consumer-proof-expansion-v2',consumer_sources_observed:sources,rating_sources_observed:ratings}}).eq('id',run.id);
    return new Response(JSON.stringify({ok:true,candidates_checked:(cs||[]).length,consumer_sources_observed:sources,rating_sources_observed:ratings,results}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
  }catch(e){return new Response(JSON.stringify({ok:false,error:String(e)}),{status:500,headers:{'content-type':'application/json'}});}
});