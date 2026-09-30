(()=>{
  if(window.__vyrdictMomentTopV5)return;
  window.__vyrdictMomentTopV5=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STYLE_ID='ve-moment-top-style-v5';
  let rotationTimer=null;
  let rotationFrame=null;

  function style(){
    document.getElementById('ve-moment-top-style')?.remove();
    document.getElementById('ve-moment-top-style-v3')?.remove();
    document.getElementById('ve-moment-top-style-v4')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #${ROOT} > .ve-hero{display:none!important}
      #${ROOT} > .ve-motion{margin:0!important;background:#686b68!important}
      #${ROOT} > .ve-motion .ve-motion-img{
        animation:none!important;
        opacity:0!important;
        transition:opacity 1.45s cubic-bezier(.22,.61,.36,1)!important;
        filter:saturate(.60) brightness(.73) contrast(.94)!important;
        transform:scale(1.045)!important;
        will-change:opacity!important;
      }
      #${ROOT} > .ve-motion .ve-motion-img:first-child{opacity:1!important}
      #${ROOT} > .ve-motion:after{
        background:linear-gradient(180deg,rgba(88,92,89,.18) 10%,rgba(50,53,51,.62) 100%)!important;
      }
      @media(prefers-reduced-motion:reduce){
        #${ROOT} > .ve-motion .ve-motion-img{transition:none!important}
      }
    `;
    document.head.appendChild(s);
  }

  function alignCopy(motion){
    const kicker=motion.querySelector('.ve-motion-copy .ve-kicker');
    const heading=motion.querySelector('.ve-motion-copy h2');
    const description=motion.querySelector('.ve-motion-side p');
    if(kicker)kicker.textContent='THE HYPE CHECK';
    if(heading)heading.textContent='What’s actually worth the hype?';
    if(description)description.textContent='A rotating edit of the products everyone is talking about right now. VYRDICT cuts through the hype to show what deserves the attention — and what’s actually worth buying.';
  }

  function smoothRotation(motion){
    const frame=motion.querySelector('.ve-motion-frame');
    const images=[...motion.querySelectorAll('.ve-motion-img')];
    if(!frame||images.length<2)return;
    if(rotationFrame===frame&&frame.dataset.veSmoothRotation==='1')return;

    if(rotationTimer)clearInterval(rotationTimer);
    rotationTimer=null;
    rotationFrame=frame;
    frame.dataset.veSmoothRotation='1';

    images.forEach((img,i)=>{
      img.style.setProperty('animation','none','important');
      img.style.setProperty('opacity',i===0?'1':'0','important');
    });

    const waits=images.map(el=>{
      const bg=el.style.backgroundImage||getComputedStyle(el).backgroundImage||'';
      const m=bg.match(/url\(["']?(.*?)["']?\)/i);
      if(!m||!m[1])return Promise.resolve();
      return new Promise(resolve=>{
        const im=new Image();
        im.onload=im.onerror=()=>resolve();
        im.src=m[1];
      });
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

  function apply(){
    const root=document.getElementById(ROOT);
    if(!root)return false;
    const hero=root.querySelector(':scope > .ve-hero');
    const motion=root.querySelector(':scope > .ve-motion');
    if(!hero||!motion)return false;

    style();
    alignCopy(motion);
    smoothRotation(motion);

    if(root.firstElementChild!==motion)root.insertBefore(motion,root.firstElementChild);

    const culture=document.getElementById('ve-culture-trio');
    const news=document.getElementById('ve-news-desk');
    if(culture&&hero.nextElementSibling!==culture)hero.insertAdjacentElement('afterend',culture);
    if(news){
      if(culture&&culture.nextElementSibling!==news)culture.insertAdjacentElement('afterend',news);
      else if(!culture&&hero.nextElementSibling!==news)hero.insertAdjacentElement('afterend',news);
    }

    hero.setAttribute('aria-hidden','true');
    return true;
  }

  let tries=0;
  const tick=()=>{tries++;apply();if(tries<40)setTimeout(tick,tries<10?160:500)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();

  const app=document.getElementById('app')||document.body;
  new MutationObserver(()=>setTimeout(apply,30)).observe(app,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(apply,40));
})();
