(()=>{
if(window.__vyrdictFreshArrivalsV1)return;
window.__vyrdictFreshArrivalsV1=true;
const endpoint='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-fresh-arrivals';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const safe=s=>{try{const u=new URL(s);return u.protocol==='https:'?u.href:''}catch{return''}};
function mount(){
 const before=document.querySelector('.products');
 if(!before||document.getElementById('vyrdict-fresh-finds'))return;
 const section=document.createElement('section');
 section.id='vyrdict-fresh-finds';section.className='wrap';
 section.setAttribute('aria-label','New finds on VYRDICT');
 section.innerHTML='<div class="vfa-heading"><div><div class="kicker">NEW TO VYRDICT · 2026 EDIT</div><h2>Just discovered.</h2></div><p>New products entering our radar. Independently checked identities; full Viral and Worth scores are still being researched.</p></div><div class="vfa-grid"><div class="vfa-loading">Curating the latest finds…</div></div>';
 const css=document.createElement('style');
 css.textContent=`
 #vyrdict-fresh-finds{padding:34px 0 50px;border-bottom:1px solid rgba(0,0,0,.12)}
 .vfa-heading{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:22px}
 .vfa-heading h2{font:400 clamp(31px,3.5vw,46px)/1 "Iowan Old Style",Baskerville,Georgia,serif;letter-spacing:-.045em;margin:7px 0 0;color:#70000e}
 .vfa-heading p{font:13px/1.55 Arial,sans-serif;color:#68645f;max-width:470px;margin:0}
 .vfa-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:23px 16px}
 .vfa-card{text-decoration:none;display:block;min-width:0;color:inherit}
 .vfa-image{aspect-ratio:.9;background:#ebe7df;display:grid;place-items:center;padding:15px;position:relative;overflow:hidden}
 .vfa-image img{width:100%;height:100%;object-fit:contain;transition:transform .25s}
 .vfa-card:hover img{transform:scale(1.04)}
 .vfa-label{position:absolute;left:9px;top:9px;background:rgba(255,255,255,.93);padding:7px 8px;letter-spacing:.12em;font:800 8px/1 Arial,sans-serif;text-transform:uppercase}
 .vfa-copy{padding-top:12px}.vfa-meta{font:800 9px/1.3 Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7a726b}.vfa-name{font:500 17px/1.26 Arial,sans-serif;margin:7px 0 9px}
 .vfa-status{font:700 10px/1.4 Arial,sans-serif;color:#70000e}.vfa-loading{grid-column:1/-1;color:#807970;font:12px/1.6 Arial,sans-serif}
 @media(max-width:760px){.vfa-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:23px 12px}.vfa-heading{display:block}.vfa-heading p{margin-top:11px;font-size:12px}.vfa-name{font-size:14px}#vyrdict-fresh-finds{padding:28px 0 37px}}
 `;
 document.head.appendChild(css);before.parentNode.insertBefore(section,before);
 fetch(endpoint,{headers:{accept:'application/json'},cache:'no-store'})
  .then(r=>{if(!r.ok)throw new Error('unavailable');return r.json()})
  .then(data=>{
    const rows=(Array.isArray(data?.arrivals)?data.arrivals:[])
      .filter(p=>safe(p.image_url)&&safe(p.product_url)&&p.brand&&p.name).slice(0,12);
    if(!rows.length){section.remove();return}
    const grid=section.querySelector('.vfa-grid');
    grid.innerHTML=rows.map(p=>`<a class="vfa-card" href="${esc(safe(p.product_url))}" target="_blank" rel="nofollow noopener noreferrer sponsored"><div class="vfa-image"><span class="vfa-label">NEW FIND</span><img loading="lazy" decoding="async" src="${esc(safe(p.image_url))}" alt="${esc(p.brand+' '+p.name)}" onerror="this.style.opacity='.2'"></div><div class="vfa-copy"><div class="vfa-meta">${esc(p.category)} · ${esc(p.brand)}</div><h3 class="vfa-name">${esc(p.name)}</h3><div class="vfa-status">Verdict pending · View product ↗</div></div></a>`).join('');
  }).catch(()=>section.remove());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();