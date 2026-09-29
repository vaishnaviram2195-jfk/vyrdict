(()=>{
  document.getElementById('vyrdict-luiza-chrome-style-v1')?.remove();
  const b=document.body;
  if(b){
    b.classList.remove('v-luiza-chrome','v-luiza-home','v-luiza-product','v-luiza-listing');
  }
  document.querySelectorAll('.v-luiza-paper,.v-luiza-blush,.v-luiza-dark').forEach(el=>{
    el.classList.remove('v-luiza-paper','v-luiza-blush','v-luiza-dark');
  });
  const root=document.getElementById('app')||document.body;
  if(root?.__vLuizaObserver){
    try{root.__vLuizaObserver.disconnect()}catch{}
    try{delete root.__vLuizaObserver}catch{}
  }
  window.__vyrdictLuizaChromeV1=1;
})();
