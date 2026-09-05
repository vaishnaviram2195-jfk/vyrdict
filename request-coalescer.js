(()=>{
  if(window.__vyrdictRequestCoalescerV1)return;
  window.__vyrdictRequestCoalescerV1=1;

  const baseFetch=window.fetch.bind(window);
  const inflight=new Map();
  const memory=new Map();
  const HOST='shmbvkjzeqqxybweyowj.supabase.co';
  const TTL={
    'vyrdict-home-feed':15000,
    'vyrdict-weekly-rankings':15000,
    'vyrdict-rankings':15000,
    'vyrdict-seen-on-screen':30000,
    'vyrdict-male-balance':30000
  };

  function info(input,init){
    try{
      const method=String(init?.method||input?.method||'GET').toUpperCase();
      if(method!=='GET'||init?.signal)return null;
      const raw=typeof input==='string'||input instanceof URL?String(input):String(input?.url||'');
      const u=new URL(raw,location.href);
      if(u.hostname!==HOST)return null;
      const m=u.pathname.match(/\/functions\/v1\/([^/]+)/);
      const fn=m?.[1];const ttl=TTL[fn];if(!ttl)return null;
      for(const k of ['t','ts','_','cacheBust','cache_bust'])u.searchParams.delete(k);
      u.searchParams.sort();
      return {key:u.toString(),ttl};
    }catch{return null}
  }

  function response(s){return new Response(s.body,{status:s.status,statusText:s.statusText,headers:s.headers})}

  window.fetch=function(input,init){
    const x=info(input,init);if(!x)return baseFetch(input,init);
    const hit=memory.get(x.key);
    if(hit&&Date.now()-hit.ts<x.ttl)return Promise.resolve(response(hit));
    if(inflight.has(x.key))return inflight.get(x.key).then(response);
    const p=baseFetch(input,init).then(async r=>{
      const snap={ts:Date.now(),status:r.status,statusText:r.statusText,headers:[...r.headers.entries()],body:await r.clone().text()};
      if(r.ok)memory.set(x.key,snap);
      return snap;
    }).finally(()=>inflight.delete(x.key));
    inflight.set(x.key,p);
    return p.then(response);
  };
})();
