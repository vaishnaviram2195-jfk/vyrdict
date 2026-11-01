import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const U=Deno.env.get('SUPABASE_URL')!,K=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,H={apikey:K,Authorization:`Bearer ${K}`};
const slug=(s:any)=>String(s||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const secureImage=(v:any)=>{const s=String(v||'').trim();return /^http:\/\//i.test(s)?s.replace(/^http:/i,'https:'):s};
const ts=(v:any)=>{const n=Date.parse(String(v||''));return Number.isFinite(n)?n:0};
const days=(v:any)=>{const n=ts(v);return n?Math.max(0,(Date.now()-n)/86400000):9999};
const statusBoost=(v:any)=>{const s=String(v||'').toLowerCase().replace(/_/g,'-');return s==='peak'||s==='viral-now'?15:['surging','rising','breakout','breaking-out'].includes(s)?12:s==='mainstay'?3:s==='niche'?-8:0};
const currentScore=(p:any)=>{const a=days(p.published_at||p.created_at);const r=a<=7?35:a<=14?25:a<=30?15:a<=60?5:0;const verify=days(p.last_verified_at)<=7?4:0;return Number(p.viral_score||0)+r+statusBoost(p.viral_status)+Math.min(10,Number(p.momentum_score||0)/10)+verify};
const norm=(s:any)=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
async function get(path:string){const r=await fetch(`${U}/rest/v1/${path}`,{headers:H});if(!r.ok)throw new Error(`${r.status}: ${await r.text()}`);return r.json()}
Deno.serve(async(req:Request)=>{
  try{
    const u=new URL(req.url),wanted=(u.searchParams.get('slug')||'').trim();
    if(!wanted)return Response.json({error:'not_found'},{status:404});
    const [catalog,audits]=await Promise.all([
      get('products?select=id,slug,brand,name,category,subcategory,viral_score,worth_score,momentum_score,verdict,viral_summary,product_description,image_url,viral_status,published_at,created_at,last_verified_at&is_active=eq.true&limit=5000'),
      get('vyrdict_product_score_audit?select=product_id&score_state=eq.fully_evidence_linked&limit=5000')
    ]);
    const trusted=new Set(audits.map((a:any)=>Number(a.product_id)));
    const all=catalog.filter((p:any)=>p.evidence_status==='verified'&&trusted.has(Number(p.id)));
    for(const p of all)p.image_url=secureImage(p.image_url);
    const category=[...new Set(catalog.map((p:any)=>p.category).filter(Boolean))].find((c:any)=>slug(c)===wanted);
    if(!category)return Response.json({error:'not_found'},{status:404,headers:{'cache-control':'public,max-age=60'}});
    const products=all.filter((p:any)=>p.category===category).sort((a:any,b:any)=>currentScore(b)-currentScore(a)||Number(b.viral_score||0)-Number(a.viral_score||0)||Number(b.worth_score||0)-Number(a.worth_score||0)).slice(0,40);

    // Publish documented product discoveries separately from fully scored verdicts.
    // This feed contains no inferred Viral/Worth numbers.
    const arrivals=await get('vyrdict_fresh_arrivals?select=candidate_id,brand,product_name,category,image_url,product_url,source_url,source_label,published_at,status&is_active=eq.true&category=eq.'+encodeURIComponent(category)+'&order=published_at.desc,candidate_id.desc&limit=8');
    const fresh_signals:any[]=[],seen=new Set<string>();
    for(const a of arrivals){
      const name=String(a.product_name||'').trim(),brand=String(a.brand||'').trim(),image=secureImage(a.image_url);
      if(!name||!brand||!image||!/^https:\/\//.test(a.product_url||''))continue;
      const key=norm(brand+' '+name);if(seen.has(key))continue;seen.add(key);
      fresh_signals.push({
        candidate_id:a.candidate_id,brand,name,image_url:image,category,
        source_title:'Confirmed product identity. VYRDICT Viral and Worth scores under review.',
        source_label:a.source_label,source_url:a.source_url,product_url:a.product_url,
        source_time:a.published_at,lead_score:null,label:'New to VYRDICT',
        score_status:'Verdict pending',is_new_discovery:true,published_at:a.published_at
      });
    }
    const updated_at=[...products.map((p:any)=>p.last_verified_at),...fresh_signals.map((s:any)=>s.source_time)].filter(Boolean).sort().at(-1)||new Date().toISOString();
    return Response.json({category,slug:wanted,products,fresh_signals,updated_at,ranking:'score-integrity-v7-audited-only',signal_window_days:7},{headers:{'cache-control':'public,max-age=60,s-maxage=300,stale-while-revalidate=600','access-control-allow-origin':'*'}});
  }catch(e){console.error(e);return Response.json({error:'server_error'},{status:500,headers:{'cache-control':'no-store'}})}
});