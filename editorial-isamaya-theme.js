(()=>{
  if(window.__vyrdictEditorialIsamayaV1)return;
  window.__vyrdictEditorialIsamayaV1=1;

  const STYLE_ID='vyrdict-editorial-isamaya-style-v1';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
  let timer=0,observer=null;

  function routeType(){
    const p=location.pathname||'/';
    if(p==='/'||p==='')return'home';
    if(/^\/product\//i.test(p))return'product';
    if(/^\/(category|collection)\//i.test(p))return'listing';
    return'other';
  }

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
:root{
  --v-editorial-ink:#151210;
  --v-editorial-ivory:#f4efe7;
  --v-editorial-paper:#fbf8f2;
  --v-editorial-blush:#ead3d5;
  --v-editorial-taupe:#d8cec6;
  --v-editorial-red:#d83a32;
  --v-editorial-line:rgba(21,18,16,.22);
  --v-editorial-serif:"Iowan Old Style",Baskerville,"Times New Roman",Georgia,serif;
  --v-editorial-sans:Arial,Helvetica,sans-serif;
}
html{background:var(--v-editorial-ivory)!important}
body.v-editorial-site{background:var(--v-editorial-ivory)!important;color:var(--v-editorial-ink)!important}
body.v-editorial-site #app{background:var(--v-editorial-ivory)!important}
body.v-editorial-site img{filter:none!important}

body.v-editorial-site header{
  background:rgba(244,239,231,.96)!important;
  border-bottom:1px solid rgba(21,18,16,.18)!important;
  box-shadow:none!important;
  backdrop-filter:blur(14px);
}
body.v-editorial-site header a,
body.v-editorial-site header button{
  font-family:var(--v-editorial-sans)!important;
  letter-spacing:.055em!important;
}
body.v-editorial-site header .logo,
body.v-editorial-site header .brand,
body.v-editorial-site header [class*="logo"]{
  letter-spacing:-.055em!important;
}

body.v-editorial-home .hero{
  position:relative!important;
  overflow:hidden!important;
  background:var(--v-editorial-ink)!important;
  color:var(--v-editorial-ivory)!important;
  border-bottom:1px solid #000!important;
  padding-top:56px!important;
  padding-bottom:54px!important;
}
body.v-editorial-home .hero:before{
  content:"";
  position:absolute;
  inset:0;
  pointer-events:none;
  background:
    radial-gradient(circle at 82% 18%,rgba(216,58,50,.22),transparent 28%),
    linear-gradient(120deg,rgba(255,255,255,.035),transparent 38%);
}
body.v-editorial-home .hero h1{
  position:relative!important;
  z-index:1!important;
  max-width:900px!important;
  color:var(--v-editorial-ivory)!important;
  font-family:var(--v-editorial-serif)!important;
  font-size:clamp(58px,7vw,104px)!important;
  font-weight:400!important;
  line-height:.88!important;
  letter-spacing:-.055em!important;
  text-wrap:balance;
}
body.v-editorial-home .hero p{
  position:relative!important;
  z-index:1!important;
  color:#d7cec4!important;
  max-width:620px!important;
  font:500 14px/1.68 var(--v-editorial-sans)!important;
  letter-spacing:.012em!important;
}
body.v-editorial-home .hero .stage{position:relative!important;z-index:1!important}
body.v-editorial-home .hero .stage .photo{
  border:1px solid rgba(244,239,231,.72)!important;
  border-radius:2px!important;
  background:#f7f2eb!important;
  box-shadow:0 18px 45px rgba(0,0,0,.24)!important;
}
body.v-editorial-home .hero .stage .photo img{
  background:#f7f2eb!important;
  padding:4px!important;
}
body.v-editorial-home .hero .sticker.spark{color:var(--v-editorial-red)!important}

body.v-editorial-site .section{
  border-top:1px solid rgba(21,18,16,.12)!important;
  background:var(--v-editorial-ivory)!important;
}
body.v-editorial-site .section .head{align-items:flex-end!important}
body.v-editorial-site .section .head h1,
body.v-editorial-site .section .head h2,
body.v-editorial-site .section .head h3,
body.v-editorial-listing #app h1{
  font-family:var(--v-editorial-serif)!important;
  font-weight:400!important;
  line-height:.94!important;
  letter-spacing:-.045em!important;
  color:var(--v-editorial-ink)!important;
  text-wrap:balance;
}
body.v-editorial-site .section .head h2{font-size:clamp(42px,5vw,72px)!important}
body.v-editorial-listing #app h1{font-size:clamp(50px,6vw,86px)!important}
body.v-editorial-site .section .head h2:after,
body.v-editorial-site .section .head h3:after{
  content:"";
  display:block;
  width:44px;
  height:3px;
  margin-top:13px;
  background:var(--v-editorial-red);
}
body.v-editorial-site .section .head p{
  color:#625a53!important;
  font:500 13px/1.6 var(--v-editorial-sans)!important;
}
body.v-editorial-site .eyebrow,
body.v-editorial-site .skipflag,
body.v-editorial-site [class*="eyebrow"]{
  color:var(--v-editorial-red)!important;
  font-family:var(--v-editorial-sans)!important;
  font-weight:900!important;
  letter-spacing:.12em!important;
  text-transform:uppercase!important;
}

body.v-editorial-site .section.v-editorial-dark,
body.v-editorial-site #skip-list{
  background:var(--v-editorial-ink)!important;
  color:var(--v-editorial-ivory)!important;
  border-color:#000!important;
}
body.v-editorial-site .section.v-editorial-dark .head h1,
body.v-editorial-site .section.v-editorial-dark .head h2,
body.v-editorial-site .section.v-editorial-dark .head h3,
body.v-editorial-site .section.v-editorial-dark .head p,
body.v-editorial-site #skip-list .head h1,
body.v-editorial-site #skip-list .head h2,
body.v-editorial-site #skip-list .head h3,
body.v-editorial-site #skip-list .head p{color:var(--v-editorial-ivory)!important}
body.v-editorial-site .section.v-editorial-dark .head p,
body.v-editorial-site #skip-list .head p{color:#cabfb6!important}
body.v-editorial-site .section.v-editorial-blush{background:var(--v-editorial-blush)!important}
body.v-editorial-site .section.v-editorial-paper{background:var(--v-editorial-paper)!important}

body.v-editorial-site .category,
body.v-editorial-site .v-home-category-details>summary,
body.v-editorial-site .vyrdict-gift-filter-chip{
  border:1px solid rgba(21,18,16,.38)!important;
  border-radius:2px!important;
  background:transparent!important;
  color:var(--v-editorial-ink)!important;
  box-shadow:none!important;
  font-family:var(--v-editorial-sans)!important;
  font-weight:900!important;
  letter-spacing:.08em!important;
  text-transform:uppercase!important;
}
body.v-editorial-site .category:hover,
body.v-editorial-site .v-home-category-details>summary:hover,
body.v-editorial-site .vyrdict-gift-filter-chip:hover,
body.v-editorial-site .vyrdict-gift-filter-chip.is-active{
  background:var(--v-editorial-ink)!important;
  border-color:var(--v-editorial-ink)!important;
  color:var(--v-editorial-ivory)!important;
  transform:none!important;
}
body.v-editorial-site .vyrdict-gift-filter-label{
  color:#6b625b!important;
  letter-spacing:.13em!important;
}

body.v-editorial-site .vyrdict-equal-card{
  overflow:hidden!important;
  border:1px solid rgba(21,18,16,.20)!important;
  border-radius:2px!important;
  background:var(--v-editorial-paper)!important;
  box-shadow:none!important;
  transition:transform .18s ease,border-color .18s ease!important;
}
body.v-editorial-site .vyrdict-equal-card:hover{
  transform:translateY(-3px)!important;
  border-color:rgba(21,18,16,.52)!important;
}
body.v-editorial-site .vyrdict-equal-card .art{
  background:#e9e2da!important;
  border-bottom:1px solid rgba(21,18,16,.18)!important;
  border-radius:0!important;
  overflow:hidden!important;
}
body.v-editorial-site .vyrdict-equal-card .art img{
  filter:none!important;
  mix-blend-mode:normal!important;
  transform:none!important;
}
body.v-editorial-site .vyrdict-card-title,
body.v-editorial-site .vyrdict-equal-card h3,
body.v-editorial-site .vyrdict-equal-card h4{
  font-family:var(--v-editorial-serif)!important;
  font-weight:400!important;
  letter-spacing:-.025em!important;
  line-height:1.02!important;
}
body.v-editorial-site .vyrdict-card-actions a,
body.v-editorial-site .vyrdict-card-actions button,
body.v-editorial-site a[class*="cta"],
body.v-editorial-site button[class*="cta"]{
  border-radius:2px!important;
  box-shadow:none!important;
}
body.v-editorial-site .vyrdict-card-actions a,
body.v-editorial-site .vyrdict-card-actions button{
  background:var(--v-editorial-ink)!important;
  color:var(--v-editorial-ivory)!important;
  border-color:var(--v-editorial-ink)!important;
  letter-spacing:.075em!important;
  text-transform:uppercase!important;
}
body.v-editorial-site .ring,
body.v-editorial-site [class*="score"] .ring{box-shadow:none!important}

body.v-editorial-product .productHero{
  background:var(--v-editorial-paper)!important;
  border-top:1px solid rgba(21,18,16,.2)!important;
  border-bottom:1px solid rgba(21,18,16,.24)!important;
}
body.v-editorial-product .productHero .media{
  background:#e9e2da!important;
  border:1px solid rgba(21,18,16,.22)!important;
  border-radius:2px!important;
  box-shadow:none!important;
}
body.v-editorial-product .productHero .media img{filter:none!important}
body.v-editorial-product .productHero .info>h1{
  font-family:var(--v-editorial-serif)!important;
  font-size:clamp(48px,5.7vw,84px)!important;
  line-height:.9!important;
  font-weight:400!important;
  letter-spacing:-.052em!important;
}
body.v-editorial-product .story{gap:18px!important}
body.v-editorial-product .story article{
  border:1px solid rgba(21,18,16,.20)!important;
  border-radius:2px!important;
  background:var(--v-editorial-paper)!important;
  box-shadow:none!important;
}
body.v-editorial-product .story article:nth-child(2){border-top:4px solid var(--v-editorial-red)!important}
body.v-editorial-product .story article h2,
body.v-editorial-product .story article h3{
  font-family:var(--v-editorial-serif)!important;
  font-weight:400!important;
  letter-spacing:-.025em!important;
}
body.v-editorial-product .retailer,
body.v-editorial-product .geo-choice,
body.v-editorial-product .market-summary,
body.v-editorial-product .score-trust-strip{
  border-radius:2px!important;
  box-shadow:none!important;
}
body.v-editorial-product .geo-choice.on{
  background:var(--v-editorial-ink)!important;
  color:var(--v-editorial-ivory)!important;
}

body.v-editorial-listing .section:first-of-type,
body.v-editorial-listing #app>section:first-of-type{background:var(--v-editorial-paper)!important}
body.v-editorial-listing .rail,
body.v-editorial-listing [class*="grid"]{gap:18px!important}

body.v-editorial-site footer{
  background:var(--v-editorial-ink)!important;
  color:var(--v-editorial-ivory)!important;
  border-top:1px solid #000!important;
}
body.v-editorial-site footer a{color:var(--v-editorial-ivory)!important}

@media(max-width:760px){
  body.v-editorial-home .hero{padding-top:38px!important;padding-bottom:40px!important}
  body.v-editorial-home .hero h1{font-size:clamp(48px,14vw,72px)!important;line-height:.9!important}
  body.v-editorial-home .hero p{font-size:13px!important;line-height:1.6!important}
  body.v-editorial-site .section{padding-top:54px!important;padding-bottom:54px!important}
  body.v-editorial-site .section .head{align-items:flex-start!important}
  body.v-editorial-site .section .head h2{font-size:clamp(38px,11vw,54px)!important}
  body.v-editorial-listing #app h1{font-size:clamp(44px,13vw,64px)!important}
  body.v-editorial-product .productHero .info>h1{font-size:clamp(42px,12vw,60px)!important}
  body.v-editorial-site .vyrdict-equal-card:hover{transform:none!important}
}
`;
    document.head.appendChild(s);
  }

  function sectionHeading(sec){
    return norm(sec?.querySelector('h1,h2,h3')?.textContent||'');
  }

  function moodSections(){
    const type=routeType();
    const sections=[...document.querySelectorAll('.section,section')].filter(s=>s.closest('#app')||s.id==='skip-list');
    for(const sec of sections)sec.classList.remove('v-editorial-dark','v-editorial-blush','v-editorial-paper');
    if(type!=='home')return;
    let visualIndex=0;
    for(const sec of sections){
      if(sec.closest('.hero')||sec.classList.contains('hero'))continue;
      const h=sectionHeading(sec);
      if(sec.id==='skip-list'||h.includes('skip list')||h.includes('viral worth it')){
        sec.classList.add('v-editorial-dark');
      }else if(h.includes('seen on screen')||h.includes('everyone bought it')||h.includes('celebrity')){
        sec.classList.add('v-editorial-blush');
      }else if(h.includes('browse by category')||h.includes('gifts')){
        sec.classList.add('v-editorial-paper');
      }else{
        const mode=visualIndex%4;
        if(mode===1)sec.classList.add('v-editorial-paper');
        if(mode===3)sec.classList.add('v-editorial-blush');
        visualIndex++;
      }
    }
  }

  function classify(){
    const b=document.body;if(!b)return;
    const type=routeType();
    b.classList.add('v-editorial-site');
    b.classList.toggle('v-editorial-home',type==='home');
    b.classList.toggle('v-editorial-product',type==='product');
    b.classList.toggle('v-editorial-listing',type==='listing');
    b.classList.toggle('v-editorial-other',type==='other');
  }

  function apply(){addStyle();classify();moodSections()}
  function queue(delay=40){clearTimeout(timer);timer=setTimeout(apply,delay)}
  function boot(){
    apply();
    [80,220,600,1200,2400].forEach(ms=>setTimeout(apply,ms));
    const root=document.getElementById('app')||document.body;
    if(root&&observer?.target!==root){
      observer?.mo?.disconnect();
      const mo=new MutationObserver(()=>queue(50));
      mo.observe(root,{childList:true,subtree:true});
      observer={target:root,mo};
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('popstate',()=>setTimeout(boot,20));
  addEventListener('hashchange',()=>setTimeout(boot,20));
  addEventListener('pageshow',()=>setTimeout(boot,20));
})();
