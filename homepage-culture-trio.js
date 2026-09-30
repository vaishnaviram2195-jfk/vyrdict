(()=>{
  if(window.__vyrdictCultureTrioV3)return;
  window.__vyrdictCultureTrioV3=1;
  if((location.pathname||'/')!=='/')return;

  const ROOT='vyrdict-editorial-home', ID='ve-culture-trio';
  const CARDS=[
    {title:'Viral Around the World',kicker:'GLOBAL DISCOVERY',dek:'The products crossing borders, feeds and shopping lists — from Japan to Europe and everywhere in between.',href:'/collection/viral-around-the-world/',image:'https://www.ikea.com/us/en/images/products/ikea-ps-2026-chair-with-inflatable-seat-back-cushion-knaebaeck-bright-green__1481191_pe1000447_s5.jpg',alt:'IKEA PS 2026 Inflatable Chair'},
    {title:'Celebrity Effect',kicker:'CULTURE / PEOPLE',dek:'What happens when a celebrity wears it, uses it, launches it or quietly turns it into the next obsession.',href:'/collection/celebrity-effect/',image:'https://www.rhodeskin.com/cdn/shop/files/press-pls-hero-d_d381ba3b-cca6-4ec0-a49f-bf4b994b5956_medium.jpg?v=1754344364',alt:'rhode Peptide Lip Shape'},
    {title:'Seen on Screen',kicker:'TV / FILM / SCREEN CULTURE',dek:'The fashion, beauty and objects people start searching for the second they appear on screen.',href:'/collection/seen-on-screen/',image:'https://edikted.com/cdn/shop/files/Edikted_Lookbook_07_07_2025268554copy.jpg?v=1753686263&width=1200',alt:'Edikted Zigzag Stripe Crochet Tank Top'}
  ];

  function style(){
    document.getElementById('ve-culture-trio-style')?.remove();
    if(document.getElementById('ve-culture-trio-style-v2'))return;
    const s=document.createElement('style');s.id='ve-culture-trio-style-v2';s.textContent=`
      #${ID}{background:#f8f6f1;padding:102px 0 72px;border-bottom:0;color:#171717}
      #${ID} *{box-sizing:border-box} #${ID} a{color:inherit;text-decoration:none}
      .ve-culture-wrap{width:min(1320px,calc(100% - 80px));margin:0 auto}
      .ve-culture-head{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:42px}
      .ve-culture-head h2{font:400 clamp(46px,5.2vw,76px)/.94 var(--ve-serif,Georgia,serif);letter-spacing:-.05em;margin:0;max-width:760px}
      .ve-culture-head p{font:400 14px/1.65 var(--ve-sans,Arial,sans-serif);color:#66615b;max-width:430px;margin:0}
      .ve-culture-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
      .ve-culture-card{display:flex;flex-direction:column;min-width:0}
      .ve-culture-media{position:relative;aspect-ratio:.86;overflow:hidden;background:#e8e5de}
      .ve-culture-media img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(.2,.7,.2,1);filter:saturate(.88) contrast(.97)}
      .ve-culture-card:hover .ve-culture-media img{transform:scale(1.025)}
      .ve-culture-index{position:absolute;left:14px;top:14px;background:rgba(248,246,241,.88);backdrop-filter:blur(8px);padding:7px 9px;font:700 8px/1 var(--ve-sans,Arial,sans-serif);letter-spacing:.14em;text-transform:uppercase}
      .ve-culture-copy{padding:18px 2px 0}
      .ve-culture-kicker{font:700 9px/1.2 var(--ve-sans,Arial,sans-serif);letter-spacing:.15em;text-transform:uppercase;color:#77716a;margin-bottom:9px}
      .ve-culture-copy h3{font:400 clamp(30px,3vw,46px)/.98 var(--ve-serif,Georgia,serif);letter-spacing:-.04em;margin:0 0 12px}
      .ve-culture-copy p{font:400 13px/1.58 var(--ve-sans,Arial,sans-serif);color:#66615b;margin:0 0 14px;max-width:94%}
      .ve-culture-link{display:inline-flex;align-items:center;gap:8px;font:700 9px/1 var(--ve-sans,Arial,sans-serif);letter-spacing:.12em;text-transform:uppercase;border-bottom:1px solid #222;padding-bottom:5px}
      .ve-culture-link:after{content:'↗';font-size:11px}
      #${ID} + #ve-news-desk{margin-top:0!important;padding-top:52px!important;border-top:1px solid rgba(0,0,0,.10)!important;background:#f8f6f1!important}
      @media(max-width:900px){.ve-culture-wrap{width:min(100% - 42px,900px)}.ve-culture-grid{grid-template-columns:1fr 1fr}.ve-culture-card:last-child{grid-column:1/-1}.ve-culture-card:last-child .ve-culture-media{aspect-ratio:1.45}.ve-culture-head{display:block}.ve-culture-head p{margin-top:18px}}
      @media(max-width:620px){#${ID}{padding:72px 0 56px}.ve-culture-wrap{width:calc(100% - 30px)}.ve-culture-grid{grid-template-columns:1fr;gap:34px}.ve-culture-card:last-child{grid-column:auto}.ve-culture-media,.ve-culture-card:last-child .ve-culture-media{aspect-ratio:1.05}.ve-culture-copy h3{font-size:clamp(34px,10vw,48px)}#${ID} + #ve-news-desk{padding-top:42px!important}}
    `;document.head.appendChild(s);
  }

  function build(){
    const root=document.getElementById(ROOT);if(!root)return false;
    const hero=root.querySelector('.ve-hero'),old=root.querySelector('.ve-community');
    if(!hero)return false;
    style();
    old?.remove();
    let sec=document.getElementById(ID);
    if(!sec){sec=document.createElement('section');sec.id=ID;hero.insertAdjacentElement('afterend',sec)}
    sec.innerHTML=`<div class="ve-culture-wrap"><div class="ve-culture-head"><div><div class="ve-kicker">DISCOVER THROUGH CULTURE</div><h2>Beyond the product feed.</h2></div><p>Explore the forces that turn products into cultural moments — geography, celebrity and what we see on screen.</p></div><div class="ve-culture-grid">${CARDS.map((c,i)=>`<a class="ve-culture-card" href="${c.href}"><div class="ve-culture-media"><img loading="lazy" src="${c.image}" alt="${c.alt}"><span class="ve-culture-index">0${i+1}</span></div><div class="ve-culture-copy"><div class="ve-culture-kicker">${c.kicker}</div><h3>${c.title}</h3><p>${c.dek}</p><span class="ve-culture-link">Explore</span></div></a>`).join('')}</div></div>`;
    const heroLink=root.querySelector('.ve-hero-links a[href="#ve-community"]');if(heroLink){heroLink.href='#'+ID;heroLink.textContent='Explore culture'}
    return true;
  }

  let tries=0;const tick=()=>{tries++;if(!build()&&tries<40)setTimeout(tick,150)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();
  const app=document.getElementById('app')||document.body;
  new MutationObserver(()=>{if(document.getElementById(ROOT)&&(!document.getElementById(ID)||document.querySelector('#'+ROOT+' .ve-community')))setTimeout(build,30)}).observe(app,{childList:true,subtree:true});
  addEventListener('pageshow',()=>setTimeout(build,50));
})();