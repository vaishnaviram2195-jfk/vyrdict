(()=>{
  if(window.__vyrdictTrendingNeutralToneV9)return;
  window.__vyrdictTrendingNeutralToneV9=1;

  const STYLE_ID='vyrdict-trending-neutral-tone-v9';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Approved direction:
       - restore the original vertical gray + VYRDICT-pink claw machine
       - keep the sage-to-muted-lavender blend
       - keep the whole Trending Index at the homepage hero height
       - fit the machine and reveal copy INSIDE the colored section */
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
      padding:22px 0 16px!important;
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

    .vyrdict-index-claw .vti-head{margin-bottom:6px!important;align-items:end!important}
    .vyrdict-index-claw .vti-kicker{color:#716961!important;margin-bottom:5px!important}
    .vyrdict-index-claw .vti-title{line-height:.96!important}
    .vyrdict-index-claw .vti-sub{color:#625b55!important;margin-bottom:1px!important}
    .vyrdict-index-claw .vti-cats{padding:1px 1px 7px!important;gap:7px!important;min-height:0!important}
    .vyrdict-index-claw .vti-cat{
      background:var(--vti-pill)!important;
      border-color:var(--vti-line)!important;
      color:#5f5852!important;
      box-shadow:none!important;
      backdrop-filter:blur(3px);
      padding:8px 12px!important;
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

    /* Restore the original vertical cabinet dimensions/design from the core claw file.
       Position it independently of layout height, then scale just enough to keep it contained. */
    .vyrdict-index-claw .vti-machine{
      width:335px!important;
      height:500px!important;
      max-width:none!important;
      position:absolute!important;
      left:50%!important;
      top:47%!important;
      transform:translate(-50%,-50%) scale(.72)!important;
      transform-origin:center center!important;
      filter:drop-shadow(0 15px 18px rgba(71,65,62,.17))!important;
    }

    /* Explicitly restore every cabinet part that the horizontal experiment re-proportioned. */
    .vyrdict-index-claw .vti-body{clip-path:polygon(7% 0,93% 0,96% 5%,96% 94%,91% 100%,9% 100%,4% 94%,4% 5%)!important}
    .vyrdict-index-claw .vti-topcap{left:17px!important;right:17px!important;top:12px!important;height:50px!important}
    .vyrdict-index-claw .vti-topcap:before,.vyrdict-index-claw .vti-topcap:after{bottom:-10px!important;width:8px!important;height:10px!important}
    .vyrdict-index-claw .vti-topcap span{font-size:18px!important}
    .vyrdict-index-claw .vti-window{left:28px!important;right:28px!important;top:63px!important;height:287px!important;border-left-width:6px!important;border-right-width:6px!important;border-bottom-width:8px!important}
    .vyrdict-index-claw .vti-window:before{height:7px!important}
    .vyrdict-index-claw .vti-post{width:5px!important}.vyrdict-index-claw .vti-post.p1{left:11px!important}.vyrdict-index-claw .vti-post.p2{right:11px!important}
    .vyrdict-index-claw .vti-track{left:20px!important;right:20px!important;top:13px!important;height:3px!important}
    .vyrdict-index-claw .vti-claw{top:11px!important;width:66px!important;height:150px!important}
    .vyrdict-index-claw .vti-slider{width:26px!important;height:14px!important}
    .vyrdict-index-claw .vti-cable{top:12px!important;height:calc(54px + var(--drop))!important}
    .vyrdict-index-claw .vti-grabber{top:calc(63px + var(--drop))!important;width:54px!important;height:46px!important}
    .vyrdict-index-claw .vti-grabber:before{width:22px!important;height:15px!important}
    .vyrdict-index-claw .vti-arm{top:9px!important;width:19px!important;height:34px!important}
    .vyrdict-index-claw .vti-products{left:12px!important;right:12px!important;bottom:41px!important;height:124px!important}
    .vyrdict-index-claw .vti-product{bottom:9px!important;width:52px!important;height:100px!important}
    .vyrdict-index-claw .vti-product.is-grabbed{transform:translate(-50%,-74px) scale(.92)!important}
    .vyrdict-index-claw .vti-pebbles{height:47px!important}
    .vyrdict-index-claw .vti-console{left:24px!important;right:24px!important;top:356px!important;height:103px!important}
    .vyrdict-index-claw .vti-console-left{left:12px!important;top:11px!important;width:53%!important;height:76px!important}
    .vyrdict-index-claw .vti-stick{left:22px!important;bottom:15px!important;width:25px!important;height:25px!important}
    .vyrdict-index-claw .vti-stick:before{bottom:18px!important;width:4px!important;height:18px!important}
    .vyrdict-index-claw .vti-stick:after{bottom:31px!important;width:13px!important;height:13px!important}
    .vyrdict-index-claw .vti-console-buttons{left:70px!important;bottom:20px!important;gap:8px!important}
    .vyrdict-index-claw .vti-console-buttons i{width:12px!important;height:12px!important}
    .vyrdict-index-claw .vti-prize-slot{right:10px!important;top:9px!important;width:37%!important;height:80px!important;border-width:7px!important}
    .vyrdict-index-claw .vti-prize-slot:after{left:10px!important;right:10px!important;top:11px!important;height:7px!important}
    .vyrdict-index-claw .vti-footbar{left:15px!important;right:15px!important;bottom:15px!important;height:14px!important}

    /* Keep the reveal large, but pull all copy up so nothing drops below the colored section. */
    .vyrdict-index-claw .vti-panel-top{left:24px!important;right:24px!important;top:8px!important}
    .vyrdict-index-claw .vti-reveal-link{inset:24px 18px 78px!important}
    .vyrdict-index-claw .vti-reveal-link img{width:88%!important;height:90%!important;object-fit:contain!important}
    .vyrdict-index-claw .vti-panel-copy{left:26px!important;right:26px!important;bottom:7px!important}
    .vyrdict-index-claw .vti-brand{margin-bottom:3px!important}
    .vyrdict-index-claw .vti-name{font-size:clamp(22px,2.1vw,33px)!important;line-height:.98!important;max-width:96%!important}
    .vyrdict-index-claw .vti-open{margin-top:5px!important}
    .vyrdict-index-claw .vti-placeholder{font-size:20px!important}
    .vyrdict-index-claw .vti-foot{margin-top:3px!important;min-height:12px!important;align-items:end!important}

    @media(max-width:760px){
      .vyrdict-index-claw{
        height:auto!important;
        min-height:0!important;
        padding:38px 0 42px!important;
        background:linear-gradient(155deg,var(--vti-sage) 0%,var(--vti-sage-mid) 38%,var(--vti-blend) 54%,var(--vti-lavender-mid) 72%,var(--vti-lavender) 100%)!important;
      }
      .vyrdict-index-claw .vti-wrap{width:min(100% - 24px,680px)!important;height:auto!important;display:block!important}
      .vyrdict-index-claw .vti-grid{grid-template-columns:1fr!important;gap:10px!important;height:auto!important}
      .vyrdict-index-claw .vti-machine-stage{height:430px!important}
      .vyrdict-index-claw .vti-reveal-card{height:390px!important}
      .vyrdict-index-claw .vti-machine{top:50%!important;transform:translate(-50%,-50%) scale(.80)!important}
      .vyrdict-index-claw .vti-reveal-link{inset:38px 18px 88px!important}
      .vyrdict-index-claw .vti-panel-copy{bottom:14px!important}
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
