(()=>{
  if(window.__vyrdictCompanyFooter)return;
  window.__vyrdictCompanyFooter=1;

  const FOOTER_ID='vyrdict-company-footer';
  const STYLE_ID='vyrdict-company-footer-style';
  const INTENT_KEY='vyrdict:footer-intent';
  const NEWS='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-subscribe';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
#${FOOTER_ID}{background:#eee3da;color:#171511;border-top:1px solid #d8cec4;font-family:Arial,Helvetica,sans-serif;overflow:hidden}
#${FOOTER_ID} *{box-sizing:border-box}
#${FOOTER_ID} .vf-shell{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:54px 0 20px}
#${FOOTER_ID} .vf-grid{display:grid;grid-template-columns:1.45fr repeat(3,minmax(0,1fr));gap:46px;align-items:start}
#${FOOTER_ID} .vf-brand-name{display:inline-flex;align-items:baseline;color:#171511;text-decoration:none;font-size:28px;font-weight:950;letter-spacing:-.065em;line-height:1}
#${FOOTER_ID} .vf-logo-dot{display:inline-block;width:.19em;height:.19em;margin-left:.055em;background:#ed5d78;flex:0 0 auto}
#${FOOTER_ID} .vf-brand-name .vf-logo-dot{transform:translateY(-.02em)}
#${FOOTER_ID} .vf-brand p{max-width:245px;margin:14px 0 0;color:#6d675f;font-size:13px;line-height:1.6}
#${FOOTER_ID} .vf-col h2{margin:1px 0 17px;color:#6d675f;font-size:9px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}
#${FOOTER_ID} .vf-links{display:flex;flex-direction:column;align-items:flex-start;gap:11px}
#${FOOTER_ID} .vf-links a{color:#302c28;text-decoration:none;font-size:12px;line-height:1.4;transition:opacity .16s ease,transform .16s ease}
#${FOOTER_ID} .vf-links a:hover{opacity:.62;transform:translateX(2px)}
#${FOOTER_ID} .vf-news{margin-top:46px;padding:28px 0;border-top:1px solid #cfc2b7;border-bottom:1px solid #cfc2b7;display:grid;grid-template-columns:1fr minmax(320px,520px);gap:38px;align-items:center}
#${FOOTER_ID} .vf-news-kicker{font-size:9px;font-weight:950;line-height:1;letter-spacing:.14em;text-transform:uppercase;color:#6d675f;margin-bottom:9px}
#${FOOTER_ID} .vf-news h2{font:400 31px/.98 Georgia,'Times New Roman',serif;letter-spacing:-.035em;margin:0;color:#171511}
#${FOOTER_ID} .vf-news p{font-size:11px;line-height:1.55;color:#6d675f;margin:10px 0 0;max-width:48ch}
#${FOOTER_ID} .vf-news-form{display:flex;gap:9px;align-items:center}
#${FOOTER_ID} .vf-news input[type=email]{flex:1;min-width:0;border:1px solid #cfc2b7;background:#fffdf8;border-radius:999px;padding:13px 15px;font:13px/1 Arial,Helvetica,sans-serif;color:#171511;outline:none}
#${FOOTER_ID} .vf-news input[type=email]:focus{border-color:#8f867e;box-shadow:0 0 0 3px rgba(143,134,126,.12)}
#${FOOTER_ID} .vf-news button{border:0;border-radius:999px;background:#171511;color:#fff;padding:13px 18px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
#${FOOTER_ID} .vf-news button:disabled{opacity:.55;cursor:default}
#${FOOTER_ID} .vf-news-status{min-height:16px;margin-top:8px;font-size:10px;line-height:1.4;color:#6d675f}
#${FOOTER_ID} .vf-news-status.ok{color:#49624b}#${FOOTER_ID} .vf-news-status.err{color:#8b4f43}
#${FOOTER_ID} .vf-news-consent{font-size:8.5px;line-height:1.45;color:#7b746d;margin-top:4px}
#${FOOTER_ID} .vf-hp{position:absolute;left:-9999px;opacity:0;pointer-events:none}
#${FOOTER_ID} .vf-rule{height:1px;background:#cfc2b7;margin:28px 0 18px}
#${FOOTER_ID} .vf-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px;color:#746d66;font-size:9px;line-height:1.5;letter-spacing:.02em}
#${FOOTER_ID} .vf-associate{margin-top:8px;color:#746d66;font-size:9px;line-height:1.5;letter-spacing:.01em}
#${FOOTER_ID} .vf-wordmark{margin:34px 0 4px;font-size:clamp(54px,7vw,92px);font-weight:950;letter-spacing:-.075em;line-height:.88;white-space:nowrap;color:#171511;user-select:none;display:flex;align-items:flex-end}
#${FOOTER_ID} .vf-wordmark .vf-logo-dot{transform:translateY(-.02em)}
@media(max-width:860px){#${FOOTER_ID} .vf-grid{grid-template-columns:1.25fr repeat(3,1fr);gap:24px}#${FOOTER_ID} .vf-shell{padding-top:44px}#${FOOTER_ID} .vf-news{grid-template-columns:1fr;gap:22px}}
@media(max-width:650px){#${FOOTER_ID} .vf-shell{width:min(100% - 34px,1180px);padding-top:40px}#${FOOTER_ID} .vf-grid{grid-template-columns:1fr 1fr;gap:32px 24px}#${FOOTER_ID} .vf-brand{grid-column:1/-1}#${FOOTER_ID} .vf-brand p{max-width:32ch}#${FOOTER_ID} .vf-news{margin-top:38px;padding:25px 0}#${FOOTER_ID} .vf-news-form{flex-direction:column;align-items:stretch}#${FOOTER_ID} .vf-news button{width:100%}#${FOOTER_ID} .vf-bottom{align-items:flex-start;flex-direction:column;gap:5px}#${FOOTER_ID} .vf-wordmark{font-size:clamp(48px,14vw,68px);margin-top:28px;letter-spacing:-.075em}}
@media(max-width:390px){#${FOOTER_ID} .vf-grid{grid-template-columns:1fr 1fr;gap:28px 18px}#${FOOTER_ID} .vf-links a{font-size:11px}}
`;
    document.head.appendChild(s);
  }

  function bindNewsletter(footer){
    const form=footer.querySelector('[data-vf-news-form]');
    const status=footer.querySelector('[data-vf-news-status]');
    if(!form||form.dataset.bound)return;
    form.dataset.bound='1';
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=form.querySelector('button');
      const email=(form.email.value||'').trim();
      status.className='vf-news-status';status.textContent='';
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email)){status.classList.add('err');status.textContent='Add a valid email first.';return}
      btn.disabled=true;btn.textContent='Joining…';
      try{
        const r=await fetch(NEWS,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,website:form.website.value,source:'footer_weekly'})});
        if(!r.ok)throw 0;
        form.reset();status.classList.add('ok');status.textContent='You’re in. Weekly VYRDICT lands every Monday morning.';
        window.VyrdictAnalytics?.send?.('newsletter_signup',{source:'footer_weekly'});
      }catch{status.classList.add('err');status.textContent='Could not subscribe right now. Please try again.'}
      finally{btn.disabled=false;btn.textContent='Join weekly'}
    });
  }

  function build(){
    if(document.getElementById(FOOTER_ID))return;
    addStyle();
    const footer=document.createElement('footer');
    footer.id=FOOTER_ID;
    footer.setAttribute('aria-label','VYRDICT footer');
    footer.innerHTML=`<div class="vf-shell"><div class="vf-grid"><div class="vf-brand"><a class="vf-brand-name" href="/" aria-label="VYRDICT home">VYRDICT<span class="vf-logo-dot" aria-hidden="true"></span></a><p>The verdict on what’s trending.</p></div><nav class="vf-col" aria-label="Discover"><h2>Discover</h2><div class="vf-links"><a href="/" data-vf-action="weekly">Weekly Viral Rankings</a><a href="/" data-vf-action="categories">Browse Categories</a><a href="/" data-vf-action="skip">Skip List</a><a href="/#/saved" data-vf-action="saved">Saved Products</a></div></nav><nav class="vf-col" aria-label="Trust"><h2>Trust</h2><div class="vf-links"><a href="/how-vyrdict-scores.html" data-vyrdict-scores>How Scores Work</a><a href="/editorial-policy.html">Editorial Policy</a><a href="/terms.html#affiliate-disclosure">Affiliate Disclosure</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="mailto:hello@vyrdict.com?subject=VYRDICT%20Security%20Report">Security Reporting</a></div></nav><nav class="vf-col" aria-label="Connect"><h2>Connect</h2><div class="vf-links"><a href="https://www.linkedin.com/company/143431971/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a><a href="https://www.instagram.com/vyrdict.co/" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://www.tiktok.com/@vyrdict" target="_blank" rel="noopener noreferrer">TikTok ↗</a><a href="/careers">Careers</a><a href="/suggest-product.html" data-vyrdict-suggest>Suggest a Product</a><a href="mailto:hello@vyrdict.com">hello@vyrdict.com</a></div></nav></div><section class="vf-news" aria-label="Join Weekly VYRDICT"><div><div class="vf-news-kicker">Weekly VYRDICT</div><h2>The week’s hype, edited down.</h2><p>Five viral finds, carefully curated so you know what’s actually worth it. Every Monday morning.</p></div><div><form class="vf-news-form" data-vf-news-form><input type="email" name="email" maxlength="254" required autocomplete="email" placeholder="you@email.com" aria-label="Email address"><input class="vf-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true"><button type="submit">Join weekly</button></form><div class="vf-news-status" data-vf-news-status role="status" aria-live="polite"></div><div class="vf-news-consent">By subscribing, you agree to receive Weekly VYRDICT emails. Unsubscribe anytime.</div></div></section><div class="vf-rule"></div><div class="vf-bottom"><span>© 2026 VYRDICT. All Rights Reserved.</span><span>Independent viral-product discovery and editorial scoring.</span></div><div class="vf-associate">As an Amazon Associate I earn from qualifying purchases.</div><div class="vf-wordmark" aria-hidden="true">VYRDICT<span class="vf-logo-dot"></span></div></div>`;
    document.body.appendChild(footer);bindNewsletter(footer);
  }

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  function sectionFor(phrases){const nodes=[...document.querySelectorAll('h1,h2,h3,h4,.eyebrow,.skipflag')].filter(x=>!x.closest('#'+FOOTER_ID));for(const phrase of phrases){const q=norm(phrase);const hit=nodes.find(x=>norm(x.textContent).includes(q));if(hit)return hit.closest('section')||hit.closest('.section')||hit}return null}
  function atHome(){return location.pathname==='/'&&(!location.hash||!/^#\/(product|category|search|saved)/i.test(location.hash))}
  function perform(action){if(action==='saved'){if(location.pathname!=='/')location.href='/#/saved';else location.hash='#/saved';return true}let target=null;if(action==='skip')target=document.getElementById('skip-list');if(action==='weekly')target=sectionFor(['weekly viral rankings','weekly rankings',"what's trending now"]);if(action==='categories')target=sectionFor(['browse by category','take what you need','categories']);if(target){target.scrollIntoView({behavior:'smooth',block:'start'});return true}return false}
  function sendHome(action){try{sessionStorage.setItem(INTENT_KEY,action)}catch{}location.href='/'}
  function retryIntent(){let action='';try{action=sessionStorage.getItem(INTENT_KEY)||''}catch{}if(!action)return;[140,420,850,1450,2200].forEach(ms=>setTimeout(()=>{if(!action)return;if(perform(action)){try{sessionStorage.removeItem(INTENT_KEY)}catch{}action=''}},ms))}
  document.addEventListener('click',e=>{const a=e.target.closest?.('[data-vf-action]');if(!a)return;e.preventDefault();const action=a.dataset.vfAction;if(!perform(action)){if(atHome()){setTimeout(()=>perform(action),300);setTimeout(()=>perform(action),900)}else sendHome(action)}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{build();retryIntent()},{once:true});else{build();retryIntent()}
  setTimeout(build,250);
})();