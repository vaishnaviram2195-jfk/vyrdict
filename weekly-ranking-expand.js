(()=>{
  if(window.__vyrdictWeeklyExpandV7)return;
  window.__vyrdictWeeklyExpandV7=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const CATEGORIES=new Set(['beauty','hair','makeup','fashion','home','wellness','fitness','tech','food drinks','pets','travel','kids baby','toys collectibles','stationery craft','stationery crafts']);
  const cache=new Map();
  let busy=false;

  function addStyle(){
    if(document.getElementById('vyrdict-weekly-expand-v7-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-weekly-expand-v7-style';
    s.textContent=`
      .vyrdict-weekly-row-v7{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;align-items:stretch!important;overflow:visible!important}
      .vyrdict-weekly-row-v7>.vyrdict-weekly-top-v7,
      .vyrdict-weekly-row-v7>.vyrdict-weekly-extra-v7,
      .vyrdict-weekly-row-v7>.vyrdict-weekly-cta-v7{min-width:0!important;width:auto!important;max-width:none!important;grid-column:auto!important;grid-row:auto!important;align-self:stretch!important}
      .vyrdict-weekly-section-v7 .v-home-rail-more{display:none!important}
      .vyrdict-weekly-rankline-v7{font:900 8px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f;margin:0 0 8px}
      .vyrdict-weekly-collapse-v7{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      .vyrdict-weekly-cta-v7.is-loading{opacity:.62;pointer-events:none}
      @media(max-width:900px){.vyrdict-weekly-row-v7{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:700px){.vyrdict-weekly-row-v7{display:flex!important;overflow-x:auto!important;gap:14px!important;scroll-snap-type:x proximity}.vyrdict-weekly-row-v7>.vyrdict-weekly-top-v7,.vyrdict-weekly-row-v7>.vyrdict-weekly-extra-v7,.vyrdict-weekly-row-v7>.vyrdict-weekly-cta-v7{flex:0 0 82%!important;width:82%!important;min-width:250px!important;scroll-snap-align:start}}
    `;
    document.head.appendChild(s);
  }

  function getSection(){
    const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes('weekly viral rankings'))
      || [...document.querySelectorAll('h1,h2,h3,h4')].find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function isCard(el){
    if(!el||el.matches?.('.vyrdict-weekly-cta-v7,.vyrdict-weekly-extra-v7,script,style'))return false;
    const t=norm(el.innerText||el.textContent);
    return !!el.querySelector?.('img')&&t.includes('hype')&&t.includes('worth')&&(t.includes('see vyrdict')||!!el.querySelector('button,a'));
  }

  function getRow(section){
    let best=null,bestCount=0,bestRatio=0;
    for(const parent of section.querySelectorAll('div,ul,ol')){
      const children=[...parent.children],cards=children.filter(isCard);
      if(cards.length<3)continue;
      const ratio=cards.length/Math.max(1,children.length);
      if(cards.length>bestCount||(cards.length===bestCount&&ratio>bestRatio)){best=parent;bestCount=cards.length;bestRatio=ratio}
    }
    return best;
  }

  function selectedCategory(section){
    const m=(section.innerText||'').match(/Top\s*3\s+in\s+(.+?)\s+right\s+now/i);
    if(m?.[1])return m[1].trim();
    const active=[...section.querySelectorAll('button,[role="button"]')].find(el=>{
      const t=norm(el.textContent);
      return CATEGORIES.has(t)&&(el.matches('.active,.on,.selected,[aria-pressed="true"]')||el.getAttribute('aria-current')==='true');
    });
    return active?.textContent?.trim()||'Beauty';
  }

  async function fetchRankings(category){
    const key=norm(category)||'beauty';
    if(cache.has(key))return cache.get(key);
    try{
      const r=await fetch(ENDPOINT+'?category='+encodeURIComponent(category||'Beauty'),{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const data=await r.json();
      const products=Array.isArray(data?.products)?data.products:[];
      if(products.length){cache.set(key,products);return products}
    }catch{}
    return [];
  }

  function slugFromCard(el){
    const direct=el?.dataset?.slug||el?.getAttribute?.('data-slug');
    if(direct)return String(direct).toLowerCase();
    const a=el?.querySelector?.('a[href*="/product/"]');
    const src=a?.getAttribute('href')||el?.outerHTML||'';
    return String(src).match(/\/product\/([^?'"#)\\\s]+)/i)?.[1]?.toLowerCase()||'';
  }

  function excludeTop(products,topCards){
    const slugs=new Set(topCards.map(slugFromCard).filter(Boolean));
    const texts=topCards.map(el=>norm(el.innerText||el.textContent));
    return products.filter(p=>{
      if(p?.slug&&slugs.has(String(p.slug).toLowerCase()))return false;
      const name=norm(p?.name),brand=norm(p?.brand);
      return !texts.some(t=>name&&t.includes(name)&&(!brand||t.includes(brand)));
    });
  }

  function replaceScore(root,label,value){
    const lab=[...root.querySelectorAll('*')].find(el=>norm(el.textContent)===norm(label));
    if(!lab)return;
    let p=lab.parentElement;
    for(let d=0;p&&d<3;d++,p=p.parentElement){
      const nums=[...p.querySelectorAll('*')].filter(el=>el.children.length===0&&/^\d{1,3}$/.test((el.textContent||'').trim()));
      if(nums.length){nums[nums.length-1].textContent=String(Math.round(Number(value||0)));return}
    }
  }

  function findTitle(root){
    const hs=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>{
      const t=norm(h.textContent);
      return t&&!['hype','worth','new','peak','breakout','resurgence','mainstay','trending'].includes(t)&&!/^\d+$/.test(t);
    });
    return hs.sort((a,b)=>(parseFloat(getComputedStyle(b).fontSize)||0)-(parseFloat(getComputedStyle(a).fontSize)||0))[0]||null;
  }

  function cloneCard(template,product,rank,category){
    const el=template.cloneNode(true);
    el.classList.remove('vyrdict-weekly-top-v7');
    el.classList.add('vyrdict-weekly-extra-v7');
    el.hidden=false;el.style.removeProperty('display');
    el.removeAttribute?.('onclick');
    el.querySelectorAll?.('[onclick]').forEach(n=>n.removeAttribute('onclick'));

    const img=el.querySelector('img');
    if(img&&product?.image_url){img.src=product.image_url;img.alt=[product.brand,product.name].filter(Boolean).join(' ')}
    const title=findTitle(el);
    if(title){title.textContent=product?.name||title.textContent;const prev=title.previousElementSibling;if(prev&&product?.brand&&norm(prev.textContent).length<45)prev.textContent=String(product.brand).toUpperCase()}
    replaceScore(el,'hype',product?.viral_score);
    replaceScore(el,'worth',product?.worth_score);

    const known=['exceptional','worth the hype','mostly worth it','mixed','overhyped','skip'];
    const verdict=[...el.querySelectorAll('*')].find(x=>x.children.length===0&&known.includes(norm(x.textContent)));
    if(verdict&&product?.verdict)verdict.textContent=product.verdict;

    const body=el.querySelector('.body')||el.querySelector('[class*="body"]')||el;
    const rankline=document.createElement('div');rankline.className='vyrdict-weekly-rankline-v7';
    rankline.textContent=`#${rank} ${String(category).toUpperCase()} · TREND ${product?.momentum_score==null?'—':Math.round(Number(product.momentum_score))}`;
    body.prepend(rankline);

    if(product?.slug){
      el.dataset.slug=product.slug;
      el.querySelectorAll('a[href*="/product/"]').forEach(a=>a.setAttribute('href','/product/'+product.slug));
      el.querySelectorAll('button').forEach(btn=>{if(/see\s+vyrdict/i.test(btn.textContent||''))btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();location.assign('/product/'+product.slug)})});
    }
    return el;
  }

  function cleanup(section,row){
    section.querySelectorAll('.vyrdict-weekly-cta,.vyrdict-weekly-cta-v4,.vyrdict-weekly-cta-v5,.vyrdict-weekly-cta-v6,.vyrdict-weekly-collapse,.vyrdict-weekly-collapse-v4,.vyrdict-weekly-collapse-v5,.vyrdict-weekly-collapse-v6,.v-home-rail-more').forEach(el=>el.remove());
    row.querySelectorAll(':scope > .vyrdict-weekly-extra-v4,:scope > .vyrdict-weekly-extra-v5,:scope > .vyrdict-weekly-extra-v6,:scope > .vyrdict-weekly-extra-v7,:scope > .vyrdict-weekly-cta-v4,:scope > .vyrdict-weekly-cta-v5,:scope > .vyrdict-weekly-cta-v6,:scope > .vyrdict-weekly-cta-v7').forEach(el=>el.remove());
  }

  function addCTA(section,row){
    const c=document.createElement('button');
    c.type='button';c.className='vyrdict-featured-cta vyrdict-weekly-cta-v7';
    c.innerHTML='<span class="vyrdict-featured-kicker"><span class="vyrdict-featured-dot"></span>Beyond the top 3</span><span class="vyrdict-featured-copy"><h3>Keep climbing the ranking</h3><p>See what else is trending this week.</p></span><span class="vyrdict-featured-action"><span>See more rankings</span><span class="vyrdict-featured-arrow">→</span></span>';
    c.addEventListener('click',async e=>{e.preventDefault();e.stopPropagation();if(busy)return;busy=true;c.classList.add('is-loading');const a=c.querySelector('.vyrdict-featured-action span');if(a)a.textContent='Loading rankings…';await render(true);busy=false});
    row.appendChild(c);
  }

  async function render(expand=false){
    if(location.pathname!=='/'&&location.pathname!=='')return false;
    addStyle();
    const section=getSection();if(!section)return false;
    const row=getRow(section);if(!row)return false;

    section.classList.add('vyrdict-weekly-section-v7');
    row.classList.add('vyrdict-weekly-row-v7');
    cleanup(section,row);

    const top=[...row.children].filter(isCard).slice(0,3);if(top.length<3)return false;
    top.forEach(el=>{el.classList.add('vyrdict-weekly-top-v7');el.hidden=false;el.style.removeProperty('display')});

    if(!expand){
      addCTA(section,row);
      return true;
    }

    const category=selectedCategory(section);
    const products=excludeTop(await fetchRankings(category),top).slice(0,7);
    if(!products.length){addCTA(section,row);return true}
    products.forEach((p,i)=>row.appendChild(cloneCard(top[i%top.length],p,i+4,category)));

    const collapse=document.createElement('button');collapse.type='button';collapse.className='vyrdict-weekly-collapse-v7';collapse.textContent='Show less';
    collapse.addEventListener('click',()=>render(false));row.insertAdjacentElement('afterend',collapse);
    return true;
  }

  function boot(attempt=0){
    Promise.resolve(render(false)).then(ok=>{if(!ok&&attempt<12)setTimeout(()=>boot(attempt+1),150)});
  }

  document.addEventListener('click',e=>{
    const section=getSection(),btn=e.target.closest('button,[role="button"]');
    if(!section||!btn||!section.contains(btn)||btn.matches('.vyrdict-weekly-cta-v7,.vyrdict-weekly-collapse-v7'))return;
    if(CATEGORIES.has(norm(btn.textContent)))setTimeout(()=>render(false),220);
  },true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>boot(),{once:true});else boot();
  addEventListener('popstate',()=>boot());
  addEventListener('hashchange',()=>boot());
})();
