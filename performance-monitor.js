(()=>{
  if(window.__vyrdictPerformanceMonitorV1)return;
  window.__vyrdictPerformanceMonitorV1=1;

  const ANALYTICS_URL='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-analytics';
  const sent=new Set(),errorSeen=new Set();
  let cls=0,lcp=0,interaction=0,longTask=0,fcp=0,flushed=false;
  let errorCount=0;

  const device=()=>{
    try{
      if(navigator.userAgentData?.mobile)return 'mobile';
      if(matchMedia('(max-width:760px)').matches)return 'mobile';
      if(matchMedia('(max-width:1100px)').matches&&navigator.maxTouchPoints>1)return 'tablet';
    }catch{}
    return 'desktop';
  };
  const connection=()=>{
    try{return String(navigator.connection?.effectiveType||'unknown').slice(0,24)}catch{return 'unknown'}
  };
  const emit=(name,value,extra={})=>{
    if(sent.has(name))return;
    const n=Math.max(0,Math.min(10000,Math.round(Number(value)||0)));
    if(!n&&name!=='rum_cls')return;
    sent.add(name);
    try{window.VyrdictAnalytics?.send?.(name,{event_value:n,source:device(),category:connection(),...extra})}catch{}
  };
  const emitError=(name,key,value=1,extra={})=>{
    if(errorCount>=8||errorSeen.has(key))return;
    errorSeen.add(key);errorCount++;
    try{window.VyrdictAnalytics?.send?.(name,{event_value:value,source:device(),...extra})}catch{}
  };

  try{
    const nav=performance.getEntriesByType('navigation')?.[0];
    if(nav){
      const ttfb=Math.max(0,Number(nav.responseStart||0)-Number(nav.startTime||0));
      if(ttfb)setTimeout(()=>emit('rum_ttfb',ttfb),0);
    }
    const paint=performance.getEntriesByName('first-contentful-paint')?.[0];
    if(paint)fcp=Number(paint.startTime||0);
  }catch{}

  try{
    new PerformanceObserver(list=>{
      for(const e of list.getEntries())if(!e.hadRecentInput)cls+=Number(e.value||0);
    }).observe({type:'layout-shift',buffered:true});
  }catch{}
  try{
    new PerformanceObserver(list=>{
      const entries=list.getEntries();
      if(entries.length)lcp=Math.max(lcp,Number(entries[entries.length-1].startTime||0));
    }).observe({type:'largest-contentful-paint',buffered:true});
  }catch{}
  try{
    new PerformanceObserver(list=>{
      for(const e of list.getEntries())interaction=Math.max(interaction,Number(e.duration||0));
    }).observe({type:'event',buffered:true,durationThreshold:40});
  }catch{}
  try{
    new PerformanceObserver(list=>{
      for(const e of list.getEntries())longTask+=Number(e.duration||0);
    }).observe({type:'longtask',buffered:true});
  }catch{}
  try{
    new PerformanceObserver(list=>{
      for(const e of list.getEntries())if(e.name==='first-contentful-paint')fcp=Math.max(fcp,Number(e.startTime||0));
    }).observe({type:'paint',buffered:true});
  }catch{}

  const flush=()=>{
    if(flushed)return;flushed=true;
    if(fcp)emit('rum_fcp',fcp);
    if(lcp)emit('rum_lcp',lcp);
    emit('rum_cls',cls*1000);
    if(interaction)emit('rum_interaction',interaction);
    if(longTask)emit('rum_longtask',longTask);
  };
  setTimeout(flush,8000);
  addEventListener('pagehide',flush,{once:true});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()},{passive:true});

  addEventListener('error',e=>{
    try{
      const t=e.target;
      if(t&&t!==window&&t.tagName){
        const tag=String(t.tagName||'resource').toLowerCase();
        if(!['img','script','link','video','source'].includes(tag))return;
        const raw=t.currentSrc||t.src||t.href||'';
        let host='unknown';try{host=new URL(raw,location.href).hostname||'same-origin'}catch{}
        emitError('rum_resource_error',`res:${tag}:${raw}`,1,{category:`${tag}:${host}`.slice(0,100)});
        return;
      }
      if(e.message||e.error)emitError('rum_js_error',`js:${String(e.message||e.error?.name||'error').slice(0,80)}`,1,{category:'window_error'});
    }catch{}
  },true);
  addEventListener('unhandledrejection',()=>emitError('rum_js_error','promise:unhandled',1,{category:'unhandled_rejection'}),{passive:true});

  try{
    const baseFetch=window.fetch.bind(window);
    const reportApi=(raw,status)=>{
      try{
        const u=new URL(typeof raw==='string'||raw instanceof URL?String(raw):String(raw?.url||''),location.href);
        if(u.toString().startsWith(ANALYTICS_URL))return;
        const same=u.origin===location.origin;
        const supa=u.hostname==='shmbvkjzeqqxybweyowj.supabase.co'&&u.pathname.includes('/functions/v1/');
        if(!same&&!supa)return;
        const label=supa?(u.pathname.match(/\/functions\/v1\/([^/?#]+)/)?.[1]||'supabase'):(u.pathname.split('/').filter(Boolean)[0]||'home');
        emitError('rum_api_error',`api:${label}:${status}`,Math.max(0,Math.min(999,Number(status)||0)),{category:String(label).slice(0,100)});
      }catch{}
    };
    window.fetch=async function(input,init){
      try{
        const r=await baseFetch(input,init);
        if(!r.ok)reportApi(input,r.status);
        return r;
      }catch(err){reportApi(input,0);throw err}
    };
  }catch{}
})();
