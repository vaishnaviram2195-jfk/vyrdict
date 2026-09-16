(()=>{
  if(window.__vyrdictEditorialNowV1)return;
  window.__vyrdictEditorialNowV1=1;

  // Curated to mirror the story VYRDICT is actively covering on social.
  // Swap this object when a new editorial story becomes the lead.
  const STORY={
    eyebrow:"WHY IT'S TRENDING NOW",
    meta:"FOOD & DRINKS  ·  TOYS & COLLECTIBLES  ·  SEPT. 15",
    headline:"Starbucks just made Snoopy the main character of fall.",
    dek:"The Peanuts collection launched with 10 limited-edition collectibles, a purchase-limited hero cup and two themed drinks in the U.S. app — turning one merch drop into a full seasonal moment.",
    signals:["NOSTALGIA","SCARCITY","COLLECTIBILITY","APP DISCOVERY"],
    watch:"How quickly the Snoopy Glass Cold Cup sells through — and whether demand holds beyond the launch-week nostalgia spike.",
    sourceLabel:"Starbucks",
    sourceUrl:"https://about.starbucks.com/stories/2026/do-a-happy-dance-see-the-new-starbucks-peanuts-fall-collection-inspired-by-the-great-pumpkin-and-pumpkin-spice-latte/"
  };

  window.VYRDICT_EDITORIAL_NOW_STORY=STORY;
  const ID='vyrdict-editorial-now';
  const STYLE_ID='vyrdict-editorial-now-style';
  const isHome=()=>location.pathname==='/'||location.pathname==='';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
#${ID}{background:#f4ede5;padding:8px 20px 22px;box-sizing:border-box}
#${ID} .v-edit-shell{width:min(1160px,100%);margin:0 auto;background:#fffdf8;border:1px solid rgba(23,21,17,.14);border-radius:22px;overflow:hidden;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);box-shadow:0 12px 34px rgba(52,39,28,.045)}
#${ID} .v-edit-main{padding:32px 36px 34px}
#${ID} .v-edit-side{background:#171511;color:#fffdf8;padding:32px 32px 30px;display:flex;flex-direction:column;justify-content:space-between;min-height:230px}
#${ID} .v-edit-eyebrow{margin:0 0 13px;font:900 10px/1.2 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#171511;display:flex;align-items:center;gap:10px}
#${ID} .v-edit-eyebrow:before{content:'';width:8px;height:8px;background:#e65f72;display:inline-block}
#${ID} .v-edit-meta{margin:0 0 12px;font:800 9px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.085em;text-transform:uppercase;color:#777068}
#${ID} h2{margin:0;max-width:760px;font:500 clamp(30px,4.2vw,52px)/.99 Georgia,'Times New Roman',serif;letter-spacing:-.045em;color:#171511}
#${ID} .v-edit-dek{margin:17px 0 0;max-width:790px;font:15px/1.65 Arial,Helvetica,sans-serif;color:#655e57}
#${ID} .v-edit-signals{display:flex;gap:8px;flex-wrap:wrap;margin-top:22px}
#${ID} .v-edit-signal{border:1px solid rgba(23,21,17,.16);border-radius:999px;padding:9px 11px;background:#f7f0e8;font:900 8px/1 Arial,Helvetica,sans-serif;letter-spacing:.085em;color:#171511}
#${ID} .v-edit-side-label{font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#e7a0aa;margin-bottom:14px}
#${ID} .v-edit-watch{font:500 22px/1.18 Georgia,'Times New Roman',serif;letter-spacing:-.025em;color:#fffdf8;margin:0}
#${ID} .v-edit-source{margin-top:26px;font:800 9px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.075em;text-transform:uppercase;color:#bdb5ad}
#${ID} .v-edit-source a{color:#fffdf8;text-decoration:none;border-bottom:1px solid rgba(255,253,248,.45);padding-bottom:2px}
#${ID} .v-edit-source a:hover{border-color:#fffdf8}
@media(max-width:760px){
  #${ID}{padding:4px 14px 16px}
  #${ID} .v-edit-shell{grid-template-columns:1fr;border-radius:18px}
  #${ID} .v-edit-main{padding:25px 23px 27px}
  #${ID} .v-edit-side{padding:24px 23px 23px;min-height:0}
  #${ID} h2{font-size:35px;line-height:1.01}
  #${ID} .v-edit-dek{font-size:14px;line-height:1.58}
  #${ID} .v-edit-watch{font-size:21px}
  #${ID} .v-edit-signals{margin-top:18px;gap:7px}
}
`;
    document.head.appendChild(style);
  }

  function markup(){
    const chips=STORY.signals.map(x=>`<span class="v-edit-signal">${esc(x)}</span>`).join('');
    return `<div class="v-edit-shell">
      <div class="v-edit-main">
        <p class="v-edit-eyebrow">${esc(STORY.eyebrow)}</p>
        <p class="v-edit-meta">${esc(STORY.meta)}</p>
        <h2>${esc(STORY.headline)}</h2>
        <p class="v-edit-dek">${esc(STORY.dek)}</p>
        <div class="v-edit-signals" aria-label="Why this is trending">${chips}</div>
      </div>
      <aside class="v-edit-side" aria-label="What VYRDICT is watching">
        <div>
          <div class="v-edit-side-label">WHAT WE'RE WATCHING</div>
          <p class="v-edit-watch">${esc(STORY.watch)}</p>
        </div>
        <div class="v-edit-source">Source: <a href="${esc(STORY.sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(STORY.sourceLabel)} ↗</a></div>
      </aside>
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
      section.setAttribute('aria-label',STORY.eyebrow);
    }
    section.innerHTML=markup();
    if(hero){
      if(hero.nextElementSibling!==section)hero.insertAdjacentElement('afterend',section);
    }else if(viral?.parentNode){
      viral.parentNode.insertBefore(section,viral);
    }
    return true;
  }

  function boot(attempt=0){
    if(mount()||attempt>20)return;
    setTimeout(()=>boot(attempt+1),80);
  }

  let timer=0;
  const observer=new MutationObserver(()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>mount(),90);
  });

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      boot();
      observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
    },{once:true});
  }else{
    boot();
    observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
  }

  addEventListener('popstate',()=>setTimeout(mount,30));
  addEventListener('hashchange',()=>setTimeout(mount,30));
})();
