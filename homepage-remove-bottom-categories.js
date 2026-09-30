(()=>{
  if(window.__vyrdictRemoveBottomCategoriesV1)return;
  window.__vyrdictRemoveBottomCategoriesV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT_ID='vyrdict-editorial-home';
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

  function removeBlock(){
    const root=document.getElementById(ROOT_ID)||document;
    const headings=[...root.querySelectorAll('h1,h2,h3,h4,h5,[role="heading"]')];
    const heading=headings.find(el=>{
      const t=norm(el.textContent);
      return t==='find your next obsession'||t==='find your obsession'||t.includes('find your next obsession');
    });
    if(!heading)return false;

    let block=heading.closest('section');
    if(!block){
      let p=heading.parentElement;
      while(p&&p!==root&&p!==document.body){
        const categoryLinks=p.querySelectorAll?.('a[href*="/category/"],[data-category]').length||0;
        if(categoryLinks>=3){block=p;break}
        p=p.parentElement;
      }
    }
    if(!block)return false;
    block.remove();
    return true;
  }

  let tries=0;
  const tick=()=>{tries++;removeBlock();if(tries<40)setTimeout(tick,tries<12?150:450)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();

  const host=document.getElementById('app')||document.body;
  new MutationObserver(()=>setTimeout(removeBlock,25)).observe(host,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(removeBlock,60));
})();
