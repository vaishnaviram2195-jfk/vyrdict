(()=>{
  if(window.__vyrdictAffiliateRoutingV1)return;
  window.__vyrdictAffiliateRoutingV1=1;

  const DETAIL='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-product-detail';
  const DISCLOSURE_ID='vyrdict-affiliate-disclosure';
  const STYLE_ID='vyrdict-affiliate-style';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  const slug=()=>{
    const m=decodeURIComponent(location.pathname||'').match(/^\/product\/([^/?#]+)/i);
    return m?m[1]:'';
  };
  const validHttp=u=>{try{const x=new URL(String(u||''),location.origin);return /^https?:$/.test(x.protocol)}catch{return false}};
  const urlKey=u=>{try{const x=new URL(String(u||''));x.hash='';return (x.origin+x.pathname).replace(/\/$/,'').toLowerCase()}catch{return String(u||'').replace(/\/$/,'').toLowerCase()}};

  function productId(s){
    try{
      const p=window.__VYRDICT_BOOT_DATA?.p?.find?.(x=>String(x.slug||'')===s)||
              (Array.isArray(window.S?.p)?window.S.p.find(x=>String(x.slug||'')===s):null);
      return Number(p?.id)||0;
    }catch{return 0}
  }

  async function getDetail(id){
    if(!id)return null;
    try{
      if(typeof window.vyrdictGetProductDetail==='function')return await window.vyrdictGetProductDetail(id);
      const r=await fetch(`${DETAIL}?id=${encodeURIComponent(id)}`,{cache:'default'});
      if(!r.ok)return null;
      return await r.json();
    }catch{return null}
  }

  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const st=document.createElement('style');st.id=STYLE_ID;
    st.textContent=`#${DISCLOSURE_ID}{margin:12px 0 0;padding:10px 12px;border:1px solid var(--line,#d8cec4);border-radius:12px;background:#f8f3ed;color:#6d675f;font:500 10px/1.5 Arial,Helvetica,sans-serif}#${DISCLOSURE_ID} b{color:#171511;font-weight:900}`;
    document.head?.appendChild(st);
  }

  function ensureDisclosure(block){
    if(!block||document.getElementById(DISCLOSURE_ID))return;
    ensureStyle();
    const box=document.createElement('div');box.id=DISCLOSURE_ID;
    box.innerHTML='<b>Affiliate disclosure:</b> VYRDICT may earn a commission when you buy through retailer links. This never influences our scores or verdicts.';
    const list=block.querySelector('.retailers');
    if(list)list.insertAdjacentElement('afterend',box);else block.appendChild(box);
  }

  function activeRows(data){
    return (Array.isArray(data?.retailers)?data.retailers:[]).filter(r=>
      String(r?.affiliate_status||'').toLowerCase()==='active'&&validHttp(r?.affiliate_url)
    );
  }

  function chooseLinks(row,links){
    const normal=urlKey(row.retailer_url);
    let hits=links.filter(a=>urlKey(a.dataset.vyrdictOriginalHref||a.getAttribute('href')||a.href)===normal);
    if(hits.length)return hits;
    const rn=norm(row.retailer_name),country=String(row.country_code||'').toUpperCase();
    hits=links.filter(a=>{
      const ac=String(a.dataset.country||'').toUpperCase();
      const text=norm(a.querySelector('span')?.childNodes?.[0]?.textContent||a.textContent||'');
      return (!country||!ac||ac==='GLOBAL'||ac===country)&&rn&&text.includes(rn);
    });
    return hits.slice(0,1);
  }

  function routeLinks(block,data){
    const links=[...block.querySelectorAll('a.retailer')];
    if(!links.length)return;
    for(const row of activeRows(data)){
      for(const a of chooseLinks(row,links)){
        if(!a.dataset.vyrdictOriginalHref)a.dataset.vyrdictOriginalHref=row.retailer_url||a.getAttribute('href')||'';
        a.href=row.affiliate_url;
        a.dataset.vyrdictAffiliate='1';
        a.dataset.vyrdictAffiliateNetwork=String(row.affiliate_network||'');
        a.dataset.vyrdictAffiliateProgram=String(row.affiliate_program||'');
        const rel=new Set(String(a.rel||'').split(/\s+/).filter(Boolean));
        rel.add('sponsored');rel.add('noopener');rel.add('noreferrer');
        a.rel=[...rel].join(' ');
      }
    }
  }

  let runToken=0;
  async function apply(){
    const s=slug();if(!s)return;
    const block=document.getElementById('where-to-buy');if(!block)return;
    ensureDisclosure(block);
    const id=productId(s);if(!id)return;
    const token=++runToken;
    const data=await getDetail(id);
    if(token!==runToken||slug()!==s||!data)return;
    routeLinks(block,data);
  }

  function schedule(){[0,120,450,1000,1800,3200].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('pageshow',schedule);
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',e=>{if(e.target?.closest?.('[data-product],.geo-choice'))setTimeout(schedule,30)},{capture:true,passive:true});
  setInterval(()=>{if(slug())apply()},2000);
})();
