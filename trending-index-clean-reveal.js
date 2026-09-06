(()=>{
  if(window.__vyrdictTrendingCleanRevealV2)return;
  window.__vyrdictTrendingCleanRevealV2=1;

  const FILTER_ID='vyrdict-trending-product-cutout';
  if(!document.getElementById(FILTER_ID)){
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('width','0');
    svg.setAttribute('height','0');
    svg.setAttribute('aria-hidden','true');
    svg.style.position='absolute';
    svg.style.pointerEvents='none';
    svg.style.overflow='hidden';
    const defs=document.createElementNS(ns,'defs');
    const filter=document.createElementNS(ns,'filter');
    filter.setAttribute('id',FILTER_ID);
    filter.setAttribute('x','-20%');
    filter.setAttribute('y','-20%');
    filter.setAttribute('width','140%');
    filter.setAttribute('height','140%');
    filter.setAttribute('color-interpolation-filters','sRGB');
    const matrix=document.createElementNS(ns,'feColorMatrix');
    matrix.setAttribute('in','SourceGraphic');
    matrix.setAttribute('result','lightMask');
    matrix.setAttribute('type','matrix');
    matrix.setAttribute('values',`0 0 0 0 0
0 0 0 0 0
0 0 0 0 0
-.95 -.95 -.95 0 2.72`);
    const composite=document.createElementNS(ns,'feComposite');
    composite.setAttribute('in','SourceGraphic');
    composite.setAttribute('in2','lightMask');
    composite.setAttribute('operator','in');
    composite.setAttribute('result','cutout');
    filter.append(matrix,composite);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.documentElement.appendChild(svg);
  }

  const id='vyrdict-trending-clean-reveal-v2';
  if(document.getElementById(id))return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
    /* Product-only reveal: no rectangular artwork/card behind the product. */
    .vyrdict-index-claw .vti-reveal-card{
      background:transparent!important;
      border:0!important;
      box-shadow:none!important;
      isolation:auto!important;
    }
    .vyrdict-index-claw .vti-reveal-card:before,
    .vyrdict-index-claw .vti-reveal-card:after,
    .vyrdict-index-claw .vti-reveal-link:before,
    .vyrdict-index-claw .vti-reveal-link:after{
      content:none!important;
      display:none!important;
      background:none!important;
      box-shadow:none!important;
    }
    .vyrdict-index-claw .vti-reveal-link{
      inset:68px 8px 192px 8px!important;
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      overflow:visible!important;
      align-items:center!important;
      justify-content:center!important;
    }
    .vyrdict-index-claw .vti-reveal-link img{
      background:transparent!important;
      border:0!important;
      border-radius:0!important;
      box-shadow:none!important;
      mix-blend-mode:normal!important;
      width:86%!important;
      height:100%!important;
      max-width:440px!important;
      object-fit:contain!important;
      filter:url(#${FILTER_ID}) drop-shadow(0 22px 24px rgba(67,43,33,.18))!important;
    }
    .vyrdict-index-claw .vti-panel-copy{
      left:30px!important;
      right:30px!important;
      bottom:22px!important;
      max-width:92%!important;
      z-index:9!important;
    }
    .vyrdict-index-claw .vti-name{
      display:block!important;
      max-width:94%!important;
      margin:0!important;
      position:relative!important;
      z-index:10!important;
    }
    .vyrdict-index-claw .vti-momentum-copy,
    .vyrdict-index-claw .vti-open{position:relative!important;z-index:10!important}

    @media(max-width:760px){
      .vyrdict-index-claw .vti-reveal-card{height:540px!important}
      .vyrdict-index-claw .vti-reveal-link{
        inset:70px 4px 194px 4px!important;
      }
      .vyrdict-index-claw .vti-reveal-link img{
        width:88%!important;
        height:100%!important;
        max-width:360px!important;
      }
      .vyrdict-index-claw .vti-panel-copy{
        left:24px!important;
        right:24px!important;
        bottom:24px!important;
        max-width:92%!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
