(()=>{
  if(window.__vyrdictMomentTopV1)return;
  window.__vyrdictMomentTopV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STYLE_ID='ve-moment-top-style';

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* The cinematic "What's Having a Moment" treatment is now the homepage opener. */
      #${ROOT} > .ve-hero{display:none!important}
      #${ROOT} > .ve-motion{margin:0!important}
    `;
    document.head.appendChild(s);
  }

  function apply(){
    const root=document.getElementById(ROOT);
    if(!root)return false;
    const hero=root.querySelector(':scope > .ve-hero');
    const motion=root.querySelector(':scope > .ve-motion');
    if(!hero||!motion)return false;

    style();

    /* Physically move the existing section rather than rebuilding it so all
       imagery, motion, copy and CTA remain exactly the same. */
    if(root.firstElementChild!==motion)root.insertBefore(motion,root.firstElementChild);

    /* Keep the editorial discovery trio immediately after the hidden legacy
       hero, then keep the news desk after that trio even if its own loader
       initially inserted it after .ve-motion. */
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
