(()=>{
  if(window.__vyrdictCategoryFailsafeV2)return;
  window.__vyrdictCategoryFailsafeV2=1;
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const labels=new Set(['see more categories','show fewer categories','browse more categories','browse more category','browse fewer categories']);
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  let observer=null,timer=0;
  function installStyle(){
    if(document.getElementById('vyrdict-category-expander-order-v2'))return;
    const style=document.createElement('style');
    style.id='vyrdict-category-expander-order-v2';
    style.textContent=`
      body.vyrdict-home-calm .v-home-category-details[open]{display:flex!important;flex-direction:column!important;align-items:flex-start!important;width:100%!important}
      body.vyrdict-home-calm .v-home-category-details[open]>.v-home-category-extra{order:1!important;width:100%!important;margin-top:0!important;margin-bottom:12px!important}
      body.vyrdict-home-calm .v-home-category-details[open]>summary{order:2!important;margin:0!important;align-self:flex-start!important}
    `;
    (document.head||document.documentElement).appendChild(style);
  }
  function section(){
    const byId=document.getElementById('categories');if(byId)return byId;
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes('browse by category'));
    return h?.closest('section')||h?.closest('.section')||null;
  }
  function removeExtraControls(sec,keep){
    const nodes=[...sec.querySelectorAll('button,a,summary,[role="button"],[data-category],.v-home-category-more,.v-home-category-details')];
    nodes.forEach(el=>{
      if(el===keep||el.closest('.v-home-category-details')===keep?.closest('.v-home-category-details'))return;
      if(el.classList?.contains('v-home-category-details')){if(el!==keep?.closest('.v-home-category-details'))el.remove();return}
      const data=norm(el.getAttribute?.('data-category'));
      const text=norm(el.textContent);
      if(labels.has(data)||labels.has(text)){
        const d=el.closest('details');
        if(d&&d!==keep?.closest('details'))d.remove();else el.remove();
      }
    });
  }
  function sync(details,summary){
    const label=details.open?'Show fewer categories':'Browse more categories';
    if(norm(summary.textContent)!==norm(label))summary.textContent=label;
    const extra=details.querySelector('.v-home-category-extra');
    if(extra){
      extra.hidden=!details.open;
      if(details.open){extra.removeAttribute('hidden');extra.style.display='flex';extra.style.visibility='visible';extra.querySelectorAll('[data-category]').forEach(b=>{b.hidden=false;b.removeAttribute('hidden')})}
      else{extra.style.removeProperty('display');extra.style.removeProperty('visibility')}
    }
  }
  function fix(){
    if(!isHome())return false;
    installStyle();
    const sec=section(),container=sec?.querySelector('.categories');if(!sec||!container)return false;
    let details=container.querySelector('.v-home-category-details');
    if(!details)return false;
    container.querySelectorAll('.v-home-category-details').forEach((d,i)=>{if(i>0)d.remove()});
    details=container.querySelector('.v-home-category-details');
    const summary=details?.querySelector(':scope > summary');if(!summary)return false;
    removeExtraControls(sec,summary);
    if(!summary.dataset.vyrdictFailsafe){
      summary.dataset.vyrdictFailsafe='1';
      summary.addEventListener('click',e=>{
        e.preventDefault();e.stopImmediatePropagation();
        details.open=!details.open;sync(details,summary);
      },true);
    }
    sync(details,summary);
    if(observer?.target!==sec){
      observer?.mo?.disconnect();
      const mo=new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(fix,25)});
      mo.observe(sec,{childList:true,subtree:true});observer={target:sec,mo};
    }
    return true;
  }
  function boot(n=0){if(fix()||n>=30)return;setTimeout(()=>boot(n+1),100)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(()=>boot(),30));
  addEventListener('hashchange',()=>setTimeout(()=>boot(),30));
})();
