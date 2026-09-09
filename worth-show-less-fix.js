(()=>{
  if(window.__vyrdictWorthShowLessFixV3)return;
  window.__vyrdictWorthShowLessFixV3=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-worth-show-less-style-v3';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-worth-show-less{
        display:inline-block!important;
        appearance:none!important;
        border:0!important;
        border-bottom:1px solid rgba(255,253,248,.9)!important;
        background:transparent!important;
        color:#fffdf8!important;
        padding:0 0 3px!important;
        margin:20px 0 4px!important;
        font:900 9px/1.3 Arial,Helvetica,sans-serif!important;
        letter-spacing:.08em!important;
        text-transform:uppercase!important;
        cursor:pointer!important;
        position:relative!important;
        z-index:20!important;
        opacity:1!important;
        visibility:visible!important;
      }
      .vyrdict-worth-show-less[hidden]{display:none!important}
      .vyrdict-worth-show-less:hover{opacity:.72!important}
    `;
    document.head.appendChild(s);
  }

  function getWorth(){
    const hs=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=hs.find(el=>norm(el.textContent).includes('actually worth the hype'))
      ||hs.find(el=>norm(el.textContent).includes('worth the hype'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function ensureVisibleControl(section){
    if(!section)return false;
    addStyle();
    const rail=section.querySelector('.rail,[data-rail]');
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    const cta=rail?.querySelector(':scope > .vyrdict-featured-cta');
    if(!rail||!extra||!cta)return false;

    let collapse=section.querySelector('.vyrdict-worth-show-less');
    if(!collapse){
      collapse=document.createElement('button');
      collapse.type='button';
      collapse.className='vyrdict-worth-show-less';
      collapse.textContent='Show less';
      collapse.addEventListener('click',()=>{
        section.dataset.vyrdictFeaturedExpanded='0';
        extra.hidden=true;
        cta.hidden=false;
        collapse.hidden=true;
        section.querySelectorAll('.vyrdict-featured-collapse-v3').forEach(el=>el.hidden=true);
        requestAnimationFrame(()=>cta.scrollIntoView({block:'nearest'}));
      });
    }

    if(extra.parentNode&&collapse.previousElementSibling!==extra){
      extra.insertAdjacentElement('afterend',collapse);
    }

    section.querySelectorAll('.vyrdict-featured-collapse-v3').forEach(el=>{
      if(el!==collapse)el.hidden=true;
    });

    const expanded=section.dataset.vyrdictFeaturedExpanded==='1'||!extra.hidden;
    collapse.hidden=!expanded;
    if(expanded){
      collapse.style.removeProperty('display');
      collapse.style.setProperty('display','inline-block','important');
      collapse.style.setProperty('visibility','visible','important');
      collapse.style.setProperty('opacity','1','important');
    }
    return true;
  }

  document.addEventListener('click',e=>{
    const section=getWorth();
    if(!section)return;
    const cta=e.target.closest('.vyrdict-featured-cta');
    if(!cta||!section.contains(cta))return;
    requestAnimationFrame(()=>{
      section.dataset.vyrdictFeaturedExpanded='1';
      ensureVisibleControl(section);
    });
  },true);

  function boot(attempt=0){
    const section=getWorth();
    if(section&&ensureVisibleControl(section))return;
    if(attempt<24)setTimeout(()=>boot(attempt+1),120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
})();

(()=>{
  if(window.__vyrdictSkipListStableV1)return;
  window.__vyrdictSkipListStableV1=1;

  const ENDPOINT='/api/home-skip';
  const ICON={Skincare:'🧴',Hair:'💇‍♀️',Fitness:'🏋️‍♀️',Beauty:'✨',Perfume:'🌸',Tech:'📱',Home:'🏠',Makeup:'💄',Shoes:'👟','Food & Drinks':'🍿',Wellness:'🧘‍♀️',Fashion:'👜',Pets:'🐾',Travel:'✈️','Beauty Tech':'💡',Books:'📚',Kitchen:'🍳','Kids & Baby':'🧸','Toys & Collectibles':'🧸','Stationery & Crafts':'✏️'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  let products=null,loading=null,timer=0;

  function savedSet(){
    try{return new Set(JSON.parse(localStorage.getItem('vyrdict:saved')||'[]').map(Number))}catch{return new Set()}
  }

  function card(p,saved){
    const viral=Math.max(0,Math.min(100,Number(p.viral_score)||0));
    const worth=Math.max(0,Math.min(100,Number(p.worth_score)||0));
    const icon=ICON[p.category]||'✨';
    const status=esc(p.viral_status||'verified');
    return `<article class="card"><div class="art"><img src="${esc(p.image_url)}" alt="${esc((p.brand||'')+' '+(p.name||''))}" loading="lazy"><span class="chip cat">${icon} ${esc(p.category)}</span><span class="chip status">${status}</span></div><div class="body"><div class="brand">${esc(p.brand)}</div><h3>${esc(p.name)}</h3><div class="score"><div class="scoretop"><span>🔥 HYPE</span><b>${viral}</b></div><div class="track"><div class="fill" style="width:${viral}%"></div></div></div><div class="score worth"><div class="scoretop"><span>✓ WORTH</span><b>${worth}</b></div><div class="track"><div class="fill" style="width:${worth}%"></div></div></div><div class="verdict"><span>${worth<70?'🚩':'👀'} ${esc(p.verdict)}</span><span>→</span></div><div class="cardactions"><button class="see" data-product="${esc(p.slug)}">SEE VYRDICT</button><button class="save" data-save="${Number(p.id)}">${saved.has(Number(p.id))?'♥':'♡'}</button></div></div></article>`;
  }

  async function load(){
    if(products)return products;
    if(loading)return loading;
    loading=fetch(ENDPOINT,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('skip '+r.status);return r.json()}).then(d=>products=Array.isArray(d?.products)?d.products:[]).catch(()=>products=[]).finally(()=>loading=null);
    return loading;
  }

  async function mount(attempt=0){
    if(!isHome())return false;
    if(document.getElementById('skip-list'))return true;
    const culture=document.getElementById('culture');
    if(!culture){if(attempt<80)timer=setTimeout(()=>mount(attempt+1),120);return false}
    const rows=await load();
    if(!rows.length){if(attempt<20)timer=setTimeout(()=>{products=null;mount(attempt+1)},500);return false}
    if(document.getElementById('skip-list'))return true;
    const saved=savedSet();
    const sec=document.createElement('section');
    sec.id='skip-list';
    sec.className='section skiplist';
    sec.innerHTML='<div class="shell"><div class="head"><div><div class="skipflag">🚩 VIRAL ≠ WORTH IT</div><h2>The Skip List.</h2></div><p>The products dominating your feed that the VYRDICT scores say are better skipped — high hype, weak actual value.</p></div><div class="rail">'+rows.map(p=>card(p,saved)).join('')+'</div></div>';
    culture.before(sec);
    return true;
  }

  document.addEventListener('click',e=>{
    const sec=e.target.closest('#skip-list');
    if(!sec)return;
    const p=e.target.closest('[data-product]');
    if(p){
      e.preventDefault();e.stopImmediatePropagation();
      location.assign('/product/'+encodeURIComponent(p.dataset.product)+'/');
      return;
    }
    const s=e.target.closest('[data-save]');
    if(s){
      e.preventDefault();e.stopImmediatePropagation();
      const id=Number(s.dataset.save),set=savedSet();
      if(set.has(id)){set.delete(id);s.textContent='♡'}else{set.add(id);s.textContent='♥'}
      try{localStorage.setItem('vyrdict:saved',JSON.stringify([...set]))}catch{}
    }
  },true);

  const observer=new MutationObserver(()=>{
    if(!isHome()||document.getElementById('skip-list'))return;
    clearTimeout(timer);timer=setTimeout(()=>mount(),80);
  });

  function start(){mount();const app=document.getElementById('app')||document.body;if(app)observer.observe(app,{childList:true,subtree:false})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  addEventListener('popstate',()=>setTimeout(()=>mount(),40));
  addEventListener('hashchange',()=>setTimeout(()=>mount(),40));
})();
