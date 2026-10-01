(()=>{
  if(window.__vyrdictNavigationGuardV10)return;
  window.__vyrdictNavigationGuardV10=1;

  const TYPE_REV='20260930-editorial-type-15';
  const COVER_ID='vyrdict-route-cover';
  const SCORE_ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-seo-product-data';
  const onProduct=()=>/^\/product\//i.test(location.pathname||'');
  const onCategory=()=>/^\/category\//i.test(location.pathname||'');
  let scoreRequest='',repairTimer=0;

  function installTypography(){
    if(document.getElementById('vyrdict-typography-polish-v2')||document.querySelector('script[data-vyrdict-type-polish="2"]'))return;
    const s=document.createElement('script');
    s.src='/site-typography-polish.js?v='+TYPE_REV;
    s.defer=true;
    s.dataset.vyrdictTypePolish='2';
    (document.head||document.documentElement).appendChild(s);
  }

  function installStableLoadingPaint(){
    if(document.getElementById('vyrdict-stable-loading-paint'))return;
    const style=document.createElement('style');
    style.id='vyrdict-stable-loading-paint';
    style.textContent=`
      html,body{min-height:100%}
      body{min-height:100vh}
      body #app.loading{
        min-height:calc(100vh - 122px)!important;
        margin:18px 0 24px!important;
        padding:28px!important;
        display:grid!important;
        place-items:center!important;
        background:#fffdf8!important;
        border:1px solid #d8cec4!important;
        border-radius:24px!important;
        color:#6d675f!important;
        text-align:center!important;
        box-shadow:0 16px 44px rgba(58,43,32,.05)!important;
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function installCategoryCardLayout(){
    if(!onCategory()||document.getElementById('vyrdict-category-card-layout-v1'))return;
    const style=document.createElement('style');
    style.id='vyrdict-category-card-layout-v1';
    style.textContent=`
      @media(max-width:620px){
        body .wrap .grid{gap:14px!important}
        body .wrap .grid .card{border-radius:22px!important;overflow:hidden!important;background:#fffdf8!important}
        body .wrap .grid .card .pic{height:165px!important;min-height:165px!important;max-height:165px!important;padding:14px!important;display:grid!important;place-items:center!important;overflow:hidden!important;background:#f7f1eb!important;border-bottom:1px solid #e8ddd4!important}
        body .wrap .grid .card .pic img{display:block!important;width:100%!important;height:100%!important;max-width:100%!important;max-height:137px!important;object-fit:contain!important;object-position:center!important;margin:0 auto!important;position:static!important;transform:none!important}
        body .wrap .grid .card .body{position:relative!important;z-index:2!important;margin:0!important;padding:16px 17px 18px!important;background:#fffdf8!important;transform:none!important}
        body .wrap .grid .card .body h2{position:static!important;inset:auto!important;transform:none!important;max-width:100%!important;margin:7px 0 12px!important;font:500 24px/1.06 Georgia,serif!important;letter-spacing:-.02em!important;overflow-wrap:anywhere!important;word-break:normal!important;color:#171511!important}
        body .wrap .grid .card .scores{margin:0 0 11px!important;gap:7px!important}
        body .wrap .grid .card .scores span{padding:6px 9px!important;font-size:9px!important}
        body .wrap .grid .card .body>strong{display:block!important;margin-top:2px!important;font-size:12px!important}
        body .wrap .grid .card .body p{position:static!important;transform:none!important;min-height:0!important;max-width:100%!important;margin:12px 0 15px!important;font-size:12.5px!important;line-height:1.5!important}
        body .wrap .grid .card .open{display:inline-block!important;margin-top:2px!important;font-size:9px!important}
        body .wrap .grid .rank{top:10px!important;left:10px!important}
      }
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function removeCover(){document.getElementById(COVER_ID)?.remove()}

  function productSlug(){
    const m=decodeURIComponent(location.pathname||'').match(/^\/product\/([^/?#]+)/i);
    return m?m[1]:'';
  }

  async function repairProductScores(){
    if(!onProduct()||document.hidden)return;
    const rings=[...document.querySelectorAll('.productHero .ring')];
    if(rings.length<2)return;
    const values=rings.slice(0,2).map(r=>(r.querySelector('b')?.textContent||'').trim());
    if(values.every(v=>/^\d{1,3}$/.test(v)))return;
    const s=productSlug();
    if(!s||scoreRequest===s)return;
    scoreRequest=s;
    try{
      const r=await fetch(SCORE_ENDPOINT+'?slug='+encodeURIComponent(s),{cache:'no-store',headers:{accept:'application/json'}});
      if(!r.ok)throw new Error('score '+r.status);
      const d=await r.json(),p=d?.product||{};
      if(productSlug()!==s)return;
      [Number(p.viral_score),Number(p.worth_score)].forEach((n,i)=>{
        if(!Number.isFinite(n)||!rings[i])return;
        const value=Math.max(0,Math.min(100,Math.round(n)));
        rings[i].style.setProperty('--s',String(value));
        const b=rings[i].querySelector('b');if(b)b.textContent=String(value);
      });
    }catch{}finally{scoreRequest=''}
  }

  function scheduleScoreRepair(delay=120){
    clearTimeout(repairTimer);
    repairTimer=setTimeout(repairProductScores,delay);
  }

  function lightweightSettle(){
    removeCover();
    installStableLoadingPaint();
    installTypography();
    installCategoryCardLayout();
    scheduleScoreRepair(80);
  }

  function observeApp(){
    const app=document.getElementById('app');
    if(!app||window.__vyrdictLightRepairObserver)return;
    window.__vyrdictLightRepairObserver=new MutationObserver(()=>scheduleScoreRepair(180));
    window.__vyrdictLightRepairObserver.observe(app,{childList:true,subtree:true});
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{lightweightSettle();observeApp()},{once:true});
  }else{
    lightweightSettle();observeApp();
  }

  addEventListener('pageshow',()=>{
    removeCover();
    installStableLoadingPaint();
    installTypography();
    installCategoryCardLayout();
    if(onProduct())scheduleScoreRepair(100);
  },true);

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)return;
    removeCover();
    if(onProduct())scheduleScoreRepair(120);
  },{passive:true});
})();