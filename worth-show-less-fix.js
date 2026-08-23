(()=>{
  if(window.__vyrdictWorthShowLessFixV2)return;
  window.__vyrdictWorthShowLessFixV2=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-worth-show-less-style-v2';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      .vyrdict-worth-show-less{
        display:inline-block!important;
        appearance:none!important;
        border:0!important;
        border-bottom:1px solid rgba(255,253,248,.9)!important;
        background:transparent!important;
        color:#fffdf8!important;
        padding:0 0 3px!important;
        margin:16px 0 4px!important;
        font:900 9px/1.3 Arial,Helvetica,sans-serif!important;
        letter-spacing:.08em!important;
        text-transform:uppercase!important;
        cursor:pointer!important;
        position:relative!important;
        z-index:20!important;
        opacity:1!important;
        visibility:visible!important;
      }
      .vyrdict-worth-show-less[hidden]{display:none!important}
      .vyrdict-worth-show-less:hover{opacity:.72!important}
    `;
    document.head.appendChild(s);
  }

  function getWorth(){
    const hs=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=hs.find(el=>norm(el.textContent).includes('actually worth the hype'))
      ||hs.find(el=>norm(el.textContent).includes('worth the hype'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function ensureVisibleControl(section){
    if(!section)return false;
    addStyle();
    const rail=section.querySelector('.rail,[data-rail]');
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    const cta=rail?.querySelector(':scope > .vyrdict-featured-cta');
    if(!rail||!extra||!cta)return false;

    let collapse=section.querySelector('.vyrdict-worth-show-less');
    if(!collapse){
      collapse=document.createElement('button');
      collapse.type='button';
      collapse.className='vyrdict-worth-show-less';
      collapse.textContent='Show less';
      collapse.addEventListener('click',()=>{
        section.dataset.vyrdictFeaturedExpanded='0';
        extra.hidden=true;
        cta.hidden=false;
        collapse.hidden=true;
        section.querySelectorAll('.vyrdict-featured-collapse-v3').forEach(el=>el.hidden=true);
        requestAnimationFrame(()=>cta.scrollIntoView({block:'nearest'}));
      });
    }

    if(extra.parentNode&&collapse.nextElementSibling!==extra){
      extra.parentNode.insertBefore(collapse,extra);
    }

    const expanded=section.dataset.vyrdictFeaturedExpanded==='1'||!extra.hidden;
    collapse.hidden=!expanded;
    if(expanded){
      collapse.style.removeProperty('display');
      collapse.style.setProperty('display','inline-block','important');
      collapse.style.setProperty('visibility','visible','important');
      collapse.style.setProperty('opacity','1','important');
    }
    return true;
  }

  document.addEventListener('click',e=>{
    const section=getWorth();
    if(!section)return;
    const cta=e.target.closest('.vyrdict-featured-cta');
    if(!cta||!section.contains(cta))return;
    requestAnimationFrame(()=>{
      section.dataset.vyrdictFeaturedExpanded='1';
      ensureVisibleControl(section);
    });
  },true);

  function boot(attempt=0){
    const section=getWorth();
    if(section&&ensureVisibleControl(section))return;
    if(attempt<24)setTimeout(()=>boot(attempt+1),120);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
})();
