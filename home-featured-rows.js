(()=>{
  if(window.__vyrdictFeaturedRows)return;
  window.__vyrdictFeaturedRows=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-featured-rows-style';
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
      body .vyrdict-featured-collapse{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      @media(max-width:700px){body .vyrdict-featured-cta{padding:22px!important;border-radius:24px!important}body .vyrdict-featured-copy{padding:22px 0}body .vyrdict-featured-cta h3{font-size:28px}}
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

  function clearLegacy(section,rail){
    section.querySelectorAll('.v-home-discovery-card,.v-skip-discovery-card,.v-home-rail-more,.v-home-collapse,.v-skip-collapse,.vyrdict-featured-collapse').forEach(el=>el.remove());
    rail.querySelectorAll('.v-home-discovery-card,.v-skip-discovery-card').forEach(el=>el.remove());
  }

  function render(section,cfg){
    if(!section)return false;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return false;

    clearLegacy(section,rail);
    const items=productItems(rail);
    if(items.length<4)return false;

    const expanded=section.dataset.vyrdictFeaturedExpanded==='1';
    items.forEach((el,i)=>{
      el.hidden=!expanded&&i>=3;
      if(!expanded&&i>=3)el.style.setProperty('display','none','important');
      else el.style.removeProperty('display');
    });

    let cards=[...rail.querySelectorAll('.vyrdict-featured-cta')];
    let card=cards.shift()||null;
    cards.forEach(x=>x.remove());

    if(!card){
      card=document.createElement('button');
      card.type='button';
      card.className='vyrdict-featured-cta';
      card.innerHTML=`<span class="vyrdict-featured-kicker"><span class="vyrdict-featured-dot"></span>${cfg.kicker}</span><span class="vyrdict-featured-copy"><h3>${cfg.title}</h3><p>${cfg.copy}</p></span><span class="vyrdict-featured-action"><span>${cfg.action}</span><span class="vyrdict-featured-arrow">→</span></span>`;
      card.addEventListener('click',()=>{
        section.dataset.vyrdictFeaturedExpanded='1';
        apply();
      });
    }

    if(expanded){
      card.hidden=true;
      if(card.parentElement!==rail)rail.appendChild(card);
      let collapse=section.querySelector('.vyrdict-featured-collapse');
      if(!collapse){
        collapse=document.createElement('button');
        collapse.type='button';
        collapse.className='vyrdict-featured-collapse';
        collapse.textContent='Show less';
        collapse.addEventListener('click',()=>{
          section.dataset.vyrdictFeaturedExpanded='0';
          apply();
        });
        rail.insertAdjacentElement('afterend',collapse);
      }
    }else{
      card.hidden=false;
      section.querySelector('.vyrdict-featured-collapse')?.remove();
      items[2].insertAdjacentElement('afterend',card);
    }

    requestAnimationFrame(()=>{
      const r=items[0]?.getBoundingClientRect();
      if(!r)return;
      if(r.width>0){
        card.style.setProperty('flex',`0 0 ${Math.round(r.width)}px`,'important');
        card.style.setProperty('width',`${Math.round(r.width)}px`,'important');
      }
      if(r.height>0)card.style.setProperty('min-height',`${Math.round(r.height)}px`,'important');
    });
    return true;
  }

  function apply(){
    if(!isHome())return;
    addStyle();
    render(getWorth(),{kicker:'The good list',title:'More worth-it finds',copy:'See more products where the value keeps up with the hype.',action:'See all worth it'});
    render(getSkip(),{kicker:'Keep scrolling',title:'More hype to skip',copy:'See what else is getting attention without earning the spend.',action:'See all skips'});
  }

  function schedule(){[0,80,180,350,700,1200,2200,3500].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictFeaturedResize);window.__vyrdictFeaturedResize=setTimeout(apply,120)});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictFeaturedMutation);window.__vyrdictFeaturedMutation=setTimeout(apply,120)}).observe(document.documentElement,{childList:true,subtree:true});
})();
