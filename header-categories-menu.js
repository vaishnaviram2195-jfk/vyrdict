(()=>{
  if(window.__vyrdictHeaderCategoriesMenuV1)return;
  window.__vyrdictHeaderCategoriesMenuV1=1;

  const CATS=[
    ['Beauty','beauty'],['Beauty Tech','beauty-tech'],['Books','books'],['Fashion','fashion'],['Fitness','fitness'],
    ['Food & Drinks','food-and-drinks'],['Hair','hair'],['Home','home'],['Kids & Baby','kids-and-baby'],['Kitchen','kitchen'],
    ['Makeup','makeup'],['Perfume','perfume'],['Pets','pets'],['Shoes','shoes'],['Skincare','skincare'],
    ['Stationery & Crafts','stationery-and-crafts'],['Tech','tech'],['Toys & Collectibles','toys-and-collectibles'],['Travel','travel'],['Wellness','wellness']
  ];
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function style(){
    if(document.getElementById('ve-category-menu-style'))return;
    const s=document.createElement('style');s.id='ve-category-menu-style';s.textContent=`
      [data-ve-categories-trigger]{position:relative!important;cursor:pointer!important}
      [data-ve-categories-trigger]::after{content:'Categories';font:inherit;color:inherit}
      #ve-category-menu{position:fixed;z-index:5000;background:#f4f2ec;border:1px solid rgba(0,0,0,.13);box-shadow:0 18px 45px rgba(0,0,0,.13);border-radius:2px;padding:18px 20px 20px;opacity:0;visibility:hidden;transform:translateY(-5px);transition:opacity .16s ease,transform .16s ease,visibility .16s;min-width:620px;max-width:min(760px,calc(100vw - 32px));}
      #ve-category-menu.ve-open{opacity:1;visibility:visible;transform:translateY(0)}
      .ve-cat-head{display:flex;align-items:center;justify-content:space-between;gap:18px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px solid rgba(0,0,0,.14)}
      .ve-cat-kicker{font:700 9px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#78736c}
      .ve-cat-close{border:0;background:transparent;font:400 20px/1 Arial,sans-serif;cursor:pointer;padding:0 2px;color:#262626}
      .ve-cat-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));column-gap:24px;row-gap:2px}
      .ve-cat-link{display:flex;align-items:center;min-height:34px;padding:7px 0;color:#1e1e1e;text-decoration:none;font:500 13px/1.25 Arial,sans-serif;border-bottom:1px solid transparent}
      .ve-cat-link:hover{border-bottom-color:rgba(0,0,0,.28)}
      @media(max-width:760px){
        #ve-category-menu{left:12px!important;right:12px!important;top:72px!important;min-width:0!important;max-width:none!important;width:auto!important;max-height:72vh;overflow:auto;padding:16px 18px 18px}
        .ve-cat-grid{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:20px}
        .ve-cat-link{min-height:38px;font-size:13px}
      }
    `;document.head.appendChild(s);
  }

  function findTrigger(){
    const header=document.querySelector('header');if(!header)return null;
    const candidates=[...header.querySelectorAll('a,button')].filter(el=>norm(el.textContent)==='categories');
    return candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0]||null;
  }

  function position(trigger,menu){
    if(matchMedia('(max-width:760px)').matches)return;
    const r=trigger.getBoundingClientRect();
    menu.style.top=Math.round(r.bottom+10)+'px';
    const desired=Math.min(Math.max(16,r.left-40),Math.max(16,innerWidth-menu.offsetWidth-16));
    menu.style.left=Math.round(desired)+'px';
  }

  function ensureMenu(trigger){
    let menu=document.getElementById('ve-category-menu');
    if(!menu){
      menu=document.createElement('div');menu.id='ve-category-menu';menu.setAttribute('role','menu');menu.setAttribute('aria-label','All product categories');
      menu.innerHTML=`<div class="ve-cat-head"><div class="ve-cat-kicker">Shop all categories</div><button class="ve-cat-close" type="button" aria-label="Close categories">×</button></div><div class="ve-cat-grid">${CATS.map(([name,slug])=>`<a class="ve-cat-link" role="menuitem" data-category="${esc(name)}" href="/category/${slug}/">${esc(name)}</a>`).join('')}</div>`;
      document.body.appendChild(menu);
      menu.querySelector('.ve-cat-close')?.addEventListener('click',()=>close(menu,trigger));
      menu.addEventListener('click',e=>{if(e.target.closest('.ve-cat-link'))close(menu,trigger)});
    }
    position(trigger,menu);return menu;
  }

  function open(menu,trigger){
    position(trigger,menu);menu.classList.add('ve-open');trigger.setAttribute('aria-expanded','true');
  }
  function close(menu,trigger){menu?.classList.remove('ve-open');trigger?.setAttribute('aria-expanded','false')}

  function wire(){
    style();
    const trigger=findTrigger();if(!trigger||trigger.dataset.veCategoriesReady==='1')return false;
    trigger.dataset.veCategoriesReady='1';trigger.setAttribute('data-ve-categories-trigger','1');trigger.setAttribute('aria-haspopup','menu');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-label','Categories');
    if(trigger.tagName==='A')trigger.setAttribute('href','#');
    trigger.textContent='';
    trigger.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const menu=ensureMenu(trigger);menu.classList.contains('ve-open')?close(menu,trigger):open(menu,trigger);
    });
    return true;
  }

  document.addEventListener('click',e=>{
    const menu=document.getElementById('ve-category-menu');const trigger=document.querySelector('[data-ve-categories-trigger]');
    if(!menu?.classList.contains('ve-open'))return;
    if(menu.contains(e.target)||trigger?.contains(e.target))return;
    close(menu,trigger);
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close(document.getElementById('ve-category-menu'),document.querySelector('[data-ve-categories-trigger]'))});
  addEventListener('resize',()=>{const m=document.getElementById('ve-category-menu'),t=document.querySelector('[data-ve-categories-trigger]');if(m?.classList.contains('ve-open')&&t)position(t,m)});

  let n=0;const tick=()=>{n++;wire();if(n<30&&!document.querySelector('[data-ve-categories-trigger]'))setTimeout(tick,180)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  new MutationObserver(()=>{if(!document.querySelector('[data-ve-categories-trigger]'))wire()}).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(wire,40));
})();
