(()=>{
  if(window.__vyrdictTrendingMobilePolishV1)return;
  window.__vyrdictTrendingMobilePolishV1=1;
  const id='vyrdict-trending-mobile-polish-v1';
  if(document.getElementById(id))return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
    @media(max-width:760px){
      html,body{max-width:100%;overflow-x:hidden}
      body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{
        padding:6px 0 0!important;
        margin:0!important;
        overflow:hidden!important;
      }
      .vyrdict-index-claw .vti-wrap{
        width:calc(100% - 24px)!important;
        max-width:none!important;
        margin:0 auto!important;
      }
      .vyrdict-index-claw .vti-head{
        display:flex!important;
        flex-direction:column!important;
        align-items:flex-start!important;
        gap:7px!important;
        margin:0 0 8px!important;
      }
      .vyrdict-index-claw .vti-head>div:first-child,
      .vyrdict-index-claw .vti-head-right{
        width:100%!important;
        max-width:100%!important;
        align-items:flex-start!important;
        text-align:left!important;
      }
      .vyrdict-index-claw .vti-live-status{
        margin:0 0 7px!important;
        font-size:7.5px!important;
        letter-spacing:.12em!important;
      }
      .vyrdict-index-claw .vti-title{
        font-size:clamp(42px,12.5vw,52px)!important;
        line-height:.93!important;
        letter-spacing:-.055em!important;
        white-space:normal!important;
      }
      .vyrdict-index-claw .vti-sub{
        width:auto!important;
        max-width:345px!important;
        margin:0!important;
        font-size:11px!important;
        line-height:1.35!important;
        text-align:left!important;
        white-space:normal!important;
      }
      .vyrdict-index-claw .vti-cats{
        margin:0 -12px!important;
        padding:4px 12px 10px!important;
        gap:7px!important;
        overflow-x:auto!important;
        overscroll-behavior-x:contain;
        scroll-snap-type:x proximity;
        -webkit-overflow-scrolling:touch;
      }
      .vyrdict-index-claw .vti-cat{
        min-height:34px!important;
        padding:10px 13px!important;
        font-size:8px!important;
        scroll-snap-align:start;
      }
      .vyrdict-index-claw .vti-grid{
        display:grid!important;
        grid-template-columns:1fr!important;
        gap:8px!important;
        margin:0!important;
      }
      .vyrdict-index-claw .vti-machine-stage,
      .vyrdict-index-claw .vti-reveal-card{
        width:100%!important;
        max-width:100%!important;
        border-radius:0!important;
        box-shadow:none!important;
      }
      .vyrdict-index-claw .vti-machine-stage{
        height:470px!important;
        place-items:start center!important;
        padding-top:4px!important;
        overflow:hidden!important;
      }
      .vyrdict-index-claw .vti-machine{
        transform:scale(.91)!important;
        transform-origin:top center!important;
      }
      .vyrdict-index-claw .vti-reveal-card{
        height:460px!important;
        min-height:460px!important;
      }
      .vyrdict-index-claw .vti-panel-top{
        left:16px!important;
        right:16px!important;
        top:14px!important;
      }
      .vyrdict-index-claw .vti-signal{
        left:16px!important;
        top:32px!important;
        font-size:7.5px!important;
      }
      .vyrdict-index-claw .vti-next-tease{display:none!important}
      .vyrdict-index-claw .vti-reveal-link{
        inset:48px 2px 150px 2px!important;
        overflow:hidden!important;
      }
      .vyrdict-index-claw .vti-reveal-link img{
        max-width:84%!important;
        max-height:100%!important;
      }
      .vyrdict-index-claw .vti-reveal-link img.vti-book-cover{
        max-width:225px!important;
        max-height:100%!important;
      }
      .vyrdict-index-claw .vti-reveal-link img.vti-dyson-single{
        max-width:58%!important;
      }
      .vyrdict-index-claw .vti-panel-copy{
        left:16px!important;
        right:16px!important;
        bottom:8px!important;
        max-width:calc(100% - 32px)!important;
      }
      .vyrdict-index-claw .vti-brand{font-size:8px!important}
      .vyrdict-index-claw .vti-name{
        max-width:100%!important;
        font-size:clamp(28px,8.7vw,38px)!important;
        line-height:.95!important;
        text-wrap:balance!important;
        overflow-wrap:normal!important;
      }
      .vyrdict-index-claw .vti-momentum-copy{
        max-width:100%!important;
        margin-top:6px!important;
        font-size:10.5px!important;
        line-height:1.35!important;
      }
      .vyrdict-index-claw .vti-open{
        margin-top:7px!important;
        font-size:8px!important;
      }
      .vyrdict-index-claw .vti-foot{display:none!important}
    }
    @media(max-width:390px){
      .vyrdict-index-claw .vti-machine-stage{height:445px!important}
      .vyrdict-index-claw .vti-machine{transform:scale(.86)!important}
      .vyrdict-index-claw .vti-reveal-card{height:445px!important;min-height:445px!important}
      .vyrdict-index-claw .vti-reveal-link{inset:46px 0 148px 0!important}
      .vyrdict-index-claw .vti-title{font-size:clamp(40px,12vw,47px)!important}
    }
  `;
  document.head.appendChild(s);
})();