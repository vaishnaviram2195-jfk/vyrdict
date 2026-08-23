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

  function schedule(){[0,80,220,500,900,1600].forEach(ms=>setTimeout(fix,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('hashchange',()=>setTimeout(fix,60));
  addEventListener('popstate',()=>setTimeout(fix,60));
})();
(()=>{
  if(document.getElementById('vyrdict-home-simplify-loader'))return;
  const s=document.createElement('script');
  s.id='vyrdict-home-simplify-loader';
  s.src='/homepage-simplify.js?v=1';
  s.defer=true;
  document.head.appendChild(s);
})();
(()=>{
  if(document.getElementById('vyrdict-home-hero-variety-loader'))return;
  const s=document.createElement('script');
  s.id='vyrdict-home-hero-variety-loader';
  s.src='/homepage-hero-variety.js?v=1';
  s.defer=true;
  document.head.appendChild(s);
})();
