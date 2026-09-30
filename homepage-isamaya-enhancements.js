(()=>{
  if(window.__vyrdictIsamayaEnhancementsV2)return;
  window.__vyrdictIsamayaEnhancementsV2=1;
  if((location.pathname||'/')!=='/')return;

  const STYLE_ID='ve-isamaya-enhance-style-v2';
  const norm=s=>String(s||'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').trim();
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function css(){
    if(document.getElementById(STYLE_ID))return;
    document.getElementById('ve-isamaya-enhance-style-v1')?.remove();
    const st=document.createElement('style');st.id=STYLE_ID;st.textContent=`
      /* Keep only the ISAMAYA-inspired falling product motion. */
      .ve-stage.ve-drop-stage{height:630px;overflow:visible}.ve-drop-stage .ve-stage-orb{opacity:.48}
      .ve-drop-item{position:absolute;display:block;text-decoration:none;z-index:2;opacity:0;transform:translate3d(0,-115vh,0) rotate(var(--ve-r0,-8deg)) scale(.82);animation:veProductDrop 1.35s cubic-bezier(.17,.84,.27,1.02) forwards;animation-delay:var(--ve-delay,0s);will-change:transform,opacity;background:transparent!important;box-shadow:none!important}
      .ve-drop-item img{width:100%;height:100%;object-fit:contain;background:transparent!important;mix-blend-mode:multiply;filter:drop-shadow(0 24px 25px rgba(0,0,0,.17));transition:transform .35s ease}
      .ve-drop-item:hover img{transform:translateY(-7px) scale(1.03)}
      .ve-drop-tag{position:absolute;left:50%;bottom:-15px;transform:translateX(-50%);white-space:nowrap;background:rgba(244,242,235,.88);backdrop-filter:blur(9px);padding:7px 9px;border:1px solid rgba(0,0,0,.10);font:700 8px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.08em;text-transform:uppercase;color:#242424}
      @keyframes veProductDrop{0%{opacity:0;transform:translate3d(0,-115vh,0) rotate(var(--ve-r0,-8deg)) scale(.82)}68%{opacity:1;transform:translate3d(0,16px,0) rotate(var(--ve-r1,2deg)) scale(1.025)}84%{transform:translate3d(0,-7px,0) rotate(var(--ve-r2,-1deg)) scale(.995)}100%{opacity:1;transform:translate3d(0,0,0) rotate(0) scale(1)}}
      .ve-product-media{background:#ebe9e3!important}.ve-product-media:before{display:none!important}.ve-product-media img{mix-blend-mode:multiply;background:transparent!important;width:88%!important;height:88%!important}
      .ve-feature-media,.ve-mini{background:#dcd9d2!important}.ve-feature-media img,.ve-mini img{mix-blend-mode:multiply;background:transparent!important}
      @media(max-width:980px){.ve-stage.ve-drop-stage{height:520px}}
      @media(max-width:620px){.ve-stage.ve-drop-stage{height:470px}.ve-drop-tag{display:none}}
      @media(prefers-reduced-motion:reduce){.ve-drop-item{animation:none!important;opacity:1!important;transform:none!important}}
    `;document.head.appendChild(st);
  }

  function catalog(){
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      const rows=Array.isArray(c?.p)?c.p:[];
      return rows.filter(p=>p&&p.slug&&p.name&&p.image_url&&p.is_active!==false);
    }catch{return[]}
  }
  function catMatch(p,c){const pc=norm(p.category),sc=norm(p.subcategory),nc=norm(c);return pc===nc||sc===nc||pc.includes(nc)||nc.includes(pc)}
  function choose(rows,cats,count){
    const out=[],used=new Set();
    for(const c of cats){const p=rows.find(x=>!used.has(x.slug)&&catMatch(x,c));if(p){out.push(p);used.add(p.slug);if(out.length>=count)return out}}
    for(const p of rows){if(used.has(p.slug))continue;out.push(p);used.add(p.slug);if(out.length>=count)break}
    return out;
  }

  function productDrop(root,rows){
    const stage=root.querySelector('.ve-stage');if(!stage||stage.dataset.veDrops==='2')return;
    const picks=choose(rows,['Fitness','Wellness','Beauty Tech','Kids & Baby','Pets','Tech','Home','Fashion'],7);if(picks.length<4)return;
    stage.dataset.veDrops='2';stage.classList.add('ve-drop-stage');stage.querySelectorAll('.ve-float,.ve-drop-item').forEach(x=>x.remove());
    const positions=[
      ['8%','10%','24%','34%','-.12s','-10deg','3deg','-2deg'],['39%','4%','25%','39%','.08s','9deg','-2deg','1deg'],['72%','9%','21%','31%','.25s','-8deg','2deg','-1deg'],['4%','54%','19%','29%','.38s','7deg','-2deg','1deg'],['30%','55%','21%','31%','.52s','-9deg','3deg','-1deg'],['57%','52%','20%','30%','.68s','10deg','-2deg','1deg'],['79%','57%','18%','27%','.82s','-7deg','2deg','-1deg']
    ];
    picks.forEach((p,i)=>{const a=document.createElement('a'),pos=positions[i%positions.length];a.className='ve-drop-item';a.href='/product/'+encodeURIComponent(p.slug)+'/';a.style.left=pos[0];a.style.top=pos[1];a.style.width=pos[2];a.style.height=pos[3];a.style.setProperty('--ve-delay',pos[4]);a.style.setProperty('--ve-r0',pos[5]);a.style.setProperty('--ve-r1',pos[6]);a.style.setProperty('--ve-r2',pos[7]);a.innerHTML=`<img src="${esc(p.image_url)}" alt="${esc((p.brand?`${p.brand} `:'')+p.name)}"><span class="ve-drop-tag">${esc(p.category||p.brand||'VYRDICT')}</span>`;stage.appendChild(a)});
  }

  function enhance(){
    const root=document.getElementById('vyrdict-editorial-home');if(!root)return false;css();
    /* Clean up the old duplicate utility nav/search if an older cached V1 ran. */
    document.getElementById('ve-utility-nav')?.remove();
    document.getElementById('ve-product-search-modal')?.remove();
    const rows=catalog();if(rows.length>=7)productDrop(root,rows);return true;
  }

  let tries=0;const timer=setInterval(()=>{tries++;const ok=enhance();if((ok&&catalog().length>=7)||tries>35)clearInterval(timer)},200);
  enhance();
  const host=document.getElementById('app')||document.body;new MutationObserver(()=>{if(document.getElementById('vyrdict-editorial-home'))enhance()}).observe(host,{childList:true,subtree:false});
})();