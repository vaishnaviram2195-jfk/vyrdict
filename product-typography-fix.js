(()=>{
  if(window.__vyrdictProductTypographyFixV2)return;
  window.__vyrdictProductTypographyFixV2=1;

  const STYLE_ID='vyrdict-product-typography-style';
  const CLASS='vyrdict-editorial-heading';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const onProduct=()=>/^\/product\//i.test(location.pathname)||/#\/product\//i.test(decodeURIComponent(location.hash||''));
  const TARGETS=new Set([
    'worth the hype',
    'mostly worth it',
    'exceptional',
    'mixed',
    'overhyped',
    'skip',
    'what it does',
    'why it s viral'
  ]);

  function addStyle(){
    let s=document.getElementById(STYLE_ID);
    if(!s){s=document.createElement('style');s.id=STYLE_ID;document.head.appendChild(s)}
    s.textContent=`
.${CLASS}{font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(38px,4vw,50px)!important;font-weight:400!important;font-style:normal!important;line-height:1.04!important;letter-spacing:-.035em!important}
@media(max-width:700px){.${CLASS}{font-size:clamp(32px,8.2vw,40px)!important;line-height:1.05!important;letter-spacing:-.032em!important}}
`;
  }

  function apply(){
    if(!onProduct())return;
    addStyle();
    const heads=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    for(const h of heads){
      const isTarget=TARGETS.has(norm(h.textContent));
      h.classList.toggle(CLASS,isTarget);
    }
  }

  function schedule(){[0,80,220,500,900,1500].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>setTimeout(apply,50),{passive:true});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictTypographyTimer);window.__vyrdictTypographyTimer=setTimeout(apply,50)}).observe(document.documentElement,{childList:true,subtree:true});
})();
