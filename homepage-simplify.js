(()=>{
  if(window.__vyrdictHomeSimplify)return;
  window.__vyrdictHomeSimplify=1;

  const STYLE_ID='vyrdict-home-simplify-style';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
body.vyrdict-home-calm .hero{padding-top:34px!important;padding-bottom:34px!important}
body.vyrdict-home-calm .hero h1{max-width:760px!important;margin-left:auto!important;margin-right:auto!important}
body.vyrdict-home-calm .hero p{max-width:650px!important;margin-left:auto!important;margin-right:auto!important}
body.vyrdict-home-calm .stage{min-height:360px!important}
body.vyrdict-home-calm .stage .p4,
body.vyrdict-home-calm .stage .p5,
body.vyrdict-home-calm .stage .p6{display:none!important}
body.vyrdict-home-calm .stage .sticker.eyes,
body.vyrdict-home-calm .stage .sticker.flag{display:none!important}
body.vyrdict-home-calm .stage .blob.b2,
body.vyrdict-home-calm .stage .blob.b3{display:none!important}
body.vyrdict-home-calm .stage .p1{width:46%!important;height:48%!important;left:9%!important;top:23%!important;right:auto!important;bottom:auto!important;transform:rotate(-4deg)!important}
body.vyrdict-home-calm .stage .p2{width:31%!important;height:32%!important;right:7%!important;top:43%!important;left:auto!important;bottom:auto!important;transform:rotate(4deg)!important}
body.vyrdict-home-calm .stage .p3{width:26%!important;height:26%!important;right:11%!important;top:9%!important;left:auto!important;bottom:auto!important;transform:rotate(3deg)!important}
body.vyrdict-home-calm .stage .photo{box-shadow:0 10px 26px rgba(46,34,26,.09)!important}
body.vyrdict-home-calm .category{font-size:12px!important;padding:13px 19px!important;color:#6d675f!important;font-weight:800!important;letter-spacing:.075em!important;opacity:.82}
body.vyrdict-home-calm .category:hover{color:#171511!important;opacity:1}
body.vyrdict-home-calm .section{padding-top:72px!important;padding-bottom:72px!important}
body.vyrdict-home-calm .section .head{margin-bottom:24px!important;gap:20px!important}
body.vyrdict-home-calm .section .head p{max-width:520px!important;line-height:1.55!important}
body.vyrdict-home-calm .rail{gap:18px!important;padding-bottom:12px!important}
body.vyrdict-home-calm #skip-list{border-block:0!important;background:#efe6de!important}
body.vyrdict-home-calm .vyrdict-screen-match{display:none!important}
body.vyrdict-home-calm .v-home-more{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
body.vyrdict-home-calm .v-home-more:hover{opacity:.68}
body.vyrdict-home-calm .v-home-rail-more{display:block!important;width:max-content!important;margin:20px 0 0!important}
body.vyrdict-home-calm .v-home-category-more{margin-top:20px}
body.vyrdict-home-calm [data-category]{transition:opacity .15s ease}
body.vyrdict-home-calm .v-home-discovery-card{box-sizing:border-box;display:flex!important;flex-direction:column!important;justify-content:space-between!important;align-self:stretch!important;overflow:hidden!important;border:1px solid rgba(23,21,17,.14)!important;border-radius:28px!important;background:#fffdf8!important;color:#171511!important;padding:28px!important;box-shadow:none!important;min-width:250px;cursor:pointer;text-decoration:none!important;transition:transform .16s ease,border-color .16s ease}
body.vyrdict-home-calm .v-home-discovery-card:hover{transform:translateY(-2px);border-color:rgba(23,21,17,.34)!important}
body.vyrdict-home-calm .v-home-discovery-top{display:flex;align-items:center;gap:8px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6d675f}
body.vyrdict-home-calm .v-home-discovery-dot{width:7px;height:7px;background:#d94d73;border-radius:2px;flex:0 0 auto}
body.vyrdict-home-calm .v-home-discovery-copy{margin:auto 0;padding:28px 0}
body.vyrdict-home-calm .v-home-discovery-card h3{font:700 clamp(28px,3vw,38px)/1 Georgia,serif;letter-spacing:-.035em;margin:0 0 12px;color:#171511}
body.vyrdict-home-calm .v-home-discovery-card p{font:12px/1.55 Arial,Helvetica,sans-serif;color:#6d675f;margin:0;max-width:230px}
body.vyrdict-home-calm .v-home-discovery-action{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #d8cec4;padding-top:16px;font:950 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#171511}
body.vyrdict-home-calm .v-home-discovery-arrow{font-size:17px;line-height:1;font-weight:400}
@media(max-width:700px){
  body.vyrdict-home-calm .hero{padding-top:24px!important;padding-bottom:24px!important}
  body.vyrdict-home-calm .stage{min-height:300px!important}
  body.vyrdict-home-calm .stage .p1{width:54%!important;height:48%!important;left:7%!important;top:24%!important}
  body.vyrdict-home-calm .stage .p2{width:34%!important;height:31%!important;right:4%!important;top:48%!important}
  body.vyrdict-home-calm .stage .p3{width:29%!important;height:25%!important;right:8%!important;top:10%!important}
  body.vyrdict-home-calm .stage .sticker.spark{font-size:20px!important}
  body.vyrdict-home-calm .category{font-size:11px!important;padding:12px 15px!important;letter-spacing:.065em!important}
  body.vyrdict-home-calm .section{padding-top:54px!important;padding-bottom:54px!important}
  body.vyrdict-home-calm .section .head{margin-bottom:20px!important}
  body.vyrdict-home-calm .v-home-rail-more{margin-top:17px!important}
  body.vyrdict-home-calm .v-home-discovery-card{padding:22px!important;border-radius:24px!important}
  body.vyrdict-home-calm .v-home-discovery-copy{padding:22px 0}
  body.vyrdict-home-calm .v-home-discovery-card h3{font-size:28px}
}
`;
    document.head.appendChild(s);
  }

  function sectionByText(text){
    const wanted=norm(text);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes(wanted));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function ensureMore(section,rail,items,limit,label='See all'){
    if(!section||!rail||items.length<=limit)return;
    section.dataset.vHomeLimit=String(limit);
    const expanded=section.dataset.vHomeExpanded==='1';
    items.forEach((el,i)=>{
      if(i<limit){el.hidden=false;return}
      el.dataset.vHomeOverflow='1';
      el.hidden=!expanded;
    });
    let btn=section.querySelector('.v-home-rail-more');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='v-home-more v-home-rail-more';
      btn.addEventListener('click',()=>{
        const on=section.dataset.vHomeExpanded!=='1';
        section.dataset.vHomeExpanded=on?'1':'0';
        items.forEach((el,i)=>{if(i>=limit)el.hidden=!on});
        btn.textContent=on?'Show less':label;
      });
    }
    if(btn.previousElementSibling!==rail)rail.insertAdjacentElement('afterend',btn);
    btn.textContent=expanded?'Show less':label;
  }

  function limitRail(section,limit=6,label='See all'){
    if(!section)return;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return;
    const items=[...rail.children].filter(el=>!el.matches('script,style,.v-home-more,.v-home-discovery-card'));
    ensureMore(section,rail,items,limit,label);
  }

  function ensureDiscoveryCard(section,{limit=3,kicker,title,copy,action}){
    if(!section)return;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return;
    const items=[...rail.children].filter(el=>!el.matches('script,style,.v-home-more,.v-home-discovery-card'));
    if(items.length<=limit)return;
    items.forEach((el,i)=>{el.hidden=i>=limit});
    section.querySelector('.v-home-rail-more')?.remove();
    let card=rail.querySelector('.v-home-discovery-card');
    if(!card){
      card=document.createElement('button');
      card.type='button';
      card.className='v-home-discovery-card';
      card.innerHTML=`<span class="v-home-discovery-top"><span class="v-home-discovery-dot"></span>${kicker}</span><span class="v-home-discovery-copy"><h3>${title}</h3><p>${copy}</p></span><span class="v-home-discovery-action"><span>${action}</span><span class="v-home-discovery-arrow">→</span></span>`;
      card.addEventListener('click',()=>{
        const expanded=section.dataset.vHomeDiscoveryExpanded!=='1';
        section.dataset.vHomeDiscoveryExpanded=expanded?'1':'0';
        items.forEach((el,i)=>{if(i>=limit)el.hidden=!expanded});
        card.hidden=expanded;
        if(expanded){
          let collapse=section.querySelector('.v-home-rail-more');
          if(!collapse){
            collapse=document.createElement('button');
            collapse.type='button';
            collapse.className='v-home-more v-home-rail-more';
            collapse.textContent='Show less';
            collapse.addEventListener('click',()=>{
              section.dataset.vHomeDiscoveryExpanded='0';
              items.forEach((el,i)=>{if(i>=limit)el.hidden=true});
              collapse.remove();
              card.hidden=false;
            });
            rail.insertAdjacentElement('afterend',collapse);
          }
        }
      });
      rail.appendChild(card);
    }
    const first=items[0];
    if(first){
      requestAnimationFrame(()=>{
        const r=first.getBoundingClientRect();
        if(r.width>0){card.style.flex=`0 0 ${Math.round(r.width)}px`;card.style.width=`${Math.round(r.width)}px`}
        if(r.height>0)card.style.minHeight=`${Math.round(r.height)}px`;
      });
    }
  }

  function simplifyCategories(){
    const section=sectionByText('browse by category')||document.querySelector('[data-section="categories"],#browse-by-category,.browse-by-category')?.closest('section');
    if(!section)return;
    section.classList.add('v-home-categories');
    const items=[...section.querySelectorAll('[data-category]')].filter((el,i,a)=>a.indexOf(el)===i);
    if(items.length<=8)return;
    const expanded=section.dataset.vHomeExpanded==='1';
    items.forEach((el,i)=>{el.hidden=i>=8&&!expanded});
    let btn=section.querySelector('.v-home-category-more');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='v-home-more v-home-category-more';
      btn.addEventListener('click',()=>{
        const on=section.dataset.vHomeExpanded!=='1';
        section.dataset.vHomeExpanded=on?'1':'0';
        items.forEach((el,i)=>{el.hidden=i>=8&&!on});
        btn.textContent=on?'Show less':'View all categories';
      });
      (items[0]?.parentElement||section).insertAdjacentElement('afterend',btn);
    }
    btn.textContent=expanded?'Show less':'View all categories';
  }

  function simplifySections(){
    limitRail(document.getElementById('viral')||sectionByText("what's trending now"),6,'See all trending');
    const worth=sectionByText('actually worth the hype')||sectionByText('worth the hype');
    if(worth)ensureDiscoveryCard(worth,{limit:3,kicker:'The good list',title:'More worth-it finds',copy:'See more products where the value keeps up with the hype.',action:'See all worth it'});
    const skips=document.getElementById('skip-list')||sectionByText('the skip list');
    if(skips)ensureDiscoveryCard(skips,{limit:3,kicker:'Keep scrolling',title:'More hype to skip',copy:'See what else is getting attention without earning the spend.',action:'See all skips'});
    limitRail(sectionByText('weekly viral rankings'),6,'See all rankings');
    limitRail(sectionByText('seen on screen'),4,'See all seen on screen');
    const culture=document.getElementById('culture')||sectionByText('you saw it then everyone bought it');
    if(culture&&!norm(culture.textContent).includes('seen on screen'))limitRail(culture,6,'See all');
  }

  function apply(){
    addStyle();
    const home=isHome();
    document.body?.classList.toggle('vyrdict-home-calm',home);
    if(!home)return;
    simplifyCategories();
    simplifySections();
  }

  function schedule(){[0,80,220,500,900,1500,2400].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictHomeResize);window.__vyrdictHomeResize=setTimeout(apply,140)});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictHomeSimplifyTimer);window.__vyrdictHomeSimplifyTimer=setTimeout(apply,100)}).observe(document.documentElement,{childList:true,subtree:true});
})();
