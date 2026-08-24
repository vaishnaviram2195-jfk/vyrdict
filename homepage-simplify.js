(()=>{
  if(window.__vyrdictHomeSimplifyV11)return;
  window.__vyrdictHomeSimplifyV11=1;

  const STYLE_ID='vyrdict-home-simplify-style';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  let mutationTimer=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
body.vyrdict-home-calm .hero{padding-top:34px!important;padding-bottom:34px!important}
body.vyrdict-home-calm .hero h1{max-width:760px!important;margin-left:auto!important;margin-right:auto!important}
body.vyrdict-home-calm .hero p{max-width:650px!important;margin-left:auto!important;margin-right:auto!important}
body.vyrdict-home-calm .stage{min-height:360px!important}
body.vyrdict-home-calm .stage .p4,body.vyrdict-home-calm .stage .p5,body.vyrdict-home-calm .stage .p6{display:none!important}
body.vyrdict-home-calm .stage .sticker.eyes,body.vyrdict-home-calm .stage .sticker.flag{display:none!important}
body.vyrdict-home-calm .stage .blob.b2,body.vyrdict-home-calm .stage .blob.b3{display:none!important}
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
body.vyrdict-home-calm .v-home-category-details{flex:1 0 100%;margin:2px 0 0;padding:0;border:0}
body.vyrdict-home-calm .v-home-category-details>summary{list-style:none;width:max-content;appearance:none;display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;border:1px solid rgba(23,21,17,.18);background:#fffdf8;color:#171511;border-radius:999px;padding:13px 19px;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.065em;text-transform:uppercase;cursor:pointer;white-space:nowrap;min-height:42px;user-select:none}
body.vyrdict-home-calm .v-home-category-details>summary::-webkit-details-marker{display:none}
body.vyrdict-home-calm .v-home-category-details>summary:hover{border-color:rgba(23,21,17,.38)}
body.vyrdict-home-calm .v-home-category-extra{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
body.vyrdict-home-calm [data-category]{transition:opacity .15s ease}
@media(max-width:700px){body.vyrdict-home-calm .hero{padding-top:24px!important;padding-bottom:24px!important}body.vyrdict-home-calm .stage{min-height:300px!important}body.vyrdict-home-calm .stage .p1{width:54%!important;height:48%!important;left:7%!important;top:24%!important}body.vyrdict-home-calm .stage .p2{width:34%!important;height:31%!important;right:4%!important;top:48%!important}body.vyrdict-home-calm .stage .p3{width:29%!important;height:25%!important;right:8%!important;top:10%!important}body.vyrdict-home-calm .stage .sticker.spark{font-size:20px!important}body.vyrdict-home-calm .category{font-size:11px!important;padding:12px 15px!important;letter-spacing:.065em!important}body.vyrdict-home-calm .v-home-category-details>summary{font-size:9px;padding:12px 15px;min-height:40px}body.vyrdict-home-calm .section{padding-top:54px!important;padding-bottom:54px!important}body.vyrdict-home-calm .section .head{margin-bottom:20px!important}body.vyrdict-home-calm .v-home-rail-more{margin-top:17px!important}}
`;
    document.head.appendChild(s);
  }

  function sectionByText(text){
    const wanted=norm(text);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes(wanted));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function categorySection(){return document.getElementById('categories')||sectionByText('browse by category')||null}

  function ensureMore(section,rail,items,limit,label='See all'){
    if(!section||!rail||items.length<=limit)return;
    const expanded=section.dataset.vHomeExpanded==='1';
    items.forEach((el,i)=>{el.hidden=i>=limit&&!expanded});
    let btn=section.querySelector('.v-home-rail-more');
    if(!btn){btn=document.createElement('button');btn.type='button';btn.className='v-home-more v-home-rail-more'}
    btn.onclick=()=>{const live=[...rail.children].filter(el=>!el.matches('script,style,.v-home-more,.vyrdict-featured-cta'));const on=section.dataset.vHomeExpanded!=='1';section.dataset.vHomeExpanded=on?'1':'0';live.forEach((el,i)=>{el.hidden=i>=limit&&!on});btn.textContent=on?'Show less':label};
    if(btn.previousElementSibling!==rail)rail.insertAdjacentElement('afterend',btn);
    btn.textContent=expanded?'Show less':label;
  }

  function limitRail(section,limit=6,label='See all'){
    if(!section)return;const rail=section.querySelector('.rail,[data-rail]');if(!rail)return;const items=[...rail.children].filter(el=>!el.matches('script,style,.v-home-more,.vyrdict-featured-cta'));ensureMore(section,rail,items,limit,label)
  }

  function categoryNames(container){
    try{
      if(typeof S!=='undefined'&&Array.isArray(S.p)&&S.p.length){
        return [...new Set(S.p.map(p=>String(p?.category||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
      }
    }catch{}
    return [...new Set([...container.querySelectorAll('[data-category]')].map(el=>String(el.dataset.category||'').trim()).filter(c=>c&&!['see more categories','show fewer categories'].includes(norm(c))))].sort((a,b)=>a.localeCompare(b));
  }

  function categoryIcon(c){
    try{if(typeof E!=='undefined'&&E&&E[c])return E[c]}catch{}
    const fallback={Books:'📚',Kitchen:'🍳'};
    return fallback[c]||'✨';
  }

  function categoryButton(c){
    const b=document.createElement('button');
    b.type='button';
    b.className='category';
    b.dataset.category=c;
    b.textContent=`${categoryIcon(c)} ${c}`;
    return b;
  }

  function rebuildCategories(){
    const section=categorySection();if(!section)return false;
    const container=section.querySelector('.categories');if(!container)return false;
    section.classList.add('v-home-categories');
    const cats=categoryNames(container);if(!cats.length)return false;
    const wasOpen=container.querySelector('.v-home-category-details')?.open===true;
    container.replaceChildren();
    cats.slice(0,6).forEach(c=>container.appendChild(categoryButton(c)));
    if(cats.length>6){
      const details=document.createElement('details');
      details.className='v-home-category-details';
      details.open=wasOpen;
      const summary=document.createElement('summary');
      const extra=document.createElement('div');
      extra.className='v-home-category-extra';
      const sync=()=>{summary.textContent=details.open?'Show fewer categories':'See more categories'};
      cats.slice(6).forEach(c=>extra.appendChild(categoryButton(c)));
      details.append(summary,extra);
      details.addEventListener('toggle',sync);
      sync();
      container.appendChild(details);
    }
    return true;
  }

  function simplifySections(){limitRail(document.getElementById('viral')||sectionByText("what's trending now"),6,'See all trending');limitRail(sectionByText('seen on screen'),4,'See all seen on screen');const culture=document.getElementById('culture')||sectionByText('you saw it then everyone bought it');if(culture&&!norm(culture.textContent).includes('seen on screen'))limitRail(culture,6,'See all')}
  function revealFast(){const app=document.getElementById('app');if(app?.innerHTML?.trim())document.documentElement.classList.add('vyrdict-ready')}
  function apply(){addStyle();const home=isHome();document.body?.classList.toggle('vyrdict-home-calm',home);if(!home){revealFast();return true}if(!document.querySelector('.hero,.stage'))return false;rebuildCategories();simplifySections();revealFast();return true}
  function boot(attempt=0){if(apply()||attempt>=18)return;setTimeout(()=>boot(attempt+1),70)}

  const observer=new MutationObserver(()=>{if(!isHome())return;clearTimeout(mutationTimer);mutationTimer=setTimeout(()=>{rebuildCategories();revealFast()},80)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{boot();observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:false})},{once:true});else{boot();const target=document.getElementById('app')||document.body;if(target)observer.observe(target,{childList:true,subtree:false})}
  addEventListener('popstate',()=>setTimeout(()=>boot(),20));addEventListener('hashchange',()=>setTimeout(()=>boot(),20));
})();
