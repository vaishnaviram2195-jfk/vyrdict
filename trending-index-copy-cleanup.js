(()=>{
  if(window.__vyrdictTrendingCopyCleanupV1)return;
  window.__vyrdictTrendingCopyCleanupV1=1;

  const STYLE_ID='vyrdict-trending-copy-cleanup-v1';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-index-claw .vti-head-right{max-width:none!important;gap:0!important}
      .vyrdict-index-claw .vti-sub{
        max-width:none!important;
        white-space:nowrap!important;
        font-size:12.5px!important;
        line-height:1.2!important;
        margin-bottom:0!important;
      }
      .vyrdict-index-claw .vti-kicker{display:none!important}
      .vyrdict-index-claw .vti-title-group .vti-live-status,
      .vyrdict-index-claw .vti-head>div:first-child>.vti-live-status{
        display:inline-flex!important;
        margin:0 0 9px!important;
      }
      .vyrdict-index-claw .vti-now{display:none!important}
      .vyrdict-index-claw .vti-updated{display:none!important}
      @media(max-width:760px){
        .vyrdict-index-claw .vti-sub{font-size:10px!important;white-space:nowrap!important;letter-spacing:-.01em!important}
      }
    `;
    document.head.appendChild(s);
  }

  function clean(){
    const section=document.querySelector('.vyrdict-index-claw');
    if(!section)return false;
    addStyle();

    const sub=section.querySelector('.vti-sub');
    if(sub)sub.textContent='What the internet is buying, searching, saving & talking about — right now.';

    const kicker=section.querySelector('.vti-kicker');
    const title=section.querySelector('.vti-title');
    const live=section.querySelector('.vti-live-status');
    const left=title?.parentElement;
    if(live&&left&&live.parentElement!==left){
      left.insertBefore(live,title||left.firstChild);
    }
    if(kicker)kicker.remove();

    const now=section.querySelector('.vti-now');
    if(now)now.remove();
    const updated=section.querySelector('.vti-updated');
    if(updated)updated.remove();
    return true;
  }

  function mount(attempt=0){
    if(!clean()){
      if(attempt<80)setTimeout(()=>mount(attempt+1),75);
      return;
    }
    const section=document.querySelector('.vyrdict-index-claw');
    const mo=new MutationObserver(()=>clean());
    mo.observe(section,{subtree:true,childList:true});
    window.addEventListener('vyrdict:trending-data',()=>setTimeout(clean,20));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});
  else mount();
})();
