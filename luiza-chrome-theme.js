(()=>{
  if(window.__vyrdictLuizaChromeV1)return;
  window.__vyrdictLuizaChromeV1=1;

  const STYLE_ID='vyrdict-luiza-chrome-style-v1';
  const BODY_CLASSES=['v-luiza-chrome','v-luiza-home','v-luiza-product','v-luiza-listing'];
  let timer=0;

  function routeType(){
    const p=location.pathname||'/';
    if(p==='/'||p==='')return'home';
    if(/^\/product\//i.test(p))return'product';
    if(/^\/(category|collection)\//i.test(p))return'listing';
    return'other';
  }

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
:root{
  --v-luiza-ink:#171717;
  --v-luiza-charcoal:#292929;
  --v-luiza-graphite:#454545;
  --v-luiza-blush:#e7d6d3;
  --v-luiza-blush-2:#f0e4e1;
  --v-luiza-beige:#eee8df;
  --v-luiza-paper:#f8f4ef;
  --v-luiza-line:rgba(24,24,24,.16);
  --v-luiza-serif:"Bodoni 72",Didot,"Times New Roman",Georgia,serif;
  --v-luiza-sans:Inter,Arial,Helvetica,sans-serif;
  --v-luiza-chrome:linear-gradient(115deg,#5d5d5d 0%,#d7d7d7 12%,#fafafa 24%,#8b8b8b 38%,#f8f8f8 50%,#787878 64%,#e5e5e5 78%,#f9f9f9 88%,#777 100%);
  --v-luiza-chrome-soft:linear-gradient(115deg,#8d8d8d 0%,#f6f6f6 22%,#b5b5b5 40%,#fff 55%,#969696 72%,#ededed 100%);
}
html{background:var(--v-luiza-beige)!important}
body.v-luiza-chrome{background:var(--v-luiza-beige)!important;color:var(--v-luiza-ink)!important}
body.v-luiza-chrome #app{background:transparent!important}

/* Dark tailored navigation */
body.v-luiza-chrome header{
  background:rgba(23,23,23,.97)!important;
  border-bottom:1px solid rgba(255,255,255,.14)!important;
  box-shadow:0 10px 28px rgba(0,0,0,.08)!important;
  backdrop-filter:blur(14px);
}
body.v-luiza-chrome header a,
body.v-luiza-chrome header button,
body.v-luiza-chrome header [role="button"]{
  color:#f5f2ee!important;
}
body.v-luiza-chrome header input{
  background:#242424!important;
  color:#f7f5f2!important;
  border-color:rgba(255,255,255,.18)!important;
}
body.v-luiza-chrome header input::placeholder{color:#aaa!important}
body.v-luiza-chrome header .logo,
body.v-luiza-chrome header .brand,
body.v-luiza-chrome header [class*="logo"]{
  color:#f5f5f5!important;
  letter-spacing:-.035em!important;
}

/* Homepage cover: blush editorial, not a dark takeover */
body.v-luiza-home .hero{
  position:relative!important;
  overflow:hidden!important;
  color:var(--v-luiza-ink)!important;
  background:
    radial-gradient(circle at 86% 16%,rgba(255,255,255,.74),transparent 23%),
    linear-gradient(126deg,#ead7d5 0%,#e0ceca 43%,#eee7df 100%)!important;
  border-bottom:1px solid rgba(23,23,23,.14)!important;
  box-shadow:none!important;
}
body.v-luiza-home .hero:after{
  content:"";
  position:absolute;
  width:330px;
  height:76px;
  right:-58px;
  top:52px;
  border-radius:50%;
  background:var(--v-luiza-chrome-soft);
  opacity:.52;
  filter:blur(.2px);
  transform:rotate(-18deg);
  pointer-events:none;
  box-shadow:inset 0 1px 1px rgba(255,255,255,.8),0 18px 46px rgba(0,0,0,.10);
}
body.v-luiza-home .hero h1{
  position:relative!important;
  z-index:1!important;
  color:var(--v-luiza-ink)!important;
  font-family:var(--v-luiza-serif)!important;
  font-weight:400!important;
  letter-spacing:-.045em!important;
  line-height:.96!important;
  text-wrap:balance;
}
body.v-luiza-home .hero p{
  position:relative!important;
  z-index:1!important;
  color:#4d4845!important;
  font-family:var(--v-luiza-sans)!important;
  line-height:1.65!important;
}
body.v-luiza-home .hero .stage{position:relative!important;z-index:1!important}
body.v-luiza-home .hero .stage .photo{
  background:rgba(248,244,239,.92)!important;
  border:1px solid rgba(23,23,23,.20)!important;
  border-radius:10px!important;
  box-shadow:0 18px 42px rgba(38,29,26,.12)!important;
}

/* Editorial section system */
body.v-luiza-chrome .section,
body.v-luiza-chrome #app>section{
  background:var(--v-luiza-beige)!important;
  border-top:1px solid rgba(23,23,23,.09)!important;
}
body.v-luiza-chrome .section.v-luiza-paper{background:var(--v-luiza-paper)!important}
body.v-luiza-chrome .section.v-luiza-blush{background:var(--v-luiza-blush-2)!important}
body.v-luiza-chrome .section.v-luiza-dark,
body.v-luiza-chrome #skip-list{
  background:linear-gradient(145deg,#202020 0%,#303030 100%)!important;
  color:#f5f2ee!important;
  border-color:#151515!important;
}
body.v-luiza-chrome .section .head h1,
body.v-luiza-chrome .section .head h2,
body.v-luiza-chrome .section .head h3,
body.v-luiza-listing #app h1{
  color:var(--v-luiza-ink)!important;
  font-family:var(--v-luiza-serif)!important;
  font-weight:400!important;
  letter-spacing:-.035em!important;
  line-height:1!important;
}
body.v-luiza-chrome .section .head h2{font-size:clamp(36px,4vw,58px)!important}
body.v-luiza-chrome .section .head p{color:#5d5652!important}
body.v-luiza-chrome .section.v-luiza-dark .head h1,
body.v-luiza-chrome .section.v-luiza-dark .head h2,
body.v-luiza-chrome .section.v-luiza-dark .head h3,
body.v-luiza-chrome .section.v-luiza-dark .head p,
body.v-luiza-chrome #skip-list .head h1,
body.v-luiza-chrome #skip-list .head h2,
body.v-luiza-chrome #skip-list .head h3,
body.v-luiza-chrome #skip-list .head p{color:#f5f2ee!important}

/* Thin chrome rule = the recurring luxe signature */
body.v-luiza-chrome .section .head:before{
  content:"";
  display:block;
  width:62px;
  min-width:62px;
  height:4px;
  margin-right:14px;
  margin-bottom:8px;
  border-radius:999px;
  background:var(--v-luiza-chrome);
  box-shadow:0 1px 0 rgba(255,255,255,.7),0 2px 9px rgba(0,0,0,.08);
}
body.v-luiza-chrome .eyebrow,
body.v-luiza-chrome [class*="eyebrow"]{
  color:#555!important;
  font-family:var(--v-luiza-sans)!important;
  letter-spacing:.12em!important;
  text-transform:uppercase!important;
}
body.v-luiza-chrome .section.v-luiza-dark .eyebrow,
body.v-luiza-chrome .section.v-luiza-dark [class*="eyebrow"]{color:#cfcfcf!important}

/* Categories + gift filters */
body.v-luiza-chrome .category,
body.v-luiza-chrome .v-home-category-details>summary,
body.v-luiza-chrome .vyrdict-gift-filter-chip{
  background:rgba(248,244,239,.62)!important;
  border:1px solid rgba(31,31,31,.24)!important;
  color:var(--v-luiza-ink)!important;
  border-radius:999px!important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.72)!important;
  font-family:var(--v-luiza-sans)!important;
  font-weight:700!important;
}
body.v-luiza-chrome .category:hover,
body.v-luiza-chrome .v-home-category-details>summary:hover,
body.v-luiza-chrome .vyrdict-gift-filter-chip:hover,
body.v-luiza-chrome .vyrdict-gift-filter-chip.is-active{
  color:#111!important;
  background:var(--v-luiza-chrome-soft)!important;
  border-color:#8b8b8b!important;
  box-shadow:inset 0 1px 0 #fff,0 5px 14px rgba(0,0,0,.10)!important;
  transform:none!important;
}
body.v-luiza-chrome .vyrdict-gift-filter-label{color:#6b625f!important;letter-spacing:.10em!important}

/* Product cards: pearl paper, subtle metallic frame */
body.v-luiza-chrome .vyrdict-equal-card{
  position:relative!important;
  overflow:hidden!important;
  background:linear-gradient(150deg,#faf7f3 0%,#f1ebe5 100%)!important;
  border:1px solid rgba(39,39,39,.15)!important;
  border-radius:14px!important;
  box-shadow:0 8px 28px rgba(45,35,31,.06)!important;
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important;
}
body.v-luiza-chrome .vyrdict-equal-card:before{
  content:"";
  position:absolute;
  z-index:3;
  left:0;right:0;top:0;
  height:2px;
  background:var(--v-luiza-chrome-soft);
  opacity:.9;
}
body.v-luiza-chrome .vyrdict-equal-card:hover{
  transform:translateY(-3px)!important;
  border-color:rgba(39,39,39,.28)!important;
  box-shadow:0 14px 32px rgba(45,35,31,.10)!important;
}
body.v-luiza-chrome .vyrdict-equal-card .art{
  background:#e8dfd8!important;
  border-bottom:1px solid rgba(39,39,39,.10)!important;
}
body.v-luiza-chrome .vyrdict-card-title,
body.v-luiza-chrome .vyrdict-equal-card h3,
body.v-luiza-chrome .vyrdict-equal-card h4{
  color:var(--v-luiza-ink)!important;
  font-family:var(--v-luiza-serif)!important;
  font-weight:400!important;
  letter-spacing:-.018em!important;
}
body.v-luiza-chrome .vyrdict-card-actions a,
body.v-luiza-chrome .vyrdict-card-actions button{
  background:#1c1c1c!important;
  color:#f8f5f1!important;
  border-color:#1c1c1c!important;
  border-radius:999px!important;
  box-shadow:none!important;
}

/* Chrome used around scores, not behind the score text */
body.v-luiza-chrome .ring,
body.v-luiza-chrome [class*="score"] .ring{
  border-color:#a4a4a4!important;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.7),0 0 0 1px rgba(52,52,52,.08)!important;
}

/* Product detail */
body.v-luiza-product .productHero{
  background:linear-gradient(135deg,#eee3de 0%,#f3ede6 56%,#e4d7d4 100%)!important;
  border-top:1px solid rgba(23,23,23,.12)!important;
  border-bottom:1px solid rgba(23,23,23,.14)!important;
}
body.v-luiza-product .productHero .media{
  background:linear-gradient(145deg,#f7f3ef,#e3d9d2)!important;
  border:1px solid rgba(23,23,23,.16)!important;
  border-radius:14px!important;
  box-shadow:0 16px 36px rgba(44,34,31,.08)!important;
}
body.v-luiza-product .productHero .info>h1{
  font-family:var(--v-luiza-serif)!important;
  font-weight:400!important;
  letter-spacing:-.038em!important;
  line-height:.98!important;
}
body.v-luiza-product .story article{
  background:var(--v-luiza-paper)!important;
  border:1px solid rgba(23,23,23,.13)!important;
  border-radius:14px!important;
  box-shadow:0 8px 24px rgba(40,32,29,.05)!important;
}
body.v-luiza-product .story article:first-child{border-top:2px solid #b7b7b7!important}
body.v-luiza-product .story article:nth-child(2){border-top:2px solid #222!important}
body.v-luiza-product .story article h2,
body.v-luiza-product .story article h3{
  font-family:var(--v-luiza-serif)!important;
  font-weight:400!important;
}
body.v-luiza-product .geo-choice.on{
  color:#101010!important;
  background:var(--v-luiza-chrome-soft)!important;
  border-color:#8b8b8b!important;
}

/* Listing pages */
body.v-luiza-listing #app{background:var(--v-luiza-beige)!important}
body.v-luiza-listing #app h1{font-size:clamp(44px,5vw,70px)!important}

/* Footer */
body.v-luiza-chrome footer{
  background:linear-gradient(145deg,#181818,#292929)!important;
  color:#eee9e3!important;
  border-top:1px solid #111!important;
}
body.v-luiza-chrome footer a{color:#eee9e3!important}

@media(max-width:760px){
  body.v-luiza-home .hero:after{width:190px;height:48px;right:-68px;top:42px;opacity:.40}
  body.v-luiza-home .hero h1{font-size:clamp(43px,12vw,62px)!important;line-height:.96!important}
  body.v-luiza-chrome .section .head{align-items:flex-start!important}
  body.v-luiza-chrome .section .head:before{width:44px;min-width:44px;height:3px;margin-right:10px;margin-bottom:7px}
  body.v-luiza-chrome .section .head h2{font-size:clamp(32px,9vw,44px)!important}
  body.v-luiza-listing #app h1{font-size:clamp(40px,11vw,56px)!important}
  body.v-luiza-chrome .vyrdict-equal-card:hover{transform:none!important}
}
`;
    document.head.appendChild(s);
  }

  function normalize(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

  function classify(){
    const b=document.body;if(!b)return;
    BODY_CLASSES.forEach(c=>b.classList.remove(c));
    b.classList.add('v-luiza-chrome');
    const type=routeType();
    if(type==='home')b.classList.add('v-luiza-home');
    if(type==='product')b.classList.add('v-luiza-product');
    if(type==='listing')b.classList.add('v-luiza-listing');
  }

  function moodSections(){
    const secs=[...document.querySelectorAll('.section, #app>section')];
    secs.forEach(s=>s.classList.remove('v-luiza-paper','v-luiza-blush','v-luiza-dark'));
    if(routeType()!=='home')return;
    let index=0;
    for(const sec of secs){
      if(sec.classList.contains('hero')||sec.closest('.hero'))continue;
      const h=normalize(sec.querySelector('h1,h2,h3')?.textContent);
      if(sec.id==='skip-list'||h.includes('skip list')){
        sec.classList.add('v-luiza-dark');
      }else if(h.includes('seen on screen')||h.includes('celebrity')||h.includes('everyone bought')){
        sec.classList.add('v-luiza-blush');
      }else if(h.includes('browse by category')||h.includes('gifts')){
        sec.classList.add('v-luiza-paper');
      }else{
        if(index%3===1)sec.classList.add('v-luiza-paper');
        index++;
      }
    }
  }

  function apply(){installStyle();classify();moodSections()}
  function queue(){clearTimeout(timer);timer=setTimeout(apply,60)}
  function boot(){
    apply();
    [120,450,1000,2200].forEach(ms=>setTimeout(apply,ms));
    const root=document.getElementById('app')||document.body;
    if(root&&!root.__vLuizaObserver){
      const mo=new MutationObserver(queue);
      mo.observe(root,{childList:true,subtree:true});
      root.__vLuizaObserver=mo;
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(boot,40));
  addEventListener('hashchange',()=>setTimeout(boot,40));
  addEventListener('pageshow',()=>setTimeout(boot,40));
})();
