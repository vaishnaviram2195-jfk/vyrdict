(()=>{
  if(window.__vyrdictCategoryFailsafeV8)return;
  window.__vyrdictCategoryFailsafeV8=1;

  document.documentElement.classList.add('vyrdict-ready');
  document.getElementById('vyrdict-server-home-preboot')?.remove();

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
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
  const GIFT_DATA_REV='gift-refresh-2026-09-30-2';
  const GIFT_GRID_ID='vyrdict-gift-live-grid';
  let timer=0,rootObserver=null,categoryObserver=null;

  function currentGiftSlug(){
    const m=(location.pathname||'').match(/^\/collection\/([^/?#]+)\/?$/i);
    if(!m)return '';
    let slug='';
    try{slug=decodeURIComponent(m[1]).toLowerCase()}catch{slug=String(m[1]||'').toLowerCase()}
    return giftSlugs.has(slug)?slug:'';
  }

  function refreshGiftCatalogOnce(){
    if(!currentGiftSlug())return false;
    try{
      const k='vyrdict:gift-data-rev';
      if(localStorage.getItem(k)===GIFT_DATA_REV)return false;
      localStorage.setItem(k,GIFT_DATA_REV);
      localStorage.removeItem('vyrdict:catalog-cache:v5');
      location.reload();
      return true;
    }catch{return false}
  }

  function installStyle(){
    if(document.getElementById('vyrdict-category-expander-order-v8'))return;
    const old=document.getElementById('vyrdict-category-expander-order-v7');
    old?.remove();
    const style=document.createElement('style');
    style.id='vyrdict-category-expander-order-v8';
    style.textContent=`
      body.vyrdict-home-calm .v-home-category-details[open]{display:flex!important;flex-direction:column!important;align-items:flex-start!important;width:100%!important}
      body.vyrdict-home-calm .v-home-category-details[open]>.v-home-category-extra{order:1!important;width:100%!important;margin-top:0!important;margin-bottom:12px!important}
      body.vyrdict-home-calm .v-home-category-details[open]>summary{order:2!important;margin:0!important;align-self:flex-start!important}
      body.vyrdict-home-calm .vyrdict-gifts-category{display:inline-flex!important;visibility:visible!important;opacity:.82!important}
      body.vyrdict-home-calm .vyrdict-gifts-category:hover{opacity:1!important}
      .vyrdict-gift-filter-bar{box-sizing:border-box;width:100%;margin:16px 0 28px;padding:0;color:#171511}
      .vyrdict-gift-filter-label{margin:0 0 11px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#766d65}
      .vyrdict-gift-filter-scroll{display:flex;gap:9px;overflow-x:auto;overscroll-behavior-inline:contain;padding:1px 1px 7px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}
      .vyrdict-gift-filter-chip{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:38px;box-sizing:border-box;border:1px solid rgba(23,21,17,.17);border-radius:999px;background:#fffdf8;color:#4f4943;padding:10px 14px;text-decoration:none;font:850 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.035em;white-space:nowrap;cursor:pointer;transition:border-color .15s ease,background .15s ease,color .15s ease,transform .15s ease}
      .vyrdict-gift-filter-chip:hover{border-color:rgba(23,21,17,.42);color:#171511;transform:translateY(-1px)}
      .vyrdict-gift-filter-chip.is-active{border-color:#171511;background:#171511;color:#fffdf8}
      #${GIFT_GRID_ID}{width:100%;margin:0 0 42px}
      #${GIFT_GRID_ID}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-card{display:flex;min-width:0;flex-direction:column;overflow:hidden;border:1px solid rgba(23,21,17,.11);border-radius:18px;background:#fffdf8;color:#171511;text-decoration:none}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-art{display:grid;place-items:center;aspect-ratio:1/1;background:#f1ebe3;padding:18px}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-art img{display:block;max-width:100%;max-height:100%;object-fit:contain;mix-blend-mode:multiply}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-copy{display:flex;flex:1;flex-direction:column;padding:14px 14px 15px}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-brand{margin:0 0 5px;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#7b736c}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-name{margin:0 0 12px;font:700 14px/1.25 Arial,Helvetica,sans-serif;color:#171511}
      #${GIFT_GRID_ID} .vyrdict-gift-fallback-scores{display:flex;gap:7px;flex-wrap:wrap;margin-top:auto;font:850 9px/1 Arial,Helvetica,sans-serif;color:#5e5751}
      @media(max-width:980px){#${GIFT_GRID_ID}.grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
      @media(max-width:700px){.vyrdict-gift-filter-bar{margin:13px 0 22px}.vyrdict-gift-filter-scroll{gap:7px;margin-right:-12px;padding-right:12px}.vyrdict-gift-filter-chip{min-height:36px;padding:9px 12px;font-size:9px}#${GIFT_GRID_ID}.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
      @media(max-width:390px){#${GIFT_GRID_ID}.grid{grid-template-columns:1fr}}
    `;
    (document.head||document.documentElement).appendChild(style);
  }

  function categorySection(){
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
    const details=container.querySelector('.v-home-category-details');
    if(details){
      if(gift.parentElement!==container||gift.nextElementSibling!==details)container.insertBefore(gift,details);
    }else if(gift.parentElement!==container){container.appendChild(gift)}
    return gift;
  }

  function syncDetails(details,summary){
    if(!details||!summary)return;
    summary.textContent=details.open?'Show fewer categories':'Browse more categories';
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

  function fixHome(){
    if(!isHome())return false;
    const sec=categorySection();
    const container=sec?.querySelector('.categories');
    if(!sec||!container)return false;
    ensureGifts(container);
    const details=container.querySelector('.v-home-category-details');
    const summary=details?.querySelector(':scope > summary');
    if(details&&summary){
      if(!summary.dataset.vyrdictFailsafeV8){
        summary.dataset.vyrdictFailsafeV8='1';
        summary.addEventListener('click',e=>{
          e.preventDefault();
          e.stopImmediatePropagation();
          details.open=!details.open;
          syncDetails(details,summary);
          requestAnimationFrame(()=>ensureGifts(container));
        },true);
      }
      syncDetails(details,summary);
    }
    ensureGifts(container);
    if(categoryObserver?.target!==sec){
      categoryObserver?.mo?.disconnect();
      const mo=new MutationObserver(()=>scheduleApply(25));
      mo.observe(sec,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','class','style','open']});
      categoryObserver={target:sec,mo};
    }
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

  function visible(el){
    if(!el)return false;
    const r=el.getBoundingClientRect();
    const s=getComputedStyle(el);
    return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden';
  }

  function pageGiftHeading(active){
    const title=giftTitles[active]||'';
    const exact=[...document.querySelectorAll('h1,h2,h3')]
      .filter(h=>visible(h)&&norm(h.textContent)===norm(title))
      .sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);
    if(exact.length)return exact[0];
    const app=document.getElementById('app');
    const h1=[...(app?.querySelectorAll('h1')||[])].filter(visible).sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top);
    return h1[0]||null;
  }

  function ensureGiftFilters(){
    const active=currentGiftSlug();
    let bar=document.querySelector('.vyrdict-gift-filter-bar');
    if(!active){bar?.remove();return false}
    installStyle();
    if(!bar)bar=buildGiftFilterBar(active);

    bar.querySelectorAll('[data-collection]').forEach(a=>{
      const on=a.dataset.collection===active;
      a.classList.toggle('is-active',on);
      if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });

    const heading=pageGiftHeading(active);
    if(heading){
      if(heading.nextElementSibling!==bar)heading.insertAdjacentElement('afterend',bar);
      return true;
    }

    const app=document.getElementById('app');
    const mount=app?.querySelector('main,.section,.wrap')||app;
    if(mount){mount.prepend(bar);return true}
    return false;
  }

  function giftProducts(active){
    const S=globalThis.S;
    if(!S||!Array.isArray(S.p)||!Array.isArray(S.c)||!Array.isArray(S.l))return [];
    const collection=S.c.find(c=>String(c?.slug||'').toLowerCase()===active);
    if(!collection)return [];
    const ids=new Set(S.l.filter(l=>String(l?.collection_id)===String(collection.id)).map(l=>String(l.product_id)));
    return S.p.filter(p=>ids.has(String(p?.id))).sort((a,b)=>(Number(b.viral_score||0)-Number(a.viral_score||0))||(Number(b.worth_score||0)-Number(a.worth_score||0)));
  }

  function fallbackCard(p){
    const a=document.createElement('a');
    a.className='vyrdict-gift-fallback-card';
    a.href='/product/'+encodeURIComponent(p.slug||'')+'/';
    a.dataset.product=p.slug||'';
    const art=document.createElement('div');art.className='vyrdict-gift-fallback-art';
    if(p.image_url){const img=document.createElement('img');img.src=p.image_url;img.alt=(p.brand?String(p.brand)+' ':'')+String(p.name||'');img.loading='lazy';art.appendChild(img)}
    const copy=document.createElement('div');copy.className='vyrdict-gift-fallback-copy';
    const brand=document.createElement('p');brand.className='vyrdict-gift-fallback-brand';brand.textContent=p.brand||p.category||'VYRDICT';
    const name=document.createElement('p');name.className='vyrdict-gift-fallback-name';name.textContent=p.name||p.slug||'Product';
    const scores=document.createElement('div');scores.className='vyrdict-gift-fallback-scores';scores.textContent='Viral '+Math.round(Number(p.viral_score||0))+' · Worth '+Math.round(Number(p.worth_score||0));
    copy.append(brand,name,scores);a.append(art,copy);return a;
  }

  function hideEmptyMessages(scope){
    if(!scope)return;
    [...scope.querySelectorAll('p,div,span')].forEach(el=>{
      if(el.id===GIFT_GRID_ID||el.closest('#'+GIFT_GRID_ID)||el.children.length)return;
      const t=norm(el.textContent);
      if(t==='no verified products here yet'||t==='no products here yet'||t==='no products found'||t==='nothing here yet')el.style.setProperty('display','none','important');
    });
  }

  function ensureGiftProducts(){
    const active=currentGiftSlug();
    const old=document.getElementById(GIFT_GRID_ID);
    if(!active){old?.remove();return false}
    const products=giftProducts(active);
    if(!products.length)return false;
    const heading=pageGiftHeading(active);
    const bar=document.querySelector('.vyrdict-gift-filter-bar');
    const app=document.getElementById('app');
    const scope=heading?.closest('.shell,.wrap,main,.section')||app;
    if(!scope)return false;

    const realCtas=[...scope.querySelectorAll('a,button')].filter(el=>visible(el)&&/see\s+vyrdict/i.test((el.textContent||'').trim())&&!el.closest('#'+GIFT_GRID_ID));
    if(realCtas.length){old?.remove();return true}

    let grid=old;
    if(!grid){grid=document.createElement('div');grid.id=GIFT_GRID_ID;grid.className='grid vyrdict-gift-live-grid'}
    const sig=active+':'+products.map(p=>p.id).join(',');
    if(grid.dataset.signature!==sig){
      grid.dataset.signature=sig;
      grid.innerHTML='';
      if(typeof globalThis.card==='function'){
        try{grid.innerHTML=products.map(p=>globalThis.card(p)).join('')}catch{grid.innerHTML=''}
      }
      if(!grid.children.length)products.forEach(p=>grid.appendChild(fallbackCard(p)));
    }
    const anchor=bar||heading;
    if(anchor&&anchor.nextElementSibling!==grid)anchor.insertAdjacentElement('afterend',grid);
    else if(!grid.isConnected)scope.prepend(grid);
    hideEmptyMessages(scope);
    return true;
  }

  function applyAll(){
    installStyle();
    if(isHome())fixHome();
    else{categoryObserver?.mo?.disconnect();categoryObserver=null}
    ensureGiftFilters();
    ensureGiftProducts();
  }

  function scheduleApply(delay=30){clearTimeout(timer);timer=setTimeout(applyAll,delay)}

  function boot(){
    if(refreshGiftCatalogOnce())return;
    applyAll();
    [80,200,450,900,1600,2800,4500,7000].forEach(ms=>setTimeout(applyAll,ms));
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
