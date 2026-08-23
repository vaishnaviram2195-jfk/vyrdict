(()=>{
  if(window.__vyrdictHeroVariety)return;
  window.__vyrdictHeroVariety=1;

  const IMG='https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-NA/DB351C-MASTER_01.jpg';

  function apply(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    const img=document.querySelector('.stage .p2 img');
    if(!img)return false;
    if(img.dataset.vyrdictHeroVariety==='blendboss')return true;
    img.dataset.vyrdictHeroVariety='blendboss';
    img.src=IMG;
    img.removeAttribute('srcset');
    img.alt='Ninja BlendBOSS';
    img.loading='eager';
    img.decoding='async';
    return true;
  }

  function schedule(){[0,80,220,500,900,1600,2600].forEach(ms=>setTimeout(apply,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  new MutationObserver(()=>{clearTimeout(window.__vyrdictHeroVarietyTimer);window.__vyrdictHeroVarietyTimer=setTimeout(apply,80)}).observe(document.documentElement,{childList:true,subtree:true});
})();
