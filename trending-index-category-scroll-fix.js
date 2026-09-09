(()=>{
  if(window.__vyrdictTrendingCategoryScrollFixV1)return;
  window.__vyrdictTrendingCategoryScrollFixV1=1;

  function patchSection(section){
    const cats=section?.querySelector('.vtg-cats');
    if(!cats)return false;

    const patchButtons=()=>{
      cats.querySelectorAll('.vtg-cat').forEach(btn=>{
        if(btn.dataset.vtgScrollPatched==='1')return;
        btn.dataset.vtgScrollPatched='1';
        btn.scrollIntoView=function(){
          const left=btn.offsetLeft-(cats.clientWidth-btn.offsetWidth)/2;
          cats.scrollTo({left:Math.max(0,left),behavior:'smooth'});
        };
      });
    };

    patchButtons();
    const mo=new MutationObserver(patchButtons);
    mo.observe(cats,{childList:true,subtree:true});

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
