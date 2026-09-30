(()=>{
  if(window.__vyrdictHomepageNewsDeskV1)return;
  window.__vyrdictHomepageNewsDeskV1=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home';
  const ID='ve-news-desk';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fallback=[
    {headline:'Pokémon × adidas just evolved the fit check.',category:'Shoes · Brand Culture',image_url:'https://assets.adidas.com/images/w_1000,f_auto,q_auto/9cbed7f0099347c09662e57b4fec9e91_9366/ADIDAS_Pokemon_SUPERSTAR_II_SHOES_Yellow_KI2858_01_00_standard.jpg',dek:'Pokémon’s 30th year gets a full adidas collection spanning sneakers, jerseys, kids’ styles and accessories.',published_at:'2026-09-26T09:04:51Z'},
    {headline:'Meta put its AI assistant on a keychain — and gave it a face.',category:'Tech · Internet Culture',image_url:'https://images.macrumors.com/t/14wGEZUuYIteDE8k96rWVH2s_lU=/1600x/article-new/2026/09/meta-muse-charm.jpg',dek:'Muse Charm turns Meta’s personal AI agent into a tiny character-filled device built for everyday access.',published_at:'2026-09-25T02:27:18Z'},
    {headline:'YSL turned a SoHo taqueria into a beauty block party.',category:'Beauty · Brand Culture',image_url:'https://hips.hearstapps.com/hmg-prod/images/3c6642ba-01fb-4ad7-8792-78ded340bbad.jpeg',dek:'YSL Beauty took over La Esquina with product, music, tacos and a pink-and-black launch world.',published_at:'2026-09-21T17:07:00Z'},
    {headline:'Steph Curry’s first Li-Ning drop isn’t even his own shoe.',category:'Shoes · Celebrity Effect',image_url:'https://media.gq.com/photos/6a1f49413e3061fa554fb1be/16%3A9/w_2560%2Cc_limit/steph-curry-shoes.jpg',published_at:'2026-09-21T01:35:00Z'},
    {headline:'RIMOWA and Faber-Castell made a $3,100 pencil case — and somehow it works.',category:'Stationery & Crafts · Luxury Design',image_url:'https://www.rimowa.com/on/demandware.static/-/Sites-rimowa-master-catalog-final/default/dwd7b3359b/images/large/97390043_1.png',published_at:'2026-09-18T20:47:05Z'},
    {headline:'Owala × Pokémon turned a water bottle drop into a collector frenzy.',category:'Home · Toys & Collectibles',image_url:'https://target.scene7.com/is/image/Target/GUEST_8b7a4b68-5a45-4f35-91b5-11b54bdf52ef',published_at:'2026-09-18T03:16:48Z'}
  ];

  function style(){
    if(document.getElementById('ve-news-desk-style'))return;
    const s=document.createElement('style');s.id='ve-news-desk-style';s.textContent=`
      #${ID}{background:#f7f5ef;color:#171717;padding:78px 0 86px;border-top:1px solid rgba(0,0,0,.12);border-bottom:1px solid rgba(0,0,0,.12)}
      #${ID} *{box-sizing:border-box} #${ID} a{color:inherit;text-decoration:none}
      .ve-news-wrap{width:min(1360px,calc(100% - 64px));margin:0 auto}
      .ve-news-head{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;padding-bottom:24px;border-bottom:1px solid rgba(0,0,0,.22);margin-bottom:28px}
      .ve-news-kicker{font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.17em;text-transform:uppercase;color:#6b6963;margin-bottom:10px}
      .ve-news-head h2{font:400 clamp(44px,5vw,72px)/.92 var(--ve-serif,Georgia,serif);letter-spacing:-.05em;margin:0}
      .ve-news-head p{font:400 13px/1.55 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);color:#66625c;max-width:400px;margin:0}
      .ve-news-grid{display:grid;grid-template-columns:minmax(190px,.68fr) minmax(0,1.55fr) minmax(260px,.82fr);gap:24px;align-items:start}
      .ve-news-secondary{border-right:1px solid rgba(0,0,0,.16);padding-right:24px}
      .ve-news-secondary img{width:100%;aspect-ratio:.78;object-fit:cover;display:block;background:#e7e4de}
      .ve-news-meta{font:700 8px/1.2 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.13em;text-transform:uppercase;color:#74706a;margin:14px 0 8px}
      .ve-news-secondary h3{font:400 clamp(24px,2.2vw,36px)/1.02 var(--ve-serif,Georgia,serif);letter-spacing:-.035em;margin:0}
      .ve-news-lead{padding:0 2px}.ve-news-lead img{width:100%;aspect-ratio:1.2;object-fit:cover;display:block;background:#e5e2dc}.ve-news-lead h3{font:400 clamp(36px,4vw,58px)/.98 var(--ve-serif,Georgia,serif);letter-spacing:-.045em;margin:0 0 12px}.ve-news-dek{font:400 13px/1.6 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);color:#625f59;max-width:760px;margin:0}
      .ve-news-rail{border-left:1px solid rgba(0,0,0,.16);padding-left:24px}.ve-news-rail-title{font:700 9px/1 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);letter-spacing:.15em;text-transform:uppercase;padding:2px 0 12px;border-bottom:1px solid rgba(0,0,0,.2)}
      .ve-news-item{display:grid;grid-template-columns:1fr 78px;gap:14px;align-items:center;padding:16px 0;border-bottom:1px solid rgba(0,0,0,.14)}.ve-news-item img{width:78px;height:86px;object-fit:cover;background:#e6e3dd}.ve-news-item .ve-news-meta{margin:0 0 6px}.ve-news-item h4{font:500 14px/1.28 var(--ve-sans,"Helvetica Neue",Arial,sans-serif);margin:0}
      #${ID} a:hover h3,#${ID} a:hover h4{text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:4px}
      @media(max-width:980px){.ve-news-wrap{width:min(100% - 36px,900px)}.ve-news-grid{grid-template-columns:1fr 1fr}.ve-news-lead{grid-column:1/-1;grid-row:1}.ve-news-secondary{grid-column:1;grid-row:2;border-right:1px solid rgba(0,0,0,.16)}.ve-news-rail{grid-column:2;grid-row:2}}
      @media(max-width:640px){#${ID}{padding:58px 0 64px}.ve-news-wrap{width:calc(100% - 28px)}.ve-news-head{display:block}.ve-news-head p{margin-top:14px}.ve-news-grid{display:flex;flex-direction:column;gap:32px}.ve-news-lead{order:1}.ve-news-secondary{order:2;border-right:0;padding-right:0;width:100%}.ve-news-secondary img{aspect-ratio:1.12}.ve-news-rail{order:3;border-left:0;padding-left:0;width:100%}.ve-news-item{grid-template-columns:1fr 82px}.ve-news-lead img{aspect-ratio:1.05}.ve-news-lead h3{font-size:clamp(34px,10vw,48px)}}
    `;document.head.appendChild(s);
  }

  function linkFor(s){return s.source_url||s.instagram_url||'#'}
  function attrs(s){const href=linkFor(s);return href==='#'?'href="#" aria-disabled="true"':`href="${esc(href)}" target="_blank" rel="noopener noreferrer"`}
  function validStories(rows){
    return (Array.isArray(rows)?rows:[]).filter(s=>s&&s.headline&&s.image_url&&!/llbean\.com\/llb\/shop\//i.test(s.image_url)).sort((a,b)=>new Date(b.published_at||0)-new Date(a.published_at||0));
  }

  function render(rows){
    const r=document.getElementById(ROOT);if(!r)return false;
    const motion=r.querySelector('.ve-motion'),worth=r.querySelector('.ve-worth');if(!motion||!worth)return false;
    let stories=validStories(rows);if(stories.length<6)stories=fallback;
    const lead=stories[0],secondary=stories[1],rail=stories.slice(2,6);
    let sec=document.getElementById(ID);if(!sec){sec=document.createElement('section');sec.id=ID;motion.insertAdjacentElement('afterend',sec)}
    sec.innerHTML=`<div class="ve-news-wrap"><div class="ve-news-head"><div><div class="ve-news-kicker">VYRDICT / CULTURE DESK</div><h2>The VYRDICT Desk.</h2></div><p>The launches, collaborations and internet moments shaping what people want next.</p></div><div class="ve-news-grid"><a class="ve-news-secondary" ${attrs(secondary)}><img loading="lazy" src="${esc(secondary.image_url)}" alt="${esc(secondary.image_alt||secondary.headline)}"><div class="ve-news-meta">${esc(secondary.category||'Culture')}</div><h3>${esc(secondary.headline)}</h3></a><a class="ve-news-lead" ${attrs(lead)}><img loading="lazy" src="${esc(lead.image_url)}" alt="${esc(lead.image_alt||lead.headline)}"><div class="ve-news-meta">${esc(lead.category||'Culture')}</div><h3>${esc(lead.headline)}</h3>${lead.dek?`<p class="ve-news-dek">${esc(lead.dek)}</p>`:''}</a><aside class="ve-news-rail"><div class="ve-news-rail-title">Latest</div>${rail.map(s=>`<a class="ve-news-item" ${attrs(s)}><div><div class="ve-news-meta">${esc(s.category||'Culture')}</div><h4>${esc(s.headline)}</h4></div><img loading="lazy" src="${esc(s.image_url)}" alt=""></a>`).join('')}</aside></div></div>`;
    return true;
  }

  async function build(){
    style();
    try{const res=await fetch('/api/stories?limit=8',{headers:{accept:'application/json'}});if(res.ok){const j=await res.json();if(render(j.stories))return}}catch{}
    render(fallback);
  }

  let tries=0;const wait=()=>{tries++;const r=document.getElementById(ROOT);if(r&&r.querySelector('.ve-motion')&&r.querySelector('.ve-worth'))build();else if(tries<30)setTimeout(wait,200)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
  addEventListener('pageshow',()=>setTimeout(wait,40));
})();