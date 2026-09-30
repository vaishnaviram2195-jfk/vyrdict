(()=>{
  if(window.__vyrdictTopNavSectionFixV12)return;
  window.__vyrdictTopNavSectionFixV12=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const HEADER_OFFSET=88;
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const PRIMARY='data-vyrdict-topnav';

  function loadEditorialHome(){
    if(!isHome()||document.getElementById('vyrdict-editorial-bootstrap-loader-v6'))return;
    const s=document.createElement('script');
    s.id='vyrdict-editorial-bootstrap-loader-v6';
    s.src='/homepage-editorial-bootstrap.js?v=6-20260929-video685';
    s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }
  loadEditorialHome();

  function kindFrom(el){
    const footer=el?.getAttribute('data-vf-action');
    if(footer)return ({weekly:'explore',categories:'categories',skip:'skip',saved:'saves'})[footer]||'';
    const t=norm(el?.textContent);
    if(t==='explore')return 'explore';
    if(t==='categories')return 'categories';
    if(t==='culture')return 'culture';
    if(t==='account')return 'account';
    if(t==='saves'||t.startsWith('saves ')||t==='saved')return 'saves';
    return '';
  }

  function wire(){
    document.querySelectorAll('header a,header button,header [data-nav],nav a,nav button,nav [data-nav]').forEach(el=>{
      const kind=kindFrom(el);
      if(!kind)return;
      el.setAttribute(PRIMARY,'1');
      el.setAttribute('data-vyrdict-topnav-kind',kind);
      if(el.tagName==='A'){
        if(kind==='explore')el.setAttribute('href','/#explore');
        else if(kind==='categories')el.setAttribute('href','/#categories');
        else if(kind==='culture')el.setAttribute('href','/#culture');
        else if(kind==='skip')el.setAttribute('href','/#skip-list');
        else if(kind==='account')el.setAttribute('href','/account.html');
        else if(kind==='saves')el.setAttribute('href','/saved');
      }
    });
  }

  function visible(el){
    if(!el)return false;
    const r=el.getBoundingClientRect();
    const s=getComputedStyle(el);
    return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
  }

  function candidates(){
    return [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].filter(el=>{
      const t=norm(el.textContent);
      if(!t||t.length>140||el.childElementCount>5)return false;
      return visible(el);
    });
  }

  function findTarget(kind){
    if(kind==='skip')return document.getElementById('skip-list');
    const els=candidates();
    if(kind==='explore'){
      return document.getElementById('ve-community')
        || document.getElementById('trending-index')
        || document.querySelector('.vyrdict-index-gallery,#viral,[data-section="viral"],[data-section="trending"]')
        || els.find(el=>norm(el.textContent)==='trending index')
        || els.find(el=>norm(el.textContent).includes("what's trending now"));
    }
    if(kind==='categories'){
      return document.querySelector('.ve-discover')
        || document.getElementById('categories')
        || document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category,.v-home-categories')
        || els.find(el=>norm(el.textContent)==='browse by category')
        || els.find(el=>norm(el.textContent).includes('browse by category'));
    }
    if(kind==='culture'){
      return document.querySelector('.ve-story')
        || document.getElementById('culture')
        || document.querySelector('[data-section="culture"],.culture-section')
        || els.find(el=>norm(el.textContent).includes('culture commerce'))
        || els.find(el=>norm(el.textContent).includes('you saw it then everyone bought it'));
    }
    return null;
  }

  function scrollToKind(kind,attempt=0){
    const target=findTarget(kind);
    if(!target||!visible(target)){
      if(attempt<36)setTimeout(()=>scrollToKind(kind,attempt+1),120);
      return false;
    }
    const y=Math.max(0,target.getBoundingClientRect().top+window.scrollY-HEADER_OFFSET);
    window.scrollTo({top:y,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    if(location.hash==='#'+kind){
      setTimeout(()=>{try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}},250);
    }
    return true;
  }

  function activate(kind){
    if(kind==='account'){location.assign('/account.html');return;}
    if(kind==='saves'){location.assign('/saved');return;}
    if(!isHome()){location.assign('/#'+(kind==='skip'?'skip-list':kind));return;}
    scrollToKind(kind);
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const el=e.target?.closest?.('a,button,[data-nav]');
    if(!el)return;
    let kind=el.getAttribute('data-vyrdict-topnav-kind')||'';
    if(!kind&&el.closest('header,nav'))kind=kindFrom(el);
    if(!kind)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();activate(kind);
  },true);

  function handleInitial(){
    if(!isHome())return;
    const h=(location.hash||'').toLowerCase();
    if(h==='#skip-list')scrollToKind('skip');
    else if(h==='#explore')scrollToKind('explore');
    else if(h==='#categories')scrollToKind('categories');
    else if(h==='#culture')scrollToKind('culture');
  }

  const start=()=>{
    loadEditorialHome();wire();handleInitial();
    const app=document.getElementById('app')||document.body;
    if(app&&!window.__vyrdictTopNavWireObserver){
      window.__vyrdictTopNavWireObserver=new MutationObserver(()=>wire());
      window.__vyrdictTopNavWireObserver.observe(app,{childList:true,subtree:true});
    }
    [120,400,900,1800].forEach(ms=>setTimeout(()=>{loadEditorialHome();wire();handleInitial()},ms));
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  addEventListener('pageshow',()=>setTimeout(start,20));
  addEventListener('hashchange',()=>setTimeout(handleInitial,50));
})();