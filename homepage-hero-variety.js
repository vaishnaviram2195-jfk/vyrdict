(()=>{
  if(window.__vyrdictHeroVariety)return;
  window.__vyrdictHeroVariety=1;

  const BACCARAT='https://www.franciskurkdjian.com/dw/image/v2/BJSB_PRD/on/demandware.static/-/Sites-mfk-master-catalog/default/dwe794c594/BACCARAT_ROUGE_540/FRAGRANCE/3700559608654_BR540_EDP_35ML_1.png?q=85&sfrm=png&sh=500&strip=true&sw=500';
  const BLENDBOSS='https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-NA/DB351C-MASTER_01.jpg';
  const STYLE_ID='vyrdict-hero-product-sizing';

  function addStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){
      s=document.createElement('style');
      s.id=STYLE_ID;
      document.head.appendChild(s);
    }
    s.textContent=`
      body.vyrdict-home-calm .stage .p1 img{transform:none!important;transform-origin:center center!important}
      body.vyrdict-home-calm .stage .p2 img{transform:scale(1.65)!important;transform-origin:center center!important}
      @media(max-width:700px){body.vyrdict-home-calm .stage .p2 img{transform:scale(1.55)!important}}
    `;
  }

  function setHeroImage(selector,src,alt,key){
    const img=document.querySelector(selector);
    if(!img)return false;
    if(img.dataset.vyrdictHeroVariety===key&&img.src===src)return true;
    img.dataset.vyrdictHeroVariety=key;
    img.src=src;
    img.removeAttribute('srcset');
    img.alt=alt;
    img.loading='eager';
    img.decoding='async';
    return true;
  }

  function apply(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    addStyle();
    setHeroImage('.stage .p1 img',BLENDBOSS,'Ninja BlendBOSS','blendboss');
    setHeroImage('.stage .p2 img',BACCARAT,'Maison Francis Kurkdjian Baccarat Rouge 540','baccarat-rouge-540');
    return true;
  }

  function schedule(){[0,80,220,500,900,1600,2600].forEach(ms=>setTimeout(apply,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  new MutationObserver(()=>{clearTimeout(window.__vyrdictHeroVarietyTimer);window.__vyrdictHeroVarietyTimer=setTimeout(apply,80)}).observe(document.documentElement,{childList:true,subtree:true});
})();
