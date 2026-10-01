(()=>{
  // Intentionally disabled on the homepage. This module previously injected
  // unapproved "From hype to decision" / request / newsletter sections.
  window.__vyrdictGrowthRetentionV4=1;
  document.getElementById('vyrdict-growth-retention')?.remove();

  // Reuse this already-loaded app-shell script to enable the search fallback
  // without adding another serverless function to the deployment.
  if(!window.__vyrdictEmptySearchSuggestV2&&!document.querySelector('script[src*="search-empty-suggest.js"]')){
    const s=document.createElement('script');
    s.src='/search-empty-suggest.js?v=20261001-search-suggest-2';
    s.defer=true;
    document.head.appendChild(s);
  }
})();
