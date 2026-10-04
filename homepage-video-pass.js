(()=>{
  if(window.__vyrdictHomepageVideoPassV1)return;
  window.__vyrdictHomepageVideoPassV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT_ID='vyrdict-editorial-home';
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const root=()=>document.getElementById(ROOT_ID);

  const HERO=[
    {slug:'owala-freesip',brand:'Owala',name:'FreeSip',viral:100,worth:94,image:'https://cdn.shopify.com/s/files/1/0439/2537/3087/files/32ozPinkFreeSip-SC_2d510ac3-2fda-4ab0-86be-e415f783a00a.png?crop=center&height=500&v=1740784339&width=500'},
    {slug:'kayali-vanilla-28',brand:'KAYALI',name:'Vanilla | 28',viral:99,worth:91,image:'https://us.kayali.com/cdn/shop/files/Vanilla_28_100_d5e20e92-2e80-4a3e-9235-0631fad584b4.png?v=1759851587&width=1024'},
    {slug:'dji-osmo-pocket-3',brand:'DJI',name:'Osmo Pocket 3',viral:100,worth:93,image:'https://se-cdn.djiits.com/tpc/uploads/spu/cover/35d158a1f3d1a3a48ec4cf2220cfc426%40small.png'}
  ];

  const COMMUNITY=[
    {slug:'fenty-beauty-gloss-bomb',brand:'Fenty Beauty',name:'Gloss Bomb Universal Lip Luminizer',viral:99,worth:91,image:'https://m.media-amazon.com/images/I/71t9TtRzsRL._SL1500_.jpg'},
    {slug:'ninja-crispi-glass-air-fryer',brand:'Ninja',name:'Crispi 4-in-1 Portable Glass Air Fryer',viral:97,worth:92,image:'https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-NA/FN101C-MASTER_01.jpg'},
    {slug:'theo-of-golden',brand:'Allen Levi',name:'Theo of Golden',viral:97,worth:94,image:'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781668236550/theo-of-golden-9781668236550_hr.jpg'},
    {slug:'chomchom-roller',brand:'ChomChom',name:'Roller Pet Hair Remover',viral:99,worth:93,image:'https://chomchomforpets.com/cdn/shop/files/BlackRoller9.jpg?v=1761874946'}
  ];

  const MOMENTS=[
    'https://assets.adidas.com/images/w_1000,f_auto,q_auto/9cbed7f0099347c09662e57b4fec9e91_9366/ADIDAS_Pokemon_SUPERSTAR_II_SHOES_Yellow_KI2858_01_00_standard.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/3c6642ba-01fb-4ad7-8792-78ded340bbad.jpeg',
    'https://about.starbucks.com/uploads/2026/08/PeanutsMerchFall2026-01913-scaled.jpg'
  ];

  function injectStyle(){
    if(document.getElementById('ve-video-pass-style'))return;
    const s=document.createElement('style');
    s.id='ve-video-pass-style';
    s.textContent=`
      /* One navigation system only: keep the original VYRDICT header and remove the stacked secondary ribbon. */
      body.ve-home .ve-site-ribbon{display:none!important}
      body.ve-home header{position:sticky!important;top:0!important;z-index:120!important;background:rgba(249,248,244,.97)!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
      body.ve-home header .ve-header-removed{display:none!important}
      .ve-header-icons{display:flex!important;align-items:center!important;gap:3px!important;margin-left:12px!important}
      .ve-header-icon{width:36px!important;height:36px!important;border:0!important;background:transparent!important;color:#202020!important;display:grid!important;place-items:center!important;text-decoration:none!important;border-radius:50%!important;cursor:pointer!important;padding:0!important}
      .ve-header-icon:hover{background:rgba(0,0,0,.055)!important}.ve-header-icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.55}

      /* Keep the opening clean. No legacy cards may bleed underneath the hero. */
      #${ROOT_ID} .ve-hero{min-height:min(820px,88vh)!important}
      #${ROOT_ID} .ve-stage{overflow:visible!important}
      #${ROOT_ID} .ve-float{background:transparent!important;box-shadow:none!important}
      #${ROOT_ID} .ve-float img{mix-blend-mode:multiply!important;background:transparent!important;filter:drop-shadow(0 28px 28px rgba(0,0,0,.16))!important}
      #${ROOT_ID} .ve-float-meta{background:rgba(246,244,239,.82)!important;border-color:rgba(0,0,0,.10)!important}

      /* Community products should sit naturally on the stone surface, not inside obvious white image boxes. */
      #${ROOT_ID} .ve-community .ve-product-media{background:#efede7!important}
      #${ROOT_ID} .ve-community .ve-product-media:before{background:radial-gradient(circle at 50% 46%,rgba(255,255,255,.58),transparent 58%)!important}
      #${ROOT_ID} .ve-community .ve-product-media img{mix-blend-mode:multiply!important;background:transparent!important}

      /* Full-bleed editorial imagery for the cinematic section. */
      #${ROOT_ID} .ve-motion-img{background-size:cover!important;background-position:center!important;filter:saturate(.78) brightness(.60) contrast(.96)!important;animation-duration:24s!important;transform:scale(1.045)!important}
      #${ROOT_ID} .ve-motion-img:nth-child(1){animation-delay:0s!important}
      #${ROOT_ID} .ve-motion-img:nth-child(2){animation-delay:8s!important}
      #${ROOT_ID} .ve-motion-img:nth-child(3){animation-delay:16s!important}
      #${ROOT_ID} .ve-motion:after{background:linear-gradient(180deg,rgba(0,0,0,.08) 12%,rgba(0,0,0,.66) 100%)!important}
      #${ROOT_ID} .ve-motion-side{max-width:430px!important}

      @media(max-width:760px){
        .ve-header-icons{gap:0!important;margin-left:5px!important}.ve-header-icon{width:32px!important;height:32px!important}
        #${ROOT_ID} .ve-hero{min-height:auto!important}
      }
    `;
    document.head.appendChild(s);
  }

  function cleanLegacy(){
    const r=root(),app=document.getElementById('app');if(!r||!app)return;
    const header=document.querySelector('header'),footer=document.querySelector('footer');
    [...app.children].forEach(el=>{
      if(el===r||el.id==='vyrdict-editorial-product-bridge'||el.tagName==='SCRIPT'||el.tagName==='STYLE')return;
      if((header&&(el===header||el.contains(header)))||(footer&&(el===footer||el.contains(footer))))return;
      el.classList.add('ve-legacy-home');
      el.style.setProperty('display','none','important');
    });
    /* Also catch small legacy rows inserted later between header and editorial root. */
    [...document.querySelectorAll('#app > *, #app > div > *')].forEach(el=>{
      if(el===r||r.contains(el)||el.closest('#'+ROOT_ID)||el.closest('header')||el.closest('footer'))return;
      if(el.querySelectorAll?.('a[href*="/product/"]').length>=3&&el.getBoundingClientRect?.().height<520){
        el.style.setProperty('display','none','important');el.dataset.veLegacyProductRow='1';
      }
    });
  }

  function simplifyHeader(){
    const header=document.querySelector('header');if(!header)return;
    /* Remove text versions of Saved and Account; keep Explore / Categories / Culture and their working menus. */
    [...header.querySelectorAll('a,button')].forEach(el=>{
      const t=norm(el.textContent);
      if(t==='saved'||t==='saves'||t==='account')el.classList.add('ve-header-removed');
    });
    if(header.querySelector('.ve-header-icons'))return;
    const nav=[...header.querySelectorAll('nav,div')].filter(el=>{
      const text=norm(el.textContent);const rect=el.getBoundingClientRect?.();
      return rect&&rect.width>150&&rect.height<110&&text.includes('explore')&&text.includes('categories');
    }).sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length)[0];
    const host=nav||header;
    const icons=document.createElement('span');icons.className='ve-header-icons';
    icons.innerHTML=`<button class="ve-header-icon" type="button" data-ve-video-search aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4.4 4.4"></path></svg></button><a class="ve-header-icon" href="/saved" aria-label="Saved"><svg viewBox="0 0 24 24"><path d="M20.4 5.8c-1.9-2-5-2-6.9 0L12 7.4l-1.5-1.6c-1.9-2-5-2-6.9 0-2.1 2.2-2.1 5.7 0 7.9L12 22l8.4-8.3c2.1-2.2 2.1-5.7 0-7.9Z"></path></svg></a><a class="ve-header-icon" href="/account.html" aria-label="Account"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.3"></circle><path d="M5.7 20c.7-4 3-6 6.3-6s5.6 2 6.3 6"></path></svg></a>`;
    host.appendChild(icons);
    icons.querySelector('[data-ve-video-search]')?.addEventListener('click',()=>{
      const existing=document.querySelector('[data-ve-search]');
      if(existing){existing.click();return}
      const layer=document.getElementById('ve-search-layer');
      if(layer){layer.classList.add('ve-open');setTimeout(()=>layer.querySelector('input')?.focus(),20)}
    });
  }

  function curateHero(){
    const r=root(),stage=r?.querySelector('.ve-stage');if(!stage||stage.dataset.veVideoHero==='1')return;
    stage.dataset.veVideoHero='1';
    stage.innerHTML=`<div class="ve-stage-orb"></div>`+HERO.map((p,i)=>`<a class="ve-float" href="/product/${encodeURIComponent(p.slug)}/" aria-label="${esc(p.name)}"><img ${i===0?'':'loading="eager"'} src="${esc(p.image)}" alt="${esc(p.name)}"><span class="ve-float-meta">${esc(p.brand)} · Viral ${p.viral}</span></a>`).join('');
  }

  function communityCard(p){
    return `<a class="ve-product ve-reveal ve-in" href="/product/${encodeURIComponent(p.slug)}/"><div class="ve-product-media"><img loading="lazy" src="${esc(p.image)}" alt="${esc(p.name)}"></div><div class="ve-product-copy"><div class="ve-product-brand">${esc(p.brand)}</div><p class="ve-product-name">${esc(p.name)}</p><div class="ve-scores"><span>Viral <b>${p.viral}</b></span><span>Worth <b>${p.worth}</b></span></div></div></a>`;
  }

  function curateCommunity(){
    const grid=root()?.querySelector('.ve-community .ve-product-grid');if(!grid||grid.dataset.veVideoCommunity==='1')return;
    grid.dataset.veVideoCommunity='1';grid.innerHTML=COMMUNITY.map(communityCard).join('');
  }

  function curateMoments(){
    const r=root(),frame=r?.querySelector('.ve-motion-frame');if(!frame||frame.dataset.veVideoMoment==='1')return;
    frame.dataset.veVideoMoment='1';
    frame.innerHTML=MOMENTS.map(url=>`<div class="ve-motion-img" style="background-image:url('${url.replace(/'/g,'&#39;')}')"></div>`).join('');
    const copy=r.querySelector('.ve-motion-side p');
    if(copy)copy.textContent='A rotating pulse of the launches, collaborations and products moving through culture right now. We track the attention—then look past it.';
    const link=r.querySelector('.ve-motion-side a');if(link)link.href='/collection/viral-right-now/';
  }

  function apply(){
    if(!root())return false;
    injectStyle();cleanLegacy();simplifyHeader();curateHero();curateCommunity();curateMoments();
    return true;
  }

  let n=0;const tick=()=>{n++;if(apply()||n>=24)return;setTimeout(tick,n<8?180:500)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  addEventListener('pageshow',()=>setTimeout(apply,30));
})();