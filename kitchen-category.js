(()=>{
  if(window.__vyrdictKitchenCategoryV1)return;
  window.__vyrdictKitchenCategoryV1=1;
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  function categorySection(){
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes('browse by category'));
    return h?.closest('section')||h?.closest('.section')||document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category')?.closest('section')||null;
  }
  function apply(){
    document.querySelectorAll('.chip.cat').forEach(el=>{if(norm(el.textContent).endsWith('kitchen'))el.textContent='🍳 Kitchen'});
    if(!isHome())return true;
    const sec=categorySection();if(!sec)return false;
    let item=[...sec.querySelectorAll('[data-category]')].find(x=>norm(x.dataset.category||x.textContent)==='kitchen');
    if(!item){
      const items=[...sec.querySelectorAll('[data-category]')];if(!items.length)return false;
      item=items[0].cloneNode(true);item.dataset.category='Kitchen';
      const more=sec.querySelector('.v-home-category-more');
      (more||items[items.length-1]).insertAdjacentElement(more?'beforebegin':'afterend',item);
    }
    item.textContent='🍳 Kitchen';item.style.removeProperty('display');
    if(sec.dataset.vHomeExpanded!=='1')item.hidden=true;else item.hidden=false;
    return true;
  }
  function boot(n=0){if(apply()||n>20)return;setTimeout(()=>boot(n+1),120)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>boot());addEventListener('hashchange',()=>boot());
  new MutationObserver(()=>{clearTimeout(window.__vyrdictKitchenCategoryTimer);window.__vyrdictKitchenCategoryTimer=setTimeout(apply,100)}).observe(document.documentElement,{childList:true,subtree:true});
})();
