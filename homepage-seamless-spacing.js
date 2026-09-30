(()=>{
  if(window.__vyrdictHomepageSeamlessSpacingV1)return;
  window.__vyrdictHomepageSeamlessSpacingV1=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='vyrdict-homepage-seamless-spacing-v1';
  function apply(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Keep every homepage handoff intentional: no stacked external margins or dead bands. */
      #vyrdict-editorial-home{row-gap:0!important;column-gap:0!important;overflow-x:clip!important}
      #vyrdict-editorial-home > section,
      #vyrdict-editorial-home > .ve-motion,
      #vyrdict-editorial-home > .ve-story,
      #vyrdict-editorial-home > .ve-worth,
      #vyrdict-editorial-home > .ve-community,
      #vyrdict-editorial-home > .ve-discover{
        margin-top:0!important;
        margin-bottom:0!important;
      }

      /* Landing feature stays visually dominant; only remove accidental outside spacing. */
      #vyrdict-editorial-home > .ve-motion{margin:0!important}

      /* Culture -> Desk should read as one continuous editorial sequence. */
      #vyrdict-editorial-home #ve-culture-trio{
        margin:0!important;
        padding-top:72px!important;
        padding-bottom:38px!important;
      }
      #vyrdict-editorial-home #ve-culture-trio .ve-culture-head{margin-bottom:34px!important}
      #vyrdict-editorial-home #ve-culture-trio + #ve-news-desk{
        margin-top:0!important;
        padding-top:34px!important;
        border-top:1px solid rgba(0,0,0,.10)!important;
      }
      #vyrdict-editorial-home #ve-news-desk{
        margin:0!important;
        padding-bottom:62px!important;
      }
      #vyrdict-editorial-home #ve-news-desk .ve-news-head{
        margin-bottom:24px!important;
        padding-bottom:20px!important;
      }

      /* Desk -> Signal has no spacer element or exterior gap. */
      #vyrdict-editorial-home #ve-news-desk + .ve-story,
      #vyrdict-editorial-home .ve-story{
        margin:0!important;
      }
      #vyrdict-editorial-home .ve-story-copy{
        padding-top:52px!important;
        padding-bottom:52px!important;
      }

      /* Defensive sizing so cards/media never create horizontal spill. */
      #vyrdict-editorial-home .ve-culture-wrap,
      #vyrdict-editorial-home .ve-news-wrap,
      #vyrdict-editorial-home .ve-wrap,
      #vyrdict-editorial-home .ve-culture-grid,
      #vyrdict-editorial-home .ve-news-grid,
      #vyrdict-editorial-home .ve-story,
      #vyrdict-editorial-home img{max-width:100%}
      #vyrdict-editorial-home .ve-culture-card,
      #vyrdict-editorial-home .ve-news-secondary,
      #vyrdict-editorial-home .ve-news-lead,
      #vyrdict-editorial-home .ve-news-rail{min-width:0}

      @media(max-width:900px){
        #vyrdict-editorial-home #ve-culture-trio{
          padding-top:58px!important;
          padding-bottom:32px!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-head{margin-bottom:30px!important}
        #vyrdict-editorial-home #ve-culture-trio + #ve-news-desk{padding-top:30px!important}
        #vyrdict-editorial-home #ve-news-desk{padding-bottom:54px!important}
        #vyrdict-editorial-home .ve-story-copy{
          padding-top:48px!important;
          padding-bottom:48px!important;
        }
      }

      @media(max-width:620px){
        #vyrdict-editorial-home{overflow-x:hidden!important}
        #vyrdict-editorial-home > .ve-motion{margin:0!important}
        #vyrdict-editorial-home > .ve-motion .ve-motion-copy{
          padding-top:48px!important;
          padding-bottom:46px!important;
          gap:18px!important;
        }
        #vyrdict-editorial-home #ve-culture-trio{
          padding-top:46px!important;
          padding-bottom:26px!important;
        }
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-head{margin-bottom:26px!important}
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-grid{gap:28px!important}
        #vyrdict-editorial-home #ve-culture-trio + #ve-news-desk{
          padding-top:26px!important;
          margin-top:0!important;
        }
        #vyrdict-editorial-home #ve-news-desk{
          padding-bottom:46px!important;
          margin-bottom:0!important;
        }
        #vyrdict-editorial-home #ve-news-desk .ve-news-head{
          margin-bottom:20px!important;
          padding-bottom:16px!important;
        }
        #vyrdict-editorial-home #ve-news-desk .ve-news-grid{gap:26px!important}
        #vyrdict-editorial-home .ve-story{
          width:100%!important;
          margin:0!important;
          overflow:hidden!important;
        }
        #vyrdict-editorial-home .ve-story-copy{
          padding-top:40px!important;
          padding-bottom:42px!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  addEventListener('pageshow',()=>setTimeout(apply,20));
})();