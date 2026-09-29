(()=>{
  if(window.__vyrdictCategoryFailsafeV4)return;
  window.__vyrdictCategoryFailsafeV4=1;

  document.documentElement.classList.add('vyrdict-ready');
  document.getElementById('vyrdict-server-home-preboot')?.remove();

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const labels=new Set(['see more categories','show fewer categories','browse more categories','browse more category','browse fewer categories']);
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  let timer=0,rootObserver=null,sectionObserver=null;

  function installStyle(){
    if(document.getElementById('vyrdict-category-expander-order-v4'))return;
    const style=document.createElement('style');
    style.id='vyrdict-category-expander-order-v4';
    style.textContent=`
      body.vyrdict-home-calm .v-home-category-details[open]{display:flex!important;flex-direction:column!important;align-items:flex-start!important;width:100%!important}
      body.vyrdict-home-calm .v-home-category-details[open]>.v-home-category-extra{order:1!important;width:100%!important;margin-top:0!important;margin-bottom:12px!important}
      body.vyrdict-home-calm .v-home-category-details[open]>summary{order:2!important;margin:0!important;align-self:flex-start!important}
      body.vyrdict-home-calm .vyrdict-gifts-category{display:inline-flex!important;visibility:visible!important;opacity:.82!important}
      body.vyrdict-home-calm .vyrdict-gifts-category:hover{opacity:1!important}
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function section(){
    const byId=document.getElementById('categories');
    if(byId)return byId;
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes('browse by category'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function ensureGifts(container){
    if(!container)return null;
    let gift=container.querySelector('[data-collection="gifts"]');
    if(!gift){
      gift=document.createElement('button');
      gift.type='button';
      gift.className='category vyrdict-gifts-category';
      gift.dataset.collection='gifts';
      gift.setAttribute('aria-label','Browse Gifts');
      gift.textContent='🎁 Gifts';
    }
    gift.hidden=false;
    gift.removeAttribute('hidden');
    gift.style.removeProperty('display');
    gift.style.removeProperty('visibility');
    const details=container.querySelector('.v-home-category-details');
    if(details){
      if(gift.parentElement!==container||gift.nextElementSibling!==details)container.insertBefore(gift,details);
    }else if(gift.parentElement!==container){
      container.appendChild(gift);
    }
    return gift;
  }

  function removeExtraControls(sec,keep){
    const nodes=[...sec.querySelectorAll('button,a,summary,[role="button"],[data-category],.v-home-category-more,.v-home-category-details')];
    nodes.forEach(el=>{
      if(el===keep||el.closest('.v-home-category-details')===keep?.closest('.v-home-category-details'))return;
      if(el.classList?.contains('v-home-category-details')){
        if(el!==keep?.closest('.v-home-category-details'))el.remove();
        return;
      }
      const data=norm(el.getAttribute?.('data-category'));
      const text=norm(el.textContent);
      if(labels.has(data)||labels.has(text)){
        const d=el.closest('details');
        if(d&&d!==keep?.closest('details'))d.remove();
        else el.remove();
      }
    });
  }

  function sync(details,summary){
    const label=details.open?'Show fewer categories':'Browse more categories';
    if(norm(summary.textContent)!==norm(label))summary.textContent=label;
    const extra=details.querySelector('.v-home-category-extra');
    if(extra){
      extra.hidden=!details.open;
      if(details.open){
        extra.removeAttribute('hidden');
        extra.style.display='flex';
        extra.style.visibility='visible';
        extra.querySelectorAll('[data-category]').forEach(b=>{b.hidden=false;b.removeAttribute('hidden')});
      }else{
        extra.style.removeProperty('display');
        extra.style.removeProperty('visibility');
      }
    }
  }

  function watchSection(sec){
    if(sectionObserver?.target===sec)return;
    sectionObserver?.mo?.disconnect();
    const mo=new MutationObserver(()=>scheduleFix(20));
    mo.observe(sec,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','style','open']});
    sectionObserver={target:sec,mo};
  }

  function fix(){
    if(!isHome())return false;
    installStyle();
    const sec=section();
    const container=sec?.querySelector('.categories');
    if(!sec||!container)return false;

    ensureGifts(container);

    let details=container.querySelector('.v-home-category-details');
    if(details){
      container.querySelectorAll('.v-home-category-details').forEach((d,i)=>{if(i>0)d.remove()});
      details=container.querySelector('.v-home-category-details');
      const summary=details?.querySelector(':scope > summary');
      if(summary){
        removeExtraControls(sec,summary);
        ensureGifts(container);
        if(!summary.dataset.vyrdictFailsafeV4){
          summary.dataset.vyrdictFailsafeV4='1';
          summary.addEventListener('click',e=>{
            e.preventDefault();
            e.stopImmediatePropagation();
            details.open=!details.open;
            sync(details,summary);
            requestAnimationFrame(()=>ensureGifts(container));
          },true);
        }
        sync(details,summary);
      }
    }

    ensureGifts(container);
    watchSection(sec);
    return true;
  }

  function scheduleFix(delay=30){
    clearTimeout(timer);
    timer=setTimeout(()=>fix(),delay);
  }

  function boot(){
    fix();
    [80,200,450,900,1600,2800,4500,7000,10000].forEach(ms=>setTimeout(()=>fix(),ms));
    const root=document.getElementById('app')||document.body||document.documentElement;
    if(rootObserver?.target!==root){
      rootObserver?.mo?.disconnect();
      const mo=new MutationObserver(()=>scheduleFix(35));
      mo.observe(root,{childList:true,subtree:true});
      rootObserver={target:root,mo};
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  addEventListener('pageshow',()=>setTimeout(boot,20));
  addEventListener('popstate',()=>setTimeout(boot,20));
  addEventListener('hashchange',()=>setTimeout(boot,20));
})();
