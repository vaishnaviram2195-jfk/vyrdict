(()=>{
  if(window.__vyrdictImageFallbackV2)return;
  window.__vyrdictImageFallbackV2=true;
  window.__vyrdictImageFallback=true;

  const STYLE_ID='vyrdict-image-fallback-style-v2';
  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='img[data-vyrdict-img-retried="1"]{object-fit:contain!important}[data-vyrdict-image-missing="1"]{background-color:#f2efea}img[data-vyrdict-img-failed="1"]{display:none!important}';
    document.head.appendChild(s);
  }
  const acceptable=s=>{try{
    const url=new URL(String(s||''),location.origin);
    return (url.protocol==='https:'||url.protocol==='http:') ? url.href : '';
  }catch{return ''}};
  const branded=s=>/vyrdict-social-preview|vyrdict(?:-|_)fallback|verdict(?:-|_)card/i.test(String(s||''));

  function apply(img){
    if(!(img instanceof HTMLImageElement))return;
    if(img.dataset.vyrdictFallbackBound==='2')return;
    img.dataset.vyrdictFallbackBound='2';
    function imageFailed(){
      // Never replace a merchandise photo with a VYRDICT logo or generic verdict card.
      if(img.dataset.vyrdictImgFailed==='1')return;
      const preferred=acceptable(img.dataset.original);
      const alternate=acceptable(img.dataset.vyrdictAlternate);
      const candidates=[preferred,alternate].filter(Boolean);
      const attempted=img.dataset.vyrdictImgAttempted||'';
      const current=img.currentSrc||img.src||'';
      const next=candidates.find(x=>x!==current&&!attempted.split('|').includes(x)&&!branded(x));
      if(next){
        img.dataset.vyrdictImgAttempted=[attempted,next].filter(Boolean).join('|');
        img.dataset.vyrdictImgRetried='1';
        img.removeAttribute('srcset');img.removeAttribute('sizes');
        img.src=next;
        return;
      }
      img.dataset.vyrdictImgFailed='1';
      img.dataset.vyrdictImageFailed='1';
      img.hidden=true;
      const area=img.closest('.media,.pic,.vfn-visual,.product-visual,.cover,.lt-media');
      if(area)area.setAttribute('data-vyrdict-image-missing','1');
      if(img.closest('#ve-news-desk,#vyrdict-editorial-now')){
        img.dispatchEvent(new CustomEvent('vyrdict:story-image-error',{bubbles:true}));
      }
    }
    img.addEventListener('error',imageFailed);
    if(branded(img.getAttribute('src')||''))imageFailed();
    else if(img.complete&&img.naturalWidth===0)imageFailed();
  }
  function scan(root=document){root.querySelectorAll?.('img').forEach(apply)}
  addStyle();scan();
  const observer=new MutationObserver(mutations=>{
    for(const mutation of mutations){
      for(const node of mutation.addedNodes){
        if(node instanceof HTMLImageElement)apply(node);
        else if(node instanceof Element)scan(node);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(scan,50));
})();