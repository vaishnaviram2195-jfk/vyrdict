(()=>{
  if(window.__vyrdictIsamayaEnhancementsV1)return;
  window.__vyrdictIsamayaEnhancementsV1=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='ve-isamaya-enhance-style-v1';
  const NAV_ID='ve-utility-nav';
  const SEARCH_ID='ve-product-search-modal';
  const NEWSLETTER_URL='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-newsletter-signup';
  const CATEGORY_ORDER=['Beauty','Beauty Tech','Books','Fashion','Fitness','Food & Drinks','Hair','Home','Kids & Baby','Kitchen','Makeup','Perfume','Pets','Shoes','Skincare','Stationery & Crafts','Tech','Toys & Collectibles','Travel','Wellness'];
  const norm=s=>String(s||'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const slug=s=>String(s||'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function css(){
    if(document.getElementById(STYLE_ID))return;
    const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
#${NAV_ID}{position:relative;z-index:80;background:#f7f5ef;border-bottom:1px solid rgba(20,20,20,.14);font-family:var(--ve-sans,"Helvetica Neue",Arial,sans-serif)}
.ve-utility-inner{width:min(1320px,calc(100% - 80px));margin:0 auto;display:flex;align-items:center;min-height:52px;gap:4px}
.ve-utility-link,.ve-utility-btn{appearance:none;border:0;background:transparent;color:#171717;text-decoration:none;padding:18px 13px 16px;font:650 10px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.10em;text-transform:uppercase;cursor:pointer;white-space:nowrap}
.ve-utility-link:hover,.ve-utility-btn:hover,.ve-utility-btn[aria-expanded="true"]{background:#ebe8e0}
.ve-utility-spacer{flex:1}.ve-utility-icon{font-size:14px;letter-spacing:0;padding-left:10px;padding-right:10px}
.ve-mega{display:none;position:absolute;left:0;right:0;top:100%;background:#f7f5ef;border-top:1px solid rgba(0,0,0,.08);border-bottom:1px solid rgba(0,0,0,.14);box-shadow:0 20px 50px rgba(0,0,0,.10)}
#${NAV_ID}.ve-open .ve-mega{display:block}
.ve-mega-inner{width:min(1320px,calc(100% - 80px));margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1.25fr;gap:54px;padding:38px 0 42px}
.ve-mega-label{font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.16em;text-transform:uppercase;color:#77736d;margin-bottom:17px}
.ve-mega a,.ve-mega button.ve-mega-action{display:block;width:max-content;max-width:100%;background:none;border:0;padding:0;margin:0 0 11px;text-decoration:none;color:#171717;font:400 28px/1.03 var(--ve-serif,Georgia,serif);letter-spacing:-.035em;cursor:pointer;text-align:left}
.ve-mega a:hover,.ve-mega button.ve-mega-action:hover{opacity:.55}
.ve-news-card{background:#dedbd4;padding:24px}.ve-news-card h3{font:400 32px/1 var(--ve-serif,Georgia,serif);letter-spacing:-.04em;margin:0 0 10px}.ve-news-card p{font:400 12px/1.55 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);color:#5f5c56;margin:0 0 17px}
.ve-news-form{display:flex;border-bottom:1px solid #171717}.ve-news-form input{min-width:0;flex:1;border:0;background:transparent;padding:11px 0;font:500 13px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);outline:none}.ve-news-form button{border:0;background:transparent;padding:11px 0 11px 14px;font:750 10px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.ve-news-status{font:600 10px/1.4 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);min-height:15px;margin-top:10px;color:#4e4b45}

/* ISAMAYA-like product drop: no white card boxes; products fall into the grey field. */
.ve-stage.ve-drop-stage{height:630px;overflow:visible}.ve-drop-stage .ve-stage-orb{opacity:.48}
.ve-drop-item{position:absolute;display:block;text-decoration:none;z-index:2;opacity:0;transform:translate3d(0,-115vh,0) rotate(var(--ve-r0,-8deg)) scale(.82);animation:veProductDrop 1.35s cubic-bezier(.17,.84,.27,1.02) forwards;animation-delay:var(--ve-delay,0s);will-change:transform,opacity}
.ve-drop-item img{width:100%;height:100%;object-fit:contain;background:transparent!important;mix-blend-mode:multiply;filter:drop-shadow(0 24px 25px rgba(0,0,0,.17));transition:transform .35s ease}
.ve-drop-item:hover img{transform:translateY(-7px) scale(1.03)}
.ve-drop-tag{position:absolute;left:50%;bottom:-15px;transform:translateX(-50%);white-space:nowrap;background:rgba(244,242,235,.88);backdrop-filter:blur(9px);padding:7px 9px;border:1px solid rgba(0,0,0,.10);font:700 8px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:#242424}
@keyframes veProductDrop{0%{opacity:0;transform:translate3d(0,-115vh,0) rotate(var(--ve-r0,-8deg)) scale(.82)}68%{opacity:1;transform:translate3d(0,16px,0) rotate(var(--ve-r1,2deg)) scale(1.025)}84%{transform:translate3d(0,-7px,0) rotate(var(--ve-r2,-1deg)) scale(.995)}100%{opacity:1;transform:translate3d(0,0,0) rotate(0) scale(1)}}
.ve-product-media{background:#ebe9e3!important}.ve-product-media:before{display:none!important}.ve-product-media img{mix-blend-mode:multiply;background:transparent!important;width:88%!important;height:88%!important}
.ve-feature-media,.ve-mini{background:#dcd9d2!important}.ve-feature-media img,.ve-mini img{mix-blend-mode:multiply;background:transparent!important}

.ve-more-categories{display:none;flex-wrap:wrap;gap:10px;margin-top:10px}.ve-more-categories.ve-show{display:flex}.ve-category-more{appearance:none;border:1px solid rgba(255,255,255,.28);background:transparent;color:#f4f1eb;padding:11px 14px;font:650 10px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;cursor:pointer}.ve-category-more:hover{background:#f4f1eb;color:#171717}

#${SEARCH_ID}{position:fixed;inset:0;z-index:99999;background:rgba(19,19,19,.55);backdrop-filter:blur(7px);display:none;align-items:flex-start;justify-content:center;padding:12vh 20px 30px}#${SEARCH_ID}.ve-show{display:flex}
.ve-search-panel{width:min(760px,100%);max-height:76vh;overflow:auto;background:#f7f5ef;padding:26px 28px 30px;box-shadow:0 30px 90px rgba(0,0,0,.24)}
.ve-search-head{display:flex;justify-content:space-between;align-items:center;gap:20px}.ve-search-head h2{font:400 40px/1 var(--ve-serif,Georgia,serif);letter-spacing:-.04em;margin:0}.ve-search-close{border:0;background:transparent;font-size:25px;cursor:pointer}
.ve-search-input{width:100%;border:0;border-bottom:1px solid #171717;background:transparent;padding:16px 0 13px;margin-top:16px;outline:none;font:500 16px/1.2 var(--ve-sans,"Helvetica Neue",Arial,sans-serif)}
.ve-search-results{margin-top:18px;display:grid;gap:7px}.ve-search-result{display:grid;grid-template-columns:64px 1fr auto;gap:14px;align-items:center;text-decoration:none;color:#171717;border-top:1px solid rgba(0,0,0,.10);padding:10px 0}.ve-search-result img{width:64px;height:64px;object-fit:contain;mix-blend-mode:multiply}.ve-search-result b{font:650 13px/1.25 var(--ve-sans,"Helvetica Neue",Arial,sans-serif)}.ve-search-result small{display:block;margin-top:3px;color:#77736d;font:650 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase}.ve-search-result span{font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.06em;text-transform:uppercase}.ve-search-empty{padding:24px 0;font:400 13px/1.5 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);color:#6d6962}

@media(max-width:980px){.ve-utility-inner,.ve-mega-inner{width:min(100% - 34px,900px)}.ve-utility-inner{overflow-x:auto;scrollbar-width:none}.ve-utility-inner::-webkit-scrollbar{display:none}.ve-utility-spacer{display:none}.ve-mega-inner{grid-template-columns:1fr 1fr;gap:30px}.ve-news-card{grid-column:1/-1}.ve-stage.ve-drop-stage{height:520px}}
@media(max-width:620px){.ve-utility-inner{width:calc(100% - 18px);min-height:46px}.ve-utility-link,.ve-utility-btn{padding:16px 9px 14px;font-size:9px}.ve-utility-icon{font-size:12px}.ve-mega-inner{width:calc(100% - 30px);grid-template-columns:1fr;padding:28px 0}.ve-news-card{grid-column:auto}.ve-mega a,.ve-mega button.ve-mega-action{font-size:25px}.ve-stage.ve-drop-stage{height:470px}.ve-drop-tag{display:none}#${SEARCH_ID}{padding-top:9vh}.ve-search-panel{padding:21px 18px}.ve-search-head h2{font-size:34px}}
@media(prefers-reduced-motion:reduce){.ve-drop-item{animation:none!important;opacity:1!important;transform:none!important}}
`;
    document.head.appendChild(st);
  }

  function catalog(){
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      const rows=Array.isArray(c?.p)?c.p:[];
      return rows.filter(p=>p&&p.slug&&p.name&&p.image_url&&p.is_active!==false);
    }catch{return[]}
  }

  function catMatch(p,c){
    const pc=norm(p.category), sc=norm(p.subcategory), nc=norm(c);
    return pc===nc||sc===nc||pc.includes(nc)||nc.includes(pc);
  }
  function choose(rows,cats,count,used){
    const out=[];
    for(const c of cats){
      const p=rows.find(x=>!used.has(x.slug)&&catMatch(x,c));
      if(p){out.push(p);used.add(p.slug);if(out.length>=count)return out}
    }
    const seenCats=new Set(out.map(x=>norm(x.category)));
    for(const p of rows){
      if(used.has(p.slug))continue;
      const pc=norm(p.category);
      if(seenCats.has(pc))continue;
      out.push(p);used.add(p.slug);seenCats.add(pc);if(out.length>=count)break;
    }
    return out;
  }

  function hideStoriesTop(){
    document.querySelectorAll('header a,header button,nav a,nav button').forEach(el=>{
      const t=norm(el.textContent);
      if(t==='vyrdict stories'||t==='verdict stories'||t==='stories'){
        el.style.setProperty('display','none','important');
        el.setAttribute('aria-hidden','true');
      }
    });
  }

  function scrollToSel(sel){
    closeMega();
    const el=document.querySelector(sel);if(!el)return;
    const y=Math.max(0,el.getBoundingClientRect().top+scrollY-92);scrollTo({top:y,behavior:'smooth'});
  }

  function utilityNav(root){
    if(document.getElementById(NAV_ID))return;
    const nav=document.createElement('div');nav.id=NAV_ID;
    nav.innerHTML=`<div class="ve-utility-inner">
      <button class="ve-utility-btn" type="button" data-ve-menu aria-expanded="false">Shop +</button>
      <a class="ve-utility-link" href="/collection/gifts/">Gifts</a>
      <a class="ve-utility-link" href="/#skip-list">Skip List</a>
      <button class="ve-utility-btn" type="button" data-ve-search>Search</button>
      <button class="ve-utility-btn" type="button" data-ve-community>Community</button>
      <span class="ve-utility-spacer"></span>
      <a class="ve-utility-link ve-utility-icon" href="/account.html" aria-label="Account">Account</a>
      <a class="ve-utility-link ve-utility-icon" href="/saved" aria-label="Favorites">Favorites</a>
    </div>
    <div class="ve-mega" aria-hidden="true"><div class="ve-mega-inner">
      <div><div class="ve-mega-label">Shop VYRDICT</div>
        <button class="ve-mega-action" type="button" data-scroll=".ve-community">Community Favorites</button>
        <button class="ve-mega-action" type="button" data-scroll=".ve-worth">Worth the Hype</button>
        <a href="/collection/gifts/">Gifts</a><a href="/#skip-list">Skip List</a>
      </div>
      <div><div class="ve-mega-label">Discover</div>
        <button class="ve-mega-action" type="button" data-ve-search>Search Products</button>
        <button class="ve-mega-action" type="button" data-scroll=".ve-motion">What's Having a Moment</button>
        <button class="ve-mega-action" type="button" data-scroll=".ve-discover">All Categories</button>
        <button class="ve-mega-action" type="button" data-scroll=".ve-story">VYRDICT Stories</button>
      </div>
      <div class="ve-news-card"><div class="ve-mega-label">Core Community</div><h3>Get the signal before the scroll.</h3><p>Join the VYRDICT list for the weekly edit of what is going viral—and whether it is actually worth it.</p>
        <form class="ve-news-form"><input type="email" name="email" placeholder="Email address" autocomplete="email" required aria-label="Email address"><button type="submit">Join</button></form><div class="ve-news-status" aria-live="polite"></div>
      </div>
    </div></div>`;
    root.insertBefore(nav,root.firstChild);
    nav.querySelector('[data-ve-menu]').addEventListener('click',()=>{
      const open=!nav.classList.contains('ve-open');nav.classList.toggle('ve-open',open);nav.querySelector('[data-ve-menu]').setAttribute('aria-expanded',String(open));nav.querySelector('.ve-mega').setAttribute('aria-hidden',String(!open));
    });
    nav.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>scrollToSel(b.dataset.scroll)));
    nav.querySelectorAll('[data-ve-search]').forEach(b=>b.addEventListener('click',openSearch));
    nav.querySelector('[data-ve-community]').addEventListener('click',()=>{nav.classList.add('ve-open');nav.querySelector('[data-ve-menu]').setAttribute('aria-expanded','true');setTimeout(()=>nav.querySelector('.ve-news-form input')?.focus(),80)});
    nav.querySelector('.ve-news-form').addEventListener('submit',newsletterSubmit);
    document.addEventListener('click',e=>{if(nav.classList.contains('ve-open')&&!nav.contains(e.target))closeMega()});
  }
  function closeMega(){const n=document.getElementById(NAV_ID);if(!n)return;n.classList.remove('ve-open');n.querySelector('[data-ve-menu]')?.setAttribute('aria-expanded','false');n.querySelector('.ve-mega')?.setAttribute('aria-hidden','true')}

  async function newsletterSubmit(e){
    e.preventDefault();const form=e.currentTarget,status=form.parentElement.querySelector('.ve-news-status'),email=form.email.value.trim();
    if(!email)return;status.textContent='Adding you…';form.querySelector('button').disabled=true;
    try{const r=await fetch(NEWSLETTER_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,source:'homepage_community_menu'})});if(!r.ok)throw new Error();status.textContent="You're on the list.";form.reset()}catch{status.textContent='Could not sign you up. Please try again.'}finally{form.querySelector('button').disabled=false}
  }

  function searchModal(){
    if(document.getElementById(SEARCH_ID))return;
    const m=document.createElement('div');m.id=SEARCH_ID;m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Search products');
    m.innerHTML=`<div class="ve-search-panel"><div class="ve-search-head"><h2>Search VYRDICT</h2><button class="ve-search-close" type="button" aria-label="Close">×</button></div><input class="ve-search-input" type="search" placeholder="Search products or brands…" autocomplete="off"><div class="ve-search-results"><div class="ve-search-empty">Start typing to search the VYRDICT catalog.</div></div></div>`;
    document.body.appendChild(m);m.querySelector('.ve-search-close').addEventListener('click',closeSearch);m.addEventListener('click',e=>{if(e.target===m)closeSearch()});m.querySelector('.ve-search-input').addEventListener('input',renderSearch);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch()});
  }
  function openSearch(){closeMega();searchModal();const m=document.getElementById(SEARCH_ID);m.classList.add('ve-show');document.body.style.overflow='hidden';setTimeout(()=>m.querySelector('.ve-search-input')?.focus(),30)}
  function closeSearch(){const m=document.getElementById(SEARCH_ID);if(!m)return;m.classList.remove('ve-show');document.body.style.overflow=''}
  function renderSearch(e){
    const q=norm(e.target.value),box=document.querySelector('#'+SEARCH_ID+' .ve-search-results');if(!q){box.innerHTML='<div class="ve-search-empty">Start typing to search the VYRDICT catalog.</div>';return}
    const hits=catalog().filter(p=>norm(`${p.brand||''} ${p.name||''} ${p.category||''}`).includes(q)).slice(0,8);
    box.innerHTML=hits.length?hits.map(p=>`<a class="ve-search-result" href="/product/${encodeURIComponent(p.slug)}/"><img src="${esc(p.image_url)}" alt=""><div><b>${esc(p.name)}</b><small>${esc(p.brand||p.category||'VYRDICT')}</small></div><span>V ${Number.isFinite(Number(p.viral_score))?Math.round(Number(p.viral_score)):'—'} · W ${Number.isFinite(Number(p.worth_score))?Math.round(Number(p.worth_score)):'—'}</span></a>`).join(''):'<div class="ve-search-empty">No matching products yet.</div>';
  }

  function productDrop(root,rows,used){
    const stage=root.querySelector('.ve-stage');if(!stage||stage.dataset.veDrops==='1')return;
    const picks=choose(rows,['Fitness','Wellness','Beauty Tech','Kids & Baby','Pets','Tech','Home','Fashion'],7,used);if(picks.length<4)return;
    stage.dataset.veDrops='1';stage.classList.add('ve-drop-stage');stage.querySelectorAll('.ve-float').forEach(x=>x.remove());
    const positions=[
      ['8%','10%','24%','34%','-.12s','-10deg','3deg','-2deg'],['39%','4%','25%','39%','.08s','9deg','-2deg','1deg'],['72%','9%','21%','31%','.25s','-8deg','2deg','-1deg'],['4%','54%','19%','29%','.38s','7deg','-2deg','1deg'],['30%','55%','21%','31%','.52s','-9deg','3deg','-1deg'],['57%','52%','20%','30%','.68s','10deg','-2deg','1deg'],['79%','57%','18%','27%','.82s','-7deg','2deg','-1deg']
    ];
    picks.forEach((p,i)=>{const a=document.createElement('a');const pos=positions[i%positions.length];a.className='ve-drop-item';a.href='/product/'+encodeURIComponent(p.slug)+'/';a.style.left=pos[0];a.style.top=pos[1];a.style.width=pos[2];a.style.height=pos[3];a.style.setProperty('--ve-delay',pos[4]);a.style.setProperty('--ve-r0',pos[5]);a.style.setProperty('--ve-r1',pos[6]);a.style.setProperty('--ve-r2',pos[7]);a.innerHTML=`<img src="${esc(p.image_url)}" alt="${esc((p.brand?`${p.brand} `:'')+p.name)}"><span class="ve-drop-tag">${esc(p.category||p.brand||'VYRDICT')}</span>`;stage.appendChild(a)});
  }

  function setCard(a,p){
    if(!a||!p)return;a.href='/product/'+encodeURIComponent(p.slug)+'/';const img=a.querySelector('img');if(img){img.src=p.image_url;img.alt=(p.brand?`${p.brand} `:'')+p.name}
    const brand=a.querySelector('.ve-product-brand,.brand,[class*="brand"]');if(brand)brand.textContent=p.brand||p.category||'VYRDICT';
    const name=a.querySelector('.ve-product-name,h3,[class*="name"]');if(name)name.textContent=p.name;
    const scores=a.querySelector('.ve-scores,.scores,[class*="score"]');if(scores){const v=Number.isFinite(Number(p.viral_score))?Math.round(Number(p.viral_score)):'—',w=Number.isFinite(Number(p.worth_score))?Math.round(Number(p.worth_score)):'—';scores.innerHTML=`<span>Viral <b>${v}</b></span><span>Worth <b>${w}</b></span>`}
  }

  function diversify(root,rows,used){
    const community=[...root.querySelectorAll('.ve-community .ve-product')];
    const cp=choose(rows,['Fashion','Food & Drinks','Hair','Shoes','Skincare','Books'],community.length||4,used);community.forEach((a,i)=>setCard(a,cp[i]));
    const feature=root.querySelector('.ve-worth .ve-feature-product');const minis=[...root.querySelectorAll('.ve-worth .ve-mini')];const wp=choose(rows,['Travel','Kitchen','Stationery & Crafts','Perfume','Toys & Collectibles','Makeup'],1+minis.length,used);if(feature&&wp[0])setCard(feature,wp[0]);minis.forEach((a,i)=>setCard(a,wp[i+1]));
  }

  function categories(root){
    const box=root.querySelector('.ve-category-links');if(!box||box.dataset.veAllCats==='1')return;box.dataset.veAllCats='1';
    const primary=['Beauty','Fashion','Tech','Wellness','Home','Kids & Baby','Pets','Food & Drinks'];const more=CATEGORY_ORDER.filter(x=>!primary.includes(x));
    box.innerHTML=primary.map(c=>`<a href="/category/${slug(c)}/">${esc(c)}</a>`).join('')+`<button class="ve-category-more" type="button" aria-expanded="false">Explore More Categories</button><div class="ve-more-categories">${more.map(c=>`<a href="/category/${slug(c)}/">${esc(c)}</a>`).join('')}</div>`;
    const btn=box.querySelector('.ve-category-more'),moreBox=box.querySelector('.ve-more-categories');btn.addEventListener('click',()=>{const open=!moreBox.classList.contains('ve-show');moreBox.classList.toggle('ve-show',open);btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'Show Fewer Categories':'Explore More Categories'});
  }

  function enhance(){
    const root=document.getElementById('vyrdict-editorial-home');if(!root)return false;css();hideStoriesTop();utilityNav(root);searchModal();
    const rows=catalog();if(rows.length>=8){const used=new Set();productDrop(root,rows,used);diversify(root,rows,used)}
    categories(root);return true;
  }

  let tries=0;const timer=setInterval(()=>{tries++;const ok=enhance();if(ok&&catalog().length>=8||tries>40)clearInterval(timer)},200);
  enhance();
  const host=document.getElementById('app')||document.body;new MutationObserver(()=>{hideStoriesTop();if(document.getElementById('vyrdict-editorial-home'))enhance()}).observe(host,{childList:true,subtree:false});
})();