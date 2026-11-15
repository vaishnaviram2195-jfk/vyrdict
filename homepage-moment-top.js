(()=>{
 if(window.__vyrdictVerifiedFirstV12)return;
 window.__vyrdictVerifiedFirstV12=true;window.__vyrdictFreshFirstV11=true;window.__vyrdictMomentTopV10=1;
 if(location.pathname!=='/')return;
 const ENDPOINT='/api/viral-now?mode=recent&limit=12&rev=20261115-verified-v12';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safe=s=>{try{const u=new URL(s);return u.protocol==='https:'?u.href:''}catch{return''}};
 const fresh=p=>{const published=Date.parse(p.published_at||''),verified=Date.parse(p.last_verified_at||'');const cutoff=Date.now()-30*86400000;return p&&p.evidence_status==='verified'&&p.evidence_confidence==='high'&&Number.isFinite(published)&&Number.isFinite(verified)&&published>=cutoff&&verified>=cutoff&&p.viral_score!=null&&p.worth_score!=null&&Number.isFinite(Number(p.viral_score))&&Number.isFinite(Number(p.worth_score))&&p.slug&&safe(p.image_url)};
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
   '#vyrdict-fresh-now .vfn-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px}',
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
  const photo=safe(p.image_url);
  if(!photo||!p.slug||!p.name)return '';
  const brand=esc(p.brand||''),name=esc(p.name||'');
  const href='/product/'+encodeURIComponent(p.slug)+'/';
  const viral=Math.round(Number(p.viral_score)),worth=Math.round(Number(p.worth_score));
  const check=new Date(p.last_verified_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
  const picture='/vti-image?url='+encodeURIComponent(photo);
  return '<a class="vfn-card" href="'+esc(href)+'"><div class="vfn-visual"><span class="vfn-tag">Evidence verified</span><img '+(i<2?'fetchpriority="high"':'loading="lazy"')+' decoding="async" src="'+esc(picture)+'" data-original="'+esc(photo)+'" alt="'+brand+' '+name+'" onerror="this.onerror=null;if(this.dataset.original)this.src=this.dataset.original"></div><div class="vfn-brand">'+brand+' · '+esc(p.category||'Product')+'</div><h2 class="vfn-name">'+name+'</h2><div class="vfn-status">Worth '+worth+'/100 · Viral '+viral+'/100</div><div class="vfn-brand" style="margin-top:7px">Review verified '+esc(check)+'</div></a>';
 }
 async function load(section){
  const tray=section.querySelector('.vfn-grid'),time=section.querySelector('[data-vfn-time]');
  try{
   const response=await fetch(ENDPOINT,{headers:{accept:'application/json'},cache:'no-store'});
   if(!response.ok)throw Error('verified_feed_'+response.status);
   const j=await response.json();
   const rows=(Array.isArray(j.products)?j.products:[]).filter(fresh).slice(0,9);
   tray.innerHTML=rows.length?rows.map(card).join(''):'<div class="vfn-loading">No new products have passed our complete evidence and scoring checks within the last 30 days. We are reviewing the next releases; older reviews will not be recycled as new.</div>';
   time.textContent=rows.length?rows.length+' fully verified reviews · Published within 30 days':'Next evidence review in progress';
  }catch(e){
   tray.innerHTML='<div class="vfn-loading">The latest verified reviews are temporarily unavailable. Please check back shortly.</div>';
   time.textContent='Verified feed unavailable';console.warn('[VYRDICT] verified feed unavailable',e);
  }
 }
 function mount(){
  const root=document.getElementById('vyrdict-editorial-home');
  if(!root)return false;
  if(document.getElementById('vyrdict-fresh-now'))return true;
  const motion=root.querySelector(':scope > .ve-motion');if(!motion)return false;
  addStyle();
  const node=document.createElement('section');
  node.id='vyrdict-fresh-now';node.setAttribute('aria-label','Latest fully verified VYRDICT product reviews');
  node.innerHTML='<div class="vfn-kicker">VYRDICT / THE VERIFIED EDIT</div><div class="vfn-head"><h1>Newly verified.</h1><p>Newer product reviews, backed by linked evidence and complete Viral and Worth Scores. We never present an unfinished rating—or a months-old review—as a new verdict.</p></div><div class="vfn-grid" aria-live="polite"><div class="vfn-loading">Loading verified product reviews…</div></div><div class="vfn-meta"><span data-vfn-time>Latest fully reviewed products</span><a href="/collection/viral-right-now/">Explore verified picks →</a></div>';
  motion.insertAdjacentElement('afterend',node);load(node);return true;
 }
 let tries=0;function boot(){if(mount())return;if(++tries<60)setTimeout(boot,tries<10?120:250)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
 addEventListener('pageshow',e=>{if(e.persisted)setTimeout(mount,60)});
})();