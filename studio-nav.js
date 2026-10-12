(()=>{
  if(window.__vyrdictStudioNavV1)return;
  window.__vyrdictStudioNavV1=1;
  const STYLE='vyrdict-studio-nav-style';
  const addStyle=()=>{
    if(document.getElementById(STYLE))return;
    const s=document.createElement('style');s.id=STYLE;s.textContent=
      '.vyrdict-hub-nav-link{display:inline-flex!important;align-items:center!important;min-height:40px;flex:0 0 auto;color:inherit!important;font-size:11px!important;font-weight:700!important;white-space:nowrap;text-decoration:underline!important;text-underline-offset:4px;letter-spacing:.04em!important}'+
      '.vyrdict-studio-nav-link{display:inline-flex!important;align-items:center!important;justify-content:center!important;background:#762f48!important;color:#fff!important;border-radius:999px!important;padding:10px 14px!important;text-decoration:none!important;font-weight:900!important;letter-spacing:.08em!important;text-transform:uppercase!important;font-size:9px!important;line-height:1!important}'+
      '#vyrdict-studio-home-teaser{margin:56px auto 20px;max-width:1180px;width:calc(100% - 36px);background:linear-gradient(130deg,#191416,#5f2238 58%,#888086);color:#fff;border-radius:28px;padding:38px 42px;box-sizing:border-box;overflow:hidden;position:relative}'+
      '#vyrdict-studio-home-teaser .vs-k{font:900 9px/1 Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#d9b6c3}'+
      '#vyrdict-studio-home-teaser h2{margin:12px 0 12px;font:500 clamp(30px,4vw,52px)/1 Georgia,serif;letter-spacing:-.04em}'+
      '#vyrdict-studio-home-teaser p{margin:0;max-width:680px;color:#e5dde0;font:14px/1.6 Arial,sans-serif}'+
      '#vyrdict-studio-home-teaser a{display:inline-flex;margin-top:20px;padding:11px 15px;background:#fff;color:#171416;border-radius:999px;text-decoration:none;font:900 9px/1 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}'+
      '@media(max-width:700px){#vyrdict-studio-home-teaser{padding:28px 24px;border-radius:22px}.vyrdict-studio-nav-link{padding:9px 11px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  };
  const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
  const canonicalStudioLinks=()=>{
    document.querySelectorAll('a[href]').forEach(a=>{
      try{
        const u=new URL(a.getAttribute('href'),location.href);
        if(u.origin!==location.origin||!/^\/studio(?:\/index\.html)?\/?$/.test(u.pathname))return;
        const target='/links/studio/'+u.search+u.hash;
        if(a.getAttribute('href')!==target)a.setAttribute('href',target);
      }catch{}
    });
  };
  const addNav=()=>{
    addStyle();
    const headers=[...document.querySelectorAll('header,body>nav')].filter(el=>el.offsetWidth>0&&el.offsetHeight>0);
    for(const h of headers){
      const nav=h.querySelector('nav')||h;
      const links=[...nav.querySelectorAll('a,button')].filter(x=>x.offsetWidth>0&&x.offsetHeight>0);
      if(!links.length)continue;
      if(!nav.querySelector('[data-vyrdict-hub-link="1"],a[href="/links/"]')){
        const hub=document.createElement('a');
        hub.href='/links/';hub.textContent='← Back to Hub';
        hub.className='vyrdict-hub-nav-link';
        hub.setAttribute('data-vyrdict-hub-link','1');
        hub.setAttribute('aria-label','Back to VYRDICT Hub');
        nav.prepend(hub);
      }
      if(h.querySelector('.vyrdict-studio-nav-link')||links.some(x=>norm(x.textContent)==='studio'))continue;
      const a=document.createElement('a');a.href='/links/studio/';a.textContent='Studio';a.className='vyrdict-studio-nav-link';a.setAttribute('aria-label','VYRDICT Studio');
      nav.appendChild(a);
    }
  };
  const addTeaser=()=>{
    if(location.pathname!=='/'||document.getElementById('vyrdict-studio-home-teaser'))return;
    const footer=document.querySelector('footer');
    if(!footer)return;
    const s=document.createElement('section');s.id='vyrdict-studio-home-teaser';s.innerHTML='<div class="vs-k">FOR BRANDS</div><h2>See what matters before everyone else does.</h2><p>Trend intelligence, creative strategy and creator campaigns — built around one question: is this actually worth chasing?</p><a href="/links/studio/">Explore VYRDICT Studio →</a>';
    footer.parentNode.insertBefore(s,footer);
  };
  const apply=()=>{canonicalStudioLinks();addNav();addTeaser()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  [180,550,1200,2400].forEach(ms=>setTimeout(apply,ms));
  new MutationObserver(()=>{clearTimeout(window.__vyrdictStudioNavTimer);window.__vyrdictStudioNavTimer=setTimeout(apply,90)}).observe(document.documentElement,{childList:true,subtree:true});
})();