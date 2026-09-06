(()=>{
  if(window.__vyrdictTrendingNeutralToneV4)return;
  window.__vyrdictTrendingNeutralToneV4=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v4';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Video direction:
       - keep the surrounding Trending Index area neutral like the rest of VYRDICT
       - use the muted green on the claw-machine panel
       - use the muted purple on the product-reveal panel
       - keep the locked gray + VYRDICT-pink claw machine unchanged */
    .vyrdict-index-claw{
      --vti-sage:#d9e3d4;
      --vti-lavender:#ded5e7;
      --vti-neutral:#f4ede5;
      --vti-pill:#f8f4ef;
      --vti-line:rgba(44,39,35,.11);
      background:var(--vti-neutral)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.38),inset 0 -1px 0 rgba(55,50,47,.04)!important;
    }

    .vyrdict-index-claw .vti-machine-stage{
      background:var(--vti-sage)!important;
      box-shadow:0 16px 40px rgba(50,57,47,.085)!important;
      border:0!important;
    }

    .vyrdict-index-claw .vti-reveal-card{
      background:var(--vti-lavender)!important;
      border:0!important;
      box-shadow:0 16px 40px rgba(56,49,62,.085)!important;
    }

    .vyrdict-index-claw .vti-cat{
      background:var(--vti-pill)!important;
      border-color:var(--vti-line)!important;
      color:#5f5852!important;
      box-shadow:none!important;
    }

    .vyrdict-index-claw .vti-cat:hover{
      background:#fffaf5!important;
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
      .vyrdict-index-claw{background:var(--vti-neutral)!important}
      .vyrdict-index-claw .vti-machine-stage{background:var(--vti-sage)!important}
      .vyrdict-index-claw .vti-reveal-card{background:var(--vti-lavender)!important}
    }
  `;
  document.head.appendChild(s);
})();
