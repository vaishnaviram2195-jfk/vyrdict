(()=>{
  if(window.__vyrdictCompanyFooterV2)return;
  window.__vyrdictCompanyFooterV2=1;

  const FOOTER_ID='vyrdict-company-footer';
  const STYLE_ID='vyrdict-company-footer-style-v2';
  const INTENT_KEY='vyrdict:footer-intent';
  const MODAL_ID='vyrdict-newsletter-primary';
  const NEWS='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
#${FOOTER_ID}{background:#eee3da;color:#171511;border-top:1px solid #d8cec4;font-family:Arial,Helvetica,sans-serif;overflow:hidden}
#${FOOTER_ID} *{box-sizing:border-box}
#${FOOTER_ID} .vf-shell{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:50px 0 20px}
#${FOOTER_ID} .vf-grid{display:grid;grid-template-columns:1.45fr repeat(3,minmax(0,1fr));gap:46px;align-items:start}
#${FOOTER_ID} .vf-brand-name{display:inline-flex;align-items:baseline;color:#171511;text-decoration:none;font-size:28px;font-weight:950;letter-spacing:-.065em;line-height:1}
#${FOOTER_ID} .vf-logo-dot{display:inline-block;width:.19em;height:.19em;margin-left:.055em;background:#ed5d78;flex:0 0 auto}
#${FOOTER_ID} .vf-brand-name .vf-logo-dot{transform:translateY(-.02em)}
#${FOOTER_ID} .vf-brand p{max-width:245px;margin:14px 0 0;color:#6d675f;font-size:13px;line-height:1.6}
#${FOOTER_ID} .vf-col h2{margin:1px 0 17px;color:#6d675f;font-size:9px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}
#${FOOTER_ID} .vf-links{display:flex;flex-direction:column;align-items:flex-start;gap:11px}
#${FOOTER_ID} .vf-links a{color:#302c28;text-decoration:none;font-size:12px;line-height:1.4;transition:opacity .16s ease,transform .16s ease}
#${FOOTER_ID} .vf-links a:hover{opacity:.62;transform:translateX(2px)}
#${FOOTER_ID} .vf-rule{height:1px;background:#cfc2b7;margin:34px 0 18px}
#${FOOTER_ID} .vf-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px;color:#746d66;font-size:9px;line-height:1.5;letter-spacing:.02em}
#${FOOTER_ID} .vf-associate{margin-top:8px;color:#746d66;font-size:9px;line-height:1.5;letter-spacing:.01em}
#${FOOTER_ID} .vf-wordmark{margin:30px 0 4px;font-size:clamp(54px,7vw,92px);font-weight:950;letter-spacing:-.075em;line-height:.88;white-space:nowrap;color:#171511;user-select:none;display:flex;align-items:flex-end}
#${FOOTER_ID} .vf-wordmark .vf-logo-dot{transform:translateY(-.02em)}
#${MODAL_ID}{position:fixed;inset:0;z-index:2147482500;display:grid;place-items:center;padding:18px;background:rgba(24,24,22,.28);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);font-family:Arial,Helvetica,sans-serif}
#${MODAL_ID} *{box-sizing:border-box}
#${MODAL_ID} .vn-card{position:relative;width:min(390px,calc(100vw - 30px));background:#f5f2ea;color:#20211d;border:1px solid #d8d2c8;border-radius:14px;padding:25px 22px 20px;box-shadow:0 18px 54px rgba(0,0,0,.18)}
#${MODAL_ID} .vn-card:before{content:'';position:absolute;left:0;right:0;top:0;height:4px;background:#5c6b51;border-radius:14px 14px 0 0}
#${MODAL_ID} .vn-close{position:absolute;top:9px;right:10px;width:30px;height:30px;border:0;background:transparent;color:#5f615a;font-size:21px;line-height:1;cursor:pointer;border-radius:50%}
#${MODAL_ID} .vn-brand{display:flex;align-items:flex-end;gap:3px;margin:1px 0 16px;font-size:16px;font-weight:950;letter-spacing:-.7px}
#${MODAL_ID} .vn-dot{width:5px;height:5px;background:#5c6b51;display:inline-block;margin-bottom:2px}
#${MODAL_ID} .vn-kicker{margin:0 0 8px;font-size:8px;line-height:1;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#66705f}
#${MODAL_ID} h2{margin:0 0 10px;font:500 30px/1 Georgia,'Times New Roman',serif;letter-spacing:-.04em}
#${MODAL_ID} .vn-copy{margin:0 0 16px;font-size:12.5px;line-height:1.52;color:#61635d}
#${MODAL_ID} .vn-row{display:grid;grid-template-columns:1fr auto;gap:7px}
#${MODAL_ID} input[type=email]{min-width:0;border:1px solid #c9c5bc;background:#fff;color:#20211d;border-radius:8px;padding:11px 12px;font:500 12px/1 Arial,Helvetica,sans-serif;outline:none}
#${MODAL_ID} input[type=email]:focus{border-color:#5c6b51;box-shadow:0 0 0 2px rgba(92,107,81,.12)}
#${MODAL_ID} button[type=submit]{border:0;border-radius:8px;background:#5c6b51;color:#fff;padding:0 14px;font-size:9px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
#${MODAL_ID} button[type=submit]:disabled{opacity:.58;cursor:default}
#${MODAL_ID} .vn-note{margin:9px 0 0;font-size:8.5px;line-height:1.4;color:#86837b}
#${MODAL_ID} .vn-status{min-height:14px;margin:7px 0 0;font-size:10px;line-height:1.4;color:#61635d}
#${MODAL_ID} .vn-status.ok{color:#4d6647;font-weight:700}#${MODAL_ID} .vn-status.err{color:#8b4d44}
@media(max-width:860px){#${FOOTER_ID} .vf-grid{grid-template-columns:1.25fr repeat(3,1fr);gap:24px}#${FOOTER_ID} .vf-shell{padding-top:44px}}
@media(max-width:650px){#${FOOTER_ID} .vf-shell{width:min(100% - 34px,1180px);padding-top:40px}#${FOOTER_ID} .vf-grid{grid-template-columns:1fr 1fr;gap:32px 24px}#${FOOTER_ID} .vf-brand{grid-column:1/-1}#${FOOTER_ID} .vf-brand p{max-width:32ch}#${FOOTER_ID} .vf-bottom{align-items:flex-start;flex-direction:column;gap:5px}#${FOOTER_ID} .vf-wordmark{font-size:clamp(48px,14vw,68px);margin-top:28px}#${MODAL_ID} .vn-row{grid-template-columns:1fr}#${MODAL_ID} button[type=submit]{height:40px}}
@media(max-width:390px){#${FOOTER_ID} .vf-grid{grid-template-columns:1fr 1fr;gap:28px 18px}#${FOOTER_ID} .vf-links a{font-size:11px}}
`;
    document.head.appendChild(s);
  }

  function closeNewsletter(){
    document.getElementById(MODAL_ID)?.remove();
    document.documentElement.style.overflow='';
  }

  function openNewsletter(){
    if(document.getElementById(MODAL_ID))return;
    addStyle();
    const root=document.createElement('div');
    root.id=MODAL_ID;
    root.setAttribute('role','dialog');
    root.setAttribute('aria-modal','true');
    root.setAttribute('aria-labelledby','vn-title');
    root.innerHTML=`<div class="vn-card" role="document"><button class="vn-close" type="button" aria-label="Close newsletter sign-up">×</button><div class="vn-brand"><span>VYRDICT</span><span class="vn-dot" aria-hidden="true"></span></div><p class="vn-kicker">WEEKLY VYRDICT</p><h2 id="vn-title">The week’s hype, edited down.</h2><p class="vn-copy">Five viral finds, carefully curated so you know what’s actually worth it. Every Monday morning.</p><form novalidate><div class="vn-row"><input type="email" name="email" inputmode="email" autocomplete="email" maxlength="254" aria-label="Email address" placeholder="Email address" required><button type="submit">Subscribe</button></div><div class="vn-status" role="status" aria-live="polite"></div><p class="vn-note">One email a week. Unsubscribe anytime.</p></form></div>`;
    document.body.appendChild(root);
    document.documentElement.style.overflow='hidden';
    const close=root.querySelector('.vn-close'),form=root.querySelector('form'),input=root.querySelector('input[type=email]'),button=root.querySelector('button[type=submit]'),status=root.querySelector('.vn-status');
    close.addEventListener('click',closeNewsletter);
    root.addEventListener('click',e=>{if(e.target===root)closeNewsletter()});
    const esc=e=>{if(e.key==='Escape'){closeNewsletter();document.removeEventListener('keydown',esc)}};
    document.addEventListener('keydown',esc);
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const email=String(input.value||'').trim().toLowerCase();
      status.className='vn-status';status.textContent='';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)){status.classList.add('err');status.textContent='Enter a valid email address.';input.focus();return}
      button.disabled=true;button.textContent='Joining…';
      try{
        const r=await fetch(NEWS,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source:'primary_newsletter_nav',website:''})});
        const out=await r.json().catch(()=>({}));
        if(!r.ok)throw new Error(out.error||'subscription_failed');
        status.classList.add('ok');status.textContent='You’re in — welcome to Weekly VYRDICT.';button.textContent='Joined ✓';
        window.VyrdictAnalytics?.send?.('newsletter_signup',{source:'primary_newsletter_nav'});
        setTimeout(closeNewsletter,1100);
      }catch(err){status.classList.add('err');status.textContent='We couldn’t subscribe you just now. Please try again.';button.disabled=false;button.textContent='Subscribe'}
    });
    setTimeout(()=>input.focus({preventScroll:true}),80);
  }
  window.VyrdictNewsletter={...(window.VyrdictNewsletter||{}),open:openNewsletter,close:closeNewsletter};

  function ensureNewsletterNav(){
    if(document.querySelector('[data-vyrdict-newsletter-entry]'))return;
    const areas=[...document.querySelectorAll('header nav,header,[role="navigation"],nav')].filter(area=>!area.closest('#'+FOOTER_ID));
    const area=areas.find(a=>{
      const t=norm(a.textContent);
      let score=0;['explore','categories','culture','account','saves'].forEach(x=>{if(t.includes(x))score++});
      return score>=2;
    });
    if(!area)return;
    const items=[...area.querySelectorAll('a,button,[data-nav]')].filter(x=>!x.closest('#'+FOOTER_ID));
    const existing=items.find(x=>norm(x.textContent)==='newsletter');
    if(existing){existing.setAttribute('data-vyrdict-newsletter-entry','1');return}
    const culture=items.find(x=>norm(x.textContent)==='culture');
    const account=items.find(x=>norm(x.textContent)==='account');
    const saves=items.find(x=>norm(x.textContent)==='saves'||norm(x.textContent)==='saved');
    const template=culture||items.find(x=>norm(x.textContent)==='categories')||items.find(x=>norm(x.textContent)==='explore')||items[0];
    if(!template)return;
    const entry=template.cloneNode(true);
    [...entry.attributes].forEach(a=>{if(a.name.startsWith('data-vyrdict-topnav')||a.name==='data-nav'||a.name==='id')entry.removeAttribute(a.name)});
    entry.setAttribute('data-vyrdict-newsletter-entry','1');
    entry.setAttribute('aria-label','Newsletter');
    entry.textContent='Newsletter';
    if(entry.tagName==='A')entry.setAttribute('href','#newsletter');
    if(entry.tagName==='BUTTON')entry.type='button';
    if(culture)culture.insertAdjacentElement('afterend',entry);
    else if(account)account.insertAdjacentElement('beforebegin',entry);
    else if(saves)saves.insertAdjacentElement('beforebegin',entry);
    else area.appendChild(entry);
  }

  function build(){
    if(document.getElementById(FOOTER_ID))return;
    addStyle();
    const footer=document.createElement('footer');
    footer.id=FOOTER_ID;
    footer.setAttribute('aria-label','VYRDICT footer');
    footer.innerHTML=`<div class="vf-shell"><div class="vf-grid"><div class="vf-brand"><a class="vf-brand-name" href="/" aria-label="VYRDICT home">VYRDICT<span class="vf-logo-dot" aria-hidden="true"></span></a><p>The verdict on what’s trending.</p></div><nav class="vf-col" aria-label="Discover"><h2>Discover</h2><div class="vf-links"><a href="/#explore" data-vf-action="weekly">Weekly Viral Rankings</a><a href="/#categories" data-vf-action="categories">Browse Categories</a><a href="/#skip-list" data-vf-action="skip">Skip List</a><a href="/saved" data-vf-action="saved">Saved Products</a></div></nav><nav class="vf-col" aria-label="Trust"><h2>Trust</h2><div class="vf-links"><a href="/how-vyrdict-scores.html" data-vyrdict-scores>How Scores Work</a><a href="/editorial-policy.html">Editorial Policy</a><a href="/terms.html#affiliate-disclosure">Affiliate Disclosure</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="mailto:hello@vyrdict.com?subject=VYRDICT%20Security%20Report">Security Reporting</a></div></nav><nav class="vf-col" aria-label="Connect"><h2>Connect</h2><div class="vf-links"><a href="https://www.linkedin.com/company/143431971/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://www.instagram.com/vyrdict.co/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="/careers">Careers</a><a href="/suggest-product.html" data-vyrdict-suggest>Suggest a Product</a><a href="mailto:hello@vyrdict.com">hello@vyrdict.com</a></div></nav></div><div class="vf-rule"></div><div class="vf-bottom"><span>© 2026 VYRDICT. All Rights Reserved.</span><span>Independent viral-product discovery and editorial scoring.</span></div><div class="vf-associate">As an Amazon Associate I earn from qualifying purchases.</div><div class="vf-wordmark" aria-hidden="true">VYRDICT<span class="vf-logo-dot"></span></div></div>`;
    document.body.appendChild(footer);
  }

  function sectionFor(phrases){const nodes=[...document.querySelectorAll('h1,h2,h3,h4,.eyebrow,.skipflag')].filter(x=>!x.closest('#'+FOOTER_ID));for(const phrase of phrases){const q=norm(phrase);const hit=nodes.find(x=>norm(x.textContent).includes(q));if(hit)return hit.closest('section')||hit.closest('.section')||hit}return null}
  function atHome(){return location.pathname==='/'&&(!location.hash||!/^#\/(product|category|search|saved)/i.test(location.hash))}
  function perform(action){if(action==='saved'){location.assign('/saved');return true}let target=null;if(action==='skip')target=document.getElementById('skip-list');if(action==='weekly')target=document.getElementById('trending-index')||sectionFor(['weekly viral rankings','weekly rankings',"what's trending now"]);if(action==='categories')target=sectionFor(['browse by category','take what you need','categories']);if(target){target.scrollIntoView({behavior:'smooth',block:'start'});return true}return false}
  function sendHome(action){try{sessionStorage.setItem(INTENT_KEY,action)}catch{}location.href='/'}
  function retryIntent(){let action='';try{action=sessionStorage.getItem(INTENT_KEY)||''}catch{}if(!action)return;[140,420,850,1450,2200].forEach(ms=>setTimeout(()=>{if(!action)return;if(perform(action)){try{sessionStorage.removeItem(INTENT_KEY)}catch{}action=''}},ms))}

  document.addEventListener('click',e=>{
    const news=e.target.closest?.('[data-vyrdict-newsletter-entry]');
    if(news){e.preventDefault();e.stopPropagation();openNewsletter();return}
    const a=e.target.closest?.('[data-vf-action]');
    if(!a)return;
    e.preventDefault();const action=a.dataset.vfAction;
    if(!perform(action)){if(atHome()){setTimeout(()=>perform(action),300);setTimeout(()=>perform(action),900)}else sendHome(action)}
  },true);

  const start=()=>{build();retryIntent();ensureNewsletterNav();[150,500,1200,2400].forEach(ms=>setTimeout(ensureNewsletterNav,ms));if(!window.__vyrdictNewsletterNavObserver){window.__vyrdictNewsletterNavObserver=new MutationObserver(()=>ensureNewsletterNav());window.__vyrdictNewsletterNavObserver.observe(document.body,{childList:true,subtree:true})}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
