import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const U=Deno.env.get('SUPABASE_URL')!;
const K=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const H={apikey:K,Authorization:'Bearer '+K};
const CORS={'access-control-allow-origin':'*','access-control-allow-methods':'GET,OPTIONS','access-control-allow-headers':'content-type'};
const ALLOWED=new Set(['celebrity-effect','seen-on-screen']);
async function get(path:string){const r=await fetch(U+'/rest/v1/'+path,{headers:H});if(!r.ok)throw new Error(String(r.status)+': '+await r.text());return r.json()}
const secure=(v:any)=>{const s=String(v||'').trim();return /^http:\/\//i.test(s)?s.replace(/^http:/i,'https:'):s};
const days=(v:any)=>{const t=Date.parse(String(v||''));return Number.isFinite(t)?Math.max(0,(Date.now()-t)/86400000):999};
function slimProduct(p:any){return{id:p.id,slug:p.slug,brand:p.brand,name:p.name,category:p.category,image_url:secure(p.image_url),viral_score:p.viral_score,worth_score:p.worth_score,viral_status:p.viral_status,published_at:p.published_at,last_verified_at:p.last_verified_at}}
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS')return new Response(null,{headers:CORS});
  if(req.method!=='GET')return new Response('Method not allowed',{status:405,headers:CORS});
  try{
    const slug=(new URL(req.url).searchParams.get('slug')||'').trim().toLowerCase();
    if(!ALLOWED.has(slug))return Response.json({error:'not_found'},{status:404,headers:CORS});
    const collections=await get('collections?select=id,slug&slug=eq.'+encodeURIComponent(slug)+'&is_active=eq.true&limit=1');
    const cid=Number(collections?.[0]?.id||0);
    const children=await get('collections?select=id&metadata->>parent=eq.'+encodeURIComponent(slug)+'&is_active=eq.true&limit=100');
    const collectionIds=[...new Set([cid,...(children||[]).map((c:any)=>Number(c.id))].filter((id:number)=>id>0))];
    let products:any[]=[];
    if(collectionIds.length){
      const links=await get('product_collections?select=product_id,effect_score&collection_id=in.('+collectionIds.join(',')+')&order=effect_score.desc&limit=500');
      const ids=[...new Set((links||[]).map((x:any)=>Number(x.product_id)).filter((x:number)=>x>0))];
      if(ids.length){
        const ps=await get('products?select=id,slug,brand,name,category,image_url,viral_score,worth_score,viral_status,published_at,last_verified_at&id=in.('+ids.join(',')+')&is_active=eq.true&evidence_status=eq.verified&order=published_at.desc.nullslast,viral_score.desc&limit=60');
        const order=new Map(ids.map((id:number,i:number)=>[id,i]));
        products=(ps||[]).filter((p:any)=>p?.slug&&p?.image_url).sort((a:any,b:any)=>{
          const ad=Date.parse(a.published_at||'')||0,bd=Date.parse(b.published_at||'')||0;
          return bd-ad||(Number(b.viral_score||0)-Number(a.viral_score||0))||((order.get(a.id)||0)-(order.get(b.id)||0));
        }).slice(0,24).map(slimProduct);
      }
    }
    let signals:any[]=[];
    if(slug==='celebrity-effect'){
      const stories=await get('vyrdict_stories?select=id,slug,headline,dek,category,image_url,source_label,source_url,published_at&status=eq.published&is_active=eq.true&order=published_at.desc&limit=60');
      signals=(stories||[]).filter((s:any)=>String(s.category||'').toLowerCase().includes('celebrity effect')&&days(s.published_at)<=45&&s.image_url&&s.source_url).slice(0,16).map((s:any)=>({
        type:'story',headline:s.headline,dek:s.dek,category:s.category,image_url:secure(s.image_url),source_label:s.source_label,source_url:s.source_url,published_at:s.published_at
      }));
    }else{
      const leads=await get('vyrdict_trend_leads?select=id,title,summary,canonical_url,last_seen_at,metadata,candidate_id&order=last_seen_at.desc.nullslast&limit=500');
      const fresh=(leads||[]).filter((l:any)=>l?.metadata?.special_collection==='seen-on-screen'&&days(l.last_seen_at)<=10).slice(0,120);
      const cids=[...new Set(fresh.map((l:any)=>Number(l.candidate_id)).filter((x:number)=>x>0))];
      let candidates:any[]=[];
      if(cids.length)candidates=await get('vyrdict_research_candidates?select=id,brand,product_name,exact_product_name,verified_image_url,draft_product_id&id=in.('+cids.join(',')+')&limit=200');
      const by=new Map((candidates||[]).map((c:any)=>[Number(c.id),c]));
      const seen=new Set<string>();
      for(const l of fresh){
        const c:any=by.get(Number(l.candidate_id))||{};
        const name=String(c.exact_product_name||c.product_name||l.metadata?.item_name||l.title||'').trim();
        const show=String(l.metadata?.show_title||'').trim();
        const key=name.toLowerCase()+'|'+show.toLowerCase();
        const image=secure(c.verified_image_url||l.metadata?.product_image_url||'');
        const source=String(l.metadata?.screen_source_url||l.canonical_url||'');
        if(!name||!image||!source||seen.has(key))continue;
        seen.add(key);
        signals.push({type:'screen',lead_id:l.id,product_name:name,brand:c.brand||null,show_title:show||null,character:l.metadata?.character||null,image_url:image,source_url:source,seen_at:l.last_seen_at,product_slug:null,draft_product_id:c.draft_product_id||null});
        if(signals.length>=24)break;
      }
    }
    return Response.json({slug,generated_at:new Date().toISOString(),products,signals},{headers:{...CORS,'cache-control':'public, max-age=60, s-maxage=120, stale-while-revalidate=300','x-content-type-options':'nosniff','x-vyrdict-culture-revision':'20261013-child-collections'}});
  }catch(e){console.error('culture-feed',String(e));return Response.json({error:'feed_unavailable'},{status:500,headers:{...CORS,'cache-control':'no-store'}})}
});
