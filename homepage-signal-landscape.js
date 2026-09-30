(()=>{
  if(window.__vyrdictSignalLandscapeV5)return;
  window.__vyrdictSignalLandscapeV5=1;
  if((location.pathname||'/')!=='/')return;

  const OLD_STYLE_IDS=['ve-signal-landscape-style','ve-signal-landscape-style-v2','ve-signal-landscape-style-v3','ve-signal-landscape-style-v4'];
  const STYLE_ID='ve-signal-landscape-style-v5';

  function ensureStyle(){
    OLD_STYLE_IDS.forEach(id=>document.getElementById(id)?.remove());
    let s=document.getElementById(STYLE_ID);
    if(!s){
      s=document.createElement('style');
      s.id=STYLE_ID;
      s.textContent=`
        /* Signal, Not Noise — visibly darker muted gray editorial treatment. */
        #vyrdict-editorial-home .ve-story{
          width:100%!important;
          margin:0!important;
          height:500px!important;
          min-height:0!important;
          grid-template-columns:1.08fr .92fr!important;
          background:#c8cac7!important;
          border:0!important;
          overflow:hidden!important;
        }
        #vyrdict-editorial-home .ve-story .ve-story-media{
          min-height:0!important;
          height:100%!important;
          aspect-ratio:auto!important;
          background:#bfc2bf!important;
        }
        #vyrdict-editorial-home .ve-story .ve-story-media.ve-story-product-shot{
          background:#bfc2bf!important;
        }
        #vyrdict-editorial-home .ve-story .ve-story-media img{
          object-position:center!important;
        }
        #vyrdict-editorial-home .ve-story .ve-story-copy{
          height:100%!important;
          padding-top:46px!important;
          padding-bottom:46px!important;
          background:#c8cac7!important;
        }
        @media(max-width:980px){
          #vyrdict-editorial-home .ve-story{
            width:100%!important;
            margin:0!important;
            height:auto!important;
            min-height:0!important;
            grid-template-columns:1fr!important;
          }
          #vyrdict-editorial-home .ve-story .ve-story-media{
            height:auto!important;
            min-height:340px!important;
            aspect-ratio:16/8!important;
          }
          #vyrdict-editorial-home .ve-story .ve-story-copy{
            height:auto!important;
            padding-top:42px!important;
            padding-bottom:42px!important;
          }
        }
        @media(max-width:620px){
          #vyrdict-editorial-home .ve-story .ve-story-media{
            min-height:0!important;
            aspect-ratio:1.6!important;
          }
          #vyrdict-editorial-home .ve-story .ve-story-copy{
            padding-top:34px!important;
            padding-bottom:36px!important;
          }
        }
      `;
      document.head.appendChild(s);
    }else if(s.parentNode===document.head){
      document.head.appendChild(s);
    }
    return !!document.querySelector('#vyrdict-editorial-home .ve-story');
  }

  function apply(){
    const story=document.querySelector('#vyrdict-editorial-home .ve-story');
    if(!story)return false;
    ensureStyle();
    return true;
  }

  let n=0;const tick=()=>{n++;if(!apply()&&n<60)setTimeout(tick,140)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();

  new MutationObserver(muts=>{
    const stale=muts.some(m=>[...m.addedNodes].some(n=>n?.nodeType===1&&OLD_STYLE_IDS.includes(n.id)));
    if(stale)setTimeout(ensureStyle,0);
    else if(!document.getElementById(STYLE_ID)&&document.querySelector('#vyrdict-editorial-home .ve-story'))setTimeout(ensureStyle,0);
  }).observe(document.documentElement,{childList:true,subtree:true});

  addEventListener('pageshow',()=>setTimeout(apply,40));
})();
