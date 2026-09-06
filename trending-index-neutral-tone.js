(()=>{
  if(window.__vyrdictTrendingNeutralToneV3)return;
  window.__vyrdictTrendingNeutralToneV3=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v3';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Bring the existing VYRDICT muted sage + lavender language into Trending Index.
       Keep the locked light-gray + VYRDICT-pink claw machine itself unchanged. */
    .vyrdict-index-claw{
      --vti-sage:#d8e1d3;
      --vti-sage-soft:#e7ede3;
      --vti-lavender:#ddd4e6;
      --vti-lavender-soft:#ece6f0;
      --vti-neutral:#eeeae5;
      --vti-line:rgba(55,50,47,.11);
      background:
        radial-gradient(circle at 8% 12%,rgba(235,242,231,.72),transparent 34%),
        radial-gradient(circle at 92% 18%,rgba(236,228,243,.76),transparent 35%),
        linear-gradient(118deg,#dbe5d6 0%,#e3e2de 49%,#ddd4e6 100%)!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.45),inset 0 -1px 0 rgba(55,50,47,.05)!important;
    }

    .vyrdict-index-claw .vti-machine-stage{
      background:linear-gradient(155deg,#edf2e9 0%,var(--vti-sage-soft) 48%,#dbe4d7 100%)!important;
      box-shadow:0 18px 46px rgba(49,54,45,.10)!important;
    }

    .vyrdict-index-claw .vti-reveal-card{
      background:linear-gradient(155deg,#f2eef4 0%,var(--vti-lavender-soft) 50%,#e1d8e8 100%)!important;
      border:0!important;
      box-shadow:0 18px 46px rgba(55,47,61,.10)!important;
    }

    .vyrdict-index-claw .vti-cat{
      background:rgba(244,241,237,.88)!important;
      border-color:var(--vti-line)!important;
      color:#5d5853!important;
      box-shadow:inset 0 1px 0 rgba(255,255,255,.62)!important;
    }

    .vyrdict-index-claw .vti-cat:hover{
      background:#f8f5f1!important;
      border-color:rgba(55,50,47,.20)!important;
    }

    .vyrdict-index-claw .vti-cat.is-active{
      background:#24211f!important;
      border-color:#24211f!important;
      color:#fff!important;
      box-shadow:none!important;
    }

    .vyrdict-index-claw .vti-kicker{color:#6f6963!important}
    .vyrdict-index-claw .vti-sub{color:#625d58!important}

    @media(max-width:700px){
      .vyrdict-index-claw{
        background:linear-gradient(145deg,#dce6d7 0%,#e3e1df 50%,#ded5e7 100%)!important;
      }
      .vyrdict-index-claw .vti-machine-stage{
        background:linear-gradient(160deg,#edf2e9,#dce6d8)!important;
      }
      .vyrdict-index-claw .vti-reveal-card{
        background:linear-gradient(160deg,#f1edf4,#e2d9e9)!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
