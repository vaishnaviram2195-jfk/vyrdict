(()=>{
  if(window.__vyrdictNewsletterWelcomePopupV3)return;
  window.__vyrdictNewsletterWelcomePopupV3=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';
  const ROOT_ID='vyrdict-newsletter-welcome';
  const STYLE_ID='vyrdict-newsletter-welcome-style-v3';
  const SESSION_KEY='vyrdict:newsletter-popup-seen:v3';
  const SUBSCRIBED_KEY='vyrdict:newsletter-subscribed:v1';

  function shouldSkip(){
    try{
      if(localStorage.getItem(SUBSCRIBED_KEY)==='1')return true;
      if(sessionStorage.getItem(SESSION_KEY)==='1')return true;
    }catch{}
    return false;
  }

  function markSeen(){
    try{sessionStorage.setItem(SESSION_KEY,'1')}catch{}
  }

  function markSubscribed(){
    try{
      localStorage.setItem(SUBSCRIBED_KEY,'1');
      sessionStorage.setItem(SESSION_KEY,'1');
    }catch{}
  }

  function ensureStyle(){
    document.getElementById('vyrdict-newsletter-welcome-style')?.remove();
    document.getElementById('vyrdict-newsletter-welcome-style-v2')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${ROOT_ID}{position:fixed;inset:0;z-index:2147482500;display:grid;place-items:center;padding:22px;background:rgba(18,31,45,.34);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);font-family:Arial,Helvetica,sans-serif;animation:vnpFade .2s ease-out both}
      #${ROOT_ID} .vnp-card{position:relative;isolation:isolate;overflow:hidden;width:min(468px,calc(100vw - 36px));box-sizing:border-box;background:linear-gradient(145deg,#f8f7f2 0%,#edf4ff 52%,#e8f3f0 100%);color:#18232f;border:1px solid rgba(25,48,70,.16);border-radius:22px;padding:36px 34px 30px;box-shadow:0 28px 85px rgba(18,31,45,.24);animation:vnpRise .28s cubic-bezier(.2,.75,.2,1) both}
      #${ROOT_ID} .vnp-card:before{content:'';position:absolute;z-index:-1;width:172px;height:172px;border-radius:50%;right:-70px;top:-62px;background:#3156d8;opacity:.16}
      #${ROOT_ID} .vnp-card:after{content:'';position:absolute;z-index:-1;width:138px;height:138px;border-radius:32% 68% 61% 39%;left:-62px;bottom:-66px;background:#2d7f74;opacity:.17;transform:rotate(16deg)}
      #${ROOT_ID} .vnp-spark{position:absolute;right:78px;top:42px;font:900 24px/1 Georgia,serif;color:#3156d8;transform:rotate(12deg);user-select:none}
      #${ROOT_ID} .vnp-close{position:absolute;z-index:3;top:13px;right:14px;width:34px;height:34px;border:1px solid rgba(25,48,70,.16);background:rgba(255,255,255,.62);color:#18232f;font-size:23px;line-height:1;cursor:pointer;border-radius:999px;display:grid;place-items:center;backdrop-filter:blur(8px)}
      #${ROOT_ID} .vnp-close:hover{background:#fff}
      #${ROOT_ID} .vnp-brand{position:relative;z-index:2;display:flex;align-items:flex-end;gap:3px;margin:0 0 22px;font-size:20px;font-weight:950;letter-spacing:-1px;color:#18232f}
      #${ROOT_ID} .vnp-dot{width:6px;height:6px;background:#3156d8;display:inline-block;margin-bottom:2px}
      #${ROOT_ID} .vnp-kicker{position:relative;z-index:2;display:inline-flex;align-items:center;gap:6px;margin:0 0 12px;padding:7px 10px;border-radius:999px;background:#dceeea;color:#195d56;font-size:9px;line-height:1;font-weight:950;letter-spacing:.13em;text-transform:uppercase;box-shadow:inset 0 0 0 1px rgba(25,93,86,.09)}
      #${ROOT_ID} h2{position:relative;z-index:2;margin:0 0 13px;max-width:390px;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:.98;font-weight:500;letter-spacing:-.045em;color:#18232f}
      #${ROOT_ID} .vnp-copy{position:relative;z-index:2;margin:0 0 22px;max-width:385px;font-size:14px;line-height:1.62;color:#52616d}
      #${ROOT_ID} form{position:relative;z-index:2;margin:0}
      #${ROOT_ID} .vnp-row{display:flex;gap:8px;align-items:stretch}
      #${ROOT_ID} input[type=email]{flex:1 1 auto;min-width:0;box-sizing:border-box;border:1px solid rgba(25,48,70,.20);background:rgba(255,255,255,.86);color:#18232f;border-radius:999px;padding:13px 15px;font:500 13px/1 Arial,Helvetica,sans-serif;outline:none;box-shadow:0 7px 20px rgba(29,55,77,.05)}
      #${ROOT_ID} input[type=email]::placeholder{color:#7a8994}
      #${ROOT_ID} input[type=email]:focus{border-color:#3156d8;box-shadow:0 0 0 3px rgba(49,86,216,.12)}
      #${ROOT_ID} button[type=submit]{flex:0 0 auto;border:0;border-radius:999px;background:#3156d8;color:#fff;padding:0 19px;font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap;box-shadow:0 8px 20px rgba(49,86,216,.22);transition:transform .18s ease,background .18s ease,box-shadow .18s ease}
      #${ROOT_ID} button[type=submit]:hover{background:#2748bd;transform:translateY(-1px);box-shadow:0 10px 24px rgba(49,86,216,.28)}
      #${ROOT_ID} button[type=submit]:disabled{opacity:.56;cursor:default;transform:none}
      #${ROOT_ID} .vnp-note{margin:12px 0 0;font-size:9.5px;line-height:1.45;color:#70808c}
      #${ROOT_ID} .vnp-status{min-height:16px;margin:10px 0 0;font-size:11px;line-height:1.45;color:#52616d}
      #${ROOT_ID} .vnp-status.ok{color:#23685f;font-weight:700}
      #${ROOT_ID} .vnp-status.err{color:#8c4d46}
      #${ROOT_ID} .vnp-mini{position:relative;z-index:2;display:flex;gap:7px;flex-wrap:wrap;margin:0 0 18px}
      #${ROOT_ID} .vnp-mini span{display:inline-flex;align-items:center;border:1px solid rgba(25,48,70,.12);background:rgba(255,255,255,.52);border-radius:999px;padding:6px 9px;font-size:8px;font-weight:850;letter-spacing:.08em;text-transform:uppercase;color:#536876}
      @keyframes vnpFade{from{opacity:0}to{opacity:1}}
      @keyframes vnpRise{from{opacity:0;transform:translateY(14px) rotate(-.25deg) scale(.985)}to{opacity:1;transform:none}}
      @media(max-width:600px){
        #${ROOT_ID}{padding:16px;place-items:center}
        #${ROOT_ID} .vnp-card{width:min(100%,420px);padding:30px 22px 24px;border-radius:19px}
        #${ROOT_ID} .vnp-card:before{width:140px;height:140px;right:-62px;top:-50px}
        #${ROOT_ID} .vnp-spark{right:66px;top:39px;font-size:20px}
        #${ROOT_ID} h2{font-size:36px;max-width:330px}
        #${ROOT_ID} .vnp-row{display:block}
        #${ROOT_ID} input[type=email],#${ROOT_ID} button[type=submit]{width:100%}
        #${ROOT_ID} button[type=submit]{height:45px;margin-top:8px}
      }
      @media(prefers-reduced-motion:reduce){#${ROOT_ID},#${ROOT_ID} .vnp-card{animation:none}#${ROOT_ID} button[type=submit]{transition:none}}
    `;
    document.head.appendChild(s);
  }

  function close(){
    const root=document.getElementById(ROOT_ID);
    if(!root)return;
    markSeen();
    root.remove();
    document.documentElement.style.overflow='';
  }

  function mount(){
    if(shouldSkip()||document.getElementById(ROOT_ID))return;
    ensureStyle();
    markSeen();

    const root=document.createElement('div');
    root.id=ROOT_ID;
    root.setAttribute('role','dialog');
    root.setAttribute('aria-modal','true');
    root.setAttribute('aria-labelledby','vnp-title');
    root.innerHTML=`
      <div class="vnp-card" role="document">
        <span class="vnp-spark" aria-hidden="true">✦</span>
        <button class="vnp-close" type="button" aria-label="Close newsletter sign-up">×</button>
        <div class="vnp-brand" aria-label="VYRDICT"><span>VYRDICT</span><span class="vnp-dot" aria-hidden="true"></span></div>
        <p class="vnp-kicker">THE WEEKLY DROP ✦</p>
        <h2 id="vnp-title">Welcome to VYRDICT.</h2>
        <p class="vnp-copy">The internet moves fast. We keep the good stuff. Get breakout products, fresh launches and what’s actually worth the hype — once a week.</p>
        <div class="vnp-mini" aria-hidden="true"><span>Fresh finds</span><span>Hype checks</span><span>Culture drops</span></div>
        <form novalidate>
          <div class="vnp-row">
            <input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email address" placeholder="Your email address" required>
            <button type="submit">I’m in →</button>
          </div>
          <div class="vnp-status" role="status" aria-live="polite"></div>
          <p class="vnp-note">One email a week. No inbox chaos. Unsubscribe anytime.</p>
        </form>
      </div>`;

    document.body.appendChild(root);
    document.documentElement.style.overflow='hidden';

    const closeBtn=root.querySelector('.vnp-close');
    const form=root.querySelector('form');
    const input=root.querySelector('input[type=email]');
    const button=root.querySelector('button[type=submit]');
    const status=root.querySelector('.vnp-status');

    closeBtn.addEventListener('click',close);
    root.addEventListener('click',e=>{if(e.target===root)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(ROOT_ID))close()},{once:true});

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const email=String(input.value||'').trim().toLowerCase();
      status.className='vnp-status';
      status.textContent='';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)){
        status.classList.add('err');
        status.textContent='Enter a valid email address.';
        input.focus();
        return;
      }
      button.disabled=true;
      button.textContent='Joining…';
      try{
        const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source:'welcome_popup',website:''})});
        const out=await r.json().catch(()=>({}));
        if(!r.ok)throw new Error(out.error||'subscription_failed');
        markSubscribed();
        status.classList.add('ok');
        status.textContent='You’re in — see you in your inbox ✦';
        button.textContent='Subscribed ✓';
        setTimeout(close,1350);
      }catch(err){
        status.classList.add('err');
        status.textContent='We couldn’t subscribe you just now. Please try again.';
        button.disabled=false;
        button.textContent='I’m in →';
      }
    });

    setTimeout(()=>input.focus({preventScroll:true}),120);
  }

  function schedule(){
    if(shouldSkip())return;
    setTimeout(mount,1400);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
