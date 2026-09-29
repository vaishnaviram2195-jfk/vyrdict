(()=>{
  if(window.__vyrdictCategoryFailsafeV5)return;
  window.__vyrdictCategoryFailsafeV5=1;

  document.documentElement.classList.add('vyrdict-ready');
  document.getElementById('vyrdict-server-home-preboot')?.remove();

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const labels=new Set(['see more categories','show fewer categories','browse more categories','browse more category','browse fewer categories']);
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const giftFilters=[
    ['gifts','All Gifts'],
    ['gifts-for-her','For Her'],
    ['gifts-for-him','For Him'],
    ['gifts-for-kids','For Kids'],
    ['viral-gifts','Viral Gifts'],
    ['gifts-under-25','Under $25'],
    ['gifts-under-50','Under $50'],
    ['gifts-under-100','Under $100'],
    ['beauty-gifts','Beauty'],
    ['tech-gifts','Tech'],
    ['cozy-home-gifts','Cozy & Home'],
    ['they-already-have-everything','Hard to Shop For']
  ];
  const giftTitles={
    gifts:'Gifts',
    'gifts-for-her':'Gifts for Her',
    'gifts-for-him':'Gifts for Him',
    'gifts-for-kids':'Gifts for Kids',
    'viral-gifts':'Viral Gifts',
    'gifts-under-25':'Gifts Under $25',
    'gifts-under-50':'Gifts Under $50',
    'gifts-under-100':'Gifts Under $100',
    'beauty-gifts':'Beauty Gifts',
    'tech-gifts':'Tech Gifts',
    'cozy-home-gifts':'Cozy & Home Gifts',
    'they-already-have-everything':'They Already Have Everything'
  };
  const giftSlugs=new Set(giftFilters.map(x=>x[0]));
  let timer=0,rootObserver=null,sectionObserver=null;

  function currentGiftSlug(){
    const m=(location.pathname||'').match(/^\/collection\/([^/?#]+)\/?$/i);
    if(!m)return '';
    let slug='';
    try{slug=decodeURIComponent(m[1]).toLowerCase()}catch{slug=String(m[1]||'').toLowerCase()}
    return giftSlugs.has(slug)?slug:'';
  }

  function installStyle(){
    if(document.getElementById('vyrdict-category-expander-order-v5'))return;
    const style=document.createElement('style');
    style.id='vyrdict-category-expander-order-v5';
    style.textContent=`
      body.vyrdict-home-calm .v-home-category-details[open]{display:flex!important;flex-direction:column!important;align-items:flex-start!important;width:100%!important}
      body.vyrdict-home-calm .v-home-category-details[open]>.v-home-category-extra{order:1!important;width:100%!important;margin-top:0!important;margin-bottom:12px!important}
      body.vyrdict-home-calm .v-home-category-details[open]>summary{order:2!important;margin:0!important;align-self:flex-start!important}
      body.vyrdict-home-calm .vyrdict-gifts-category{display:inline-flex!important;visibility:visible!important;opacity:.82!important}
      body.vyrdict-home-calm .vyrdict-gifts-category:hover{opacity:1!important}
      .vyrdict-gift-filter-bar{box-sizing:border-box;width:min(1180px,calc(100% - 32px));margin:0 auto 28px;padding:4px 0 2px;color:#171511}
      .vyrdict-gift-filter-label{margin:0 0 11px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#766d65}
      .vyrdict-gift-filter-scroll{display:flex;gap:9px;overflow-x:auto;overscroll-behavior-inline:contain;padding:1px 1px 7px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
      .vyrdict-gift-filter-chip{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:38px;box-sizing:border-box;border:1px solid rgba(23,21,17,.17);border-radius:999px;background:#fffdf8;color:#4f4943;padding:10px 14px;text-decoration:none;font:850 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.035em;white-space:nowrap;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease,transform .15s ease}
      .vyrdict-gift-filter-chip:hover{border-color:rgba(23,21,17,.42);color:#171511;transform:translateY(-1px)}
      .vyrdict-gift-filter-chip.is-active{border-color:#171511;background:#171511;color:#fffdf8}
      @media(max-width:700px){.vyrdict-gift-filter-bar{width:calc(100% - 24px);margin-bottom:22px}.vyrdict-gift-filter-scroll{gap:7px;margin-right:-12px;padding-right:12px}.vyrdict-gift-filter-chip{min-height:36px;padding:9px 12px;font-size:9px}}
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
    const mo=new MutationObserver(()=>scheduleApply(20));
    mo.observe(sec,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','style','open']});
    sectionObserver={target:sec,mo};
  }

  function fixHome(){
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
        if(!summary.dataset.vyrdictFailsafeV5){
          summary.dataset.vyrdictFailsafeV5='1';
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

  function buildGiftFilterBar(active){
    const nav=document.createElement('nav');
    nav.className='vyrdict-gift-filter-bar';
    nav.setAttribute('aria-label','Gift filters');
    const label=document.createElement('div');
    label.className='vyrdict-gift-filter-label';
    label.textContent='Shop gifts by';
    const row=document.createElement('div');
    row.className='vyrdict-gift-filter-scroll';
    giftFilters.forEach(([slug,text])=>{
      const a=document.createElement('a');
      a.className='vyrdict-gift-filter-chip';
      a.dataset.collection=slug;
      a.href='/collection/'+encodeURIComponent(slug)+'/';
      a.textContent=text;
      if(slug===active){a.classList.add('is-active');a.setAttribute('aria-current','page')}
      row.appendChild(a);
    });
    nav.append(label,row);
    return nav;
  }

  function ensureGiftFilters(){
    const active=currentGiftSlug();
    const existing=document.querySelector('.vyrdict-gift-filter-bar');
    if(!active){existing?.remove();return false}
    installStyle();

    let bar=existing;
    if(!bar){bar=buildGiftFilterBar(active)}
    bar.querySelectorAll('[data-collection]').forEach(a=>{
      const on=a.dataset.collection===active;
      a.classList.toggle('is-active',on);
      if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });

    if(bar.isConnected)return true;

    const title=giftTitles[active]||'';
    const headings=[...document.querySelectorAll('h1,h2,h3')];
    const heading=headings.find(h=>norm(h.textContent)===norm(title))||headings.find(h=>norm(h.textContent).includes(norm(title)));
    const head=heading?.closest('.head')||heading?.parentElement;
    if(head?.parentElement){
      head.insertAdjacentElement('afterend',bar);
      return true;
    }

    const app=document.getElementById('app');
    const mount=app?.querySelector('main,.section,.wrap')||app;
    if(mount){mount.prepend(bar);return true}
    return false;
  }

  function applyAll(){
    if(isHome())fixHome();
    else sectionObserver?.mo?.disconnect();
    ensureGiftFilters();
  }

  function scheduleApply(delay=30){
    clearTimeout(timer);
    timer=setTimeout(applyAll,delay);
  }

  function boot(){
    applyAll();
    [80,200,450,900,1600,2800,4500,7000,10000].forEach(ms=>setTimeout(applyAll,ms));
    const root=document.getElementById('app')||document.body||document.documentElement;
    if(rootObserver?.target!==root){
      rootObserver?.mo?.disconnect();
      const mo=new MutationObserver(()=>scheduleApply(35));
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
