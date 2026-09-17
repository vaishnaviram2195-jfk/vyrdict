(()=>{
  if(window.__vyrdictStoriesV4)return;
  window.__vyrdictStoriesV4=1;

  const ID='vyrdict-editorial-now';
  const STYLE_ID='vyrdict-stories-style-v4';
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
#${ID}{background:#f4ede5;padding:14px 20px 23px;box-sizing:border-box}
#${ID} .v-story-strip{width:min(1160px,100%);margin:0 auto;border-top:1px solid rgba(23,21,17,.2);border-bottom:1px solid rgba(23,21,17,.14);padding:18px 0;display:grid;grid-template-columns:176px minmax(0,1fr);gap:26px;align-items:center}
#${ID} .v-story-brand{align-self:stretch;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(23,21,17,.14);padding-right:22px}
#${ID} .v-story-kicker{margin:0 0 8px;font:950 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#d95070}
#${ID} .v-story-brand h2{margin:0;font:500 29px/.98 Georgia,'Times New Roman',serif;letter-spacing:-.04em;color:#171511}
#${ID} .v-story-row{display:grid;grid-template-columns:180px minmax(0,1fr) minmax(250px,.62fr);gap:22px;align-items:center;min-width:0}
#${ID} .v-story-image{display:block;width:180px;height:118px;object-fit:cover;background:#e7ded4}
#${ID} .v-story-main{min-width:0}
#${ID} .v-story-meta{margin:0 0 8px;font:900 8px/1.25 Arial,Helvetica,sans-serif;letter-spacing:.095em;text-transform:uppercase;color:#817970;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${ID} .v-story-title{margin:0;font:500 clamp(25px,2.55vw,34px)/1.03 Georgia,'Times New Roman',serif;letter-spacing:-.037em;color:#171511}
#${ID} .v-story-action{display:inline-flex;margin-top:10px;color:#171511;text-decoration:none;border-bottom:1px solid rgba(23,21,17,.38);padding-bottom:2px;font:900 8px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.085em;text-transform:uppercase}
#${ID} .v-story-action:hover{opacity:.62}
#${ID} .v-story-more{border-left:1px solid rgba(23,21,17,.14);padding-left:20px;display:grid;gap:10px;min-width:0}
#${ID} .v-story-more-label{font:950 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09991}
#${ID} .v-story-mini{display:block;color:#171511;text-decoration:none;font:600 13px/1.35 Arial,Helvetica,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${ID} .v-story-mini:hover{text-decoration:underline;text-underline-offset:2px}
#${ID} .v-story-row.is-solo{grid-template-columns:180px minmax(0,1fr)}
@media(max-width:900px){
  #${ID} .v-story-strip{grid-template-columns:150px minmax(0,1fr);gap:20px}
  #${ID} .v-story-brand h2{font-size:25px}
  #${ID} .v-story-row,#${ID} .v-story-row.is-solo{grid-template-columns:150px minmax(0,1fr)}
  #${ID} .v-story-image{width:150px;height:100px}
  #${ID} .v-story-more{display:none}
  #${ID} .v-story-title{font-size:25px}
}
@media(max-width:640px){
  #${ID}{padding:9px 14px 15px}
  #${ID} .v-story-strip{display:block;padding:14px 0}
  #${ID} .v-story-brand{border-right:0;padding:0 0 11px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:12px}
  #${ID} .v-story-kicker{margin:0;font-size:7px}
  #${ID} .v-story-brand h2{font-size:22px}
  #${ID} .v-story-row,#${ID} .v-story-row.is-solo{grid-template-columns:118px minmax(0,1fr);gap:14px}
  #${ID} .v-story-image{width:118px;height:84px}
  #${ID} .v-story-meta{font-size:7px;margin-bottom:6px}
  #${ID} .v-story-title{font-size:21px;line-height:1.04;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  #${ID} .v-story-action{font-size:7px;margin-top:7px}
}
`;
    document.head.appendChild(style);
  }

  function dateLabel(value){
    try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'America/Toronto'}).format(new Date(value)).toUpperCase()}catch{return ''}
  }

  function meta(story){
    return [story.category,dateLabel(story.published_at)].filter(Boolean).join(' · ');
  }

  function href(story){return story.instagram_url||story.source_url||''}

  function markup(){
    const lead=stories[0]||FALLBACK[0];
    const rest=stories.slice(1,4);
    const leadUrl=href(lead);
    const action=leadUrl?`<a class="v-story-action" data-vyrdict-story="${esc(lead.slug)}" href="${esc(leadUrl)}" target="_blank" rel="noopener noreferrer">Read story ↗</a>`:'';
    const more=rest.length?`<div class="v-story-more" aria-label="More VYRDICT stories"><div class="v-story-more-label">Also trending</div>${rest.map(s=>{const u=href(s);const body=esc(s.headline);return u?`<a class="v-story-mini" data-vyrdict-story="${esc(s.slug)}" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${body}</a>`:`<span class="v-story-mini">${body}</span>`}).join('')}</div>`:'';
    return `<div class="v-story-strip">
      <div class="v-story-brand"><p class="v-story-kicker">THE INTERNET, EDITED</p><h2>VYRDICT Stories</h2></div>
      <div class="v-story-row ${rest.length?'':'is-solo'}">
        <img class="v-story-image" src="${esc(lead.image_url)}" alt="${esc(lead.image_alt||lead.headline)}" loading="eager" decoding="async">
        <div class="v-story-main"><div class="v-story-meta">${esc(meta(lead))}</div><h3 class="v-story-title">${esc(lead.headline)}</h3>${action}</div>
        ${more}
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
