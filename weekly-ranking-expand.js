(()=>{
  if(window.__vyrdictWeeklyExpandV4)return;
  window.__vyrdictWeeklyExpandV4=1;

  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const STYLE_ID='vyrdict-weekly-expand-v4-style';
  const CATEGORY_NAMES=new Set(['beauty','hair','makeup','fashion','home','wellness','fitness','tech','food drinks','pets','travel','kids baby','toys collectibles','stationery craft','stationery crafts']);

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body .vyrdict-weekly-row-v4{gap:18px!important}
      body .vyrdict-weekly-section-v4 .v-home-rail-more{display:none!important}
      body .vyrdict-weekly-rankline{font:900 8px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f;margin:0 0 8px}
      body .vyrdict-weekly-collapse-v4{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      @media(min-width:701px){body .vyrdict-weekly-row-v4{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
    `;
    document.head.appendChild(s);
  }

  function getSection(){
    const headings=[...document.querySelectorAll('h1,h2,h3,h4')];
    const h=headings.find(el=>norm(el.textContent).includes('weekly viral rankings'))||headings.find(el=>norm(el.textContent).includes('weekly viral ranking'));
    return h?.closest('section')||h?.closest('.section')||null;
  }

  function looksLikeProductCard(el){
    if(!el||el.matches?.('.vyrdict-weekly-cta-v4,.vyrdict-weekly-extra-v4,script,style'))return false;
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
        const name=norm(p?.name);
        const brand=norm(p?.brand);
        return !topTexts.some(t=>name&&t.includes(name)&&(!brand||t.includes(brand)));
      })
      .sort((a,b)=>(Number(b.viral_score||0)-Number(a.viral_score||0))||(Number(b.momentum_score||0)-Number(a.momentum_score||0))||(Number(b.worth_score||0)-Number(a.worth_score||0)));
  }

  function makeExtra(product,rank,selected){
    if(typeof globalThis.card!=='function')return null;
    const tpl=document.createElement('template');
    tpl.innerHTML=String(globalThis.card(product)||'').trim();
    const el=tpl.content.firstElementChild;
    if(!el)return null;
    el.classList.add('vyrdict-weekly-extra-v4');
    const body=el.querySelector('.body')||el.querySelector('[class*="body"]')||el;
    const tag=document.createElement('div');
    tag.className='vyrdict-weekly-rankline';
    const trend=product?.momentum_score==null?'—':Math.round(Number(product.momentum_score));
    tag.textContent=`#${rank} ${String(selected||'').toUpperCase()} · TREND ${trend}`;
    body.prepend(tag);
    return el;
  }

  function makeCTA(section,row,topCards){
    let card=row.querySelector(':scope > .vyrdict-weekly-cta-v4');
    if(!card){
      card=document.createElement('button');
      card.type='button';
      card.className='vyrdict-featured-cta vyrdict-weekly-cta-v4';
      card.innerHTML='<span class="vyrdict-featured-kicker"><span class="vyrdict-featured-dot"></span>Beyond the top 3</span><span class="vyrdict-featured-copy"><h3>Keep climbing the ranking</h3><p>See what else is trending this week.</p></span><span class="vyrdict-featured-action"><span>See more rankings</span><span class="vyrdict-featured-arrow">→</span></span>';
      card.addEventListener('click',()=>{
        section.dataset.vyrdictWeeklyExpandedV4='1';
        render();
      });
      topCards[2].insertAdjacentElement('afterend',card);
    }
    requestAnimationFrame(()=>{
      const r=topCards[0]?.getBoundingClientRect();
      if(!r)return;
      if(r.width>0){card.style.setProperty('flex',`0 0 ${Math.round(r.width)}px`,'important');card.style.setProperty('width',`${Math.round(r.width)}px`,'important')}
      if(r.height>0)card.style.setProperty('min-height',`${Math.round(r.height)}px`,'important');
    });
    return card;
  }

  function render(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    addStyle();
    const section=getSection();
    if(!section)return;

    section.classList.add('vyrdict-weekly-section-v4');
    section.querySelectorAll('.vyrdict-weekly-cta,.vyrdict-weekly-collapse,.v-home-rail-more').forEach(el=>el.remove());

    const row=getProductRow(section);
    if(!row)return;
    row.classList.add('vyrdict-weekly-row-v4');

    const existingExtras=[...row.querySelectorAll(':scope > .vyrdict-weekly-extra-v4')];
    existingExtras.forEach(el=>el.remove());
    const existingCTA=row.querySelector(':scope > .vyrdict-weekly-cta-v4');
    if(existingCTA)existingCTA.remove();

    const topCards=[...row.children].filter(looksLikeProductCard).slice(0,3);
    if(topCards.length<3)return;
    topCards.forEach(el=>{el.hidden=false;el.style.removeProperty('display')});

    const expanded=section.dataset.vyrdictWeeklyExpandedV4==='1';
    if(!expanded){
      section.querySelector('.vyrdict-weekly-collapse-v4')?.remove();
      makeCTA(section,row,topCards);
      return;
    }

    const selected=selectedCategory(section);
    const next=rankedCandidates(section,topCards).slice(0,7);
    next.forEach((p,i)=>{
      const el=makeExtra(p,i+4,selected);
      if(el)row.appendChild(el);
    });

    let collapse=section.querySelector('.vyrdict-weekly-collapse-v4');
    if(!collapse){
      collapse=document.createElement('button');
      collapse.type='button';
      collapse.className='vyrdict-weekly-collapse-v4';
      collapse.textContent='Show less';
      collapse.addEventListener('click',()=>{
        section.dataset.vyrdictWeeklyExpandedV4='0';
        render();
      });
      row.insertAdjacentElement('afterend',collapse);
    }
  }

  document.addEventListener('click',e=>{
    const section=getSection();
    const btn=e.target.closest('button,[role="button"]');
    if(!section||!btn||!section.contains(btn)||btn.matches('.vyrdict-weekly-cta-v4,.vyrdict-weekly-collapse-v4'))return;
    const t=norm(btn.textContent);
    if(CATEGORY_NAMES.has(t)){
      section.dataset.vyrdictWeeklyExpandedV4='0';
      setTimeout(render,80);setTimeout(render,220);
    }
  },true);

  function schedule(){[0,100,250,500,900,1500,2500,4000].forEach(ms=>setTimeout(render,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictWeeklyResizeV4);window.__vyrdictWeeklyResizeV4=setTimeout(render,140)});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictWeeklyMutationV4);window.__vyrdictWeeklyMutationV4=setTimeout(render,140)}).observe(document.documentElement,{childList:true,subtree:true});
})();
