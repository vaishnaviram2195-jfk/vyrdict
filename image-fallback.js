(()=>{
  if(window.__vyrdictImageFallback)return;
  window.__vyrdictImageFallback=1;

  const STYLE_ID='vyrdict-image-fallback-style';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      img[data-vyrdict-image-fallback="1"]{
        object-fit:contain!important;
        background:#f4ede5!important;
      }
    `;
    document.head.appendChild(s);
  }

  function placeholder(){
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#f4ede5"/>
      <rect x="90" y="90" width="620" height="620" rx="36" fill="#fffaf5" stroke="#d8cec4" stroke-width="3"/>
      <text x="400" y="365" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="76" font-weight="900" fill="#171511">VYRDICT</text>
      <rect x="602" y="335" width="20" height="20" rx="2" fill="#e96b75"/>
      <text x="400" y="430" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="25" fill="#746d66">The verdict on what’s trending.</text>
    </svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  const FALLBACK=placeholder();
  function apply(img){
    if(!(img instanceof HTMLImageElement))return;
    if(img.dataset.vyrdictFallbackBound==='1')return;
    img.dataset.vyrdictFallbackBound='1';
    img.addEventListener('error',()=>{
      if(img.dataset.vyrdictImageFallback==='1')return;
      img.dataset.vyrdictImageFallback='1';
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.src=FALLBACK;
      img.alt=img.alt||'VYRDICT product image';
    });
    if(img.complete&&img.naturalWidth===0){
      img.dispatchEvent(new Event('error'));
    }
  }

  function scan(root=document){root.querySelectorAll?.('img').forEach(apply)}
  addStyle();
  scan();
  const mo=new MutationObserver(ms=>{
    for(const m of ms){
      for(const n of m.addedNodes){
        if(n instanceof HTMLImageElement)apply(n);
        else if(n instanceof Element)scan(n);
      }
    }
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(()=>scan(),50));
})();
