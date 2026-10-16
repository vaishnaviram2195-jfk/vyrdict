(()=>{
  const input=document.getElementById('product-search');
  const form=input?.closest('form');
  const results=document.getElementById('search-result-list');
  const summary=document.getElementById('search-summary');
  if(!form||!results||!summary||!window.fetch||!window.AbortController)return;
  let timer,controller,revision=0,composing=false;

  function prepare(){
    clearTimeout(timer);
    controller?.abort();
    revision++;
    results.hidden=true;
    results.setAttribute('aria-busy','true');
    summary.textContent='Searching…';
    return revision;
  }

  async function search(version,updateUrl=true){
    const url=new URL(location.href);
    url.pathname=new URL(form.action,location.href).pathname;
    url.hash='';
    const query=input.value.trim().slice(0,120);
    if(query)url.searchParams.set('q',query);else url.searchParams.delete('q');
    controller=new AbortController();
    try{
      const response=await fetch(url.href,{headers:{accept:'text/html'},cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error('Search unavailable');
      const page=new DOMParser().parseFromString(await response.text(),'text/html');
      const nextResults=page.getElementById('search-result-list');
      const nextSummary=page.getElementById('search-summary');
      if(!nextResults||!nextSummary)throw new Error('Incomplete search response');
      if(version!==revision)return;
      results.innerHTML=nextResults.innerHTML;
      summary.textContent=nextSummary.textContent;
      if(updateUrl)history.replaceState(history.state,'',url.pathname+url.search);
    }catch(error){
      if(version!==revision||error.name==='AbortError')return;
      // A failed request must never be presented as a missing product.
      results.innerHTML='';
      summary.textContent='Search is temporarily unavailable. Please press Search to try again.';
    }finally{
      if(version===revision){results.hidden=false;results.setAttribute('aria-busy','false')}
    }
  }

  function schedule(){const version=prepare();if(!composing)timer=setTimeout(()=>search(version),200)}
  input.addEventListener('compositionstart',()=>{composing=true;prepare()});
  input.addEventListener('compositionend',()=>{composing=false;schedule()});
  input.addEventListener('input',schedule);
  form.addEventListener('submit',event=>{event.preventDefault();search(prepare())});
  addEventListener('popstate',()=>{
    input.value=(new URLSearchParams(location.search).get('q')||'').slice(0,120);
    search(prepare(),false);
  });
})();
