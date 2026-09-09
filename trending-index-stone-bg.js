(()=>{
  if(window.__vyrdictTrendingStoneBgV1)return;
  window.__vyrdictTrendingStoneBgV1=1;

  const STYLE_ID='vyrdict-trending-stone-bg-v1';
  if(document.getElementById(STYLE_ID))return;

  const s=document.createElement('style');
  s.id=STYLE_ID;
  s.textContent=`
    /* Trending Index background only. Keep all existing layout, cards and interactions unchanged. */
    .vyrdict-index-gallery,
    .vyrdict-index-claw{
      --stone:#ECE7DF!important;
      background:#ECE7DF!important;
      background-image:none!important;
    }
  `;
  document.head.appendChild(s);
})();
