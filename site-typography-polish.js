(()=>{
  if(window.__vyrdictTypographyPolishV1)return;
  window.__vyrdictTypographyPolishV1=1;

  const STYLE_ID='vyrdict-typography-polish-v1';
  const INFO_PAGE=/\/(?:about|careers|editorial-policy|evidence|how-vyrdict-scores|privacy|suggest-product|terms)(?:\.html)?\/?$/i.test(location.pathname||'');

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    document.documentElement.classList.add('vyrdict-type-polish');
    if(INFO_PAGE)document.documentElement.classList.add('vyrdict-info-page');

    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      html.vyrdict-type-polish body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
      html.vyrdict-type-polish h1,html.vyrdict-type-polish h2,html.vyrdict-type-polish h3{text-wrap:balance}
      html.vyrdict-type-polish p{text-wrap:pretty}

      /* Main VYRDICT app hierarchy */
      html.vyrdict-type-polish .hero h1{font-size:clamp(42px,5.4vw,64px)!important;line-height:.96!important;letter-spacing:-.045em!important}
      html.vyrdict-type-polish .hero p{font-size:clamp(15px,1.55vw,18px)!important;line-height:1.58!important;max-width:700px!important}
      html.vyrdict-type-polish .section .head h2,
      html.vyrdict-type-polish .section .head h3{font-size:clamp(32px,3.7vw,44px)!important;line-height:1.03!important;letter-spacing:-.04em!important}
      html.vyrdict-type-polish .section .head p{font-size:14px!important;line-height:1.6!important;max-width:520px!important}
      html.vyrdict-type-polish .category{line-height:1.1!important}

      /* Trending Index: keep the locked machine untouched; only calm typography */
      html.vyrdict-type-polish .vyrdict-index-claw .vti-title{font-size:clamp(38px,4.35vw,52px)!important;line-height:.98!important;letter-spacing:-.045em!important}
      html.vyrdict-type-polish .vyrdict-index-claw .vti-sub{font-size:13px!important;line-height:1.55!important;max-width:330px!important}
      html.vyrdict-type-polish .vyrdict-index-claw .vti-name{font-size:clamp(27px,2.75vw,36px)!important;line-height:1.02!important;letter-spacing:-.038em!important}
      html.vyrdict-type-polish .vyrdict-index-claw .vti-kicker,
      html.vyrdict-type-polish .vyrdict-index-claw .vti-now,
      html.vyrdict-type-polish .vyrdict-index-claw .vti-panel-cat{line-height:1.2!important}

      /* Product detail pages */
      html.vyrdict-type-polish .productHero .info>h1{font-size:clamp(36px,3.9vw,50px)!important;line-height:.99!important;letter-spacing:-.04em!important}
      html.vyrdict-type-polish .story article:first-child>h3.vyrdict-detail-heading,
      html.vyrdict-type-polish .story article:nth-child(2)>h3{font-size:27px!important;line-height:1.14!important}
      html.vyrdict-type-polish .story article:first-child>p.vyrdict-detail-copy{font-size:14px!important;line-height:1.65!important;max-width:68ch}

      /* Homepage editorial CTA cards */
      html.vyrdict-type-polish .vyrdict-featured-cta h3{font-size:clamp(26px,2.65vw,34px)!important;line-height:1.04!important;letter-spacing:-.032em!important}
      html.vyrdict-type-polish .vyrdict-featured-cta p{font-size:12.5px!important;line-height:1.58!important}

      /* Footer hierarchy */
      html.vyrdict-type-polish #vyrdict-company-footer .vf-brand-name{font-size:26px!important}
      html.vyrdict-type-polish #vyrdict-company-footer .vf-brand p{font-size:13px!important;line-height:1.6!important}
      html.vyrdict-type-polish #vyrdict-company-footer .vf-links a{font-size:12px!important;line-height:1.45!important}
      html.vyrdict-type-polish #vyrdict-company-footer .vf-wordmark{font-size:clamp(52px,6.2vw,80px)!important;line-height:.9!important}

      /* Public information / trust pages */
      html.vyrdict-info-page .hero{padding-top:56px!important;padding-bottom:34px!important}
      html.vyrdict-info-page .hero h1{font-size:clamp(40px,5.5vw,60px)!important;line-height:.98!important;letter-spacing:-.045em!important;max-width:850px!important}
      html.vyrdict-info-page .hero p,
      html.vyrdict-info-page .hero .lede,
      html.vyrdict-info-page .lede{font-size:15px!important;line-height:1.65!important;max-width:740px!important}
      html.vyrdict-info-page .section h2{font-size:clamp(30px,3.7vw,42px)!important;line-height:1.05!important;letter-spacing:-.035em!important}
      html.vyrdict-info-page .section>.shell>p,
      html.vyrdict-info-page .section>div>p{font-size:14px!important;line-height:1.65!important;max-width:740px!important}
      html.vyrdict-info-page .card h2{font-size:26px!important;line-height:1.08!important;letter-spacing:-.025em!important}
      html.vyrdict-info-page .card p{font-size:13.5px!important;line-height:1.65!important}
      html.vyrdict-info-page .eyebrow{line-height:1.35!important}

      @media(max-width:700px){
        html.vyrdict-type-polish .hero h1{font-size:clamp(38px,10vw,44px)!important;line-height:1!important;letter-spacing:-.04em!important}
        html.vyrdict-type-polish .hero p{font-size:15px!important;line-height:1.58!important}
        html.vyrdict-type-polish .section .head h2,
        html.vyrdict-type-polish .section .head h3{font-size:clamp(29px,8.5vw,34px)!important;line-height:1.05!important}
        html.vyrdict-type-polish .section .head p{font-size:13px!important;line-height:1.58!important}
        html.vyrdict-type-polish .vyrdict-index-claw .vti-title{font-size:40px!important;line-height:1!important}
        html.vyrdict-type-polish .vyrdict-index-claw .vti-sub{font-size:13px!important;max-width:34ch!important}
        html.vyrdict-type-polish .vyrdict-index-claw .vti-name{font-size:30px!important;line-height:1.04!important}
        html.vyrdict-type-polish .productHero .info>h1{font-size:clamp(34px,9vw,40px)!important;line-height:1.02!important}
        html.vyrdict-type-polish .story article:first-child>h3.vyrdict-detail-heading,
        html.vyrdict-type-polish .story article:nth-child(2)>h3{font-size:25px!important}
        html.vyrdict-type-polish .vyrdict-featured-cta h3{font-size:28px!important}
        html.vyrdict-type-polish #vyrdict-company-footer .vf-wordmark{font-size:clamp(46px,13vw,62px)!important}
        html.vyrdict-info-page .hero{padding-top:42px!important;padding-bottom:28px!important}
        html.vyrdict-info-page .hero h1{font-size:clamp(36px,10vw,42px)!important;line-height:1.02!important}
        html.vyrdict-info-page .hero p,
        html.vyrdict-info-page .hero .lede,
        html.vyrdict-info-page .lede{font-size:14px!important;line-height:1.62!important}
        html.vyrdict-info-page .section h2{font-size:30px!important;line-height:1.07!important}
        html.vyrdict-info-page .card h2{font-size:24px!important;line-height:1.1!important}
        html.vyrdict-info-page .card p{font-size:13.5px!important;line-height:1.65!important}
      }
    `;
    document.head.appendChild(s);
  }

  addStyle();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addStyle,{once:true});
  addEventListener('popstate',()=>setTimeout(addStyle,20));
})();
