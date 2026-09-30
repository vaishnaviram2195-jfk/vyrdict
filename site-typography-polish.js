(()=>{
  if(window.__vyrdictTypographyPolishV2)return;
  window.__vyrdictTypographyPolishV2=1;

  const STYLE_ID='vyrdict-typography-polish-v2';
  const INFO_PAGE=/\/(?:about|careers|editorial-policy|evidence|how-vyrdict-scores|privacy|suggest-product|terms)(?:\.html)?\/?$/i.test(location.pathname||'');

  function addStyle(){
    document.documentElement.classList.add('vyrdict-type-polish');
    if(INFO_PAGE)document.documentElement.classList.add('vyrdict-info-page');
    document.getElementById('vyrdict-typography-polish-v1')?.remove();
    let s=document.getElementById(STYLE_ID);
    if(!s){
      s=document.createElement('style');
      s.id=STYLE_ID;
      s.textContent=`
        html.vyrdict-type-polish body{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
        html.vyrdict-type-polish h1,html.vyrdict-type-polish h2,html.vyrdict-type-polish h3{text-wrap:balance}
        html.vyrdict-type-polish p{text-wrap:pretty}

        /* Restrained editorial hierarchy: titles lead without overpowering the page. */
        html.vyrdict-type-polish .hero h1,
        html.vyrdict-type-polish .wrap .hero h1{
          font-size:clamp(36px,4.35vw,52px)!important;
          line-height:.99!important;
          letter-spacing:-.042em!important;
        }
        html.vyrdict-type-polish .hero p{font-size:clamp(14px,1.35vw,16px)!important;line-height:1.62!important;max-width:700px!important}
        html.vyrdict-type-polish .section .head h2,
        html.vyrdict-type-polish .section .head h3{
          font-size:clamp(28px,3vw,38px)!important;
          line-height:1.05!important;
          letter-spacing:-.034em!important;
        }
        html.vyrdict-type-polish .section .head p{font-size:14px!important;line-height:1.62!important;max-width:520px!important}
        html.vyrdict-type-polish .category{line-height:1.1!important}

        /* Category / collection discovery pages */
        html.vyrdict-type-polish .wrap .grid .card .body h2{
          font-size:clamp(21px,2vw,24px)!important;
          line-height:1.08!important;
          letter-spacing:-.022em!important;
        }

        /* Trending Index: preserve the machine, calm only its typography. */
        html.vyrdict-type-polish .vyrdict-index-claw .vti-title{font-size:clamp(34px,3.7vw,46px)!important;line-height:1!important;letter-spacing:-.04em!important}
        html.vyrdict-type-polish .vyrdict-index-claw .vti-sub{font-size:13px!important;line-height:1.55!important;max-width:330px!important}
        html.vyrdict-type-polish .vyrdict-index-claw .vti-name{font-size:clamp(25px,2.4vw,32px)!important;line-height:1.04!important;letter-spacing:-.032em!important}
        html.vyrdict-type-polish .vyrdict-index-claw .vti-kicker,
        html.vyrdict-type-polish .vyrdict-index-claw .vti-now,
        html.vyrdict-type-polish .vyrdict-index-claw .vti-panel-cat{line-height:1.2!important}

        /* Product detail / SEO pages */
        html.vyrdict-type-polish .productHero .info>h1,
        html.vyrdict-type-polish .seo .hero h1{
          font-size:clamp(34px,3.65vw,48px)!important;
          line-height:1.01!important;
          letter-spacing:-.038em!important;
        }
        html.vyrdict-type-polish .seo .content h2,
        html.vyrdict-type-polish .story article:first-child>h3.vyrdict-detail-heading,
        html.vyrdict-type-polish .story article:nth-child(2)>h3{
          font-size:24px!important;
          line-height:1.14!important;
          letter-spacing:-.025em!important;
        }
        html.vyrdict-type-polish .story article:first-child>p.vyrdict-detail-copy{font-size:14px!important;line-height:1.65!important;max-width:68ch}

        /* Homepage / editorial CTA cards outside the main editorial canvas */
        html.vyrdict-type-polish .vyrdict-featured-cta h3{font-size:clamp(24px,2.3vw,30px)!important;line-height:1.06!important;letter-spacing:-.028em!important}
        html.vyrdict-type-polish .vyrdict-featured-cta p{font-size:12.5px!important;line-height:1.58!important}

        /* Public information / trust pages */
        html.vyrdict-info-page .hero{padding-top:52px!important;padding-bottom:32px!important}
        html.vyrdict-info-page .hero h1{
          font-size:clamp(34px,4.15vw,48px)!important;
          line-height:1.01!important;
          letter-spacing:-.04em!important;
          max-width:850px!important;
        }
        html.vyrdict-info-page .hero p,
        html.vyrdict-info-page .hero .lede,
        html.vyrdict-info-page .lede{font-size:14.5px!important;line-height:1.67!important;max-width:740px!important}
        html.vyrdict-info-page .section h2{
          font-size:clamp(26px,2.85vw,34px)!important;
          line-height:1.07!important;
          letter-spacing:-.03em!important;
        }
        html.vyrdict-info-page .section>.shell>p,
        html.vyrdict-info-page .section>div>p{font-size:14px!important;line-height:1.65!important;max-width:740px!important}
        html.vyrdict-info-page .card h2{font-size:24px!important;line-height:1.1!important;letter-spacing:-.024em!important}
        html.vyrdict-info-page .card p{font-size:13.5px!important;line-height:1.65!important}
        html.vyrdict-info-page .eyebrow{line-height:1.35!important}

        /* Footer identity remains a wordmark, not a content heading. */
        html.vyrdict-type-polish #vyrdict-company-footer .vf-brand-name{font-size:25px!important}
        html.vyrdict-type-polish #vyrdict-company-footer .vf-brand p{font-size:13px!important;line-height:1.6!important}
        html.vyrdict-type-polish #vyrdict-company-footer .vf-links a{font-size:12px!important;line-height:1.45!important}

        @media(max-width:700px){
          html.vyrdict-type-polish .hero h1,
          html.vyrdict-type-polish .wrap .hero h1{font-size:clamp(33px,9.2vw,40px)!important;line-height:1.02!important;letter-spacing:-.036em!important}
          html.vyrdict-type-polish .hero p{font-size:14px!important;line-height:1.6!important}
          html.vyrdict-type-polish .section .head h2,
          html.vyrdict-type-polish .section .head h3{font-size:clamp(27px,7.6vw,32px)!important;line-height:1.06!important}
          html.vyrdict-type-polish .section .head p{font-size:13px!important;line-height:1.58!important}
          html.vyrdict-type-polish .wrap .grid .card .body h2{font-size:22px!important;line-height:1.08!important}
          html.vyrdict-type-polish .vyrdict-index-claw .vti-title{font-size:36px!important;line-height:1.02!important}
          html.vyrdict-type-polish .vyrdict-index-claw .vti-sub{font-size:13px!important;max-width:34ch!important}
          html.vyrdict-type-polish .vyrdict-index-claw .vti-name{font-size:28px!important;line-height:1.05!important}
          html.vyrdict-type-polish .productHero .info>h1,
          html.vyrdict-type-polish .seo .hero h1{font-size:clamp(32px,8.7vw,38px)!important;line-height:1.03!important}
          html.vyrdict-type-polish .seo .content h2,
          html.vyrdict-type-polish .story article:first-child>h3.vyrdict-detail-heading,
          html.vyrdict-type-polish .story article:nth-child(2)>h3{font-size:22px!important}
          html.vyrdict-type-polish .vyrdict-featured-cta h3{font-size:26px!important}
          html.vyrdict-info-page .hero{padding-top:40px!important;padding-bottom:26px!important}
          html.vyrdict-info-page .hero h1{font-size:clamp(32px,8.8vw,38px)!important;line-height:1.04!important}
          html.vyrdict-info-page .hero p,
          html.vyrdict-info-page .hero .lede,
          html.vyrdict-info-page .lede{font-size:14px!important;line-height:1.62!important}
          html.vyrdict-info-page .section h2{font-size:clamp(25px,7.1vw,29px)!important;line-height:1.09!important}
          html.vyrdict-info-page .card h2{font-size:22px!important;line-height:1.11!important}
          html.vyrdict-info-page .card p{font-size:13.5px!important;line-height:1.65!important}
        }
      `;
    }
    if(document.head&&document.head.lastElementChild!==s)document.head.appendChild(s);
  }

  const settle=()=>[0,160,520,1200].forEach(ms=>setTimeout(addStyle,ms));
  addStyle();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',settle,{once:true});else settle();
  addEventListener('load',()=>setTimeout(addStyle,40),{once:true});
  addEventListener('popstate',()=>setTimeout(addStyle,80));
})();
