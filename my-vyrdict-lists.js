(()=>{
  if(window.__vyrdictMyListsPickerV2)return;
  window.__vyrdictMyListsPickerV2=1;

  const SAVED_KEY='vyrdict:saved';
  const BOARD_KEY='vyrdict:boards:v1';
  const starter=[
    {id:'birthday',name:'Birthday Wishlist',itemIds:[]},
    {id:'skincare',name:'Skincare',itemIds:[]},
    {id:'apartment',name:'Apartment',itemIds:[]},
    {id:'considering',name:'Things I’m Considering',itemIds:[]}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const savedIds=()=>{try{return [...new Set((JSON.parse(localStorage.getItem(SAVED_KEY)||'[]')||[]).map(Number).filter(Number.isFinite))]}catch{return[]}};
  const slugify=s=>String(s||'list').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,34)||'list';

  function loadBoards(){
    try{
      const x=JSON.parse(localStorage.getItem(BOARD_KEY)||'null');
      if(x?.boards?.length)return normalize(x);
    }catch{}
    const x={version:1,boards:starter.map(b=>({...b,createdAt:Date.now()}))};
    try{localStorage.setItem(BOARD_KEY,JSON.stringify(x))}catch{}
    return x;
  }
  function normalize(x){
    const valid=new Set(savedIds());
    return {version:1,boards:(x?.boards||[]).filter(b=>b&&b.id&&b.name).map(b=>({id:String(b.id),name:String(b.name).slice(0,48),itemIds:[...new Set((b.itemIds||[]).map(Number).filter(n=>Number.isFinite(n)&&valid.has(n)))],createdAt:Number(b.createdAt||Date.now())}))}
  }
  function saveBoards(state){try{localStorage.setItem(BOARD_KEY,JSON.stringify(normalize(state)))}catch{}}
  function uniqueId(state,name){let base=slugify(name),id=base,n=2;while(state.boards.some(b=>b.id===id))id=base+'-'+n++;return id}
  function removeFromBoards(productId){const s=loadBoards();let changed=false;for(const b of s.boards){const next=b.itemIds.filter(x=>Number(x)!==Number(productId));if(next.length!==b.itemIds.length){b.itemIds=next;changed=true}}if(changed)saveBoards(s)}

  function style(){
    if(document.getElementById('vyrdict-board-picker-style'))return;
    const s=document.createElement('style');s.id='vyrdict-board-picker-style';s.textContent=`
      .vb-overlay{position:fixed;inset:0;z-index:2147483630;background:rgba(28,27,25,.5);backdrop-filter:blur(5px);display:grid;place-items:center;padding:18px;font-family:"Helvetica Neue",Arial,sans-serif}.vb-card{width:min(430px,100%);max-height:min(670px,calc(100vh - 36px));overflow:auto;background:#f7f4ee;color:#1c1b19;border:1px solid rgba(255,255,255,.38);box-shadow:0 28px 80px rgba(20,18,16,.22);padding:24px}.vb-top{display:flex;align-items:start;justify-content:space-between;gap:18px}.vb-kicker{font:800 8px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#77716b;margin-bottom:8px}.vb-card h3{font:400 30px/1.04 Georgia,"Times New Roman",serif;letter-spacing:-.035em;margin:0}.vb-close{border:0;background:transparent;font-size:23px;line-height:1;cursor:pointer;padding:0}.vb-options{margin-top:20px;border-top:1px solid rgba(0,0,0,.14)}.vb-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 1px;border-bottom:1px solid rgba(0,0,0,.13);cursor:pointer}.vb-row b{font-size:12px;font-weight:650}.vb-count{display:block;color:#817b74;font-size:9px;margin-top:4px}.vb-check{width:20px;height:20px;border:1px solid #aaa39b;display:grid;place-items:center;font-size:12px;flex:0 0 auto}.vb-row.is-on .vb-check{background:#242320;color:#fff;border-color:#242320}.vb-actions{display:flex;gap:8px;margin-top:18px}.vb-btn{flex:1;border:1px solid #242320;background:transparent;color:#242320;padding:11px 9px;cursor:pointer;font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.vb-btn.primary{background:#242320;color:#fff}.vb-new{display:none;margin-top:16px}.vb-new.open{display:block}.vb-new input{width:100%;height:43px;border:1px solid #bcb5ac;background:#fffdf9;padding:0 12px;outline:none}.vb-new-actions{display:flex;gap:8px;margin-top:8px}@media(max-width:620px){.vb-card{padding:21px}.vb-card h3{font-size:27px}.vb-row{padding:12px 1px}}
    `;document.head.appendChild(s);
  }
  function close(){document.getElementById('vyrdict-board-picker')?.remove()}
  function open(productId){
    style();close();
    const state=loadBoards();const id=Number(productId);
    const rows=state.boards.map(b=>{const on=b.itemIds.includes(id);return`<div class="vb-row ${on?'is-on':''}" data-vb-board="${esc(b.id)}"><div><b>${esc(b.name)}</b><span class="vb-count">${b.itemIds.length} saved</span></div><span class="vb-check">${on?'✓':''}</span></div>`}).join('');
    const o=document.createElement('div');o.className='vb-overlay';o.id='vyrdict-board-picker';o.innerHTML=`<div class="vb-card" role="dialog" aria-modal="true"><div class="vb-top"><div><div class="vb-kicker">SAVED TO MY VYRDICT</div><h3>Where should it live?</h3></div><button class="vb-close" aria-label="Close">×</button></div><div class="vb-options">${rows}</div><div class="vb-new"><input id="vb-new-name" maxlength="48" placeholder="e.g. Summer trip, Gifts, Dream apartment"><div class="vb-new-actions"><button class="vb-btn" data-vb-cancel-new>Cancel</button><button class="vb-btn primary" data-vb-create>Create list</button></div></div><div class="vb-actions"><button class="vb-btn" data-vb-new>+ New list</button><button class="vb-btn primary" data-vb-done>Done</button></div></div>`;document.body.appendChild(o);
    const rowEls=()=>[...o.querySelectorAll('[data-vb-board]')];
    rowEls().forEach(r=>r.onclick=()=>{r.classList.toggle('is-on');r.querySelector('.vb-check').textContent=r.classList.contains('is-on')?'✓':''});
    const finish=()=>{const latest=loadBoards();for(const r of rowEls()){const b=latest.boards.find(x=>x.id===r.dataset.vbBoard);if(!b)continue;b.itemIds=b.itemIds.filter(x=>Number(x)!==id);if(r.classList.contains('is-on'))b.itemIds.unshift(id)}saveBoards(latest);close()};
    o.querySelector('.vb-close').onclick=finish;o.querySelector('[data-vb-done]').onclick=finish;o.addEventListener('click',e=>{if(e.target===o)finish()});
    const newBox=o.querySelector('.vb-new');const input=o.querySelector('#vb-new-name');
    o.querySelector('[data-vb-new]').onclick=()=>{newBox.classList.add('open');setTimeout(()=>input.focus(),20)};
    o.querySelector('[data-vb-cancel-new]').onclick=()=>{newBox.classList.remove('open');input.value=''};
    const create=()=>{const name=input.value.trim();if(!name)return;const latest=loadBoards();const bid=uniqueId(latest,name);latest.boards.unshift({id:bid,name,itemIds:[id],createdAt:Date.now()});saveBoards(latest);close();open(id)};
    o.querySelector('[data-vb-create]').onclick=create;input.addEventListener('keydown',e=>{if(e.key==='Enter')create()});
  }

  const before=new Map();
  document.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-save]');if(!b)return;const id=Number(b.dataset.save);if(Number.isFinite(id))before.set(id,savedIds().includes(id))},{passive:true});
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-save]');if(!b)return;const id=Number(b.dataset.save);if(!Number.isFinite(id))return;const was=before.get(id);setTimeout(()=>{const now=savedIds().includes(id);if(was===false&&now)open(id);else if(was===true&&!now)removeFromBoards(id);before.delete(id)},90)},{passive:true});
  addEventListener('storage',e=>{if(e.key===SAVED_KEY){const state=loadBoards();saveBoards(state)}});

  window.VyrdictLists={openPicker:open,get boards(){return loadBoards().boards}};
})();