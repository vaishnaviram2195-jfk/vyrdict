(()=>{
  if(window.__vyrdictSocialLinksV7)return;
  window.__vyrdictSocialLinksV7=1;
  const TIKTOK_URL='https://www.tiktok.com/@vyrdict';
  let timer=0;

  function patchTikTokLinks(root=document){
    for(const a of root.querySelectorAll?.('a')||[]){
      const href=(a.getAttribute('href')||'').toLowerCase();
      const text=(a.textContent||'').trim().toLowerCase();
      const aria=(a.getAttribute('aria-label')||'').toLowerCase();
      const title=(a.getAttribute('title')||'').toLowerCase();
      if(href.includes('tiktok.com')||text==='tiktok'||aria.includes('tiktok')||title.includes('tiktok')){
        a.href=TIKTOK_URL;a.target='_blank';a.rel='noopener noreferrer';a.dataset.vyrdictSocialLink='tiktok';
      }
    }
  }
  function queue(delay=80){clearTimeout(timer);timer=setTimeout(()=>patchTikTokLinks(),delay)}
  function loadFeedback(){
    if(document.getElementById('vyrdict-launch-feedback-loader'))return;
    const s=document.createElement('script');s.id='vyrdict-launch-feedback-loader';s.src='/launch-feedback.js?v=inline-actions-1';s.defer=true;document.head.appendChild(s);
  }
  function deferFeedback(){
    if('requestIdleCallback' in window)requestIdleCallback(loadFeedback,{timeout:2500});
    else setTimeout(loadFeedback,1800);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{patchTikTokLinks();deferFeedback()},{once:true});
  else{patchTikTokLinks();deferFeedback()}
  addEventListener('popstate',()=>queue(80));addEventListener('hashchange',()=>queue(80));
  const observe=()=>{const app=document.getElementById('app');if(app)new MutationObserver(()=>queue(100)).observe(app,{childList:true,subtree:false})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();
