(()=>{
  function restore(){
    document.getElementById('vyrdict-product-typography-style')?.remove();
    document.querySelectorAll('.vyrdict-editorial-heading').forEach(el=>el.classList.remove('vyrdict-editorial-heading'));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',restore,{once:true});else restore();
  addEventListener('popstate',()=>setTimeout(restore,20));
  addEventListener('hashchange',()=>setTimeout(restore,20));
})();
