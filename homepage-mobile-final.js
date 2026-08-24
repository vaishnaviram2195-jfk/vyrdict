(()=>{
  if(window.__vyrdictMobileFinalV1)return;
  window.__vyrdictMobileFinalV1=1;

  const BLENDBOSS='https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-NA/DB351C-MASTER_01.jpg';
  const BACCARAT='https://www.franciskurkdjian.com/dw/image/v2/BJSB_PRD/on/demandware.static/-/Sites-mfk-master-catalog/default/dwe794c594/BACCARAT_ROUGE_540/FRAGRANCE/3700559608654_BR540_EDP_35ML_1.png?q=85&sfrm=png&sh=500&strip=true&sw=500';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  let timer=0;

  function ensureStyle(){
    if(document.getElementById('vyrdict-mobile-final-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-mobile-final-style';
    s.textContent=`
      body.vyrdict-home-calm .stage .p1 img{transform:none!important;transform-origin:center center!important}
      body.vyrdict-home-calm .stage .p2 img{transform:scale(1.65)!important;transform-origin:center center!important}
      .v-home-category-more{appearance:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;border:1px solid rgba(23,21,17,.18)!important;background:#fffdf8!important;color:#171511!important;border-radius:999px!important;padding:13px 19px!important;font:900 10px/1 Arial,Helvetica,sans-serif!important;letter-spacing:.065em!important;text-transform:uppercase!important;cursor:pointer!important;white-space:nowrap!important;min-height:42px!important}
      @media(max-width:700px){
        body.vyrdict-home-calm .stage .p2 img{transform:scale(1.55)!important}
        .v-home-category-more{font-size:9px!important;padding:12px 15px!important;min-height:40px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function setImage(selector,src,alt,key){
    const img=document.querySelector(selector);
    if(!img)return false;
    img.dataset.vyrdictHeroVariety=key;
    if(img.getAttribute('src')!==src){
      img.src=src;
      img.removeAttribute('srcset');
    }
    img.alt=alt;
    img.loading='eager';
    img.decoding='async';
    return true;
  }

  function fixHero(){
    const one=setImage('.stage .p1 img',BLENDBOSS,'Ninja BlendBOSS','blendboss');
    const two=setImage('.stage .p2 img',BACCARAT,'Maison Francis Kurkdjian Baccarat Rouge 540','baccarat-rouge-540');
    return one&&two;
  }

  function categorySection(){
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes('browse by category'));
    return h?.closest('section')||h?.closest('.section')||document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category')?.closest('section')||null;
  }

  function fixCategories(){
    const section=categorySection();
    if(!section)return false;
    const items=[...section.querySelectorAll('[data-category]')].filter((el,i,a)=>a.indexOf(el)===i);
    if(items.length<=6)return true;
    section.classList.add('v-home-categories');
    const expanded=section.dataset.vHomeExpanded==='1';
    items.forEach((el,i)=>{el.hidden=!expanded&&i>=6});
    let btn=section.querySelector('.v-home-category-more');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='v-home-category-more';
      btn.addEventListener('click',()=>{
        section.dataset.vHomeExpanded=section.dataset.vHomeExpanded==='1'?'0':'1';
        fixCategories();
      });
    }
    btn.textContent=expanded?'Show fewer categories':'See more categories';
    const anchor=expanded?items[items.length-1]:items[5];
    anchor.insertAdjacentElement('afterend',btn);
    return true;
  }

  function apply(){
    if(!isHome())return;
    ensureStyle();
    document.body?.classList.add('vyrdict-home-calm');
    fixHero();
    fixCategories();
  }

  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(apply,40);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('load',apply,{once:true});
  addEventListener('pageshow',apply);
  addEventListener('popstate',apply);
  addEventListener('hashchange',apply);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)apply()});

  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(apply,250);
  setTimeout(apply,800);
  setTimeout(apply,1800);
  setTimeout(apply,3500);
  setTimeout(apply,6500);
})();
