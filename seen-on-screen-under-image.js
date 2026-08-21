(()=>{
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  let timer=null;

  function detailColumn(hero,media){
    const direct=[...hero.children].filter(el=>el!==media&&!el.contains(media));
    return direct.find(el=>el.querySelector?.('h1,h2')||norm(el.innerText).includes('viral score')||norm(el.innerText).includes('worth score')||norm(el.innerText).includes('where to buy'))||direct[0]||null;
  }

  function descriptionAfterTitle(details,title){
    const titlePos=title.getBoundingClientRect?.().top||0;
    const candidates=[...details.querySelectorAll('p')].filter(p=>{
      const t=norm(p.textContent);
      if(t.length<20)return false;
      if(t.includes('viral score')||t.includes('worth score')||t.includes('where to buy'))return false;
      const r=p.getBoundingClientRect?.();
      return !r||r.top>=titlePos;
    });
    return candidates[0]||null;
  }

  function styleContext(box){
    box.style.setProperty('display','flex','important');
    box.style.setProperty('align-items','center','important');
    box.style.setProperty('gap','7px','important');
    box.style.setProperty('flex-wrap','wrap','important');
    box.style.setProperty('width','100%','important');
    box.style.setProperty('max-width','100%','important');
    box.style.setProperty('box-sizing','border-box','important');
    box.style.setProperty('margin','10px 0 14px','important');
    box.style.setProperty('padding','0','important');
    box.style.setProperty('overflow','visible','important');
    box.style.setProperty('white-space','normal','important');
    box.style.setProperty('font-family','Arial,sans-serif','important');
    box.querySelectorAll('.vyrdict-screen-kicker,.vyrdict-screen-show,.vyrdict-screen-who,button[data-mode]').forEach(el=>{
      el.style.setProperty('margin-top','0','important');
      el.style.setProperty('white-space','normal','important');
      el.style.setProperty('max-width','100%','important');
      el.style.setProperty('flex-shrink','0','important');
    });
  }

  function patch(){
    const hero=document.querySelector('.productHero');
    const box=hero?.querySelector('[data-vyrdict-screen-detail]');
    const img=hero?.querySelector('.media img');
    const media=img?.closest('.media');
    if(!hero||!box||!media)return false;

    // Remove the experimental under-image row entirely.
    media.querySelectorAll('.vyrdict-screen-under-image').forEach(el=>el.remove());

    // Restore any original category/verified metadata that an older patch hid.
    hero.querySelectorAll('[data-vyrdict-screen-original-meta="1"]').forEach(el=>{
      el.style.removeProperty('display');
      delete el.dataset.vyrdictScreenOriginalMeta;
    });

    const details=detailColumn(hero,media);
    const title=details?.querySelector('h1,h2');
    if(!details||!title)return false;

    hero.style.setProperty('overflow','visible','important');
    details.style.setProperty('overflow','visible','important');
    details.style.setProperty('min-width','0','important');

    // Keep the classic hierarchy: title/brand -> description -> Seen on Screen context -> scores/actions.
    const desc=descriptionAfterTitle(details,title);
    if(desc){
      if(box.previousElementSibling!==desc)desc.insertAdjacentElement('afterend',box);
    }else{
      const brand=[...details.querySelectorAll('*')].find(el=>{
        const t=norm(el.textContent);
        return el.children.length===0&&t&&t.length<40&&el.compareDocumentPosition(title)&Node.DOCUMENT_POSITION_PRECEDING;
      });
      if(brand)brand.insertAdjacentElement('afterend',box);
      else title.insertAdjacentElement('afterend',box);
    }

    styleContext(box);
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
