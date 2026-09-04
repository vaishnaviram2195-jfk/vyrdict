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
    if(location.hostname==='www.vyrdict.com'){
      location.replace('https://vyrdict.com'+location.pathname+location.search+location.hash);
      return;
    }
    if(location.pathname==='/'||location.pathname===''){
      load('/homepage-hero-variety.js?v=9-20260904-mobilefix','vyrdict-current-hero-loader');
      load('/growth-retention.js?v=2-20260904-mobilefix','vyrdict-current-growth-loader');
    }
    if(attempt<20&&!document.querySelector('header,nav'))setTimeout(()=>boot(attempt+1),120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('pageshow',()=>setTimeout(removeLegacyMobile,0));
  addEventListener('popstate',()=>setTimeout(boot,20));
})();
