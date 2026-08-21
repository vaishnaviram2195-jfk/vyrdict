(()=>{
  if(window.__vyrdictLaunchFeedback)return;
  window.__vyrdictLaunchFeedback=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-feedback';
  const STYLE_ID='vyrdict-launch-feedback-style';
  const MODAL_ID='vyrdict-feedback-modal';
  const PRODUCT_ID='vyrdict-product-feedback';

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function productSlug(){
    let m=decodeURIComponent(location.pathname||'').match(/^\/product\/([^/?#]+)/i);
    if(m)return m[1];
    m=decodeURIComponent(location.hash||'').match(/#\/product\/([^?#]+)/i);
    return m?m[1]:'';
  }

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
.vfb-link-button{appearance:none;border:0;background:none;padding:0;color:inherit;font:inherit;text-align:left;cursor:pointer}
#${MODAL_ID}{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(21,19,16,.46);backdrop-filter:blur(5px)}
#${MODAL_ID}.on{display:flex}
#${MODAL_ID} .vfb-panel{width:min(680px,100%);max-height:min(82vh,760px);overflow:auto;background:#fffaf4;color:#171511;border:1px solid #d8cec4;border-radius:26px;box-shadow:0 30px 90px rgba(34,24,18,.24);padding:28px}
#${MODAL_ID} .vfb-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:20px}
#${MODAL_ID} .vfb-eyebrow{font:900 9px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#766c64;margin-bottom:9px}
#${MODAL_ID} h2{font:700 clamp(30px,6vw,46px)/1 Georgia,serif;letter-spacing:-.04em;margin:0}
#${MODAL_ID} .vfb-close{width:36px;height:36px;border-radius:50%;border:1px solid #d8cec4;background:#f4ede5;color:#171511;font-size:20px;cursor:pointer;flex:0 0 auto}
#${MODAL_ID} .vfb-copy{color:#5f5750;font:13px/1.65 Arial,sans-serif;margin:0 0 18px}
#${MODAL_ID} details{border-top:1px solid #ded4cb;padding:15px 0}
#${MODAL_ID} details:last-of-type{border-bottom:1px solid #ded4cb}
#${MODAL_ID} summary{cursor:pointer;list-style:none;font:800 13px/1.4 Arial,sans-serif;padding-right:24px;position:relative}
#${MODAL_ID} summary::-webkit-details-marker{display:none}
#${MODAL_ID} summary:after{content:'+';position:absolute;right:2px;top:-2px;font-size:20px;font-weight:400}
#${MODAL_ID} details[open] summary:after{content:'–'}
#${MODAL_ID} details p{color:#5f5750;font:12px/1.65 Arial,sans-serif;margin:10px 0 0}
#${MODAL_ID} a{color:#171511;font-weight:800}
#${MODAL_ID} label{display:block;font:900 10px/1.2 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;margin:16px 0 7px}
#${MODAL_ID} textarea,#${MODAL_ID} input{width:100%;border:1px solid #d8cec4;border-radius:14px;background:#fffdf9;color:#171511;font:13px/1.5 Arial,sans-serif;padding:13px 14px;outline:none}
#${MODAL_ID} textarea{min-height:130px;resize:vertical}
#${MODAL_ID} textarea:focus,#${MODAL_ID} input:focus{border-color:#e65f72;box-shadow:0 0 0 3px rgba(230,95,114,.1)}
#${MODAL_ID} .vfb-submit{margin-top:16px;border:0;border-radius:999px;background:#171511;color:white;padding:12px 20px;font:900 10px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
#${MODAL_ID} .vfb-submit:disabled{opacity:.45;cursor:default}
#${MODAL_ID} .vfb-status{min-height:18px;margin-top:11px;color:#5f5750;font:12px/1.4 Arial,sans-serif}
#${PRODUCT_ID}{width:min(1040px,calc(100% - 34px));margin:28px auto 46px;background:#fffaf4;border:1px solid #d8cec4;border-radius:22px;padding:22px 24px;color:#171511;font-family:Arial,sans-serif}
#${PRODUCT_ID} .vpf-row{display:flex;align-items:center;justify-content:space-between;gap:22px;flex-wrap:wrap}
#${PRODUCT_ID} .vpf-label{font:700 24px/1.05 Georgia,serif;letter-spacing:-.025em;margin:0 0 5px}
#${PRODUCT_ID} .vpf-sub{font-size:11px;line-height:1.5;color:#726860;margin:0}
#${PRODUCT_ID} .vpf-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#${PRODUCT_ID} .vpf-vote{border:1px solid #d8cec4;background:#fffdf9;color:#171511;border-radius:999px;padding:10px 14px;font:800 11px/1 Arial,sans-serif;cursor:pointer}
#${PRODUCT_ID} .vpf-vote:hover{border-color:#e65f72}
#${PRODUCT_ID} .vpf-vote:disabled{opacity:.55;cursor:default}
#${PRODUCT_ID} .vpf-report{display:inline-block;margin-top:14px;color:#5f5750;text-decoration:underline;text-underline-offset:3px;font:800 10px/1.4 Arial,sans-serif;cursor:pointer;background:none;border:0;padding:0}
#${PRODUCT_ID} .vpf-thanks{font:800 11px/1.4 Arial,sans-serif;color:#5f5750}
@media(max-width:600px){#${MODAL_ID} .vfb-panel{padding:22px 19px;border-radius:22px}#${PRODUCT_ID}{padding:19px;margin-top:22px}#${PRODUCT_ID} .vpf-actions{width:100%}#${PRODUCT_ID} .vpf-vote{flex:1;text-align:center}}
`;
    document.head.appendChild(s);
  }

  function modal(){
    let root=document.getElementById(MODAL_ID);
    if(root)return root;
    addStyle();
    root=document.createElement('div');
    root.id=MODAL_ID;
    root.setAttribute('aria-hidden','true');
    root.innerHTML='<div class="vfb-panel" role="dialog" aria-modal="true"><div data-vfb-body></div></div>';
    root.addEventListener('click',e=>{if(e.target===root||e.target.closest?.('[data-vfb-close]'))closeModal()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('on'))closeModal()});
    document.body.appendChild(root);
    return root;
  }
  function closeModal(){const r=document.getElementById(MODAL_ID);if(!r)return;r.classList.remove('on');r.setAttribute('aria-hidden','true');document.body.style.overflow=''}
  function show(content){const r=modal();r.querySelector('[data-vfb-body]').innerHTML=content;r.classList.add('on');r.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setTimeout(()=>r.querySelector('button,input,textarea,summary')?.focus(),30)}

  function openFaq(){
    show(`<div class="vfb-top"><div><div class="vfb-eyebrow">Quick answers</div><h2>VYRDICT FAQs.</h2></div><button class="vfb-close" data-vfb-close aria-label="Close">×</button></div>
      <p class="vfb-copy">The short version of how VYRDICT works. For the full methodology, see <a href="/how-vyrdict-scores.html">How Scores Work</a> and our <a href="/editorial-policy.html">Editorial Policy</a>.</p>
      <details><summary>What is the Viral Score?</summary><p>It measures how strongly the exact product is attracting current attention and momentum. Viral does not automatically mean good—or worth buying.</p></details>
      <details><summary>What is the Worth Score?</summary><p>It reflects VYRDICT’s structured editorial assessment of real-world value using consumer evidence, performance and value context, momentum, hype risk, and relevant market information.</p></details>
      <details><summary>Can a brand pay for a higher score or ranking?</summary><p>No. Commercial relationships do not determine Viral Scores, Worth Scores, rankings, or editorial verdicts. Any sponsored placement or material commercial connection is disclosed separately.</p></details>
      <details><summary>How often do scores and rankings update?</summary><p>Trend signals and product evidence are refreshed continuously through VYRDICT’s research workflows. Weekly Viral Rankings refresh weekly, and a product score or verdict can change when materially better or newer evidence becomes available.</p></details>
      <details><summary>What does “verified” mean?</summary><p>VYRDICT verifies the exact product identity and reviews the evidence supporting publication. Shopping routes and market information are also verified where the available evidence supports them.</p></details>
      <details><summary>Why can a product’s score change?</summary><p>Virality, price, availability, consumer evidence, formulations, and market context can change. VYRDICT may revise a score when newer evidence materially changes the picture.</p></details>
      <details><summary>How do I suggest a product or flag something inaccurate?</summary><p>Use <a href="/suggest-product.html">Suggest a Product</a> for a new product. On an existing product page, use “Something inaccurate or missing? Tell us.” You can also use the footer feedback form for general suggestions.</p></details>`);
  }

  async function send(payload){
    const r=await fetch(ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,page_path:location.pathname+(location.search||'')+(location.hash||'')})});
    let d={};try{d=await r.json()}catch{}
    if(!r.ok)throw new Error(d.error||'Could not send feedback');
    return d;
  }

  function openFeedback(type='site',slug=''){
    const product=type==='product_issue';
    show(`<div class="vfb-top"><div><div class="vfb-eyebrow">${product?'Product correction':'Your feedback'}</div><h2>${product?'Something off?':'Help us make VYRDICT better.'}</h2></div><button class="vfb-close" data-vfb-close aria-label="Close">×</button></div>
      <p class="vfb-copy">${product?'Tell us what looks inaccurate, outdated, broken, or missing on this product page.':'Spot something we could improve? Tell us. Early feedback helps us make VYRDICT more useful.'}</p>
      <form data-vfb-form>
        <label for="vfb-message">${product?'What should we check?':'What could we improve?'}</label>
        <textarea id="vfb-message" maxlength="1500" required placeholder="${product?'Example: the shopping link is broken, the image looks wrong, or some information seems outdated…':'Your suggestion…'}"></textarea>
        <label for="vfb-email">Email <span style="font-weight:400;letter-spacing:0;text-transform:none;color:#766c64">(optional)</span></label>
        <input id="vfb-email" type="email" maxlength="254" autocomplete="email" placeholder="you@example.com">
        <button class="vfb-submit" type="submit">Send feedback</button>
        <div class="vfb-status" role="status"></div>
      </form>`);
    const form=document.querySelector('[data-vfb-form]');
    form?.addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=form.querySelector('.vfb-submit'),status=form.querySelector('.vfb-status');
      const message=form.querySelector('#vfb-message').value.trim(),email=form.querySelector('#vfb-email').value.trim();
      if(message.length<3)return;
      btn.disabled=true;status.textContent='Sending…';
      try{await send({feedback_type:type,product_slug:product?slug:null,message,email:email||null});status.textContent='Thank you — we got it. ✨';form.querySelector('#vfb-message').value='';setTimeout(closeModal,1100)}
      catch(err){status.textContent=String(err.message||err).includes('rate_limited')?'Too many submissions right now. Please try again later.':'Could not send that just now. Please try again.';btn.disabled=false}
    });
  }

  function ensureFooterLinks(){
    const f=document.getElementById('vyrdict-company-footer');
    if(!f)return false;
    const trust=f.querySelector('nav[aria-label="Trust"] .vf-links');
    if(trust&&!trust.querySelector('[data-vyrdict-faq]')){
      const a=document.createElement('a');a.href='#faq';a.dataset.vyrdictFaq='';a.textContent='FAQs';
      const scores=trust.querySelector('[data-vyrdict-scores]');scores?.insertAdjacentElement('afterend',a);if(!scores)trust.prepend(a);
    }
    const connect=f.querySelector('nav[aria-label="Connect"] .vf-links');
    if(connect&&!connect.querySelector('[data-vyrdict-feedback]')){
      const a=document.createElement('a');a.href='#feedback';a.dataset.vyrdictFeedback='';a.textContent='Share Feedback';
      const suggest=connect.querySelector('[data-vyrdict-suggest]');suggest?.insertAdjacentElement('afterend',a);if(!suggest)connect.appendChild(a);
    }
    return true;
  }

  function voted(slug){try{return localStorage.getItem('vyrdict:helpful:'+slug)}catch{return null}}
  function markVoted(slug,val){try{localStorage.setItem('vyrdict:helpful:'+slug,val?'yes':'no')}catch{}}
  function ensureProductPanel(){
    const slug=productSlug();
    const old=document.getElementById(PRODUCT_ID);
    if(!slug){old?.remove();return false}
    if(old&&old.dataset.slug===slug)return true;
    old?.remove();
    const app=document.getElementById('app');
    if(!app||!app.innerHTML.trim())return false;
    const sec=document.createElement('section');sec.id=PRODUCT_ID;sec.dataset.slug=slug;
    const prior=voted(slug);
    sec.innerHTML=`<div class="vpf-row"><div><h2 class="vpf-label">Was this VYRDICT helpful?</h2><p class="vpf-sub">A quick tap helps us improve product pages.</p></div><div class="vpf-actions">${prior?'<span class="vpf-thanks">Thanks for the feedback. ✨</span>':'<button class="vpf-vote" data-vpf-vote="yes">👍 Yes</button><button class="vpf-vote" data-vpf-vote="no">👎 Not really</button>'}</div></div><button class="vpf-report" data-vpf-report>Something inaccurate or missing? Tell us →</button>`;
    app.insertAdjacentElement('afterend',sec);
    return true;
  }

  document.addEventListener('click',async e=>{
    const faq=e.target.closest?.('[data-vyrdict-faq]');if(faq){e.preventDefault();openFaq();return}
    const fb=e.target.closest?.('[data-vyrdict-feedback]');if(fb){e.preventDefault();openFeedback('site');return}
    const report=e.target.closest?.('[data-vpf-report]');if(report){e.preventDefault();const s=productSlug();if(s)openFeedback('product_issue',s);return}
    const vote=e.target.closest?.('[data-vpf-vote]');if(vote){
      e.preventDefault();const slug=productSlug();if(!slug||vote.disabled)return;
      const box=vote.closest('.vpf-actions');box.querySelectorAll('button').forEach(b=>b.disabled=true);
      const helpful=vote.dataset.vpfVote==='yes';
      try{await send({feedback_type:'product_helpful',product_slug:slug,helpful});markVoted(slug,helpful);box.innerHTML='<span class="vpf-thanks">Thanks — that helps us improve. ✨</span>'}
      catch{box.querySelectorAll('button').forEach(b=>b.disabled=false)}
      return;
    }
    setTimeout(()=>{ensureFooterLinks();ensureProductPanel()},80);
  });

  function sync(){ensureFooterLinks();ensureProductPanel()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
  [120,350,800,1500].forEach(ms=>setTimeout(sync,ms));
  const mo=new MutationObserver(()=>{clearTimeout(window.__vfbSyncTimer);window.__vfbSyncTimer=setTimeout(sync,60)});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('popstate',()=>setTimeout(sync,30));
  addEventListener('hashchange',()=>setTimeout(sync,30));
})();
