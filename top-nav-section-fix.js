(()=>{
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const HEADER_OFFSET=92;

  function candidates(){
    return [...document.querySelectorAll('h1,h2,h3,h4,p,span,div')].filter(el=>{
      const t=norm(el.textContent);
      if(!t||t.length>120)return false;
      if(el.childElementCount>4)return false;
      const r=el.getBoundingClientRect();
      return r.width>0&&r.height>0;
    });
  }

  function findTarget(kind){
    const els=candidates();
    if(kind==='categories'){
      return els.find(el=>norm(el.textContent)==='browse by category')
        || els.find(el=>norm(el.textContent).includes('browse by category'))
        || document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category');
    }
    if(kind==='culture'){
      return els.find(el=>norm(el.textContent)==='you saw it then everyone bought it')
        || els.find(el=>norm(el.textContent).includes('culture commerce'))
        || els.find(el=>norm(el.textContent).includes('you saw it then everyone bought it'))
        || document.querySelector('[data-section="culture"],#culture,.culture-section');
    }
    return null;
  }

  function scrollToKind(kind,attempt=0){
    const target=findTarget(kind);
    if(!target){
      if(attempt<12)setTimeout(()=>scrollToKind(kind,attempt+1),120);
      return false;
    }
    const y=Math.max(0,target.getBoundingClientRect().top+window.scrollY-HEADER_OFFSET);
    window.scrollTo({top:y,behavior:'smooth'});
    if(location.hash==='#'+kind){
      try{history.replaceState(history.state,'',location.pathname+location.search)}catch{}
    }
    return true;
  }

  function kindFrom(el){
    const t=norm(el?.textContent);
    if(t==='categories')return 'categories';
    if(t==='culture')return 'culture';
    return null;
  }

  document.addEventListener('click',e=>{
    const el=e.target.closest('a,button');
    if(!el)return;
    const kind=kindFrom(el);
    if(!kind)return;
    const r=el.getBoundingClientRect();
    if(r.top>170)return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if(location.pathname!=='/'&&location.pathname!==''){
      location.assign('/#'+kind);
      return;
    }
    scrollToKind(kind);
  },true);

  function handleInitial(){
    const h=(location.hash||'').toLowerCase();
    if(h==='#categories')scrollToKind('categories');
    if(h==='#culture')scrollToKind('culture');
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(handleInitial,80),{once:true});
  else setTimeout(handleInitial,80);
  addEventListener('hashchange',()=>setTimeout(handleInitial,40));
})();

(()=>{
  if(window.__vyrdictDiscoveryCardsReliable)return;
  window.__vyrdictDiscoveryCardsReliable=1;
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-discovery-cards-reliable-style';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body.vyrdict-home-calm .v-home-discovery-card,
      body .v-home-discovery-card{box-sizing:border-box;display:flex!important;flex-direction:column;justify-content:space-between;align-self:stretch;overflow:hidden;border:1px solid rgba(23,21,17,.14);border-radius:28px;background:#fffdf8;color:#171511;padding:28px;box-shadow:none;min-width:250px;cursor:pointer;text-decoration:none;transition:transform .16s ease,border-color .16s ease}
      body .v-home-discovery-card:hover{transform:translateY(-2px);border-color:rgba(23,21,17,.34)}
      body .v-home-discovery-top{display:flex;align-items:center;gap:8px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6d675f}
      body .v-home-discovery-dot{width:7px;height:7px;background:#d94d73;border-radius:2px;flex:0 0 auto}
      body .v-home-discovery-copy{display:block;margin:auto 0;padding:28px 0;text-align:left}
      body .v-home-discovery-card h3{font:700 clamp(27px,3vw,38px)/1 Georgia,serif;letter-spacing:-.035em;margin:0 0 12px;color:#171511;text-align:left}
      body .v-home-discovery-card p{font:12px/1.55 Arial,Helvetica,sans-serif;color:#6d675f;margin:0;max-width:230px;text-align:left}
      body .v-home-discovery-action{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #d8cec4;padding-top:16px;font:950 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#171511}
      body .v-home-discovery-arrow{font-size:17px;line-height:1;font-weight:400}
      body .v-home-collapse{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      @media(max-width:700px){body .v-home-discovery-card{padding:22px;border-radius:24px}body .v-home-discovery-copy{padding:22px 0}body .v-home-discovery-card h3{font-size:28px}}
    `;
    document.head.appendChild(s);
  }

  function sectionByHeading(needle){
    const n=norm(needle);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes(n));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function setup(section,cfg){
    if(!section)return false;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return false;
    section.querySelectorAll('.v-home-rail-more').forEach(x=>x.remove());
    let card=rail.querySelector('.v-home-discovery-card');
    const items=[...rail.children].filter(el=>!el.matches('script,style,.v-home-discovery-card'));
    if(items.length<3)return false;
    items.forEach((el,i)=>{el.hidden=i>=3});
    if(!card){
      card=document.createElement('button');
      card.type='button';
      card.className='v-home-discovery-card';
      card.innerHTML=`<span class="v-home-discovery-top"><span class="v-home-discovery-dot"></span>${cfg.kicker}</span><span class="v-home-discovery-copy"><h3>${cfg.title}</h3><p>${cfg.copy}</p></span><span class="v-home-discovery-action"><span>${cfg.action}</span><span class="v-home-discovery-arrow">→</span></span>`;
      rail.appendChild(card);
      card.addEventListener('click',()=>{
        items.forEach(el=>el.hidden=false);
        card.hidden=true;
        let collapse=section.querySelector('.v-home-collapse');
        if(!collapse){
          collapse=document.createElement('button');
          collapse.type='button';
          collapse.className='v-home-collapse';
          collapse.textContent='Show less';
          collapse.addEventListener('click',()=>{
            items.forEach((el,i)=>{el.hidden=i>=3});
            collapse.remove();
            card.hidden=false;
          });
          rail.insertAdjacentElement('afterend',collapse);
        }
      });
    }
    requestAnimationFrame(()=>{
      const first=items[0],r=first?.getBoundingClientRect();
      if(!r)return;
      if(r.width>0){card.style.flex=`0 0 ${Math.round(r.width)}px`;card.style.width=`${Math.round(r.width)}px`}
      if(r.height>0)card.style.minHeight=`${Math.round(r.height)}px`;
    });
    return true;
  }

  function apply(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    addStyle();
    setup(sectionByHeading('actually worth the hype'),{kicker:'The good list',title:'More worth-it finds',copy:'See more products where the value keeps up with the hype.',action:'See all worth it'});
    setup(document.getElementById('skip-list')||sectionByHeading('the skip list'),{kicker:'Keep scrolling',title:'More hype to skip',copy:'See what else is getting attention without earning the spend.',action:'See all skips'});
  }

  function schedule(){[0,100,300,700,1200,2200,3500].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictDiscoveryResize);window.__vyrdictDiscoveryResize=setTimeout(apply,120)});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictDiscoveryMutation);window.__vyrdictDiscoveryMutation=setTimeout(apply,100)}).observe(document.documentElement,{childList:true,subtree:true});
})();
