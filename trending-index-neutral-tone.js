(()=>{
  if(window.__vyrdictTrendingNeutralToneV2)return;
  window.__vyrdictTrendingNeutralToneV2=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v2';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Stronger neutral contrast around the locked claw machine. */
    .vyrdict-index-claw{
      --vti-stone:#ddd9d4;
      --vti-stone-deep:#d3cec8;
      --vti-machine-surface:#ebe7e2;
      --vti-reveal-surface:#f5f1ec;
      --vti-pill:#e9e4de;
      --vti-line:rgba(42,38,35,.12);
      background:
        radial-gradient(circle at 78% 16%,rgba(255,255,255,.34),transparent 27%),
        linear-gradient(135deg,#e5e1dc 0%,var(--vti-stone) 46%,var(--vti-stone-deep) 100%)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.48),inset 0 -1px 0 rgba(56,50,45,.05)!important;
    }

    .vyrdict-index-claw .vti-machine-stage{
      background:linear-gradient(160deg,#eeeae5 0%,var(--vti-machine-surface) 100%)!important;
      box-shadow:0 18px 46px rgba(44,40,36,.11)!important;
    }

    .vyrdict-index-claw .vti-reveal-card{
      background:linear-gradient(160deg,#f8f5f1 0%,var(--vti-reveal-surface) 100%)!important;
      border:0!important;
      box-shadow:0 18px 46px rgba(44,40,36,.11)!important;
    }

    .vyrdict-index-claw .vti-cat{
      background:var(--vti-pill)!important;
      border-color:var(--vti-line)!important;
      color:#5c554f!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.56)!important;
    }

    .vyrdict-index-claw .vti-cat:hover{
      background:#f1ede8!important;
      border-color:rgba(42,38,35,.21)!important;
    }

    .vyrdict-index-claw .vti-cat.is-active{
      background:#24211f!important;
      border-color:#24211f!important;
      color:#fff!important;
      box-shadow:none!important;
    }

    .vyrdict-index-claw .vti-kicker{color:#706861!important}
    .vyrdict-index-claw .vti-sub{color:#625b55!important}
    .vyrdict-index-claw .vti-panel-top{opacity:.9}

    @media(max-width:700px){
      .vyrdict-index-claw{
        background:linear-gradient(145deg,#e3dfda 0%,#d9d5d0 58%,#d2cdc7 100%)!important;
      }
      .vyrdict-index-claw .vti-machine-stage{
        background:#ebe7e2!important;
      }
      .vyrdict-index-claw .vti-reveal-card{
        background:#f5f1ec!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
