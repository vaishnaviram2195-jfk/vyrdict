(()=>{
  if(window.__vyrdictNewsletterEnhancedV1)return;
  window.__vyrdictNewsletterEnhancedV1=1;

  const ROOT_ID='vyrdict-newsletter-enhanced';
  const THANK_ID='vyrdict-newsletter-thanks';
  const STYLE_ID='vyrdict-newsletter-enhanced-style';
  const LEGACY_ID='vyrdict-newsletter-primary';
  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';

  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
#${ROOT_ID},#${THANK_ID}{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:18px;background:rgba(20,19,17,.36);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);font-family:Arial,Helvetica,sans-serif;animation:vneFade .18s ease-out both}
#${ROOT_ID} *,#${THANK_ID} *{box-sizing:border-box}
#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{position:relative;width:min(440px,calc(100vw - 30px));overflow:hidden;background:#f3eee7;color:#1c1a17;border:1px solid rgba(86,78,70,.18);border-radius:18px;padding:28px 26px 23px;box-shadow:0 26px 80px rgba(20,17,13,.24);animation:vneRise .22s ease-out both}
#${ROOT_ID} .vne-card:before,#${THANK_ID} .vne-card:before{content:'';position:absolute;inset:0 auto auto 0;width:100%;height:4px;background:linear-gradient(90deg,#5c6b51 0 34%,#d7a88f 34% 66%,#e55d7b 66% 100%)}
#${ROOT_ID} .vne-glow,#${THANK_ID} .vne-glow{position:absolute;width:190px;height:190px;right:-92px;top:-96px;border-radius:50%;background:radial-gradient(circle,rgba(229,93,123,.18),rgba(215,168,143,.08) 45%,transparent 72%);pointer-events:none}
#${ROOT_ID} .vne-close,#${THANK_ID} .vne-close{position:absolute;right:11px;top:11px;width:32px;height:32px;border:0;border-radius:50%;background:rgba(255,255,255,.42);color:#55504a;font-size:20px;line-height:1;display:grid;place-items:center;cursor:pointer;z-index:2}
#${ROOT_ID} .vne-brand,#${THANK_ID} .vne-brand{position:relative;display:flex;align-items:flex-end;gap:3px;font-size:15px;font-weight:950;letter-spacing:-.65px;margin-bottom:18px}
#${ROOT_ID} .vne-dot,#${THANK_ID} .vne-dot{width:5px;height:5px;background:#e55d7b;display:inline-block;margin-bottom:2px}
#${ROOT_ID} .vne-visual{position:relative;height:82px;margin:0 0 21px;border:1px solid rgba(92,107,81,.16);border-radius:13px;background:linear-gradient(135deg,rgba(255,255,255,.72),rgba(235,227,218,.56));overflow:hidden}
#${ROOT_ID} .vne-orb{position:absolute;border-radius:50%;filter:saturate(.85)}
#${ROOT_ID} .vne-orb.a{width:74px;height:74px;left:19px;top:18px;background:rgba(92,107,81,.82)}
#${ROOT_ID} .vne-orb.b{width:52px;height:52px;left:72px;top:-10px;background:rgba(229,93,123,.72);mix-blend-mode:multiply}
#${ROOT_ID} .vne-orb.c{width:42px;height:42px;right:35px;bottom:-13px;background:rgba(215,168,143,.9)}
#${ROOT_ID} .vne-line{position:absolute;left:145px;right:20px;height:1px;background:rgba(72,66,59,.18)}
#${ROOT_ID} .vne-line.one{top:27px}#${ROOT_ID} .vne-line.two{top:42px;width:145px}#${ROOT_ID} .vne-line.three{top:57px;width:105px}
#${ROOT_ID} .vne-spark{position:absolute;right:25px;top:16px;font:900 8px/1 Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;color:#6e675f}
#${ROOT_ID} .vne-kicker,#${THANK_ID} .vne-kicker{margin:0 0 8px;font-size:8px;line-height:1;font-weight:950;letter-spacing:.15em;text-transform:uppercase;color:#697260}
#${ROOT_ID} h2,#${THANK_ID} h2{margin:0;font:500 32px/.98 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#1d1b18}
#${ROOT_ID} .vne-copy,#${THANK_ID} .vne-copy{margin:11px 0 16px;font-size:12.5px;line-height:1.55;color:#615c56}
#${ROOT_ID} .vne-meta{display:flex;gap:7px;flex-wrap:wrap;margin:0 0 17px}
#${ROOT_ID} .vne-pill{border:1px solid rgba(92,107,81,.18);background:rgba(255,255,255,.5);border-radius:999px;padding:6px 9px;font-size:8px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#5e6257}
#${ROOT_ID} .vne-row{display:grid;grid-template-columns:1fr auto;gap:8px}
#${ROOT_ID} input[type=email]{min-width:0;border:1px solid #c8c0b7;background:#fffdf9;color:#1d1b18;border-radius:9px;padding:12px 13px;font:500 12px/1 Arial,Helvetica,sans-serif;outline:none}
#${ROOT_ID} input[type=email]::placeholder{color:#989087}
#${ROOT_ID} input[type=email]:focus{border-color:#65715e;box-shadow:0 0 0 3px rgba(92,107,81,.11)}
#${ROOT_ID} button[type=submit],#${THANK_ID} .vne-done{border:0;border-radius:9px;background:#1d1b18;color:#fff;padding:0 16px;font-size:9px;font-weight:950;letter-spacing:.075em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
#${ROOT_ID} button[type=submit]:disabled{opacity:.56;cursor:default}
#${ROOT_ID} .vne-status{min-height:15px;margin-top:7px;font-size:10px;line-height:1.4;color:#6a645d}
#${ROOT_ID} .vne-status.err{color:#934f45}
#${ROOT_ID} .vne-note{margin:2px 0 0;font-size:8.5px;line-height:1.45;color:#8a837b}
#${THANK_ID} .vne-card{padding:32px 28px 27px;text-align:center}
#${THANK_ID} .vne-brand{justify-content:center;margin-bottom:22px}
#${THANK_ID} .vne-check{width:54px;height:54px;margin:0 auto 17px;border-radius:50%;display:grid;place-items:center;background:#5c6b51;color:#fff;font-size:24px;box-shadow:0 10px 28px rgba(92,107,81,.18)}
#${THANK_ID} .vne-copy{max-width:330px;margin:12px auto 20px}
#${THANK_ID} .vne-small{margin:0 auto 20px;font-size:9px;line-height:1.5;color:#8a837b}
#${THANK_ID} .vne-done{height:40px;padding:0 22px}
@keyframes vneFade{from{opacity:0}to{opacity:1}}@keyframes vneRise{from{opacity:0;transform:translateY(8px) scale(.99)}to{opacity:1;transform:none}}
@media(max-width:520px){#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{width:min(100%,380px);padding:24px 19px 20px}#${ROOT_ID} h2,#${THANK_ID} h2{font-size:29px}#${ROOT_ID} .vne-visual{height:72px}#${ROOT_ID} .vne-row{grid-template-columns:1fr}#${ROOT_ID} button[type=submit]{height:41px}}
@media(prefers-reduced-motion:reduce){#${ROOT_ID},#${THANK_ID},#${ROOT_ID} .vne-card,#${THANK_ID} .vne-card{animation:none}}
`;
    document.head.appendChild(s);
  }

  function unlock(){document.documentElement.style.overflow=''}
  function removeAll(){document.getElementById(ROOT_ID)?.remove();document.getElementById(THANK_ID)?.remove();document.getElementById(LEGACY_ID)?.remove();unlock()}

  function showThanks(){
    document.getElementById(ROOT_ID)?.remove();
    ensureStyle();
    const root=document.createElement('div');
    root.id=THANK_ID;
    root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','vne-thank-title');
    root.innerHTML=`<div class="vne-card" role="document"><div class="vne-glow"></div><button class="vne-close" type="button" aria-label="Close">×</button><div class="vne-brand"><span>VYRDICT</span><span class="vne-dot" aria-hidden="true"></span></div><div class="vne-check" aria-hidden="true">✓</div><p class="vne-kicker">YOU’RE ON THE LIST</p><h2 id="vne-thank-title">Thank you for subscribing.</h2><p class="vne-copy">Weekly VYRDICT will land in your inbox with five breakout products, fresh launches and the things that are actually worth the hype.</p><p class="vne-small">One thoughtful edit. Every Monday. No noise.</p><button class="vne-done" type="button">Done</button></div>`;
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
    root.innerHTML=`<div class="vne-card" role="document"><div class="vne-glow"></div><button class="vne-close" type="button" aria-label="Close newsletter sign-up">×</button><div class="vne-brand"><span>VYRDICT</span><span class="vne-dot" aria-hidden="true"></span></div><div class="vne-visual" aria-hidden="true"><span class="vne-orb a"></span><span class="vne-orb b"></span><span class="vne-orb c"></span><span class="vne-line one"></span><span class="vne-line two"></span><span class="vne-line three"></span><span class="vne-spark">THE WEEK, EDITED</span></div><p class="vne-kicker">WEEKLY VYRDICT</p><h2 id="vne-title">The week’s hype, edited down.</h2><p class="vne-copy">A sharper weekly read on breakout products, fresh launches and what the internet can’t stop talking about — with the noise stripped out.</p><div class="vne-meta"><span class="vne-pill">5 viral finds</span><span class="vne-pill">Every Monday</span><span class="vne-pill">No spam</span></div><form novalidate><div class="vne-row"><input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email address" placeholder="Email address" required><button type="submit">Subscribe</button></div><div class="vne-status" role="status" aria-live="polite"></div><p class="vne-note">One email a week. Unsubscribe anytime.</p></form></div>`;
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
      }catch(err){status.classList.add('err');status.textContent='We couldn’t subscribe you just now. Please try again.';button.disabled=false;button.textContent='Subscribe'}
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
