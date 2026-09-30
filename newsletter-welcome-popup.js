(()=>{
  if(window.__vyrdictNewsletterWelcomePopupV1)return;
  window.__vyrdictNewsletterWelcomePopupV1=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';
  const ROOT_ID='vyrdict-newsletter-welcome';
  const STYLE_ID='vyrdict-newsletter-welcome-style';
  const SESSION_KEY='vyrdict:newsletter-popup-seen:v1';
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
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${ROOT_ID}{position:fixed;inset:0;z-index:2147482500;display:grid;place-items:center;padding:22px;background:rgba(18,18,18,.34);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);font-family:Arial,Helvetica,sans-serif;animation:vnpFade .2s ease-out both}
      #${ROOT_ID} .vnp-card{position:relative;width:min(460px,calc(100vw - 36px));box-sizing:border-box;background:#dedbd4;color:#171511;border:1px solid rgba(23,21,17,.14);border-radius:18px;padding:34px 34px 30px;box-shadow:0 26px 80px rgba(0,0,0,.22);animation:vnpRise .24s ease-out both}
      #${ROOT_ID} .vnp-close{position:absolute;top:13px;right:14px;width:34px;height:34px;border:0;background:transparent;color:#171511;font-size:24px;line-height:1;cursor:pointer;border-radius:999px;display:grid;place-items:center}
      #${ROOT_ID} .vnp-close:hover{background:rgba(23,21,17,.07)}
      #${ROOT_ID} .vnp-brand{display:flex;align-items:flex-end;gap:3px;margin:0 0 24px;font-size:20px;font-weight:950;letter-spacing:-1px}
      #${ROOT_ID} .vnp-dot{width:6px;height:6px;background:#d94d73;display:inline-block;margin-bottom:2px}
      #${ROOT_ID} .vnp-kicker{margin:0 0 9px;font-size:10px;line-height:1;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#625d56}
      #${ROOT_ID} h2{margin:0 0 13px;font-family:Georgia,'Times New Roman',serif;font-size:42px;line-height:.98;font-weight:500;letter-spacing:-.045em;color:#171511}
      #${ROOT_ID} .vnp-copy{margin:0 0 21px;max-width:380px;font-size:14px;line-height:1.62;color:#4e4943}
      #${ROOT_ID} form{margin:0}
      #${ROOT_ID} .vnp-row{display:flex;gap:8px;align-items:stretch}
      #${ROOT_ID} input[type=email]{flex:1 1 auto;min-width:0;box-sizing:border-box;border:1px solid #aaa49c;background:#f7f4ee;color:#171511;border-radius:999px;padding:13px 15px;font:500 13px/1 Arial,Helvetica,sans-serif;outline:none}
      #${ROOT_ID} input[type=email]:focus{border-color:#5f5952;box-shadow:0 0 0 3px rgba(95,89,82,.12)}
      #${ROOT_ID} button[type=submit]{flex:0 0 auto;border:0;border-radius:999px;background:#171511;color:#fff;padding:0 18px;font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
      #${ROOT_ID} button[type=submit]:disabled{opacity:.56;cursor:default}
      #${ROOT_ID} .vnp-note{margin:12px 0 0;font-size:9.5px;line-height:1.45;color:#746e67}
      #${ROOT_ID} .vnp-status{min-height:16px;margin:10px 0 0;font-size:11px;line-height:1.45;color:#625d56}
      #${ROOT_ID} .vnp-status.ok{color:#3f6249}
      #${ROOT_ID} .vnp-status.err{color:#8a473f}
      @keyframes vnpFade{from{opacity:0}to{opacity:1}}
      @keyframes vnpRise{from{opacity:0;transform:translateY(10px) scale(.99)}to{opacity:1;transform:none}}
      @media(max-width:600px){
        #${ROOT_ID}{padding:16px;place-items:center}
        #${ROOT_ID} .vnp-card{width:min(100%,420px);padding:30px 22px 24px;border-radius:16px}
        #${ROOT_ID} h2{font-size:36px}
        #${ROOT_ID} .vnp-row{display:block}
        #${ROOT_ID} input[type=email],#${ROOT_ID} button[type=submit]{width:100%}
        #${ROOT_ID} button[type=submit]{height:45px;margin-top:8px}
      }
      @media(prefers-reduced-motion:reduce){#${ROOT_ID},#${ROOT_ID} .vnp-card{animation:none}}
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
        <button class="vnp-close" type="button" aria-label="Close newsletter sign-up">×</button>
        <div class="vnp-brand" aria-label="VYRDICT"><span>VYRDICT</span><span class="vnp-dot" aria-hidden="true"></span></div>
        <p class="vnp-kicker">Weekly VYRDICT</p>
        <h2 id="vnp-title">Welcome to VYRDICT.</h2>
        <p class="vnp-copy">Be first to know about breakout products, new launches and culture moments — plus what’s actually worth the hype.</p>
        <form novalidate>
          <div class="vnp-row">
            <input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email address" placeholder="Email address" required>
            <button type="submit">Subscribe</button>
          </div>
          <div class="vnp-status" role="status" aria-live="polite"></div>
          <p class="vnp-note">By subscribing, you agree to receive Weekly VYRDICT emails. Unsubscribe anytime.</p>
        </form>
      </div>`;

    document.body.appendChild(root);
    document.documentElement.style.overflow='hidden';

    const card=root.querySelector('.vnp-card');
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
        status.textContent='You’re in — welcome to Weekly VYRDICT.';
        button.textContent='Subscribed ✓';
        setTimeout(close,1350);
      }catch(err){
        status.classList.add('err');
        status.textContent='We couldn’t subscribe you just now. Please try again.';
        button.disabled=false;
        button.textContent='Subscribe';
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
