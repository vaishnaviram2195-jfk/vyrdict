(()=>{
  if(window.__vyrdictProductDetailConsistencyV1)return;
  window.__vyrdictProductDetailConsistencyV1=1;

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
    // Remove the temporary typography override from earlier launch QA if an old cached copy is still present.
    document.getElementById('vyrdict-product-typography-style')?.remove();
    document.querySelectorAll('.vyrdict-editorial-heading').forEach(el=>el.classList.remove('vyrdict-editorial-heading'));

    let st=document.getElementById(STYLE_ID);
    if(!st){st=document.createElement('style');st.id=STYLE_ID;document.head.appendChild(st)}
    st.textContent=`
.story article:first-child > h3.vyrdict-detail-heading{
  font-family:Georgia,"Times New Roman",serif!important;
  font-size:29px!important;
  font-weight:400!important;
  font-style:normal!important;
  line-height:1.12!important;
  letter-spacing:normal!important;
}
.story article:first-child > p.vyrdict-detail-copy{
  font-family:Arial,Helvetica,sans-serif!important;
  font-size:14px!important;
  line-height:1.65!important;
  font-weight:400!important;
  font-style:normal!important;
  color:#4e4740!important;
}
.story article:nth-child(2) > h3{
  font-family:Georgia,"Times New Roman",serif;
  font-size:29px;
  font-weight:400;
}
.story .vyrdict-fallback-fact{border-left-color:#e65f72}
@media(max-width:600px){
  .story article:first-child > h3.vyrdict-detail-heading,
  .story article:nth-child(2) > h3{font-size:27px!important;line-height:1.12!important}
  .story article:first-child > p.vyrdict-detail-copy{font-size:14px!important;line-height:1.6!important}
}
`;
  }

  function normalizeEditorial(){
    const story=document.querySelector('.story');
    const left=story?.querySelector('article:first-child');
    if(!left)return false;
    const targets=new Set(['what it does','why it s viral']);
    const heads=[...left.querySelectorAll(':scope > h1,:scope > h2,:scope > h3,:scope > h4')];
    for(const h of heads){
      const t=norm(h.textContent);
      // THE VYRDICT is an eyebrow div. Every direct editorial h3 is part of the same visual hierarchy.
      if(t)h.classList.add('vyrdict-detail-heading');
      if(targets.has(t))h.classList.add('vyrdict-detail-heading');
    }
    [...left.querySelectorAll(':scope > p')].forEach(p=>p.classList.add('vyrdict-detail-copy'));
    return true;
  }

  function quickFactsContainer(){
    const story=document.querySelector('.story');
    const right=story?.querySelector('article:nth-child(2)');
    if(!right)return null;
    const eye=[...right.querySelectorAll('.eyebrow')].find(x=>norm(x.textContent)==='quick facts');
    if(!eye)return null;
    const buy=right.querySelector('#where-to-buy');
    return {right,eye,buy};
  }

  function hasRealFacts(right,buy){
    let n=right.querySelector('.eyebrow')?.nextElementSibling;
    while(n&&n!==buy){
      if(n.matches('.evidence')&&!n.hasAttribute(FACTS_ATTR)&&String(n.textContent||'').trim())return true;
      n=n.nextElementSibling;
    }
    return false;
  }

  function renderFallbackFacts(container,data){
    const {right,buy}=container;
    if(!buy||hasRealFacts(right,buy)){
      right.querySelectorAll(`[${FACTS_ATTR}]`).forEach(x=>x.remove());
      return;
    }
    right.querySelectorAll(`[${FACTS_ATTR}]`).forEach(x=>x.remove());
    const facts=[
      ['Consumer signal',data.consumer_score],
      ['Value signal',data.value_score],
      ['Hype risk',data.hype_risk],
      ['Momentum',data.momentum_score]
    ].filter(([,v])=>v!==null&&v!==undefined&&v!=='');
    for(const [label,value] of facts){
      const row=document.createElement('div');
      row.className='evidence vyrdict-fallback-fact';
      row.setAttribute(FACTS_ATTR,'1');
      row.innerHTML=`<b>${label}</b> — ${Math.round(Number(value))}/100`;
      buy.before(row);
    }
  }

  let factsRequest='';
  async function ensureQuickFacts(){
    if(!onProduct())return;
    const container=quickFactsContainer();
    if(!container)return;
    if(hasRealFacts(container.right,container.buy)){
      container.right.querySelectorAll(`[${FACTS_ATTR}]`).forEach(x=>x.remove());
      return;
    }
    const s=slug();
    if(!s||factsRequest===s)return;
    factsRequest=s;
    try{
      let rows=[];
      if(typeof api==='function'){
        rows=await api(`products?select=consumer_score,value_score,hype_risk,momentum_score&slug=eq.${encodeURIComponent(s)}&limit=1`);
      }
      if(slug()!==s)return;
      const data=rows?.[0];
      if(data)renderFallbackFacts(container,data);
    }catch(e){
      console.warn('VYRDICT quick facts fallback unavailable',e);
    }finally{
      if(slug()!==s)factsRequest='';
    }
  }

  function apply(){
    if(!onProduct())return;
    ensureStyle();
    normalizeEditorial();
    ensureQuickFacts();
  }
  function schedule(){[0,80,220,500,900,1500].forEach(ms=>setTimeout(apply,ms))}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',()=>{factsRequest='';schedule()});
  addEventListener('hashchange',()=>{factsRequest='';schedule()});
  document.addEventListener('click',()=>setTimeout(apply,50),{passive:true});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictDetailConsistencyTimer);window.__vyrdictDetailConsistencyTimer=setTimeout(apply,60)}).observe(document.documentElement,{childList:true,subtree:true});
})();
