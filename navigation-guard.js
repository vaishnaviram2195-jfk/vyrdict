(()=>{
  if(window.__vyrdictNavigationGuardV1)return;
  window.__vyrdictNavigationGuardV1=1;

  const COVER_ID='vyrdict-route-cover';
  let token=0;

  function hardTop(){
    try{history.scrollRestoration='manual'}catch{}
    try{document.documentElement.style.scrollBehavior='auto'}catch{}
    try{document.body.style.scrollBehavior='auto'}catch{}
    try{document.documentElement.scrollTop=0}catch{}
    try{document.body.scrollTop=0}catch{}
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch{try{window.scrollTo(0,0)}catch{}}
  }

  function removeCover(){
    document.getElementById(COVER_ID)?.remove();
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

  function appReady(){
    const app=document.getElementById('app');
    if(!app)return true;
    const text=(app.textContent||'').trim();
    if(!text)return false;
    if(/^(loading\b|loading the|bringing back)/i.test(text))return false;
    return text.length>60 || app.children.length>1;
  }

  function showCover(){
    hardTop();
    const mine=++token;
    makeCover();
    const app=document.getElementById('app');
    let changed=false;
    let obs=null;
    let timeout=null;

    const finish=()=>{
      if(mine!==token)return;
      if(obs)obs.disconnect();
      if(timeout)clearTimeout(timeout);
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(mine!==token)return;
        hardTop();
        removeCover();
      }));
    };

    const check=()=>{
      if(mine!==token)return;
      if(changed&&appReady())finish();
    };

    const watchRoot=app||document.body;
    if(watchRoot){
      obs=new MutationObserver(muts=>{
        if(muts.some(m=>!(m.target instanceof Element&&m.target.closest?.('#'+COVER_ID))))changed=true;
        check();
      });
      obs.observe(watchRoot,{subtree:true,childList:true,characterData:true,attributes:false});
    }

    timeout=setTimeout(()=>{
      if(mine!==token)return;
      hardTop();
      removeCover();
    },6000);
  }

  function isNavigatingTarget(el){
    if(!el)return false;
    if(el.matches?.('input,textarea,select,option'))return false;
    const a=el.closest?.('a[href]');
    if(a){
      if(a.target==='_blank'||a.hasAttribute('download'))return false;
      const href=a.getAttribute('href')||'';
      if(!href||href.startsWith('mailto:')||href.startsWith('tel:')||href.startsWith('javascript:'))return false;
      if(href.startsWith('#'))return false;
      try{
        const u=new URL(a.href,location.href);
        if(u.origin!==location.origin)return false;
        if(u.pathname===location.pathname&&u.search===location.search&&u.hash!==location.hash)return false;
        return true;
      }catch{return false}
    }
    return !!el.closest?.('[data-product],[data-category],[data-collection],[data-back],[data-nav],[data-search]');
  }

  document.addEventListener('click',e=>{
    if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    if(isNavigatingTarget(e.target))showCover();
  },{capture:true,passive:true});

  addEventListener('popstate',()=>showCover(),true);
  addEventListener('hashchange',()=>showCover(),true);

  addEventListener('pageshow',()=>{
    ++token;
    hardTop();
    removeCover();
    requestAnimationFrame(()=>requestAnimationFrame(hardTop));
  },true);

  hardTop();
})();
