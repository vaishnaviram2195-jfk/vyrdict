(()=>{
  if(window.__vyrdictMomentTopV9)return;
  window.__vyrdictMomentTopV9=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STYLE_ID='ve-moment-top-style-v9';
  let initialized=false;
  let reapplyTimer=0;

  function style(){
    ['ve-moment-top-style','ve-moment-top-style-v3','ve-moment-top-style-v4','ve-moment-top-style-v5','ve-moment-top-style-v6','ve-moment-top-style-v7','ve-moment-top-style-v8'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${ROOT} > .ve-hero{display:none!important}
      #${ROOT} > .ve-motion{margin:0!important;background:#686b68!important;transform:none!important;overflow-anchor:none!important}
      #${ROOT} > .ve-motion .ve-motion-frame{transform:none!important;overflow-anchor:none!important}
      #${ROOT} > .ve-motion .ve-motion-img{
        animation:none!important;
        transition:none!important;
        opacity:0!important;
        filter:saturate(.60) brightness(.73) contrast(.94)!important;
        transform:scale(1.02)!important;
        will-change:auto!important;
      }
      #${ROOT} > .ve-motion .ve-motion-img:first-child{opacity:1!important}
      #${ROOT} > .ve-motion:after{background:linear-gradient(180deg,rgba(88,92,89,.18) 10%,rgba(50,53,51,.62) 100%)!important}
      html,body{scroll-behavior:auto!important}
    `;
    document.head.appendChild(s);
  }

  function wireFreshLink(link){
    if(!link)return;
    link.href='/collection/viral-right-now/?live=1';
    link.textContent='See what’s viral';
    link.dataset.veFreshViralLink='1';
    if(link.dataset.veFreshViralReady==='1')return;
    link.dataset.veFreshViralReady='1';
    link.addEventListener('click',()=>{
      try{
        localStorage.removeItem('vyrdict:catalog-cache:v5');
        localStorage.removeItem('vyrdict:catalog-cache:v4');
        localStorage.removeItem('vyrdict:catalog-cache:v3');
      }catch{}
    },{capture:true});
  }

  function alignCopy(motion){
    const kicker=motion.querySelector('.ve-motion-copy .ve-kicker');
    const heading=motion.querySelector('.ve-motion-copy h2');
    const description=motion.querySelector('.ve-motion-side p');
    const link=motion.querySelector('.ve-motion-side a');
    if(kicker)kicker.textContent='THE HYPE CHECK';
    if(heading)heading.textContent='What’s Actually Worth the Hype';
    if(description)description.textContent='The products with the strongest live momentum right now — ranked from fresh VYRDICT signals, not yesterday’s internet. We prioritize what is surging across roughly the last 7–10 days.';
    wireFreshLink(link);
  }

  function pinAsHomepageLead(root,motion){
    const ribbon=root.querySelector(':scope > .ve-site-ribbon');
    if(ribbon){
      if(ribbon.nextElementSibling!==motion)ribbon.insertAdjacentElement('afterend',motion);
      return;
    }
    if(root.firstElementChild!==motion)root.insertBefore(motion,root.firstElementChild);
  }

  async function loadFreshViral(motion){
    const frame=motion.querySelector('.ve-motion-frame');
    if(!frame||frame.dataset.veFreshStable==='1'||frame.dataset.veFreshStable==='loading')return;
    frame.dataset.veFreshStable='loading';
    try{
      const r=await fetch('/api/viral-now?limit=5',{headers:{accept:'application/json'},cache:'no-store'});
      if(!r.ok)throw new Error('viral-now');
      const j=await r.json();
      const p=(j.products||[]).find(x=>x&&x.image_url&&x.slug);
      if(!p)throw new Error('insufficient');
      frame.innerHTML=`<a class="ve-motion-img" href="/product/${encodeURIComponent(p.slug)}/" aria-label="${String(p.brand||'')} ${String(p.name||'')}" style="background-image:url('${String(p.image_url).replace(/'/g,"%27")}');opacity:1!important"></a>`;
      frame.dataset.veFreshStable='1';
      motion.dataset.veViralWindow=String(j.window_days||10);
    }catch{
      frame.dataset.veFreshStable='fallback';
      const first=frame.querySelector('.ve-motion-img');
      if(first)first.style.setProperty('opacity','1','important');
    }
  }

  function apply(){
    const root=document.getElementById(ROOT);if(!root)return false;
    const motion=root.querySelector(':scope > .ve-motion');
    if(!motion)return false;
    style();
    pinAsHomepageLead(root,motion);
    alignCopy(motion);
    loadFreshViral(motion);
    if(!initialized){
      initialized=true;
      root.querySelector(':scope > .ve-hero')?.setAttribute('aria-hidden','true');
    }
    return true;
  }

  let tries=0;
  const tick=()=>{
    tries++;
    if(apply())return;
    if(tries<40)setTimeout(tick,tries<10?120:300);
  };
  const queueApply=()=>{
    clearTimeout(reapplyTimer);
    reapplyTimer=setTimeout(apply,30);
  };
  const watch=()=>{
    const app=document.getElementById('app')||document.body;
    if(!app||app.dataset.veMomentTopWatch==='1')return;
    app.dataset.veMomentTopWatch='1';
    new MutationObserver(queueApply).observe(app,{childList:true,subtree:false});
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{tick();watch()},{once:true});
  else{tick();watch()}
  [250,700,1400,2600,5000,8500].forEach(ms=>setTimeout(apply,ms));
  addEventListener('pageshow',e=>{if(e.persisted)setTimeout(apply,40)});
})();