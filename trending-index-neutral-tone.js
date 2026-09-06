(()=>{
  if(window.__vyrdictTrendingNeutralToneV6)return;
  window.__vyrdictTrendingNeutralToneV6=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v6';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* One cohesive sage-to-lavender surface, now vertically matched to the hero on desktop. */
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

    @media(min-width:761px){
      .vyrdict-index-claw{
        height:var(--vti-hero-h,520px)!important;
        min-height:0!important;
        box-sizing:border-box!important;
        padding:28px 0 26px!important;
      }
      .vyrdict-index-claw .vti-wrap{
        height:100%!important;
        display:flex!important;
        flex-direction:column!important;
      }
      .vyrdict-index-claw .vti-head{
        flex:0 0 auto!important;
        margin-bottom:8px!important;
      }
      .vyrdict-index-claw .vti-kicker{margin-bottom:6px!important}
      .vyrdict-index-claw .vti-cats{
        flex:0 0 auto!important;
        padding-bottom:8px!important;
      }
      .vyrdict-index-claw .vti-grid{
        flex:1 1 auto!important;
        min-height:0!important;
        height:auto!important;
      }
      .vyrdict-index-claw .vti-machine-stage,
      .vyrdict-index-claw .vti-reveal-card{
        height:100%!important;
        min-height:0!important;
      }
      .vyrdict-index-claw .vti-machine{
        transform:translateY(1px) scale(var(--vti-machine-scale,.78))!important;
        transform-origin:center center!important;
      }
      .vyrdict-index-claw .vti-panel-top{top:16px!important}
      .vyrdict-index-claw .vti-reveal-link{inset:42px 25px 92px!important}
      .vyrdict-index-claw .vti-panel-copy{bottom:15px!important}
      .vyrdict-index-claw .vti-foot{
        flex:0 0 auto!important;
        margin-top:8px!important;
      }
    }

    @media(max-width:760px){
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

  let resizeTimer=0,attempts=0;
  function syncToHero(){
    const section=document.querySelector('.vyrdict-index-claw');
    const hero=document.querySelector('.hero.vyrdict-hero-v8,.hero');
    if(!section||!hero){
      if(attempts++<30)setTimeout(syncToHero,100);
      return;
    }
    attempts=0;
    if(innerWidth<=760){
      section.style.removeProperty('--vti-hero-h');
      section.style.removeProperty('--vti-machine-scale');
      return;
    }
    const cssH=parseFloat(getComputedStyle(hero).getPropertyValue('--vyrdict-hero-h'));
    const heroH=Number.isFinite(cssH)&&cssH>0?cssH:hero.getBoundingClientRect().height;
    if(heroH>0)section.style.setProperty('--vti-hero-h',`${Math.round(heroH)}px`);
    requestAnimationFrame(()=>{
      const stage=section.querySelector('.vti-machine-stage');
      if(!stage)return;
      const available=stage.getBoundingClientRect().height;
      const scale=Math.max(.54,Math.min(.88,(available-8)/500));
      section.style.setProperty('--vti-machine-scale',scale.toFixed(3));
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncToHero,{once:true});
  else syncToHero();
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(syncToHero,100)},{passive:true});
  setTimeout(syncToHero,350);
  setTimeout(syncToHero,900);
})();
