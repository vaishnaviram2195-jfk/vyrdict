(()=>{
  if(window.__vyrdictHomepageLayoutRestoreV1)return;
  window.__vyrdictHomepageLayoutRestoreV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const STORY_ID='ve-home-stories';
  const STYLE_ID='ve-home-stories-style';
  const FEED='/api/stories?limit=4';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const FALLBACK=[{
    slug:'starbucks-snoopy-fall-2026',
    headline:'Starbucks just made Snoopy the main character of fall.',
    category:'Food & Drinks · Toys & Collectibles',
    image_url:'https://about.starbucks.com/uploads/2026/08/PeanutsMerchFall2026-01913-scaled.jpg',
    image_alt:'Starbucks and Peanuts fall collection',
    source_url:'https://about.starbucks.com/stories/2026/do-a-happy-dance-see-the-new-starbucks-peanuts-fall-collection-inspired-by-the-great-pumpkin-and-pumpkin-spice-latte/',
    published_at:'2026-09-15T16:00:00.000Z'
  }];
  let stories=FALLBACK;
  let sig='';
  let timer=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
#${STORY_ID}{background:#f4ede5;padding:14px 20px 23px;box-sizing:border-box;display:block!important}
#${STORY_ID} *{box-sizing:border-box}
#${STORY_ID} .v-story-strip{width:min(1160px,100%);margin:0 auto;border-top:1px solid rgba(23,21,17,.2);border-bottom:1px solid rgba(23,21,17,.14);padding:18px 0;display:grid;grid-template-columns:176px minmax(0,1fr);gap:26px;align-items:center}
#${STORY_ID} .v-story-brand{align-self:stretch;display:flex;flex-direction:column;justify-content:center;border-right:1px solid rgba(23,21,17,.14);padding-right:22px}
#${STORY_ID} .v-story-kicker{margin:0 0 8px;font:950 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#d95070}
#${STORY_ID} .v-story-brand h2{margin:0;font:500 29px/.98 Georgia,'Times New Roman',serif;letter-spacing:-.04em;color:#171511}
#${STORY_ID} .v-story-row{display:grid;grid-template-columns:180px minmax(0,1fr) minmax(250px,.62fr);gap:22px;align-items:center;min-width:0}
#${STORY_ID} .v-story-image{display:block;width:180px;height:118px;object-fit:cover;background:#e7ded4}
#${STORY_ID} .v-story-main{min-width:0}
#${STORY_ID} .v-story-meta{margin:0 0 8px;font:900 8px/1.25 Arial,Helvetica,sans-serif;letter-spacing:.095em;text-transform:uppercase;color:#817970;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${STORY_ID} .v-story-title{margin:0;font:500 clamp(25px,2.55vw,34px)/1.03 Georgia,'Times New Roman',serif;letter-spacing:-.037em;color:#171511}
#${STORY_ID} .v-story-action{display:inline-flex;margin-top:10px;color:#171511;text-decoration:none;border-bottom:1px solid rgba(23,21,17,.38);padding-bottom:2px;font:900 8px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.085em;text-transform:uppercase}
#${STORY_ID} .v-story-action:hover{opacity:.62}
#${STORY_ID} .v-story-more{border-left:1px solid rgba(23,21,17,.14);padding-left:20px;display:grid;gap:10px;min-width:0}
#${STORY_ID} .v-story-more-label{font:950 7px/1 Arial,Helvetica,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a09991}
#${STORY_ID} .v-story-mini{display:block;color:#171511;text-decoration:none;font:600 13px/1.35 Arial,Helvetica,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#${STORY_ID} .v-story-mini:hover{text-decoration:underline;text-underline-offset:2px}
#${STORY_ID} .v-story-row.is-solo{grid-template-columns:180px minmax(0,1fr)}
#${ROOT} > .ve-worth{display:none!important}
@media(max-width:900px){#${STORY_ID} .v-story-strip{grid-template-columns:150px minmax(0,1fr);gap:20px}#${STORY_ID} .v-story-brand h2{font-size:25px}#${STORY_ID} .v-story-row,#${STORY_ID} .v-story-row.is-solo{grid-template-columns:150px minmax(0,1fr)}#${STORY_ID} .v-story-image{width:150px;height:100px}#${STORY_ID} .v-story-more{display:none}#${STORY_ID} .v-story-title{font-size:25px}}
@media(max-width:640px){#${STORY_ID}{padding:9px 14px 15px}#${STORY_ID} .v-story-strip{display:block;padding:14px 0}#${STORY_ID} .v-story-brand{border-right:0;padding:0 0 11px;display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:12px}#${STORY_ID} .v-story-kicker{margin:0;font-size:7px}#${STORY_ID} .v-story-brand h2{font-size:22px}#${STORY_ID} .v-story-row,#${STORY_ID} .v-story-row.is-solo{grid-template-columns:118px minmax(0,1fr);gap:14px}#${STORY_ID} .v-story-image{width:118px;height:84px}#${STORY_ID} .v-story-meta{font-size:7px;margin-bottom:6px}#${STORY_ID} .v-story-title{font-size:21px;line-height:1.04;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}#${STORY_ID} .v-story-action{font-size:7px;margin-top:7px}}
`;
    document.head.appendChild(s);
  }

  function dateLabel(value){
    try{return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',timeZone:'America/Toronto'}).format(new Date(value)).toUpperCase()}catch{return ''}
  }
  function meta(story){return [story.category,dateLabel(story.published_at)].filter(Boolean).join(' · ')}
  function href(story){return story.instagram_url||story.source_url||''}

  function markup(){
    const lead=stories[0]||FALLBACK[0];
    const rest=stories.slice(1,4);
    const leadUrl=href(lead);
    const action=leadUrl?`<a class="v-story-action" href="${esc(leadUrl)}" target="_blank" rel="noopener noreferrer">Read story ↗</a>`:'';
    const more=rest.length?`<div class="v-story-more" aria-label="More VYRDICT stories"><div class="v-story-more-label">Also trending</div>${rest.map(s=>{const u=href(s);return u?`<a class="v-story-mini" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(s.headline)}</a>`:`<span class="v-story-mini">${esc(s.headline)}</span>`}).join('')}</div>`:'';
    return `<div class="v-story-strip"><div class="v-story-brand"><p class="v-story-kicker">THE INTERNET, EDITED</p><h2>VYRDICT Stories</h2></div><div class="v-story-row ${rest.length?'':'is-solo'}"><img class="v-story-image" src="${esc(lead.image_url)}" alt="${esc(lead.image_alt||lead.headline)}" loading="eager" decoding="async"><div class="v-story-main"><div class="v-story-meta">${esc(meta(lead))}</div><h3 class="v-story-title">${esc(lead.headline)}</h3>${action}</div>${more}</div></div>`;
  }

  function ensureNews(){
    if(document.getElementById('ve-news-desk'))return;
    if(document.getElementById('vyrdict-news-layout-loader'))return;
    window.__vyrdictHomepageNewsDeskV1=0;
    const s=document.createElement('script');
    s.id='vyrdict-news-layout-loader';
    s.src='/homepage-news-desk.js?v=20260930-layout-restore-1';
    s.defer=true;
    (document.head||document.documentElement).appendChild(s);
  }

  function place(){
    const root=document.getElementById(ROOT);if(!root)return false;
    addStyle();
    const worth=root.querySelector(':scope > .ve-worth');
    if(worth){worth.hidden=true;worth.setAttribute('aria-hidden','true');worth.style.setProperty('display','none','important')}
    let section=document.getElementById(STORY_ID);
    if(!section){section=document.createElement('section');section.id=STORY_ID;section.setAttribute('aria-label','VYRDICT Stories')}
    const next=stories.map(s=>`${s.slug||''}:${s.published_at||''}`).join('|');
    if(sig!==next||!section.innerHTML.trim()){sig=next;section.innerHTML=markup()}
    const signal=root.querySelector(':scope > .ve-story');
    if(worth&&worth.parentNode===root){if(section.nextElementSibling!==worth)root.insertBefore(section,worth)}
    else if(signal&&signal.parentNode===root){if(section.nextElementSibling!==signal)root.insertBefore(section,signal)}
    else if(section.parentNode!==root)root.appendChild(section);
    section.hidden=false;section.removeAttribute('aria-hidden');section.style.removeProperty('display');
    const legacy=document.getElementById('vyrdict-editorial-now');
    if(legacy&&legacy!==section){legacy.hidden=true;legacy.setAttribute('aria-hidden','true');legacy.style.setProperty('display','none','important')}
    ensureNews();
    return true;
  }

  async function loadStories(){
    try{
      const r=await fetch(FEED,{cache:'no-store',headers:{accept:'application/json'}});
      if(!r.ok)throw new Error('stories');
      const d=await r.json();
      const rows=Array.isArray(d?.stories)?d.stories.filter(x=>x?.headline&&x?.image_url):[];
      if(rows.length){stories=rows.slice(0,4);sig='';place()}
    }catch{}
  }

  let n=0;
  const tick=()=>{n++;if(place()){if(n===1)loadStories()}else if(n<50)setTimeout(tick,n<12?120:300)};
  const queue=()=>{clearTimeout(timer);timer=setTimeout(place,35)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  const app=document.getElementById('app')||document.body;
  if(app)new MutationObserver(queue).observe(app,{childList:true,subtree:false});
  [300,800,1600,3000,6000].forEach(ms=>setTimeout(place,ms));
  addEventListener('pageshow',e=>{if(e.persisted)setTimeout(place,40)});
})();