(()=>{
  if(window.__vyrdictWeeklyExpandV6)return;
  window.__vyrdictWeeklyExpandV6=1;

  const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-weekly-rankings';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-weekly-expand-v6-style';
  const CATEGORY_NAMES=new Set(['beauty','hair','makeup','fashion','home','wellness','fitness','tech','food drinks','pets','travel','kids baby','toys collectibles','stationery craft','stationery crafts']);
  const cache=new Map();
  let renderToken=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body .vyrdict-weekly-row-v6{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;align-items:stretch!important;overflow:visible!important}
      body .vyrdict-weekly-row-v6>.vyrdict-weekly-top-v6,
      body .vyrdict-weekly-row-v6>.vyrdict-weekly-extra-v6,
      body .vyrdict-weekly-row-v6>.vyrdict-weekly-cta-v6{min-width:0!important;width:auto!important;max-width:none!important;grid-column:auto!important;grid-row:auto!important;align-self:stretch!important}
      body .vyrdict-weekly-section-v6 .v-home-rail-more{display:none!important}
      body .vyrdict-weekly-rankline-v6{font:900 8px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f;margin:0 0 8px}
      body .vyrdict-weekly-collapse-v6{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      body .vyrdict-weekly-cta-v6.is-loading{opacity:.62;pointer-events:none}
      @media(max-width:900px){body .vyrdict-weekly-row-v6{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:700px){body .vyrdict-weekly-row-v6{display:flex!important;overflow-x:auto!important;gap:14px!important;scroll-snap-type:x proximity}body .vyrdict-weekly-row-v6>.vyrdict-weekly-top-v6,body .vyrdict-weekly-row-v6>.vyrdict-weekly-extra-v6,body .vyrdict-weekly-row-v6>.vyrdict-weekly-cta-v6{flex:0 0 82%!important;width:82%!important;min-width:250px!important;scroll-snap-align:start}}
    `;
    document.head.appendChild(s);
  }

  function getSection(){
    const headings=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=headings.find(el=>norm(el.textContent).includes('weekly viral rankings'))||headings.find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function looksLikeProductCard(el){
    if(!el||el.matches?.('.vyrdict-weekly-cta-v6,.vyrdict-weekly-extra-v6,script,style'))return false;
    const t=norm(el.innerText||el.textContent);
    return !!el.querySelector?.('img')&&t.includes('hype')&&t.includes('worth')&&(t.includes('see vyrdict')||!!el.querySelector('button,a'));
  }

  function getProductRow(section){
    if(!section)return null;
    let best=null,bestCount=0,bestRatio=0;
    for(const parent of section.querySelectorAll('div,ul,ol')){
      const children=[...parent.children];
      const cards=children.filter(looksLikeProductCard);
      if(cards.length<3)continue;
      const ratio=cards.length/Math.max(1,children.length);
      if(cards.length>bestCount||(cards.length===bestCount&&ratio>bestRatio)){
        best=parent;bestCount=cards.length;bestRatio=ratio;
      }
    }
    return best;
  }

  function selectedCategory(section){
    const text=section?.innerText||'';
    const m=text.match(/Top\s*3\s+in\s+(.+?)\s+right\s+now/i);
    if(m?.[1])return m[1].trim();
    const active=[...section.querySelectorAll('button,[role="button"]')].find(el=>{
      const t=norm(el.textContent);
      if(!CATEGORY_NAMES.has(t))return false;
      return el.matches('.active,.on,.selected,[aria-pressed="true"]')||el.getAttribute('aria-current')==='true';
    });
    return active?.textContent?.trim()||'Beauty';
  }

  function categoryMatch(product,selected){
    const s=norm(selected),c=norm(product?.category),sub=norm(product?.subcategory);
    if(s==='beauty')return ['beauty','skincare','hair','makeup','perfume','beauty tech'].includes(c)||['beauty','skincare','hair','makeup','perfume','beauty tech'].includes(sub);
    if(s==='fashion')return c==='fashion'||c==='shoes'||sub==='fashion'||sub==='shoes';
    if(s==='stationery craft'||s==='stationery crafts')return c==='stationery crafts'||c==='stationery craft'||sub==='stationery crafts'||sub==='stationery craft';
    return c===s||sub===s;
  }

  function localCatalog(selected){
    try{
      if(typeof S!=='undefined'&&S&&Array.isArray(S.p)){
        return S.p.filter(p=>categoryMatch(p,selected)).sort((a,b)=>(Number(b.viral_score||0)-Number(a.viral_score||0))||(Number(b.momentum_score||0)-Number(a.momentum_score||0))||(Number(b.worth_score||0)-Number(a.worth_score||0)));
      }
    }catch{}
    try{
      if(globalThis.S&&Array.isArray(globalThis.S.p)){
        return globalThis.S.p.filter(p=>categoryMatch(p,selected)).sort((a,b)=>(Number(b.viral_score||0)-Number(a.viral_score||0))||(Number(b.momentum_score||0)-Number(a.momentum_score||0))||(Number(b.worth_score||0)-Number(a.worth_score||0)));
      }
    }catch{}
    return [];
  }

  async function fetchRankings(selected){
    const key=norm(selected)||'beauty';
    if(cache.has(key))return cache.get(key);
    try{
      const r=await fetch(ENDPOINT+'?category='+encodeURIComponent(selected||'Beauty'),{cache:'no-store'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const data=await r.json();
      const products=Array.isArray(data?.products)?data.products:[];
      if(products.length){cache.set(key,products);return products}
    }catch{}
    const fallback=localCatalog(selected);
    if(fallback.length){cache.set(key,fallback);return fallback}
    return [];
  }

  function slugFromCard(el){
    const direct=el?.dataset?.slug||el?.getAttribute?.('data-slug');
    if(direct)return String(direct).toLowerCase();
    const a=el?.querySelector?.('a[href*="/product/"]');
    const source=(a?.getAttribute('href')||el?.getAttribute?.('onclick')||el?.outerHTML||'');
    const m=String(source).match(/\/product\/([^?'"#)\\\s]+)/i);
    return m?.[1]?.toLowerCase()||'';
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

  function findTitle(root){
    const hs=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>{
      const t=norm(h.textContent);
      return t&&!['hype','worth','new','peak','breakout','resurgence','mainstay','trending'].includes(t)&&!/^\d+$/.test(t);
    });
    return hs.sort((a,b)=>(parseFloat(getComputedStyle(b).fontSize)||0)-(parseFloat(getComputedStyle(a).fontSize)||0))[0]||null;
  }

  function replaceScore(root,label,value){
    const lab=[...root.querySelectorAll('*')].find(el=>norm(el.textContent)===norm(label));
    if(!lab)return;
    let parent=lab.parentElement;
    for(let depth=0;parent&&depth<3;depth++,parent=parent.parentElement){
      const nums=[...parent.querySelectorAll('*')].filter(el=>el.children.length===0&&/^\d{1,3}$/.test((el.textContent||'').trim()));
      if(nums.length){nums[nums.length-1].textContent=String(Math.round(Number(value||0)));return}
    }
  }

  function replaceVerdict(root,verdict){
    if(!verdict)return;
    const known=['exceptional','worth the hype','mostly worth it','mixed','overhyped','skip'];
    const hit=[...root.querySelectorAll('*')].find(el=>el.children.length===0&&known.includes(norm(el.textContent)));
    if(hit)hit.textContent=verdict;
  }

  function replaceStatus(root,status){
    if(!status)return;
    const known=['peak','breakout','resurgence','mainstay'];
    const hit=[...root.querySelectorAll('*')].find(el=>el.children.length===0&&known.includes(norm(el.textContent)));
    if(hit)hit.textContent=String(status).toUpperCase();
  }

  function applyRankLine(root,rank,selected,product){
    const leaves=[...root.querySelectorAll('*')].filter(el=>el.children.length===0);
    const existing=leaves.find(el=>/^\d+\s+.+\s+trend\s+\d+/.test(norm(el.textContent)));
    const trend=product?.momentum_score==null?'—':Math.round(Number(product.momentum_score));
    const text=`#${rank} ${String(selected||'').toUpperCase()} · TREND ${trend}`;
    if(existing){existing.textContent=text;return}
    const body=root.querySelector('.body')||root.querySelector('[class*="body"]')||root;
    const tag=document.createElement('div');tag.className='vyrdict-weekly-rankline-v6';tag.textContent=text;body.prepend(tag);
  }

  function nativeCard(product){
    try{if(typeof card==='function')return String(card(product)||'')}catch{}
    try{if(typeof globalThis.card==='function')return String(globalThis.card(product)||'')}catch{}
    return '';
  }

  function cloneCard(templateCard,product,rank,selected){
    let el=null;
    const html=nativeCard(product);
    if(html){
      const tpl=document.createElement('template');tpl.innerHTML=html.trim();el=tpl.content.firstElementChild;
    }
    if(!el)el=templateCard.cloneNode(true);
    if(!el)return null;

    el.classList.add('vyrdict-weekly-extra-v6');
    el.classList.remove('vyrdict-weekly-top-v6');
    el.hidden=false;el.style.removeProperty('display');
    el.removeAttribute?.('onclick');
    el.querySelectorAll?.('[onclick]').forEach(n=>n.removeAttribute('onclick'));

    const img=el.querySelector('img');
    const image=product?.image_url||product?.image||product?.imageUrl||product?.hero_image;
    if(img&&image){img.src=image;img.alt=[product?.brand,product?.name].filter(Boolean).join(' ')}

    const title=findTitle(el);
    if(title){
      title.textContent=product?.name||title.textContent;
      let prev=title.previousElementSibling;
      if(prev&&product?.brand&&norm(prev.textContent).length<45)prev.textContent=String(product.brand).toUpperCase();
    }

    replaceScore(el,'hype',product?.viral_score);
    replaceScore(el,'worth',product?.worth_score);
    replaceVerdict(el,product?.verdict);
    replaceStatus(el,product?.viral_status);
    applyRankLine(el,rank,selected,product);

    if(product?.slug){
      el.dataset.slug=product.slug;
      el.querySelectorAll('a[href*="/product/"]').forEach(a=>a.setAttribute('href','/product/'+product.slug));
      el.querySelectorAll('button').forEach(btn=>{
        if(/see\s+vyrdict/i.test(btn.textContent||''))btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();location.assign('/product/'+product.slug)});
      });
    }
    return el;
  }

  function clearOld(section,row){
    section.querySelectorAll('.vyrdict-weekly-cta,.vyrdict-weekly-cta-v4,.vyrdict-weekly-cta-v5,.vyrdict-weekly-collapse,.vyrdict-weekly-collapse-v4,.vyrdict-weekly-collapse-v5,.v-home-rail-more').forEach(el=>el.remove());
    row?.querySelectorAll(':scope > .vyrdict-weekly-extra-v4,:scope > .vyrdict-weekly-extra-v5,:scope > .vyrdict-weekly-extra-v6,:scope > .vyrdict-weekly-cta-v4,:scope > .vyrdict-weekly-cta-v5,:scope > .vyrdict-weekly-cta-v6').forEach(el=>el.remove());
  }

  function makeCTA(section,row){
    const card=document.createElement('button');
    card.type='button';
    card.className='vyrdict-featured-cta vyrdict-weekly-cta-v6';
    card.innerHTML='<span class="vyrdict-featured-kicker"><span class="vyrdict-featured-dot"></span>Beyond the top 3</span><span class="vyrdict-featured-copy"><h3>Keep climbing the ranking</h3><p>See what else is trending this week.</p></span><span class="vyrdict-featured-action"><span>See more rankings</span><span class="vyrdict-featured-arrow">→</span></span>';
    card.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      section.dataset.vyrdictWeeklyExpandedV6='1';
      card.classList.add('is-loading');
      const action=card.querySelector('.vyrdict-featured-action span');if(action)action.textContent='Loading rankings…';
      render();
    });
    row.appendChild(card);
    return card;
  }

  async function render(){
    const token=++renderToken;
    if(location.pathname!=='/'&&location.pathname!=='')return;
    addStyle();
    const section=getSection();if(!section)return;
    const row=getProductRow(section);if(!row)return;

    section.classList.add('vyrdict-weekly-section-v6');
    row.classList.add('vyrdict-weekly-row-v6');
    clearOld(section,row);

    const topCards=[...row.children].filter(looksLikeProductCard).slice(0,3);
    if(topCards.length<3)return;
    topCards.forEach(el=>{el.classList.add('vyrdict-weekly-top-v6');el.hidden=false;el.style.removeProperty('display')});

    if(section.dataset.vyrdictWeeklyExpandedV6!=='1'){
      section.querySelector('.vyrdict-weekly-collapse-v6')?.remove();
      makeCTA(section,row);
      return;
    }

    const selected=selectedCategory(section);
    const products=await fetchRankings(selected);
    if(token!==renderToken)return;
    const next=excludeTop(products,topCards).slice(0,7);

    if(!next.length){
      section.dataset.vyrdictWeeklyExpandedV6='0';
      const c=makeCTA(section,row);
      const action=c.querySelector('.vyrdict-featured-action span');if(action)action.textContent='Try rankings again';
      return;
    }

    next.forEach((p,i)=>{
      const extra=cloneCard(topCards[i%topCards.length],p,i+4,selected);
      if(extra)row.appendChild(extra);
    });

    let collapse=section.querySelector('.vyrdict-weekly-collapse-v6');
    if(!collapse){
      collapse=document.createElement('button');collapse.type='button';collapse.className='vyrdict-weekly-collapse-v6';collapse.textContent='Show less';
      collapse.addEventListener('click',()=>{section.dataset.vyrdictWeeklyExpandedV6='0';render()});
      row.insertAdjacentElement('afterend',collapse);
    }
  }

  document.addEventListener('click',e=>{
    const section=getSection(),btn=e.target.closest('button,[role="button"]');
    if(!section||!btn||!section.contains(btn)||btn.matches('.vyrdict-weekly-cta-v6,.vyrdict-weekly-collapse-v6'))return;
    if(CATEGORY_NAMES.has(norm(btn.textContent))){
      section.dataset.vyrdictWeeklyExpandedV6='0';
      setTimeout(render,100);setTimeout(render,300);
    }
  },true);

  function schedule(){[0,100,250,500,900,1500,2500,4000].forEach(ms=>setTimeout(render,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);addEventListener('hashchange',schedule);
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictWeeklyResizeV6);window.__vyrdictWeeklyResizeV6=setTimeout(render,160)});
})();
