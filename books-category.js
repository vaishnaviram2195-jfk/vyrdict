(()=>{
  if(window.__vyrdictBooksCategoryV1)return;
  window.__vyrdictBooksCategoryV1=1;
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  function section(){
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes('browse by category'));
    return h?.closest('section')||h?.closest('.section')||document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category')?.closest('section')||null;
  }
  function ensure(){
    if(!isHome())return true;
    const sec=section();if(!sec)return false;
    let book=[...sec.querySelectorAll('[data-category]')].find(x=>norm(x.dataset.category||x.textContent)==='books');
    if(book)return true;
    const items=[...sec.querySelectorAll('[data-category]')];if(!items.length)return false;
    book=items[0].cloneNode(true);
    book.dataset.category='Books';
    book.textContent='📚 Books';
    book.hidden=false;book.style.removeProperty('display');
    const more=sec.querySelector('.v-home-category-more');
    (more||items[items.length-1]).insertAdjacentElement(more?'beforebegin':'afterend',book);
    if(sec.dataset.vHomeExpanded!=='1')book.hidden=true;
    return true;
  }
  function boot(n=0){if(ensure()||n>20)return;setTimeout(()=>boot(n+1),120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>boot());addEventListener('hashchange',()=>boot());
  new MutationObserver(()=>{clearTimeout(window.__vyrdictBooksCategoryTimer);window.__vyrdictBooksCategoryTimer=setTimeout(ensure,100)}).observe(document.documentElement,{childList:true,subtree:true});
})();
