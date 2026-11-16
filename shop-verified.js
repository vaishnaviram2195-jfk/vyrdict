(()=>{
'use strict';
if(window.__vyrdictShopFeedVerifiedV1)return;
window.__vyrdictShopFeedVerifiedV1=true;

const ENDPOINT='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-shop-verified';
const el=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imgUrl=s=>{try{const u=new URL(String(s||''));return u.protocol==='https:'?u.href:''}catch{return''}};
const slugOK=s=>typeof s==='string'&&/^[a-z0-9-]+$/.test(s);
const number=s=>(s===null||s===undefined||s==='')?null:(Number.isFinite(Number(s))?Math.round(Number(s)):null);
const day=s=>{const d=Date.parse(String(s||''));return Number.isFinite(d)?new Date(d).toLocaleDateString('en-CA',{month:'short',day:'numeric',year:'numeric'}):''};
const valid=p=>p&&p.id&&slugOK(p.slug)&&p.brand&&p.name&&imgUrl(p.image_url)
  &&number(p.viral_score)!==null&&number(p.worth_score)!==null
  &&number(p.viral_score)>=0&&number(p.viral_score)<=100
  &&number(p.worth_score)>=0&&number(p.worth_score)<=100
  &&p.linked_score_inputs===11&&p.evidence_source_domains>=3&&day(p.last_verified_at);
const GROUPS=[
  ['All',()=>true],
  ['Beauty',p=>['Beauty','Skincare','Makeup','Hair','Beauty Tech'].includes(p.category)],
  ['Fragrance',p=>['Perfume','Fragrance'].includes(p.category)],
  ['Style',p=>['Fashion','Shoes'].includes(p.category)],
  ['Wellness',p=>['Wellness','Fitness'].includes(p.category)],
  ['Home',p=>['Home','Kitchen'].includes(p.category)],
  ['Tech',p=>['Tech','Beauty Tech'].includes(p.category)],
  ['Pets',p=>p.category==='Pets'],
  ['Food & Drinks',p=>p.category==='Food & Drinks']
];
let catalog=[],edits=[],active='All',search='',shown=18,loaded=false;
const params=new URLSearchParams(location.search);
const wanted=params.get('category');
if(GROUPS.some(x=>x[0]===wanted))active=wanted;
const route=(location.pathname||'/').match(/^\/shop-the-feed\/([a-z0-9-]+)\/?$/);
const selectedSlug=route?route[1]:null;

function ordered(){
  const sorted=catalog.slice().sort((a,b)=>Date.parse(b.last_verified_at||'')-Date.parse(a.last_verified_at||''));
  const out=[],picked=new Set(),categories=new Map();
  const push=p=>{
    if(picked.has(p.id))return;
    out.push(p);picked.add(p.id);
    categories.set(p.category,(categories.get(p.category)||0)+1);
  };
  sorted.filter(p=>p.published_at&&Date.parse(p.published_at)>=Date.now()-45*86400000).slice(0,5).forEach(push);
  for(const max of [1,2,3]){
    for(const p of sorted)if((categories.get(p.category)||0)<max)push(p);
  }
  sorted.forEach(push);
  return out;
}
function phototag(p,priority){
  const img=imgUrl(p.image_url);
  const proxied='/vti-image?url='+encodeURIComponent(img);
  return '<img src="'+esc(proxied)+'" data-original="'+esc(img)+'" '+(priority?'fetchpriority="high"':'loading="lazy"')+
    ' decoding="async" alt="'+esc(p.brand+' '+p.name)+
    '" onerror="if(this.dataset.photoRetried!==\'1\'&&this.dataset.original){this.dataset.photoRetried=\'1\';this.src=this.dataset.original}else{this.onerror=null;this.hidden=true}">';
}
function score(p,label){
  const n=number(p[label]);
  return '<div class="sv-score"><span class="sv-score-label">'+(label==='viral_score'?'VIRAL SCORE':'WORTH SCORE')+'</span>'+
    '<span class="sv-score-value">'+n+'<small>/100</small></span>'+
    '<div class="sv-track" aria-hidden="true"><i style="width:'+n+'%"></i></div></div>';
}
function card(p,i){
  return '<a class="sv-card" href="/product/'+encodeURIComponent(p.slug)+'/" data-product="'+esc(p.slug)+'" aria-label="Open '+esc(p.brand+' '+p.name)+' full VYRDICT scores and evidence">'+
    '<div class="sv-image"><span class="sv-verified">EVIDENCE VERIFIED</span>'+phototag(p,i<3)+'</div>'+
    '<div class="sv-meta">'+esc(p.category||'Product')+' · '+esc(p.brand)+'</div>'+
    '<h3>'+esc(p.name)+'</h3>'+
    '<div class="sv-scores">'+score(p,'viral_score')+score(p,'worth_score')+'</div>'+
    '<div class="sv-evidence"><span>Reviewed '+esc(day(p.last_verified_at))+'</span><span>'+Number(p.evidence_source_domains)+' source sites · 11 evidence inputs</span></div>'+
    '<span class="sv-cta">Full evidence + where to buy <span aria-hidden="true">↗</span></span></a>';
}
function filters(){
  el('filters').innerHTML=GROUPS.filter(g=>g[0]==='All'||catalog.some(g[1])).map(g=>
    '<button type="button" class="chip" data-filter="'+esc(g[0])+'" aria-pressed="'+(g[0]===active?'true':'false')+'">'+esc(g[0])+'</button>'
  ).join('');
}
function showState(heading,body){
  const state=el('state');state.hidden=false;
  state.innerHTML='<span class="eyebrow">VYRDICT / FULLY VERIFIED</span><h2>'+esc(heading)+'</h2><p>'+esc(body)+'</p>';
}
function render(){
  if(!loaded)return;
  const term=search.toLocaleLowerCase().trim();
  let matching=(active==='All'?ordered():catalog.filter(p=>GROUPS.find(g=>g[0]===active)?.[1](p)))
    .filter(p=>!term||[p.brand,p.name,p.category,p.slug].join(' ').toLowerCase().includes(term));
  if(active!=='All')matching.sort((a,b)=>Date.parse(b.last_verified_at)-Date.parse(a.last_verified_at));
  const rows=matching.slice(0,shown);
  const grid=el('grid');
  grid.innerHTML=rows.map(card).join('');
  el('count').textContent=matching.length+' evidence-verified product'+(matching.length===1?'':'s');
  el('state').hidden=matching.length!==0;
  if(!matching.length)showState('No verified matches.','Try another product, brand or category. No incomplete or unscored reviews will be substituted.');
  const more=el('shop-show-more');
  if(more){more.hidden=matching.length<=shown;more.textContent='Explore more verified scores ('+Math.max(0,matching.length-shown)+' remaining)';}
  filters();
}
function renderEdits(){
  const area=el('verified-edits'),grid=el('verified-edits-grid');
  if(!area||!grid)return;
  const safe=edits.filter(e=>Array.isArray(e.product_ids)&&e.product_ids.length===e.product_count&&e.product_count>0
    &&e.product_ids.every(id=>catalog.some(p=>Number(p.id)===Number(id))));
  if(!safe.length){area.hidden=true;return}
  const byId=new Map(catalog.map(p=>[Number(p.id),p]));
  grid.innerHTML=safe.map((e,i)=>{
    const photo=byId.get(Number(e.product_ids[0]));
    return '<a class="tile" href="/shop-the-feed/'+encodeURIComponent(e.slug)+'/">'+
      '<div class="cover"><span class="num">FULLY VERIFIED · '+e.product_count+' PICKS</span>'+phototag(photo,i===0)+'</div>'+
      '<div class="tile-meta"><span>'+esc(e.category||'THE EDIT')+'</span><span>'+esc(day(e.published_at))+'</span></div>'+
      '<h3>'+esc(e.title)+'</h3><p>'+esc(e.dek||'Every product includes full VYRDICT scores and evidence.')+'</p>'+
      '<span class="view">See every scored product ↗</span></a>';
  }).join('');
  area.hidden=false;
}
function detailNotReady(message){
  el('feed-hero').hidden=true;el('feed-list').hidden=true;
  if(el('verified-edits'))el('verified-edits').hidden=true;
  const d=el('detail');d.hidden=false;
  d.innerHTML='<a class="back" href="/shop-the-feed/">← All verified products</a>'+
    '<div class="state" style="margin-top:35px"><span class="eyebrow">VYRDICT / VERIFIED EDITS</span>'+
    '<h2>This edit is not fully verified yet.</h2><p>'+esc(message)+'</p>'+
    '<a class="button" href="/shop-the-feed/">Explore products with full Viral and Worth Scores →</a></div>';
  document.title='Edit not fully verified — VYRDICT';
}
function renderDetail(e){
  const byId=new Map(catalog.map(p=>[Number(p.id),p]));
  const ps=e.product_ids.map(id=>byId.get(Number(id)));
  if(!ps.length||ps.some(p=>!p)){detailNotReady('All products in an edit must pass VYRDICT scoring and evidence checks before it appears here.');return}
  el('feed-hero').hidden=true;el('feed-list').hidden=true;
  if(el('verified-edits'))el('verified-edits').hidden=true;
  const d=el('detail');d.hidden=false;
  d.innerHTML='<a href="/shop-the-feed/" class="back">← All verified products</a>'+
    '<div class="detail-head"><div class="poster sv-detail-photo">'+phototag(ps[0],true)+'</div>'+
    '<div class="detail-copy"><div class="eyebrow">VYRDICT / SCORED EDIT</div><h1>'+esc(e.title)+'</h1>'+
    '<p>'+esc(e.dek||'Every product in this edit passed the complete VYRDICT evidence review.')+'</p>'+
    '<p class="meta">'+ps.length+' VERIFIED PRODUCTS · 11 LINKED SCORE INPUTS EACH</p></div></div>'+
    '<div class="section-title"><h2>Every score. Every pick.</h2><span class="eyebrow">'+ps.length+' EVIDENCE-BACKED REVIEWS</span></div>'+
    '<div class="grid sv-grid">'+ps.map(card).join('')+'</div>'+
    '<p class="note">Each score is linked to its own VYRDICT review, evidence sources and active retailer options. Review dates are shown on each card.</p>';
  document.title=e.title+' — VYRDICT verified Shop the Feed';
}
async function boot(){
  try{
    const response=await fetch(ENDPOINT+'?rev=20261115-scored-only-v1',{headers:{accept:'application/json'},cache:'no-store'});
    if(!response.ok)throw Error('verified_feed_http_'+response.status);
    const data=await response.json();
    if(!data||data.ok!==true||!Array.isArray(data.products)||!Array.isArray(data.edits))throw Error('verified_feed_malformed');
    catalog=data.products.filter(valid);
    edits=data.edits;
    loaded=true;
    if(selectedSlug){
      const e=edits.find(x=>x.slug===selectedSlug);
      if(e)renderDetail(e);
      else detailNotReady('This Instagram/editorial selection has not completed all required product verification. The original guide is preserved separately.');
      return;
    }
    el('feed-hero').hidden=false;el('feed-list').hidden=false;
    el('detail').hidden=true;
    filters();render();renderEdits();
  }catch(err){
    console.warn('[VYRDICT] verified Shop the Feed temporarily unavailable',err);
    if(selectedSlug){detailNotReady('We could not confirm verified scores for this edit right now. Please return to the verified product feed.');return}
    el('feed-list').hidden=false;
    el('grid').innerHTML='';el('count').textContent='';
    const more=el('shop-show-more');if(more)more.hidden=true;
    showState('Verified scores temporarily unavailable.','We are checking the evidence-backed product catalog. Unverified editorial items will not be shown as scored products.');
  }
}
if(el('filters'))el('filters').addEventListener('click',e=>{
  const button=e.target.closest('button[data-filter]');if(!button||!loaded)return;
  active=button.dataset.filter;shown=18;render();
});
if(el('search'))el('search').addEventListener('input',e=>{
  search=e.target.value;shown=18;render();
});
if(el('shop-show-more'))el('shop-show-more').addEventListener('click',()=>{if(!loaded)return;shown+=18;render()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();