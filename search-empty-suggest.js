(()=>{
  if(window.__vyrdictEmptySearchSuggestV2)return;
  window.__vyrdictEmptySearchSuggestV2=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-suggest-product';
  const STYLE_ID='vyrdict-empty-search-suggest-style-v2';
  const CARD_ID='vyrdict-empty-search-suggest';
  let queued=false;

  function ensureStyle(){
    document.getElementById('vyrdict-empty-search-suggest-style')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${CARD_ID}{margin:18px 0 0;max-width:560px;border:1px solid #d8cec4;background:#fffdf8;border-radius:18px;padding:20px;color:#171511;font-family:Arial,Helvetica,sans-serif;box-shadow:0 12px 34px rgba(58,43,32,.06);animation:ves-in .18s ease-out both}
      #${CARD_ID} h3{margin:0 0 7px;font-size:20px;line-height:1.15;letter-spacing:-.025em}
      #${CARD_ID} p{margin:0 0 14px;color:#6d675f;font-size:12px;line-height:1.55}
      #${CARD_ID} .ves-row{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
      #${CARD_ID} input{flex:1 1 230px;min-width:0;border:1px solid #d8cec4;background:#fff;border-radius:999px;padding:12px 14px;font:inherit;font-size:13px;color:#171511;outline:none}
      #${CARD_ID} input:focus{border-color:#8f867e;box-shadow:0 0 0 3px rgba(143,134,126,.12)}
      #${CARD_ID} button{border:0;border-radius:999px;background:#171511;color:#fff;padding:12px 16px;font-size:10px;font-weight:950;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
      #${CARD_ID} button:disabled{opacity:.55;cursor:default}
      #${CARD_ID} .ves-status{margin-top:10px;font-size:11px;line-height:1.45;color:#6d675f}
      #${CARD_ID} .ves-status.ok{color:#49624b}
      #${CARD_ID} .ves-status.err{color:#8b4f43}
      @keyframes ves-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
      @media(max-width:620px){#${CARD_ID}{max-width:none;padding:18px;border-radius:16px}#${CARD_ID} .ves-row{display:block}#${CARD_ID} input{box-sizing:border-box;width:100%}#${CARD_ID} button{width:100%;margin-top:9px}}
      @media(prefers-reduced-motion:reduce){#${CARD_ID}{animation:none}}
    `;
    document.head.appendChild(s);
  }

  const clean=s=>String(s||'').replace(/^['“”\"]+|['“”\"]+$/g,'').trim();
  const norm=s=>String(s||'').toLowerCase().replace(/\s+/g,' ').trim();
  const isSearchPage=()=>/^\/search\/?$/i.test(location.pathname)||/^#\/search(?:[/?]|$)/i.test(location.hash);

  function queryFromPage(){
    const params=new URLSearchParams(location.search);
    const query=params.get('q')||params.get('query')||params.get('search');
    if(query)return clean(query);
    const hash=decodeURIComponent(location.hash||'');
    let m=hash.match(/#\/search\/(.+)$/i);if(m)return clean(m[1]);
    m=hash.match(/[?&](?:q|query|search)=([^&]+)/i);if(m)return clean(m[1]);
    const inputs=[...document.querySelectorAll('input[type="search"],input[placeholder*="search" i],input[aria-label*="search" i]')];
    const visible=inputs.find(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&String(el.value||'').trim()});
    return clean(visible?.value||'');
  }

  function findEmpty(){
    if(!isSearchPage())return null;
    const phrases=[
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
      const r=el.getBoundingClientRect();
      return r.width>0&&r.height>0;
    })||null;
  }

  function refineSavedEmpty(){
    if(!/^\/saved\/?$/i.test(location.pathname))return;
    const el=[...document.querySelectorAll('p,div,span')].find(x=>norm(x.textContent).replace(/[.!?]+$/,'')==='no verified products here yet');
    if(el)el.textContent='Nothing saved yet. Tap ♡ on a product to add it to your shortlist.';
  }

  function mount(){
    queued=false;
    ensureStyle();
    if(!isSearchPage()){
      document.getElementById(CARD_ID)?.remove();
      refineSavedEmpty();
      return false;
    }

    const empty=findEmpty();
    const existing=document.getElementById(CARD_ID);
    if(!empty){existing?.remove();return false;}

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
    card.innerHTML=`<h3>Can’t find a product?</h3><p>Suggest it to VYRDICT and we’ll put it in the research queue for review.</p><div class="ves-row"><input maxlength="160" aria-label="Product to suggest" placeholder="Product name"><button type="button" data-vyrdict-suggest>Suggest this product</button></div><div class="ves-status" role="status" aria-live="polite"></div>`;
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
    [40,120,280].forEach(ms=>setTimeout(mount,ms));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('hashchange',schedule);
  addEventListener('popstate',schedule);
  document.addEventListener('input',e=>{if(isSearchPage()&&e.target?.matches?.('input[type="search"],input[placeholder*="search" i],input[aria-label*="search" i]'))queueMount()},{passive:true});
  document.addEventListener('click',()=>setTimeout(mount,20),{passive:true});
  new MutationObserver(queueMount).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
