(()=>{
  if(window.__vyrdictHeroVarietyV5)return;
  window.__vyrdictHeroVarietyV5=1;

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
    img.dataset.vyrdictHeroVariety=key;
    if(img.src!==src){
      img.src=src;
      img.removeAttribute('srcset');
    }
    img.alt=alt;
    img.loading='eager';
    img.decoding='async';
    return true;
  }

  function apply(){
    if(location.pathname!=='/'&&location.pathname!=='')return true;
    addStyle();
    const one=setHeroImage('.stage .p1 img',BLENDBOSS,'Ninja BlendBOSS','blendboss');
    const two=setHeroImage('.stage .p2 img',BACCARAT,'Maison Francis Kurkdjian Baccarat Rouge 540','baccarat-rouge-540');
    return one&&two;
  }

  function boot(attempt=0){
    if(apply()||attempt>=20)return;
    setTimeout(()=>boot(attempt+1),120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>boot());
  addEventListener('hashchange',()=>boot());
})();
