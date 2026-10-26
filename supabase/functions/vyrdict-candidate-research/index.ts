const SB=Deno.env.get('SUPABASE_URL')!,KEY=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,CRON_HASH='dcdee1df5d6aa92618e225aae7e0c08d780960d7a570f96f9c133862886df774';
const HDR={apikey:KEY,Authorization:`Bearer ${KEY}`},JHDR={...HDR,'content-type':'application/json'};
const BLOCK=/(^|\.)(localhost|local|internal|metadata\.google\.internal)$/i,SOCIAL=/(^|\.)(facebook\.com|instagram\.com|tiktok\.com|twitter\.com|x\.com|pinterest\.com|youtube\.com|google\.com)$/i;
const GENERIC=new Set(['the','and','for','with','from','this','that','into','new','product','products','viral','tiktok','best','your','you','its','our','are','was','has','have','just','cream','serum','mask','balm','stick','retinol','lotion','moisturizer','makeup','beauty','hair','bag','shoe','shoes','supplement']);
const norm=(s:any)=>String(s||'').toLowerCase().replace(/&amp;/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
function pickBalanced(rows:any[],limit=8){
  const groups=new Map<string,any[]>();
  for(const c of rows||[]){
    const k=String(c.category||'Uncategorized').trim()||'Uncategorized';
    if(!groups.has(k))groups.set(k,[]);
    groups.get(k)!.push(c);
  }
  for(const a of groups.values())a.sort((x,y)=>{
    const px=String(x.priority||'')==='high'?1:0,py=String(y.priority||'')==='high'?1:0;
    if(py!==px)return py-px;
    return Date.parse(y.created_at||0)-Date.parse(x.created_at||0);
  });
  const keys=[...groups.keys()].sort((a,b)=>Date.parse(groups.get(b)![0]?.created_at||0)-Date.parse(groups.get(a)![0]?.created_at||0));
  const out:any[]=[];
  for(let round=0;out.length<limit;round++){
    let added=0;
    for(const k of keys){const x=groups.get(k)![round];if(x){out.push(x);added++;if(out.length>=limit)break}}
    if(!added)break;
  }
  return out;
}
function de(s:any){return String(s||'').replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#x2F;/gi,'/').replace(/&#x3D;/gi,'=').replace(/&#\d+;/g,' ')}
function clean(s:any){return de(String(s||'').replace(/<!\[CDATA\[|\]\]>/g,'')).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()}
function num(v:any){const s=String(v??'').replace(/[^0-9.\-]/g,'').trim();if(!s||s==='.'||s==='-'||s==='-.')return null;const n=Number(s);return Number.isFinite(n)?n:null}
function tokens(s:any){return norm(s).split(' ').filter((x:string)=>x.length>=3&&!GENERIC.has(x))}
function matches(target:string,name:string){const a=norm(target),b=norm(name);if(!a||!b)return false;if(a.includes(b)||b.includes(a))return true;const at=tokens(a),bt=tokens(b);if(!at.length||!bt.length)return false;const hit=at.filter((t:string)=>bt.includes(t)).length;return hit>=Math.min(2,at.length)||at.some((t:string)=>t.length>=4&&bt.includes(t))}
async function sha(s:string){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function dbSignal(signal?:AbortSignal){return signal?AbortSignal.any([signal,AbortSignal.timeout(8000)]):AbortSignal.timeout(8000)}
async function get(p:string,signal?:AbortSignal){const r=await fetch(`${SB}/rest/v1/${p}`,{headers:HDR,signal:dbSignal(signal)});if(!r.ok)throw new Error(await r.text());return r.json()}
async function ins(t:string,b:any,signal?:AbortSignal){const r=await fetch(`${SB}/rest/v1/${t}`,{method:'POST',headers:{...JHDR,prefer:'return=representation'},body:JSON.stringify(b),signal:dbSignal(signal)});if(!r.ok)throw new Error(await r.text());return r.json()}
async function pat(t:string,f:string,b:any,signal?:AbortSignal){const r=await fetch(`${SB}/rest/v1/${t}?${f}`,{method:'PATCH',headers:{...JHDR,prefer:'return=minimal'},body:JSON.stringify(b),signal:dbSignal(signal)});if(!r.ok)throw new Error(await r.text())}
function safeUrl(raw:string,base?:string){try{const u=new URL(de(raw),base);if(!/^https?:$/.test(u.protocol))return null;const h=u.hostname.toLowerCase();if(BLOCK.test(h)||SOCIAL.test(h)||h==='0.0.0.0'||h==='127.0.0.1'||h==='::1'||/^10\./.test(h)||/^192\.168\./.test(h)||/^169\.254\./.test(h)||/^172\.(1[6-9]|2\d|3[01])\./.test(h))return null;return u}catch{return null}}
// Keep the timeout active until the response body has been consumed.
async function sf(raw:string,ms=7000,signal?:AbortSignal){
  let u=safeUrl(raw);if(!u)throw new Error('unsafe_url');
  const c=new AbortController(),timer=setTimeout(()=>c.abort(),ms);
  const requestSignal=signal?AbortSignal.any([signal,c.signal]):c.signal;
  try{
    for(let i=0;i<5;i++){
      const r=await fetch(u.href,{redirect:'manual',signal:requestSignal,headers:{'user-agent':'Mozilla/5.0 (compatible; VYRDICTResearch/4.1)','accept':'text/html,application/xhtml+xml'}});
      if(r.status>=300&&r.status<400){
        const loc=r.headers.get('location'),n=loc?safeUrl(loc,u.href):null;
        await r.body?.cancel();if(!n)throw new Error('unsafe_redirect');u=n;continue;
      }
      const html=r.ok&&(r.headers.get('content-type')||'').includes('text/html')?await r.text():'';
      if(!r.bodyUsed)await r.body?.cancel();
      return{ok:r.ok,url:r.url||u.href,headers:r.headers,html};
    }
    throw new Error('redirect_loop');
  }finally{clearTimeout(timer)}
}
function typeIs(o:any,t:string){const v=o?.['@type'];return Array.isArray(v)?v.includes(t):v===t}
function img(v:any):string|null{if(!v)return null;if(typeof v==='string')return v;if(Array.isArray(v))return img(v[0]);if(typeof v==='object')return v.url||v.contentUrl||null;return null}
function br(v:any):string|null{if(!v)return null;if(typeof v==='string')return clean(v).slice(0,120)||null;if(typeof v==='object')return clean(v.name||'').slice(0,120)||null;return null}
function ofr(v:any){const x=Array.isArray(v)?v[0]:v;if(!x||typeof x!=='object')return{};return{price:num(x.price),currency:clean(x.priceCurrency||x.currency||'').toUpperCase()||null,url:typeof(x.url||x.offerUrl)==='string'?(x.url||x.offerUrl):null,seller:clean(x.seller?.name||x.sellerName||'')||null,country:clean(x.countryCode||'').toUpperCase()||null}}
function rat(v:any){if(!v||typeof v!=='object')return{};const r=num(v.ratingValue),c=num(v.reviewCount||v.ratingCount);return{rating:r!=null&&r>0?r:null,reviewCount:c!=null&&c>0?c:null}}
function jsonLd(html:string){const out:any[]=[];function walk(x:any){if(!x)return;if(Array.isArray(x)){x.forEach(walk);return}if(typeof x!=='object')return;if(typeIs(x,'Product')){const o=ofr(x.offers),r=rat(x.aggregateRating);out.push({name:clean(x.name),brand:br(x.brand),image:img(x.image),price:o.price,currency:o.currency,url:o.url||x.url||x['@id']||null,seller:o.seller,country:o.country,rating:r.rating??null,review_count:r.reviewCount??null,method:'jsonld'})}Object.values(x).forEach(v=>{if(v&&typeof v==='object')walk(v)})}for(const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{walk(JSON.parse(m[1].trim().replace(/^<!--|-->$/g,'')))}catch{}}return out.filter(x=>x.name)}
function cards(html:string){const out:any[]=[];for(const m of html.matchAll(/data-item=["']([^"']+)["']/gi)){const raw=de(m[1]);if(!raw.trim().startsWith('{'))continue;try{const x=JSON.parse(raw);if(!(x.productBrand||x.offerRetailer||x.offers||String(x.contentType||x.component).toLowerCase().includes('product')))continue;const o=ofr(x.offers||{price:x.price,currency:x.currency,url:x.offerUrl||x.ctaHref,sellerName:x.offerRetailer,countryCode:x.countryCode}),name=clean([x.productBrand||x.brand?.name||'',x.dangerousHed||x.name||''].filter(Boolean).join(' ')),rv=num(x.rating),rc=num(x.reviewCount);if(!name)continue;out.push({name,brand:clean(x.productBrand||x.brand?.name||'')||null,image:img(x.image||x.images||x.productImage),price:o.price,currency:o.currency,url:o.url||x.offerUrl||null,seller:o.seller||clean(x.offerRetailer)||null,country:o.country,rating:rv!=null&&rv>0?rv:null,review_count:rc!=null&&rc>0?rc:null,method:'publisher_card'})}catch{}}return out}
function products(html:string){const seen=new Set<string>();return[...jsonLd(html),...cards(html)].filter(x=>{const k=norm(`${x.name}|${x.url||''}|${x.method}`);if(!k||seen.has(k))return false;seen.add(k);return true})}
function links(html:string,base:string,target:string,extra:string[]){const tt=tokens(target),seen=new Set<string>(),out:string[]=[];const add=(raw:string)=>{const u=safeUrl(raw,base);if(!u||u.hostname===safeUrl(base)?.hostname||SOCIAL.test(u.hostname))return;const k=u.href.replace(/#.*$/,'');if(!seen.has(k)){seen.add(k);out.push(k)}};extra.forEach(add);for(const m of html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)){const href=de(m[1]),text=clean(m[2]),hay=norm(`${text} ${href}`);if((norm(target)&&hay.includes(norm(target)))||tt.some((t:string)=>t.length>=4&&hay.includes(t)))add(href);if(out.length>=10)break}return out.slice(0,10)}
async function evidence(c:any,bucket:string,url:string,label:string,type:string,claim:string,metrics:any){const ex=await get(`vyrdict_candidate_evidence?select=id&candidate_id=eq.${c.id}&evidence_bucket=eq.${bucket}&source_url=eq.${encodeURIComponent(url)}&limit=1`,c._signal),b={candidate_id:c.id,evidence_bucket:bucket,source_label:label,source_type:type,source_url:url,source_publisher:label,source_quality:'medium',claim_summary:claim.slice(0,1000),observed_metrics:metrics,verification_status:'observed',supports_direction:'supports',is_public:true,updated_at:new Date().toISOString()};if(ex[0])await pat('vyrdict_candidate_evidence',`id=eq.${ex[0].id}`,b,c._signal);else await ins('vyrdict_candidate_evidence',b,c._signal)}
async function seeds(c:any){
  const out:string[]=[],hosts=new Set<string>();
  const add=(raw:string)=>{const u=safeUrl(raw);if(!u||/news\.google\.com$/i.test(u.hostname))return;if(hosts.has(u.hostname))return;hosts.add(u.hostname);out.push(u.href)};
  // Go directly to verified candidate retailer/brand leads first. Previously these were
  // not queried at all: research kept fetching the discovery article, not product pages.
  for(const raw of [c.official_product_url,c.ca_retailer_url,c.us_retailer_url,c.submitted_url])if(raw)add(raw);
  try{const rows=await get(`vyrdict_candidate_evidence?select=source_url&candidate_id=eq.${c.id}&evidence_bucket=eq.virality&source_url=not.is.null&order=observed_at.desc&limit=12`,c._signal);for(const r of rows)add(r.source_url)}catch{}
  return out.slice(0,3);
}
async function one(c:any){c={...c,_signal:AbortSignal.timeout(35000)};const now=new Date().toISOString();await pat('vyrdict_research_candidates',`id=eq.${c.id}`,{status:'researching',exact_product_name:c.exact_product_name||c.product_name,last_auto_researched_at:now,auto_research_state:'partial',updated_at:now},c._signal);const seedUrls=await seeds(c);if(!seedUrls.length){await pat('vyrdict_research_candidates',`id=eq.${c.id}`,{auto_research_state:'blocked',updated_at:now},c._signal);return{candidate_id:c.id,product:c.product_name,skipped:'no_direct_source'}}let pc=0,rc=0,tried=0,checked=0;const obs:any[]=[],offerQueue:string[]=[],offerSeen=new Set<string>();for(const seed of seedUrls){try{c._signal.throwIfAborted();const r=await sf(seed,6000,c._signal);if(!r.ok)continue;checked++;const root=r.url||seed;if(!(r.headers.get('content-type')||'').includes('text/html'))continue;const html=r.html,rootPs=products(html).filter(p=>matches(c.product_name,p.name));for(const p of rootPs.slice(0,2)){pc++;await evidence(c,'product_value',root,new URL(root).hostname,p.method==='publisher_card'?'publisher_product_card':'structured_product',`Observed product data matched ${p.name}${p.price!=null?`; listed price ${p.price} ${p.currency||''}`:''}${p.seller?`; retailer ${p.seller}`:''}.`,p);if(p.rating!=null&&p.rating>0){rc++;await evidence(c,'consumer',root,new URL(root).hostname,'aggregate_rating',`Structured rating observed for ${p.name}: ${p.rating}${p.review_count?` from ${p.review_count} ratings/reviews`:''}.`,p)}obs.push({...p,source_url:root});if(p.url){const u=safeUrl(p.url,root);if(u&&!offerSeen.has(u.href)){offerSeen.add(u.href);offerQueue.push(u.href)}}}for(const l of links(html,root,c.product_name,rootPs.map(p=>p.url).filter(Boolean))){if(!offerSeen.has(l)){offerSeen.add(l);offerQueue.push(l)}}}catch{}}
for(const l of offerQueue.slice(0,2)){tried++;try{c._signal.throwIfAborted();const q=await sf(l,6000,c._signal);if(!q.ok||!(q.headers.get('content-type')||'').includes('text/html'))continue;const final=q.url||l,ps=products(q.html).filter(p=>matches(c.product_name,p.name));for(const p of ps.slice(0,2)){pc++;await evidence(c,'product_value',final,new URL(final).hostname,'structured_product',`Structured product page matched ${p.name}${p.price!=null?`; listed price ${p.price} ${p.currency||''}`:''}.`,p);if(p.rating!=null&&p.rating>0){rc++;await evidence(c,'consumer',final,new URL(final).hostname,'aggregate_rating',`Structured rating observed for ${p.name}: ${p.rating}${p.review_count?` from ${p.review_count} ratings/reviews`:''}.`,p)}obs.push({...p,source_url:final})}}catch{}}
const best=obs.find(x=>x.brand||x.image||x.price!=null||x.url)||obs[0],patch:any={last_auto_researched_at:now,auto_research_state:obs.length?'evidence_found':'partial',updated_at:now};if(best){if(!c.brand&&best.brand)patch.brand=best.brand;if(!c.verified_image_url&&best.image)patch.verified_image_url=best.image;if(c.price_cad==null&&best.price!=null&&best.currency==='CAD')patch.price_cad=best.price;if(!c.us_retailer_url&&best.url&&((best.country==='US')||/amazon\.com|sephora\.com|ulta\.com|target\.com|walmart\.com/i.test(best.url)))patch.us_retailer_url=best.url;if(!c.ca_retailer_url&&best.url&&((best.country==='CA')||/amazon\.ca|sephora\.com\/ca|walmart\.ca/i.test(best.url)))patch.ca_retailer_url=best.url;const note=`Automated evidence pass checked ${checked} direct source page(s), observed ${pc} matching product record(s), and found ${rc} usable rating source(s). Verification flags remain unchanged until independent evidence agrees.`;patch.research_notes=String(c.research_notes||'').replace(/Automated evidence pass[^\n]*/g,'').trim();patch.research_notes=patch.research_notes?`${patch.research_notes}\n${note}`:note}await pat('vyrdict_research_candidates',`id=eq.${c.id}`,patch,c._signal);return{candidate_id:c.id,product:c.product_name,seed_pages_checked:checked,links_tried:tried,product_records_observed:pc,rating_sources_observed:rc,observed:obs.slice(0,6)}}
// One slow or unavailable source must not abort the rest of the batch.
async function researchBatch(cs:any[],work=one){
  const results:any[]=new Array(cs.length);let cursor=0;
  await Promise.all(Array.from({length:Math.min(2,cs.length)},async()=>{
    while(cursor<cs.length){const i=cursor++;try{results[i]=await work(cs[i])}catch(e){results[i]={candidate_id:cs[i].id,error:String(e).slice(0,500)}}}
  }));return results;
}
async function run(){const cutoff=new Date(Date.now()-8*3600000).toISOString(),raw=await get(`vyrdict_research_candidates?select=id,product_name,exact_product_name,brand,submitted_url,official_product_url,category,status,priority,verified_image_url,price_cad,research_notes,us_retailer_url,ca_retailer_url,last_auto_researched_at,auto_research_state,created_at&source_platform=eq.Trend%20Intelligence&status=in.(queued,researching)&or=(last_auto_researched_at.is.null,last_auto_researched_at.lt.${encodeURIComponent(cutoff)})&order=created_at.desc&limit=500`),cs=pickBalanced(raw,4),res=await researchBatch(cs);return{ok:res.some(r=>!r.error)||!res.length,candidates_considered:cs.length,candidates_completed:res.filter(r=>!r.error).length,queue_policy:'category-round-robin-official-source-priority-v8',results:res}}
Deno.serve(async(req:Request)=>{if(req.method!=='POST')return new Response('{"error":"method_not_allowed"}',{status:405});const x=req.headers.get('x-vyrdict-cron')||'';if(!x||await sha(x)!==CRON_HASH)return new Response('{"error":"unauthorized"}',{status:401});try{return new Response(JSON.stringify(await run()),{headers:{'content-type':'application/json','cache-control':'no-store'}})}catch(e){return new Response(JSON.stringify({error:String(e)}),{status:500,headers:{'content-type':'application/json'}})}});
