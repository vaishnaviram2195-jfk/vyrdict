(()=>{
  if(window.__vyrdictNewsletterWelcomePopupV5)return;
  window.__vyrdictNewsletterWelcomePopupV5=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';
  const ROOT_ID='vyrdict-newsletter-welcome';
  const STYLE_ID='vyrdict-newsletter-welcome-style-v5';
  const SESSION_KEY='vyrdict:newsletter-popup-seen:v5';
  const SUBSCRIBED_KEY='vyrdict:newsletter-subscribed:v1';

  function shouldSkip(){
    try{
      if(localStorage.getItem(SUBSCRIBED_KEY)==='1')return true;
      if(sessionStorage.getItem(SESSION_KEY)==='1')return true;
    }catch{}
    return false;
  }
  function markSeen(){try{sessionStorage.setItem(SESSION_KEY,'1')}catch{}}
  function markSubscribed(){try{localStorage.setItem(SUBSCRIBED_KEY,'1');sessionStorage.setItem(SESSION_KEY,'1')}catch{}}

  function ensureStyle(){
    ['vyrdict-newsletter-welcome-style','vyrdict-newsletter-welcome-style-v2','vyrdict-newsletter-welcome-style-v3','vyrdict-newsletter-welcome-style-v4'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${ROOT_ID}{position:fixed;inset:0;z-index:2147482500;display:grid;place-items:center;padding:18px;background:rgba(24,24,22,.28);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);font-family:Arial,Helvetica,sans-serif;animation:vnpFade .18s ease-out both}
      #${ROOT_ID} .vnp-card{position:relative;width:min(360px,calc(100vw - 30px));box-sizing:border-box;background:#f5f2ea;color:#20211d;border:1px solid #d8d2c8;border-radius:14px;padding:24px 22px 20px;box-shadow:0 18px 54px rgba(0,0,0,.18);animation:vnpRise .2s ease-out both}
      #${ROOT_ID} .vnp-card:before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:#5c6b51;border-radius:14px 14px 0 0}
      #${ROOT_ID} .vnp-close{position:absolute;top:9px;right:10px;width:30px;height:30px;border:0;background:transparent;color:#5f615a;font-size:21px;line-height:1;cursor:pointer;border-radius:50%;display:grid;place-items:center}
      #${ROOT_ID} .vnp-close:hover{background:rgba(32,33,29,.06);color:#20211d}
      #${ROOT_ID} .vnp-brand{display:flex;align-items:flex-end;gap:3px;margin:1px 0 16px;font-size:16px;font-weight:950;letter-spacing:-.7px;color:#20211d}
      #${ROOT_ID} .vnp-dot{width:5px;height:5px;background:#5c6b51;display:inline-block;margin-bottom:2px}
      #${ROOT_ID} .vnp-kicker{margin:0 0 8px;font-size:8px;line-height:1;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#66705f}
      #${ROOT_ID} h2{margin:0 0 10px;max-width:280px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1;font-weight:500;letter-spacing:-.04em;color:#20211d}
      #${ROOT_ID} .vnp-copy{margin:0 0 16px;max-width:305px;font-size:12.5px;line-height:1.52;color:#61635d}
      #${ROOT_ID} form{margin:0}
      #${ROOT_ID} .vnp-row{display:grid;grid-template-columns:1fr auto;gap:7px;align-items:stretch}
      #${ROOT_ID} input[type=email]{min-width:0;box-sizing:border-box;border:1px solid #c9c5bc;background:#fff;color:#20211d;border-radius:8px;padding:11px 12px;font:500 12px/1 Arial,Helvetica,sans-serif;outline:none}
      #${ROOT_ID} input[type=email]::placeholder{color:#939087}
      #${ROOT_ID} input[type=email]:focus{border-color:#5c6b51;box-shadow:0 0 0 2px rgba(92,107,81,.12)}
      #${ROOT_ID} button[type=submit]{border:0;border-radius:8px;background:#5c6b51;color:#fff;padding:0 14px;font-size:9px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:background .15s ease,transform .15s ease}
      #${ROOT_ID} button[type=submit]:hover{background:#4b5942;transform:translateY(-1px)}
      #${ROOT_ID} button[type=submit]:disabled{opacity:.58;cursor:default;transform:none}
      #${ROOT_ID} .vnp-note{margin:9px 0 0;font-size:8.5px;line-height:1.4;color:#86837b}
      #${ROOT_ID} .vnp-status{min-height:14px;margin:7px 0 0;font-size:10px;line-height:1.4;color:#61635d}
      #${ROOT_ID} .vnp-status.ok{color:#4d6647;font-weight:700}
      #${ROOT_ID} .vnp-status.err{color:#8b4d44}
      @keyframes vnpFade{from{opacity:0}to{opacity:1}}
      @keyframes vnpRise{from{opacity:0;transform:translateY(8px) scale(.99)}to{opacity:1;transform:none}}
      @media(max-width:520px){
        #${ROOT_ID}{padding:14px}
        #${ROOT_ID} .vnp-card{width:min(100%,340px);padding:22px 18px 18px;border-radius:13px}
        #${ROOT_ID} h2{font-size:28px;max-width:250px}
        #${ROOT_ID} .vnp-copy{font-size:12px}
        #${ROOT_ID} .vnp-row{grid-template-columns:1fr}
        #${ROOT_ID} button[type=submit]{height:40px}
      }
      @media(prefers-reduced-motion:reduce){#${ROOT_ID},#${ROOT_ID} .vnp-card{animation:none}#${ROOT_ID} button[type=submit]{transition:none}}
    `;
    document.head.appendChild(s);
  }

  function close(){const root=document.getElementById(ROOT_ID);if(!root)return;markSeen();root.remove();document.documentElement.style.overflow=''}

  function mount(){
    if(shouldSkip()||document.getElementById(ROOT_ID))return;
    ensureStyle();markSeen();
    const root=document.createElement('div');
    root.id=ROOT_ID;root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','vnp-title');
    root.innerHTML=`
      <div class="vnp-card" role="document">
        <button class="vnp-close" type="button" aria-label="Close newsletter sign-up">×</button>
        <div class="vnp-brand" aria-label="VYRDICT"><span>VYRDICT</span><span class="vnp-dot" aria-hidden="true"></span></div>
        <p class="vnp-kicker">WEEKLY VYRDICT</p>
        <h2 id="vnp-title">Welcome to VYRDICT.</h2>
        <p class="vnp-copy">A weekly edit of breakout products, fresh launches and what’s actually worth the hype.</p>
        <form novalidate>
          <div class="vnp-row">
            <input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email address" placeholder="Email address" required>
            <button type="submit">Subscribe</button>
          </div>
          <div class="vnp-status" role="status" aria-live="polite"></div>
          <p class="vnp-note">One email a week. Unsubscribe anytime.</p>
        </form>
      </div>`;
    document.body.appendChild(root);document.documentElement.style.overflow='hidden';
    const closeBtn=root.querySelector('.vnp-close'),form=root.querySelector('form'),input=root.querySelector('input[type=email]'),button=root.querySelector('button[type=submit]'),status=root.querySelector('.vnp-status');
    closeBtn.addEventListener('click',close);root.addEventListener('click',e=>{if(e.target===root)close()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById(ROOT_ID))close()},{once:true});
    form.addEventListener('submit',async e=>{
      e.preventDefault();const email=String(input.value||'').trim().toLowerCase();status.className='vnp-status';status.textContent='';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)){status.classList.add('err');status.textContent='Enter a valid email address.';input.focus();return}
      button.disabled=true;button.textContent='Joining…';
      try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source:'welcome_popup',website:''})});const out=await r.json().catch(()=>({}));if(!r.ok)throw new Error(out.error||'subscription_failed');markSubscribed();status.classList.add('ok');status.textContent='You’re in — welcome to Weekly VYRDICT.';button.textContent='Joined ✓';setTimeout(close,1200)}
      catch(err){status.classList.add('err');status.textContent='We couldn’t subscribe you just now. Please try again.';button.disabled=false;button.textContent='Subscribe'}
    });
    setTimeout(()=>input.focus({preventScroll:true}),100);
  }

  function schedule(){if(shouldSkip())return;setTimeout(mount,1400)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
