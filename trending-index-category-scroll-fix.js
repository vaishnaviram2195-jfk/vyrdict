(()=>{
  if(window.__vyrdictTrendingCategoryScrollFixV2)return;
  window.__vyrdictTrendingCategoryScrollFixV2=1;

  function patchSection(section){
    const cats=section?.querySelector('.vtg-cats');
    if(!cats)return false;

    const style=document.createElement('style');
    style.textContent=`
      @media (min-width: 769px){
        .vyrdict-index-gallery .vtg-cats{
          display:flex !important;
          justify-content:center !important;
          align-items:center !important;
          gap:clamp(14px,1.55vw,24px) !important;
          width:100% !important;
          max-width:1180px !important;
          margin-left:auto !important;
          margin-right:auto !important;
          padding-left:20px !important;
          padding-right:20px !important;
          box-sizing:border-box !important;
          overflow-x:auto !important;
          scrollbar-width:none;
        }
        .vyrdict-index-gallery .vtg-cats::-webkit-scrollbar{display:none}
        .vyrdict-index-gallery .vtg-cat{flex:0 0 auto !important}
      }
    `;
    document.head.appendChild(style);

    const patchButtons=()=>{
      cats.querySelectorAll('.vtg-cat').forEach(btn=>{
        if(btn.dataset.vtgScrollPatched==='1')return;
        btn.dataset.vtgScrollPatched='1';
        btn.scrollIntoView=function(){
          if(cats.scrollWidth<=cats.clientWidth)return;
          const left=btn.offsetLeft-(cats.clientWidth-btn.offsetWidth)/2;
          cats.scrollTo({left:Math.max(0,left),behavior:'smooth'});
        };
      });
    };

    patchButtons();
    const mo=new MutationObserver(patchButtons);
    mo.observe(cats,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','style','aria-hidden']});

    cats.addEventListener('click',e=>{
      const btn=e.target.closest?.('.vtg-cat');
      if(!btn)return;
      const x=window.scrollX;
      requestAnimationFrame(()=>{
        if(window.scrollX!==x)window.scrollTo({left:x,top:window.scrollY,behavior:'auto'});
      });
      setTimeout(()=>{
        if(window.scrollX!==x)window.scrollTo({left:x,top:window.scrollY,behavior:'auto'});
      },350);
    },true);

    return true;
  }

  function mount(attempt=0){
    const section=document.querySelector('.vyrdict-index-gallery');
    if(patchSection(section))return;
    if(attempt<80)setTimeout(()=>mount(attempt+1),100);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});
  else mount();
})();
