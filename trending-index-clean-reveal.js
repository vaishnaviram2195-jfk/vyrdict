(()=>{
  if(window.__vyrdictTrendingCleanRevealV1)return;
  window.__vyrdictTrendingCleanRevealV1=1;
  const id='vyrdict-trending-clean-reveal-v1';
  if(document.getElementById(id))return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
    /* Trending Index reveal: product only, no image card/background. */
    .vyrdict-index-claw .vti-reveal-card{
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
      isolation:auto!important;
    }
    .vyrdict-index-claw .vti-reveal-card:before,
    .vyrdict-index-claw .vti-reveal-card:after{
      content:none!important;
      display:none!important;
      background:none!important;
      box-shadow:none!important;
    }
    .vyrdict-index-claw .vti-reveal-link{
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      overflow:visible!important;
    }
    .vyrdict-index-claw .vti-reveal-link:before,
    .vyrdict-index-claw .vti-reveal-link:after{
      content:none!important;
      display:none!important;
    }
    .vyrdict-index-claw .vti-reveal-link img{
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      mix-blend-mode:multiply!important;
      width:92%!important;
      height:98%!important;
      object-fit:contain!important;
      filter:saturate(1.08) contrast(1.025) drop-shadow(0 24px 28px rgba(67,43,33,.16))!important;
    }
    @media(max-width:760px){
      .vyrdict-index-claw .vti-reveal-link img{
        width:96%!important;
        height:100%!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
