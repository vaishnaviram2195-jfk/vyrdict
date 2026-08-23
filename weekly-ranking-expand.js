(()=>{
  if(window.__vyrdictWeeklyExpandV5)return;
  window.__vyrdictWeeklyExpandV5=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-weekly-expand-v5-style';
  const CATEGORY_NAMES=new Set(['beauty','hair','makeup','fashion','home','wellness','fitness','tech','food drinks','pets','travel','kids baby','toys collectibles','stationery craft','stationery crafts']);

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body .vyrdict-weekly-row-v5{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:18px!important;align-items:stretch!important;overflow:visible!important}
      body .vyrdict-weekly-row-v5>.vyrdict-weekly-top-v5{min-width:0!important;width:auto!important;max-width:none!important;grid-column:auto!important;grid-row:auto!important}
      body .vyrdict-weekly-row-v5>.vyrdict-weekly-cta-v5{min-width:0!important;width:auto!important;max-width:none!important;grid-column:auto!important;grid-row:auto!important;align-self:stretch!important}
      body .vyrdict-weekly-section-v5 .v-home-rail-more{display:none!important}
      body .vyrdict-weekly-rankline{font:900 8px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f;margin:0 0 8px}
      body .vyrdict-weekly-collapse-v5{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      @media(max-width:900px){body .vyrdict-weekly-row-v5{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:700px){body .vyrdict-weekly-row-v5{display:flex!important;overflow-x:auto!important;gap:14px!important;scroll-snap-type:x proximity}body .vyrdict-weekly-row-v5>.vyrdict-weekly-top-v5,body .vyrdict-weekly-row-v5>.vyrdict-weekly-cta-v5,body .vyrdict-weekly-row-v5>.vyrdict-weekly-extra-v5{flex:0 0 82%!important;width:82%!important;min-width:250px!important;scroll-snap-align:start}}
    `;
    document.head.appendChild(s);
  }

  function getSection(){
    const headings=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=headings.find(el=>norm(el.textContent).includes('weekly viral rankings'))||headings.find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function looksLikeProductCard(el){
    if(!el||el.matches?.('.vyrdict-weekly-cta-v5,.vyrdict-weekly-extra-v5,script,style'))return false;
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

  function slugFromCard(el){
    const direct=el?.dataset?.slug||el?.getAttribute?.('data-slug');
    if(direct)return String(direct).toLowerCase();
    const a=el?.querySelector?.('a[href*="/product/"]');
    const source=(a?.getAttribute('href')||el?.getAttribute?.('onclick')||el?.outerHTML||'');
    const m=String(source).match(/\/product\/([^?'"#)\\\s]+)/i);
    return m?.[1]?.toLowerCase()||'';
  }

  function rankedCandidates(section,topCards){
    const products=globalThis.S?.p;
    if(!Array.isArray(products))return [];
    const selected=selectedCategory(section);
    const slugs=new Set(topCards.map(slugFromCard).filter(Boolean));
    const topTexts=topCards.map(el=>norm(el.innerText||el.textContent));
    return products
      .filter(p=>categoryMatch(p,selected))
      .filter(p=>{
        if(p?.slug&&slugs.has(String(p.slug).toLowerCase()))return false;
        const name=norm(p?.name),brand=norm(p?.brand);
        return !topTexts.some(t=>name&&t.includes(name)&&(!brand||t.includes(brand)));
      })
      .sort((a,b)=>(Number(b.viral_score||0)-Number(a.viral_score||0))||(Number(b.momentum_score||0)-Number(a.momentum_score||0))||(Number(b.worth_score||0)-Number(a.worth_score||0)));
  }

  function findTitle(root){
    const hs=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>{
      const t=norm(h.textContent);return t&&!['hype','worth','new','peak','breakout','resurgence'].includes(t);
    });
    return hs.sort((a,b)=>(parseFloat(getComputedStyle(b).fontSize)||0)-(parseFloat(getComputedStyle(a).fontSize)||0))[0]||null;
  }

  function replaceScore(root,label,value){
    const els=[...root.querySelectorAll('*')];
    const lab=els.find(el=>norm(el.textContent)===norm(label));
    if(!lab)return;
    const parent=lab.parentElement;
    if(!parent)return;
    const nums=[...parent.querySelectorAll('*')].filter(el=>/^\d{1,3}$/.test((el.textContent||'').trim()));
    const n=nums[nums.length-1];
    if(n)n.textContent=String(Math.round(Number(value||0)));
  }

  function cloneCard(topCard,product,rank,selected){
    const el=topCard.cloneNode(true);
    el.classList.add('vyrdict-weekly-extra-v5');
    el.classList.remove('vyrdict-weekly-top-v5');
    el.hidden=false;el.style.removeProperty('display');el.style.setProperty('order',String(rank),'important');

    const img=el.querySelector('img');
    const image=product?.image_url||product?.image||product?.imageUrl||product?.hero_image;
    if(img&&image){img.src=image;img.alt=[product?.brand,product?.name].filter(Boolean).join(' ')}

    const title=findTitle(el);
    if(title)title.textContent=product?.name||title.textContent;

    const textEls=[...el.querySelectorAll('small,span,p,div')];
    const brandEl=textEls.find(x=>norm(x.textContent)===norm(topCard.querySelector('small')?.textContent||''));
    if(brandEl&&product?.brand)brandEl.textContent=String(product.brand).toUpperCase();

    replaceScore(el,'hype',product?.viral_score);
    replaceScore(el,'worth',product?.worth_score);

    el.querySelectorAll('a[href*="/product/"]').forEach(a=>a.setAttribute('href','/product/'+product.slug));
    el.querySelectorAll('button').forEach(btn=>{
      if(/see\s+vyrdict/i.test(btn.textContent||''))btn.onclick=()=>location.assign('/product/'+product.slug);
    });
    if(product?.slug)el.dataset.slug=product.slug;

    const body=el.querySelector('.body')||el.querySelector('[class*="body"]')||el;
    body.querySelector('.vyrdict-weekly-rankline')?.remove();
    const tag=document.createElement('div');
    tag.className='vyrdict-weekly-rankline';
    const trend=product?.momentum_score==null?'—':Math.round(Number(product.momentum_score));
    tag.textContent=`#${rank} ${String(selected||'').toUpperCase()} · TREND ${trend}`;
    body.prepend(tag);
    return el;
  }

  function makeExtra(product,rank,selected,templateCard){
    if(typeof globalThis.card==='function'){
      const tpl=document.createElement('template');
      tpl.innerHTML=String(globalThis.card(product)||'').trim();
      const el=tpl.content.firstElementChild;
      if(el){
        el.classList.add('vyrdict-weekly-extra-v5');
        el.style.setProperty('order',String(rank),'important');
        const body=el.querySelector('.body')||el.querySelector('[class*="body"]')||el;
        const tag=document.createElement('div');
        tag.className='vyrdict-weekly-rankline';
        const trend=product?.momentum_score==null?'—':Math.round(Number(product.momentum_score));
        tag.textContent=`#${rank} ${String(selected||'').toUpperCase()} · TREND ${trend}`;
        body.prepend(tag);
        return el;
      }
    }
    return cloneCard(templateCard,product,rank,selected);
  }

  function makeCTA(section,row,topCards){
    let card=row.querySelector(':scope > .vyrdict-weekly-cta-v5');
    if(!card){
      card=document.createElement('button');
      card.type='button';
      card.className='vyrdict-featured-cta vyrdict-weekly-cta-v5';
      card.innerHTML='<span class="vyrdict-featured-kicker"><span class="vyrdict-featured-dot"></span>Beyond the top 3</span><span class="vyrdict-featured-copy"><h3>Keep climbing the ranking</h3><p>See what else is trending this week.</p></span><span class="vyrdict-featured-action"><span>See more rankings</span><span class="vyrdict-featured-arrow">→</span></span>';
      card.addEventListener('click',()=>{section.dataset.vyrdictWeeklyExpandedV5='1';render()});
      row.appendChild(card);
    }
    card.hidden=false;
    card.style.setProperty('order','4','important');
    card.style.setProperty('width','auto','important');
    card.style.setProperty('min-width','0','important');
    card.style.setProperty('max-width','none','important');
    return card;
  }

  function render(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    addStyle();
    const section=getSection();
    if(!section)return;

    section.classList.add('vyrdict-weekly-section-v5');
    section.querySelectorAll('.vyrdict-weekly-cta,.vyrdict-weekly-cta-v4,.vyrdict-weekly-collapse,.vyrdict-weekly-collapse-v4,.v-home-rail-more').forEach(el=>el.remove());

    const row=getProductRow(section);
    if(!row)return;
    row.classList.add('vyrdict-weekly-row-v5');
    row.querySelectorAll(':scope > .vyrdict-weekly-extra-v4,:scope > .vyrdict-weekly-extra-v5').forEach(el=>el.remove());
    row.querySelectorAll(':scope > .vyrdict-weekly-cta-v4').forEach(el=>el.remove());

    const topCards=[...row.children].filter(looksLikeProductCard).slice(0,3);
    if(topCards.length<3)return;
    topCards.forEach((el,i)=>{
      el.classList.add('vyrdict-weekly-top-v5');
      el.hidden=false;el.style.removeProperty('display');el.style.setProperty('order',String(i+1),'important');
    });

    const expanded=section.dataset.vyrdictWeeklyExpandedV5==='1';
    const selected=selectedCategory(section);
    const candidates=rankedCandidates(section,topCards);

    if(!expanded){
      section.querySelector('.vyrdict-weekly-collapse-v5')?.remove();
      makeCTA(section,row,topCards);
      return;
    }

    row.querySelector(':scope > .vyrdict-weekly-cta-v5')?.remove();
    candidates.slice(0,7).forEach((p,i)=>{
      const el=makeExtra(p,i+4,selected,topCards[(i)%topCards.length]);
      if(el)row.appendChild(el);
    });

    let collapse=section.querySelector('.vyrdict-weekly-collapse-v5');
    if(!collapse){
      collapse=document.createElement('button');collapse.type='button';collapse.className='vyrdict-weekly-collapse-v5';collapse.textContent='Show less';
      collapse.addEventListener('click',()=>{section.dataset.vyrdictWeeklyExpandedV5='0';render()});
      row.insertAdjacentElement('afterend',collapse);
    }
  }

  document.addEventListener('click',e=>{
    const section=getSection(),btn=e.target.closest('button,[role="button"]');
    if(!section||!btn||!section.contains(btn)||btn.matches('.vyrdict-weekly-cta-v5,.vyrdict-weekly-collapse-v5'))return;
    const t=norm(btn.textContent);
    if(CATEGORY_NAMES.has(t)){
      section.dataset.vyrdictWeeklyExpandedV5='0';
      setTimeout(render,80);setTimeout(render,220);
    }
  },true);

  function schedule(){[0,100,250,500,900,1500,2500,4000].forEach(ms=>setTimeout(render,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);addEventListener('hashchange',schedule);
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictWeeklyResizeV5);window.__vyrdictWeeklyResizeV5=setTimeout(render,140)});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictWeeklyMutationV5);window.__vyrdictWeeklyMutationV5=setTimeout(render,140)}).observe(document.documentElement,{childList:true,subtree:true});
})();
