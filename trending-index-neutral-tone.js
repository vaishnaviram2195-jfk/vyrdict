(()=>{
  if(window.__vyrdictTrendingNeutralToneV1)return;
  window.__vyrdictTrendingNeutralToneV1=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v1';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Keep the locked light-gray + VYRDICT-pink claw machine unchanged.
       Only rebalance the surrounding Trending Index surfaces. */
    .vyrdict-index-claw{
      --vti-stone:#ebe7e2;
      --vti-stone-deep:#e4dfd9;
      --vti-surface:#f4f1ed;
      --vti-surface-soft:#f7f4f0;
      --vti-line:rgba(42,38,35,.10);
      background:
        radial-gradient(circle at 82% 20%,rgba(255,255,255,.42),transparent 31%),
        linear-gradient(135deg,var(--vti-surface-soft) 0%,var(--vti-stone) 52%,var(--vti-stone-deep) 100%)!important;
    }

    .vyrdict-index-claw .vti-machine-stage{
      background:rgba(247,244,240,.72)!important;
      box-shadow:0 18px 46px rgba(48,43,39,.075)!important;
    }

    .vyrdict-index-claw .vti-reveal-card{
      background:var(--vti-surface)!important;
      border:0!important;
      box-shadow:0 18px 46px rgba(48,43,39,.075)!important;
    }

    .vyrdict-index-claw .vti-cat{
      background:rgba(248,245,241,.88)!important;
      border-color:var(--vti-line)!important;
      color:#625b55!important;
      box-shadow:none!important;
    }

    .vyrdict-index-claw .vti-cat:hover{
      background:#faf8f5!important;
      border-color:rgba(42,38,35,.18)!important;
    }

    .vyrdict-index-claw .vti-cat.is-active{
      background:#24211f!important;
      border-color:#24211f!important;
      color:#fff!important;
    }

    .vyrdict-index-claw .vti-kicker{color:#756d66!important}
    .vyrdict-index-claw .vti-sub{color:#6b645e!important}

    @media(max-width:700px){
      .vyrdict-index-claw{
        background:linear-gradient(145deg,#f3f0ec 0%,#ebe7e2 58%,#e5e0da 100%)!important;
      }
      .vyrdict-index-claw .vti-machine-stage,
      .vyrdict-index-claw .vti-reveal-card{
        box-shadow:0 14px 34px rgba(48,43,39,.065)!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
