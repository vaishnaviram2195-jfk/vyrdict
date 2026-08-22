(()=>{
  const TIKTOK_URL='https://www.tiktok.com/@vyrdict';

  function patchTikTokLinks(root=document){
    const links=[...root.querySelectorAll('a')];
    for(const a of links){
      const href=(a.getAttribute('href')||'').toLowerCase();
      const text=(a.textContent||'').trim().toLowerCase();
      const aria=(a.getAttribute('aria-label')||'').toLowerCase();
      const title=(a.getAttribute('title')||'').toLowerCase();
      if(href.includes('tiktok.com')||text==='tiktok'||aria.includes('tiktok')||title.includes('tiktok')){
        a.href=TIKTOK_URL;
        a.target='_blank';
        a.rel='noopener noreferrer';
        a.dataset.vyrdictSocialLink='tiktok';
      }
    }
  }

  function patchVerifiedCount(root=document){
    const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(/247\+\s*verified\s*products/i.test(node.nodeValue||'')){
        node.nodeValue=(node.nodeValue||'').replace(/247\+\s*verified\s*products/gi,'200+ verified products');
      }
    }
  }

  function patchAll(){patchTikTokLinks();patchVerifiedCount()}
  function schedule(){[0,80,250,600,1200].forEach(ms=>setTimeout(patchAll,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>setTimeout(patchAll,40),{passive:true});
  new MutationObserver(patchAll).observe(document.documentElement,{subtree:true,childList:true});
})();

(()=>{
  if(document.getElementById('vyrdict-launch-feedback-loader'))return;
  const s=document.createElement('script');
  s.id='vyrdict-launch-feedback-loader';
  s.src='/launch-feedback.js?v=inline-actions-1';
  s.defer=true;
  document.head.appendChild(s);
})();
