(()=>{
  if(window.__vyrdictSignalLandscapeV1)return;
  window.__vyrdictSignalLandscapeV1=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='ve-signal-landscape-style';
  function apply(){
    if(document.getElementById(STYLE_ID))return true;
    const story=document.querySelector('#vyrdict-editorial-home .ve-story');
    if(!story)return false;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      #vyrdict-editorial-home .ve-story{
        width:min(1240px,calc(100% - 80px))!important;
        margin:84px auto!important;
        min-height:0!important;
        grid-template-columns:minmax(0,1.32fr) minmax(360px,.68fr)!important;
        background:#faf9f5!important;
        border:1px solid rgba(23,23,23,.10)!important;
        overflow:hidden!important;
      }
      #vyrdict-editorial-home .ve-story-media{
        min-height:0!important;
        aspect-ratio:16/10!important;
      }
      #vyrdict-editorial-home .ve-story-media img{
        object-fit:cover!important;
        object-position:center!important;
      }
      #vyrdict-editorial-home .ve-story-copy{
        padding:52px clamp(34px,4.5vw,72px)!important;
      }
      #vyrdict-editorial-home .ve-story-copy h2{
        font-size:clamp(46px,4.7vw,72px)!important;
        margin:16px 0 22px!important;
        max-width:520px!important;
      }
      #vyrdict-editorial-home .ve-story-copy p{
        font-size:14px!important;
        line-height:1.65!important;
        margin-bottom:22px!important;
      }
      @media(max-width:980px){
        #vyrdict-editorial-home .ve-story{
          width:min(900px,calc(100% - 42px))!important;
          margin:64px auto!important;
          grid-template-columns:1fr!important;
        }
        #vyrdict-editorial-home .ve-story-media{aspect-ratio:16/9!important;min-height:0!important}
        #vyrdict-editorial-home .ve-story-copy{padding:48px 38px!important}
      }
      @media(max-width:620px){
        #vyrdict-editorial-home .ve-story{
          width:calc(100% - 30px)!important;
          margin:48px auto!important;
        }
        #vyrdict-editorial-home .ve-story-media{aspect-ratio:1.35!important}
        #vyrdict-editorial-home .ve-story-copy{padding:38px 24px!important}
        #vyrdict-editorial-home .ve-story-copy h2{font-size:clamp(42px,13vw,58px)!important}
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