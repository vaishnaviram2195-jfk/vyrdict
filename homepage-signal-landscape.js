(()=>{
  if(window.__vyrdictSignalLandscapeV2)return;
  window.__vyrdictSignalLandscapeV2=1;
  if((location.pathname||'/')!=='/')return;

  const OLD_STYLE_ID='ve-signal-landscape-style';
  const STYLE_ID='ve-signal-landscape-style-v2';
  function apply(){
    document.getElementById(OLD_STYLE_ID)?.remove();
    if(document.getElementById(STYLE_ID))return true;
    const story=document.querySelector('#vyrdict-editorial-home .ve-story');
    if(!story)return false;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Keep the original full-bleed treatment; only shorten the section vertically. */
      #vyrdict-editorial-home .ve-story{
        width:100%!important;
        margin:0!important;
        height:580px!important;
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
        object-fit:cover!important;
        object-position:center!important;
      }
      #vyrdict-editorial-home .ve-story-copy{
        height:100%!important;
        padding-top:58px!important;
        padding-bottom:58px!important;
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
          min-height:420px!important;
          aspect-ratio:16/9!important;
        }
        #vyrdict-editorial-home .ve-story-copy{
          height:auto!important;
          padding-top:56px!important;
          padding-bottom:56px!important;
        }
      }
      @media(max-width:620px){
        #vyrdict-editorial-home .ve-story-media{
          min-height:0!important;
          aspect-ratio:1.35!important;
        }
        #vyrdict-editorial-home .ve-story-copy{
          padding-top:48px!important;
          padding-bottom:48px!important;
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