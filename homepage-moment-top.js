(()=>{
  if(window.__vyrdictMomentTopV6)return;
  window.__vyrdictMomentTopV6=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STYLE_ID='ve-moment-top-style-v6';
  let rotationTimer=null;
  let rotationFrame=null;

  function style(){
    ['ve-moment-top-style','ve-moment-top-style-v3','ve-moment-top-style-v4','ve-moment-top-style-v5'].forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${ROOT} > .ve-hero{display:none!important}
      #${ROOT} > .ve-motion{margin:0!important;background:#686b68!important}
      #${ROOT} > .ve-motion .ve-motion-img{animation:none!important;opacity:0!important;transition:opacity 1.45s cubic-bezier(.22,.61,.36,1)!important;filter:saturate(.60) brightness(.73) contrast(.94)!important;transform:scale(1.045)!important;will-change:opacity!important}
      #${ROOT} > .ve-motion .ve-motion-img:first-child{opacity:1!important}
      #${ROOT} > .ve-motion:after{background:linear-gradient(180deg,rgba(88,92,89,.18) 10%,rgba(50,53,51,.62) 100%)!important}
      @media(prefers-reduced-motion:reduce){#${ROOT} > .ve-motion .ve-motion-img{transition:none!important}}
    `;
    document.head.appendChild(s);
  }

  function alignCopy(motion){
    const kicker=motion.querySelector('.ve-motion-copy .ve-kicker');
    const heading=motion.querySelector('.ve-motion-copy h2');
    const description=motion.querySelector('.ve-motion-side p');
    const link=motion.querySelector('.ve-motion-side a');
    if(kicker)kicker.textContent='THE HYPE CHECK';
    if(heading)heading.textContent='What’s actually worth the hype?';
    if(description)description.textContent='The products with the strongest live momentum right now — ranked from fresh VYRDICT signals, not yesterday’s internet. We prioritize what is surging across roughly the last 7–10 days.';
    if(link){link.href='/collection/viral-right-now/';link.textContent='See what’s viral';}
  }

  function smoothRotation(motion){
    const frame=motion.querySelector('.ve-motion-frame');
    const images=[...motion.querySelectorAll('.ve-motion-img')];
    if(!frame||images.length<2)return;
    if(rotationFrame===frame&&frame.dataset.veSmoothRotation==='1')return;
    if(rotationTimer)clearInterval(rotationTimer);
    rotationTimer=null;rotationFrame=frame;frame.dataset.veSmoothRotation='1';
    images.forEach((img,i)=>{img.style.setProperty('animation','none','important');img.style.setProperty('opacity',i===0?'1':'0','important')});
    const waits=images.map(el=>{
      const bg=el.style.backgroundImage||getComputedStyle(el).backgroundImage||'';
      const m=bg.match(/url\(["']?(.*?)["']?\)/i);
      if(!m||!m[1])return Promise.resolve();
      return new Promise(resolve=>{const im=new Image();im.onload=im.onerror=()=>resolve();im.src=m[1]});
    });
    Promise.all(waits).then(()=>{
      if(rotationFrame!==frame)return;
      let active=0;
      rotationTimer=setInterval(()=>{
        const next=(active+1)%images.length;
        images[next].style.setProperty('opacity','1','important');
        images[active].style.setProperty('opacity','0','important');
        active=next;
      },9000);
    });
  }

  async function loadFreshViral(motion){
    const frame=motion.querySelector('.ve-motion-frame');
    if(!frame||frame.dataset.veFreshViral==='1'||frame.dataset.veFreshViral==='loading')return;
    frame.dataset.veFreshViral='loading';
    try{
      const r=await fetch('/api/viral-now?limit=8',{headers:{accept:'application/json'},cache:'no-store'});
      if(!r.ok)throw new Error('viral-now');
      const j=await r.json();
      const products=(j.products||[]).filter(p=>p&&p.image_url&&p.slug).slice(0,5);
      if(products.length<3)throw new Error('insufficient');
      if(rotationTimer)clearInterval(rotationTimer);
      rotationTimer=null;rotationFrame=null;
      frame.removeAttribute('data-ve-smooth-rotation');
      frame.innerHTML=products.map((p,i)=>`<a class="ve-motion-img" href="/product/${encodeURIComponent(p.slug)}/" aria-label="${String(p.brand||'')} ${String(p.name||'')}" style="background-image:url('${String(p.image_url).replace(/'/g,"%27")}');${i===0?'opacity:1!important;':''}"></a>`).join('');
      frame.dataset.veFreshViral='1';
      motion.dataset.veViralWindow=String(j.window_days||10);
      smoothRotation(motion);
    }catch{
      frame.dataset.veFreshViral='fallback';
      smoothRotation(motion);
    }
  }

  function apply(){
    const root=document.getElementById(ROOT);if(!root)return false;
    const hero=root.querySelector(':scope > .ve-hero');
    const motion=root.querySelector(':scope > .ve-motion');
    if(!hero||!motion)return false;
    style();alignCopy(motion);loadFreshViral(motion);smoothRotation(motion);
    if(root.firstElementChild!==motion)root.insertBefore(motion,root.firstElementChild);
    const culture=document.getElementById('ve-culture-trio');
    const news=document.getElementById('ve-news-desk');
    if(culture&&hero.nextElementSibling!==culture)hero.insertAdjacentElement('afterend',culture);
    if(news){if(culture&&culture.nextElementSibling!==news)culture.insertAdjacentElement('afterend',news);else if(!culture&&hero.nextElementSibling!==news)hero.insertAdjacentElement('afterend',news)}
    hero.setAttribute('aria-hidden','true');
    return true;
  }

  let tries=0;const tick=()=>{tries++;apply();if(tries<40)setTimeout(tick,tries<10?160:500)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  const app=document.getElementById('app')||document.body;
  new MutationObserver(()=>setTimeout(apply,30)).observe(app,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(apply,40));
})();
