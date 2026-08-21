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

  function schedule(){[0,80,250,600,1200].forEach(ms=>setTimeout(()=>patchTikTokLinks(),ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>setTimeout(()=>patchTikTokLinks(),40),{passive:true});
  new MutationObserver(()=>patchTikTokLinks()).observe(document.documentElement,{subtree:true,childList:true});
})();
