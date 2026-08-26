(()=>{
  if(window.__vyrdictNavigationContextV1)return;
  window.__vyrdictNavigationContextV1=1;

  const STORE_PREFIX='vyrdict:return-context:v1:';
  const LAST_NAV_KEY='vyrdict:last-product-nav:v1';
  const MAX_AGE=2*60*60*1000;
  const LAST_NAV_AGE=30*60*1000;
  const COVER_ID='vyrdict-route-cover';
  const onProduct=()=>/^\/product\//i.test(location.pathname||'');
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();

  function showCover(){
    if(document.getElementById(COVER_ID))return;
    const cover=document.createElement('div');
    cover.id=COVER_ID;
    cover.setAttribute('role','status');
    cover.setAttribute('aria-live','polite');
    cover.innerHTML='<div style="width:min(420px,calc(100% - 40px));background:#fffdf8;border:1px solid #d8cec4;border-radius:24px;padding:28px;text-align:center;box-shadow:0 18px 55px rgba(58,43,32,.08)"><div style="font:950 27px/1 Arial,Helvetica,sans-serif;letter-spacing:-1.6px;display:inline-flex;align-items:flex-end">VYRDICT<span style="width:7px;height:7px;background:#e65f72;display:inline-block;margin:0 0 2px 2px"></span></div><div style="margin-top:14px;font:800 10px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f">Loading the verdict…</div></div>';
    Object.assign(cover.style,{position:'fixed',inset:'0',zIndex:'2147483647',background:'#f4ede5',display:'grid',placeItems:'center',fontFamily:'Arial,Helvetica,sans-serif'});
    (document.body||document.documentElement).appendChild(cover);
  }

  function internalPath(raw){
    if(!raw)return null;
    try{
      const u=new URL(raw,location.href);
      if(u.origin!==location.origin)return null;
      return u.pathname+u.search+u.hash;
    }catch{return null}
  }

  function productPathFromTarget(target){
    if(!target||onProduct())return null;
    const weekly=target.closest?.('[data-slug]');
    const weeklySlug=weekly?.dataset?.slug;
    if(weeklySlug&&weekly.closest?.('.vyrdict-weekly-section-v8,.vyrdict-weekly-section-v7,.vyrdict-weekly-section-v6,.vyrdict-weekly-section-v5')){
      return '/product/'+encodeURIComponent(weeklySlug)+'/';
    }
    const product=target.closest?.('[data-product]');
    if(product?.dataset?.product)return '/product/'+encodeURIComponent(product.dataset.product)+'/';
    const a=target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return null;
    const p=internalPath(a.href);
    return /^\/product\/[^/?#]+\/?(?:[?#].*)?$/i.test(p||'')?p:null;
  }

  function sectionContext(target){
    const sec=target?.closest?.('section,.section,[data-section]')||null;
    const heading=sec?.querySelector?.('h1,h2,h3,h4,[role="heading"]')||null;
    return {
      id:sec?.id||'',
      label:norm(heading?.textContent||''),
      top:sec?Math.round(scrollY+sec.getBoundingClientRect().top):Math.round(scrollY)
    };
  }

  function railContext(target){
    let el=target instanceof Element?target:null;
    while(el&&el!==document.body){
      if(el.scrollWidth>el.clientWidth+24){
        const cls=[...el.classList].find(c=>/rail|row|weekly|carousel|scroll/i.test(c))||'';
        if(cls)return {className:cls,left:Math.round(el.scrollLeft||0)};
      }
      el=el.parentElement;
    }
    return null;
  }

  function uiContext(){
    const details=document.querySelector('.v-home-category-details');
    return {
      categoryOpen:!!details?.open,
      weeklyExpanded:!!document.querySelector('.vyrdict-weekly-extra-v8,.vyrdict-weekly-extra-v7,.vyrdict-weekly-extra-v6,.vyrdict-weekly-extra-v5')
    };
  }

  function saveOrigin(target,dest){
    const from=location.pathname+location.search+location.hash;
    const section=sectionContext(target),rail=railContext(target),ui=uiContext();
    const ctx={from,dest,y:Math.round(scrollY),section,rail,ui,ts:Date.now()};
    try{
      history.replaceState({
        ...(history.state||{}),
        vyrdictReturnY:ctx.y,
        vyrdictReturnSection:section,
        vyrdictReturnRail:rail,
        vyrdictReturnUi:ui
      },'',location.href);
    }catch{}
    try{
      sessionStorage.setItem(STORE_PREFIX+dest.split('#')[0],JSON.stringify(ctx));
      sessionStorage.setItem(LAST_NAV_KEY,JSON.stringify({from,dest:dest.split('#')[0],ts:ctx.ts}));
    }catch{}
    return ctx;
  }

  function currentProductContext(){
    const key=STORE_PREFIX+(location.pathname+location.search).split('#')[0];
    try{
      const ctx=JSON.parse(sessionStorage.getItem(key)||'null');
      if(!ctx||!ctx.from||Date.now()-Number(ctx.ts||0)>MAX_AGE)return null;
      return ctx;
    }catch{return null}
  }

  function lastProductNavigation(){
    try{
      const nav=JSON.parse(sessionStorage.getItem(LAST_NAV_KEY)||'null');
      if(!nav||!nav.from||!nav.dest||Date.now()-Number(nav.ts||0)>LAST_NAV_AGE)return null;
      return nav;
    }catch{return null}
  }

  function cameFromSavedNavigation(ctx){
    if(!ctx)return false;
    const current=(location.pathname+location.search).split('#')[0];
    const nav=lastProductNavigation();
    if(nav&&String(nav.dest).split('#')[0]===current&&String(nav.from).split('#')[0]===String(ctx.from).split('#')[0])return true;
    const marked=history.state?.vyrdictProductFrom;
    if(marked&&String(marked).split('#')[0]===String(ctx.from).split('#')[0])return true;
    const ref=internalPath(document.referrer);
    return !!ref&&ref.split('#')[0]===String(ctx.from).split('#')[0];
  }

  function markProductEntry(){
    if(!onProduct())return;
    const ctx=currentProductContext();
    if(!ctx||!cameFromSavedNavigation(ctx))return;
    try{history.replaceState({...(history.state||{}),vyrdictProductFrom:ctx.from,vyrdictProductReturnTs:ctx.ts},'',location.href)}catch{}
  }

  function isProductBack(target){
    if(!onProduct()||!target)return false;
    if(target.closest?.('[data-back]'))return true;
    const c=target.closest?.('a,button,[role="button"]');
    if(!c)return false;
    const text=norm(c.textContent||c.getAttribute?.('aria-label')||'');
    const onclick=c.getAttribute?.('onclick')||'';
    return text==='back'||text==='go back'||/^back to\b/.test(text)||/history\.back\s*\(|smartBack\s*\(/i.test(onclick);
  }

  function findSection(saved){
    if(!saved)return null;
    if(saved.id){
      try{const byId=document.getElementById(saved.id);if(byId)return byId}catch{}
    }
    if(saved.label){
      const heads=[...document.querySelectorAll('h1,h2,h3,h4,[role="heading"]')];
      const h=heads.find(x=>norm(x.textContent)===saved.label)||heads.find(x=>norm(x.textContent).includes(saved.label)||saved.label.includes(norm(x.textContent)));
      if(h)return h.closest('section,.section,[data-section]')||h;
    }
    return null;
  }

  function restoreUi(state){
    const ui=state?.vyrdictReturnUi;
    if(!ui)return;
    const details=document.querySelector('.v-home-category-details');
    if(details&&ui.categoryOpen&&!details.open)details.open=true;
    if(ui.weeklyExpanded&&!document.querySelector('.vyrdict-weekly-extra-v8,.vyrdict-weekly-extra-v7,.vyrdict-weekly-extra-v6,.vyrdict-weekly-extra-v5')){
      const section=[...document.querySelectorAll('section,.section')].find(s=>norm(s.innerText).includes('weekly viral ranking'));
      const more=section&&[...section.querySelectorAll('button,[role="button"]')].find(b=>/see more rankings|keep climbing/i.test(b.textContent||''));
      if(more&&!more.dataset.vyrdictRestoreClicked){more.dataset.vyrdictRestoreClicked='1';setTimeout(()=>more.click(),20)}
    }
  }

  let restoreSerial=0;
  function restoreReturnPosition(){
    if(onProduct())return;
    const state=history.state||{};
    const y=Number(state.vyrdictReturnY);
    const savedSection=state.vyrdictReturnSection;
    if(!Number.isFinite(y)&&!savedSection)return;
    document.getElementById(COVER_ID)?.remove();
    const serial=++restoreSerial;
    const delays=[0,70,180,420,850];
    delays.forEach((delay,index)=>setTimeout(()=>{
      if(serial!==restoreSerial||onProduct())return;
      restoreUi(state);
      const maxY=Math.max(0,document.documentElement.scrollHeight-innerHeight);
      if(Number.isFinite(y)&&maxY>=Math.min(y,80)){
        window.scrollTo({top:Math.min(y,maxY),left:0,behavior:'auto'});
      }else{
        const sec=findSection(savedSection);
        if(sec)sec.scrollIntoView({block:'start',behavior:'auto'});
      }
      const rail=state.vyrdictReturnRail;
      if(rail?.className){
        try{document.querySelector('.'+CSS.escape(rail.className))?.scrollTo({left:Number(rail.left)||0,behavior:'auto'})}catch{}
      }
      if(index===delays.length-1){
        const sec=findSection(savedSection);
        if(Number.isFinite(y)&&Math.abs(scrollY-Math.min(y,Math.max(0,document.documentElement.scrollHeight-innerHeight)))>180&&sec){
          sec.scrollIntoView({block:'start',behavior:'auto'});
        }
      }
    },delay));
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const target=e.target;

    if(isProductBack(target)){
      const ctx=currentProductContext();
      if(ctx&&cameFromSavedNavigation(ctx)&&history.length>1){
        e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
        showCover();
        history.back();
      }
      return;
    }

    const dest=productPathFromTarget(target);
    if(!dest)return;
    saveOrigin(target,dest);
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    showCover();
    location.assign(dest);
  },true);

  addEventListener('popstate',()=>setTimeout(restoreReturnPosition,0),true);
  addEventListener('pageshow',()=>setTimeout(restoreReturnPosition,0),true);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{markProductEntry();setTimeout(restoreReturnPosition,0)},{once:true});
  else{markProductEntry();setTimeout(restoreReturnPosition,0)}
})();
