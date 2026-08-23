(()=>{
  if(window.__vyrdictFeaturedRowsV2)return;
  window.__vyrdictFeaturedRowsV2=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-featured-rows-v2-style';
  const isHome=()=>location.pathname==='/'||location.pathname==='';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body .vyrdict-featured-cta{box-sizing:border-box;display:flex!important;flex-direction:column!important;justify-content:space-between!important;align-self:stretch!important;overflow:hidden!important;border:1px solid rgba(23,21,17,.14)!important;border-radius:28px!important;background:#fffdf8!important;color:#171511!important;padding:28px!important;box-shadow:none!important;min-width:250px!important;cursor:pointer!important;text-decoration:none!important;visibility:visible!important;opacity:1!important;transition:transform .16s ease,border-color .16s ease!important}
      body .vyrdict-featured-cta:hover{transform:translateY(-2px);border-color:rgba(23,21,17,.34)!important}
      body .vyrdict-featured-kicker{display:flex;align-items:center;gap:8px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6d675f;text-align:left}
      body .vyrdict-featured-dot{width:7px;height:7px;background:#d94d73;border-radius:2px;flex:0 0 auto}
      body .vyrdict-featured-copy{display:block;margin:auto 0;padding:28px 0;text-align:left}
      body .vyrdict-featured-cta h3{font:700 clamp(27px,3vw,38px)/1 Georgia,serif;letter-spacing:-.035em;margin:0 0 12px;color:#171511;text-align:left}
      body .vyrdict-featured-cta p{font:12px/1.55 Arial,Helvetica,sans-serif;color:#6d675f;margin:0;max-width:230px;text-align:left}
      body .vyrdict-featured-action{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #d8cec4;padding-top:16px;font:950 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#171511;text-align:left}
      body .vyrdict-featured-arrow{font-size:17px;line-height:1;font-weight:400}
      body .vyrdict-featured-section .v-home-rail-more.v-home-more{display:none!important}
      body .vyrdict-featured-extra-row{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;align-items:stretch!important;margin-top:18px!important;overflow:visible!important}
      body .vyrdict-featured-extra-row[hidden]{display:none!important}
      body .vyrdict-featured-extra-row>*{min-width:0!important;width:auto!important;max-width:none!important;flex:none!important}
      body .vyrdict-featured-collapse-v2{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      @media(max-width:900px){body .vyrdict-featured-extra-row{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:700px){
        body .vyrdict-featured-cta{padding:22px!important;border-radius:24px!important}
        body .vyrdict-featured-copy{padding:22px 0}
        body .vyrdict-featured-cta h3{font-size:28px}
        body .vyrdict-featured-extra-row{display:flex!important;overflow-x:auto!important;gap:14px!important;scroll-snap-type:x proximity;padding-bottom:10px!important}
        body .vyrdict-featured-extra-row[hidden]{display:none!important}
        body .vyrdict-featured-extra-row>*{flex:0 0 82%!important;width:82%!important;min-width:250px!important;scroll-snap-align:start}
      }
    `;
    document.head.appendChild(s);
  }

  function sectionByHeading(text){
    const wanted=norm(text);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes(wanted));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function getWorth(){
    return sectionByHeading('actually worth the hype')||sectionByHeading('worth the hype');
  }

  function getSkip(){
    return document.getElementById('skip-list')||document.querySelector('section.skiplist,.section.skiplist')||sectionByHeading('skip it')||sectionByHeading('the skip list');
  }

  function productItems(rail){
    return [...rail.children].filter(el=>!el.matches('script,style,.vyrdict-featured-cta,.v-home-discovery-card,.v-skip-discovery-card'));
  }

  function removeLegacy(section,rail){
    section.querySelectorAll('.v-home-discovery-card,.v-skip-discovery-card,.v-home-collapse,.v-skip-collapse,.vyrdict-featured-collapse,.v-home-rail-more').forEach(el=>el.remove());
    rail.querySelectorAll('.v-home-discovery-card,.v-skip-discovery-card').forEach(el=>el.remove());
  }

  function setCtaSize(section){
    const rail=section?.querySelector('.rail,[data-rail]');
    const card=rail?.querySelector(':scope > .vyrdict-featured-cta');
    const first=rail?.querySelector(':scope > :not(.vyrdict-featured-cta):not(script):not(style)');
    if(!card||!first)return;
    const r=first.getBoundingClientRect();
    if(r.width>0){
      card.style.setProperty('flex',`0 0 ${Math.round(r.width)}px`,'important');
      card.style.setProperty('width',`${Math.round(r.width)}px`,'important');
    }
    if(r.height>0)card.style.setProperty('min-height',`${Math.round(r.height)}px`,'important');
  }

  function setExpanded(section,on){
    const rail=section.querySelector('.rail,[data-rail]');
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    const cta=rail?.querySelector(':scope > .vyrdict-featured-cta');
    if(!rail||!extra||!cta)return;

    section.dataset.vyrdictFeaturedExpanded=on?'1':'0';
    extra.hidden=!on;
    cta.hidden=on;

    let collapse=section.querySelector('.vyrdict-featured-collapse-v2');
    if(on){
      if(!collapse){
        collapse=document.createElement('button');
        collapse.type='button';
        collapse.className='vyrdict-featured-collapse-v2';
        collapse.textContent='Show less';
        collapse.addEventListener('click',()=>setExpanded(section,false));
        extra.insertAdjacentElement('afterend',collapse);
      }
    }else{
      collapse?.remove();
      requestAnimationFrame(()=>setCtaSize(section));
    }
  }

  function initialize(section,cfg){
    if(!section)return false;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return false;

    section.classList.add('vyrdict-featured-section');
    removeLegacy(section,rail);

    if(section.dataset.vyrdictFeaturedV2==='1'){
      setCtaSize(section);
      return true;
    }

    const items=productItems(rail);
    if(items.length<4)return false;

    const extra=document.createElement('div');
    extra.className='vyrdict-featured-extra-row';
    extra.hidden=true;
    items.slice(3).forEach(el=>{
      el.hidden=false;
      el.style.removeProperty('display');
      extra.appendChild(el);
    });
    rail.insertAdjacentElement('afterend',extra);

    const cta=document.createElement('button');
    cta.type='button';
    cta.className='vyrdict-featured-cta';
    cta.innerHTML=`<span class="vyrdict-featured-kicker"><span class="vyrdict-featured-dot"></span>${cfg.kicker}</span><span class="vyrdict-featured-copy"><h3>${cfg.title}</h3><p>${cfg.copy}</p></span><span class="vyrdict-featured-action"><span>${cfg.action}</span><span class="vyrdict-featured-arrow">→</span></span>`;
    cta.addEventListener('click',()=>setExpanded(section,true));
    rail.appendChild(cta);

    section.dataset.vyrdictFeaturedV2='1';
    section.dataset.vyrdictFeaturedExpanded='0';
    requestAnimationFrame(()=>setCtaSize(section));
    return true;
  }

  function apply(){
    if(!isHome())return true;
    addStyle();
    const worth=initialize(getWorth(),{kicker:'The good list',title:'More worth-it finds',copy:'See more products where the value keeps up with the hype.',action:'See all worth it'});
    const skip=initialize(getSkip(),{kicker:'Keep scrolling',title:'More hype to skip',copy:'See what else is getting attention without earning the spend.',action:'See all skips'});
    return worth&&skip;
  }

  function boot(attempt=0){
    if(apply()||attempt>=12)return;
    setTimeout(()=>boot(attempt+1),180);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>boot());
  addEventListener('hashchange',()=>boot());
  addEventListener('resize',()=>{
    clearTimeout(window.__vyrdictFeaturedResizeV2);
    window.__vyrdictFeaturedResizeV2=setTimeout(()=>{setCtaSize(getWorth());setCtaSize(getSkip())},160);
  });
})();
