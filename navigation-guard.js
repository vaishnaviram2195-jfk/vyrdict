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

  function showCover(){hardTop();makeCover()}

  function slug(v){
    return String(v||'').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  }

  function normalizePath(raw){
    if(!raw)return null;
    try{
      const u=new URL(raw,location.href);
      if(u.origin!==location.origin)return null;
      let out='';
      if(/^#\//.test(u.hash||''))out=u.hash.slice(1);
      else out=u.pathname+u.search+u.hash;
      const m=out.match(/^\/(product|category|collection)\/([^/?#]+)\/?(\?[^#]*)?(#.*)?$/i);
      if(m)return '/'+m[1].toLowerCase()+'/'+encodeURIComponent(decodeURIComponent(m[2]))+'/'+(m[3]||'')+(m[4]||'');
      if(/^\/(saved|search)(\?|#|$)/i.test(out))return out;
      return out||'/';
    }catch{return null}
  }

  function previousInternal(){
    const here=location.pathname+location.search+location.hash;
    const stateFrom=normalizePath(history.state?.from);
    if(stateFrom&&stateFrom!==here)return stateFrom;
    const ref=normalizePath(document.referrer);
    if(ref&&ref!==here)return ref;
    return '/';
  }

  function destination(target){
    if(!target)return null;
    if(target.closest?.('input,textarea,select,option'))return null;

    const product=target.closest?.('[data-product]');
    if(product?.dataset?.product)return '/product/'+encodeURIComponent(product.dataset.product)+'/';

    const category=target.closest?.('[data-category]');
    if(category?.dataset?.category){const s=slug(category.dataset.category);if(s)return '/category/'+s+'/'}

    const collection=target.closest?.('[data-collection]');
    if(collection?.dataset?.collection)return '/collection/'+encodeURIComponent(collection.dataset.collection)+'/';

    if(target.closest?.('[data-back]'))return previousInternal();

    if(target.closest?.('[data-search]')){
      const q=document.getElementById('q')?.value?.trim();
      return q?'/search?q='+encodeURIComponent(q):null;
    }

    const nav=target.closest?.('[data-nav]');
    if(nav){const href=nav.getAttribute('href')||nav.dataset.nav||'';return normalizePath(href)}

    const a=target.closest?.('a[href]');
    if(!a||a.target==='_blank'||a.hasAttribute('download'))return null;
    const raw=a.getAttribute('href')||'';
    if(!raw||/^(mailto:|tel:|javascript:)/i.test(raw)||raw.startsWith('#'))return null;
    if(/history\.back\s*\(/i.test(a.getAttribute('onclick')||''))return previousInternal();
    const dest=normalizePath(a.href);
    if(!dest)return null;
    const here=location.pathname+location.search+location.hash;
    if(dest===here)return null;
    if(dest.startsWith(location.pathname+location.search+'#'))return null;
    return dest;
  }

  function go(dest,replace=false){
    const d=normalizePath(dest)||'/';
    showCover();
    setTimeout(()=>{replace?location.replace(d):location.assign(d)},0);
  }

  function ownNavigation(e,dest,replace=false){
    if(!dest)return false;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    go(dest,replace);
    return true;
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    ownNavigation(e,destination(e.target));
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.target?.id!=='q')return;
    const q=String(e.target.value||'').trim();
    if(q)ownNavigation(e,'/search?q='+encodeURIComponent(q));
  },true);

  // Replace the SPA's public navigation functions after its inline script has
  // initialized. Any enhancement script that calls nav()/smartBack() now gets
  // a stable full-document transition instead of an in-place route collapse.
  function takeRouterOwnership(attempt=0){
    let installed=false;
    try{
      if(typeof window.nav==='function'&&!window.nav.__vyrdictCanonical){
        const stableNav=function(u){go(u)};
        stableNav.__vyrdictCanonical=1;
        window.nav=stableNav;
        installed=true;
      }
      if(typeof window.smartBack==='function'&&!window.smartBack.__vyrdictCanonical){
        const stableBack=function(){go(previousInternal())};
        stableBack.__vyrdictCanonical=1;
        window.smartBack=stableBack;
        installed=true;
      }
    }catch{}
    if(attempt<30&&(!installed||typeof window.nav!=='function'))setTimeout(()=>takeRouterOwnership(attempt+1),50);
  }
  takeRouterOwnership();

  // Old hash/pushState entries may still exist in a user's browser history from
  // earlier builds. If Back/Forward lands on one, cancel the legacy in-place
  // route listener and commit the destination as a real document instead.
  function stabilizeHistory(e){
    try{e?.stopImmediatePropagation?.()}catch{}
    const dest=normalizePath(location.href)||'/';
    showCover();
    setTimeout(()=>location.replace(dest),0);
  }
  addEventListener('popstate',stabilizeHistory,true);
  addEventListener('hashchange',()=>{if(/^#\//.test(location.hash||''))stabilizeHistory()},true);

  addEventListener('pageshow',()=>{
    hardTop();
    document.getElementById(COVER_ID)?.remove();
    requestAnimationFrame(()=>requestAnimationFrame(hardTop));
  },true);

  hardTop();
})();