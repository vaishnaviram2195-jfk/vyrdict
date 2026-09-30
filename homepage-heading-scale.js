(()=>{
  if(window.__vyrdictHomepageHeadingScaleV2)return;
  window.__vyrdictHomepageHeadingScaleV2=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='vyrdict-homepage-heading-scale-v2';
  function apply(){
    document.getElementById('vyrdict-homepage-heading-scale-v1')?.remove();
    let s=document.getElementById(STYLE_ID);
    if(!s){
      s=document.createElement('style');
      s.id=STYLE_ID;
      s.textContent=`
        /* Restrained editorial hierarchy: keep impact without oversized display type. */
        #vyrdict-editorial-home .ve-hero h1{
          font-size:clamp(50px,5.3vw,78px)!important;
          line-height:.96!important;
          letter-spacing:-.048em!important;
        }
        #vyrdict-editorial-home .ve-section-title,
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-head h2,
        #vyrdict-editorial-home #ve-news-desk .ve-news-head h2,
        #vyrdict-editorial-home .ve-worth-head h2,
        #vyrdict-editorial-home .ve-community-head h2,
        #vyrdict-editorial-home .ve-section-head h2{
          font-size:clamp(32px,3.05vw,44px)!important;
          line-height:1.03!important;
          letter-spacing:-.034em!important;
        }
        #vyrdict-editorial-home .ve-motion h2{
          font-size:clamp(43px,4.55vw,60px)!important;
          line-height:.96!important;
          letter-spacing:-.045em!important;
        }
        #vyrdict-editorial-home .ve-story-copy h1,
        #vyrdict-editorial-home .ve-story-copy h2{
          font-size:clamp(35px,3.55vw,48px)!important;
          line-height:1!important;
          letter-spacing:-.038em!important;
        }
        #vyrdict-editorial-home .ve-feature-copy h3{
          font-size:clamp(30px,2.8vw,42px)!important;
          line-height:1.01!important;
          letter-spacing:-.036em!important;
        }
        #vyrdict-editorial-home .ve-discover h2{
          font-size:clamp(36px,3.7vw,50px)!important;
          line-height:.99!important;
          letter-spacing:-.038em!important;
        }

        @media(max-width:900px){
          #vyrdict-editorial-home .ve-hero h1{font-size:clamp(46px,7vw,60px)!important}
          #vyrdict-editorial-home .ve-section-title,
          #vyrdict-editorial-home #ve-culture-trio .ve-culture-head h2,
          #vyrdict-editorial-home #ve-news-desk .ve-news-head h2,
          #vyrdict-editorial-home .ve-worth-head h2,
          #vyrdict-editorial-home .ve-community-head h2,
          #vyrdict-editorial-home .ve-section-head h2{font-size:clamp(30px,4.8vw,38px)!important}
          #vyrdict-editorial-home .ve-motion h2{font-size:clamp(40px,6vw,50px)!important}
          #vyrdict-editorial-home .ve-story-copy h1,
          #vyrdict-editorial-home .ve-story-copy h2{font-size:clamp(33px,5vw,41px)!important}
          #vyrdict-editorial-home .ve-discover h2{font-size:clamp(34px,5.2vw,42px)!important}
        }

        @media(max-width:620px){
          #vyrdict-editorial-home .ve-hero h1{font-size:clamp(40px,10.7vw,48px)!important;line-height:.99!important}
          #vyrdict-editorial-home .ve-section-title,
          #vyrdict-editorial-home #ve-culture-trio .ve-culture-head h2,
          #vyrdict-editorial-home #ve-news-desk .ve-news-head h2,
          #vyrdict-editorial-home .ve-worth-head h2,
          #vyrdict-editorial-home .ve-community-head h2,
          #vyrdict-editorial-home .ve-section-head h2{font-size:clamp(27px,7.8vw,33px)!important;line-height:1.06!important}
          #vyrdict-editorial-home .ve-motion h2{font-size:clamp(34px,9.5vw,42px)!important;line-height:.99!important}
          #vyrdict-editorial-home .ve-story-copy h1,
          #vyrdict-editorial-home .ve-story-copy h2{font-size:clamp(29px,8.2vw,36px)!important;line-height:1.04!important}
          #vyrdict-editorial-home .ve-feature-copy h3{font-size:clamp(27px,7.5vw,33px)!important}
          #vyrdict-editorial-home .ve-discover h2{font-size:clamp(30px,8.4vw,37px)!important;line-height:1.03!important}
        }
      `;
      document.head.appendChild(s);
    }else if(s.parentNode===document.head){
      document.head.appendChild(s);
    }
  }

  const settle=()=>[0,180,520,1100,2200].forEach(ms=>setTimeout(apply,ms));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
  addEventListener('pageshow',()=>setTimeout(apply,30));
  new MutationObserver(()=>{
    if(document.querySelector('#vyrdict-editorial-home')&&!document.getElementById(STYLE_ID))setTimeout(apply,10);
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
