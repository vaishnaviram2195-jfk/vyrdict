import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const SB=Deno.env.get("SUPABASE_URL")!,KEY=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const H={apikey:KEY,Authorization:"Bearer "+KEY};
const CORS={"access-control-allow-origin":"*","access-control-allow-methods":"GET,HEAD,OPTIONS","access-control-allow-headers":"content-type"};
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
 if(req.method!=="GET"&&req.method!=="HEAD")return Response.json({error:"method_not_allowed"},{status:405,headers:CORS});
 try{
  const u=new URL(req.url);
  const days=30,cutoff=new Date(Date.now()-days*86400000).toISOString();
  const category=(u.searchParams.get("category")||"").trim();
  const qs=new URLSearchParams({
   select:"id,slug,brand,name,category,image_url,viral_score,worth_score,evidence_status,evidence_confidence,published_at,last_verified_at",
   is_active:"eq.true",evidence_status:"eq.verified",evidence_confidence:"eq.high",
   published_at:"gte."+cutoff,last_verified_at:"gte."+cutoff,
   order:"published_at.desc",limit:"24"
  });
  if(category)qs.set("category","eq."+category);
  const res=await fetch(SB+"/rest/v1/products?"+qs,{headers:H,cache:"no-store"});
  if(!res.ok)throw new Error("recent_verified_query_"+res.status);
  const raw=await res.json();
  const arrivals=raw.filter((p:any)=>p.slug&&p.image_url?.startsWith("https://")
   &&p.evidence_status==="verified"&&p.evidence_confidence==="high"
   &&p.viral_score!=null&&p.worth_score!=null
   &&Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))
   &&Number(p.viral_score)>=0&&Number(p.viral_score)<=100
   &&Number(p.worth_score)>=0&&Number(p.worth_score)<=100
  ).map((p:any)=>({
   slug:p.slug,brand:p.brand,name:p.name,category:p.category,image_url:p.image_url,
   product_url:"https://vyrdict.com/product/"+encodeURIComponent(p.slug)+"/",
   published_at:p.published_at,last_verified_at:p.last_verified_at,
   viral_score:p.viral_score,worth_score:p.worth_score,score_status:"verified",
   source_label:"High-confidence evidence-backed VYRDICT review"
  }));
  return Response.json({ok:true,arrivals,count:arrivals.length,last_published_at:arrivals[0]?.published_at||null,
   methodology:"newly published and verified high-confidence product reviews with both completed scores",
   freshness_days:days
  },{headers:{...CORS,"cache-control":"public,max-age=0,s-maxage=120,stale-while-revalidate=60","x-content-type-options":"nosniff"}});
 }catch(e){
  console.error("verified_arrivals",String(e));
  return Response.json({ok:false,error:"temporarily_unavailable",arrivals:[]},{status:503,headers:{...CORS,"cache-control":"no-store"}});
 }
});