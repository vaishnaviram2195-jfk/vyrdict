(()=>{
  if(window.__vyrdictMobileCategoriesHardfixV1)return;
  window.__vyrdictMobileCategoriesHardfixV1=1;

  const MQ='(max-width:900px)';
  const BAR_ID='vyrdict-mobile-categories-bar';
  const MENU_ID='vyrdict-mobile-categories-menu';
  const SPACER_ID='vyrdict-mobile-categories-spacer';
  const STYLE_ID='vyrdict-mobile-categories-hardfix-style';
  const CATS=[
    ['Beauty','beauty'],['Beauty Tech','beauty-tech'],['Books','books'],['Fashion','fashion'],['Fitness','fitness'],
    ['Food & Drinks','food-and-drinks'],['Gifts','gifts','collection'],['Hair','hair'],['Home','home'],['Kids & Baby','kids-and-baby'],['Kitchen','kitchen'],
    ['Makeup','makeup'],['Perfume','perfume'],['Pets','pets'],['Shoes','shoes'],['Skincare','skincare'],
    ['Stationery & Crafts','stationery-and-crafts'],['Tech','tech'],['Toys & Collectibles','toys-and-collectibles'],['Travel','travel'],['Wellness','wellness']
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${BAR_ID},#${SPACER_ID},#${MENU_ID}{display:none}
      @media(max-width:900px){
        #ve-mobile-categories-row{display:none!important}
        #${SPACER_ID}{display:block!important;height:44px!important;width:100%!important;pointer-events:none!important}
        #${BAR_ID}{display:flex!important;position:fixed!important;left:0!important;right:0!important;height:44px!important;align-items:center!important;justify-content:center!important;background:#f4f2ed!important;border-top:1px solid rgba(0,0,0,.07)!important;border-bottom:1px solid rgba(0,0,0,.14)!important;z-index:2147482500!important;visibility:visible!important;opacity:1!important;box-sizing:border-box!important}
        #${BAR_ID} button{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;height:44px!important;min-width:168px!important;padding:0 20px!important;border:0!important;background:transparent!important;color:#171717!important;font:800 11px/1 Arial,Helvetica,sans-serif!important;letter-spacing:.13em!important;text-transform:uppercase!important;visibility:visible!important;opacity:1!important;appearance:none!important;-webkit-appearance:none!important}
        #${BAR_ID} button::after{content:'+';font:500 18px/1 Arial,sans-serif!important;letter-spacing:0!important;transform:translateY(-1px)}
        #${BAR_ID} button[aria-expanded="true"]::after{content:'−'}
        #${MENU_ID}{display:block;position:fixed!important;left:10px!important;right:10px!important;z-index:2147483000!important;background:#f7f5f0!important;border:1px solid rgba(0,0,0,.14)!important;box-shadow:0 20px 60px rgba(0,0,0,.18)!important;padding:16px 17px 18px!important;max-height:68vh!important;overflow:auto!important;box-sizing:border-box!important;opacity:0;visibility:hidden;pointer-events:none;transform:translateY(-6px);transition:opacity .15s ease,transform .15s ease,visibility .15s}
        #${MENU_ID}.is-open{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:translateY(0)!important}
        #${MENU_ID} .vmc-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:12px;margin-bottom:10px;border-bottom:1px solid rgba(0,0,0,.13)}
        #${MENU_ID} .vmc-kicker{font:800 10px/1 Arial,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#66625d}
        #${MENU_ID} .vmc-close{border:0;background:transparent;color:#171717;font:400 23px/1 Arial,sans-serif;padding:0 2px;cursor:pointer}
        #${MENU_ID} .vmc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:20px}
        #${MENU_ID} .vmc-link{display:flex;align-items:center;min-height:42px;padding:7px 0;border-bottom:1px solid rgba(0,0,0,.055);color:#171717;text-decoration:none;font:600 13px/1.25 Arial,sans-serif}
      }
    `;
    document.head.appendChild(s);
  }

  function headerBottom(){
    const candidates=[...document.querySelectorAll('header,[role="banner"],.site-header,.siteHeader,.topbar,.navbar')]
      .filter(el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>160&&r.height>20&&r.top<140&&r.bottom>0&&cs.display!=='none'&&cs.visibility!=='hidden'});
    if(!candidates.length)return 0;
    const h=candidates.sort((a,b)=>a.getBoundingClientRect().top-b.getBoundingClientRect().top)[0];
    return Math.max(0,Math.min(110,Math.round(h.getBoundingClientRect().bottom)));
  }

  function position(){
    const bar=document.getElementById(BAR_ID),menu=document.getElementById(MENU_ID);
    if(!bar)return;
    const top=headerBottom();
    bar.style.top=top+'px';
    if(menu)menu.style.top=(top+50)+'px';
  }

  function close(){
    document.getElementById(MENU_ID)?.classList.remove('is-open');
    document.querySelector('#'+BAR_ID+' button')?.setAttribute('aria-expanded','false');
  }

  function toggle(){
    const menu=document.getElementById(MENU_ID),button=document.querySelector('#'+BAR_ID+' button');
    if(!menu||!button)return;
    position();
    const open=!menu.classList.contains('is-open');
    menu.classList.toggle('is-open',open);
    button.setAttribute('aria-expanded',open?'true':'false');
  }

  function ensure(){
    style();
    const mobile=matchMedia(MQ).matches;
    if(!mobile){document.getElementById(BAR_ID)?.remove();document.getElementById(MENU_ID)?.remove();document.getElementById(SPACER_ID)?.remove();return}

    document.getElementById('ve-mobile-categories-row')?.remove();
    document.getElementById('ve-category-menu')?.remove();

    let spacer=document.getElementById(SPACER_ID);
    if(!spacer){
      spacer=document.createElement('div');spacer.id=SPACER_ID;spacer.setAttribute('aria-hidden','true');
      const app=document.getElementById('app');
      if(app)app.insertAdjacentElement('beforebegin',spacer);else document.body.prepend(spacer);
    }

    let bar=document.getElementById(BAR_ID);
    if(!bar){
      bar=document.createElement('div');bar.id=BAR_ID;bar.setAttribute('role','navigation');bar.setAttribute('aria-label','Product categories');
      bar.innerHTML='<button type="button" aria-haspopup="menu" aria-expanded="false">Categories</button>';
      document.body.appendChild(bar);
      bar.querySelector('button')?.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggle()});
    }

    let menu=document.getElementById(MENU_ID);
    if(!menu){
      menu=document.createElement('div');menu.id=MENU_ID;menu.setAttribute('role','menu');menu.setAttribute('aria-label','All product categories');
      menu.innerHTML=`<div class="vmc-head"><div class="vmc-kicker">Shop all categories</div><button class="vmc-close" type="button" aria-label="Close categories">×</button></div><div class="vmc-grid">${CATS.map(([name,slug,type])=>`<a class="vmc-link" role="menuitem" href="/${type==='collection'?'collection':'category'}/${slug}/">${esc(name)}</a>`).join('')}</div>`;
      document.body.appendChild(menu);
      menu.querySelector('.vmc-close')?.addEventListener('click',close);
    }
    position();
  }

  document.addEventListener('click',e=>{
    const menu=document.getElementById(MENU_ID),bar=document.getElementById(BAR_ID);
    if(!menu?.classList.contains('is-open'))return;
    if(menu.contains(e.target)||bar?.contains(e.target))return;
    close();
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  addEventListener('resize',()=>{ensure();position()});
  addEventListener('scroll',position,{passive:true});

  let n=0;const tick=()=>{n++;ensure();if(n<50)setTimeout(tick,n<16?120:400)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  new MutationObserver(()=>setTimeout(ensure,30)).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(ensure,40));
})();
