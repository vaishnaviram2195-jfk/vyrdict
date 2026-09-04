(()=>{
  const API='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-male-balance';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  let dataPromise;
  function data(){return dataPromise||(dataPromise=fetch(API,{cache:'no-store'}).then(r=>r.ok?r.json():{items:[]}).catch(()=>({items:[]})))}
  function sectionFor(category){const want=norm(category);const h=[...document.querySelectorAll('h1,h2,h3,h4,.category')].find(x=>norm(x.textContent)===want);return h?.closest('section')||h?.closest('.section')||null}
  function hrefSlug(el){const a=el.matches?.('a[href*="#/product/"]')?el:el.querySelector?.('a[href*="#/product/"]');const m=decodeURIComponent(a?.getAttribute('href')||'').match(/#\/product\/([^?#]+)/i);return m?.[1]||''}
  function cards(sec){return [...sec.querySelectorAll('a[href*="#/product/"],article,.card')].filter((x,i,a)=>x.querySelector?.('img')&&a.findIndex(y=>y===x||y.contains(x))===i)}
  function findCard(sec,item){return [...sec.querySelectorAll('a[href*="#/product/"]')].some(a=>hrefSlug(a)===item.slug)}
  function replaceText(root,oldItem,item){const pairs=[[oldItem?.name,item.name],[oldItem?.brand,item.brand],[String(oldItem?.viral_score??''),String(item.viral_score??'')],[String(oldItem?.worth_score??''),String(item.worth_score??'')],[oldItem?.verdict,item.verdict]].filter(x=>x[0]&&x[0]!==x[1]);const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){let t=n.nodeValue||'';for(const [a,b] of pairs)t=t.split(String(a)).join(String(b||''));n.nodeValue=t}}
  function append(sec,item,items){if(!sec||findCard(sec,item))return;const rail=sec.querySelector('.rail')||cards(sec)[0]?.parentElement;if(!rail)return;const existing=cards(sec);const template=[...existing].reverse().find(c=>hrefSlug(c));if(!template)return;const old=items.find(x=>x.slug===hrefSlug(template));const clone=template.cloneNode(true);replaceText(clone,old,item);clone.querySelectorAll('a[href*="#/product/"]').forEach(a=>a.setAttribute('href',`#/product/${item.slug}`));if(clone.matches?.('a[href*="#/product/"]'))clone.setAttribute('href',`#/product/${item.slug}`);clone.querySelectorAll('[data-save]').forEach(x=>x.dataset.save=String(item.id));const img=clone.querySelector('img');if(img&&item.image_url){img.src=item.image_url;img.removeAttribute('srcset');img.alt=`${item.brand} ${item.name}`;img.style.objectFit='contain'}clone.dataset.vyrdictInclusive='1';rail.appendChild(clone)}
  async function apply(){const d=await data();const items=Array.isArray(d.items)?d.items:[];if(!items.length)return;for(const item of items){append(sectionFor(item.category),item,items)}}
  function schedule(){[60,220,500,900,1500].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('hashchange',()=>setTimeout(schedule,60));addEventListener('popstate',()=>setTimeout(schedule,60));
})();
(()=>{if(document.getElementById('vyrdict-current-screen-loader'))return;const s=document.createElement('script');s.id='vyrdict-current-screen-loader';s.src='/seen-on-screen-current.js?v=1';s.defer=true;document.head.appendChild(s)})();
