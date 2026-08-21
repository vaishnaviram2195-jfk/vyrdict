(()=>{
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  let timer=null;

  function smallestVerifiedMeta(col,title){
    if(!col||!title)return null;
    const all=[...col.querySelectorAll('*')].filter(el=>{
      if(el===title||el.contains(title)||el.closest('[data-vyrdict-screen-detail]'))return false;
      const t=norm(el.textContent);
      if(!t.includes('verified')||t.includes('seen on screen'))return false;
      const pos=el.compareDocumentPosition(title);
      if(!(pos&Node.DOCUMENT_POSITION_FOLLOWING))return false;
      return true;
    });
    return all.find(el=>![...el.children].some(c=>norm(c.textContent).includes('verified')))||all[all.length-1]||null;
  }

  function syncContextCopy(original,copy){
    const markup=original.innerHTML;
    if(copy.innerHTML!==markup)copy.innerHTML=markup;
    copy.querySelectorAll('button[data-mode]').forEach(btn=>{
      btn.onclick=e=>{
        e.preventDefault();
        e.stopPropagation();
        const mode=btn.dataset.mode;
        const source=original.querySelector(`button[data-mode="${CSS.escape(mode||'')}"]`);
        source?.click();
        setTimeout(patch,40);
      };
    });
  }

  function patch(){
    const hero=document.querySelector('.productHero');
    const original=hero?.querySelector('[data-vyrdict-screen-detail]');
    const img=hero?.querySelector('.media img');
    const media=img?.closest('.media');
    if(!hero||!original||!media)return false;

    const details=[...hero.children].find(el=>el!==media&&(el.querySelector?.('h1,h2')||norm(el.innerText).includes('viral score')||norm(el.innerText).includes('worth score')));
    const title=details?.querySelector('h1,h2');
    if(!details||!title)return false;

    let under=media.querySelector(':scope > .vyrdict-screen-under-image');
    if(!under){
      under=document.createElement('div');
      under.className='vyrdict-screen-under-image';
      under.style.cssText='display:flex;align-items:center;gap:7px;flex-wrap:wrap;width:100%;box-sizing:border-box;padding:12px 4px 2px;font-family:Arial,sans-serif;';
      media.appendChild(under);
    }

    const verified=smallestVerifiedMeta(details,title);
    let meta=under.querySelector('.vyrdict-screen-under-meta');
    if(verified){
      if(!meta){
        meta=verified.cloneNode(true);
        meta.classList.add('vyrdict-screen-under-meta');
        meta.removeAttribute('id');
        meta.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));
        under.prepend(meta);
      }else if(meta.textContent!==verified.textContent){
        meta.textContent=verified.textContent;
      }
      meta.style.display='block';
      meta.style.width='100%';
      meta.style.margin='0 0 2px';
      verified.dataset.vyrdictScreenOriginalMeta='1';
      verified.style.display='none';
    }

    let copy=under.querySelector('.vyrdict-screen-detail-copy');
    if(!copy){
      copy=document.createElement('div');
      copy.className='vyrdict-screen-detail-copy';
      copy.style.cssText='display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:0;max-width:100%;';
      under.appendChild(copy);
    }
    syncContextCopy(original,copy);
    copy.querySelectorAll('.vyrdict-screen-kicker,.vyrdict-screen-show,.vyrdict-screen-who,button[data-mode]').forEach(x=>x.style.marginTop='0');

    original.style.display='none';
    return true;
  }

  function schedule(){
    [30,100,250,500,900,1500,2400,3800].forEach(ms=>setTimeout(patch,ms));
  }

  function queue(){
    clearTimeout(timer);
    timer=setTimeout(patch,35);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>setTimeout(patch,80),{passive:true});
})();
