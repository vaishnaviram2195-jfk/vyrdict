(()=>{
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const HEADER_OFFSET=92;

  function candidates(){
    return [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].filter(el=>{
      const t=norm(el.textContent);
      if(!t||t.length>120)return false;
      if(el.childElementCount>4)return false;
      const r=el.getBoundingClientRect();
      return r.width>0&&r.height>0;
    });
  }

  function findTarget(kind){
    const els=candidates();
    if(kind==='categories'){
      return els.find(el=>norm(el.textContent)==='browse by category')
        || els.find(el=>norm(el.textContent).includes('browse by category'))
        || document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category');
    }
    if(kind==='culture'){
      return els.find(el=>norm(el.textContent)==='you saw it then everyone bought it')
        || els.find(el=>norm(el.textContent).includes('culture commerce'))
        || els.find(el=>norm(el.textContent).includes('you saw it then everyone bought it'))
        || document.querySelector('[data-section="culture"],#culture,.culture-section');
    }
    return null;
  }

  function scrollToKind(kind,attempt=0){
    const target=findTarget(kind);
    if(!target){
      if(attempt<12)setTimeout(()=>scrollToKind(kind,attempt+1),120);
      return false;
    }
    const y=Math.max(0,target.getBoundingClientRect().top+window.scrollY-HEADER_OFFSET);
    window.scrollTo({top:y,behavior:'smooth'});
    if(location.hash==='#'+kind){
      try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}
    }
    return true;
  }

  function kindFrom(el){
    const t=norm(el?.textContent);
    if(t==='categories')return 'categories';
    if(t==='culture')return 'culture';
    return null;
  }

  document.addEventListener('click',e=>{
    const el=e.target.closest('a,button');
    if(!el)return;
    const kind=kindFrom(el);
    if(!kind)return;
    const r=el.getBoundingClientRect();
    if(r.top>170)return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if(location.pathname!=='/'&&location.pathname!==''){
      location.assign('/#'+kind);
      return;
    }
    scrollToKind(kind);
  },true);

  function handleInitial(){
    const h=(location.hash||'').toLowerCase();
    if(h==='#categories')scrollToKind('categories');
    if(h==='#culture')scrollToKind('culture');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(handleInitial,80),{once:true});
  else setTimeout(handleInitial,80);
  addEventListener('hashchange',()=>setTimeout(handleInitial,40));
})();
