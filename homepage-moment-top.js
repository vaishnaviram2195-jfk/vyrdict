(()=>{
 if(window.__vyrdictFreshFirstV11)return;
 window.__vyrdictFreshFirstV11=true;window.__vyrdictMomentTopV10=1;
 if(location.pathname!=='/')return;
 const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-fresh-arrivals';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safe=s=>{try{const u=new URL(s);return u.protocol==='https:'?u.href:''}catch{return''}};
 const fresh=p=>{const t=Date.parse(p.published_at||'');return Number.isFinite(t)&&t<=Date.now()+3600000&&Date.now()-t<21*86400000};
 function addStyle(){
  if(document.getElementById('vyrdict-fresh-first-css'))return;
  const s=document.createElement('style');s.id='vyrdict-fresh-first-css';
  s.textContent=[
   '#vyrdict-editorial-home>.ve-hero,#vyrdict-editorial-home>.ve-motion,.vyrdict-index-gallery,.vyrdict-index-claw,#vyrdict-fresh-finds,#viral{display:none!important}',
   '#vyrdict-editorial-home>#vyrdict-fresh-now{background:#f8f5ef;color:#191715;padding:60px max(18px,calc((100vw - 1340px)/2)) 65px;border-bottom:1px solid #ddd8d0;position:relative;z-index:2}',
   '#vyrdict-fresh-now .vfn-kicker{font:800 10px/1.5 Arial,sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#800c24}',
   '#vyrdict-fresh-now .vfn-head{display:flex;justify-content:space-between;align-items:flex-end;gap:22px;margin:10px 0 30px}',
   '#vyrdict-fresh-now h1{font:400 clamp(42px,5.9vw,86px)/.99 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.06em;margin:0;color:#23191d}',
   '#vyrdict-fresh-now .vfn-head p{font:400 13px/1.7 Arial,sans-serif;color:#685f5c;max-width:430px;margin:0 0 6px}',
   '#vyrdict-fresh-now .vfn-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:13px}',
   '#vyrdict-fresh-now .vfn-card{color:inherit;text-decoration:none;display:block;min-width:0}',
   '#vyrdict-fresh-now .vfn-visual{aspect-ratio:.77;position:relative;background:#e9e4dd;overflow:hidden;padding:15px;display:flex;align-items:center;justify-content:center}',
   '#vyrdict-fresh-now .vfn-visual img{width:100%;height:100%;object-fit:contain;transition:transform .25s}',
   '#vyrdict-fresh-now .vfn-card:hover img{transform:scale(1.055)}',
   '#vyrdict-fresh-now .vfn-tag{position:absolute;top:10px;left:10px;background:#fffefa;padding:7px 9px;font:800 9px/1 Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#74122a;z-index:1}',
   '#vyrdict-fresh-now .vfn-brand{font:800 9px/1.4 Arial,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#786d68;margin-top:14px}',
   '#vyrdict-fresh-now .vfn-name{font:400 21px/1.18 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.025em;margin:7px 0}',
   '#vyrdict-fresh-now .vfn-status{font:700 10px/1.5 Arial,sans-serif;color:#80172d}',
   '#vyrdict-fresh-now .vfn-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;border-top:1px solid #ddd7cf;padding-top:17px;margin-top:24px;font:500 11px/1.5 Arial,sans-serif;color:#766f66}',
   '#vyrdict-fresh-now .vfn-meta a{border:1px solid #672330;color:#672330;text-decoration:none;border-radius:40px;padding:10px 14px;font:800 10px/1 Arial,sans-serif}',
   '#vyrdict-fresh-now .vfn-loading{grid-column:1/-1;padding:35px 0;font:13px/1.6 Arial,sans-serif;color:#756f69}',
   '@media(max-width:950px){#vyrdict-fresh-now .vfn-grid{grid-template-columns:repeat(3,minmax(0,1fr))}#vyrdict-fresh-now .vfn-head{display:block}#vyrdict-fresh-now .vfn-head p{margin-top:15px}}',
   '@media(max-width:580px){#vyrdict-editorial-home>#vyrdict-fresh-now{padding:34px 16px 38px}#vyrdict-fresh-now .vfn-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:19px 11px}#vyrdict-fresh-now .vfn-name{font-size:17px}#vyrdict-fresh-now .vfn-meta{align-items:flex-start;flex-direction:column}#vyrdict-fresh-now .vfn-visual{padding:9px}}'
  ].join('\n');
  document.head.appendChild(s);
 }
 function card(p,i){
  const href=safe(p.product_url),photo=safe(p.image_url);
  if(!href||!photo||!p.name)return '';
  const brand=esc(p.brand||''),name=esc(p.name||'');
  return '<a class="vfn-card shop" data-vyrdict-retailer-source="fresh_discovery" href="'+esc(href)+'" target="_blank" rel="noopener noreferrer nofollow"><div class="vfn-visual"><span class="vfn-tag">'+(i===0?'New this week':'New find')+'</span><img '+(i<2?'fetchpriority="high"':'loading="lazy"')+' decoding="async" src="'+esc(photo)+'" alt="'+brand+' '+name+'" onerror="this.onerror=null;this.style.opacity=0"></div><div class="vfn-brand">'+brand+' · '+esc(p.category||'Discovery')+'</div><h2 class="vfn-name">'+name+'</h2><div class="vfn-status">Product identified · VYRDICT score pending ↗</div></a>';
 }
 async function load(section){
  const tray=section.querySelector('.vfn-grid'),time=section.querySelector('[data-vfn-time]');
  try{
   const response=await fetch(ENDPOINT+'?rev=20261115-first',{headers:{accept:'application/json'},cache:'no-store'});
   if(!response.ok)throw Error('fresh_arrivals_'+response.status);
   const j=await response.json();
   const rows=(Array.isArray(j.arrivals)?j.arrivals:[]).filter(p=>p&&safe(p.image_url)&&safe(p.product_url)&&fresh(p)).slice(0,8);
   tray.innerHTML=rows.length?rows.map(card).join(''):'<div class="vfn-loading">No newly identified products currently meet our 21-day freshness window. Older products will not be substituted.</div>';
   time.textContent=rows.length?rows.length+' new product discoveries · Verdicts in progress':'Freshness checks in progress';
  }catch(e){
   tray.innerHTML='<div class="vfn-loading">New discoveries are temporarily unavailable. Please check back shortly.</div>';
   time.textContent='Live feed unavailable';console.warn('[VYRDICT] discovery feed unavailable',e);
  }
 }
 function mount(){
  const root=document.getElementById('vyrdict-editorial-home');
  if(!root)return false;
  if(document.getElementById('vyrdict-fresh-now'))return true;
  const motion=root.querySelector(':scope > .ve-motion');if(!motion)return false;
  addStyle();
  const node=document.createElement('section');
  node.id='vyrdict-fresh-now';node.setAttribute('aria-label','Trending right now: newly discovered products');
  node.innerHTML='<div class="vfn-kicker">VYRDICT / THE NEW & NOW EDIT</div><div class="vfn-head"><h1>Trending right now.</h1><p>New product discoveries, independently checked listings, and the launches getting attention. We add Viral and Worth Scores only after the full evidence review.</p></div><div class="vfn-grid" aria-live="polite"><div class="vfn-loading">Checking new discoveries…</div></div><div class="vfn-meta"><span data-vfn-time>Latest discovery feed</span><a href="/collection/viral-right-now/">See the full edit →</a></div>';
  motion.insertAdjacentElement('afterend',node);load(node);return true;
 }
 let tries=0;function boot(){if(mount())return;if(++tries<60)setTimeout(boot,tries<10?120:250)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 addEventListener('pageshow',e=>{if(e.persisted)setTimeout(mount,60)});
})();