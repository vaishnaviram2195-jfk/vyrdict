(()=>{
  if(window.__vyrdictEmptySearchSuggestV3)return;
  window.__vyrdictEmptySearchSuggestV3=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-suggest-product';
  const STYLE_ID='vyrdict-empty-search-suggest-style-v3';
  const CARD_ID='vyrdict-empty-search-suggest-v3';
  let queued=false;

  function visible(el){
    if(!el)return false;
    const r=el.getBoundingClientRect();
    const cs=getComputedStyle(el);
    return r.width>0&&r.height>0&&cs.display!=='none'&&cs.visibility!=='hidden';
  }

  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${CARD_ID}{margin:14px 0 0;padding:16px 0 2px;border-top:1px solid #ece7e1;color:#171511;font-family:Arial,Helvetica,sans-serif;animation:ves3-in .16s ease-out both}
      #${CARD_ID} h3{margin:0 0 6px;font-size:17px;line-height:1.2;letter-spacing:-.02em;font-weight:700}
      #${CARD_ID} p{margin:0 0 12px;color:#6d675f;font-size:12px;line-height:1.5}
      #${CARD_ID} .ves-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      #${CARD_ID} input{box-sizing:border-box;flex:1 1 220px;min-width:0;border:1px solid #d8cec4;background:#fff;border-radius:999px;padding:11px 13px;font:inherit;font-size:13px;color:#171511;outline:none}
      #${CARD_ID} input:focus{border-color:#8f867e;box-shadow:0 0 0 3px rgba(143,134,126,.12)}
      #${CARD_ID} button{border:0;border-radius:999px;background:#171511;color:#fff;padding:11px 15px;font-size:10px;font-weight:800;letter-spacing:.055em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
      #${CARD_ID} button:disabled{opacity:.55;cursor:default}
      #${CARD_ID} .ves-status{margin-top:9px;font-size:11px;line-height:1.45;color:#6d675f}
      #${CARD_ID} .ves-status.ok{color:#49624b}
      #${CARD_ID} .ves-status.err{color:#8b4f43}
      @keyframes ves3-in{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:translateY(0)}}
      @media(max-width:620px){#${CARD_ID} .ves-row{display:block}#${CARD_ID} input{width:100%}#${CARD_ID} button{width:100%;margin-top:8px}}
      @media(prefers-reduced-motion:reduce){#${CARD_ID}{animation:none}}
    `;
    document.head.appendChild(s);
  }

  const clean=s=>String(s||'').replace(/^['“”\"]+|['“”\"]+$/g,'').trim();
  const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
  const isSearchRoute=()=>/^\/search\/?$/i.test(location.pathname)||/^#\/search(?:[/?]|$)/i.test(location.hash);
  const searchSelector='input[type="search"],input[placeholder*="search" i],input[aria-label*="search" i]';

  function findVisibleSearchInput(){
    return [...document.querySelectorAll(searchSelector)].find(el=>visible(el))||null;
  }

  function queryFromPage(){
    const params=new URLSearchParams(location.search);
    const query=params.get('q')||params.get('query')||params.get('search');
    if(query)return clean(query);
    const hash=decodeURIComponent(location.hash||'');
    let m=hash.match(/#\/search\/(.+)$/i);if(m)return clean(m[1]);
    m=hash.match(/[?&](?:q|query|search)=([^&]+)/i);if(m)return clean(m[1]);
    const input=findVisibleSearchInput();
    return clean(input?.value||'');
  }

  function findEmpty(){
    const phrases=[
      'no matching products yet',
      'no verified products here yet',
      'no products found',
      'no product found',
      'no results found',
      'no results',
      'no matches found',
      'nothing found'
    ];
    return [...document.querySelectorAll('p,div,span,h2,h3')].find(el=>{
      if(el.closest('#'+CARD_ID))return false;
      const t=norm(el.textContent).replace(/[.!?]+$/,'');
      if(!phrases.some(p=>t===p||t.startsWith(p+' for ')||t.startsWith(p+':')))return false;
      return visible(el);
    })||null;
  }

  function panelFor(empty,input){
    if(!empty)return null;
    let node=empty.parentElement;
    let best=node;
    for(let i=0;node&&i<7;i++,node=node.parentElement){
      if(input&&node.contains(input))best=node;
      const r=node.getBoundingClientRect();
      if(input&&node.contains(input)&&r.width>=Math.min(innerWidth*.45,420))break;
    }
    return best;
  }

  function dedupeCloseButtons(empty,input){
    const panel=panelFor(empty,input);
    if(!panel)return;
    const xLike=el=>{
      const txt=norm(el.textContent).replace(/\s/g,'');
      const label=norm(el.getAttribute('aria-label')||el.getAttribute('title')||'');
      return ['x','×','✕','✖','close','clear'].includes(txt)||/^(close|clear)( search)?$/.test(label);
    };
    const candidates=[...panel.querySelectorAll('button,[role="button"],a')].filter(el=>visible(el)&&xLike(el)&&el.getBoundingClientRect().width<=64&&el.getBoundingClientRect().height<=64);
    if(candidates.length<2)return;
    const rightmost=[...candidates].sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right)[0];
    const top=rightmost.getBoundingClientRect().top;
    candidates.forEach(el=>{
      if(el===rightmost)return;
      if(Math.abs(el.getBoundingClientRect().top-top)<=70){
        el.dataset.vyrdictHiddenDuplicateClose='1';
        el.style.setProperty('display','none','important');
      }
    });
  }

  function refineSavedEmpty(){
    if(!/^\/saved\/?$/i.test(location.pathname))return;
    const el=[...document.querySelectorAll('p,div,span')].find(x=>norm(x.textContent).replace(/[.!?]+$/,'')==='no verified products here yet');
    if(el)el.textContent='Nothing saved yet. Tap ♡ on a product to add it to your shortlist.';
  }

  function mount(){
    queued=false;
    ensureStyle();

    const empty=findEmpty();
    const searchInput=findVisibleSearchInput();
    const inSearchContext=isSearchRoute()||Boolean(empty&&searchInput);
    const existing=document.getElementById(CARD_ID);

    if(!inSearchContext){
      existing?.remove();
      refineSavedEmpty();
      return false;
    }

    if(!empty){
      existing?.remove();
      return false;
    }

    dedupeCloseButtons(empty,searchInput);
    const q=queryFromPage();

    if(existing){
      const input=existing.querySelector('input');
      if(input&&q&&!input.matches(':focus'))input.value=q;
      if(existing.previousElementSibling!==empty)empty.insertAdjacentElement('afterend',existing);
      return true;
    }

    const card=document.createElement('div');
    card.id=CARD_ID;
    card.setAttribute('aria-live','polite');
    card.innerHTML=`<h3>Can’t find this product?</h3><p>Suggest it to VYRDICT and we’ll add it to the research queue for review.</p><div class="ves-row"><input maxlength="160" aria-label="Product to suggest" placeholder="Product name"><button type="button" data-vyrdict-suggest>Suggest this product</button></div><div class="ves-status" role="status" aria-live="polite"></div>`;
    const input=card.querySelector('input'),btn=card.querySelector('button'),status=card.querySelector('.ves-status');
    input.value=q;

    btn.addEventListener('click',async()=>{
      const name=input.value.trim();
      status.className='ves-status';status.textContent='';
      if(!name){status.classList.add('err');status.textContent='Add the product name first.';input.focus();return;}
      btn.disabled=true;btn.textContent='Sending…';
      try{
        const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({product_name:name,note:'Submitted from a zero-result VYRDICT search.'})});
        const out=await r.json().catch(()=>({}));
        if(!r.ok)throw new Error(out.error||'failed');
        status.classList.add('ok');status.textContent='Got it — it’s now in the VYRDICT research queue.';
        btn.textContent='Suggested ✓';
        window.VyrdictAnalytics?.send?.('suggest_open',{source:'search_zero'});
      }catch{
        status.classList.add('err');status.textContent='We could not submit that right now. Please try again.';
        btn.disabled=false;btn.textContent='Suggest this product';
      }
    });

    empty.insertAdjacentElement('afterend',card);
    return true;
  }

  function queueMount(){
    if(queued)return;
    queued=true;
    queueMicrotask(()=>requestAnimationFrame(mount));
  }

  function schedule(){
    mount();
    [40,120,280,650].forEach(ms=>setTimeout(mount,ms));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('hashchange',schedule);
  addEventListener('popstate',schedule);
  document.addEventListener('input',e=>{if(e.target?.matches?.(searchSelector))queueMount()},{passive:true});
  document.addEventListener('click',()=>setTimeout(mount,20),{passive:true});
  new MutationObserver(queueMount).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
