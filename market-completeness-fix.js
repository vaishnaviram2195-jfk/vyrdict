(()=>{
  if(window.__vyrdictMarketCompletenessV2)return;
  window.__vyrdictMarketCompletenessV2=1;
  const isProduct=()=>/^\/product\//i.test(location.pathname);
  const region=()=>{
    const active=document.querySelector('.geo-choice.on[data-geo]')?.dataset?.geo;
    if(active==='CA'||active==='US')return active;
    const saved=localStorage.getItem('vyrdict:country');
    return saved==='US'?'US':'CA';
  };
  const marketName=()=>region()==='CA'?'Canada':'United States';
  const slug=()=>{const m=decodeURIComponent(location.pathname||'').match(/^\/product\/([^/?#]+)/i);return m?m[1]:''};
  const baseProduct=()=>window.__VYRDICT_BOOT_DATA?.p?.find?.(x=>x.slug===slug())||null;
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const validHttp=a=>{try{const u=new URL(a.href,location.href);return /^https?:$/.test(u.protocol)}catch{return false}};
  function familyMatch(path){
    const p=baseProduct(),tail=norm(path),tokens=norm(p?.name).split(' ').filter(x=>x.length>=3&&!['the','and','for','with'].includes(x));
    if(!tokens.length)return false;
    const hits=tokens.filter(t=>tail.includes(t)).length;
    return hits>=Math.min(2,tokens.length);
  }
  const exactish=a=>{try{
    const u=new URL(a.href,location.href),p=u.pathname.toLowerCase();
    if(!/^https?:$/.test(u.protocol)||p==='/'||p==='')return false;
    if(/\/search\/?$/.test(p)||u.searchParams.has('q')&&/search/i.test(p)||p.includes('/brand/')||p.includes('/buy/'))return false;
    if(p.includes('/collections/')&&!p.includes('/products/')&&!familyMatch(p))return false;
    if(/\/(collections?|category|categories)\/?$/.test(p))return false;
    return true;
  }catch{return false}};
  function scoreNumber(){const n=Number(baseProduct()?.worth_score);return Number.isFinite(n)?Math.round(n):null}
  function cleanSummary(block){
    const box=block.querySelector('.market-summary');if(!box)return;
    const strong=box.querySelector('strong'),em=box.querySelector('em'),worth=scoreNumber();
    if(strong&&worth!=null&&/(pending|verification|no verified listing)/i.test(strong.textContent||'')){
      strong.textContent='Worth '+worth;
      box.classList.remove('pending','unavailable');
    }
    if(em)em.textContent='Worth reflects VYRDICT’s evidence-backed score. Local price and retailer availability are shown only when they are verified for this market.';
  }
  function cleanLinks(block){
    const list=block.querySelector('.retailers');if(!list)return;
    const r=region(),links=[...list.querySelectorAll('a.retailer')].filter(validHttp);
    const local=links.filter(a=>(a.dataset.country===r||a.dataset.country==='GLOBAL')&&exactish(a));
    links.forEach(a=>a.style.display='none');
    let shown=local,fallback=false;
    if(!shown.length){const other=links.filter(exactish)[0];shown=other?[other]:[];fallback=!!other}
    shown.forEach(a=>{
      a.style.display='flex';
      if(fallback){
        a.classList.add('vyrdict-market-fallback-link');
        let badge=a.querySelector('.geo-badge');
        if(!badge){badge=document.createElement('small');badge.className='geo-badge';a.querySelector('span')?.appendChild(badge)}
        if(badge)badge.textContent='EXACT PRODUCT';
      }
    });
    const note=block.querySelector('.geo-note');
    if(note){
      if(local.length)note.textContent='Showing verified '+marketName()+' exact-product shopping options.';
      else if(fallback)note.textContent='No verified '+marketName()+' retailer yet — showing the exact product page from another verified market. Shipping and availability may vary.';
      else note.textContent='No verified exact-product listing is currently available for '+marketName()+'. VYRDICT will not send you to a generic or mismatched product page.';
    }
  }
  function cleanVerdict(){
    const worth=scoreNumber();if(worth==null)return;
    const ring=[...document.querySelectorAll('.productHero .ring')].find(x=>/worth score/i.test(x.textContent||''));
    const b=ring?.querySelector('b');if(b&&!/^\d{1,3}$/.test((b.textContent||'').trim()))b.textContent=String(worth);
  }
  function apply(){if(!isProduct())return;const block=document.getElementById('where-to-buy');if(!block)return;cleanSummary(block);cleanLinks(block);cleanVerdict()}
  function schedule(){[0,100,350,800,1600].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('pageshow',schedule);addEventListener('popstate',schedule);addEventListener('hashchange',schedule);
  document.addEventListener('click',e=>{if(e.target.closest?.('.geo-choice,[data-geo]'))setTimeout(apply,30)},true);
  const observe=()=>{const app=document.getElementById('app');if(app)new MutationObserver(()=>setTimeout(apply,60)).observe(app,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();