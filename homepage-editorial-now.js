(()=>{
  if(window.__vyrdictStoriesV2)return;
  window.__vyrdictStoriesV2=1;

  const ID='vyrdict-editorial-now';
  const STYLE_ID='vyrdict-stories-style-v2';
  const FEED='/api/stories?limit=4';
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const FALLBACK=[{
    slug:'starbucks-snoopy-fall-2026',
    headline:'Starbucks just made Snoopy the main character of fall.',
    dek:'The Peanuts collection launched with 10 limited-edition collectibles, a purchase-limited hero cup and two themed drinks in the U.S. app — turning one merch drop into a full seasonal moment.',
    category:'Food & Drinks · Toys & Collectibles',
    image_url:'https://about.starbucks.com/uploads/2026/08/PeanutsMerchFall2026-01913-scaled.jpg',
    image_alt:'Starbucks and Peanuts fall collection with Snoopy merchandise and the Snoopy glass cold cup',
    source_label:'Starbucks',
    source_url:'https://about.starbucks.com/stories/2026/do-a-happy-dance-see-the-new-starbucks-peanuts-fall-collection-inspired-by-the-great-pumpkin-and-pumpkin-spice-latte/',
    published_at:'2026-09-15T16:00:00.000Z'
  }];

  let stories=FALLBACK;
  let loading=false;
  let loaded=false;
  let signature='';

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
#${ID}{background:#f4ede5;padding:18px 20px 34px;box-sizing:border-box}
#${ID} .v-stories-shell{width:min(1160px,100%);margin:0 auto;border-top:1px solid rgba(23,21,17,.22);padding-top:22px}
#${ID} .v-stories-head{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:22px}
#${ID} .v-stories-kicker{margin:0 0 8px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#d95070}
#${ID} .v-stories-head h2{margin:0;font:500 clamp(34px,4.2vw,52px)/.96 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#171511}
#${ID} .v-stories-head p{max-width:360px;margin:0 0 3px;font:12px/1.55 Arial,Helvetica,sans-serif;color:#746d65;text-align:right}
#${ID} .v-stories-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(300px,.75fr);gap:28px;align-items:start}
#${ID} .v-story-lead{min-width:0}
#${ID} .v-story-image{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#e7ded4}
#${ID} .v-story-meta{margin:15px 0 9px;font:900 9px/1.35 Arial,Helvetica,sans-serif;letter-spacing:.095em;text-transform:uppercase;color:#817970}
#${ID} .v-story-lead h3{margin:0;max-width:780px;font:500 clamp(31px,4vw,48px)/1 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#171511}
#${ID} .v-story-dek{margin:14px 0 0;max-width:770px;font:14px/1.65 Arial,Helvetica,sans-serif;color:#655e57}
#${ID} .v-story-source{display:inline-flex;align-items:center;margin-top:15px;color:#171511;text-decoration:none;border-bottom:1px solid rgba(23,21,17,.42);padding-bottom:2px;font:900 9px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.075em;text-transform:uppercase}
#${ID} .v-story-source:hover{opacity:.62}
#${ID} .v-story-side{border-top:1px solid rgba(23,21,17,.18)}
#${ID} .v-story-small{display:grid;grid-template-columns:112px minmax(0,1fr);gap:15px;padding:16px 0;border-bottom:1px solid rgba(23,21,17,.18);color:#171511;text-decoration:none;align-items:start}
#${ID} .v-story-small img{width:112px;height:86px;object-fit:cover;background:#e7ded4}
#${ID} .v-story-small .v-story-meta{margin:0 0 7px;font-size:8px}
#${ID} .v-story-small h3{margin:0;font:500 21px/1.08 Georgia,'Times New Roman',serif;letter-spacing:-.025em;color:#171511}
#${ID} .v-story-small:hover h3{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
#${ID} .v-stories-grid.is-solo{grid-template-columns:1fr}
#${ID} .v-stories-grid.is-solo .v-story-lead{display:grid;grid-template-columns:minmax(0,1.42fr) minmax(280px,.78fr);gap:30px;align-items:end}
#${ID} .v-stories-grid.is-solo .v-story-copy{padding:0 0 6px}
#${ID} .v-stories-grid.is-solo .v-story-image{aspect-ratio:16/10}
@media(max-width:860px){
  #${ID} .v-stories-grid{grid-template-columns:1fr;gap:24px}
  #${ID} .v-story-side{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;border-top:0}
  #${ID} .v-story-small{display:block;padding:0;border-bottom:0}
  #${ID} .v-story-small img{width:100%;height:auto;aspect-ratio:4/3;margin-bottom:10px}
  #${ID} .v-story-small h3{font-size:18px}
  #${ID} .v-stories-grid.is-solo .v-story-lead{grid-template-columns:1fr;gap:18px}
}
@media(max-width:640px){
  #${ID}{padding:12px 14px 25px}
  #${ID} .v-stories-shell{padding-top:18px}
  #${ID} .v-stories-head{display:block;margin-bottom:17px}
  #${ID} .v-stories-head h2{font-size:38px}
  #${ID} .v-stories-head p{display:none}
  #${ID} .v-story-image{aspect-ratio:4/3}
  #${ID} .v-story-meta{margin-top:12px}
  #${ID} .v-story-lead h3{font-size:34px;line-height:1.01}
  #${ID} .v-story-dek{font-size:14px;line-height:1.58}
  #${ID} .v-story-side{display:block;border-top:1px solid rgba(23,21,17,.18)}
  #${ID} .v-story-small{display:grid;grid-template-columns:104px minmax(0,1fr);gap:13px;padding:14px 0;border-bottom:1px solid rgba(23,21,17,.18)}
  #${ID} .v-story-small img{width:104px;height:80px;aspect-ratio:auto;margin:0}
  #${ID} .v-story-small h3{font-size:19px}
  #${ID} .v-stories-grid.is-solo .v-story-copy{padding:0}
}
`;
    document.head.appendChild(style);
  }

  function dateLabel(value){
    try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'America/Toronto'}).format(new Date(value)).toUpperCase()}catch{return ''}
  }

  function meta(story){
    const parts=[story.category,dateLabel(story.published_at)].filter(Boolean);
    return parts.join('  ·  ');
  }

  function href(story){return story.instagram_url||story.source_url||''}

  function leadMarkup(story){
    const source=story.source_url&&story.source_label?`<a class="v-story-source" data-vyrdict-story="${esc(story.slug)}" href="${esc(story.source_url)}" target="_blank" rel="noopener noreferrer">Source: ${esc(story.source_label)} ↗</a>`:'';
    return `<article class="v-story-lead">
      <img class="v-story-image" src="${esc(story.image_url)}" alt="${esc(story.image_alt||story.headline)}" loading="eager" decoding="async">
      <div class="v-story-copy">
        <div class="v-story-meta">${esc(meta(story))}</div>
        <h3>${esc(story.headline)}</h3>
        ${story.dek?`<p class="v-story-dek">${esc(story.dek)}</p>`:''}
        ${source}
      </div>
    </article>`;
  }

  function smallMarkup(story){
    const url=href(story);
    const body=`<img src="${esc(story.image_url)}" alt="${esc(story.image_alt||story.headline)}" loading="lazy" decoding="async"><div><div class="v-story-meta">${esc(meta(story))}</div><h3>${esc(story.headline)}</h3></div>`;
    return url?`<a class="v-story-small" data-vyrdict-story="${esc(story.slug)}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${body}</a>`:`<article class="v-story-small">${body}</article>`;
  }

  function markup(){
    const lead=stories[0]||FALLBACK[0];
    const rest=stories.slice(1,4);
    return `<div class="v-stories-shell">
      <header class="v-stories-head">
        <div><p class="v-stories-kicker">THE INTERNET, EDITED</p><h2>VYRDICT Stories</h2></div>
        <p>Fresh drops, collabs and culture moments worth knowing about right now.</p>
      </header>
      <div class="v-stories-grid ${rest.length?'':'is-solo'}">
        ${leadMarkup(lead)}
        ${rest.length?`<div class="v-story-side" aria-label="More VYRDICT stories">${rest.map(smallMarkup).join('')}</div>`:''}
      </div>
    </div>`;
  }

  function findViral(){
    return document.getElementById('viral')||[...document.querySelectorAll('section')].find(s=>/what.?s trending now/i.test(s.textContent||''))||null;
  }

  function mount(){
    if(!isHome()){
      document.getElementById(ID)?.remove();
      return true;
    }
    addStyle();
    const hero=document.querySelector('.hero');
    const viral=findViral();
    if(!hero&&!viral)return false;
    let section=document.getElementById(ID);
    if(!section){
      section=document.createElement('section');
      section.id=ID;
      section.className='vyrdict-stories';
      section.setAttribute('aria-label','VYRDICT Stories');
    }
    const nextSig=stories.map(s=>`${s.id||''}:${s.slug}:${s.published_at}`).join('|');
    if(signature!==nextSig||!section.innerHTML.trim()){
      signature=nextSig;
      section.innerHTML=markup();
    }
    if(hero){
      if(hero.nextElementSibling!==section)hero.insertAdjacentElement('afterend',section);
    }else if(viral?.parentNode){
      viral.parentNode.insertBefore(section,viral);
    }
    return true;
  }

  async function loadStories(){
    if(loading||loaded)return;
    loading=true;
    try{
      const r=await fetch(FEED,{cache:'no-store',headers:{accept:'application/json'}});
      if(!r.ok)throw new Error(`stories ${r.status}`);
      const d=await r.json();
      const rows=Array.isArray(d?.stories)?d.stories.filter(x=>x?.headline&&x?.image_url):[];
      if(rows.length)stories=rows.slice(0,4);
      loaded=true;
      signature='';
      mount();
      window.VYRDICT_STORIES=stories;
    }catch(e){
      loaded=true;
      window.VYRDICT_STORIES=stories;
    }finally{loading=false}
  }

  function boot(attempt=0){
    if(mount()){
      loadStories();
      return;
    }
    if(attempt>20)return;
    setTimeout(()=>boot(attempt+1),80);
  }

  let timer=0;
  const observer=new MutationObserver(()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>mount(),90);
  });

  document.addEventListener('click',e=>{
    const a=e.target.closest?.(`#${ID} [data-vyrdict-story]`);
    if(!a)return;
    try{window.VyrdictAnalytics?.send?.('story_open',{utm_content:a.dataset.vyrdictStory||null})}catch{}
  },{passive:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      boot();
      observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
    },{once:true});
  }else{
    boot();
    observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  }

  addEventListener('popstate',()=>setTimeout(boot,30));
  addEventListener('hashchange',()=>setTimeout(boot,30));
})();
