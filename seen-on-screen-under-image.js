(()=>{
  let timer=null;

  function patch(){
    const hero=document.querySelector('.productHero');
    if(!hero)return false;

    // Remove any experimental/legacy Seen on Screen row beneath the image.
    hero.querySelectorAll('.vyrdict-screen-under-image').forEach(el=>el.remove());

    // Hide the duplicate Seen on Screen detail/context block entirely.
    // The product description beside the title already carries the show/actor/context information.
    hero.querySelectorAll('[data-vyrdict-screen-detail]').forEach(box=>{
      box.style.setProperty('display','none','important');
      box.setAttribute('aria-hidden','true');
    });

    // Restore normal category / verification metadata if an older patch hid it.
    hero.querySelectorAll('[data-vyrdict-screen-original-meta="1"]').forEach(el=>{
      el.style.removeProperty('display');
      delete el.dataset.vyrdictScreenOriginalMeta;
    });

    hero.style.setProperty('overflow','visible','important');
    return true;
  }

  function schedule(){
    [20,80,180,350,650,1000,1600,2400,3600].forEach(ms=>setTimeout(patch,ms));
  }

  function queue(){
    clearTimeout(timer);
    timer=setTimeout(patch,30);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','style']});
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>setTimeout(patch,80),{passive:true});
})();
