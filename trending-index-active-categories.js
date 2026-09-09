(()=>{
  if(window.__vyrdictTrendingActiveCategoriesV3)return;
  window.__vyrdictTrendingActiveCategoriesV3=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  let timer=0,busy=false;

  function unwrap(x){
    if(!x)return null;
    const p=x.product||x.products||x.item||x;
    return p&&typeof p==='object'?p:null;
  }

  function rowsFromLiveData(){
    const rows=window.__vyrdictTrendingLiveData?.products;
    return Array.isArray(rows)?rows.map(unwrap).filter(Boolean):[];
  }

  async function fetchRows(){
    try{
      const r=await fetch(ENDPOINT,{cache:'no-store'});
      if(!r.ok)return [];
      const d=await r.json();
      const rows=Array.isArray(d)?d:Array.isArray(d?.rankings)?d.rankings:Array.isArray(d?.data)?d.data:Array.isArray(d?.products)?d.products:[];
      return rows.map(unwrap).filter(Boolean);
    }catch{return []}
  }

  function apply(rows){
    const section=document.querySelector('.vyrdict-index-gallery,.vyrdict-index-claw');
    if(!section||!rows.length)return false;

    const active=new Set(rows.filter(p=>p&&p.slug&&p.image_url&&p.category).map(p=>norm(p.category)));
    const buttons=[...section.querySelectorAll('.vtg-cat,.vti-cat')];
    if(!buttons.length)return false;

    let activeButtonHidden=false;
    buttons.forEach(btn=>{
      const cat=btn.dataset.cat||btn.textContent||'';
      const show=norm(cat)==='all'||active.has(norm(cat));
      if(!show&&btn.classList.contains('is-active'))activeButtonHidden=true;
      btn.hidden=!show;
      btn.classList.toggle('vti-cat-unavailable',!show);
      btn.setAttribute('aria-hidden',String(!show));
      btn.tabIndex=show?0:-1;
      btn.style.setProperty('display',show?'':'none',!show?'important':'');
    });

    if(activeButtonHidden){
      const all=buttons.find(b=>norm(b.dataset.cat||b.textContent)==='all'&&!b.hidden);
      all?.click();
    }

    const hint=section.querySelector('.vti-hint');
    if(hint)hint.textContent='Only categories with verified live trends appear here.';
    return true;
  }

  async function sync(){
    if(busy)return;
    busy=true;
    try{
      const live=rowsFromLiveData();
      if(live.length)apply(live);
      const fresh=await fetchRows();
      if(fresh.length)apply(fresh);
    }finally{busy=false}
  }

  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(async()=>{await sync();schedule()},5*60*1000);
  }

  function start(attempt=0){
    const section=document.querySelector('.vyrdict-index-gallery,.vyrdict-index-claw');
    if(!section){if(attempt<80)setTimeout(()=>start(attempt+1),100);return}
    sync();schedule();
  }

  window.addEventListener('vyrdict:trending-data',()=>sync());
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')sync()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>start(),{once:true});else start();
})();