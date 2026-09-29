(()=>{
  document.getElementById('vyrdict-editorial-isamaya-style-v1')?.remove();
  const b=document.body;
  if(b){
    b.classList.remove('v-editorial-site','v-editorial-home','v-editorial-product','v-editorial-listing','v-editorial-other');
  }
  document.querySelectorAll('.v-editorial-dark,.v-editorial-blush,.v-editorial-paper').forEach(el=>{
    el.classList.remove('v-editorial-dark','v-editorial-blush','v-editorial-paper');
  });
  window.__vyrdictEditorialIsamayaV1=1;
  if(!window.__vyrdictLuizaChromeV1&&!document.getElementById('vyrdict-luiza-chrome-cache-bridge')){
    const s=document.createElement('script');
    s.id='vyrdict-luiza-chrome-cache-bridge';
    s.src='/luiza-chrome-theme.js?v=1-20260929';
    s.defer=true;
    document.head.appendChild(s);
  }
})();
