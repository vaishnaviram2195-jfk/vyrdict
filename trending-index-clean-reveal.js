(()=>{
  if(window.__vyrdictTrendingCleanRevealV3)return;
  window.__vyrdictTrendingCleanRevealV3=1;

  const FILTER_ID='vyrdict-trending-product-cutout-v3';
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
    filter.setAttribute('x','-25%');
    filter.setAttribute('y','-25%');
    filter.setAttribute('width','150%');
    filter.setAttribute('height','150%');
    filter.setAttribute('color-interpolation-filters','sRGB');
    const matrix=document.createElementNS(ns,'feColorMatrix');
    matrix.setAttribute('in','SourceGraphic');
    matrix.setAttribute('result','lightMask');
    matrix.setAttribute('type','matrix');
    /* Remove only truly near-white / pale-neutral artwork backgrounds.
       Preserve light pink, beige and pastel product pixels so pale products stay visible. */
    matrix.setAttribute('values',`0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n-3.2 -3.2 -3.2 0 9.1`);
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

  const id='vyrdict-trending-clean-reveal-v3';
  if(document.getElementById(id))return;
  const s=document.createElement('style');
  s.id=id;
  s.textContent=`
    /* Tighten only the outer Trending Index breathing room. */
    .vyrdict-index-claw{
      padding-top:28px!important;
      padding-bottom:22px!important;
    }

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
      inset:64px 4px 198px 4px!important;
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
      width:94%!important;
      height:100%!important;
      max-width:470px!important;
      object-fit:contain!important;
      transform:scale(1.10)!important;
      transform-origin:center center!important;
      filter:url(#${FILTER_ID}) saturate(1.20) contrast(1.09) brightness(1.02) drop-shadow(0 24px 26px rgba(67,43,33,.22))!important;
    }

    /* Reserve a clean text zone so long names never collide with artwork. */
    .vyrdict-index-claw .vti-panel-copy{
      left:30px!important;
      right:30px!important;
      bottom:20px!important;
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
    .vyrdict-index-claw .vti-foot{margin-top:7px!important}

    @media(max-width:760px){
      .vyrdict-index-claw{
        padding-top:26px!important;
        padding-bottom:20px!important;
      }
      .vyrdict-index-claw .vti-reveal-card{height:530px!important}
      .vyrdict-index-claw .vti-reveal-link{
        inset:66px 2px 198px 2px!important;
      }
      .vyrdict-index-claw .vti-reveal-link img{
        width:94%!important;
        height:100%!important;
        max-width:380px!important;
        transform:scale(1.08)!important;
      }
      .vyrdict-index-claw .vti-panel-copy{
        left:24px!important;
        right:24px!important;
        bottom:22px!important;
        max-width:92%!important;
      }
    }
  `;
  document.head.appendChild(s);
})();
