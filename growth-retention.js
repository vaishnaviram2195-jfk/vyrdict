(()=>{
  if(window.__vyrdictGrowthRetentionV1)return;
  window.__vyrdictGrowthRetentionV1=1;

  const HOME_FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const SUGGEST='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-suggest-product';
  const NEWS='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';
  const STYLE_ID='vyrdict-growth-retention-style';
  const MODULE_ID='vyrdict-growth-retention';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #${MODULE_ID}{width:min(1180px,calc(100% - 40px));margin:34px auto 58px;font-family:Arial,Helvetica,sans-serif;color:#171511}
      #${MODULE_ID} *{box-sizing:border-box}
      #${MODULE_ID} .vgr-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      #${MODULE_ID} .vgr-card{border:1px solid #d8cec4;border-radius:28px;padding:30px;background:#fffdf8;min-height:260px;display:flex;flex-direction:column;justify-content:space-between}
      #${MODULE_ID} .vgr-card.request{background:#efe4dc}
      #${MODULE_ID} .vgr-kicker{font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#6d675f;margin-bottom:18px}
      #${MODULE_ID} h2{font:400 clamp(32px,4vw,48px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;margin:0 0 12px;color:#171511}
      #${MODULE_ID} p{font:12.5px/1.6 Arial,Helvetica,sans-serif;color:#6d675f;margin:0;max-width:47ch}
      #${MODULE_ID} .vgr-form{display:flex;gap:9px;margin-top:24px;align-items:center}
      #${MODULE_ID} input{flex:1;min-width:0;border:1px solid #cfc2b7;background:#fff;border-radius:999px;padding:13px 15px;font:13px/1 Arial,Helvetica,sans-serif;color:#171511;outline:none}
      #${MODULE_ID} input:focus{border-color:#8f867e;box-shadow:0 0 0 3px rgba(143,134,126,.12)}
      #${MODULE_ID} button,#${MODULE_ID} .vgr-link{border:0;border-radius:999px;background:#171511;color:#fff;padding:13px 17px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;text-decoration:none;white-space:nowrap}
      #${MODULE_ID} button:disabled{opacity:.55;cursor:default}
      #${MODULE_ID} .vgr-secondary{display:inline-block;margin-top:12px;color:#171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid #171511;padding-bottom:2px;width:max-content}
      #${MODULE_ID} .vgr-status{min-height:18px;margin-top:10px;font-size:10.5px;line-height:1.45;color:#6d675f}
      #${MODULE_ID} .vgr-status.ok{color:#49624b}#${MODULE_ID} .vgr-status.err{color:#8b4f43}
      #${MODULE_ID} .vgr-consent{margin-top:10px;font-size:9px;line-height:1.45;color:#7b746d}
      #${MODULE_ID} .vgr-hp{position:absolute;left:-9999px;opacity:0;pointer-events:none}
      .vyrdict-live-refreshed{position:relative}
      .vyrdict-live-refreshed .vgr-fresh-badge{display:inline-flex;align-items:center;gap:6px;margin-left:9px;vertical-align:middle;border:1px solid #d8cec4;background:#fffdf8;border-radius:999px;padding:6px 8px;font:950 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#6d675f}
      .vyrdict-live-refreshed .vgr-fresh-badge:before{content:'';width:5px;height:5px;background:#d94d73;border-radius:50%}
      @media(max-width:760px){#${MODULE_ID}{width:min(100% - 28px,1180px);margin:26px auto 44px}#${MODULE_ID} .vgr-grid{grid-template-columns:1fr}#${MODULE_ID} .vgr-card{padding:22px;border-radius:24px;min-height:230px}#${MODULE_ID} .vgr-form{flex-direction:column;align-items:stretch}#${MODULE_ID} button{width:100%}}
    `;document.head.appendChild(s);
  }

  function sectionByText(words){
    const wanted=words.map(norm);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>wanted.some(w=>norm(x.textContent).includes(w)));
    return h?.closest('section')||h?.closest('.section')||null;
  }
  function slugFrom(node){
    const a=node?.matches?.('a[href*="/product/"]')?node:node?.querySelector?.('a[href*="/product/"]');
    const m=decodeURIComponent(a?.getAttribute('href')||'').match(/\/product\/([^/?#]+)/i);return m?.[1]||'';
  }
  function cardsFrom(parent){return parent?[...parent.children].filter(x=>slugFrom(x)):[]}

  function reorderFeatured(section,list,primary=3){
    if(!section||!Array.isArray(list)||!list.length)return false;
    const rail=section.querySelector('.rail,[data-rail]');if(!rail)return false;
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    const all=[...cardsFrom(rail),...cardsFrom(extra)];if(!all.length)return false;
    const rank=new Map(list.map((x,i)=>[x.slug,i]));
    all.sort((a,b)=>(rank.has(slugFrom(a))?rank.get(slugFrom(a)):9999)-(rank.has(slugFrom(b))?rank.get(slugFrom(b)):9999));
    const cta=rail.querySelector(':scope > .vyrdict-featured-cta');
    all.slice(0,primary).forEach(card=>rail.insertBefore(card,cta||null));
    if(extra)all.slice(primary).forEach(card=>extra.appendChild(card));
    section.classList.add('vyrdict-live-refreshed');
    const head=section.querySelector('.head h2,.head h1,h2,h1');
    if(head&&!head.parentElement?.querySelector('.vgr-fresh-badge'))head.insertAdjacentHTML('afterend','<span class="vgr-fresh-badge">live picks</span>');
    return true;
  }

  function reorderViral(section,list){
    if(!section||!Array.isArray(list)||!list.length)return false;
    const rail=section.querySelector('.rail,[data-rail]');if(!rail)return false;
    const cards=cardsFrom(rail);if(!cards.length)return false;
    const rank=new Map(list.map((x,i)=>[x.slug,i]));
    cards.sort((a,b)=>(rank.has(slugFrom(a))?rank.get(slugFrom(a)):9999)-(rank.has(slugFrom(b))?rank.get(slugFrom(b)):9999));
    const controls=[...rail.children].filter(x=>!slugFrom(x));
    cards.forEach((c,i)=>{c.hidden=i>=6;rail.insertBefore(c,controls[0]||null)});
    section.classList.add('vyrdict-live-refreshed');
    const head=section.querySelector('.head h2,.head h1,h2,h1');
    if(head&&!head.parentElement?.querySelector('.vgr-fresh-badge'))head.insertAdjacentHTML('afterend','<span class="vgr-fresh-badge">live picks</span>');
    return true;
  }

  async function refreshHome(){
    if(!isHome())return;
    try{
      const r=await fetch(HOME_FEED,{cache:'no-store'});if(!r.ok)return;
      const d=await r.json();
      reorderViral(sectionByText(["what's trending now",'viral right now']),d.trending);
      reorderFeatured(sectionByText(['actually worth the hype','worth the hype']),d.worth,3);
      reorderFeatured(document.getElementById('skip-list')||sectionByText(['skip it','the skip list']),d.skip,3);
    }catch{}
  }

  function mount(){
    if(!isHome()){document.getElementById(MODULE_ID)?.remove();return false}
    if(document.getElementById(MODULE_ID))return true;
    const app=document.getElementById('app');if(!app||!app.innerHTML.trim())return false;
    style();
    const wrap=document.createElement('section');wrap.id=MODULE_ID;wrap.setAttribute('aria-label','VYRDICT requests and weekly email');
    wrap.innerHTML=`<div class="vgr-grid">
      <article class="vgr-card request"><div><div class="vgr-kicker">Your feed found it first</div><h2>Request a VYRDICT.</h2><p>Seeing a product everywhere but can’t find it here yet? Send the name and we’ll put it into the research queue.</p></div><div><form class="vgr-form" data-request-form><input name="product_name" maxlength="160" required placeholder="Product or brand name"><button type="submit">Request it</button></form><div class="vgr-status" data-request-status role="status" aria-live="polite"></div><a class="vgr-secondary" href="/suggest-product.html" data-vyrdict-suggest>Add a link or more detail →</a></div></article>
      <article class="vgr-card"><div><div class="vgr-kicker">Weekly VYRDICT</div><h2>The week’s hype, edited down.</h2><p>Five viral finds, the products actually worth it, and the skips you can leave behind — once a week.</p></div><div><form class="vgr-form" data-news-form><input type="email" name="email" maxlength="254" required autocomplete="email" placeholder="you@email.com"><input class="vgr-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit">Join weekly</button></form><div class="vgr-status" data-news-status role="status" aria-live="polite"></div><div class="vgr-consent">By subscribing, you agree to receive Weekly VYRDICT emails. Unsubscribe anytime.</div></div></article>
    </div>`;
    app.appendChild(wrap);

    const rf=wrap.querySelector('[data-request-form]'),rs=wrap.querySelector('[data-request-status]');
    rf.addEventListener('submit',async e=>{e.preventDefault();const btn=rf.querySelector('button'),name=rf.product_name.value.trim();rs.className='vgr-status';rs.textContent='';if(name.length<2){rs.classList.add('err');rs.textContent='Add the product name first.';return}btn.disabled=true;btn.textContent='Sending…';try{const r=await fetch(SUGGEST,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({product_name:name,note:'Submitted from homepage Request a VYRDICT module.'})});if(!r.ok)throw 0;rf.reset();rs.classList.add('ok');rs.textContent='Requested — it’s now in the VYRDICT research queue.';window.VyrdictAnalytics?.send?.('suggest_submit',{source:'homepage_request'})}catch{rs.classList.add('err');rs.textContent='Could not send that right now. Please try again.'}finally{btn.disabled=false;btn.textContent='Request it'}});

    const nf=wrap.querySelector('[data-news-form]'),ns=wrap.querySelector('[data-news-status]');
    nf.addEventListener('submit',async e=>{e.preventDefault();const btn=nf.querySelector('button'),email=nf.email.value.trim();ns.className='vgr-status';ns.textContent='';if(!email){ns.classList.add('err');ns.textContent='Add your email first.';return}btn.disabled=true;btn.textContent='Joining…';try{const r=await fetch(NEWS,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,website:nf.website.value,source:'homepage_weekly'})});if(!r.ok)throw 0;nf.reset();ns.classList.add('ok');ns.textContent='You’re in. Weekly VYRDICT is on the list.';window.VyrdictAnalytics?.send?.('newsletter_signup',{source:'homepage_weekly'})}catch{ns.classList.add('err');ns.textContent='Could not subscribe right now. Please try again.'}finally{btn.disabled=false;btn.textContent='Join weekly'}});
    return true;
  }

  function boot(){
    let tries=0;const go=()=>{const ok=mount();refreshHome();if(!ok&&tries++<20)setTimeout(go,120)};go();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(boot,40));addEventListener('hashchange',()=>setTimeout(boot,40));
  setInterval(()=>{if(isHome())refreshHome()},15*60*1000);
})();