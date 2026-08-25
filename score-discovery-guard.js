(()=>{
  if(window.__vyrdictScoreDiscoveryGuardV1)return;
  window.__vyrdictScoreDiscoveryGuardV1=1;

  function localScoreUrl(raw){
    try{
      const u=new URL(raw,location.href);
      if(!u.hostname.endsWith('supabase.co')||!u.pathname.includes('/functions/v1/vyrdict-score-discovery'))return null;
      const slug=(u.searchParams.get('slug')||'').trim();
      if(!slug)return null;
      const market=(u.searchParams.get('market')||localStorage.getItem('vyrdict:country')||'CA').toUpperCase()==='US'?'US':'CA';
      return '/score-discovery?slug='+encodeURIComponent(slug)+'&market='+market;
    }catch{return null}
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const a=e.target?.closest?.('a[href]');
    if(!a)return;
    const dest=localScoreUrl(a.href);
    if(!dest)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    location.assign(dest);
  },true);
})();
