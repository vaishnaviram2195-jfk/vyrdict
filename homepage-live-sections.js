(()=>{
  if(window.__vyrdictLiveHomeSectionsV3)return;
  window.__vyrdictLiveHomeSectionsV3=1;

  const HOME_FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const verdicts=['exceptional','worth the hype','mostly worth it','mixed','overhyped','skip'];
  const CACHE_MS=120000;
  let feedCache=null,feedAt=0,feedPromise=null,observer=null,scheduleTimer=0,refreshTimer=0;

  function sectionByHeading(text){
    const wanted=norm(text);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes(wanted));
    return h?.closest('section')||h?.closest('.section')||null;
  }
  const worthSection=()=>sectionByHeading('actually worth the hype')||sectionByHeading('worth the hype');
  const skipSection=()=>document.getElementById('skip-list')||document.querySelector('section.skiplist,.section.skiplist')||sectionByHeading('the skip list')||sectionByHeading('skip it');

  function findTitle(root){
    const hs=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>{
      const t=norm(h.textContent);
      return t&&!verdicts.includes(t)&&!['hype','worth','new','peak','breakout','resurgence','mainstay','trending'].includes(t)&&!/^\d+$/.test(t);
    });
    return hs.sort((a,b)=>(parseFloat(getComputedStyle(b).fontSize)||0)-(parseFloat(getComputedStyle(a).fontSize)||0))[0]||null;
  }

  function setScore(root,labels,value){
    const wanted=new Set(labels.map(norm));
    const lab=[...root.querySelectorAll('*')].find(el=>wanted.has(norm(el.textContent)));
    if(!lab)return;
    let p=lab.parentElement;
    for(let d=0;p&&d<4;d++,p=p.parentElement){
      const nums=[...p.querySelectorAll('*')].filter(el=>el.children.length===0&&/^\d{1,3}$/.test((el.textContent||'').trim()));
      if(nums.length){
        const n=nums[nums.length-1],next=String(Math.round(Number(value||0)));
        if(n.textContent!==next)n.textContent=next;
        const ring=n.closest?.('.ring');
        if(ring)ring.style.setProperty('--s',String(Math.max(0,Math.min(100,Math.round(Number(value||0))))));
        return;
      }
    }
  }

  function setBrand(root,title,brand){
    if(!brand)return;
    const explicit=root.querySelector('[data-brand],.brand,.product-brand,.eyebrow');
    if(explicit&&explicit!==title&&explicit.children.length===0){if(explicit.textContent!==String(brand).toUpperCase())explicit.textContent=String(brand).toUpperCase();return}
    const prev=title?.previousElementSibling;
    if(prev&&prev.children.length===0){
      const t=norm(prev.textContent);
      if(t.length<55&&!verdicts.includes(t)&&!['hype','worth','new','peak','breakout','resurgence','mainstay','trending'].includes(t)&&!/^\d+$/.test(t)){
        const next=String(brand).toUpperCase();if(prev.textContent!==next)prev.textContent=next;
      }
    }
  }

  function patchProduct(root,p){
    if(!root||!p?.slug)return false;
    const sig=[p.slug,p.viral_score,p.worth_score,p.verdict,p.image_url||''].join('|');
    if(root.dataset.vyrdictLiveSig===sig)return false;
    root.dataset.vyrdictLiveSig=sig;
    root.dataset.product=String(p.slug);
    root.dataset.slug=String(p.slug);

    const img=root.querySelector('img');
    if(img&&p.image_url){
      if(img.getAttribute('src')!==p.image_url)img.src=p.image_url;
      img.alt=[p.brand,p.name].filter(Boolean).join(' ');
      img.loading='lazy';
      img.decoding='async';
      img.fetchPriority='low';
    }
    const title=findTitle(root);
    if(title&&p.name&&title.textContent!==p.name)title.textContent=p.name;
    setBrand(root,title,p.brand);
    setScore(root,['hype','viral','viral score','hype score'],p.viral_score);
    setScore(root,['worth','worth score'],p.worth_score);

    const verdict=[...root.querySelectorAll('*')].find(x=>x.children.length===0&&verdicts.includes(norm(x.textContent)));
    if(verdict&&p.verdict&&verdict.textContent!==p.verdict)verdict.textContent=p.verdict;

    root.querySelectorAll('[data-product]').forEach(n=>n.setAttribute('data-product',String(p.slug)));
    root.querySelectorAll('a[href*="/product/"]').forEach(a=>a.setAttribute('href','/product/'+encodeURIComponent(String(p.slug))+'/'));
    root.querySelectorAll('button').forEach(btn=>{if(/see\s+vyrdict|view|details/i.test(btn.textContent||''))btn.setAttribute('data-product',String(p.slug))});
    return true;
  }

  function directCards(rail){
    return [...(rail?.children||[])].filter(el=>!el.matches('script,style,.vyrdict-featured-cta,.v-home-discovery-card,.v-skip-discovery-card,.vyrdict-weekly-cta-v8'));
  }
  function showCard(card,on){
    if(!card)return;
    if(card.hidden===!on&&((on&&!card.style.display)||(!on&&card.style.display==='none')))return;
    card.hidden=!on;
    if(on)card.style.removeProperty('display');
    else card.style.setProperty('display','none','important');
  }

  function patchEditorial(section,products){
    if(!section)return false;
    const list=(Array.isArray(products)?products:[]).filter(p=>p?.slug&&p?.image_url);
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return false;

    const top=directCards(rail).filter(el=>el.querySelector('img')).slice(0,3);
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    const more=extra?directCards(extra).filter(el=>el.querySelector('img')):[];
    const all=[...top,...more];
    if(!all.length)return false;

    all.forEach((card,i)=>{
      const p=list[i];
      if(p){showCard(card,true);patchProduct(card,p)}
      else showCard(card,false);
    });

    const cta=rail.querySelector(':scope > .vyrdict-featured-cta');
    const collapse=section.querySelector('.vyrdict-featured-collapse-v3');
    const freshMore=Math.max(0,Math.min(more.length,list.length-top.length));
    const expanded=section.dataset.vyrdictFeaturedExpanded==='1';
    if(extra){
      if(freshMore>0){extra.hidden=!expanded;if(cta)cta.hidden=expanded;if(collapse)collapse.hidden=!expanded}
      else{extra.hidden=true;if(cta)cta.hidden=true;if(collapse)collapse.hidden=true;section.dataset.vyrdictFeaturedExpanded='0'}
    }else if(cta)cta.hidden=true;

    section.hidden=list.length===0;
    section.dataset.vyrdictLiveCount=String(list.length);
    section.dataset.vyrdictLiveSource='home-feed';
    section.dataset.vyrdictLiveUpdated=String(Date.now());
    return true;
  }

  async function homeFeed(force=false){
    if(!force&&feedCache&&Date.now()-feedAt<CACHE_MS)return feedCache;
    if(feedPromise)return feedPromise;
    feedPromise=fetch(HOME_FEED+'?t='+Date.now(),{cache:'no-store',headers:{accept:'application/json'}})
      .then(r=>{if(!r.ok)throw new Error('home feed '+r.status);return r.json()})
      .then(d=>{feedCache=d;feedAt=Date.now();return d})
      .finally(()=>{feedPromise=null});
    return feedPromise;
  }

  async function refreshEditorial(force=false){
    if(!isHome()||document.hidden)return false;
    try{
      const d=await homeFeed(force);
      const w=patchEditorial(worthSection(),Array.isArray(d?.worth)?d.worth:[]);
      const s=patchEditorial(skipSection(),Array.isArray(d?.skip)?d.skip:[]);
      if(w&&s&&observer){observer.disconnect();observer=null}
      return w||s;
    }catch{return false}
  }

  function schedule(force=false,delay=80){
    if(!isHome())return;
    clearTimeout(scheduleTimer);
    scheduleTimer=setTimeout(()=>refreshEditorial(force),delay);
  }

  function watchUntilReady(){
    if(observer||!isHome())return;
    const target=document.getElementById('app')||document.body;if(!target)return;
    observer=new MutationObserver(()=>{
      if(worthSection()&&skipSection()){
        observer.disconnect();observer=null;schedule(false,40);
      }
    });
    observer.observe(target,{childList:true,subtree:false});
    setTimeout(()=>{if(observer){observer.disconnect();observer=null}},2500);
  }

  function boot(){
    if(!isHome())return;
    watchUntilReady();
    schedule(false,60);
    clearInterval(refreshTimer);
    refreshTimer=setInterval(()=>{if(isHome()&&!document.hidden)refreshEditorial(true)},300000);
  }

  addEventListener('popstate',()=>setTimeout(()=>{if(isHome()){watchUntilReady();schedule(false,60)}},40));
  addEventListener('pageshow',()=>setTimeout(()=>{if(isHome())schedule(Date.now()-feedAt>CACHE_MS,60)},40));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&isHome()&&Date.now()-feedAt>CACHE_MS)schedule(true,80)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
