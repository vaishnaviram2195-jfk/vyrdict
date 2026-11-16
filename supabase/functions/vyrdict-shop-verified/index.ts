import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SB=Deno.env.get("SUPABASE_URL");
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const CORS={
  "access-control-allow-origin":"*",
  "access-control-allow-methods":"GET,HEAD,OPTIONS",
  "access-control-allow-headers":"content-type,authorization,apikey",
  "x-content-type-options":"nosniff",
};

Deno.serve(async (req:Request)=>{
  if(req.method==="OPTIONS")return new Response(null,{headers:CORS});
  if(req.method!=="GET"&&req.method!=="HEAD"){
    return Response.json({ok:false,error:"method_not_allowed"},{status:405,headers:{...CORS,"cache-control":"no-store"}});
  }
  if(!SB||!SERVICE){
    return Response.json({ok:false,error:"temporarily_unavailable"},{status:503,headers:{...CORS,"cache-control":"no-store"}});
  }
  try{
    const q=new URLSearchParams({
      select:"id,slug,brand,name,category,viral_score,worth_score,verdict,image_url,published_at,last_verified_at,evidence_source_domains,evidence_url_sources,linked_score_inputs",
      order:"last_verified_at.desc",
      limit:"300"
    });
    const url=SB+"/rest/v1/vyrdict_shop_verified_products?"+q.toString();
    const upstream=await fetch(url,{headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,"accept":"application/json"},cache:"no-store"});
    if(!upstream.ok)throw new Error("verified_view_http_"+upstream.status);
    const result=await upstream.json();
    if(!Array.isArray(result))throw new Error("verified_view_invalid_response");
    const products=result.filter((p:any)=>p&&p.slug&&p.name&&p.brand
      &&typeof p.image_url==="string"&&p.image_url.startsWith("https://")
      &&Number.isInteger(Number(p.viral_score))&&Number.isInteger(Number(p.worth_score))
      &&Number(p.viral_score)>=0&&Number(p.viral_score)<=100
      &&Number(p.worth_score)>=0&&Number(p.worth_score)<=100
      &&p.linked_score_inputs===11&&p.evidence_source_domains>=3
      &&p.last_verified_at
    );
    const editQuery=new URLSearchParams({
      select:"id,slug,title,dek,category,published_at,instagram_url,product_ids,product_count,cover_image",
      order:"published_at.desc",limit:"75"
    });
    const er=await fetch(SB+"/rest/v1/vyrdict_shop_feed_verified_edits?"+editQuery.toString(),{
      headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,"accept":"application/json"},cache:"no-store"
    });
    if(!er.ok)throw new Error("verified_edits_http_"+er.status);
    const rawEdits=await er.json();
    if(!Array.isArray(rawEdits))throw new Error("verified_edits_invalid_response");
    const productIds=new Set(products.map((p:any)=>Number(p.id)));
    const edits=rawEdits.filter((e:any)=>Array.isArray(e.product_ids)&&e.product_ids.length>0&&
      e.product_ids.every((id:any)=>productIds.has(Number(id)))&&
      e.product_ids.length===e.product_count&&e.slug&&e.title);
    const body={ok:true,products,edits,count:products.length,verified_edits:edits.length,generated_at:new Date().toISOString(),
      policy:"Only active verified high-confidence v2-evidence scores; 11 linked score inputs, 3+ source domains, original HTTPS product image, and active retailer link; an edit is available only when all its products qualify."
    };
    return new Response(req.method==="HEAD"?null:JSON.stringify(body),{
      status:200,
      headers:{...CORS,"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=0, s-maxage=180, stale-while-revalidate=60"}
    });
  }catch(err){
    console.error("vyrdict_shop_verified",String(err));
    return Response.json({ok:false,error:"verified_feed_temporarily_unavailable",products:[]},{
      status:503,headers:{...CORS,"cache-control":"no-store"}
    });
  }
});