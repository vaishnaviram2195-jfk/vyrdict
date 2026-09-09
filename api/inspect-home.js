const BUNDLE='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-bundle-fast?v=18';
module.exports=async function handler(req,res){
  try{
    const r=await fetch(BUNDLE,{headers:{accept:'application/json'}});
    if(!r.ok)throw new Error(`bundle ${r.status}`);
    const d=await r.json();
    const h=String(d?.html||'');
    const keys=['function card','const card=','let card=','var card=','const S=','let S=','var S=','S={','id="viral"','id="culture"','skip-list'];
    const out={length:h.length};
    for(const k of keys){const i=h.indexOf(k);out[k]=i<0?null:h.slice(Math.max(0,i-500),Math.min(h.length,i+2200));}
    res.setHeader('Cache-Control','no-store');
    res.status(200).json(out);
  }catch(e){res.status(500).json({error:String(e)})}
};
