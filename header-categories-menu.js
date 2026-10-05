(()=>{
  if(window.__vyrdictHeaderCategoriesMenuV5)return;
  window.__vyrdictHeaderCategoriesMenuV5=1;

  const CATS=[
    ['Beauty','beauty'],['Beauty Tech','beauty-tech'],['Books','books'],['Fashion','fashion'],['Fitness','fitness'],
    ['Food & Drinks','food-and-drinks'],['Gifts','gifts'],['Hair','hair'],['Home','home'],['Kids & Baby','kids-and-baby'],['Kitchen','kitchen'],
    ['Makeup','makeup'],['Perfume','perfume'],['Pets','pets'],['Shoes','shoes'],['Skincare','skincare'],
    ['Stationery & Crafts','stationery-and-crafts'],['Tech','tech'],['Toys & Collectibles','toys-and-collectibles'],['Travel','travel'],['Wellness','wellness']
  ];
  const MOBILE_QUERY='(max-width:760px)';
  const ROW_ID='ve-mobile-categories-row';
  const TRIGGER_ID='ve-mobile-categories-trigger';
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'&&Number(cs.opacity||1)!==0};

  function style(){
    if(document.getElementById('ve-category-menu-style-v5'))return;
    ['ve-category-menu-style','ve-category-menu-style-v2','ve-category-menu-style-v3','ve-category-menu-style-v4'].forEach(id=>document.getElementById(id)?.remove());
    const s=document.createElement('style');s.id='ve-category-menu-style-v5';s.textContent=`
      [data-ve-categories-trigger]{position:relative!important;cursor:pointer!important;user-select:none!important}
      #${ROW_ID}{display:none}
      #ve-category-menu{position:fixed;z-index:2147483000;background:#f4f2ec;border:1px solid rgba(0,0,0,.13);box-shadow:0 18px 45px rgba(0,0,0,.13);border-radius:2px;padding:18px 20px 20px;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-5px);transition:opacity .16s ease,transform .16s ease,visibility .16s;min-width:620px;max-width:min(760px,calc(100vw - 32px));}
      #ve-category-menu.ve-open{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
      .ve-cat-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid rgba(0,0,0,.14)}
      .ve-cat-kicker{font:700 9px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#78736c}
      .ve-cat-close{border:0;background:transparent;font:400 20px/1 Arial,sans-serif;cursor:pointer;padding:0 2px;color:#262626}
      .ve-cat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:24px;row-gap:2px}
      .ve-cat-link{display:flex;align-items:center;min-height:34px;padding:7px 0;color:#1e1e1e;text-decoration:none;font:500 13px/1.25 Arial,sans-serif;border-bottom:1px solid transparent}
      .ve-cat-link:hover{border-bottom-color:rgba(0,0,0,.28)}
      @media(max-width:760px){
        #${ROW_ID}{display:flex!important;align-items:center;justify-content:center;width:100%!important;height:44px!important;box-sizing:border-box!important;background:#f6f4ef!important;border-top:1px solid rgba(0,0,0,.07)!important;border-bottom:1px solid rgba(0,0,0,.12)!important;position:relative!important;z-index:2147482000!important;visibility:visible!important;opacity:1!important;overflow:visible!important}
        #${TRIGGER_ID}{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;height:44px!important;min-width:150px!important;padding:0 20px!important;border:0!important;background:transparent!important;color:#1b1b1b!important;font:700 10px/1 Arial,sans-serif!important;letter-spacing:.12em!important;text-transform:uppercase!important;appearance:none!important;-webkit-appearance:none!important;visibility:visible!important;opacity:1!important}
        #${TRIGGER_ID}::after{content:'+';font:500 16px/1 Arial,sans-serif;letter-spacing:0;transform:translateY(-1px)}
        #${TRIGGER_ID}[aria-expanded="true"]::after{content:'−'}
        #ve-category-menu{left:12px!important;right:12px!important;min-width:0!important;max-width:none!important;width:auto!important;max-height:min(72vh,620px);overflow:auto;padding:16px 18px 18px}
        .ve-cat-grid{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:20px}
        .ve-cat-link{min-height:40px;font-size:13px}
      }
    `;document.head.appendChild(s);
  }

  function findHeaderAnchor(){
    const selectors='header,[role="banner"],.topbar,.site-header,.siteHeader,.header,.navbar,.nav-shell,nav';
    const candidates=[...document.querySelectorAll(selectors)].filter(el=>el.id!==ROW_ID&&visible(el)).filter(el=>{
      const r=el.getBoundingClientRect();return r.top<180&&r.bottom>0&&r.width>120;
    });
    return candidates.sort((a,b)=>{
      const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
      return ar.top-br.top||br.width-ar.width;
    })[0]||null;
  }

  function findNativeTrigger(){
    const scope=findHeaderAnchor()||document;
    const candidates=[...scope.querySelectorAll('a,button,[role="button"],span,div')]
      .filter(el=>el.id!==TRIGGER_ID&&norm(el.textContent)==='categories'&&visible(el));
    return candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]||null;
  }

  function settleRow(row,anchor){
    row.style.marginTop='0px';
    requestAnimationFrame(()=>{
      if(!row.isConnected)return;
      const rr=row.getBoundingClientRect();
      const ar=anchor?.getBoundingClientRect?.();
      if(!ar)return;
      const overlap=Math.ceil(ar.bottom-rr.top);
      if(overlap>1&&ar.top<120&&ar.bottom>0)row.style.marginTop=overlap+'px';
    });
  }

  function ensureMobileTrigger(){
    if(!matchMedia(MOBILE_QUERY).matches){document.getElementById(ROW_ID)?.remove();return null}
    let row=document.getElementById(ROW_ID);
    const native=findNativeTrigger();
    if(native){row?.remove();return native}

    const anchor=findHeaderAnchor();
    if(!row){
      row=document.createElement('nav');
      row.id=ROW_ID;
      row.setAttribute('aria-label','Product categories');
      row.innerHTML=`<button id="${TRIGGER_ID}" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Categories">Categories</button>`;
    }
    if(anchor){
      if(row.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',row);
      settleRow(row,anchor);
    }else{
      const app=document.getElementById('app');
      if(app&&row.parentElement!==app.parentElement)app.insertAdjacentElement('beforebegin',row);
      else if(!row.isConnected)document.body.prepend(row);
      row.style.marginTop='0px';
    }
    const trigger=row.querySelector('#'+TRIGGER_ID);
    trigger?.setAttribute('data-ve-categories-trigger','1');
    return trigger;
  }

  function findTrigger(){
    if(matchMedia(MOBILE_QUERY).matches)return ensureMobileTrigger()||findNativeTrigger();
    document.getElementById(ROW_ID)?.remove();
    return findNativeTrigger();
  }

  function position(trigger,menu){
    if(matchMedia(MOBILE_QUERY).matches){
      const r=trigger?.getBoundingClientRect?.();
      const top=Math.max(8,Math.min(innerHeight-120,Math.round((r?.bottom||64)+8)));
      menu.style.top=top+'px';
      menu.style.left='12px';
      return;
    }
    const r=trigger.getBoundingClientRect();
    menu.style.top=Math.round(r.bottom+10)+'px';
    const width=menu.offsetWidth||700;
    const desired=Math.min(Math.max(16,r.left-40),Math.max(16,innerWidth-width-16));
    menu.style.left=Math.round(desired)+'px';
  }

  function activeTrigger(){return document.querySelector('[data-ve-categories-trigger][aria-expanded="true"]')||document.querySelector('[data-ve-categories-trigger]')}

  function ensureMenu(trigger){
    let menu=document.getElementById('ve-category-menu');
    if(!menu){
      menu=document.createElement('div');menu.id='ve-category-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-label','All product categories');
      menu.innerHTML=`<div class="ve-cat-head"><div class="ve-cat-kicker">Shop all categories</div><button class="ve-cat-close" type="button" aria-label="Close categories">×</button></div><div class="ve-cat-grid">${CATS.map(([name,slug,type])=>`<a class="ve-cat-link" role="menuitem" data-category="${esc(name)}" href="/${type==='collection'?'collection':'category'}/${slug}/">${esc(name)}</a>`).join('')}</div>`;
      document.body.appendChild(menu);
      menu.querySelector('.ve-cat-close')?.addEventListener('click',()=>close(menu));
    }
    position(trigger,menu);return menu;
  }

  function open(menu,trigger){position(trigger,menu);menu.classList.add('ve-open');document.querySelectorAll('[data-ve-categories-trigger]').forEach(el=>el.setAttribute('aria-expanded',el===trigger?'true':'false'))}
  function close(menu){menu?.classList.remove('ve-open');document.querySelectorAll('[data-ve-categories-trigger]').forEach(el=>el.setAttribute('aria-expanded','false'))}
  function toggle(trigger){const menu=ensureMenu(trigger);menu.classList.contains('ve-open')?close(menu):open(menu,trigger)}

  function wire(){
    style();
    const trigger=findTrigger();if(!trigger)return false;
    if(trigger.dataset.veCategoriesReady==='5')return true;
    document.querySelectorAll('[data-ve-categories-trigger]').forEach(el=>{if(el!==trigger){el.removeAttribute('data-ve-categories-trigger');el.removeAttribute('aria-haspopup');el.removeAttribute('aria-expanded')}});
    trigger.dataset.veCategoriesReady='5';trigger.setAttribute('data-ve-categories-trigger','1');trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Categories');
    if(!/^(A|BUTTON)$/i.test(trigger.tagName)){trigger.setAttribute('role','button');trigger.setAttribute('tabindex','0')}
    if(trigger.tagName==='A')trigger.setAttribute('href','#');
    trigger.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();toggle(trigger)}});
    return true;
  }

  window.addEventListener('click',e=>{
    const trigger=e.target?.closest?.('[data-ve-categories-trigger]');
    if(!trigger)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    toggle(trigger);
  },true);

  document.addEventListener('click',e=>{
    const menu=document.getElementById('ve-category-menu');const trigger=activeTrigger();
    if(!menu?.classList.contains('ve-open'))return;
    if(menu.contains(e.target)||trigger?.contains(e.target))return;
    close(menu);
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close(document.getElementById('ve-category-menu'))});
  addEventListener('resize',()=>{wire();const m=document.getElementById('ve-category-menu'),t=activeTrigger();if(m?.classList.contains('ve-open')&&t)position(t,m)});

  let n=0;const tick=()=>{n++;wire();if(n<18)setTimeout(tick,n<12?120:300)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  addEventListener('pageshow',()=>setTimeout(wire,40));
  addEventListener('popstate',()=>setTimeout(wire,40));
})();
