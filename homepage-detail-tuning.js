(()=>{
  if(window.__vyrdictHomepageDetailTuningV1)return;
  window.__vyrdictHomepageDetailTuningV1=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='vyrdict-homepage-detail-tuning-v1';

  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      /* Culture cards: quieter subheadings under Beyond the product feed. */
      #vyrdict-editorial-home #ve-culture-trio .ve-culture-copy h3{
        font-size:clamp(22px,2.05vw,30px)!important;
        line-height:1.04!important;
        letter-spacing:-.032em!important;
        margin-bottom:10px!important;
      }

      /* Keep the featured Desk headline on the same scale as the secondary story. */
      #vyrdict-editorial-home #ve-news-desk .ve-news-secondary h3,
      #vyrdict-editorial-home #ve-news-desk .ve-news-lead h3{
        font-size:clamp(24px,2.2vw,36px)!important;
        line-height:1.03!important;
        letter-spacing:-.035em!important;
      }

      /* Product-shot treatment for the current headband visual in Signal, Not Noise. */
      #vyrdict-editorial-home .ve-story-media.ve-story-product-shot{
        background:#dedbd4!important;
      }
      #vyrdict-editorial-home .ve-story-media.ve-story-product-shot img{
        inset:7%!important;
        width:86%!important;
        height:86%!important;
        object-fit:contain!important;
        object-position:center!important;
        transform:none!important;
        filter:grayscale(.16) contrast(.97)!important;
      }

      @media(max-width:620px){
        #vyrdict-editorial-home #ve-culture-trio .ve-culture-copy h3{
          font-size:clamp(24px,7vw,30px)!important;
          line-height:1.05!important;
        }
        #vyrdict-editorial-home #ve-news-desk .ve-news-secondary h3,
        #vyrdict-editorial-home #ve-news-desk .ve-news-lead h3{
          font-size:clamp(25px,7.4vw,32px)!important;
          line-height:1.04!important;
        }
        #vyrdict-editorial-home .ve-story-media.ve-story-product-shot img{
          inset:9%!important;
          width:82%!important;
          height:82%!important;
        }
      }
    `;
    document.head.appendChild(s);
  }

  function tuneStoryImage(){
    const media=document.querySelector('#vyrdict-editorial-home .ve-story-media');
    const img=media?.querySelector('img');
    if(!media||!img)return false;
    const descriptor=((img.alt||'')+' '+(img.src||'')).toLowerCase();
    if(/headband|wahba/.test(descriptor))media.classList.add('ve-story-product-shot');
    else media.classList.remove('ve-story-product-shot');
    return true;
  }

  function apply(){
    ensureStyle();
    tuneStoryImage();
  }

  let tries=0;
  const tick=()=>{tries++;apply();if(tries<40&&!document.getElementById('vyrdict-editorial-home'))setTimeout(tick,150)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  const app=document.getElementById('app')||document.body;
  new MutationObserver(()=>setTimeout(tuneStoryImage,20)).observe(app,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(apply,30));
})();