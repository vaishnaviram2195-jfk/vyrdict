(()=>{
  if(window.__vyrdictSkipReliableV1)return;
  window.__vyrdictSkipReliableV1=1;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const icon=c=>({Skincare:'🧴',Hair:'💇‍♀️',Fitness:'🏋️‍♀️',Beauty:'✨',Perfume:'🌸',Tech:'📱',Home:'🏠',Makeup:'💄',Shoes:'👟','Food & Drinks':'🍿',Wellness:'🧘‍♀️',Fashion:'👜',Pets:'🐾',Travel:'✈️','Beauty Tech':'💡',Books:'📚',Kitchen:'🍳'}[c]||'✨');
  const home=()=>location.pathname==='/'||location.pathname==='';
  function card(p){return `<article class="card"><div class="art"><img src="${esc(p.image_url||'')}" alt="${esc((p.brand||'')+' '+(p.name||''))}" loading="lazy"><span class="chip cat">${icon(p.category)} ${esc(p.category||'')}</span><span class="chip status">${esc(p.viral_status||'verified')}</span></div><div class="body"><div class="brand">${esc(p.brand||'')}</div><h3>${esc(p.name||'')}</h3><div class="score"><div class="scoretop"><span>🔥 HYPE</span><b>${Number(p.viral_score)||0}</b></div><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,Number(p.viral_score)||0))}%"></div></div></div><div class="score worth"><div class="scoretop"><span>✓ WORTH</span><b>${Number(p.worth_score)||0}</b></div><div class="track"><div class="fill" style="width:${Math.max(0,Math.min(100,Number(p.worth_score)||0))}%"></div></div></div><div class="verdict"><span>🚩 ${esc(p.verdict||'Skip')}</span><span>→</span></div><div class="cardactions"><button class="see" data-product="${esc(p.slug||'')}">SEE VYRDICT</button><button class="save" data-save="${esc(p.id||'')}">♡</button></div></div></article>`}
  function findCulture(){return document.getElementById('culture')||[...document.querySelectorAll('section')].find(s=>/you saw it|culture\s*→\s*commerce/i.test(s.textContent||''))}
  async function products(){try{const r=await fetch('/api/home-skip',{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();return Array.isArray(d.products)?d.products:[]}catch{return[]}}
  async function mount(){
    if(!home()||document.getElementById('skip-list'))return true;
    const culture=findCulture();if(!culture)return false;
    const p=await products();if(!p.length)return false;
    if(document.getElementById('skip-list'))return true;
    const sec=document.createElement('section');sec.id='skip-list';sec.className='section skiplist';sec.innerHTML='<div class="shell"><div class="head"><div><div class="skipflag">🚩 VIRAL ≠ WORTH IT</div><h2>The Skip List.</h2></div><p>The products dominating your feed that the VYRDICT scores say are better skipped — high hype, weak actual value.</p></div><div class="rail">'+p.map(card).join('')+'</div></div>';
    culture.before(sec);return true;
  }
  function boot(){let n=0;const go=async()=>{if(await mount())return;if(n++<100)setTimeout(go,200)};go()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(boot,50));
})();