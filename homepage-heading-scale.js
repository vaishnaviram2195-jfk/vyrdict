(()=>{
  if(window.__vyrdictHomepageHeadingScaleV1)return;
  window.__vyrdictHomepageHeadingScaleV1=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='vyrdict-homepage-heading-scale-v1';
  function apply(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Keep the opening "What's actually worth the hype?" hero untouched.
         Calm the major headings below it so the page reads more like a refined editorial site. */
      #vyrdict-editorial-home #ve-culture-trio .ve-culture-head h2,
      #vyrdict-editorial-home #ve-news-desk .ve-news-head h2,
      #vyrdict-editorial-home .ve-story-copy h1,
      #vyrdict-editorial-home .ve-story-copy h2,
      #vyrdict-editorial-home .ve-worth-head h2,
      #vyrdict-editorial-home .ve-community-head h2,
      #vyrdict-editorial-home .ve-section-head h2{
        font-size:clamp(36px,3.65vw,52px)!important;
        line-height:1.02!important;
        letter-spacing:-.038em!important;
      }

      @media(max-width:900px){
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-head h2,
        #vyrdict-editorial-home #ve-news-desk .ve-news-head h2,
        #vyrdict-editorial-home .ve-story-copy h1,
        #vyrdict-editorial-home .ve-story-copy h2,
        #vyrdict-editorial-home .ve-worth-head h2,
        #vyrdict-editorial-home .ve-community-head h2,
        #vyrdict-editorial-home .ve-section-head h2{
          font-size:clamp(33px,5.2vw,44px)!important;
          line-height:1.03!important;
        }
      }

      @media(max-width:620px){
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-head h2,
        #vyrdict-editorial-home #ve-news-desk .ve-news-head h2,
        #vyrdict-editorial-home .ve-story-copy h1,
        #vyrdict-editorial-home .ve-story-copy h2,
        #vyrdict-editorial-home .ve-worth-head h2,
        #vyrdict-editorial-home .ve-community-head h2,
        #vyrdict-editorial-home .ve-section-head h2{
          font-size:clamp(30px,8.5vw,38px)!important;
          line-height:1.04!important;
          letter-spacing:-.032em!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('pageshow',()=>setTimeout(apply,20));
})();
