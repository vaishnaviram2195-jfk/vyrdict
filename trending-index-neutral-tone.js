(()=>{
  if(window.__vyrdictTrendingNeutralToneV7)return;
  window.__vyrdictTrendingNeutralToneV7=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v7';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Keep the Trending Index layout/content exactly as designed.
       Only limit the sage-to-lavender BACKGROUND depth to the original hero background height. */
    .vyrdict-index-claw{
      --vti-sage:#d9e3d4;
      --vti-sage-mid:#dfe5db;
      --vti-blend:#e3dfdf;
      --vti-lavender-mid:#e2dbe8;
      --vti-lavender:#ded5e7;
      --vti-pill:rgba(248,244,239,.76);
      --vti-line:rgba(44,39,35,.11);
      background:transparent!important;
      box-shadow:none!important;
      overflow:visible!important;
      isolation:isolate;
    }

    .vyrdict-index-claw::before{
      content:'';
      position:absolute;
      z-index:0;
      top:0;
      left:0;
      right:0;
      height:var(--vti-bg-h,520px);
      pointer-events:none;
      background:linear-gradient(112deg,
        var(--vti-sage) 0%,
        var(--vti-sage-mid) 34%,
        var(--vti-blend) 52%,
        var(--vti-lavender-mid) 70%,
        var(--vti-lavender) 100%);
    }

    .vyrdict-index-claw .vti-wrap{
      position:relative!important;
      z-index:1!important;
    }

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

    @media(max-width:760px){
      .vyrdict-index-claw::before{
        height:100%;
        background:linear-gradient(155deg,
          var(--vti-sage) 0%,
          var(--vti-sage-mid) 38%,
          var(--vti-blend) 54%,
          var(--vti-lavender-mid) 72%,
          var(--vti-lavender) 100%);
      }
    }
  `;
  document.head.appendChild(s);

  let resizeTimer=0,attempts=0;
  function syncBackgroundToHero(){
    const section=document.querySelector('.vyrdict-index-claw');
    const hero=document.querySelector('.hero.vyrdict-hero-v8,.hero');
    if(!section||!hero){
      if(attempts++<30)setTimeout(syncBackgroundToHero,100);
      return;
    }
    attempts=0;
    if(innerWidth<=760){
      section.style.removeProperty('--vti-bg-h');
      return;
    }
    const cssH=parseFloat(getComputedStyle(hero).getPropertyValue('--vyrdict-hero-h'));
    const heroBgH=Number.isFinite(cssH)&&cssH>0?cssH:520;
    section.style.setProperty('--vti-bg-h',`${Math.round(heroBgH)}px`);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncBackgroundToHero,{once:true});
  else syncBackgroundToHero();
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(syncBackgroundToHero,100)},{passive:true});
  setTimeout(syncBackgroundToHero,350);
  setTimeout(syncBackgroundToHero,900);
})();
