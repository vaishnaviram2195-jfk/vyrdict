(()=>{
  if(window.__vyrdictTrendingNeutralToneV8)return;
  window.__vyrdictTrendingNeutralToneV8=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v8';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Exact video direction:
       - remove the purple entirely
       - use the existing muted sage across the WHOLE Trending Index
       - keep the locked claw machine/product behavior
       - make the desktop section about the same vertical length as the homepage hero */
    .vyrdict-index-claw{
      --vti-sage:#d9e3d4;
      --vti-pill:rgba(248,244,239,.78);
      --vti-line:rgba(44,39,35,.11);
      position:relative!important;
      box-sizing:border-box!important;
      background:var(--vti-sage)!important;
      box-shadow:none!important;
      border:0!important;
      overflow:hidden!important;
      height:var(--vti-section-h,520px)!important;
      min-height:0!important;
      padding:26px 0 22px!important;
    }

    .vyrdict-index-claw::before,
    .vyrdict-index-claw::after{content:none!important;display:none!important}

    .vyrdict-index-claw .vti-wrap{
      width:min(1200px,calc(100% - 40px))!important;
      height:100%!important;
      margin:0 auto!important;
      position:relative!important;
      z-index:1!important;
      display:grid!important;
      grid-template-rows:auto auto minmax(0,1fr) auto!important;
      min-height:0!important;
    }

    .vyrdict-index-claw .vti-head{
      margin-bottom:7px!important;
      align-items:end!important;
    }
    .vyrdict-index-claw .vti-kicker{color:#716961!important;margin-bottom:6px!important}
    .vyrdict-index-claw .vti-title{line-height:.96!important}
    .vyrdict-index-claw .vti-sub{color:#625b55!important;margin-bottom:2px!important}

    .vyrdict-index-claw .vti-cats{
      padding:1px 1px 8px!important;
      gap:7px!important;
      min-height:0!important;
    }
    .vyrdict-index-claw .vti-cat{
      background:var(--vti-pill)!important;
      border-color:var(--vti-line)!important;
      color:#5f5852!important;
      box-shadow:none!important;
      backdrop-filter:blur(3px);
      padding:9px 13px!important;
    }
    .vyrdict-index-claw .vti-cat:hover{
      background:rgba(255,250,245,.92)!important;
      border-color:rgba(44,39,35,.19)!important;
    }
    .vyrdict-index-claw .vti-cat.is-active{
      background:#24211f!important;
      border-color:#24211f!important;
      color:#fff!important;
      box-shadow:none!important;
    }

    .vyrdict-index-claw .vti-grid{
      min-height:0!important;
      height:100%!important;
      gap:0!important;
      align-items:stretch!important;
    }
    .vyrdict-index-claw .vti-machine-stage,
    .vyrdict-index-claw .vti-reveal-card{
      position:relative!important;
      height:100%!important;
      min-height:0!important;
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      overflow:hidden!important;
    }

    /* Preserve the locked machine design, only scale its footprint so the whole section fits the hero-height target. */
    .vyrdict-index-claw .vti-machine{
      position:absolute!important;
      left:50%!important;
      top:50%!important;
      transform:translate(-50%,-50%) scale(.70)!important;
      transform-origin:center center!important;
    }

    /* Keep the product reveal visually substantial inside the shorter section. */
    .vyrdict-index-claw .vti-panel-top{top:13px!important;left:26px!important;right:26px!important}
    .vyrdict-index-claw .vti-reveal-link{inset:34px 24px 74px!important}
    .vyrdict-index-claw .vti-reveal-link img{
      width:88%!important;
      height:90%!important;
      object-fit:contain!important;
      background:transparent!important;
    }
    .vyrdict-index-claw .vti-panel-copy{left:28px!important;right:28px!important;bottom:12px!important}
    .vyrdict-index-claw .vti-brand{margin-bottom:5px!important}
    .vyrdict-index-claw .vti-name{font-size:clamp(24px,2.4vw,36px)!important}
    .vyrdict-index-claw .vti-open{margin-top:8px!important}
    .vyrdict-index-claw .vti-placeholder{font-size:22px!important}

    .vyrdict-index-claw .vti-foot{
      margin-top:5px!important;
      min-height:14px!important;
      align-items:end!important;
    }

    @media(max-width:760px){
      .vyrdict-index-claw{
        height:auto!important;
        min-height:0!important;
        padding:38px 0 42px!important;
        background:var(--vti-sage)!important;
        overflow:hidden!important;
      }
      .vyrdict-index-claw .vti-wrap{
        width:min(100% - 24px,680px)!important;
        height:auto!important;
        display:block!important;
      }
      .vyrdict-index-claw .vti-head{margin-bottom:10px!important}
      .vyrdict-index-claw .vti-cats{padding-bottom:12px!important}
      .vyrdict-index-claw .vti-grid{display:grid!important;grid-template-columns:1fr!important;gap:10px!important;height:auto!important}
      .vyrdict-index-claw .vti-machine-stage{height:430px!important}
      .vyrdict-index-claw .vti-reveal-card{height:410px!important}
      .vyrdict-index-claw .vti-machine{transform:translate(-50%,-50%) scale(.80)!important}
      .vyrdict-index-claw .vti-reveal-link{inset:45px 18px 92px!important}
      .vyrdict-index-claw .vti-foot{margin-top:12px!important}
    }
  `;
  document.head.appendChild(s);

  let resizeTimer=0,attempts=0;
  function syncSectionToHero(){
    const section=document.querySelector('.vyrdict-index-claw');
    const hero=document.querySelector('.hero.vyrdict-hero-v8,.hero');
    if(!section||!hero){
      if(attempts++<30)setTimeout(syncSectionToHero,100);
      return;
    }
    attempts=0;
    if(innerWidth<=760){
      section.style.removeProperty('--vti-section-h');
      return;
    }
    const cssH=parseFloat(getComputedStyle(hero).getPropertyValue('--vyrdict-hero-h'));
    const measured=Math.round(hero.getBoundingClientRect().height||0);
    const heroH=Number.isFinite(cssH)&&cssH>0?cssH:(measured>0?measured:520);
    section.style.setProperty('--vti-section-h',`${Math.round(heroH)}px`);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncSectionToHero,{once:true});
  else syncSectionToHero();
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(syncSectionToHero,100)},{passive:true});
  setTimeout(syncSectionToHero,250);
  setTimeout(syncSectionToHero,700);
  setTimeout(syncSectionToHero,1400);
})();
