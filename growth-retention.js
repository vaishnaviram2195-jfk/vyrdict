(()=>{
  if(window.__vyrdictGrowthRetentionV4)return;
  window.__vyrdictGrowthRetentionV4=1;

  const SUGGEST='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-suggest-product';
  const NEWS='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';
  const STYLE_ID='vyrdict-growth-retention-style-v4';
  const MODULE_ID='vyrdict-growth-retention';
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const emailOk=s=>!s||/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(s);

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      #${MODULE_ID}{width:min(1180px,calc(100% - 40px));margin:34px auto 58px;font-family:Arial,Helvetica,sans-serif;color:#171511}
      #${MODULE_ID} *{box-sizing:border-box}
      #${MODULE_ID} .vgr-path{background:#171511;color:#fff;border-radius:28px;padding:26px;margin-bottom:18px}
      #${MODULE_ID} .vgr-path-top{display:flex;justify-content:space-between;gap:18px;align-items:flex-end;flex-wrap:wrap}
      #${MODULE_ID} .vgr-path h2{font:400 clamp(30px,4vw,46px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;margin:0;max-width:720px}
      #${MODULE_ID} .vgr-path p{color:#cfc6be;max-width:620px;margin-top:10px}
      #${MODULE_ID} .vgr-path-actions{display:flex;gap:8px;flex-wrap:wrap}
      #${MODULE_ID} .vgr-path-actions button,#${MODULE_ID} .vgr-path-actions a{border:1px solid #ffffff38;border-radius:999px;background:#fff;color:#171511;padding:12px 15px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;text-decoration:none;cursor:pointer;white-space:nowrap}
      #${MODULE_ID} .vgr-path-actions a{background:transparent;color:#fff}
      #${MODULE_ID} .vgr-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:20px}
      #${MODULE_ID} .vgr-step{border:1px solid #ffffff24;border-radius:17px;padding:14px;background:#ffffff0b}
      #${MODULE_ID} .vgr-step b{display:block;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#f4d7df;margin-bottom:7px}
      #${MODULE_ID} .vgr-step span{font:11px/1.45 Arial,Helvetica,sans-serif;color:#e4dcd5}
      #${MODULE_ID} .vgr-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
      #${MODULE_ID} .vgr-card{border:1px solid #d8cec4;border-radius:28px;padding:30px;background:#fffdf8;min-height:260px;display:flex;flex-direction:column;justify-content:space-between}
      #${MODULE_ID} .vgr-card.request{background:#efe4dc}
      #${MODULE_ID} .vgr-kicker{font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#6d675f;margin-bottom:18px}
      #${MODULE_ID} h2{font:400 clamp(32px,4vw,48px)/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;margin:0 0 12px;color:#171511}
      #${MODULE_ID} p{font:12.5px/1.6 Arial,Helvetica,sans-serif;color:#6d675f;margin:0;max-width:47ch}
      #${MODULE_ID} .vgr-form{display:flex;gap:9px;margin-top:24px;align-items:center}
      #${MODULE_ID} .vgr-request-form{display:grid;grid-template-columns:1.08fr .92fr auto}
      #${MODULE_ID} input{flex:1;min-width:0;border:1px solid #cfc2b7;background:#fff;border-radius:999px;padding:13px 15px;font:13px/1 Arial,Helvetica,sans-serif;color:#171511;outline:none}
      #${MODULE_ID} input:focus{border-color:#8f867e;box-shadow:0 0 0 3px rgba(143,134,126,.12)}
      #${MODULE_ID} button,#${MODULE_ID} .vgr-link{border:0;border-radius:999px;background:#171511;color:#fff;padding:13px 17px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;text-decoration:none;white-space:nowrap}
      #${MODULE_ID} button:disabled{opacity:.55;cursor:default}
      #${MODULE_ID} .vgr-secondary{display:inline-block;margin-top:12px;color:#171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;border-bottom:1px solid #171511;padding-bottom:2px;width:max-content}
      #${MODULE_ID} .vgr-status{min-height:18px;margin-top:10px;font-size:10.5px;line-height:1.45;color:#6d675f}
      #${MODULE_ID} .vgr-status.ok{color:#49624b}#${MODULE_ID} .vgr-status.err{color:#8b4f43}
      #${MODULE_ID} .vgr-consent{margin-top:10px;font-size:9px;line-height:1.45;color:#7b746d}
      #${MODULE_ID} .vgr-hp{position:absolute;left:-9999px;opacity:0;pointer-events:none}
      @media(max-width:900px){#${MODULE_ID} .vgr-request-form{grid-template-columns:1fr 1fr}#${MODULE_ID} .vgr-request-form button{grid-column:1/-1}}
      @media(max-width:760px){#${MODULE_ID}{width:min(100% - 28px,1180px);margin:26px auto 44px}#${MODULE_ID} .vgr-grid,#${MODULE_ID} .vgr-steps{grid-template-columns:1fr}#${MODULE_ID} .vgr-card{padding:22px;border-radius:24px;min-height:230px}#${MODULE_ID} .vgr-path{padding:22px;border-radius:24px}#${MODULE_ID} .vgr-path-actions{width:100%}#${MODULE_ID} .vgr-path-actions button,#${MODULE_ID} .vgr-path-actions a{flex:1;text-align:center}#${MODULE_ID} .vgr-form,#${MODULE_ID} .vgr-request-form{display:flex;flex-direction:column;align-items:stretch}#${MODULE_ID} button{width:100%}}
    `;document.head.appendChild(s);
  }

  function findFirstProduct(){return document.querySelector('#app [data-product],#app .productCard,#app .card[data-id],#app a[href^="/product/"]')}

  function mount(){
    if(!isHome()){document.getElementById(MODULE_ID)?.remove();return false}
    if(document.getElementById(MODULE_ID))return true;
    const app=document.getElementById('app');if(!app||!app.innerHTML.trim())return false;
    style();
    const wrap=document.createElement('section');wrap.id=MODULE_ID;wrap.setAttribute('aria-label','How VYRDICT works, product requests and weekly email');
    wrap.innerHTML=`<section class="vgr-path"><div class="vgr-path-top"><div><div class="vgr-kicker" style="color:#cfc6be;margin-bottom:12px">From hype to decision</div><h2>What’s viral. What’s worth it. Where to buy.</h2><p>Open any VYRDICT to see the attention score, the evidence-backed Worth score, the verdict, and verified retailer options in one place.</p></div><div class="vgr-path-actions"><button type="button" data-explore>Browse trending</button><a href="/how-vyrdict-scores.html">How scoring works</a></div></div><div class="vgr-steps"><div class="vgr-step"><b>01 · Viral</b><span>See what the internet is actually talking about now.</span></div><div class="vgr-step"><b>02 · Worth</b><span>Separate real value from hype with evidence-backed scoring.</span></div><div class="vgr-step"><b>03 · Shop</b><span>Use verified U.S. and Canada retailer options when you’re ready.</span></div></div></section><div class="vgr-grid">
      <article class="vgr-card request"><div><div class="vgr-kicker">Your feed found it first</div><h2>Request a VYRDICT.</h2><p>Seeing a product everywhere but can’t find it here yet? Send it to our research queue.</p></div><div><form class="vgr-form vgr-request-form" data-request-form><input name="product_name" maxlength="160" required placeholder="Product or brand name"><input type="email" name="requester_email" maxlength="254" autocomplete="email" placeholder="Email me if it’s added"><button type="submit">Request it</button></form><div class="vgr-status" data-request-status role="status" aria-live="polite"></div><div class="vgr-consent">Email is optional and is used only to notify you if this request is added to VYRDICT.</div><a class="vgr-secondary" href="/suggest-product.html" data-vyrdict-suggest>Add a link or more detail →</a></div></article>
      <article class="vgr-card"><div><div class="vgr-kicker">Weekly VYRDICT · Monday</div><h2>The week’s hype, edited down.</h2><p>Five viral finds, what’s actually worth it, and the skips you can leave behind — one useful email every Monday.</p></div><div><form class="vgr-form" data-news-form><input type="email" name="email" maxlength="254" required autocomplete="email" placeholder="you@email.com"><input class="vgr-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit">Join weekly</button></form><div class="vgr-status" data-news-status role="status" aria-live="polite"></div><div class="vgr-consent">By subscribing, you agree to receive Weekly VYRDICT emails. Unsubscribe anytime.</div><a class="vgr-secondary" href="/account.html">Want synced saves too? Create a free account →</a></div></article>
    </div>`;
    app.appendChild(wrap);

    wrap.querySelector('[data-explore]')?.addEventListener('click',()=>{const p=findFirstProduct();window.VyrdictAnalytics?.send?.('home_conversion_explore',{source:'how_vyrdict_works'});p?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'})});

    const rf=wrap.querySelector('[data-request-form]'),rs=wrap.querySelector('[data-request-status]');
    rf.addEventListener('submit',async e=>{e.preventDefault();const btn=rf.querySelector('button'),name=rf.product_name.value.trim(),email=rf.requester_email.value.trim();rs.className='vgr-status';rs.textContent='';if(name.length<2){rs.classList.add('err');rs.textContent='Add the product name first.';return}if(!emailOk(email)){rs.classList.add('err');rs.textContent='That email does not look valid.';return}btn.disabled=true;btn.textContent='Sending…';try{const r=await fetch(SUGGEST,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({product_name:name,requester_email:email||undefined,notify_if_added:Boolean(email),note:'Submitted from homepage Request a VYRDICT module.'})});const out=await r.json().catch(()=>({}));if(!r.ok)throw 0;rf.reset();rs.classList.add('ok');rs.textContent=email&&out.notification_saved!==false?'Requested — we’ll email you if it makes VYRDICT.':'Requested — it’s now in the VYRDICT research queue.';window.VyrdictAnalytics?.send?.('suggest_submit',{source:'homepage_request',notify:Boolean(email)})}catch{rs.classList.add('err');rs.textContent='Could not send that right now. Please try again.'}finally{btn.disabled=false;btn.textContent='Request it'}});

    const nf=wrap.querySelector('[data-news-form]'),ns=wrap.querySelector('[data-news-status]');
    nf.addEventListener('submit',async e=>{e.preventDefault();const btn=nf.querySelector('button'),email=nf.email.value.trim();ns.className='vgr-status';ns.textContent='';if(!emailOk(email)||!email){ns.classList.add('err');ns.textContent='Add a valid email first.';return}btn.disabled=true;btn.textContent='Joining…';try{const r=await fetch(NEWS,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,website:nf.website.value,source:'homepage_weekly'})});if(!r.ok)throw 0;nf.reset();ns.classList.add('ok');ns.textContent='You’re in. Weekly VYRDICT lands every Monday.';window.VyrdictAnalytics?.send?.('newsletter_signup',{source:'homepage_weekly'})}catch{ns.classList.add('err');ns.textContent='Could not subscribe right now. Please try again.'}finally{btn.disabled=false;btn.textContent='Join weekly'}});
    return true;
  }

  function boot(){let tries=0;const go=()=>{if(mount())return;if(tries++<12)setTimeout(go,120)};go()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(boot,40));
})();
