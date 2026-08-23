(()=>{
  if(window.__vyrdictWorthShowLessFix)return;
  window.__vyrdictWorthShowLessFix=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();

  function getWorth(){
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes('actually worth the hype'))
      || [...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes('worth the hype'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function ensureVisibleControl(section){
    if(!section)return;
    const rail=section.querySelector('.rail,[data-rail]');
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    const cta=rail?.querySelector(':scope > .vyrdict-featured-cta');
    if(!rail||!extra||!cta)return;

    let collapse=section.querySelector('.vyrdict-worth-show-less');
    if(!collapse){
      collapse=document.createElement('button');
      collapse.type='button';
      collapse.className='vyrdict-featured-collapse-v3 vyrdict-worth-show-less';
      collapse.textContent='Show less';
      collapse.addEventListener('click',()=>{
        section.dataset.vyrdictFeaturedExpanded='0';
        extra.hidden=true;
        cta.hidden=false;
        collapse.hidden=true;
        requestAnimationFrame(()=>cta.scrollIntoView({block:'nearest'}));
      });
    }

    if(collapse.nextElementSibling!==extra)rail.insertAdjacentElement('afterend',collapse);
    collapse.hidden=section.dataset.vyrdictFeaturedExpanded!=='1';
  }

  document.addEventListener('click',e=>{
    const section=getWorth();
    const cta=e.target.closest('.vyrdict-featured-cta');
    if(!section||!cta||!section.contains(cta))return;
    requestAnimationFrame(()=>{
      section.dataset.vyrdictFeaturedExpanded='1';
      ensureVisibleControl(section);
    });
  });

  function boot(attempt=0){
    const section=getWorth();
    if(section){ensureVisibleControl(section);return}
    if(attempt<20)setTimeout(()=>boot(attempt+1),120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
})();
