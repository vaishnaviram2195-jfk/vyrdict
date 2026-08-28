(()=>{
  if(window.__vyrdictCompanyFooter)return;
  window.__vyrdictCompanyFooter=1;

  const FOOTER_ID='vyrdict-company-footer';
  const STYLE_ID='vyrdict-company-footer-style';
  const INTENT_KEY='vyrdict:footer-intent';

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
#${FOOTER_ID} .vf-rule{height:1px;background:#cfc2b7;margin:46px 0 18px}
#${FOOTER_ID} .vf-bottom{display:flex;justify-content:space-between;align-items:center;gap:20px;color:#746d66;font-size:9px;line-height:1.5;letter-spacing:.02em}
#${FOOTER_ID} .vf-associate{margin-top:8px;color:#746d66;font-size:9px;line-height:1.5;letter-spacing:.01em}
#${FOOTER_ID} .vf-wordmark{margin:34px 0 4px;font-size:clamp(54px,7vw,92px);font-weight:950;letter-spacing:-.075em;line-height:.88;white-space:nowrap;color:#171511;user-select:none;display:flex;align-items:flex-end}
#${FOOTER_ID} .vf-wordmark .vf-logo-dot{transform:translateY(-.02em)}
@media(max-width:860px){
  #${FOOTER_ID} .vf-grid{grid-template-columns:1.25fr repeat(3,1fr);gap:24px}
  #${FOOTER_ID} .vf-shell{padding-top:44px}
}
@media(max-width:650px){
  #${FOOTER_ID} .vf-shell{width:min(100% - 34px,1180px);padding-top:40px}
  #${FOOTER_ID} .vf-grid{grid-template-columns:1fr 1fr;gap:32px 24px}
  #${FOOTER_ID} .vf-brand{grid-column:1/-1}
  #${FOOTER_ID} .vf-brand p{max-width:32ch}
  #${FOOTER_ID} .vf-bottom{align-items:flex-start;flex-direction:column;gap:5px}
  #${FOOTER_ID} .vf-rule{margin-top:38px}
  #${FOOTER_ID} .vf-wordmark{font-size:clamp(48px,14vw,68px);margin-top:28px;letter-spacing:-.075em}
}
@media(max-width:390px){
  #${FOOTER_ID} .vf-grid{grid-template-columns:1fr 1fr;gap:28px 18px}
  #${FOOTER_ID} .vf-links a{font-size:11px}
}`;
    document.head.appendChild(s);
  }

  function build(){
    if(document.getElementById(FOOTER_ID))return;
    addStyle();
    const footer=document.createElement('footer');
    footer.id=FOOTER_ID;
    footer.setAttribute('aria-label','VYRDICT footer');
    footer.innerHTML=`
      <div class="vf-shell">
        <div class="vf-grid">
          <div class="vf-brand">
            <a class="vf-brand-name" href="/" aria-label="VYRDICT home">VYRDICT<span class="vf-logo-dot" aria-hidden="true"></span></a>
            <p>The verdict on what’s trending.</p>
          </div>
          <nav class="vf-col" aria-label="Discover">
            <h2>Discover</h2>
            <div class="vf-links">
              <a href="/" data-vf-action="weekly">Weekly Viral Rankings</a>
              <a href="/" data-vf-action="categories">Browse Categories</a>
              <a href="/" data-vf-action="skip">Skip List</a>
              <a href="/#/saved" data-vf-action="saved">Saved Products</a>
            </div>
          </nav>
          <nav class="vf-col" aria-label="Trust">
            <h2>Trust</h2>
            <div class="vf-links">
              <a href="/how-vyrdict-scores.html" data-vyrdict-scores>How Scores Work</a>
              <a href="/editorial-policy.html">Editorial Policy</a>
              <a href="/terms.html#affiliate-disclosure">Affiliate Disclosure</a>
              <a href="/privacy.html">Privacy</a>
              <a href="/terms.html">Terms</a>
              <a href="mailto:hello@vyrdict.com?subject=VYRDICT%20Security%20Report">Security Reporting</a>
            </div>
          </nav>
          <nav class="vf-col" aria-label="Connect">
            <h2>Connect</h2>
            <div class="vf-links">
              <a href="https://www.linkedin.com/company/143431971/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href="https://www.instagram.com/vyrdict.co/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
              <a href="https://www.tiktok.com/@vyrdict" target="_blank" rel="noopener noreferrer">TikTok ↗</a>
              <a href="/careers">Careers</a>
              <a href="/suggest-product.html" data-vyrdict-suggest>Suggest a Product</a>
              <a href="mailto:hello@vyrdict.com">hello@vyrdict.com</a>
            </div>
          </nav>
        </div>
        <div class="vf-rule"></div>
        <div class="vf-bottom">
          <span>© 2026 VYRDICT. All Rights Reserved.</span>
          <span>Independent viral-product discovery and editorial scoring.</span>
        </div>
        <div class="vf-associate">As an Amazon Associate I earn from qualifying purchases.</div>
        <div class="vf-wordmark" aria-hidden="true">VYRDICT<span class="vf-logo-dot"></span></div>
      </div>`;
    document.body.appendChild(footer);
  }

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  function sectionFor(phrases){
    const nodes=[...document.querySelectorAll('h1,h2,h3,h4,.eyebrow,.skipflag')].filter(x=>!x.closest('#'+FOOTER_ID));
    for(const phrase of phrases){
      const q=norm(phrase);
      const hit=nodes.find(x=>norm(x.textContent).includes(q));
      if(hit)return hit.closest('section')||hit.closest('.section')||hit;
    }
    return null;
  }
  function atHome(){return location.pathname==='/'&&(!location.hash||!/^#\/(product|category|search|saved)/i.test(location.hash));}
  function perform(action){
    if(action==='saved'){
      if(location.pathname!=='/')location.href='/#/saved';
      else location.hash='#/saved';
      return true;
    }
    let target=null;
    if(action==='skip')target=document.getElementById('skip-list');
    if(action==='weekly')target=sectionFor(['weekly viral rankings','weekly rankings',"what's trending now"]);
    if(action==='categories')target=sectionFor(['browse by category','take what you need','categories']);
    if(target){target.scrollIntoView({behavior:'smooth',block:'start'});return true;}
    return false;
  }
  function sendHome(action){
    try{sessionStorage.setItem(INTENT_KEY,action)}catch{}
    location.href='/';
  }
  function retryIntent(){
    let action='';
    try{action=sessionStorage.getItem(INTENT_KEY)||''}catch{}
    if(!action)return;
    [140,420,850,1450,2200].forEach(ms=>setTimeout(()=>{
      if(!action)return;
      if(perform(action)){
        try{sessionStorage.removeItem(INTENT_KEY)}catch{}
        action='';
      }
    },ms));
  }

  document.addEventListener('click',e=>{
    const a=e.target.closest?.('[data-vf-action]');
    if(!a)return;
    e.preventDefault();
    const action=a.dataset.vfAction;
    if(!perform(action)){
      if(atHome()){
        setTimeout(()=>perform(action),300);
        setTimeout(()=>perform(action),900);
      }else sendHome(action);
    }
  });

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{build();retryIntent()},{once:true});
  else{build();retryIntent()}
  setTimeout(build,250);
})();