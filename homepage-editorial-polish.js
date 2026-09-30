(()=>{
  if(window.__vyrdictEditorialPolishV2)return;
  window.__vyrdictEditorialPolishV2=1;
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  if(!isHome())return;

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  const root=()=>document.getElementById('vyrdict-editorial-home');

  const CORE_CATS=[
    ['Beauty','beauty'],['Fashion','fashion'],['Tech','tech'],['Home','home'],['Wellness','wellness'],['Kitchen','kitchen'],['Books','books'],['Pets','pets']
  ];
  const MORE_CATS=[
    ['Beauty Tech','beauty-tech'],['Fitness','fitness'],['Food & Drinks','food-drinks'],['Hair','hair'],['Kids & Baby','kids-baby'],['Makeup','makeup'],['Perfume','perfume'],['Shoes','shoes'],['Skincare','skincare'],['Stationery & Crafts','stationery-crafts'],['Toys & Collectibles','toys-collectibles'],['Travel','travel']
  ];

  /* Curated, verified records are intentionally explicit here. This prevents a
     stale client catalog cache from pairing the wrong image/name/brand. */
  const CURATED={
    community:[
      {slug:'dji-osmo-pocket-3',brand:'DJI',name:'Osmo Pocket 3',viral_score:100,worth_score:93,image_url:'https://se-cdn.djiits.com/tpc/uploads/spu/cover/35d158a1f3d1a3a48ec4cf2220cfc426%40small.png'},
      {slug:'ninja-crispi-glass-air-fryer',brand:'Ninja',name:'Crispi 4-in-1 Portable Glass Air Fryer',viral_score:97,worth_score:92,image_url:'https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-NA/FN101C-MASTER_01.jpg'},
      {slug:'theo-of-golden',brand:'Allen Levi',name:'Theo of Golden',viral_score:97,worth_score:94,image_url:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781668236550/theo-of-golden-9781668236550_hr.jpg'},
      {slug:'chomchom-roller',brand:'ChomChom',name:'Roller Pet Hair Remover',viral_score:99,worth_score:93,image_url:'https://chomchomforpets.com/cdn/shop/files/BlackRoller9.jpg?v=1761874946'}
    ],
    motion:[
      {slug:'puma-speedcat-ballet',brand:'PUMA',name:'Speedcat Ballet',viral_score:100,worth_score:93,image_url:'https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_600%2Ch_600/global/406144/03/sv01/fnd/PNA/fmt/png/Speedcat-Ballet-Women%27s-Sneakers'},
      {slug:'fino-premium-touch-hair-mask',brand:'Fino',name:'Premium Touch Hair Mask',viral_score:99,worth_score:91,image_url:'https://bbcream.kiev.ua/images/fino_maska.jpg'},
      {slug:'oura-ring-5',brand:'Oura',name:'Oura Ring 5',viral_score:97,worth_score:88,image_url:'https://multimedia.bbycastatic.ca/multimedia/products/500x500/198/19805/19805226.jpg'}
    ],
    worth:[
      {slug:'uniqlo-round-mini-shoulder-bag',brand:'Uniqlo',name:'Round Mini Shoulder Bag',viral_score:97,worth_score:96,image_url:'https://image.uniqlo.com/UQ/ST3/us/imagesgoods/478708/feature/usgoods_478708_feature1.jpg'},
      {slug:'dawn-powerwash',brand:'Dawn',name:'Powerwash Dish Spray',viral_score:98,worth_score:93,image_url:'https://images.ctfassets.net/cj8g3qewem31/KcgibnEMb9v7lJo2UnHHU/33d158441c69b1be152dedded7314e64/Dawn_Powerwash_Dish_Spray_Fresh_Scent_Starter_Kit_16oz_80862786_131312837.jpg?q=90'},
      {slug:'tower-28-sos-rescue-spray',brand:'Tower 28 Beauty',name:'SOS Rescue Spray',viral_score:96,worth_score:93,image_url:'https://www.tower28beauty.com/cdn/shop/files/SOS_20Spray_20_E2_80_94_C2_A04_20oz.webp?v=1762649181&width=2000'}
    ]
  };

  function catalog(){
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      if(Array.isArray(c?.p))return c.p.filter(p=>p?.slug&&p?.name&&p?.image_url);
    }catch{}
    return [...CURATED.community,...CURATED.motion,...CURATED.worth];
  }
  function scoreLine(p){
    const bits=[];
    if(Number.isFinite(Number(p.viral_score)))bits.push(`Viral ${Number(p.viral_score)}`);
    if(Number.isFinite(Number(p.worth_score)))bits.push(`Worth ${Number(p.worth_score)}`);
    return bits.join(' · ')||'See the VYRDICT';
  }
  function pCard(p){
    const v=Number.isFinite(Number(p.viral_score))?`<span>Viral <b>${Number(p.viral_score)}</b></span>`:'';
    const w=Number.isFinite(Number(p.worth_score))?`<span>Worth <b>${Number(p.worth_score)}</b></span>`:'';
    return `<a class="ve-product ve-reveal ve-in" href="/product/${encodeURIComponent(p.slug)}/" data-product-slug="${esc(p.slug)}"><div class="ve-product-media"><img loading="lazy" src="${esc(p.image_url)}" alt="${esc(p.name)}"></div><div class="ve-product-copy"><div class="ve-product-brand">${esc(p.brand)}</div><p class="ve-product-name">${esc(p.name)}</p><div class="ve-scores">${v}${w}</div></div></a>`;
  }

  function style(){
    document.getElementById('ve-editorial-polish-style')?.remove();
    const s=document.createElement('style');
    s.id='ve-editorial-polish-style';
    s.textContent=`
      /* Product cutouts: remove the visible white square effect in the hero. */
      #vyrdict-editorial-home .ve-float img{mix-blend-mode:multiply!important;background:transparent!important}
      #vyrdict-editorial-home .ve-float{background:transparent!important;box-shadow:none!important}

      .ve-site-ribbon{position:sticky;top:var(--ve-header-h,62px);z-index:88;background:rgba(248,247,243,.97);border-bottom:1px solid rgba(20,20,20,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
      .ve-ribbon-inner{width:min(1320px,calc(100% - 52px));margin:0 auto;min-height:48px;display:flex;align-items:center;gap:6px;position:relative}
      .ve-ribbon-scroll{display:flex;align-items:center;gap:4px;min-width:0;overflow-x:auto;scrollbar-width:none;white-space:nowrap;flex:1}.ve-ribbon-scroll::-webkit-scrollbar{display:none}
      .ve-ribbon-link,.ve-ribbon-trigger{appearance:none;border:0;background:transparent;color:#232323;text-decoration:none;padding:18px 12px 15px;font:650 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.105em;text-transform:uppercase;cursor:pointer;border-bottom:1px solid transparent}
      .ve-ribbon-link:hover,.ve-ribbon-trigger:hover,.ve-ribbon-trigger[aria-expanded="true"]{border-bottom-color:#222}
      .ve-menu-wrap{position:static;display:flex;align-items:center}.ve-menu-panel{position:absolute;left:0;right:0;top:100%;display:none;background:#f8f7f3;border:1px solid rgba(0,0,0,.12);border-left:0;border-right:0;padding:30px 34px 34px;box-shadow:0 18px 36px rgba(0,0,0,.09)}
      .ve-menu-wrap:hover .ve-menu-panel,.ve-menu-wrap:focus-within .ve-menu-panel,.ve-menu-wrap.ve-open .ve-menu-panel{display:block}
      .ve-menu-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:34px;max-width:1180px;margin:0 auto}.ve-menu-col strong{display:block;font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.14em;text-transform:uppercase;margin-bottom:15px;color:#686660}.ve-menu-col a{display:block;color:#1b1b1b;text-decoration:none;font:500 13px/1.45 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);padding:4px 0}.ve-menu-col a:hover{text-decoration:underline;text-underline-offset:4px}
      .ve-ribbon-icons{display:flex;align-items:center;gap:2px;padding-left:8px}.ve-ribbon-icon{width:38px;height:38px;border:0;background:transparent;display:grid;place-items:center;color:#202020;text-decoration:none;cursor:pointer;border-radius:50%}.ve-ribbon-icon:hover{background:rgba(0,0,0,.055)}.ve-ribbon-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.55}
      .ve-sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
      .ve-search-layer{position:fixed;inset:0;z-index:10020;background:rgba(20,20,20,.35);display:none;align-items:flex-start;justify-content:center;padding-top:max(72px,8vh);backdrop-filter:blur(3px)}.ve-search-layer.ve-open{display:flex}.ve-search-box{width:min(760px,calc(100% - 30px));background:#f8f7f3;border:1px solid rgba(0,0,0,.18);box-shadow:0 28px 70px rgba(0,0,0,.22)}.ve-search-top{display:flex;align-items:center;border-bottom:1px solid rgba(0,0,0,.14)}.ve-search-top input{flex:1;border:0;outline:0;background:transparent;padding:21px 22px;font:400 20px/1.2 var(--ve-serif,Georgia,serif);color:#171717}.ve-search-close{border:0;background:transparent;width:52px;height:52px;font-size:25px;cursor:pointer}.ve-search-results{max-height:min(62vh,620px);overflow:auto;padding:8px}.ve-search-result{display:grid;grid-template-columns:68px 1fr auto;gap:14px;align-items:center;padding:10px;text-decoration:none;color:#171717;border-bottom:1px solid rgba(0,0,0,.08)}.ve-search-result img{width:68px;height:68px;object-fit:contain;background:#eeece6}.ve-search-result small{display:block;font:700 8px/1.2 var(--ve-sans,Arial,sans-serif);letter-spacing:.11em;text-transform:uppercase;color:#74716b;margin-bottom:6px}.ve-search-result b{font:500 14px/1.3 var(--ve-sans,Arial,sans-serif)}.ve-search-result em{font:600 9px/1.2 var(--ve-sans,Arial,sans-serif);font-style:normal;color:#666;text-transform:uppercase;letter-spacing:.06em}.ve-search-empty{padding:28px 22px;font:400 14px/1.5 var(--ve-sans,Arial,sans-serif);color:#666}
      .ve-more-cats{display:none}.ve-category-links.ve-expanded .ve-more-cats{display:inline-flex}.ve-more-cats-btn{border:1px solid rgba(255,255,255,.35);background:transparent;color:#f4f1eb;padding:11px 14px;font:650 10px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.ve-more-cats-btn:hover{background:#f4f1eb;color:#171717}
      @media(max-width:900px){.ve-ribbon-inner{width:100%;padding:0 10px}.ve-menu-panel{padding:24px 18px;max-height:66vh;overflow:auto}.ve-menu-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:26px}.ve-site-ribbon{top:var(--ve-header-h,58px)}}
      @media(max-width:560px){.ve-ribbon-inner{min-height:44px}.ve-ribbon-link,.ve-ribbon-trigger{padding-left:9px;padding-right:9px}.ve-ribbon-icons .ve-ribbon-icon:not([data-ve-search]){display:none}.ve-menu-grid{grid-template-columns:1fr 1fr;gap:22px}.ve-search-result{grid-template-columns:58px 1fr}.ve-search-result img{width:58px;height:58px}.ve-search-result em{display:none}}
    `;
    document.head.appendChild(s);
  }

  function hideLegacyStories(){
    const r=root();if(!r)return;
    const exact=[...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,div')].filter(el=>!el.closest('#vyrdict-editorial-home')&&clean(el.textContent)==='VYRDICT Stories');
    for(const el of exact){
      let n=el,best=null;
      for(let i=0;i<6&&n;i++,n=n.parentElement){
        if(!n.getBoundingClientRect)continue;const rect=n.getBoundingClientRect();
        if(rect.height>=65&&rect.height<=280&&rect.width>=innerWidth*.62)best=n;
      }
      if(best){best.style.setProperty('display','none','important');best.dataset.veStoriesHidden='1';break}
    }
  }

  function hideLegacyCategoryRibbon(){
    const r=root();if(!r)return;
    const candidates=[...document.querySelectorAll('nav,div,section')].filter(el=>!el.closest('#vyrdict-editorial-home')&&el.querySelectorAll('a[href*="/category/"]').length>=5);
    candidates.sort((a,b)=>a.getBoundingClientRect().height-b.getBoundingClientRect().height);
    const pick=candidates.find(el=>{const x=el.getBoundingClientRect();return x.height>22&&x.height<105&&x.width>innerWidth*.65});
    if(pick){pick.style.setProperty('display','none','important');pick.dataset.veOldCatsHidden='1'}
  }

  function diversify(){
    const r=root();if(!r)return;
    const grid=r.querySelector('.ve-community .ve-product-grid');
    if(grid&&grid.dataset.veCurated!=='2'){grid.innerHTML=CURATED.community.map(pCard).join('');grid.dataset.veCurated='2'}

    const frame=r.querySelector('.ve-motion-frame');
    if(frame&&frame.dataset.veCurated!=='2'){
      frame.innerHTML=CURATED.motion.map(p=>`<div class="ve-motion-img" style="background-image:url('${esc(p.image_url).replace(/'/g,'&#39;')}')"></div>`).join('');
      frame.dataset.veCurated='2';
    }

    const worthGrid=r.querySelector('.ve-worth-grid');
    if(worthGrid&&worthGrid.dataset.veCurated!=='2'){
      const [featured,mini1,mini2]=CURATED.worth;
      worthGrid.innerHTML=`<a class="ve-feature-product ve-reveal ve-in" href="/product/${encodeURIComponent(featured.slug)}/"><div class="ve-feature-media"><img loading="lazy" src="${esc(featured.image_url)}" alt="${esc(featured.name)}"></div><div class="ve-feature-copy"><div><div class="ve-kicker">VYRDICT PICK</div><h3>${esc(featured.name)}</h3><p>${esc(featured.brand)}</p></div><div class="ve-feature-score">${esc(scoreLine(featured))}</div></div></a><div class="ve-mini-stack"><a class="ve-mini ve-reveal ve-in" href="/product/${encodeURIComponent(mini1.slug)}/"><img loading="lazy" src="${esc(mini1.image_url)}" alt="${esc(mini1.name)}"><span class="ve-mini-label">${esc(mini1.name)} · ${esc(scoreLine(mini1))}</span></a><a class="ve-mini ve-reveal ve-in" href="/product/${encodeURIComponent(mini2.slug)}/"><img loading="lazy" src="${esc(mini2.image_url)}" alt="${esc(mini2.name)}"><span class="ve-mini-label">${esc(mini2.name)} · ${esc(scoreLine(mini2))}</span></a></div>`;
      worthGrid.dataset.veCurated='2';
    }
  }

  function categoryColumns(){
    return `<div class="ve-menu-grid">
      <div class="ve-menu-col"><strong>Beauty</strong><a href="/category/beauty/">Beauty</a><a href="/category/makeup/">Makeup</a><a href="/category/skincare/">Skincare</a><a href="/category/hair/">Hair</a><a href="/category/perfume/">Perfume</a><a href="/category/beauty-tech/">Beauty Tech</a></div>
      <div class="ve-menu-col"><strong>Style & movement</strong><a href="/category/fashion/">Fashion</a><a href="/category/shoes/">Shoes</a><a href="/category/fitness/">Fitness</a><a href="/category/travel/">Travel</a><a href="/category/wellness/">Wellness</a></div>
      <div class="ve-menu-col"><strong>Home & life</strong><a href="/category/home/">Home</a><a href="/category/kitchen/">Kitchen</a><a href="/category/food-drinks/">Food & Drinks</a><a href="/category/pets/">Pets</a><a href="/category/kids-baby/">Kids & Baby</a></div>
      <div class="ve-menu-col"><strong>Culture & play</strong><a href="/category/books/">Books</a><a href="/category/stationery-crafts/">Stationery & Crafts</a><a href="/category/toys-collectibles/">Toys & Collectibles</a><a href="/collection/seen-on-screen/">Seen on Screen</a><a href="/collection/celebrity-effect/">Celebrity Effect</a><a href="/collection/viral-around-the-world/">Viral Around the World</a></div>
    </div>`;
  }
  function giftsColumns(){
    return `<div class="ve-menu-grid">
      <div class="ve-menu-col"><strong>Shop by person</strong><a href="/collection/gifts-for-her/">For Her</a><a href="/collection/gifts-for-him/">For Him</a><a href="/collection/gifts-for-kids/">For Kids</a><a href="/collection/they-already-have-everything/">Hard to Shop For</a></div>
      <div class="ve-menu-col"><strong>By budget</strong><a href="/collection/gifts-under-25/">Under $25</a><a href="/collection/gifts-under-50/">Under $50</a><a href="/collection/gifts-under-100/">Under $100</a></div>
      <div class="ve-menu-col"><strong>By vibe</strong><a href="/collection/viral-gifts/">Viral Gifts</a><a href="/collection/beauty-gifts/">Beauty Gifts</a><a href="/collection/tech-gifts/">Tech Gifts</a><a href="/collection/cozy-home-gifts/">Cozy & Home</a></div>
      <div class="ve-menu-col"><strong>Gift edit</strong><a href="/collection/gifts/">All Gifts</a><a href="/collection/actually-worth-the-hype/">Actually Worth It</a><a href="/collection/breaking-out/">Breaking Out</a></div>
    </div>`;
  }

  function renderRibbon(){
    const r=root();if(!r)return;
    r.querySelector('.ve-site-ribbon')?.remove();
    const ribbon=document.createElement('div');
    ribbon.className='ve-site-ribbon';
    ribbon.innerHTML=`<div class="ve-ribbon-inner"><div class="ve-ribbon-scroll">
      <a class="ve-ribbon-link" href="/collection/viral-right-now/">Trending</a>
      <div class="ve-menu-wrap"><button class="ve-ribbon-trigger" type="button" aria-expanded="false">Categories</button><div class="ve-menu-panel">${categoryColumns()}</div></div>
      <div class="ve-menu-wrap"><button class="ve-ribbon-trigger" type="button" aria-expanded="false">Gifts</button><div class="ve-menu-panel">${giftsColumns()}</div></div>
      <a class="ve-ribbon-link" href="/collection/overhyped-right-now/">Skip It</a>
    </div><div class="ve-ribbon-icons"><button class="ve-ribbon-icon" type="button" data-ve-search aria-label="Search VYRDICT"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.4 4.4"></path></svg><span class="ve-sr-only">Search</span></button><a class="ve-ribbon-icon" href="/account.html" aria-label="Account"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.3"></circle><path d="M5.7 20c.7-4 3-6 6.3-6s5.6 2 6.3 6"></path></svg><span class="ve-sr-only">Account</span></a><a class="ve-ribbon-icon" href="/saved" aria-label="Saved"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 5.8c-1.9-2-5-2-6.9 0L12 7.4l-1.5-1.6c-1.9-2-5-2-6.9 0-2.1 2.2-2.1 5.7 0 7.9L12 22l8.4-8.3c2.1-2.2 2.1-5.7 0-7.9Z"></path></svg><span class="ve-sr-only">Saved</span></a></div></div>`;
    r.insertBefore(ribbon,r.firstChild);
    const header=document.querySelector('header');
    if(header)document.documentElement.style.setProperty('--ve-header-h',Math.max(50,Math.round(header.getBoundingClientRect().height))+'px');
    ribbon.querySelectorAll('.ve-ribbon-trigger').forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation();const wrap=btn.closest('.ve-menu-wrap');const open=!wrap.classList.contains('ve-open');
      ribbon.querySelectorAll('.ve-menu-wrap').forEach(x=>x.classList.remove('ve-open'));ribbon.querySelectorAll('.ve-ribbon-trigger').forEach(x=>x.setAttribute('aria-expanded','false'));
      if(open){wrap.classList.add('ve-open');btn.setAttribute('aria-expanded','true')}
    }));
    ribbon.querySelector('[data-ve-search]')?.addEventListener('click',openSearch);
  }

  function fixEditorialLinks(){
    const r=root();if(!r)return;
    const communityLink=r.querySelector('.ve-community .ve-text-link');if(communityLink){communityLink.href='/collection/viral-right-now/';communityLink.textContent='Explore viral finds'}
    const motionLink=r.querySelector('.ve-motion .ve-text-link');if(motionLink)motionLink.href='/collection/viral-right-now/';
  }

  function bottomCategories(){
    const r=root();if(!r)return;
    const nav=r.querySelector('.ve-category-links');if(!nav||nav.dataset.veFull==='2')return;
    nav.dataset.veFull='2';
    nav.innerHTML=CORE_CATS.map(([n,s])=>`<a href="/category/${s}/">${esc(n)}</a>`).join('')+MORE_CATS.map(([n,s])=>`<a class="ve-more-cats" href="/category/${s}/">${esc(n)}</a>`).join('')+`<a href="/collection/gifts/">Gifts</a><button class="ve-more-cats-btn" type="button" aria-expanded="false">Explore more categories +</button>`;
    const btn=nav.querySelector('.ve-more-cats-btn');
    btn.addEventListener('click',()=>{const open=nav.classList.toggle('ve-expanded');btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'Show fewer categories −':'Explore more categories +'});
  }

  function footerWatermark(){
    const footer=document.querySelector('footer');if(!footer)return;
    const fr=footer.getBoundingClientRect();
    [...footer.querySelectorAll('*')].forEach(el=>{
      const txt=clean(el.textContent).replace(/[.·]/g,'').trim().toUpperCase();
      if(txt!=='VYRDICT')return;
      const rect=el.getBoundingClientRect(),fs=parseFloat(getComputedStyle(el).fontSize)||0;
      if(fs>=34||rect.width>=fr.width*.35||rect.top>=fr.top+fr.height*.58){
        el.style.setProperty('color','rgba(247,244,238,.22)','important');
        el.style.setProperty('opacity','1','important');
        el.style.setProperty('-webkit-text-fill-color','rgba(247,244,238,.22)','important');
      }
    });
  }

  function ensureSearch(){
    let layer=document.getElementById('ve-search-layer');if(layer)return layer;
    layer=document.createElement('div');layer.id='ve-search-layer';layer.className='ve-search-layer';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-label','Search VYRDICT');
    layer.innerHTML=`<div class="ve-search-box"><div class="ve-search-top"><input type="search" autocomplete="off" placeholder="Search products, brands, categories…" aria-label="Search products"><button class="ve-search-close" type="button" aria-label="Close search">×</button></div><div class="ve-search-results"><div class="ve-search-empty">Start typing to search VYRDICT.</div></div></div>`;
    document.body.appendChild(layer);layer.addEventListener('click',e=>{if(e.target===layer)closeSearch()});layer.querySelector('.ve-search-close').addEventListener('click',closeSearch);layer.querySelector('input').addEventListener('input',e=>renderSearch(e.target.value));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&layer.classList.contains('ve-open'))closeSearch()});return layer;
  }
  function openSearch(){const l=ensureSearch();l.classList.add('ve-open');setTimeout(()=>l.querySelector('input')?.focus(),25)}
  function closeSearch(){document.getElementById('ve-search-layer')?.classList.remove('ve-open')}
  function renderSearch(q){
    const layer=ensureSearch(),box=layer.querySelector('.ve-search-results'),term=clean(q).toLowerCase();
    if(term.length<2){box.innerHTML='<div class="ve-search-empty">Type at least two letters to search VYRDICT.</div>';return}
    const rows=catalog().filter(p=>`${p.brand||''} ${p.name||''} ${p.category||''}`.toLowerCase().includes(term)).sort((a,b)=>(Number(b.viral_score||0)+Number(b.worth_score||0))-(Number(a.viral_score||0)+Number(a.worth_score||0))).slice(0,8);
    if(!rows.length){box.innerHTML='<div class="ve-search-empty">No matching products yet.</div>';return}
    box.innerHTML=rows.map(p=>`<a class="ve-search-result" href="/product/${encodeURIComponent(p.slug)}/"><img src="${esc(p.image_url)}" alt=""><span><small>${esc(p.brand||p.category||'VYRDICT')}</small><b>${esc(p.name)}</b></span><em>${p.viral_score!=null?'Viral '+esc(p.viral_score):''}${p.worth_score!=null?' · Worth '+esc(p.worth_score):''}</em></a>`).join('');
  }

  function apply(){
    if(!isHome()||!root())return false;
    style();hideLegacyStories();hideLegacyCategoryRibbon();renderRibbon();diversify();fixEditorialLinks();bottomCategories();footerWatermark();ensureSearch();return true;
  }

  let tries=0;const tick=()=>{tries++;apply();if(tries<16)setTimeout(tick,tries<7?260:700)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  const app=document.getElementById('app')||document.body;new MutationObserver(()=>setTimeout(apply,45)).observe(app,{childList:true,subtree:false});
  addEventListener('pageshow',()=>setTimeout(apply,40));
})();