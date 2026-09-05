(()=>{
  if(window.__vyrdictLiveHomeSectionsV1)return;
  window.__vyrdictLiveHomeSectionsV1=1;

  const HOME_FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const WEEKLY='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const verdicts=['exceptional','worth the hype','mostly worth it','mixed','overhyped','skip'];
  let feedCache=null,feedAt=0,feedPromise=null,weeklyTimer=0,observerTimer=0,observer=null;
  const weeklyCache=new Map();

  function sectionByHeading(text){
    const wanted=norm(text);
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes(wanted));
    return h?.closest('section')||h?.closest('.section')||null;
  }
  const worthSection=()=>sectionByHeading('actually worth the hype')||sectionByHeading('worth the hype');
  const skipSection=()=>document.getElementById('skip-list')||document.querySelector('section.skiplist,.section.skiplist')||sectionByHeading('the skip list')||sectionByHeading('skip it');
  const weeklySection=()=>sectionByHeading('weekly viral rankings')||sectionByHeading('weekly viral ranking');

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
        const n=nums[nums.length-1];
        n.textContent=String(Math.round(Number(value||0)));
        const ring=n.closest?.('.ring');
        if(ring)ring.style.setProperty('--s',String(Math.max(0,Math.min(100,Math.round(Number(value||0))))));
        return;
      }
    }
  }

  function setBrand(root,title,brand){
    if(!brand)return;
    const explicit=root.querySelector('[data-brand],.brand,.product-brand,.eyebrow');
    if(explicit&&explicit!==title&&explicit.children.length===0){explicit.textContent=String(brand).toUpperCase();return}
    const prev=title?.previousElementSibling;
    if(prev&&prev.children.length===0){
      const t=norm(prev.textContent);
      if(t.length<55&&!verdicts.includes(t)&&!['hype','worth','new','peak','breakout','resurgence','mainstay','trending'].includes(t)&&!/^\d+$/.test(t))prev.textContent=String(brand).toUpperCase();
    }
  }

  function patchProduct(root,p,rank=null,category=''){
    if(!root||!p?.slug)return false;
    const sig=[p.slug,p.viral_score,p.worth_score,p.verdict,rank||'',category||''].join('|');
    if(root.dataset.vyrdictLiveSig===sig)return false;
    root.dataset.vyrdictLiveSig=sig;
    root.dataset.product=String(p.slug);
    root.dataset.slug=String(p.slug);

    const img=root.querySelector('img');
    if(img&&p.image_url){img.src=p.image_url;img.alt=[p.brand,p.name].filter(Boolean).join(' ');img.loading='eager'}
    const title=findTitle(root);
    if(title&&p.name)title.textContent=p.name;
    setBrand(root,title,p.brand);
    setScore(root,['hype','viral','viral score','hype score'],p.viral_score);
    setScore(root,['worth','worth score'],p.worth_score);

    const verdict=[...root.querySelectorAll('*')].find(x=>x.children.length===0&&verdicts.includes(norm(x.textContent)));
    if(verdict&&p.verdict)verdict.textContent=p.verdict;

    root.querySelectorAll('[data-product]').forEach(n=>n.setAttribute('data-product',String(p.slug)));
    root.querySelectorAll('a[href*="/product/"]').forEach(a=>a.setAttribute('href','/product/'+encodeURIComponent(String(p.slug))+'/'));
    root.querySelectorAll('button').forEach(btn=>{if(/see\s+vyrdict|view|details/i.test(btn.textContent||''))btn.setAttribute('data-product',String(p.slug))});

    if(rank!=null){
      const body=root.querySelector('.body,[class*="body"]')||root;
      let line=body.querySelector('.vyrdict-live-rankline');
      if(!line){line=document.createElement('div');line.className='vyrdict-live-rankline';line.style.cssText='font:900 8px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f;margin:0 0 8px';body.prepend(line)}
      line.textContent=`#${rank} ${String(category||'').toUpperCase()} · LIVE THIS WEEK`;
    }
    return true;
  }

  function directCards(rail){
    return [...(rail?.children||[])].filter(el=>!el.matches('script,style,.vyrdict-featured-cta,.v-home-discovery-card,.v-skip-discovery-card,.vyrdict-weekly-cta-v8'));
  }

  function patchEditorial(section,products){
    if(!section||!products?.length)return false;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return false;
    const top=directCards(rail).slice(0,3);
    if(top.length<3)return false;
    products.slice(0,3).forEach((p,i)=>patchProduct(top[i],p));
    const extra=section.querySelector('.vyrdict-featured-extra-row');
    if(extra){
      const more=directCards(extra);
      products.slice(3,3+more.length).forEach((p,i)=>patchProduct(more[i],p));
    }
    section.dataset.vyrdictLiveSource='home-feed';
    section.dataset.vyrdictLiveUpdated=String(Date.now());
    return true;
  }

  async function homeFeed(force=false){
    if(!force&&feedCache&&Date.now()-feedAt<60000)return feedCache;
    if(feedPromise)return feedPromise;
    feedPromise=fetch(HOME_FEED+'?t='+Date.now(),{cache:'no-store',headers:{accept:'application/json'}})
      .then(r=>{if(!r.ok)throw new Error('home feed '+r.status);return r.json()})
      .then(d=>{feedCache=d;feedAt=Date.now();return d})
      .finally(()=>{feedPromise=null});
    return feedPromise;
  }

  async function refreshEditorial(force=false){
    if(!isHome())return;
    try{
      const d=await homeFeed(force);
      patchEditorial(worthSection(),Array.isArray(d?.worth)?d.worth:[]);
      patchEditorial(skipSection(),Array.isArray(d?.skip)?d.skip:[]);
    }catch{}
  }

  function selectedCategory(section){
    if(!section)return 'Beauty';
    const m=(section.innerText||'').match(/Top\s*3\s+in\s+(.+?)\s+right\s+now/i);
    if(m?.[1])return m[1].trim();
    const active=[...section.querySelectorAll('button,[role="button"]')].find(el=>el.matches('.active,.on,.selected,[aria-pressed="true"]')||el.getAttribute('aria-current')==='true');
    return active?.textContent?.trim()||'Beauty';
  }

  function weeklyRow(section){
    const direct=section?.querySelector('.vyrdict-weekly-row-v8');
    if(direct)return direct;
    let best=null,bestCount=0;
    for(const parent of section?.querySelectorAll('div,ul,ol')||[]){
      const cards=directCards(parent).filter(el=>el.querySelector('img'));
      if(cards.length>=3&&cards.length>bestCount){best=parent;bestCount=cards.length}
    }
    return best;
  }

  async function weeklyData(category,force=false){
    const key=norm(category)||'beauty',cached=weeklyCache.get(key);
    if(!force&&cached&&Date.now()-cached.ts<60000)return cached.data;
    const r=await fetch(WEEKLY+'?category='+encodeURIComponent(category||'Beauty')+'&t='+Date.now(),{cache:'no-store',headers:{accept:'application/json'}});
    if(!r.ok)throw new Error('weekly '+r.status);
    const d=await r.json();weeklyCache.set(key,{ts:Date.now(),data:d});return d;
  }

  async function refreshWeekly(force=false){
    if(!isHome())return;
    const section=weeklySection();
    if(!section)return;
    const category=selectedCategory(section);
    try{
      const d=await weeklyData(category,force);
      if(norm(selectedCategory(section))!==norm(category))return;
      const products=Array.isArray(d?.products)?d.products:[];
      if(products.length<3)return;
      const row=weeklyRow(section);if(!row)return;
      const top=directCards(row).filter(el=>el.querySelector('img')).slice(0,3);
      if(top.length<3)return;
      products.slice(0,3).forEach((p,i)=>patchProduct(top[i],p,i+1,category));
      section.dataset.vyrdictLiveSource='weekly-rankings';
      section.dataset.vyrdictLiveWeek=String(d?.week_start||'');
      section.dataset.vyrdictLiveCalculated=String(d?.calculated_at||'');
    }catch{}
  }

  function schedule(force=false){
    if(!isHome())return;
    clearTimeout(observerTimer);
    observerTimer=setTimeout(()=>{refreshEditorial(force);refreshWeekly(force)},120);
  }

  function boot(){
    if(!isHome())return;
    schedule(true);
    setTimeout(()=>schedule(true),500);
    setTimeout(()=>schedule(true),1500);
    const target=document.getElementById('app')||document.body;
    if(target&&!observer){observer=new MutationObserver(()=>schedule(false));observer.observe(target,{childList:true,subtree:true})}
    setInterval(()=>{if(isHome()){refreshEditorial(true);refreshWeekly(true)}},300000);
  }

  document.addEventListener('click',e=>{
    const section=weeklySection();
    if(section&&section.contains(e.target)){clearTimeout(weeklyTimer);weeklyTimer=setTimeout(()=>refreshWeekly(true),220)}
  },true);
  addEventListener('popstate',()=>setTimeout(()=>schedule(true),80));
  addEventListener('pageshow',()=>setTimeout(()=>schedule(true),80));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
