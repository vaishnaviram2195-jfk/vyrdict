(()=>{
  if(window.__vyrdictMomentTopV3)return;
  window.__vyrdictMomentTopV3=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STYLE_ID='ve-moment-top-style-v3';

  function style(){
    document.getElementById('ve-moment-top-style')?.remove();
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Keep the cinematic opener, but shift it from near-black to muted gray. */
      #${ROOT} > .ve-hero{display:none!important}
      #${ROOT} > .ve-motion{margin:0!important;background:#8d908c!important}
      #${ROOT} > .ve-motion .ve-motion-img{
        filter:saturate(.62) brightness(.78) contrast(.92)!important;
      }
      #${ROOT} > .ve-motion:after{
        background:linear-gradient(180deg,rgba(112,115,111,.14) 10%,rgba(82,85,81,.56) 100%)!important;
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

  function apply(){
    const root=document.getElementById(ROOT);
    if(!root)return false;
    const hero=root.querySelector(':scope > .ve-hero');
    const motion=root.querySelector(':scope > .ve-motion');
    if(!hero||!motion)return false;

    style();
    alignCopy(motion);

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
