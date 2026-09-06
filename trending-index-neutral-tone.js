(()=>{
  if(window.__vyrdictTrendingNeutralToneV6)return;
  window.__vyrdictTrendingNeutralToneV6=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v6';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Full-height sage-to-lavender Trending Index with a subtle editorial grid.
       Keep the approved claw machine and reveal layout unchanged. */
    .vyrdict-index-claw{
      --vti-sage:#d9e3d4;
      --vti-sage-mid:#dfe5db;
      --vti-blend:#e3dfdf;
      --vti-lavender-mid:#e2dbe8;
      --vti-lavender:#ded5e7;
      --vti-pill:rgba(248,244,239,.76);
      --vti-line:rgba(44,39,35,.11);
      --vti-grid-line:rgba(67,61,57,.065);
      --vti-grid-size:30px;
      background:
        linear-gradient(var(--vti-grid-line) 1px,transparent 1px),
        linear-gradient(90deg,var(--vti-grid-line) 1px,transparent 1px),
        linear-gradient(112deg,
          var(--vti-sage) 0%,
          var(--vti-sage-mid) 34%,
          var(--vti-blend) 52%,
          var(--vti-lavender-mid) 70%,
          var(--vti-lavender) 100%)!important;
      background-size:
        var(--vti-grid-size) var(--vti-grid-size),
        var(--vti-grid-size) var(--vti-grid-size),
        100% 100%!important;
      background-position:
        -1px -1px,
        -1px -1px,
        0 0!important;
      box-shadow:none!important;
      height:auto!important;
      min-height:0!important;
      overflow:hidden!important;
    }

    .vyrdict-index-claw::before,
    .vyrdict-index-claw::after{content:none!important;display:none!important}

    .vyrdict-index-claw .vti-wrap{
      height:auto!important;
      display:block!important;
    }

    .vyrdict-index-claw .vti-grid{
      height:auto!important;
      min-height:0!important;
      align-items:stretch!important;
    }

    .vyrdict-index-claw .vti-machine-stage,
    .vyrdict-index-claw .vti-reveal-card{
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      overflow:visible!important;
      height:540px!important;
    }

    .vyrdict-index-claw .vti-machine{
      position:relative!important;
      left:auto!important;
      top:auto!important;
      width:335px!important;
      height:500px!important;
      max-width:none!important;
      transform:translateY(1px)!important;
      transform-origin:center center!important;
      filter:drop-shadow(0 18px 20px rgba(71,65,62,.19))!important;
    }

    .vyrdict-index-claw .vti-cat{
      background:var(--vti-pill)!important;
      border-color:var(--vti-line)!important;
      color:#5f5852!important;
      box-shadow:none!important;
      backdrop-filter:blur(3px);
    }

    .vyrdict-index-claw .vti-cat:hover{
      background:rgba(255,250,245,.9)!important;
      border-color:rgba(44,39,35,.19)!important;
    }

    .vyrdict-index-claw .vti-cat.is-active{
      background:#24211f!important;
      border-color:#24211f!important;
      color:#fff!important;
      box-shadow:none!important;
    }

    .vyrdict-index-claw .vti-kicker{color:#716961!important}
    .vyrdict-index-claw .vti-sub{color:#625b55!important}

    .vyrdict-index-claw .vti-panel-top{left:28px!important;right:28px!important;top:25px!important}
    .vyrdict-index-claw .vti-reveal-link{inset:60px 25px 122px!important}
    .vyrdict-index-claw .vti-panel-copy{left:30px!important;right:30px!important;bottom:28px!important}
    .vyrdict-index-claw .vti-brand{margin-bottom:7px!important}
    .vyrdict-index-claw .vti-name{font-size:clamp(30px,3.2vw,48px)!important;line-height:.97!important}
    .vyrdict-index-claw .vti-open{margin-top:12px!important}
    .vyrdict-index-claw .vti-foot{margin-top:14px!important}

    @media(max-width:700px){
      .vyrdict-index-claw{
        --vti-grid-size:24px;
        --vti-grid-line:rgba(67,61,57,.055);
        height:auto!important;
        background:
          linear-gradient(var(--vti-grid-line) 1px,transparent 1px),
          linear-gradient(90deg,var(--vti-grid-line) 1px,transparent 1px),
          linear-gradient(155deg,
            var(--vti-sage) 0%,
            var(--vti-sage-mid) 38%,
            var(--vti-blend) 54%,
            var(--vti-lavender-mid) 72%,
            var(--vti-lavender) 100%)!important;
        background-size:
          var(--vti-grid-size) var(--vti-grid-size),
          var(--vti-grid-size) var(--vti-grid-size),
          100% 100%!important;
        background-position:-1px -1px,-1px -1px,0 0!important;
      }
      .vyrdict-index-claw .vti-wrap{height:auto!important;display:block!important}
      .vyrdict-index-claw .vti-grid{height:auto!important}
      .vyrdict-index-claw .vti-machine-stage{height:525px!important}
      .vyrdict-index-claw .vti-reveal-card{height:500px!important}
      .vyrdict-index-claw .vti-machine{position:relative!important;left:auto!important;top:auto!important;transform:none!important;width:min(335px,88vw)!important;height:500px!important}
      .vyrdict-index-claw .vti-reveal-link{inset:60px 18px 120px!important}
      .vyrdict-index-claw .vti-panel-copy{left:24px!important;right:24px!important;bottom:24px!important}
    }
  `;
  document.head.appendChild(s);
})();
