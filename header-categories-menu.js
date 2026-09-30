(()=>{
  if(window.__vyrdictHeaderCategoriesMenuV4)return;
  window.__vyrdictHeaderCategoriesMenuV4=1;

  const CATS=[
    ['Beauty','beauty'],['Beauty Tech','beauty-tech'],['Books','books'],['Fashion','fashion'],['Fitness','fitness'],
    ['Food & Drinks','food-and-drinks'],['Gifts','gifts','collection'],['Hair','hair'],['Home','home'],['Kids & Baby','kids-and-baby'],['Kitchen','kitchen'],
    ['Makeup','makeup'],['Perfume','perfume'],['Pets','pets'],['Shoes','shoes'],['Skincare','skincare'],
    ['Stationery & Crafts','stationery-and-crafts'],['Tech','tech'],['Toys & Collectibles','toys-and-collectibles'],['Travel','travel'],['Wellness','wellness']
  ];
  const MOBILE_QUERY='(max-width:760px)';
  const ROW_ID='ve-mobile-categories-row';
  const TRIGGER_ID='ve-mobile-categories-trigger';
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const visible=el=>{if(!el)return false;const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden'};

  function style(){
    if(document.getElementById('ve-category-menu-style-v4'))return;
    ['ve-category-menu-style','ve-category-menu-style-v2','ve-category-menu-style-v3'].forEach(id=>document.getElementById(id)?.remove());
    const s=document.createElement('style');s.id='ve-category-menu-style-v4';s.textContent=`
      [data-ve-categories-trigger]{position:relative!important;cursor:pointer!important;user-select:none!important}
      #${ROW_ID}{display:none}
      #ve-category-menu{position:fixed;z-index:99999;background:#f4f2ec;border:1px solid rgba(0,0,0,.13);box-shadow:0 18px 45px rgba(0,0,0,.13);border-radius:2px;padding:18px 20px 20px;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-5px);transition:opacity .16s ease,transform .16s ease,visibility .16s;min-width:620px;max-width:min(760px,calc(100vw - 32px));}
      #ve-category-menu.ve-open{opacity:1;visibility:visible;pointer-events:auto;transform:translateY(0)}
      .ve-cat-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid rgba(0,0,0,.14)}
      .ve-cat-kicker{font:700 9px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#78736c}
      .ve-cat-close{border:0;background:transparent;font:400 20px/1 Arial,sans-serif;cursor:pointer;padding:0 2px;color:#262626}
      .ve-cat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:24px;row-gap:2px}
      .ve-cat-link{display:flex;align-items:center;min-height:34px;padding:7px 0;color:#1e1e1e;text-decoration:none;font:500 13px/1.25 Arial,sans-serif;border-bottom:1px solid transparent}
      .ve-cat-link:hover{border-bottom-color:rgba(0,0,0,.28)}
      @media(max-width:760px){
        #${ROW_ID}{display:flex!important;align-items:center;justify-content:center;width:100%;height:42px;box-sizing:border-box;background:#f8f6f1;border-top:1px solid rgba(0,0,0,.08);border-bottom:1px solid rgba(0,0,0,.12);position:relative;z-index:99990}
        #${TRIGGER_ID}{display:inline-flex!important;align-items:center;justify-content:center;gap:7px;height:100%;min-width:132px;padding:0 18px;border:0;background:transparent;color:#1b1b1b;font:700 10px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;appearance:none;-webkit-appearance:none}
        #${TRIGGER_ID}::after{content:'+';font:500 16px/1 Arial,sans-serif;letter-spacing:0;transform:translateY(-1px)}
        #${TRIGGER_ID}[aria-expanded="true"]::after{content:'−'}
        #ve-category-menu{left:12px!important;right:12px!important;min-width:0!important;max-width:none!important;width:auto!important;max-height:min(72vh,620px);overflow:auto;padding:16px 18px 18px}
        .ve-cat-grid{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:20px}
        .ve-cat-link{min-height:38px;font-size:13px}
      }
    `;document.head.appendChild(s);
  }

  function findNativeTrigger(){
    const header=document.querySelector('header');if(!header)return null;
    const candidates=[...header.querySelectorAll('a,button,[role="button"],span,div')]
      .filter(el=>el.id!==TRIGGER_ID&&norm(el.textContent)==='categories'&&visible(el));
    return candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]||null;
  }

  function ensureMobileTrigger(){
    const mobile=matchMedia(MOBILE_QUERY).matches;
    let row=document.getElementById(ROW_ID);
    if(!mobile){row?.remove();return null}

    const native=findNativeTrigger();
    if(native){row?.remove();return native}

    const header=document.querySelector('header');if(!header)return null;
    if(!row){
      row=document.createElement('nav');
      row.id=ROW_ID;
      row.setAttribute('aria-label','Product categories');
      row.innerHTML=`<button id="${TRIGGER_ID}" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Categories">Categories</button>`;
    }
    if(row.previousElementSibling!==header)header.insertAdjacentElement('afterend',row);
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
      menu.querySelector('.ve-cat-close')?.addEventListener('click',()=>close(menu,activeTrigger()));
    }
    position(trigger,menu);return menu;
  }

  function open(menu,trigger){position(trigger,menu);menu.classList.add('ve-open');trigger?.setAttribute('aria-expanded','true')}
  function close(menu,trigger){menu?.classList.remove('ve-open');document.querySelectorAll('[data-ve-categories-trigger]').forEach(el=>el.setAttribute('aria-expanded','false'))}
  function toggle(trigger){const menu=ensureMenu(trigger);menu.classList.contains('ve-open')?close(menu,trigger):open(menu,trigger)}

  function wire(){
    style();
    const trigger=findTrigger();if(!trigger)return false;
    if(trigger.dataset.veCategoriesReady==='1')return true;
    document.querySelectorAll('[data-ve-categories-trigger]').forEach(el=>{if(el!==trigger){el.removeAttribute('data-ve-categories-trigger');el.removeAttribute('aria-haspopup');el.removeAttribute('aria-expanded')}});
    trigger.dataset.veCategoriesReady='1';trigger.setAttribute('data-ve-categories-trigger','1');trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Categories');
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
    close(menu,trigger);
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close(document.getElementById('ve-category-menu'),activeTrigger())});
  addEventListener('resize',()=>{wire();const m=document.getElementById('ve-category-menu'),t=activeTrigger();if(m?.classList.contains('ve-open')&&t)position(t,m)});

  let n=0;const tick=()=>{n++;wire();if(n<40)setTimeout(tick,n<12?140:400)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  new MutationObserver(()=>setTimeout(wire,20)).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(wire,40));
  addEventListener('popstate',()=>setTimeout(wire,40));
})();
