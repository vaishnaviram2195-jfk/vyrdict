(()=>{
  if(window.__vyrdictHomepageDetailTuningV2)return;
  window.__vyrdictHomepageDetailTuningV2=1;
  if((location.pathname||'/')!=='/')return;

  const OLD_STYLE_ID='vyrdict-homepage-detail-tuning-v1';
  const STYLE_ID='vyrdict-homepage-detail-tuning-v2';

  function ensureStyle(){
    document.getElementById(OLD_STYLE_ID)?.remove();
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

      /* Signal, Not Noise: make the current headband image editorial and edge-to-edge, not a boxed product shot. */
      #vyrdict-editorial-home .ve-story-media.ve-story-product-shot{
        background:transparent!important;
        overflow:hidden!important;
      }
      #vyrdict-editorial-home .ve-story-media.ve-story-product-shot img{
        inset:0!important;
        width:100%!important;
        height:100%!important;
        object-fit:cover!important;
        object-position:center!important;
        transform:none!important;
        filter:grayscale(.10) contrast(.98)!important;
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
          object-position:center 45%!important;
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