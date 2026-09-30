(()=>{
  const STYLE_ID='vyrdict-header-brand-fix-style';
  if(!document.getElementById(STYLE_ID)){
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-header-wordmark{display:inline-flex!important;align-items:flex-end!important;gap:.055em!important}
      .vyrdict-header-mark{display:inline-block!important;width:.18em!important;height:.18em!important;background:#d94d73!important;border-radius:0!important;flex:0 0 auto!important;transform:translateY(-.24em)!important}
    `;
    document.head.appendChild(s);
  }

  function fix(){
    const candidates=[...document.querySelectorAll('header a,header div,header span,nav a,nav div,nav span,a,div,span')]
      .filter(el=>!el.closest('#vyrdict-company-footer')&&(el.textContent||'').trim()==='VYRDICT.');
    const target=candidates
      .filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&r.top<260&&r.left<260})
      .sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0];
    if(!target||target.dataset.vyrdictHeaderBrandFixed==='1')return false;
    target.dataset.vyrdictHeaderBrandFixed='1';
    target.classList.add('vyrdict-header-wordmark');
    target.innerHTML='<span>VYRDICT</span><span class="vyrdict-header-mark" aria-hidden="true"></span>';
    return true;
  }

  function removeLegacyMobile(){
    document.getElementById('vyrdict-mobile-final-style')?.remove();
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();
    document.querySelector('.hero')?.classList.remove('vyrdict-current-static');
    try{
      for(const k of Object.keys(localStorage)){
        if(/^vyrdict:bundle-cache:v(?:15|16|17)$/.test(k))localStorage.removeItem(k);
      }
    }catch{}
  }

  function load(src,id){
    if(document.getElementById(id))return;
    const s=document.createElement('script');
    s.id=id;
    s.src=src;
    s.defer=true;
    document.head.appendChild(s);
  }

  function boot(attempt=0){
    removeLegacyMobile();
    fix();
    load('/performance-monitor.js?v=1-20260907','vyrdict-performance-monitor-loader');
    load('/conversion-optimization.js?v=1-20260907','vyrdict-conversion-optimization-loader');
    load('/header-categories-menu.js?v=3-20260930-gifts','vyrdict-header-categories-menu-loader');
    load('/search-empty-suggest.js?v=2-20260930-immediate','vyrdict-search-empty-suggest-loader');
    load('/newsletter-welcome-popup.js?v=5-20260930-compact','vyrdict-newsletter-welcome-popup-loader');
    if(location.hostname==='www.vyrdict.com'){
      location.replace('https://vyrdict.com'+location.pathname+location.search+location.hash);
      return;
    }
    if(location.pathname==='/'||location.pathname===''){
      load('/homepage-hero-variety.js?v=9-20260904-mobilefix','vyrdict-current-hero-loader');
      load('/growth-retention.js?v=2-20260904-mobilefix','vyrdict-current-growth-loader');
      load('/homepage-news-desk.js?v=1-20260929-vogue','vyrdict-home-news-desk-loader');
      load('/homepage-remove-worth.js?v=1-20260929','vyrdict-home-remove-worth-loader');
      load('/homepage-remove-bottom-categories.js?v=1-20260929','vyrdict-home-remove-bottom-categories-loader');
      load('/homepage-culture-trio.js?v=4-20260930-ikeaquality','vyrdict-home-culture-trio-loader');
      load('/homepage-signal-landscape.js?v=3-20260930-trimmed','vyrdict-home-signal-landscape-loader');
      load('/homepage-moment-top.js?v=6-20260930-liveviral','vyrdict-home-moment-top-loader');
      load('/homepage-heading-scale.js?v=1-20260930','vyrdict-home-heading-scale-loader');
      load('/homepage-seamless-spacing.js?v=1-20260930','vyrdict-home-seamless-spacing-loader');
      load('/homepage-detail-tuning.js?v=2-20260930-fullbleed','vyrdict-home-detail-tuning-loader');
    }
    if(attempt<20&&!document.querySelector('header,nav'))setTimeout(()=>boot(attempt+1),120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('pageshow',()=>setTimeout(removeLegacyMobile,0));
  addEventListener('popstate',()=>setTimeout(boot,20));
})();