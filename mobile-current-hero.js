(()=>{
  if(window.__vyrdictMobileCurrentHero)return;
  window.__vyrdictMobileCurrentHero=1;
  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const HOME=()=>location.pathname==='/'||location.pathname==='';
  const STYLE_ID='vyrdict-mobile-current-hero-style';
  const LAYER_ID='vyrdict-mobile-current-static-layer';
  const PICKS=['owala-freesip','dji-osmo-pocket-3','rare-beauty-soft-pinch-liquid-blush','puma-speedcat-ballet'];
  const catalog=()=>Array.isArray(window.__VYRDICT_BOOT_DATA?.p)?window.__VYRDICT_BOOT_DATA.p:[];
  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .hero.vyrdict-current-static{
        position:relative!important;isolation:isolate!important;overflow:visible!important;
        background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important
      }
      .hero.vyrdict-current-static::before{
        content:'';position:absolute;z-index:0;top:0;left:50%;width:calc(100vw + 4px);
        height:var(--vyrdict-static-hero-h,520px);transform:translateX(-50%);pointer-events:none;
        background:radial-gradient(ellipse at 78% 38%,rgba(52,49,47,.22),transparent 37%),radial-gradient(ellipse at 42% 72%,rgba(255,255,255,.20),transparent 34%),linear-gradient(108deg,#d8d5d1 0%,#d0cdca 33%,#c3c0bd 67%,#b7b4b1 100%)
      }
      .hero.vyrdict-current-static::after{
        content:'';position:absolute;z-index:2;top:0;left:50%;width:calc(100vw + 4px);
        height:var(--vyrdict-static-hero-h,520px);transform:translateX(-50%);pointer-events:none;
        background:linear-gradient(90deg,rgba(218,215,211,.95) 0%,rgba(214,211,207,.88) 34%,rgba(205,202,198,.58) 51%,rgba(193,190,187,.10) 74%,transparent 100%)
      }
      .hero.vyrdict-current-static>:not(#${LAYER_ID}):not(.section){position:relative;z-index:3}
      .hero.vyrdict-current-static .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #${LAYER_ID}{position:absolute;z-index:1;top:0;left:50%;width:calc(100vw + 4px);height:var(--vyrdict-static-hero-h,520px);transform:translateX(-50%);overflow:hidden;pointer-events:none}
      #${LAYER_ID} .vms-product{position:absolute;filter:drop-shadow(0 12px 18px rgba(34,31,29,.20));pointer-events:none}
      #${LAYER_ID} img{display:block;width:100%;height:100%;object-fit:contain;background:transparent!important;border:0!important;box-shadow:none!important}
    `;document.head.appendChild(s)
  }
  function sync(hero,stage){
    const hr=hero.getBoundingClientRect(),sr=stage.getBoundingClientRect();let bottom=sr.bottom;
    for(const el of hero.querySelectorAll('h1,form,input,.search,.actions,.cta,.hero-copy,.heroCopy')){const r=el.getBoundingClientRect();if(r.top<sr.bottom+80&&r.bottom>hr.top)bottom=Math.max(bottom,r.bottom)}
    hero.style.setProperty('--vyrdict-static-hero-h',`${Math.max(320,Math.ceil(bottom-hr.top+24))}px`)
  }
  function mount(){
    const old=document.getElementById(LAYER_ID);
    if(!HOME()||!REDUCED.matches){old?.remove();document.querySelector('.hero.vyrdict-current-static')?.classList.remove('vyrdict-current-static');return}
    const stage=document.querySelector('.stage');if(!stage)return false;
    const hero=stage.closest('.hero')||stage.closest('section')||stage.parentElement;if(!hero)return false;
    const p=PICKS.map(slug=>catalog().find(x=>x?.slug===slug&&x.image_url)).filter(Boolean);if(p.length<3)return false;
    style();hero.classList.add('vyrdict-current-static');sync(hero,stage);
    old?.remove();const layer=document.createElement('div');layer.id=LAYER_ID;hero.appendChild(layer);
    const boxes=[{l:'58%',t:'9%',w:'36%',h:'45%'},{l:'68%',t:'43%',w:'29%',h:'45%'},{l:'40%',t:'48%',w:'28%',h:'39%'},{l:'50%',t:'22%',w:'24%',h:'34%'}];
    p.slice(0,4).forEach((x,i)=>{const b=boxes[i],d=document.createElement('div');d.className='vms-product';Object.assign(d.style,{left:b.l,top:b.t,width:b.w,height:b.h});const img=document.createElement('img');img.src=x.image_url;img.alt='';img.setAttribute('aria-hidden','true');d.appendChild(img);layer.appendChild(d)});
    return true
  }
  function boot(){let n=0;const go=()=>{if(mount()||n++>30)return;setTimeout(go,120)};go()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('resize',()=>setTimeout(mount,40),{passive:true});addEventListener('popstate',()=>setTimeout(boot,40));addEventListener('hashchange',()=>setTimeout(boot,40));REDUCED.addEventListener?.('change',()=>setTimeout(boot,20));
})();