(()=>{
  if(window.__vyrdictTrendingActiveCategoriesV1)return;
  window.__vyrdictTrendingActiveCategoriesV1=1;

  const STYLE_ID='vyrdict-trending-active-categories-v1';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  let section=null,attempts=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-index-claw .vti-cat.vti-cat-unavailable{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function freshProducts(){
    return (window.__vyrdictTrendingLiveData?.products||[]).filter(p=>p&&p.slug&&p.image_url&&!p.__vyrdictFreshnessSentinel);
  }

  function sync(){
    section=document.querySelector('.vyrdict-index-claw');
    if(!section){if(attempts++<60)setTimeout(sync,80);return}
    attempts=0;
    addStyle();

    const products=freshProducts();
    const available=new Set(products.map(p=>norm(p.category)).filter(Boolean));
    const buttons=[...section.querySelectorAll('.vti-cat')];

    buttons.forEach(btn=>{
      const cat=btn.dataset.cat||btn.textContent||'';
      const show=cat==='All'||available.has(norm(cat));
      btn.classList.toggle('vti-cat-unavailable',!show);
      btn.setAttribute('aria-hidden',show?'false':'true');
      btn.tabIndex=show?0:-1;
    });

    const active=section.querySelector('.vti-cat.is-active');
    if(active?.classList.contains('vti-cat-unavailable')){
      const all=buttons.find(b=>(b.dataset.cat||'')==='All'&&!b.classList.contains('vti-cat-unavailable'));
      if(all)setTimeout(()=>all.click(),0);
    }

    const ph=section.querySelector('.vti-placeholder');
    if(ph&&!products.length)ph.textContent='Refreshing the live index…';

    const hint=section.querySelector('.vti-hint');
    if(hint)hint.textContent='Categories update automatically as fresh breakouts are verified.';
  }

  window.addEventListener('vyrdict:trending-data',sync);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
  setTimeout(sync,500);
  setTimeout(sync,1400);
})();