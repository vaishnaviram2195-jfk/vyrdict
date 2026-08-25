(()=>{
  if(window.__vyrdictNavigationGuardV2)return;
  window.__vyrdictNavigationGuardV2=1;

  const COVER_ID='vyrdict-route-cover';

  function hardTop(){
    try{history.scrollRestoration='manual'}catch{}
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{if(document.scrollingElement)document.scrollingElement.scrollTop=0}catch{}
    try{document.documentElement.scrollTop=0}catch{}
    try{document.body.scrollTop=0}catch{}
    try{window.scrollTo(0,0)}catch{}
  }

  function makeCover(){
    let cover=document.getElementById(COVER_ID);
    if(cover)return cover;
    cover=document.createElement('div');
    cover.id=COVER_ID;
    cover.setAttribute('role','status');
    cover.setAttribute('aria-live','polite');
    cover.innerHTML='<div style="width:min(420px,calc(100% - 40px));background:#fffdf8;border:1px solid #d8cec4;border-radius:24px;padding:28px;text-align:center;box-shadow:0 18px 55px rgba(58,43,32,.08)"><div style="font:950 27px/1 Arial,Helvetica,sans-serif;letter-spacing:-1.6px;display:inline-flex;align-items:flex-end">VYRDICT<span style="width:7px;height:7px;background:#e65f72;display:inline-block;margin:0 0 2px 2px"></span></div><div style="margin-top:14px;font:800 10px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f">Loading the verdict…</div></div>';
    Object.assign(cover.style,{position:'fixed',inset:'0',zIndex:'2147483647',background:'#f4ede5',display:'grid',placeItems:'center',fontFamily:'Arial,Helvetica,sans-serif'});
    (document.body||document.documentElement).appendChild(cover);
    return cover;
  }

  function showCover(){
    hardTop();
    makeCover();
  }

  function slug(v){
    return String(v||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function cleanInternal(raw){
    if(!raw)return null;
    try{
      const u=new URL(raw,location.href);
      if(u.origin!==location.origin)return null;
      // Normalize old VYRDICT hash routes if an old history/referrer entry remains.
      if(/^#\//.test(u.hash||'')){
        const legacy=u.hash.slice(1);
        if(/^\/(product|category|collection|saved|search)(\/|\?|$)/i.test(legacy))return legacy;
      }
      return u.pathname+u.search+u.hash;
    }catch{return null}
  }

  function previousInternal(){
    const stateFrom=cleanInternal(history.state?.from);
    if(stateFrom&&stateFrom!==(location.pathname+location.search+location.hash))return stateFrom;
    const ref=cleanInternal(document.referrer);
    if(ref&&ref!==(location.pathname+location.search+location.hash))return ref;
    return '/';
  }

  function destination(target){
    if(!target)return null;
    if(target.closest?.('input,textarea,select,option'))return null;

    const product=target.closest?.('[data-product]');
    if(product?.dataset?.product)return '/product/'+encodeURIComponent(product.dataset.product)+'/';

    const category=target.closest?.('[data-category]');
    if(category?.dataset?.category){
      const s=slug(category.dataset.category);
      if(s)return '/category/'+encodeURIComponent(s)+'/';
    }

    const collection=target.closest?.('[data-collection]');
    if(collection?.dataset?.collection)return '/collection/'+encodeURIComponent(collection.dataset.collection)+'/';

    const back=target.closest?.('[data-back]');
    if(back)return previousInternal();

    const search=target.closest?.('[data-search]');
    if(search){
      const q=document.getElementById('q')?.value?.trim();
      return q?'/search?q='+encodeURIComponent(q):null;
    }

    const nav=target.closest?.('[data-nav]');
    if(nav){
      const href=nav.getAttribute('href')||nav.dataset.nav||'';
      return cleanInternal(href);
    }

    const a=target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return null;
    const raw=a.getAttribute('href')||'';
    if(!raw||/^(mailto:|tel:|javascript:)/i.test(raw))return null;
    if(raw.startsWith('#'))return null;

    // Standalone policy/methodology pages historically used inline history.back().
    // Route those to the actual internal referrer instead of allowing that handler
    // to restore a partially rendered SPA document.
    if(/history\.back\s*\(/i.test(a.getAttribute('onclick')||''))return previousInternal();

    const dest=cleanInternal(a.href);
    if(!dest)return null;
    const here=location.pathname+location.search+location.hash;
    if(dest===here)return null;
    if(dest.startsWith(location.pathname+location.search+'#'))return null;
    return dest;
  }

  function ownNavigation(e,dest){
    if(!dest)return false;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    showCover();
    // Full-document navigation deliberately replaces SPA in-place routing here.
    // The current painted document/cover stays present until the browser commits
    // the destination, eliminating the empty viewport created by async route swaps.
    setTimeout(()=>location.assign(dest),0);
    return true;
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    ownNavigation(e,destination(e.target));
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.target?.id!=='q')return;
    const q=String(e.target.value||'').trim();
    if(!q)return;
    ownNavigation(e,'/search?q='+encodeURIComponent(q));
  },true);

  // Browser back/forward may restore a bfcache snapshot. Keep it stable and
  // always remove a cover left in that snapshot once the destination is shown.
  addEventListener('pageshow',()=>{
    hardTop();
    document.getElementById(COVER_ID)?.remove();
    requestAnimationFrame(()=>requestAnimationFrame(hardTop));
  },true);

  // Do not run an in-place render from this guard on popstate. Full canonical
  // navigations own the route; the app's legacy listener is only relevant to
  // old history entries and cannot expose a blank viewport because the current
  // document is not proactively cleared here.
  hardTop();
})();