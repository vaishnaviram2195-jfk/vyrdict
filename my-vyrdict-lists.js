(()=>{
  if(window.__vyrdictMyListsV1)return;
  window.__vyrdictMyListsV1=1;

  const LIST_KEY='vyrdict:lists:v1';
  const SAVED_KEY='vyrdict:saved';
  const CLOUD_KEY='vyrdict_lists_v1';
  const SB='https://shmbvkjzeqqxybweyowj.supabase.co';
  const KEY='sb_publishable_XEsFSPQsuq8AXxBVSnIKgQ_kbGegBtG';
  const starter=[
    {id:'birthday',title:'Birthday Wishlist'},
    {id:'skincare',title:'Skincare'},
    {id:'apartment',title:'Apartment'},
    {id:'considering',title:'Considering'}
  ];
  let state=loadState();
  let pickerProductId=null;
  let syncTimer=null;
  let observer=null;

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const ids=()=>{try{return [...new Set((JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')||[]).map(Number).filter(Number.isFinite))]}catch{return[]}};
  const productCache=()=>{try{return JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null')?.p||[]}catch{return[]}};

  function defaultState(){return{version:1,boards:starter.map(x=>({...x,productIds:[],createdAt:Date.now()})),updatedAt:Date.now()}}
  function cleanState(s){
    const out=s&&Array.isArray(s.boards)?s:defaultState();
    out.version=1;
    out.boards=out.boards.filter(b=>b&&b.id&&b.title).map(b=>({id:String(b.id),title:String(b.title).slice(0,60),productIds:[...new Set((b.productIds||[]).map(Number).filter(Number.isFinite))],createdAt:Number(b.createdAt||Date.now())}));
    if(!out.boards.length)out.boards=defaultState().boards;
    out.updatedAt=Number(out.updatedAt||Date.now());
    return out;
  }
  function loadState(){try{return cleanState(JSON.parse(localStorage.getItem(LIST_KEY)||'null'))}catch{return defaultState()}}
  function storeState(next=state,{cloud=true}={}){
    state=cleanState(next);state.updatedAt=Date.now();
    try{localStorage.setItem(LIST_KEY,JSON.stringify(state))}catch{}
    if(cloud)scheduleCloudSync();
    renderSavedPage();
    return state;
  }
  function scheduleCloudSync(){
    clearTimeout(syncTimer);
    syncTimer=setTimeout(async()=>{
      const acct=window.VyrdictAccount;
      const user=acct?.session?.user;
      const client=acct?.client;
      if(!user||!client)return;
      try{await client.auth.updateUser({data:{[CLOUD_KEY]:state}})}catch(e){console.warn('VYRDICT list sync failed',e?.message||e)}
    },450);
  }
  function mergeCloud(){
    const cloud=window.VyrdictAccount?.session?.user?.user_metadata?.[CLOUD_KEY];
    if(!cloud?.boards?.length)return;
    const local=state;
    if(Number(cloud.updatedAt||0)>Number(local.updatedAt||0)){state=cleanState(cloud);try{localStorage.setItem(LIST_KEY,JSON.stringify(state))}catch{};renderSavedPage();return}
    const map=new Map(local.boards.map(b=>[b.id,{...b,productIds:[...b.productIds]}]));
    for(const b of cloud.boards){
      if(!b?.id)continue;
      if(!map.has(b.id))map.set(b.id,{...b,productIds:[...(b.productIds||[])]});
      else map.get(b.id).productIds=[...new Set([...(map.get(b.id).productIds||[]),...(b.productIds||[])].map(Number).filter(Number.isFinite))];
    }
    state=cleanState({...local,boards:[...map.values()]});storeState(state);
  }

  function style(){
    if(document.getElementById('vyrdict-my-lists-style'))return;
    const s=document.createElement('style');s.id='vyrdict-my-lists-style';s.textContent=`
      :root{--mv-paper:#f5f2ec;--mv-card:#fbfaf7;--mv-ink:#1c1c1a;--mv-muted:#706b65;--mv-line:rgba(28,28,26,.14);--mv-pink:#c94f6d}
      #my-vyrdict-page{background:var(--mv-paper);color:var(--mv-ink);min-height:calc(100vh - 70px);font-family:"Helvetica Neue",Arial,sans-serif;padding:46px 0 70px}
      #my-vyrdict-page *{box-sizing:border-box}#my-vyrdict-page button,#my-vyrdict-page input{font:inherit}
      .mv-shell{width:min(1320px,calc(100% - 64px));margin:0 auto}.mv-kicker{font:800 9px/1 Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#6e6963;margin-bottom:11px}.mv-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:25px;border-bottom:1px solid var(--mv-line)}
      .mv-head h1{font:400 clamp(38px,4.2vw,56px)/.98 Georgia,"Times New Roman",serif;letter-spacing:-.045em;margin:0}.mv-head p{max-width:520px;margin:10px 0 0;color:var(--mv-muted);font-size:13px;line-height:1.55}.mv-new{border:1px solid #222;background:#222;color:#fff;padding:11px 16px;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}
      .mv-board-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:26px 16px;padding-top:26px}.mv-board{border:0;background:transparent;text-align:left;padding:0;cursor:pointer;min-width:0}.mv-cover{aspect-ratio:1.23;background:#e8e4dd;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:2px;overflow:hidden;position:relative}.mv-cover img{width:100%;height:100%;object-fit:cover;display:block}.mv-cover .mv-empty{grid-column:1/-1;grid-row:1/-1;display:grid;place-items:center;color:#8b857e;font:700 8px/1.4 Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase;background:linear-gradient(145deg,#ebe7e0,#f5f2ed)}.mv-board-copy{padding:10px 1px 0}.mv-board-title{font:500 17px/1.2 Arial,sans-serif}.mv-board-meta{margin-top:5px;color:#7b756e;font-size:10px}.mv-all .mv-cover{background:#ded8cf}.mv-add .mv-cover{display:grid;place-items:center;border:1px solid var(--mv-line);background:transparent}.mv-plus{font:300 42px/1 Georgia,serif}.mv-heart{font-size:18px;color:var(--mv-pink);margin-bottom:4px}
      .mv-detail-head{display:flex;justify-content:space-between;align-items:end;gap:18px;padding:0 0 20px;border-bottom:1px solid var(--mv-line)}.mv-back{border:0;background:transparent;padding:0 0 14px;cursor:pointer;font:800 9px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#5e5954}.mv-detail-head h2{font:400 clamp(34px,4vw,52px)/1 Georgia,"Times New Roman",serif;letter-spacing:-.04em;margin:0}.mv-detail-meta{font-size:11px;color:var(--mv-muted);margin-top:8px}.mv-edit{border:1px solid var(--mv-line);background:#fbfaf7;padding:9px 12px;font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}
      .mv-products{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:28px 16px;padding-top:24px}.mv-product{position:relative;text-decoration:none;color:inherit;min-width:0}.mv-product-media{aspect-ratio:.9;background:#e9e6e0;display:grid;place-items:center;overflow:hidden}.mv-product-media img{width:88%;height:88%;object-fit:contain}.mv-product-brand{margin-top:10px;font:800 8px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#77716b}.mv-product-name{font:500 14px/1.3 Arial,sans-serif;margin-top:5px}.mv-product-score{font:700 8px/1.3 Arial,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:#6c6761;margin-top:7px}.mv-remove{position:absolute;right:8px;top:8px;z-index:2;width:30px;height:30px;border:1px solid rgba(0,0,0,.14);background:rgba(250,248,243,.92);display:grid;place-items:center;cursor:pointer;font-size:15px}.mv-empty-state{grid-column:1/-1;padding:64px 0;text-align:center;border-top:1px solid var(--mv-line);color:#77716b}.mv-empty-state b{display:block;font:400 30px/1.1 Georgia,serif;color:#262522;margin-bottom:9px}
      .mv-modal{position:fixed;inset:0;z-index:2147483600;background:rgba(31,29,27,.48);backdrop-filter:blur(5px);display:grid;place-items:center;padding:18px}.mv-dialog{width:min(440px,100%);background:#f8f5ef;border:1px solid rgba(255,255,255,.4);box-shadow:0 24px 70px rgba(20,18,16,.2);padding:24px}.mv-dialog-top{display:flex;justify-content:space-between;gap:16px;align-items:start}.mv-dialog-kicker{font:800 8px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#756f68;margin-bottom:8px}.mv-dialog h3{font:400 30px/1.05 Georgia,serif;letter-spacing:-.035em;margin:0}.mv-close{border:0;background:transparent;font-size:22px;line-height:1;cursor:pointer}.mv-list-options{margin-top:20px;border-top:1px solid var(--mv-line)}.mv-option{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 0;border-bottom:1px solid var(--mv-line);cursor:pointer}.mv-option b{font-size:12px}.mv-check{width:20px;height:20px;border:1px solid #aaa39b;display:grid;place-items:center;font-size:12px}.mv-option.is-on .mv-check{background:#222;color:#fff;border-color:#222}.mv-dialog-actions{display:flex;gap:8px;margin-top:18px}.mv-primary,.mv-secondary{flex:1;border:1px solid #222;padding:11px;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;cursor:pointer}.mv-primary{background:#222;color:#fff}.mv-secondary{background:transparent;color:#222}.mv-input{width:100%;margin-top:18px;border:1px solid #bbb3aa;background:#fffdf8;padding:13px 12px;outline:none}.mv-danger{border-color:#9b4659;color:#9b4659;background:transparent}
      @media(max-width:900px){.mv-board-grid,.mv-products{grid-template-columns:repeat(3,minmax(0,1fr))}.mv-shell{width:calc(100% - 36px)}}
      @media(max-width:620px){#my-vyrdict-page{padding:28px 0 50px}.mv-shell{width:calc(100% - 24px)}.mv-head{display:block;padding-bottom:18px}.mv-head h1{font-size:37px}.mv-head p{font-size:12px;margin-top:8px}.mv-new{margin-top:16px}.mv-board-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 10px;padding-top:18px}.mv-board-title{font-size:14px}.mv-board-meta{font-size:9px}.mv-products{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 10px;padding-top:18px}.mv-detail-head{align-items:start}.mv-detail-head h2{font-size:34px}.mv-product-name{font-size:12px}.mv-product-brand,.mv-product-score{font-size:7px}.mv-dialog{padding:20px}.mv-dialog h3{font-size:28px}}
    `;document.head.appendChild(s);
  }

  async function fetchProducts(productIds){
    const unique=[...new Set((productIds||[]).map(Number).filter(Number.isFinite))];
    if(!unique.length)return[];
    const cached=productCache();
    const map=new Map(cached.filter(p=>unique.includes(Number(p.id))).map(p=>[Number(p.id),p]));
    const missing=unique.filter(id=>!map.has(id));
    if(missing.length){
      try{
        const q=new URLSearchParams({select:'id,slug,brand,name,category,image_url,viral_score,worth_score',is_active:'eq.true',id:`in.(${missing.join(',')})`});
        const r=await fetch(`${SB}/rest/v1/products?${q}`,{headers:{apikey:KEY,Authorization:`Bearer ${KEY}`,accept:'application/json'}});
        if(r.ok){for(const p of await r.json())map.set(Number(p.id),p)}
      }catch{}
    }
    return unique.map(id=>map.get(id)).filter(Boolean);
  }

  function board(id){return state.boards.find(b=>b.id===id)}
  function boardIds(b){const saved=new Set(ids());return (b?.productIds||[]).filter(id=>saved.has(Number(id)))}
  function productBoardIds(productId){return state.boards.filter(b=>b.productIds.includes(Number(productId))).map(b=>b.id)}
  function addToBoard(productId,boardId,on=true){
    const b=board(boardId);if(!b)return;
    const set=new Set(b.productIds.map(Number));on?set.add(Number(productId)):set.delete(Number(productId));b.productIds=[...set];storeState(state);
  }
  function removeFromAllBoards(productId){let changed=false;for(const b of state.boards){const n=b.productIds.filter(x=>Number(x)!==Number(productId));if(n.length!==b.productIds.length){b.productIds=n;changed=true}}if(changed)storeState(state)}
  function createBoard(title){
    const t=String(title||'').trim().slice(0,60);if(!t)return null;
    const id='list-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6);
    state.boards.unshift({id,title:t,productIds:[],createdAt:Date.now()});storeState(state);return id;
  }

  function modal(html){
    closeModal();const m=document.createElement('div');m.className='mv-modal';m.id='mv-modal';m.innerHTML=`<div class="mv-dialog" role="dialog" aria-modal="true">${html}</div>`;document.body.appendChild(m);m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-mv-close]'))closeModal()});return m
  }
  function closeModal(){document.getElementById('mv-modal')?.remove();pickerProductId=null}
  function openCreate(afterCreate){
    const m=modal(`<div class="mv-dialog-top"><div><div class="mv-dialog-kicker">MY VYRDICT</div><h3>Create a new list.</h3></div><button class="mv-close" data-mv-close aria-label="Close">×</button></div><input class="mv-input" id="mv-list-name" maxlength="60" placeholder="e.g. Summer trip, Gifts, Dream apartment"><div class="mv-dialog-actions"><button class="mv-secondary" data-mv-close>Cancel</button><button class="mv-primary" id="mv-create-go">Create list</button></div>`);
    const input=m.querySelector('#mv-list-name');setTimeout(()=>input.focus(),40);
    const go=()=>{const id=createBoard(input.value);if(!id)return;closeModal();afterCreate?.(id);renderSavedPage()};
    m.querySelector('#mv-create-go').onclick=go;input.addEventListener('keydown',e=>{if(e.key==='Enter')go()});
  }
  function openPicker(productId){
    pickerProductId=Number(productId);const selected=new Set(productBoardIds(productId));
    const opts=state.boards.map(b=>`<div class="mv-option ${selected.has(b.id)?'is-on':''}" data-board="${esc(b.id)}"><b>${esc(b.title)}</b><span class="mv-check">${selected.has(b.id)?'✓':''}</span></div>`).join('');
    const m=modal(`<div class="mv-dialog-top"><div><div class="mv-dialog-kicker">SAVED TO MY VYRDICT</div><h3>Where should it live?</h3></div><button class="mv-close" data-mv-close>×</button></div><div class="mv-list-options">${opts}</div><div class="mv-dialog-actions"><button class="mv-secondary" id="mv-picker-new">+ New list</button><button class="mv-primary" data-mv-close>Done</button></div>`);
    m.querySelectorAll('.mv-option').forEach(o=>o.onclick=()=>{const id=o.dataset.board;const on=!o.classList.contains('is-on');addToBoard(productId,id,on);o.classList.toggle('is-on',on);o.querySelector('.mv-check').textContent=on?'✓':''});
    m.querySelector('#mv-picker-new').onclick=()=>{closeModal();openCreate(id=>{addToBoard(productId,id,true);openPicker(productId)})};
  }
  function openBoardEdit(boardId){
    const b=board(boardId);if(!b)return;
    const m=modal(`<div class="mv-dialog-top"><div><div class="mv-dialog-kicker">EDIT LIST</div><h3>${esc(b.title)}</h3></div><button class="mv-close" data-mv-close>×</button></div><input class="mv-input" id="mv-rename" maxlength="60" value="${esc(b.title)}"><div class="mv-dialog-actions"><button class="mv-secondary mv-danger" id="mv-delete">Delete</button><button class="mv-primary" id="mv-rename-go">Save</button></div>`);
    m.querySelector('#mv-rename-go').onclick=()=>{const v=m.querySelector('#mv-rename').value.trim();if(v)b.title=v.slice(0,60);storeState(state);closeModal();openBoard(boardId)};
    m.querySelector('#mv-delete').onclick=()=>{state.boards=state.boards.filter(x=>x.id!==boardId);storeState(state);closeModal();renderSavedPage()};
  }

  function coverHtml(products){
    const ps=products.slice(0,4);if(!ps.length)return'<div class="mv-empty">Start adding finds</div>';
    return ps.map(p=>`<img src="${esc(p.image_url)}" alt="">`).join('')
  }
  async function boardCardHtml(b){const ps=await fetchProducts(boardIds(b));return`<button class="mv-board" data-open-board="${esc(b.id)}"><div class="mv-cover">${coverHtml(ps)}</div><div class="mv-board-copy"><div class="mv-board-title">${esc(b.title)}</div><div class="mv-board-meta">${boardIds(b).length} saved</div></div></button>`}
  async function allCardHtml(){const all=ids();const ps=await fetchProducts(all);return`<button class="mv-board mv-all" data-open-board="all"><div class="mv-cover">${coverHtml(ps)}</div><div class="mv-board-copy"><div class="mv-board-title">All Saves</div><div class="mv-board-meta">${all.length} saved</div></div></button>`}

  async function renderSavedPage(){
    if((location.pathname||'').replace(/\/$/,'')!=='/saved')return;
    style();
    const app=document.getElementById('app');if(!app)return;
    let main=app.querySelector('main');if(!main){main=document.createElement('main');app.appendChild(main)}
    if(main.dataset.mvRendering==='1')return;main.dataset.mvRendering='1';
    const all=await allCardHtml();const boards=await Promise.all(state.boards.map(boardCardHtml));
    main.innerHTML=`<section id="my-vyrdict-page"><div class="mv-shell"><div class="mv-head"><div><div class="mv-kicker">MY VYRDICT</div><h1>Your saved world.</h1><p>Organise everything you’re considering, craving or planning into lists that make sense to you.</p></div><button class="mv-new" id="mv-new-list">+ New List</button></div><div class="mv-board-grid">${all}${boards.join('')}<button class="mv-board mv-add" id="mv-new-tile"><div class="mv-cover"><div><div class="mv-heart">♡</div><div class="mv-plus">+</div></div></div><div class="mv-board-copy"><div class="mv-board-title">Create a list</div><div class="mv-board-meta">Make it yours</div></div></button></div></div></section>`;
    delete main.dataset.mvRendering;
    main.querySelector('#mv-new-list').onclick=()=>openCreate();main.querySelector('#mv-new-tile').onclick=()=>openCreate();
    main.querySelectorAll('[data-open-board]').forEach(el=>el.onclick=()=>openBoard(el.dataset.openBoard));
  }

  async function openBoard(boardId){
    if((location.pathname||'').replace(/\/$/,'')!=='/saved')return;
    const app=document.getElementById('app');const main=app?.querySelector('main');if(!main)return;
    const isAll=boardId==='all',b=isAll?null:board(boardId);if(!isAll&&!b)return renderSavedPage();
    const pids=isAll?ids():boardIds(b);const products=await fetchProducts(pids);
    const cards=products.map(p=>`<article class="mv-product"><button class="mv-remove" data-remove-id="${Number(p.id)}" title="${isAll?'Remove from saves':'Remove from list'}">×</button><a href="/product/${encodeURIComponent(p.slug)}/" style="text-decoration:none;color:inherit"><div class="mv-product-media"><img src="${esc(p.image_url)}" alt="${esc((p.brand||'')+' '+(p.name||''))}"></div><div class="mv-product-brand">${esc(p.brand||p.category||'VYRDICT')}</div><div class="mv-product-name">${esc(p.name||'')}</div><div class="mv-product-score">Viral ${Math.round(Number(p.viral_score||0))} · Worth ${Math.round(Number(p.worth_score||0))}</div></a></article>`).join('');
    main.innerHTML=`<section id="my-vyrdict-page"><div class="mv-shell"><button class="mv-back" id="mv-back-lists">← My lists</button><div class="mv-detail-head"><div><div class="mv-kicker">MY VYRDICT</div><h2>${esc(isAll?'All Saves':b.title)}</h2><div class="mv-detail-meta">${pids.length} saved ${pids.length===1?'item':'items'}</div></div>${isAll?'':`<button class="mv-edit" id="mv-edit-list">Edit list</button>`}</div><div class="mv-products">${cards||`<div class="mv-empty-state"><b>Nothing here yet.</b>Heart something you love, then add it to this list.</div>`}</div></div></section>`;
    main.querySelector('#mv-back-lists').onclick=renderSavedPage;
    main.querySelector('#mv-edit-list')?.addEventListener('click',()=>openBoardEdit(boardId));
    main.querySelectorAll('[data-remove-id]').forEach(btn=>btn.onclick=e=>{e.preventDefault();e.stopPropagation();const id=Number(btn.dataset.removeId);if(isAll){const next=ids().filter(x=>x!==id);try{localStorage.setItem(SAVED_KEY,JSON.stringify(next))}catch{};removeFromAllBoards(id);try{window.VyrdictAccount?.writeLocal?.(next)}catch{}}else addToBoard(id,boardId,false);openBoard(boardId)});
  }

  function watchSavedPage(){
    if(observer)observer.disconnect();
    const app=document.getElementById('app');if(!app)return;
    observer=new MutationObserver(()=>{if((location.pathname||'').replace(/\/$/,'')==='/saved'&&!document.getElementById('my-vyrdict-page'))setTimeout(renderSavedPage,30)});
    observer.observe(app,{childList:true,subtree:true});
  }

  const preSave=new Map();
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-save]');if(!b)return;const id=Number(b.dataset.save);if(Number.isFinite(id))preSave.set(id,ids().includes(id))},{passive:true});
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-save]');if(!b)return;const id=Number(b.dataset.save);if(!Number.isFinite(id))return;
    const before=preSave.get(id);setTimeout(()=>{const now=ids().includes(id);if(before===false&&now)openPicker(id);else if(before===true&&!now)removeFromAllBoards(id);preSave.delete(id)},80);
  },{passive:true});

  addEventListener('vyrdict:account',()=>{mergeCloud();renderSavedPage()});
  addEventListener('popstate',()=>setTimeout(()=>{renderSavedPage();watchSavedPage()},40));
  addEventListener('pageshow',()=>setTimeout(()=>{renderSavedPage();watchSavedPage()},60));

  const start=()=>{style();mergeCloud();renderSavedPage();watchSavedPage();[200,700,1500].forEach(ms=>setTimeout(renderSavedPage,ms))};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();

  window.VyrdictLists={get state(){return state},createBoard,openPicker,render:renderSavedPage};
})();