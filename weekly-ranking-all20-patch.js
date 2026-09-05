(()=>{
  if(window.__vyrdictWeeklyAll20Patch)return;
  window.__vyrdictWeeklyAll20Patch=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const EXTRA=new Set(['beauty tech','skincare','perfume','shoes']);

  function weeklySection(){
    const hs=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=hs.find(el=>norm(el.textContent).includes('weekly viral rankings'))||hs.find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function resetExpandedState(section){
    if(!section)return;
    const row=section.querySelector('.vyrdict-weekly-row-v8');
    row?.querySelectorAll(':scope > .vyrdict-weekly-extra-v8,:scope > .vyrdict-weekly-cta-v8').forEach(el=>el.remove());
    section.querySelectorAll('.vyrdict-weekly-collapse-v8').forEach(el=>el.remove());
    // The existing weekly-ranking observer sees this mutation and rebuilds the
    // collapsed CTA against the newly selected category.
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('button,[role="button"]');
    if(!btn||!EXTRA.has(norm(btn.textContent)))return;
    const section=weeklySection();
    if(!section||!section.contains(btn))return;
    setTimeout(()=>resetExpandedState(weeklySection()),120);
    setTimeout(()=>resetExpandedState(weeklySection()),320);
  },true);
})();
