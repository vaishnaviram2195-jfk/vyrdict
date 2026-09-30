(()=>{
  if(window.__vyrdictSignalLandscapeV3)return;
  window.__vyrdictSignalLandscapeV3=1;
  if((location.pathname||'/')!=='/')return;

  const OLD_STYLE_IDS=['ve-signal-landscape-style','ve-signal-landscape-style-v2'];
  const STYLE_ID='ve-signal-landscape-style-v3';
  function apply(){
    OLD_STYLE_IDS.forEach(id=>document.getElementById(id)?.remove());
    if(document.getElementById(STYLE_ID))return true;
    const story=document.querySelector('#vyrdict-editorial-home .ve-story');
    if(!story)return false;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Keep the full-width Signal treatment, but trim the overall section height. */
      #vyrdict-editorial-home .ve-story{
        width:100%!important;
        margin:0!important;
        height:500px!important;
        min-height:0!important;
        grid-template-columns:1.08fr .92fr!important;
        background:#faf9f5!important;
        border:0!important;
        overflow:hidden!important;
      }
      #vyrdict-editorial-home .ve-story-media{
        min-height:0!important;
        height:100%!important;
        aspect-ratio:auto!important;
      }
      #vyrdict-editorial-home .ve-story-media img{
        object-position:center!important;
      }
      #vyrdict-editorial-home .ve-story-copy{
        height:100%!important;
        padding-top:46px!important;
        padding-bottom:46px!important;
      }
      @media(max-width:980px){
        #vyrdict-editorial-home .ve-story{
          width:100%!important;
          margin:0!important;
          height:auto!important;
          min-height:0!important;
          grid-template-columns:1fr!important;
        }
        #vyrdict-editorial-home .ve-story-media{
          height:auto!important;
          min-height:340px!important;
          aspect-ratio:16/8!important;
        }
        #vyrdict-editorial-home .ve-story-copy{
          height:auto!important;
          padding-top:42px!important;
          padding-bottom:42px!important;
        }
      }
      @media(max-width:620px){
        #vyrdict-editorial-home .ve-story-media{
          min-height:0!important;
          aspect-ratio:1.6!important;
        }
        #vyrdict-editorial-home .ve-story-copy{
          padding-top:34px!important;
          padding-bottom:36px!important;
        }
      }
    `;
    document.head.appendChild(s);
    return true;
  }

  let n=0;const tick=()=>{n++;if(!apply()&&n<40)setTimeout(tick,160)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  new MutationObserver(()=>{if(!document.getElementById(STYLE_ID))apply()}).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(apply,40));
})();