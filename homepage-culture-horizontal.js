(()=>{
  if(window.__vyrdictCultureHorizontalV1)return;
  window.__vyrdictCultureHorizontalV1=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='vyrdict-culture-horizontal-v1';
  function apply(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Only the Beyond the product feed cards become a horizontal swipe rail. */
      @media(max-width:900px){
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-grid{
          display:flex!important;
          grid-template-columns:none!important;
          gap:16px!important;
          width:100%!important;
          max-width:100%!important;
          overflow-x:auto!important;
          overflow-y:hidden!important;
          scroll-snap-type:x mandatory!important;
          scroll-padding-inline:0!important;
          overscroll-behavior-x:contain!important;
          -webkit-overflow-scrolling:touch!important;
          scrollbar-width:none!important;
          padding:0 0 10px!important;
          margin:0!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-grid::-webkit-scrollbar{
          display:none!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-card,
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-card:last-child{
          flex:0 0 min(64vw,480px)!important;
          width:min(64vw,480px)!important;
          min-width:min(64vw,480px)!important;
          max-width:none!important;
          grid-column:auto!important;
          scroll-snap-align:start!important;
          scroll-snap-stop:normal!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-media,
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-card:last-child .ve-culture-media{
          aspect-ratio:.92!important;
        }
      }
      @media(max-width:620px){
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-grid{
          gap:14px!important;
          padding-bottom:8px!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-card,
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-card:last-child{
          flex-basis:min(82vw,360px)!important;
          width:min(82vw,360px)!important;
          min-width:min(82vw,360px)!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-media,
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-card:last-child .ve-culture-media{
          aspect-ratio:.95!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  apply();
  addEventListener('pageshow',()=>setTimeout(apply,30));
})();