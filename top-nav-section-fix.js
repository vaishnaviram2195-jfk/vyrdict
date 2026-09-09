(()=>{
  if(window.__vyrdictTopNavSectionFixV4)return;
  window.__vyrdictTopNavSectionFixV4=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const HEADER_OFFSET=92;
  const isHome=()=>location.pathname==='/'||location.pathname==='';

  function candidates(){
    return [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].filter(el=>{
      const t=norm(el.textContent);
      if(!t||t.length>140||el.childElementCount>5)return false;
      const r=el.getBoundingClientRect();
      return r.width>0&&r.height>0;
    });
  }

  function findTarget(kind){
    const els=candidates();
    if(kind==='explore'){
      return document.getElementById('viral')
        || document.querySelector('[data-section="viral"],#trending-index,.vyrdict-index-gallery')
        || els.find(el=>norm(el.textContent)==="what's trending now")
        || els.find(el=>norm(el.textContent).includes("what's trending now"));
    }
    if(kind==='categories'){
      return document.getElementById('categories')
        || document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category')
        || els.find(el=>norm(el.textContent)==='browse by category')
        || els.find(el=>norm(el.textContent).includes('browse by category'));
    }
    if(kind==='culture'){
      return document.getElementById('culture')
        || document.querySelector('[data-section="culture"],.culture-section')
        || els.find(el=>norm(el.textContent)==='you saw it then everyone bought it')
        || els.find(el=>norm(el.textContent).includes('culture commerce'))
        || els.find(el=>norm(el.textContent).includes('you saw it then everyone bought it'));
    }
    return null;
  }

  function scrollToKind(kind,attempt=0){
    const target=findTarget(kind);
    if(!target){
      if(attempt<30)setTimeout(()=>scrollToKind(kind,attempt+1),120);
      return false;
    }
    const y=Math.max(0,target.getBoundingClientRect().top+window.scrollY-HEADER_OFFSET);
    window.scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    if(location.hash==='#'+kind){
      try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}
    }
    return true;
  }

  function kindFrom(el){
    const t=norm(el?.textContent);
    if(t==='explore')return 'explore';
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
    if(r.top>180)return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if(!isHome()){
      location.assign('/#'+kind);
      return;
    }
    scrollToKind(kind);
  },true);

  function handleInitial(){
    const h=(location.hash||'').toLowerCase();
    if(h==='#explore')scrollToKind('explore');
    if(h==='#categories')scrollToKind('categories');
    if(h==='#culture')scrollToKind('culture');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(handleInitial,100),{once:true});
  else setTimeout(handleInitial,100);
  addEventListener('hashchange',()=>setTimeout(handleInitial,50));
})();
