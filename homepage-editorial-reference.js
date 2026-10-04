(()=>{
  if(window.__vyrdictHomepageEditorialRefV1)return;
  window.__vyrdictHomepageEditorialRefV1=1;
  if((location.pathname||'/')!=='/')return;

  /* This homepage is intentionally additive. The existing VYRDICT app remains
     mounted underneath so product/catalog/routing logic is untouched. */
  const STYLE_ID='vyrdict-home-editorial-ref-style-v1';
  const ROOT_ID='vyrdict-editorial-home';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=s=>String(s||'').replace(/\s+/g,' ').trim();
  let built=false;

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
:root{
  --ve-ink:#171717;
  --ve-muted:#626262;
  --ve-grey:#a8a8a5;
  --ve-grey-deep:#8f908e;
  --ve-stone:#f1efe9;
  --ve-paper:#faf9f5;
  --ve-line:rgba(23,23,23,.18);
  --ve-serif:"Iowan Old Style",Baskerville,"Times New Roman",Georgia,serif;
  --ve-sans:"Helvetica Neue",Helvetica,Arial,sans-serif;
}
html{scroll-behavior:smooth}
body.ve-home{background:var(--ve-stone)!important;color:var(--ve-ink)!important}
body.ve-home .ve-legacy-home{display:none!important}
body.ve-home #${ROOT_ID}{display:block!important;background:var(--ve-stone);overflow:hidden;color:var(--ve-ink)}
body.ve-home header{background:rgba(246,245,241,.94)!important;border-bottom:1px solid rgba(0,0,0,.10)!important;box-shadow:none!important;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
body.ve-home header a,body.ve-home header button{font-family:var(--ve-sans)!important}
#${ROOT_ID} *{box-sizing:border-box}
#${ROOT_ID} a{color:inherit}
.ve-wrap{width:min(1320px,calc(100% - 80px));margin:0 auto}
.ve-kicker{font:700 10px/1 var(--ve-sans);letter-spacing:.18em;text-transform:uppercase}
.ve-display{font-family:var(--ve-serif);font-weight:400;letter-spacing:-.055em;line-height:.92;margin:0}
.ve-section-title{font:400 clamp(42px,5vw,74px)/.94 var(--ve-serif);letter-spacing:-.05em;margin:0;color:var(--ve-ink)}
.ve-sub{font:400 14px/1.65 var(--ve-sans);color:var(--ve-muted);max-width:560px;margin:0}

/* muted editorial opening */
.ve-hero{position:relative;min-height:min(850px,88vh);background:linear-gradient(135deg,#aeaeab 0%,#a4a5a2 48%,#999b99 100%);display:grid;align-items:center;overflow:hidden;border-bottom:1px solid rgba(0,0,0,.16)}
.ve-hero:after{content:"";position:absolute;inset:0;background:radial-gradient(circle at 74% 42%,rgba(255,255,255,.18),transparent 25%),linear-gradient(90deg,rgba(0,0,0,.04),transparent 42%);pointer-events:none}
.ve-hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,.9fr) minmax(440px,1.1fr);align-items:center;gap:30px;padding:92px 0 82px}
.ve-hero-copy{max-width:690px}
.ve-hero .ve-kicker{margin-bottom:24px;color:#202020}
.ve-hero h1{font-size:clamp(64px,7.1vw,116px);max-width:720px}
.ve-hero p{font:400 clamp(15px,1.25vw,18px)/1.55 var(--ve-sans);max-width:500px;margin:28px 0 0;color:#282828}
.ve-hero-links{display:flex;gap:25px;align-items:center;margin-top:34px;flex-wrap:wrap}
.ve-text-link{display:inline-flex;align-items:center;gap:9px;text-decoration:none;border-bottom:1px solid #222;padding:0 0 6px;font:650 11px/1 var(--ve-sans);letter-spacing:.11em;text-transform:uppercase}
.ve-text-link:after{content:'↗';font-size:13px}
.ve-stage{height:610px;position:relative;isolation:isolate}
.ve-stage-orb{position:absolute;left:50%;top:50%;width:430px;height:430px;transform:translate(-50%,-50%);border-radius:50%;background:rgba(235,234,230,.26);filter:blur(.1px);border:1px solid rgba(255,255,255,.18)}
.ve-float{position:absolute;display:block;text-decoration:none;transition:transform .6s cubic-bezier(.2,.7,.2,1);animation:veFloat 7s ease-in-out infinite}
.ve-float:hover{transform:translateY(-7px) scale(1.02)}
.ve-float img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 30px 30px rgba(0,0,0,.18))}
.ve-float:nth-of-type(2){width:300px;height:390px;left:17%;top:17%;z-index:3}
.ve-float:nth-of-type(3){width:230px;height:310px;right:3%;top:8%;z-index:2;animation-delay:-2.2s}
.ve-float:nth-of-type(4){width:215px;height:280px;right:8%;bottom:2%;z-index:4;animation-delay:-4.4s}
.ve-float-meta{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);white-space:nowrap;background:rgba(245,244,239,.88);backdrop-filter:blur(8px);padding:8px 11px;border:1px solid rgba(0,0,0,.13);font:650 9px/1 var(--ve-sans);letter-spacing:.06em;text-transform:uppercase}
@keyframes veFloat{0%,100%{translate:0 0}50%{translate:0 -10px}}

/* stone-white community favourites */
.ve-community{background:var(--ve-paper);padding:105px 0 122px}
.ve-head{display:flex;align-items:end;justify-content:space-between;gap:28px;margin-bottom:52px}
.ve-head-right{max-width:420px;display:flex;flex-direction:column;gap:17px;align-items:flex-start}
.ve-product-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}
.ve-product{display:flex;flex-direction:column;text-decoration:none;min-width:0}
.ve-product-media{aspect-ratio:.87;background:#eeece6;display:grid;place-items:center;overflow:hidden;position:relative}
.ve-product-media:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.7),transparent 54%)}
.ve-product img{position:relative;z-index:1;width:86%;height:86%;object-fit:contain;transition:transform .45s ease;filter:drop-shadow(0 12px 18px rgba(30,25,20,.06))}
.ve-product:hover img{transform:scale(1.025)}
.ve-product-copy{padding:16px 2px 0}
.ve-product-brand{font:700 9px/1.2 var(--ve-sans);letter-spacing:.13em;text-transform:uppercase;color:#70706c;margin-bottom:7px;min-height:11px}
.ve-product-name{font:500 15px/1.28 var(--ve-sans);margin:0;min-height:39px}
.ve-scores{display:flex;gap:13px;margin-top:12px;font:650 9px/1 var(--ve-sans);letter-spacing:.06em;text-transform:uppercase;color:#595956}
.ve-scores b{font-weight:800;color:#202020}

/* cinematic moving feature */
.ve-motion{position:relative;min-height:760px;background:#171717;color:#f5f3ee;overflow:hidden;display:grid;align-items:end}
.ve-motion-frame{position:absolute;inset:0}
.ve-motion-img{position:absolute;inset:-5%;background-position:center;background-size:cover;opacity:0;filter:grayscale(.18) brightness(.58);animation:veFilm 18s infinite;transform:scale(1.06)}
.ve-motion-img:nth-child(2){animation-delay:6s}.ve-motion-img:nth-child(3){animation-delay:12s}
@keyframes veFilm{0%{opacity:0;transform:scale(1.08)}8%,28%{opacity:1}36%,100%{opacity:0;transform:scale(1.015)}}
.ve-motion:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12) 20%,rgba(0,0,0,.74) 100%)}
.ve-motion-copy{position:relative;z-index:3;padding:70px 0 72px;display:grid;grid-template-columns:1fr .7fr;gap:80px;align-items:end}
.ve-motion h2{font:400 clamp(64px,7vw,110px)/.88 var(--ve-serif);letter-spacing:-.06em;margin:10px 0 0;max-width:820px}
.ve-motion .ve-kicker{color:#e8e5df}
.ve-motion-side{max-width:390px;justify-self:end}
.ve-motion-side p{font:400 15px/1.65 var(--ve-sans);color:#e4e0da;margin:0 0 24px}
.ve-motion .ve-text-link{border-color:#eee;color:#f7f5ef}

/* second edit */
.ve-worth{background:#e8e6e0;padding:112px 0 120px}
.ve-worth-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:18px;margin-top:52px}
.ve-worth .ve-feature-product{background:var(--ve-paper);display:grid;grid-template-columns:1.06fr .94fr;min-height:590px;text-decoration:none;overflow:hidden}
.ve-feature-media{background:#dedcd6;display:grid;place-items:center;overflow:hidden}
.ve-feature-media img{width:88%;height:88%;object-fit:contain;filter:drop-shadow(0 24px 35px rgba(0,0,0,.08));transition:transform .5s ease}
.ve-feature-product:hover .ve-feature-media img{transform:scale(1.025)}
.ve-feature-copy{padding:54px 48px;display:flex;flex-direction:column;justify-content:space-between}
.ve-feature-copy h3{font:400 clamp(38px,3.8vw,62px)/.94 var(--ve-serif);letter-spacing:-.045em;margin:12px 0 18px}
.ve-feature-copy p{font:400 14px/1.6 var(--ve-sans);color:#64615c;margin:0}
.ve-feature-score{border-top:1px solid var(--ve-line);padding-top:18px;display:flex;gap:26px;font:700 10px/1 var(--ve-sans);letter-spacing:.09em;text-transform:uppercase}
.ve-mini-stack{display:grid;grid-template-rows:1fr 1fr;gap:18px}
.ve-mini{background:#d8d6d0;position:relative;overflow:hidden;text-decoration:none;min-height:285px}
.ve-mini img{width:100%;height:100%;object-fit:contain;padding:22px;filter:drop-shadow(0 16px 26px rgba(0,0,0,.10));transition:transform .5s ease}
.ve-mini:hover img{transform:scale(1.03)}
.ve-mini-label{position:absolute;left:18px;bottom:18px;right:18px;background:rgba(248,247,242,.91);padding:13px 14px;font:600 12px/1.3 var(--ve-sans);backdrop-filter:blur(10px)}

/* editorial story */
.ve-story{background:var(--ve-paper);display:grid;grid-template-columns:1.08fr .92fr;min-height:760px}
.ve-story-media{position:relative;overflow:hidden;background:#aaa9a6}
.ve-story-media img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(.35) contrast(.95);transform:scale(1.01)}
.ve-story-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 58%,rgba(0,0,0,.23))}
.ve-story-copy{padding:90px clamp(48px,7vw,112px);display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
.ve-story-copy h2{font:400 clamp(54px,6vw,92px)/.89 var(--ve-serif);letter-spacing:-.057em;margin:20px 0 28px;max-width:620px}
.ve-story-copy p{font:400 15px/1.72 var(--ve-sans);color:#5c5954;max-width:510px;margin:0 0 27px}

/* discovery strip + footer transition */
.ve-discover{background:#171717;color:#f4f1eb;padding:84px 0 92px}
.ve-discover-top{display:flex;justify-content:space-between;gap:40px;align-items:flex-end;padding-bottom:46px;border-bottom:1px solid rgba(255,255,255,.22)}
.ve-discover h2{font:400 clamp(48px,5vw,78px)/.92 var(--ve-serif);letter-spacing:-.05em;margin:0;max-width:680px}
.ve-category-links{display:flex;flex-wrap:wrap;gap:10px;margin-top:36px}
.ve-category-links a{border:1px solid rgba(255,255,255,.28);padding:11px 14px;text-decoration:none;font:650 10px/1 var(--ve-sans);letter-spacing:.08em;text-transform:uppercase;transition:.2s ease}
.ve-category-links a:hover{background:#f4f1eb;color:#171717;border-color:#f4f1eb}
body.ve-home footer{background:#171717!important;color:#f4f1eb!important;border-top:1px solid rgba(255,255,255,.20)!important;box-shadow:none!important}
body.ve-home footer a{color:#f4f1eb!important}

.ve-reveal{opacity:0;transform:translateY(16px);transition:opacity .8s ease,transform .8s ease}.ve-reveal.ve-in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.ve-float,.ve-motion-img{animation:none!important}.ve-motion-img:first-child{opacity:1!important}.ve-reveal{opacity:1;transform:none;transition:none}}
@media(max-width:980px){
  .ve-wrap{width:min(100% - 42px,900px)}
  .ve-hero{min-height:auto}.ve-hero-inner{grid-template-columns:1fr;padding:74px 0 50px}.ve-stage{height:480px}
  .ve-product-grid{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:38px}
  .ve-motion{min-height:680px}.ve-motion-copy{grid-template-columns:1fr;gap:26px}.ve-motion-side{justify-self:start}
  .ve-worth-grid{grid-template-columns:1fr}.ve-worth .ve-feature-product{min-height:520px}.ve-mini-stack{grid-template-columns:1fr 1fr;grid-template-rows:none}
  .ve-story{grid-template-columns:1fr;min-height:auto}.ve-story-media{min-height:640px}.ve-story-copy{padding:72px 42px}
}
@media(max-width:620px){
  .ve-wrap{width:calc(100% - 30px)}
  .ve-hero-inner{padding:54px 0 34px}.ve-hero h1{font-size:clamp(54px,17vw,78px)}.ve-hero p{font-size:14px}.ve-stage{height:380px;margin:8px -15px 0}
  .ve-stage-orb{width:280px;height:280px}.ve-float:nth-of-type(2){width:205px;height:270px;left:12%;top:16%}.ve-float:nth-of-type(3){width:150px;height:205px;right:0;top:6%}.ve-float:nth-of-type(4){width:145px;height:190px;right:8%;bottom:0}.ve-float-meta{display:none}
  .ve-community,.ve-worth{padding:76px 0 82px}.ve-head{display:block;margin-bottom:36px}.ve-head-right{margin-top:20px}.ve-section-title{font-size:clamp(44px,13vw,62px)}
  .ve-product-grid{gap:12px 10px}.ve-product-media{aspect-ratio:.88}.ve-product-name{font-size:13px;min-height:34px}.ve-scores{gap:7px;font-size:8px}
  .ve-motion{min-height:620px}.ve-motion-copy{padding:52px 0}.ve-motion h2{font-size:clamp(58px,16vw,82px)}
  .ve-worth .ve-feature-product{grid-template-columns:1fr;min-height:auto}.ve-feature-media{min-height:380px}.ve-feature-copy{padding:34px 27px;gap:42px}.ve-mini-stack{grid-template-columns:1fr}.ve-mini{min-height:310px}
  .ve-story-media{min-height:500px}.ve-story-copy{padding:60px 24px}.ve-story-copy h2{font-size:clamp(50px,14vw,70px)}
  .ve-discover{padding:68px 0 76px}.ve-discover-top{display:block}.ve-discover h2{font-size:clamp(46px,13vw,64px)}
}
`;
    document.head.appendChild(s);
  }

  function cardFor(link){
    let n=link;
    for(let i=0;i<7&&n?.parentElement;i++,n=n.parentElement){
      if(n.querySelector?.('img')&&n.querySelector?.('h1,h2,h3,h4,h5,h6')&&clean(n.textContent).length<900)return n;
    }
    return link.closest('article,.card,[class*="card"]')||link.parentElement;
  }

  function products(){
    const out=[],seen=new Set();
    const links=[...document.querySelectorAll('a[href*="/product/"]')];
    for(const a of links){
      const href=a.getAttribute('href')||'';
      const m=href.match(/\/product\/([^/?#]+)/i);if(!m)continue;
      const slug=decodeURIComponent(m[1]);if(seen.has(slug))continue;
      const c=cardFor(a);if(!c)continue;
      const img=c.querySelector('img');
      const head=[...c.querySelectorAll('h1,h2,h3,h4,h5,h6')].find(h=>clean(h.textContent));
      if(!img||!head)continue;
      const src=img.currentSrc||img.getAttribute('src')||img.getAttribute('data-src')||'';
      if(!src||src.startsWith('data:'))continue;
      const txt=clean(c.textContent),name=clean(head.textContent);
      let brand='';
      const candidates=[...c.querySelectorAll('small,.brand,[class*="brand"],.eyebrow')].map(x=>clean(x.textContent)).filter(Boolean);
      brand=candidates.find(x=>x.length<45&&!/viral|worth|score|verdict/i.test(x))||'';
      const vm=txt.match(/viral(?:\s+score)?\s*[:·]?\s*(\d{1,3})/i),wm=txt.match(/worth(?:\s+score)?\s*[:·]?\s*(\d{1,3})/i);
      const viral=vm?Number(vm[1]):null,worth=wm?Number(wm[1]):null;
      out.push({slug,href:'/product/'+encodeURIComponent(slug)+'/',src,name,brand,viral,worth});seen.add(slug);
    }
    return out;
  }

  function pCard(p){
    return `<a class="ve-product ve-reveal" href="${esc(p.href)}" data-product-slug="${esc(p.slug)}"><div class="ve-product-media"><img loading="lazy" src="${esc(p.src)}" alt="${esc(p.name)}"></div><div class="ve-product-copy"><div class="ve-product-brand">${esc(p.brand||'VYRDICT EDIT')}</div><p class="ve-product-name">${esc(p.name)}</p><div class="ve-scores">${p.viral!=null?`<span>Viral <b>${p.viral}</b></span>`:''}${p.worth!=null?`<span>Worth <b>${p.worth}</b></span>`:''}</div></div></a>`;
  }

  function scoreLine(p){
    const bits=[];if(p.viral!=null)bits.push(`Viral ${p.viral}`);if(p.worth!=null)bits.push(`Worth ${p.worth}`);return bits.join(' · ')||'See the VYRDICT';
  }

  function make(ps){
    const app=document.getElementById('app');if(!app||built||document.getElementById(ROOT_ID))return false;
    if(ps.length<6)return false;
    built=true;style();document.body.classList.add('ve-home');

    /* Mark only the pre-existing homepage modules as legacy. Header/footer remain untouched. */
    [...app.querySelectorAll('.hero,.section')].forEach(el=>{if(!el.closest('#'+ROOT_ID))el.classList.add('ve-legacy-home')});

    const hero=ps.slice(0,3),community=ps.slice(0,4);
    const worthSorted=[...ps].sort((a,b)=>(b.worth??-1)-(a.worth??-1));
    const featured=worthSorted[0]||ps[4],mini1=worthSorted[1]||ps[5],mini2=worthSorted[2]||ps[6]||ps[0];
    const motion=[ps[3]||ps[0],ps[4]||ps[1],ps[5]||ps[2]];
    const story=ps[7]||ps[ps.length-1]||ps[0];

    const root=document.createElement('main');root.id=ROOT_ID;root.setAttribute('aria-label','VYRDICT editorial homepage');
    root.innerHTML=`
<section class="ve-hero">
 <div class="ve-wrap ve-hero-inner">
  <div class="ve-hero-copy ve-reveal"><div class="ve-kicker">VYRDICT / PRODUCT INTELLIGENCE</div><h1 class="ve-display">What’s actually worth the hype?</h1><p>Discover what the internet can’t stop talking about—then see the Viral Score, Worth Score and VYRDICT before you buy.</p><div class="ve-hero-links"><a class="ve-text-link" href="#ve-community">Discover the edit</a><a class="ve-text-link" href="/collection/gifts/">Shop gifts</a></div></div>
  <div class="ve-stage" aria-label="Trending products"><div class="ve-stage-orb"></div>${hero.map((p,i)=>`<a class="ve-float" href="${esc(p.href)}" aria-label="${esc(p.name)}"><img ${i?'loading="eager"':''} src="${esc(p.src)}" alt="${esc(p.name)}"><span class="ve-float-meta">${esc(p.brand||p.name)}${p.viral!=null?' · Viral '+p.viral:''}</span></a>`).join('')}</div>
 </div>
</section>
<section class="ve-community" id="ve-community"><div class="ve-wrap"><div class="ve-head ve-reveal"><div><div class="ve-kicker">THE CURRENT EDIT</div><h2 class="ve-section-title">Discover community favorites.</h2></div><div class="ve-head-right"><p class="ve-sub">Bright, talked-about products with the scores that tell you whether attention is turning into actual value.</p><a class="ve-text-link" href="/collection/viral-gifts/">Explore viral finds</a></div></div><div class="ve-product-grid">${community.map(pCard).join('')}</div></div></section>
<section class="ve-motion"><div class="ve-motion-frame" aria-hidden="true">${motion.map(p=>`<div class="ve-motion-img" style="background-image:url('${esc(p.src).replace(/'/g,'&#39;')}')"></div>`).join('')}</div><div class="ve-wrap ve-motion-copy"><div class="ve-reveal"><div class="ve-kicker">THE VIRAL EDIT</div><h2>What’s having a moment.</h2></div><div class="ve-motion-side ve-reveal"><p>A cinematic pulse of the products moving through culture right now. We track the attention—then look past it.</p><a class="ve-text-link" href="/collection/viral-gifts/">See what’s viral</a></div></div></section>
<section class="ve-worth"><div class="ve-wrap"><div class="ve-head ve-reveal"><div><div class="ve-kicker">BEYOND THE BUZZ</div><h2 class="ve-section-title">Worth the hype.</h2></div><div class="ve-head-right"><p class="ve-sub">The products where the conversation is backed by stronger value signals.</p></div></div><div class="ve-worth-grid"><a class="ve-feature-product ve-reveal" href="${esc(featured.href)}"><div class="ve-feature-media"><img loading="lazy" src="${esc(featured.src)}" alt="${esc(featured.name)}"></div><div class="ve-feature-copy"><div><div class="ve-kicker">VYRDICT PICK</div><h3>${esc(featured.name)}</h3><p>${esc(featured.brand||'A current VYRDICT favorite')}</p></div><div class="ve-feature-score">${esc(scoreLine(featured))}</div></div></a><div class="ve-mini-stack"><a class="ve-mini ve-reveal" href="${esc(mini1.href)}"><img loading="lazy" src="${esc(mini1.src)}" alt="${esc(mini1.name)}"><span class="ve-mini-label">${esc(mini1.name)} · ${esc(scoreLine(mini1))}</span></a><a class="ve-mini ve-reveal" href="${esc(mini2.href)}"><img loading="lazy" src="${esc(mini2.src)}" alt="${esc(mini2.name)}"><span class="ve-mini-label">${esc(mini2.name)} · ${esc(scoreLine(mini2))}</span></a></div></div></div></section>
<section class="ve-story"><a class="ve-story-media ve-reveal" href="${esc(story.href)}" aria-label="${esc(story.name)}"><img loading="lazy" src="${esc(story.src)}" alt="${esc(story.name)}"></a><div class="ve-story-copy ve-reveal"><div class="ve-kicker">THE VYRDICT EDIT</div><h2>Signal, not noise.</h2><p>Virality tells you what has attention. Worth tells you what deserves it. VYRDICT brings the two together so discovery can still feel exciting—without shopping blind.</p><a class="ve-text-link" href="/how-vyrdict-scores.html">How VYRDICT scores</a></div></section>
<section class="ve-discover"><div class="ve-wrap"><div class="ve-discover-top"><div><div class="ve-kicker">KEEP DISCOVERING</div><h2>Find your next obsession.</h2></div><p class="ve-sub" style="color:#c9c5be">From beauty and fashion to tech, home, wellness and gifts—browse the categories shaping the conversation.</p></div><nav class="ve-category-links" aria-label="Browse VYRDICT categories"><a href="/category/beauty/">Beauty</a><a href="/category/fashion/">Fashion</a><a href="/category/tech/">Tech</a><a href="/category/home/">Home</a><a href="/category/wellness/">Wellness</a><a href="/category/kids-baby/">Kids & Baby</a><a href="/category/pets/">Pets</a><a href="/collection/gifts/">Gifts</a></nav></div></section>`;

    const firstLegacy=[...app.children].find(el=>el.classList?.contains('ve-legacy-home'));
    if(firstLegacy)app.insertBefore(root,firstLegacy);else app.appendChild(root);

    const io='IntersectionObserver'in window?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('ve-in');io.unobserve(e.target)}},{threshold:.12,rootMargin:'0px 0px -4%'}):null;
    root.querySelectorAll('.ve-reveal').forEach((el,i)=>{if(i<4)el.classList.add('ve-in');else if(io)io.observe(el);else el.classList.add('ve-in')});

    /* Keep the entry seamless and do not reintroduce browser scroll restoration. */
    try{history.scrollRestoration='manual'}catch{}
    return true;
  }

  function attempt(){if((location.pathname||'/')!=='/')return;const ps=products();if(make(ps))return}
  style();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attempt,{once:true});else attempt();
  [120,350,750,1300,2200,3600,5200].forEach(ms=>setTimeout(attempt,ms));

})();