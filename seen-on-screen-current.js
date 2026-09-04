(()=>{
  const API='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-seen-on-screen';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  function section(){const h=[...document.querySelectorAll('h1,h2,h3,h4')].find(x=>norm(x.textContent).includes('seen on screen'));return h?.closest('section')||h?.closest('.section')||null}
  function slugFrom(el){const a=el.matches?.('a[href*="/product/"]')?el:el.querySelector?.('a[href*="/product/"]');const href=decodeURIComponent(a?.getAttribute('href')||'');return href.match(/\/product\/([^/?#]+)/i)?.[1]||href.match(/#\/product\/([^?#]+)/i)?.[1]||''}
  function cards(sec){return [...sec.querySelectorAll('article,.card,a[href*="/product/"]')].filter((x,i,a)=>x.querySelector?.('img')&&a.findIndex(y=>y===x||y.contains(x))===i)}
  function rail(sec){return sec.querySelector('.rail')||cards(sec)[0]?.parentElement||null}
  async function current(){try{const r=await fetch(API,{cache:'no-store'});if(!r.ok)return[];const d=await r.json();if(Array.isArray(d.active_items))return d.active_items;return Array.isArray(d.items)?d.items.filter(x=>x?.screen?.active_feature===true):[]}catch{return[]}}
  function fixFallbackImage(card,item){if(!card||item?.screen?.screen_reference_url||!item?.image_url)return;const img=card.querySelector('img');if(!img)return;img.onerror=null;img.src=item.image_url;img.removeAttribute('srcset');img.loading='eager';img.style.objectFit='contain';img.style.objectPosition='center';img.alt=`${item.brand||''} ${item.name||''}`.trim()}
  async function clean(){const sec=section();if(!sec)return false;const items=await current();if(!items.length)return false;const want=new Set(items.map(x=>x.slug));const present=new Set(cards(sec).map(slugFrom).filter(Boolean));if(!items.every(x=>present.has(x.slug)))return false;
    const seen=new Set();for(const c of cards(sec)){const s=slugFrom(c);if(!s)continue;if(!want.has(s)||seen.has(s)){c.remove();continue}seen.add(s)}
    const r=rail(sec);if(r){for(const item of items){const c=cards(sec).find(x=>slugFrom(x)===item.slug);if(c){fixFallbackImage(c,item);if(c.parentElement===r)r.appendChild(c)}}}
    sec.dataset.vyrdictCurrentScreen='1';return true}
  function schedule(){let tries=0;const tick=async()=>{tries++;if(await clean()||tries>=30)return;setTimeout(tick,180)};setTimeout(tick,180)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',()=>setTimeout(schedule,80));addEventListener('hashchange',()=>setTimeout(schedule,80));
})();
