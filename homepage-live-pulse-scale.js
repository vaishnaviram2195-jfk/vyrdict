/*
 * Compact only the LIVE PRODUCT PULSE / Trending right now section.
 * Leaves navigation, Culture, News Desk, all other homepage sections untouched.
 */
(()=>{
  'use strict';
  if(!/^\/$/.test(location.pathname||'/'))return;
  if(window.__vyrdictPulseProportionV1)return;
  window.__vyrdictPulseProportionV1=true;
  const STYLE_ID='vyrdict-pulse-proportion-v1';
  const css=`
    .vyrdict-pulse-compact .vyrdict-pulse-heading{
      font-size:clamp(30px,3.15vw,46px)!important;
      line-height:1.04!important;
      letter-spacing:-.035em!important;
      max-width:780px!important;
    }
    .vyrdict-pulse-compact img.vyrdict-pulse-photo{
      box-sizing:border-box!important;
      display:block!important;
      width:auto!important;
      height:auto!important;
      max-width:min(80%,280px)!important;
      max-height:278px!important;
      object-fit:contain!important;
      object-position:center!important;
      margin-left:auto!important;
      margin-right:auto!important;
    }
    .vyrdict-pulse-compact .vyrdict-pulse-media{
      max-height:322px!important;
      min-height:0!important;
      height:auto!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      overflow:hidden!important;
    }
    @media(max-width:760px){
      .vyrdict-pulse-compact .vyrdict-pulse-heading{font-size:clamp(28px,6vw,37px)!important;line-height:1.07!important}
      .vyrdict-pulse-compact img.vyrdict-pulse-photo{max-height:220px!important;max-width:min(78%,220px)!important}
      .vyrdict-pulse-compact .vyrdict-pulse-media{max-height:260px!important}
    }
    @media(max-width:420px){
      .vyrdict-pulse-compact .vyrdict-pulse-heading{font-size:30px!important}
      .vyrdict-pulse-compact img.vyrdict-pulse-photo{max-height:185px!important;max-width:min(78%,190px)!important}
      .vyrdict-pulse-compact .vyrdict-pulse-media{max-height:215px!important}
    }
  `;
  function inject(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;style.textContent=css;document.head.append(style);
  }
  const normalized=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase().replace(/[.!]+$/,'');
  function apply(){
    const heading=[...document.querySelectorAll('h1,h2,h3')].find(h=>normalized(h.textContent)==='trending right now');
    if(!heading)return false;
    const section=heading.closest('section');
    if(!section)return false; // never style the whole page as fallback
    inject();
    section.classList.add('vyrdict-pulse-compact');
    heading.classList.add('vyrdict-pulse-heading');
    [...section.querySelectorAll('img')].filter(img=>!!img.getAttribute('src')).slice(0,8).forEach(img=>{
      img.classList.add('vyrdict-pulse-photo');
      const parent=img.parentElement;
      if(parent&&parent.querySelectorAll('img').length===1&&
         parent.querySelectorAll('h1,h2,h3,h4,p,button').length===0&&
         parent.children.length<=3&&parent.tagName!=='A'&&parent.tagName!=='PICTURE'){
        parent.classList.add('vyrdict-pulse-media');
      }
    });
    return true;
  }
  let attempts=0;
  function settle(){
    attempts++;
    if(!apply()&&attempts<30)setTimeout(settle,Math.min(160+attempts*75,500));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});
  else settle();
  addEventListener('pageshow',()=>setTimeout(apply,80));
  const node=document.getElementById('app')||document.body;
  let queued=false;
  if(node)new MutationObserver(()=>{
    if(queued)return;queued=true;
    setTimeout(()=>{queued=false;apply()},200);
  }).observe(node,{childList:true,subtree:true});
})();
