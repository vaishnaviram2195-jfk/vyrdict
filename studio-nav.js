// Studio services are paused. Keep the existing hub navigation only.
(()=>{
  if(window.__vyrdictHubOnlyNav)return;
  window.__vyrdictHubOnlyNav=true;
  function apply(){
    document.querySelectorAll('#vyrdict-studio-home-teaser,.vyrdict-studio-nav-link,.studio-nav-cta,[data-vyrdict-studio-inline],[data-vyrdict-studio-topnav]').forEach(el=>el.remove());
    document.querySelectorAll('a[href]').forEach(a=>{
      const u=new URL(a.getAttribute('href'),location.href);
      if(u.origin===location.origin && /^\/(?:studio|links\/(?:studio|work))(?:\/|$)/.test(u.pathname))a.remove();
    });
    document.querySelectorAll('header,body>nav').forEach(h=>{
      const nav=h.querySelector('nav')||h;
      if(!nav.querySelector('a[href="/links/"]')&&nav.querySelector('a,button')){
        const a=document.createElement('a');a.href='/links/';a.textContent='← Back to Hub';
        a.className='vyrdict-hub-nav-link';a.setAttribute('aria-label','Back to VYRDICT Hub');nav.prepend(a);
      }
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(apply,90)}).observe(document.documentElement,{childList:true,subtree:true});
})();
