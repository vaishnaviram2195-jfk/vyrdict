(()=>{
  if(window.__vyrdictHomepageNewsDeskV3)return;
  window.__vyrdictHomepageNewsDeskV3=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const ID='ve-news-desk';
  const failedImages=new Set();
  let latestRows=[],latestDailyPick=null;
  const storyKey=x=>String(x?.slug||x?.id||x?.image_url||'');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function style(){
    document.getElementById('ve-news-desk-style')?.remove();
    const s=document.createElement('style');s.id='ve-news-desk-style';s.textContent=`
      #${ID}{background:#f7f5ef;color:#171717;padding:46px 0 54px;border-top:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12)}
      #${ID} *{box-sizing:border-box} #${ID} a{color:inherit;text-decoration:none}
      .ve-news-wrap{width:min(1360px,calc(100% - 64px));margin:0 auto}
      .ve-news-head{display:flex;justify-content:space-between;align-items:flex-end;gap:22px;padding-bottom:16px;border-bottom:1px solid rgba(0,0,0,.22);margin-bottom:20px}
      .ve-news-kicker{font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.17em;text-transform:uppercase;color:#6b6963;margin-bottom:8px}
      .ve-news-head h2{font:400 clamp(34px,3.5vw,48px)/.98 var(--ve-serif,Georgia,serif);letter-spacing:-.042em;margin:0}
      .ve-news-head p{font:400 13px/1.5 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);color:#66625c;max-width:390px;margin:0}
      .ve-news-grid{display:grid;grid-template-columns:minmax(190px,.68fr) minmax(0,1.55fr) minmax(260px,.82fr);gap:18px;align-items:start}.ve-news-grid.solo{grid-template-columns:1fr}
      .ve-news-secondary{border-right:1px solid rgba(0,0,0,.16);padding-right:18px}.ve-news-secondary img{width:100%;aspect-ratio:.82;object-fit:cover;display:block;background:#e7e4de}
      .ve-news-meta{font:700 8px/1.2 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.13em;text-transform:uppercase;color:#74706a;margin:10px 0 6px}
      .ve-news-secondary h3{font:400 clamp(22px,1.8vw,30px)/1.04 var(--ve-serif,Georgia,serif);letter-spacing:-.03em;margin:0}
      .ve-news-lead{padding:0 2px}.ve-news-lead img{width:100%;aspect-ratio:1.24;object-fit:cover;display:block;background:#e5e2dc}.ve-news-lead h3{font:400 clamp(30px,3vw,44px)/1 var(--ve-serif,Georgia,serif);letter-spacing:-.038em;margin:0 0 8px}.ve-news-dek{font:400 13px/1.55 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);color:#625f59;max-width:760px;margin:0}
      .ve-news-rail{border-left:1px solid rgba(0,0,0,.16);padding-left:18px}.ve-news-rail-title{font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.15em;text-transform:uppercase;padding:2px 0 8px;border-bottom:1px solid rgba(0,0,0,.2)}
      .ve-news-item{display:grid;grid-template-columns:1fr 72px;gap:12px;align-items:center;padding:11px 0;border-bottom:1px solid rgba(0,0,0,.14)}.ve-news-item img{width:72px;height:76px;object-fit:cover;background:#e6e3dd}.ve-news-item .ve-news-meta{margin:0 0 5px}.ve-news-item h4{font:500 13.5px/1.25 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);margin:0}
      #${ID} a:hover h3,#${ID} a:hover h4{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
      @media(max-width:980px){.ve-news-wrap{width:min(100% - 36px,900px)}.ve-news-grid:not(.solo){grid-template-columns:1fr 1fr;gap:16px}.ve-news-lead{grid-column:1/-1;grid-row:1}.ve-news-secondary{grid-column:1;grid-row:2;border-right:1px solid rgba(0,0,0,.16)}.ve-news-rail{grid-column:2;grid-row:2}}
      @media(max-width:640px){#${ID}{padding:36px 0 42px}.ve-news-wrap{width:calc(100% - 28px)}.ve-news-head{display:block;padding-bottom:14px;margin-bottom:18px}.ve-news-head p{margin-top:10px}.ve-news-head h2{font-size:36px}.ve-news-grid{display:flex;flex-direction:column;gap:22px}.ve-news-lead{order:1}.ve-news-secondary{order:2;border-right:0;padding-right:0;width:100%}.ve-news-secondary img{aspect-ratio:1.12}.ve-news-rail{order:3;border-left:0;padding-left:0;width:100%}.ve-news-item{grid-template-columns:1fr 76px;padding:10px 0}.ve-news-item img{width:76px;height:76px}.ve-news-lead img{aspect-ratio:1.08}.ve-news-lead h3{font-size:clamp(29px,8.5vw,38px)}}
    `;document.head.appendChild(s);
  }

  function linkFor(x){return x?.source_url||x?.instagram_url||'#'}
  function attrs(x){const href=linkFor(x);return href==='#'?'href="#" aria-disabled="true"':`href="${esc(href)}" target="_blank" rel="noopener noreferrer"`}
  function validStories(rows){
    const now=Date.now(),maxAge=7*86400000;
    return (Array.isArray(rows)?rows:[])
      .filter(x=>x&&x.headline&&x.image_url&&!/^data:image/i.test(x.image_url)&&!failedImages.has(storyKey(x))&&!/llbean\.com\/llb\/shop\//i.test(x.image_url)&&now-Date.parse(x.published_at||0)<=maxAge)
      .sort((a,b)=>Date.parse(b.published_at||0)-Date.parse(a.published_at||0));
  }

  function render(rows,dailyPick){
    const root=document.getElementById(ROOT);if(!root)return false;
    const motion=root.querySelector('.ve-motion');if(!motion)return false;
    const stories=validStories(rows);if(!stories.length){document.getElementById(ID)?.remove();return false}
    const lead=(dailyPick&&stories.find(x=>x.id===dailyPick.id))||stories[0];
    const rest=stories.filter(x=>x!==lead);
    const secondary=rest[0]||null,rail=rest.slice(1,5);
    let sec=document.getElementById(ID);if(!sec){sec=document.createElement('section');sec.id=ID;motion.insertAdjacentElement('afterend',sec)}
    const secondaryHtml=secondary?`<a class="ve-news-secondary" ${attrs(secondary)}><img loading="lazy" decoding="async" data-vyrdict-no-placeholder="1" data-story-key="${esc(storyKey(secondary))}" src="${esc(secondary.image_url)}" alt="${esc(secondary.image_alt||secondary.headline)}"><div class="ve-news-meta">${esc(secondary.category||'Culture')}</div><h3>${esc(secondary.headline)}</h3></a>`:'';
    const railHtml=rail.length?`<aside class="ve-news-rail"><div class="ve-news-rail-title">Latest</div>${rail.map(x=>`<a class="ve-news-item" ${attrs(x)}><div><div class="ve-news-meta">${esc(x.category||'Culture')}</div><h4>${esc(x.headline)}</h4></div><img loading="lazy" decoding="async" data-vyrdict-no-placeholder="1" data-story-key="${esc(storyKey(x))}" src="${esc(x.image_url)}" alt=""></a>`).join('')}</aside>`:'';
    sec.innerHTML=`<div class="ve-news-wrap"><div class="ve-news-head"><div><div class="ve-news-kicker">VYRDICT / CULTURE DESK</div><h2>The VYRDICT Desk.</h2></div><p>The launches, collaborations and internet moments shaping what people want next.</p></div><div class="ve-news-grid ${secondary?'':'solo'}">${secondaryHtml}<a class="ve-news-lead" ${attrs(lead)}><img loading="eager" decoding="async" fetchpriority="high" data-vyrdict-no-placeholder="1" data-story-key="${esc(storyKey(lead))}" src="${esc(lead.image_url)}" alt="${esc(lead.image_alt||lead.headline)}"><div class="ve-news-meta">${esc(lead.category||'Culture')}</div><h3>${esc(lead.headline)}</h3>${lead.dek?`<p class="ve-news-dek">${esc(lead.dek)}</p>`:''}</a>${railHtml}</div></div>`;
    sec.querySelectorAll('img[data-story-key]').forEach(img=>{
      img.addEventListener('error',()=>{
        const key=img.dataset.storyKey||'';
        if(key)failedImages.add(key);
        render(latestRows,latestDailyPick);
      },{once:true});
    });
    return true;
  }

  async function build(){
    style();
    try{
      const res=await fetch('/api/stories?limit=8',{headers:{accept:'application/json'},cache:'no-cache'});
      if(!res.ok)throw new Error('stories');
      const j=await res.json();
      latestRows=Array.isArray(j.stories)?j.stories:[];
      latestDailyPick=j.daily_pick||null;
      render(latestRows,latestDailyPick);
    }catch{
      document.getElementById(ID)?.remove();
    }
  }

  let tries=0;const wait=()=>{tries++;const r=document.getElementById(ROOT);if(r&&r.querySelector('.ve-motion'))build();else if(tries<30)setTimeout(wait,200)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
  addEventListener('pageshow',()=>setTimeout(wait,40));
})();
