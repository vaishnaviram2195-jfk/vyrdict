(()=>{
  if(window.__vyrdictTrendingNeutralToneV5)return;
  window.__vyrdictTrendingNeutralToneV5=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v5';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Spoken video direction:
       One cohesive Trending Index surface — no separate left/right boxes.
       Start muted sage on the left, blend softly through the middle,
       and finish muted lavender on the right. Keep the locked claw machine unchanged. */
    .vyrdict-index-claw{
      --vti-sage:#d9e3d4;
      --vti-sage-mid:#dfe5db;
      --vti-blend:#e3dfdf;
      --vti-lavender-mid:#e2dbe8;
      --vti-lavender:#ded5e7;
      --vti-pill:rgba(248,244,239,.76);
      --vti-line:rgba(44,39,35,.11);
      background:linear-gradient(112deg,
        var(--vti-sage) 0%,
        var(--vti-sage-mid) 34%,
        var(--vti-blend) 52%,
        var(--vti-lavender-mid) 70%,
        var(--vti-lavender) 100%)!important;
      box-shadow:none!important;
    }

    /* Remove the two-card treatment completely. */
    .vyrdict-index-claw .vti-machine-stage,
    .vyrdict-index-claw .vti-reveal-card{
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      overflow:visible!important;
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

    @media(max-width:700px){
      .vyrdict-index-claw{
        background:linear-gradient(155deg,
          var(--vti-sage) 0%,
          var(--vti-sage-mid) 38%,
          var(--vti-blend) 54%,
          var(--vti-lavender-mid) 72%,
          var(--vti-lavender) 100%)!important;
      }
      .vyrdict-index-claw .vti-machine-stage,
      .vyrdict-index-claw .vti-reveal-card{
        background:transparent!important;
        border:0!important;
        border-radius:0!important;
        box-shadow:none!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
