(()=>{
  if(window.__vyrdictProductDetailConsistencyV3)return;
  window.__vyrdictProductDetailConsistencyV3=1;

  const STYLE_ID='vyrdict-product-detail-consistency-style';
  const FACTS_ATTR='data-vyrdict-fallback-facts';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const onProduct=()=>/^\/product\//i.test(location.pathname)||/#\/product\//i.test(decodeURIComponent(location.hash||''));
  const slug=()=>{
    let m=decodeURIComponent(location.pathname||'').match(/^\/product\/([^/?#]+)/i);
    if(m)return m[1];
    m=decodeURIComponent(location.hash||'').match(/#\/product\/([^?#]+)/i);
    return m?m[1]:'';
  };

  function ensureStyle(){
    document.getElementById('vyrdict-product-typography-style')?.remove();
    document.querySelectorAll('.vyrdict-editorial-heading').forEach(el=>el.classList.remove('vyrdict-editorial-heading'));
    let st=document.getElementById(STYLE_ID);
    if(!st){st=document.createElement('style');st.id=STYLE_ID;document.head.appendChild(st)}
    st.textContent=`
.productHero .info > h1{font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(38px,4.1vw,56px)!important;font-weight:400!important;font-style:normal!important;line-height:.96!important;letter-spacing:-.045em!important;margin:12px 0!important}
.story article:first-child > h3.vyrdict-detail-heading{font-family:Georgia,"Times New Roman",serif!important;font-size:29px!important;font-weight:400!important;font-style:normal!important;line-height:1.12!important;letter-spacing:normal!important}
.story article:first-child > p.vyrdict-detail-copy{font-family:Arial,Helvetica,sans-serif!important;font-size:14px!important;line-height:1.65!important;font-weight:400!important;font-style:normal!important;color:#4e4740!important}
.story article:nth-child(2) > h3{font-family:Georgia,"Times New Roman",serif!important;font-size:29px!important;font-weight:400!important;font-style:normal!important;line-height:1.12!important;letter-spacing:normal!important}
.story .vyrdict-fallback-fact{border-left-color:#e65f72}
img[data-vyrdict-screen-main="1"],.productHero .media img[data-vyrdict-screen-main="1"],[data-vyrdict-screen] img[data-vyrdict-screen-main="1"]{object-fit:contain!important;object-position:center center!important;max-width:100%!important;max-height:100%!important}
@media(max-width:900px){.productHero .info > h1{font-size:clamp(38px,6vw,52px)!important;line-height:.98!important}}
@media(max-width:600px){.productHero .info > h1{font-size:clamp(34px,9vw,42px)!important;line-height:1!important;letter-spacing:-.04em!important}.story article:first-child > h3.vyrdict-detail-heading,.story article:nth-child(2) > h3{font-size:27px!important;line-height:1.12!important}.story article:first-child > p.vyrdict-detail-copy{font-size:14px!important;line-height:1.6!important}}
`;
  }

  function normalizeEditorial(){
    const story=document.querySelector('.story');
    const left=story?.querySelector('article:first-child');
    if(!left)return false;
    [...left.querySelectorAll(':scope > h1,:scope > h2,:scope > h3,:scope > h4')].forEach(h=>{if(norm(h.textContent))h.classList.add('vyrdict-detail-heading')});
    [...left.querySelectorAll(':scope > p')].forEach(p=>p.classList.add('vyrdict-detail-copy'));
    return true;
  }

  function normalizeScreenDetail(){
    const hero=document.querySelector('.productHero');if(!hero)return;
    hero.querySelectorAll('.vyrdict-screen-under-image').forEach(el=>el.remove());
    hero.querySelectorAll('[data-vyrdict-screen-detail]').forEach(box=>{box.style.setProperty('display','none','important');box.setAttribute('aria-hidden','true')});
    hero.querySelectorAll('[data-vyrdict-screen-original-meta="1"]').forEach(el=>{el.style.removeProperty('display');delete el.dataset.vyrdictScreenOriginalMeta});
    hero.style.setProperty('overflow','visible','important');
  }

  function quickFactsContainer(){
    const right=document.querySelector('.story article:nth-child(2)');if(!right)return null;
    const eye=[...right.querySelectorAll('.eyebrow')].find(x=>norm(x.textContent)==='quick facts');if(!eye)return null;
    return {right,buy:right.querySelector('#where-to-buy')};
  }
  function hasRealFacts(right,buy){
    let n=right.querySelector('.eyebrow')?.nextElementSibling;
    while(n&&n!==buy){if(n.matches('.evidence')&&!n.hasAttribute(FACTS_ATTR)&&String(n.textContent||'').trim())return true;n=n.nextElementSibling}
    return false;
  }
  function renderFallbackFacts(container,data){
    const {right,buy}=container;if(!buy)return;
    if(hasRealFacts(right,buy)){right.querySelectorAll(`[${FACTS_ATTR}]`).forEach(x=>x.remove());return}
    right.querySelectorAll(`[${FACTS_ATTR}]`).forEach(x=>x.remove());
    const facts=[['Consumer signal',data.consumer_score],['Value signal',data.value_score],['Hype risk',data.hype_risk],['Momentum',data.momentum_score]].filter(([,v])=>v!==null&&v!==undefined&&v!=='');
    for(const [label,value] of facts){const row=document.createElement('div');row.className='evidence vyrdict-fallback-fact';row.setAttribute(FACTS_ATTR,'1');row.innerHTML=`<b>${label}</b> — ${Math.round(Number(value))}/100`;buy.before(row)}
  }

  let factsRequest='';
  async function ensureQuickFacts(){
    if(!onProduct())return;
    const container=quickFactsContainer();if(!container)return;
    if(hasRealFacts(container.right,container.buy)){container.right.querySelectorAll(`[${FACTS_ATTR}]`).forEach(x=>x.remove());return}
    const s=slug();if(!s||factsRequest===s)return;factsRequest=s;
    try{let rows=[];if(typeof api==='function')rows=await api(`products?select=consumer_score,value_score,hype_risk,momentum_score&slug=eq.${encodeURIComponent(s)}&limit=1`);if(slug()!==s)return;const data=rows?.[0];if(data)renderFallbackFacts(container,data)}catch{}finally{if(slug()!==s)factsRequest=''}
  }

  function apply(){if(!onProduct())return;ensureStyle();normalizeEditorial();normalizeScreenDetail();ensureQuickFacts()}
  function schedule(){[0,120,600,1300].forEach(ms=>setTimeout(apply,ms))}
  function routeSchedule(){factsRequest='';schedule()}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',routeSchedule);
  addEventListener('hashchange',routeSchedule);
  const observe=()=>{const app=document.getElementById('app');if(app)new MutationObserver(()=>{clearTimeout(window.__vyrdictDetailConsistencyTimer);window.__vyrdictDetailConsistencyTimer=setTimeout(apply,60)}).observe(app,{childList:true,subtree:false})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();
