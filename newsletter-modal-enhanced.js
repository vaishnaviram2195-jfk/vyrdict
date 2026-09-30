(()=>{
  if(window.__vyrdictNewsletterEnhancedV2)return;
  window.__vyrdictNewsletterEnhancedV2=1;

  const ROOT_ID='vyrdict-newsletter-enhanced';
  const THANK_ID='vyrdict-newsletter-thanks';
  const STYLE_ID='vyrdict-newsletter-enhanced-style-v2';
  const LEGACY_ID='vyrdict-newsletter-primary';
  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';

  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    document.getElementById('vyrdict-newsletter-enhanced-style')?.remove();
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
#${ROOT_ID},#${THANK_ID}{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:24px;background:rgba(111,112,108,.80);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:Arial,Helvetica,sans-serif;animation:vneFade .18s ease-out both}
#${ROOT_ID} *,#${THANK_ID} *{box-sizing:border-box}
#${ROOT_ID} .vne-stage,#${THANK_ID} .vne-stage{position:relative;width:min(560px,calc(100vw - 30px));min-height:540px;display:flex;align-items:flex-start;justify-content:center;padding-top:26px}
#${ROOT_ID} .vne-envelope-back,#${THANK_ID} .vne-envelope-back{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:min(520px,94%);height:285px;background:#e8e2d7;border:1px solid rgba(70,64,57,.10);box-shadow:0 28px 70px rgba(28,27,24,.22);z-index:0}
#${ROOT_ID} .vne-envelope-back:before,#${THANK_ID} .vne-envelope-back:before{content:'';position:absolute;left:-1px;right:-1px;top:-132px;height:134px;background:#e3ddd2;clip-path:polygon(0 100%,50% 0,100% 100%)}
#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{position:relative;z-index:2;width:min(404px,calc(100vw - 70px));background:#f5f1e8;color:#1c1b18;border:1px solid rgba(70,64,57,.10);border-radius:2px;padding:30px 30px 118px;box-shadow:0 18px 42px rgba(30,28,24,.15);text-align:center;animation:vneRise .22s ease-out both}
#${ROOT_ID} .vne-close,#${THANK_ID} .vne-close{position:absolute;right:12px;top:11px;width:30px;height:30px;border:0;background:transparent;color:#6a655e;font-size:20px;line-height:1;display:grid;place-items:center;cursor:pointer;z-index:4;padding:0}
#${ROOT_ID} .vne-brand,#${THANK_ID} .vne-brand{display:inline-flex;align-items:flex-end;gap:3px;font-size:15px;font-weight:950;letter-spacing:-.7px;margin-bottom:24px;color:#171715}
#${ROOT_ID} .vne-dot,#${THANK_ID} .vne-dot{width:5px;height:5px;background:#d94d73;display:inline-block;margin-bottom:2px}
#${ROOT_ID} .vne-invite,#${THANK_ID} .vne-invite{margin:0 0 12px;font:500 12px/1.2 Georgia,'Times New Roman',serif;font-style:italic;color:#6e6962}
#${ROOT_ID} h2,#${THANK_ID} h2{margin:0;font:400 40px/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#1d1c19}
#${ROOT_ID} .vne-subhead,#${THANK_ID} .vne-subhead{margin:12px 0 14px;font:800 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#5f5a54}
#${ROOT_ID} .vne-copy,#${THANK_ID} .vne-copy{max-width:310px;margin:0 auto 20px;font-size:12px;line-height:1.58;color:#65605a}
#${ROOT_ID} .vne-row{display:grid;grid-template-columns:1fr;gap:9px;max-width:310px;margin:0 auto}
#${ROOT_ID} input[type=email]{width:100%;min-width:0;border:1px solid #cfc8be;background:#fbf9f4;color:#1d1b18;border-radius:0;padding:12px 13px;font:500 12px/1 Arial,Helvetica,sans-serif;outline:none;text-align:left}
#${ROOT_ID} input[type=email]::placeholder{color:#989087}
#${ROOT_ID} input[type=email]:focus{border-color:#827b72;box-shadow:0 0 0 2px rgba(82,78,72,.08)}
#${ROOT_ID} button[type=submit],#${THANK_ID} .vne-done{height:41px;border:0;border-radius:0;background:#262522;color:#fff;padding:0 18px;font-size:9px;font-weight:950;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
#${ROOT_ID} button[type=submit]:disabled{opacity:.58;cursor:default}
#${ROOT_ID} .vne-status{min-height:14px;margin-top:8px;font-size:10px;line-height:1.4;color:#68625c}
#${ROOT_ID} .vne-status.err{color:#934f45}
#${ROOT_ID} .vne-note{margin:8px 0 0;font-size:8px;line-height:1.45;letter-spacing:.08em;text-transform:uppercase;color:#8b857d}
#${ROOT_ID} .vne-envelope-front,#${THANK_ID} .vne-envelope-front{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);width:min(520px,94%);height:166px;background:#ece6dc;clip-path:polygon(0 0,50% 56%,100% 0,100% 100%,0 100%);z-index:3;border-bottom:1px solid rgba(70,64,57,.08);pointer-events:none}
#${ROOT_ID} .vne-envelope-front:before,#${THANK_ID} .vne-envelope-front:before{content:'';position:absolute;inset:0;background:linear-gradient(145deg,rgba(255,255,255,.16),rgba(0,0,0,.025));clip-path:inherit}
#${ROOT_ID} .vne-envelope-mark,#${THANK_ID} .vne-envelope-mark{position:absolute;left:50%;bottom:48px;transform:translateX(-50%);z-index:4;display:flex;align-items:flex-end;gap:3px;font-size:12px;font-weight:950;letter-spacing:-.6px;color:#3d3a36;pointer-events:none}
#${ROOT_ID} .vne-envelope-mark .vne-dot,#${THANK_ID} .vne-envelope-mark .vne-dot{width:4px;height:4px;margin-bottom:2px}
#${THANK_ID} .vne-card{padding-top:45px}
#${THANK_ID} .vne-copy{margin-bottom:19px}
#${THANK_ID} .vne-done{min-width:118px}
@keyframes vneFade{from{opacity:0}to{opacity:1}}@keyframes vneRise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(max-width:560px){#${ROOT_ID},#${THANK_ID}{padding:14px}#${ROOT_ID} .vne-stage,#${THANK_ID} .vne-stage{width:min(100%,430px);min-height:505px;padding-top:18px}#${ROOT_ID} .vne-envelope-back,#${THANK_ID} .vne-envelope-back,#${ROOT_ID} .vne-envelope-front,#${THANK_ID} .vne-envelope-front{width:100%}#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{width:calc(100% - 44px);padding:26px 22px 108px}#${ROOT_ID} h2,#${THANK_ID} h2{font-size:34px}#${ROOT_ID} .vne-envelope-back,#${THANK_ID} .vne-envelope-back{height:260px}#${ROOT_ID} .vne-envelope-front,#${THANK_ID} .vne-envelope-front{height:150px}}
@media(max-width:390px){#${ROOT_ID} .vne-stage,#${THANK_ID} .vne-stage{min-height:475px}#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{width:calc(100% - 30px);padding-left:18px;padding-right:18px}#${ROOT_ID} h2,#${THANK_ID} h2{font-size:31px}#${ROOT_ID} .vne-copy,#${THANK_ID} .vne-copy{font-size:11px}}
@media(prefers-reduced-motion:reduce){#${ROOT_ID},#${THANK_ID},#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{animation:none}}
`;
    document.head.appendChild(s);
  }

  function unlock(){document.documentElement.style.overflow=''}
  function removeAll(){document.getElementById(ROOT_ID)?.remove();document.getElementById(THANK_ID)?.remove();document.getElementById(LEGACY_ID)?.remove();unlock()}

  function shell(inner){return `<div class="vne-stage"><div class="vne-envelope-back" aria-hidden="true"></div>${inner}<div class="vne-envelope-front" aria-hidden="true"></div><div class="vne-envelope-mark" aria-hidden="true"><span>VYRDICT</span><span class="vne-dot"></span></div></div>`}

  function showThanks(){
    document.getElementById(ROOT_ID)?.remove();
    ensureStyle();
    const root=document.createElement('div');
    root.id=THANK_ID;
    root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','vne-thank-title');
    root.innerHTML=shell(`<div class="vne-card" role="document"><button class="vne-close" type="button" aria-label="Close">×</button><div class="vne-brand"><span>VYRDICT</span><span class="vne-dot" aria-hidden="true"></span></div><p class="vne-invite">You’re on the list.</p><h2 id="vne-thank-title">Welcome to<br>Weekly VYRDICT.</h2><p class="vne-subhead">THE WEEK, EDITED.</p><p class="vne-copy">Your Monday edit will bring the breakout products, fresh launches and internet moments actually worth knowing.</p><button class="vne-done" type="button">Done</button></div>`);
    document.body.appendChild(root);document.documentElement.style.overflow='hidden';
    root.querySelector('.vne-close')?.addEventListener('click',removeAll);
    root.querySelector('.vne-done')?.addEventListener('click',removeAll);
    root.addEventListener('click',e=>{if(e.target===root)removeAll()});
  }

  function open(){
    removeAll();ensureStyle();
    const root=document.createElement('div');
    root.id=ROOT_ID;
    root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','vne-title');
    root.innerHTML=shell(`<div class="vne-card" role="document"><button class="vne-close" type="button" aria-label="Close newsletter sign-up">×</button><div class="vne-brand"><span>VYRDICT</span><span class="vne-dot" aria-hidden="true"></span></div><p class="vne-invite">You’re invited.</p><h2 id="vne-title">The Weekly<br>VYRDICT</h2><p class="vne-subhead">THE WEEK, EDITED.</p><p class="vne-copy">A sharper weekly read on breakout products, fresh launches and what the internet can’t stop talking about.</p><form novalidate><div class="vne-row"><input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email address" placeholder="Email address" required><button type="submit">Join weekly →</button></div><div class="vne-status" role="status" aria-live="polite"></div><p class="vne-note">5 viral finds · every Monday · no spam</p></form></div>`);
    document.body.appendChild(root);document.documentElement.style.overflow='hidden';
    const form=root.querySelector('form'),input=root.querySelector('input[type=email]'),button=root.querySelector('button[type=submit]'),status=root.querySelector('.vne-status');
    root.querySelector('.vne-close')?.addEventListener('click',removeAll);
    root.addEventListener('click',e=>{if(e.target===root)removeAll()});
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const email=String(input.value||'').trim().toLowerCase();
      status.className='vne-status';status.textContent='';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)){status.classList.add('err');status.textContent='Enter a valid email address.';input.focus();return}
      button.disabled=true;button.textContent='Joining…';
      try{
        const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source:'primary_newsletter_nav',website:''})});
        const out=await r.json().catch(()=>({}));
        if(!r.ok)throw new Error(out.error||'subscription_failed');
        window.VyrdictAnalytics?.send?.('newsletter_signup',{source:'primary_newsletter_nav'});
        showThanks();
      }catch(err){status.classList.add('err');status.textContent='We couldn’t subscribe you just now. Please try again.';button.disabled=false;button.textContent='Join weekly →'}
    });
    setTimeout(()=>input.focus({preventScroll:true}),90);
  }

  document.addEventListener('click',e=>{
    const trigger=e.target?.closest?.('[data-vyrdict-newsletter-entry]');
    if(!trigger)return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();open();
  },true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(document.getElementById(ROOT_ID)||document.getElementById(THANK_ID)))removeAll()});
  window.VyrdictNewsletter={...(window.VyrdictNewsletter||{}),open,close:removeAll};
})();