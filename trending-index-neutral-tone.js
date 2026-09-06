(()=>{
  if(window.__vyrdictTrendingNeutralToneV8)return;
  window.__vyrdictTrendingNeutralToneV8=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v8';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Keep the approved sage-to-lavender blend, but make the whole module
       fit inside a hero-height surface. The claw machine becomes a wide
       horizontal arcade cabinet so it visually matches the product reveal. */
    .vyrdict-index-claw{
      --vti-sage:#d9e3d4;
      --vti-sage-mid:#dfe5db;
      --vti-blend:#e3dfdf;
      --vti-lavender-mid:#e2dbe8;
      --vti-lavender:#ded5e7;
      --vti-pill:rgba(248,244,239,.76);
      --vti-line:rgba(44,39,35,.11);
      box-sizing:border-box!important;
      height:var(--vti-section-h,520px)!important;
      min-height:0!important;
      padding:24px 0 18px!important;
      overflow:hidden!important;
      background:linear-gradient(112deg,
        var(--vti-sage) 0%,
        var(--vti-sage-mid) 34%,
        var(--vti-blend) 52%,
        var(--vti-lavender-mid) 70%,
        var(--vti-lavender) 100%)!important;
      box-shadow:none!important;
    }
    .vyrdict-index-claw::before,.vyrdict-index-claw::after{content:none!important;display:none!important}

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
    .vyrdict-index-claw .vti-head{margin-bottom:7px!important;align-items:end!important}
    .vyrdict-index-claw .vti-kicker{color:#716961!important;margin-bottom:6px!important}
    .vyrdict-index-claw .vti-title{line-height:.96!important}
    .vyrdict-index-claw .vti-sub{color:#625b55!important;margin-bottom:2px!important}
    .vyrdict-index-claw .vti-cats{padding:1px 1px 8px!important;gap:7px!important;min-height:0!important}
    .vyrdict-index-claw .vti-cat{
      background:var(--vti-pill)!important;
      border-color:var(--vti-line)!important;
      color:#5f5852!important;
      box-shadow:none!important;
      backdrop-filter:blur(3px);
      padding:9px 13px!important;
    }
    .vyrdict-index-claw .vti-cat:hover{background:rgba(255,250,245,.92)!important;border-color:rgba(44,39,35,.19)!important}
    .vyrdict-index-claw .vti-cat.is-active{background:#24211f!important;border-color:#24211f!important;color:#fff!important;box-shadow:none!important}

    .vyrdict-index-claw .vti-grid{
      display:grid!important;
      grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
      gap:22px!important;
      height:100%!important;
      min-height:0!important;
      align-items:stretch!important;
    }
    .vyrdict-index-claw .vti-machine-stage,
    .vyrdict-index-claw .vti-reveal-card{
      height:100%!important;
      min-height:0!important;
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      overflow:hidden!important;
      position:relative!important;
    }

    /* Horizontal claw-machine cabinet. Same visual language and controls,
       re-proportioned into a wide rectangle rather than a tall cabinet. */
    .vyrdict-index-claw .vti-machine{
      width:520px!important;
      height:300px!important;
      max-width:96%!important;
      position:relative!important;
      transform:none!important;
      filter:drop-shadow(0 14px 18px rgba(71,65,62,.16))!important;
    }
    .vyrdict-index-claw .vti-body{
      clip-path:polygon(3% 0,97% 0,99% 5%,99% 94%,97% 100%,3% 100%,1% 94%,1% 5%)!important;
    }
    .vyrdict-index-claw .vti-topcap{
      left:14px!important;right:14px!important;top:8px!important;height:38px!important;
    }
    .vyrdict-index-claw .vti-topcap:before,.vyrdict-index-claw .vti-topcap:after{bottom:-7px!important;height:7px!important;width:7px!important}
    .vyrdict-index-claw .vti-topcap span{font-size:16px!important}

    .vyrdict-index-claw .vti-window{
      left:22px!important;right:22px!important;top:48px!important;height:174px!important;
      border-left-width:5px!important;border-right-width:5px!important;border-bottom-width:6px!important;
    }
    .vyrdict-index-claw .vti-window:before{height:6px!important}
    .vyrdict-index-claw .vti-post{width:4px!important}
    .vyrdict-index-claw .vti-post.p1{left:9px!important}.vyrdict-index-claw .vti-post.p2{right:9px!important}
    .vyrdict-index-claw .vti-track{left:18px!important;right:18px!important;top:10px!important;height:3px!important}

    .vyrdict-index-claw .vti-claw{top:8px!important;width:60px!important;height:132px!important}
    .vyrdict-index-claw .vti-slider{width:24px!important;height:12px!important}
    .vyrdict-index-claw .vti-cable{top:10px!important;height:calc(34px + var(--drop))!important}
    .vyrdict-index-claw .vti-grabber{top:calc(42px + var(--drop))!important;width:48px!important;height:42px!important}
    .vyrdict-index-claw .vti-grabber:before{width:20px!important;height:13px!important}
    .vyrdict-index-claw .vti-arm{top:8px!important;width:17px!important;height:31px!important}

    .vyrdict-index-claw .vti-products{left:20px!important;right:20px!important;bottom:25px!important;height:76px!important}
    .vyrdict-index-claw .vti-product{bottom:5px!important;width:46px!important;height:70px!important}
    .vyrdict-index-claw .vti-product.is-grabbed{transform:translate(-50%,-50px) scale(.92)!important}
    .vyrdict-index-claw .vti-pebbles{height:30px!important}

    .vyrdict-index-claw .vti-console{
      left:22px!important;right:22px!important;top:228px!important;height:56px!important;
    }
    .vyrdict-index-claw .vti-console-left{left:9px!important;top:7px!important;width:58%!important;height:40px!important}
    .vyrdict-index-claw .vti-stick{left:18px!important;bottom:7px!important;width:20px!important;height:20px!important}
    .vyrdict-index-claw .vti-stick:before{bottom:14px!important;height:13px!important;width:3px!important}
    .vyrdict-index-claw .vti-stick:after{bottom:24px!important;width:11px!important;height:11px!important}
    .vyrdict-index-claw .vti-console-buttons{left:58px!important;bottom:12px!important;gap:7px!important}
    .vyrdict-index-claw .vti-console-buttons i{width:10px!important;height:10px!important}
    .vyrdict-index-claw .vti-prize-slot{right:8px!important;top:6px!important;width:34%!important;height:42px!important;border-width:5px!important}
    .vyrdict-index-claw .vti-prize-slot:after{left:8px!important;right:8px!important;top:7px!important;height:5px!important}
    .vyrdict-index-claw .vti-footbar{left:14px!important;right:14px!important;bottom:7px!important;height:8px!important}

    /* Product reveal is contained within the exact same vertical footprint. */
    .vyrdict-index-claw .vti-panel-top{left:24px!important;right:24px!important;top:10px!important}
    .vyrdict-index-claw .vti-reveal-link{inset:30px 18px 72px!important}
    .vyrdict-index-claw .vti-reveal-link img{width:88%!important;height:90%!important;object-fit:contain!important}
    .vyrdict-index-claw .vti-panel-copy{left:26px!important;right:26px!important;bottom:8px!important}
    .vyrdict-index-claw .vti-brand{margin-bottom:4px!important}
    .vyrdict-index-claw .vti-name{font-size:clamp(23px,2.25vw,35px)!important;line-height:.98!important}
    .vyrdict-index-claw .vti-open{margin-top:7px!important}
    .vyrdict-index-claw .vti-placeholder{font-size:21px!important}

    .vyrdict-index-claw .vti-foot{margin-top:5px!important;min-height:13px!important;align-items:end!important}

    @media(max-width:760px){
      .vyrdict-index-claw{
        height:auto!important;
        min-height:0!important;
        padding:38px 0 42px!important;
        background:linear-gradient(155deg,var(--vti-sage) 0%,var(--vti-sage-mid) 38%,var(--vti-blend) 54%,var(--vti-lavender-mid) 72%,var(--vti-lavender) 100%)!important;
      }
      .vyrdict-index-claw .vti-wrap{width:min(100% - 24px,680px)!important;height:auto!important;display:block!important}
      .vyrdict-index-claw .vti-grid{grid-template-columns:1fr!important;gap:12px!important;height:auto!important}
      .vyrdict-index-claw .vti-machine-stage{height:270px!important}
      .vyrdict-index-claw .vti-reveal-card{height:360px!important}
      .vyrdict-index-claw .vti-machine{transform:scale(.64)!important;transform-origin:center center!important;max-width:none!important}
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
    if(innerWidth<=760){section.style.removeProperty('--vti-section-h');return}
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
