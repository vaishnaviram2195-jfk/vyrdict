(()=>{
  if(window.__vyrdictProductNavMarketV2)return;
  window.__vyrdictProductNavMarketV2=1;

  const DETAIL='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-product-detail';
  const STYLE_ID='vyrdict-product-nav-market-style-v2';
  const PANEL_CLASS='vyrdict-market-links-v2';
  const HOME_CLASS='vyrdict-product-home-v2';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const onProduct=()=>/^\/product\/[^/]+\/?$/i.test(location.pathname||'');
  const slug=()=>decodeURIComponent((location.pathname||'').match(/^\/product\/([^/?#]+)/i)?.[1]||'');

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .${HOME_CLASS}{display:inline-flex;align-items:center;gap:7px;width:max-content;margin:0 0 14px;padding:8px 12px;border:1px solid rgba(23,21,17,.18);border-radius:999px;background:#fffdf8;color:#171511;text-decoration:none;font:900 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;cursor:pointer}
      .${HOME_CLASS}:hover{border-color:rgba(23,21,17,.42)}
      .${PANEL_CLASS}{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:14px 0 4px}
      .${PANEL_CLASS} .vyrdict-market{border:1px solid rgba(23,21,17,.14);border-radius:16px;padding:12px;background:#fffdf8;min-width:0}
      .${PANEL_CLASS} .vyrdict-market-label{font:900 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6d675f;margin:0 0 8px}
      .${PANEL_CLASS} .vyrdict-market-list{display:flex;flex-direction:column;gap:7px}
      .${PANEL_CLASS} a{display:inline-flex;align-items:center;justify-content:space-between;gap:8px;max-width:100%;padding:10px 12px;border-radius:999px;background:#171511;color:#fff;text-decoration:none;font:800 10px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.025em}
      .${PANEL_CLASS} a span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .${PANEL_CLASS} .vyrdict-market-missing{font:700 10px/1.35 Arial,Helvetica,sans-serif;color:#857a70;margin:0 0 2px}
      .${PANEL_CLASS} a.vyrdict-market-search{background:transparent;color:#171511;border:1px solid rgba(23,21,17,.28)}
      .${PANEL_CLASS} a.vyrdict-market-search:hover{border-color:rgba(23,21,17,.58)}
      @media(max-width:600px){.${PANEL_CLASS}{grid-template-columns:1fr}.${HOME_CLASS}{margin-bottom:12px}}
    `;document.head.appendChild(s)
  }

  function homeLink(){
    if(!onProduct())return;
    style();
    document.querySelector('.vyrdict-product-home-v1')?.remove();
    if(document.querySelector('.'+HOME_CLASS))return;
    const host=document.querySelector('.productHero .info')||document.querySelector('.productHero')||document.querySelector('#app main')||document.getElementById('app');
    if(!host)return;
    const a=document.createElement('a');a.href='/';a.className=HOME_CLASS;a.dataset.vyrdictHome='1';a.setAttribute('aria-label','Home');a.textContent='← Home';
    host.prepend(a);
  }

  function currentProduct(){
    const s=slug();if(!s)return null;
    try{if(typeof S!=='undefined'&&Array.isArray(S.p)){const p=S.p.find(x=>String(x?.slug||'')===s);if(p)return p}}catch{}
    return null;
  }

  function productId(){
    const p=currentProduct();if(p?.id)return Number(p.id);
    const el=document.querySelector('[data-product-id]');const n=Number(el?.dataset?.productId);return Number.isFinite(n)&&n>0?n:null;
  }

  function productMeta(){
    const p=currentProduct();
    if(p)return {brand:String(p.brand||'').trim(),name:String(p.name||'').trim()};
    const name=document.querySelector('.productHero .info > h1,.productHero h1')?.textContent?.trim()||slug().replace(/-/g,' ');
    const brand=document.querySelector('.productHero .brand,.productHero .eyebrow')?.textContent?.trim()||'';
    return {brand,name};
  }

  async function detail(id){
    if(typeof window.vyrdictGetProductDetail==='function')return window.vyrdictGetProductDetail(id);
    const r=await fetch(`${DETAIL}?id=${encodeURIComponent(id)}`,{cache:'no-store'});if(!r.ok)throw new Error('detail '+r.status);return r.json();
  }

  function validUrl(r){
    const u=(r?.affiliate_status==='active'&&r?.affiliate_url)||r?.retailer_url||'';
    return /^https:\/\//i.test(String(u))?String(u):'';
  }

  function marketName(code){return code==='US'?'United States':'Canada'}
  function marketSearchUrl(code){
    const p=productMeta();
    const place=code==='US'?'United States':'Canada';
    const q=[p.brand,p.name,'buy',place].filter(Boolean).join(' ');
    return `https://www.google.com/search?tbm=shop&gl=${code==='US'?'us':'ca'}&q=${encodeURIComponent(q)}`;
  }

  function renderMarket(buy,rows){
    buy.querySelector('.vyrdict-market-links-v1')?.remove();
    buy.querySelector('.'+PANEL_CLASS)?.remove();
    const panel=document.createElement('div');panel.className=PANEL_CLASS;panel.dataset.vyrdictMarketPanel='1';
    for(const code of ['US','CA']){
      const box=document.createElement('div');box.className='vyrdict-market';
      const label=document.createElement('div');label.className='vyrdict-market-label';label.textContent=marketName(code);
      const list=document.createElement('div');list.className='vyrdict-market-list';
      const seen=new Set();const market=rows.filter(r=>r?.is_active!==false&&String(r?.country_code||'').toUpperCase()===code&&validUrl(r)).filter(r=>{const u=validUrl(r);if(seen.has(u))return false;seen.add(u);return true});
      if(market.length){
        market.slice(0,3).forEach(r=>{const a=document.createElement('a');a.href=validUrl(r);a.target='_blank';a.rel='noopener sponsored';const left=document.createElement('span');left.textContent=String(r.retailer_name||'Shop');const arrow=document.createElement('span');arrow.textContent='↗';a.append(left,arrow);list.appendChild(a)})
      }else{
        const m=document.createElement('div');m.className='vyrdict-market-missing';m.textContent='No verified direct retailer yet.';list.appendChild(m);
        const a=document.createElement('a');a.className='vyrdict-market-search';a.href=marketSearchUrl(code);a.target='_blank';a.rel='noopener';const left=document.createElement('span');left.textContent='Search current availability';const arrow=document.createElement('span');arrow.textContent='↗';a.append(left,arrow);list.appendChild(a)
      }
      box.append(label,list);panel.appendChild(box)
    }
    buy.prepend(panel)
  }

  let requestKey='';
  async function marketLinks(){
    if(!onProduct())return;
    const buy=document.querySelector('#where-to-buy');if(!buy)return;
    const id=productId();if(!id)return;
    const key=slug()+':'+id;if(requestKey===key&&buy.querySelector('.'+PANEL_CLASS))return;requestKey=key;
    try{const d=await detail(id);if(!onProduct()||productId()!==id)return;renderMarket(buy,Array.isArray(d?.retailers)?d.retailers:[])}catch{requestKey=''}
  }

  function hrefProduct(target){
    const a=target?.closest?.('a[href]');if(!a)return '';
    try{const u=new URL(a.href,location.href);return u.origin===location.origin&&/^\/product\/[^/]+\/?$/i.test(u.pathname)?u.pathname:''}catch{return ''}
  }

  document.addEventListener('click',e=>{
    const t=e.target;if(!(t instanceof Element))return;
    const home=t.closest('[data-vyrdict-home="1"]');
    if(home){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();location.replace('/');return}
    const c=t.closest('a,button,[role="button"]');if(!c)return;
    const text=norm(c.textContent||c.getAttribute('aria-label')||'');
    if(text==='back to product'||text==='return to product'){
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      if(history.length>1){history.back();return}
      const p=hrefProduct(c);if(p)location.replace(p)
    }
  },true);

  function apply(){if(!onProduct())return;homeLink();marketLinks()}
  function schedule(){[0,80,250,700,1500].forEach(ms=>setTimeout(apply,ms))}
  const observe=()=>{const app=document.getElementById('app')||document.body;if(!app)return;new MutationObserver(()=>{clearTimeout(window.__vyrdictProductNavMarketTimer);window.__vyrdictProductNavMarketTimer=setTimeout(apply,60)}).observe(app,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{schedule();observe()},{once:true});else{schedule();observe()}
  addEventListener('popstate',()=>{requestKey='';schedule()});addEventListener('pageshow',schedule);
})();
