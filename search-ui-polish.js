(()=>{
  if(window.__vyrdictSearchUiPolishV1)return;
  window.__vyrdictSearchUiPolishV1=1;
  const id='vyrdict-search-ui-polish-v1';
  if(document.getElementById(id))return;
  const style=document.createElement('style');
  style.id=id;
  style.textContent='input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none!important;appearance:none!important;display:none!important;}';
  document.head.appendChild(style);
})();
