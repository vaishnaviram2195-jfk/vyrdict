(()=>{
  if(window.__vyrdictTrendingCopyCleanupV3)return;
  window.__vyrdictTrendingCopyCleanupV3=1;

  const STYLE_ID='vyrdict-trending-copy-cleanup-v3';
  const COPY='What the internet is buying, searching, saving & talking about — right now.';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-index-claw .vti-head-right{max-width:none!important;gap:0!important}
      .vyrdict-index-claw .vti-sub{max-width:none!important;white-space:nowrap!important;font-size:12.5px!important;line-height:1.2!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-kicker{display:none!important}
      .vyrdict-index-claw .vti-head>div:first-child>.vti-live-status{display:inline-flex!important;margin:0 0 9px!important}
      .vyrdict-index-claw .vti-week-date{font-style:normal;font-weight:900;color:#827870;letter-spacing:.1em;white-space:nowrap}
      .vyrdict-index-claw .vti-week-date:before{content:'·';margin:0 7px;color:#9b9088}
      .vyrdict-index-claw .vti-now{display:none!important}
      .vyrdict-index-claw .vti-updated{display:none!important}
      @media(max-width:760px){.vyrdict-index-claw .vti-sub{font-size:10px!important;white-space:nowrap!important;letter-spacing:-.01em!important}.vyrdict-index-claw .vti-week-date{font-size:7px!important}.vyrdict-index-claw .vti-week-date:before{margin:0 5px}}
    `;
    document.head.appendChild(s);
  }

  function weekLabel(){
    const raw=window.__vyrdictTrendingLiveData?.meta?.week_start;
    if(!raw)return '';
    const m=String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if(!m)return '';
    const start=new Date(Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3])));
    const end=new Date(start);end.setUTCDate(end.getUTCDate()+6);
    const mon=d=>d.toLocaleString('en-US',{month:'short',timeZone:'UTC'}).toUpperCase();
    const sd=start.getUTCDate(),ed=end.getUTCDate(),sm=mon(start),em=mon(end);
    return sm===em?`${sm} ${sd}–${ed}`:`${sm} ${sd}–${em} ${ed}`;
  }

  function clean(){
    const section=document.querySelector('.vyrdict-index-claw');
    if(!section)return false;
    addStyle();

    const sub=section.querySelector('.vti-sub');
    if(sub&&sub.textContent!==COPY)sub.textContent=COPY;

    const title=section.querySelector('.vti-title');
    const live=section.querySelector('.vti-live-status');
    const left=title?.parentElement;
    if(live&&left&&live.parentElement!==left)left.insertBefore(live,title||left.firstChild);

    if(live){
      const label=weekLabel();
      let date=live.querySelector('.vti-week-date');
      if(label){
        if(!date){date=document.createElement('em');date.className='vti-week-date';live.appendChild(date)}
        if(date.textContent!==label)date.textContent=label;
      }else date?.remove();
    }

    section.querySelector('.vti-kicker')?.remove();
    section.querySelector('.vti-now')?.remove();
    section.querySelector('.vti-updated')?.remove();
    return true;
  }

  function mount(attempt=0){
    if(!clean()){
      if(attempt<80)setTimeout(()=>mount(attempt+1),75);
      return;
    }
    window.addEventListener('vyrdict:trending-data',()=>setTimeout(clean,40));
    window.addEventListener('pageshow',()=>setTimeout(clean,40));
    setTimeout(clean,350);
    setTimeout(clean,1200);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});
  else mount();
})();
