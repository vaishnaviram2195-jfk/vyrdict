(()=>{
  if(window.__vyrdictConversionOptimizationV1)return;
  window.__vyrdictConversionOptimizationV1=1;

  const STYLE_ID='vyrdict-conversion-optimization-style-v1';
  const HERO_ID='vyrdict-product-conversion-cta';
  const BUY_NOTE='vyrdict-buy-priority-note';
  const onProduct=()=>/^\/product\/[^/]+\/?$/i.test(location.pathname||'');
  const onHome=()=>location.pathname==='/'||location.pathname==='';

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #${HERO_ID}{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:18px 0 14px}
      #${HERO_ID} .vyrdict-conversion-button{appearance:none;border:1px solid #171511;border-radius:999px;background:#171511;color:#fff;padding:13px 17px;font:950 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.065em;text-transform:uppercase;cursor:pointer;white-space:nowrap;box-shadow:none}
      #${HERO_ID} .vyrdict-conversion-button:hover{opacity:.88}
      #${HERO_ID} .vyrdict-conversion-button:focus-visible{outline:3px solid rgba(230,95,114,.28);outline-offset:3px}
      #${HERO_ID} .vyrdict-conversion-copy{font:11px/1.45 Arial,Helvetica,sans-serif;color:#746c64;max-width:250px}
      #where-to-buy.vyrdict-buy-priority{scroll-margin-top:22px}
      #where-to-buy.vyrdict-buy-priority .vyrdict-buy-priority-note{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:0 0 12px;padding:9px 11px;border:1px solid rgba(23,21,17,.12);border-radius:14px;background:#f8f3ed;color:#6d675f;font:800 9px/1.35 Arial,Helvetica,sans-serif;letter-spacing:.035em}
      #where-to-buy.vyrdict-buy-priority .vyrdict-buy-priority-note b{color:#171511;text-transform:uppercase;letter-spacing:.07em;font-weight:950}
      #where-to-buy.vyrdict-buy-priority .retailer{min-height:42px}
      @media(max-width:700px){#${HERO_ID}{align-items:stretch;gap:8px;margin-top:16px}#${HERO_ID} .vyrdict-conversion-button{width:100%;min-height:45px}#${HERO_ID} .vyrdict-conversion-copy{max-width:none;width:100%;font-size:10px}}
    `;document.head.appendChild(s)
  }

  function send(name,extra={}){try{window.VyrdictAnalytics?.send?.(name,extra)}catch{}}

  function buyBlock(){return document.getElementById('where-to-buy')}

  function prioritizeBuy(){
    if(!onProduct())return false;
    const buy=buyBlock();if(!buy)return false;
    style();buy.classList.add('vyrdict-buy-priority');
    if(!buy.querySelector('.'+BUY_NOTE)){
      const note=document.createElement('div');note.className=BUY_NOTE;
      note.innerHTML='<b>Retailer options</b><span>Verified links by market. Paid links are labeled.</span>';
      const first=buy.querySelector('.geo-tools,.market-summary,.vyrdict-market-links-v2,.retailers')||buy.firstElementChild;
      if(first)first.insertAdjacentElement('beforebegin',note);else buy.appendChild(note);
    }
    return true;
  }

  function heroHost(){
    return document.querySelector('.productHero .info')||document.querySelector('.productHero')||document.querySelector('.seo .hero > div:last-child');
  }

  function heroCTA(){
    if(!onProduct())return false;
    const buy=buyBlock(),host=heroHost();if(!buy||!host)return false;
    style();
    let box=document.getElementById(HERO_ID);
    if(box&&host.contains(box))return true;
    box?.remove();box=document.createElement('div');box.id=HERO_ID;
    const btn=document.createElement('button');btn.type='button';btn.className='vyrdict-conversion-button';btn.textContent='See where to buy';btn.setAttribute('aria-label','See verified retailer options');
    const copy=document.createElement('span');copy.className='vyrdict-conversion-copy';copy.textContent='Jump to current retailer options for Canada and the U.S.';
    btn.addEventListener('click',()=>{send('retailer_cta_open',{source:'product_hero'});buy.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});setTimeout(()=>buy.querySelector('a.retailer,a[href^="https://"]')?.focus?.({preventScroll:true}),480)});
    box.append(btn,copy);
    const scores=host.querySelector('.scores,.scoreRow,[data-vyrdict-scores]');
    const summary=host.querySelector('.summary,.lead,.description,p');
    if(scores)scores.insertAdjacentElement('afterend',box);else if(summary)summary.insertAdjacentElement('beforebegin',box);else host.appendChild(box);
    return true;
  }

  function makeRetailerLinksMeasurable(){
    if(!onProduct())return;
    const buy=buyBlock();if(!buy)return;
    buy.querySelectorAll('.vyrdict-market-links-v2 .vyrdict-market-list a:not(.vyrdict-market-search)').forEach(a=>{
      a.classList.add('retailer');
      const market=a.closest('.vyrdict-market');
      const label=(market?.querySelector('.vyrdict-market-label')?.textContent||'').toLowerCase();
      if(!a.dataset.country)a.dataset.country=label.includes('canada')?'CA':label.includes('united states')?'US':'GLOBAL';
    });
  }

  function productApply(){if(!onProduct())return false;const a=prioritizeBuy(),b=heroCTA();makeRetailerLinksMeasurable();return a||b}

  function homeApply(){
    if(!onHome())return false;
    document.querySelectorAll('[data-product]').forEach(el=>{
      if(el.querySelector('img')||el.matches('a,button')){
        el.style.cursor='pointer';
        if(!el.getAttribute('aria-label')){
          const h=el.querySelector('h2,h3,h4,h5');
          if(h?.textContent?.trim())el.setAttribute('aria-label',`Open VYRDICT for ${h.textContent.trim()}`);
        }
      }
    });
    return true;
  }

  function apply(){return onProduct()?productApply():onHome()?homeApply():false}
  function schedule(){[0,80,220,600,1200].forEach(ms=>setTimeout(apply,ms))}
  const observe=()=>{const app=document.getElementById('app')||document.body;if(!app)return;new MutationObserver(()=>{clearTimeout(window.__vyrdictConversionTimer);window.__vyrdictConversionTimer=setTimeout(apply,70)}).observe(app,{childList:true,subtree:true})};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{schedule();observe()},{once:true});else{schedule();observe()}
  addEventListener('pageshow',schedule);addEventListener('popstate',schedule);addEventListener('hashchange',schedule);
})();
