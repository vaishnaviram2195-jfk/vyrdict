(()=>{
  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-suggest-product';
  const STYLE_ID='vyrdict-empty-search-suggest-style';
  const CARD_ID='vyrdict-empty-search-suggest';
  if(!document.getElementById(STYLE_ID)){
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${CARD_ID}{margin-top:28px;max-width:520px;border:1px solid #d8cec4;background:#fffdf8;border-radius:22px;padding:20px;color:#171511;font-family:Arial,Helvetica,sans-serif}
      #${CARD_ID} h3{margin:0 0 7px;font-size:18px;line-height:1.2;letter-spacing:-.02em}
      #${CARD_ID} p{margin:0 0 14px;color:#6d675f;font-size:12px;line-height:1.55}
      #${CARD_ID} .ves-row{display:flex;gap:9px;align-items:center;flex-wrap:wrap}
      #${CARD_ID} input{flex:1 1 220px;min-width:0;border:1px solid #d8cec4;background:#fff;border-radius:999px;padding:12px 14px;font:inherit;font-size:13px;color:#171511;outline:none}
      #${CARD_ID} input:focus{border-color:#8f867e;box-shadow:0 0 0 3px rgba(143,134,126,.12)}
      #${CARD_ID} button{border:0;border-radius:999px;background:#171511;color:#fff;padding:12px 16px;font-size:10px;font-weight:950;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
      #${CARD_ID} button:disabled{opacity:.55;cursor:default}
      #${CARD_ID} .ves-status{margin-top:10px;font-size:11px;line-height:1.45;color:#6d675f}
      #${CARD_ID} .ves-status.ok{color:#49624b}
      #${CARD_ID} .ves-status.err{color:#8b4f43}
    `;
    document.head.appendChild(s);
  }

  const clean=s=>String(s||'').replace(/^['“”\"]+|['“”\"]+$/g,'').trim();
  function queryFromPage(){
    const h=[...document.querySelectorAll('h1,h2')].find(x=>{
      const r=x.getBoundingClientRect();
      return r.width>0&&r.height>0&&r.top<700;
    });
    if(h){const t=clean(h.textContent);if(t&&t.length<170&&!/verified search/i.test(t))return t;}
    const hash=decodeURIComponent(location.hash||'');
    let m=hash.match(/#\/search\/(.+)$/i);if(m)return clean(m[1]);
    m=hash.match(/[?&](?:q|query|search)=([^&]+)/i);if(m)return clean(m[1]);
    return '';
  }

  function findEmpty(){
    return [...document.querySelectorAll('p,div,span')].find(el=>{
      if(el.closest('#'+CARD_ID))return false;
      const t=(el.textContent||'').trim().toLowerCase();
      if(t!=='no verified products here yet.'&&t!=='no verified products here yet')return false;
      const r=el.getBoundingClientRect();return r.width>0&&r.height>0;
    })||null;
  }

  function removeIfNotEmpty(){
    const card=document.getElementById(CARD_ID);if(card&&!findEmpty())card.remove();
  }

  function mount(){
    const empty=findEmpty();
    if(!empty){removeIfNotEmpty();return false;}
    let card=document.getElementById(CARD_ID);
    const q=queryFromPage();
    if(card){const input=card.querySelector('input');if(input&&q&&!input.matches(':focus'))input.value=q;return true;}
    card=document.createElement('div');
    card.id=CARD_ID;
    card.innerHTML=`<h3>Can’t find it?</h3><p>Suggest the product and VYRDICT will add it to the research queue for review.</p><div class="ves-row"><input maxlength="160" aria-label="Product to suggest" placeholder="Product name"><button type="button" data-vyrdict-suggest>Suggest this product</button></div><div class="ves-status" role="status" aria-live="polite"></div>`;
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

  function schedule(){[0,100,280,650,1200].forEach(ms=>setTimeout(mount,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('hashchange',schedule);addEventListener('popstate',schedule);
  document.addEventListener('click',()=>setTimeout(mount,120),{passive:true});
  new MutationObserver(()=>setTimeout(mount,40)).observe(document.documentElement,{subtree:true,childList:true,characterData:true});
})();
