(()=>{
  if(window.__vyrdictHeroV8)return;
  window.__vyrdictHeroV8=1;

  const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const REDUCED=matchMedia('(prefers-reduced-motion: reduce)');
  const MOBILE=matchMedia('(max-width:700px)');
  const STYLE_ID='vyrdict-hero-v8-style';
  const LAYER_ID='vyrdict-hero-v8-layer';
  let hero=null,stage=null,token=0,resizeTimer=0;

  const home=()=>location.pathname==='/'||location.pathname==='';
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  function style(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
      .hero.vyrdict-hero-v8{position:relative!important;isolation:isolate!important;overflow:visible!important;background:transparent!important;border:0!important;outline:0!important;box-shadow:none!important}
      .hero.vyrdict-hero-v8::before{content:'';position:absolute;z-index:0;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-hero-h,520px);transform:translateX(-50%);pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important;background:radial-gradient(ellipse at 78% 38%,rgba(52,49,47,.22),transparent 37%),radial-gradient(ellipse at 42% 72%,rgba(255,255,255,.20),transparent 34%),linear-gradient(108deg,#d8d5d1 0%,#d0cdca 33%,#c3c0bd 67%,#b7b4b1 100%)}
      .hero.vyrdict-hero-v8::after{content:'';position:absolute;z-index:2;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-hero-h,520px);transform:translateX(-50%);pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important;background:linear-gradient(90deg,rgba(218,215,211,.96) 0%,rgba(216,213,209,.93) 20%,rgba(211,208,204,.82) 36%,rgba(205,202,198,.48) 48%,rgba(194,191,187,.10) 62%,rgba(188,185,182,0) 74%)}
      .hero.vyrdict-hero-v8>:not(#${LAYER_ID}):not(.section){position:relative;z-index:3}
      .hero.vyrdict-hero-v8 .section{position:relative;z-index:auto}
      .hero.vyrdict-hero-v8 .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important}
      #${LAYER_ID}{position:absolute;z-index:1;top:0;left:50%;width:calc(100vw + 6px);height:var(--vyrdict-hero-h,520px);transform:translateX(-50%);overflow:hidden;pointer-events:none;border:0!important;outline:0!important;box-shadow:none!important}
      #${LAYER_ID} .vh8-product{position:absolute;display:block;pointer-events:none;transform-origin:center;will-change:transform,opacity,filter;filter:drop-shadow(0 18px 24px rgba(34,31,29,.24))}
      #${LAYER_ID} .vh8-product img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;background:transparent!important;padding:0!important;border:0!important;box-shadow:none!important;transform:none!important}
      @media(max-width:700px){.hero.vyrdict-hero-v8::after{background:linear-gradient(90deg,rgba(218,215,211,.96) 0%,rgba(214,211,207,.91) 32%,rgba(205,202,198,.63) 50%,rgba(193,190,187,.13) 73%,transparent 100%)}#${LAYER_ID} .vh8-product{filter:drop-shadow(0 12px 18px rgba(34,31,29,.20))}}
    `;document.head.appendChild(s)
  }

  function syncHeight(){
    if(!hero||!stage)return;
    const hr=hero.getBoundingClientRect(),sr=stage.getBoundingClientRect();let bottom=sr.bottom;
    for(const el of hero.querySelectorAll('h1,form,input,.search,.actions,.cta,.hero-copy,.heroCopy')){const r=el.getBoundingClientRect();if(r.top<sr.bottom+100&&r.bottom>hr.top)bottom=Math.max(bottom,r.bottom)}
    hero.style.setProperty('--vyrdict-hero-h',`${Math.max(MOBILE.matches?430:360,Math.ceil(bottom-hr.top+28))}px`)
  }

  function layer(){
    document.getElementById(LAYER_ID)?.remove();
    const l=document.createElement('div');l.id=LAYER_ID;hero.appendChild(l);return l
  }

  function cutout(l,p,b){
    const d=document.createElement('div');d.className='vh8-product';Object.assign(d.style,{left:b.l,top:b.t,width:b.w,height:b.h});
    const i=document.createElement('img');i.src=p.image_url;i.alt='';i.setAttribute('aria-hidden','true');i.decoding='async';i.loading='eager';d.appendChild(i);l.appendChild(d);return d
  }

  async function products(){
    try{
      const r=await fetch(FEED,{cache:'no-store'});if(!r.ok)throw 0;const d=await r.json();
      const all=[...(d.trending||[]),...(d.worth||[]),...(d.skip||[])],out=[],seen=new Set();
      for(const p of all){if(p?.image_url&&/^https:\/\//i.test(String(p.image_url))&&!seen.has(p.slug)){out.push(p);seen.add(p.slug)}}
      if(out.length>=6)return out
    }catch{}
    if(MOBILE.matches)return [];
    const imgs=[...stage.querySelectorAll('img')].map((i,n)=>({slug:`fallback-${n}`,image_url:i.currentSrc||i.src})).filter(x=>/^https?:\/\//i.test(x.image_url));
    return imgs
  }

  async function preload(ps){await Promise.all(ps.slice(0,10).map(p=>new Promise(resolve=>{const i=new Image();let done=0;const end=()=>{if(done)return;done=1;resolve()};i.onload=end;i.onerror=end;i.src=p.image_url;setTimeout(end,1800)})))}

  function staticScene(ps){
    const l=layer(),cfg=MOBILE.matches?
      [{l:'58%',t:'8%',w:'36%',h:'42%'},{l:'67%',t:'42%',w:'30%',h:'43%'},{l:'40%',t:'50%',w:'27%',h:'36%'},{l:'48%',t:'24%',w:'24%',h:'31%'}]:
      [{l:'67%',t:'8%',w:'25%',h:'45%'},{l:'73%',t:'45%',w:'22%',h:'43%'},{l:'48%',t:'50%',w:'22%',h:'37%'},{l:'54%',t:'18%',w:'19%',h:'32%'}];
    ps.slice(0,4).forEach((p,i)=>cutout(l,p,cfg[i]))
  }

  async function fall(ps,t){
    const l=layer(),use=ps.slice(0,MOBILE.matches?7:10);await preload(use);if(t!==token)return;
    const spots=MOBILE.matches?[0,15,30,45,60,75,88]:[0,10,20,30,40,50,60,70,80,90];
    use.forEach((p,i)=>{const size=MOBILE.matches?20+(i%3)*3:11+(i%4)*2,el=cutout(l,p,{l:`${spots[i]}%`,t:`${10+(i%3)*24}%`,w:`${size}%`,h:MOBILE.matches?'31%':'36%'}),sx=(i%2?-18:18)+(i%3)*4,rot=i%2?22:-22;el.animate([{opacity:0,transform:`translate3d(${sx}vw,-72vh,0) rotate(${rot}deg) scale(.45)`,filter:'blur(7px)'},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1)',filter:'blur(0)'}],{duration:850+(i%4)*90,delay:i*80,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'})});
    await sleep(2300);if(t!==token)return;[...l.children].forEach((el,i)=>{const dir=i%2?-1:1;el.animate([{opacity:1,transform:'translate3d(0,0,0) scale(1)'},{opacity:0,transform:`translate3d(${dir*112}vw,${(i%3-1)*8}vh,0) rotate(${dir*18}deg) scale(.72)`,filter:'blur(5px)'}],{duration:680,delay:i*25,easing:'cubic-bezier(.55,0,.75,.1)',fill:'forwards'})});await sleep(850)
  }

  async function cross(ps,t){
    const l=layer(),use=ps.slice(2,8);await preload(use);if(t!==token)return;
    const lanes=MOBILE.matches?[11,35,58,20,48,65]:[9,26,44,17,55,33];
    use.forEach((p,i)=>{const left=i%2===0,size=MOBILE.matches?27-(i%2)*3:18-(i%3)*2,el=cutout(l,p,{l:left?'-24%':'103%',t:`${lanes[i]}%`,w:`${size}%`,h:MOBILE.matches?'36%':'43%'}),travel=MOBILE.matches?134:126;el.animate([{opacity:0,transform:`translate3d(${left?-8:8}vw,0,0) rotate(${left?-12:12}deg) scale(.7)`},{opacity:1,transform:`translate3d(${left?travel*.58:-travel*.58}vw,0,0) rotate(0deg) scale(1.04)`,offset:.55},{opacity:0,transform:`translate3d(${left?travel:-travel}vw,0,0) rotate(${left?13:-13}deg) scale(.72)`}],{duration:3200,delay:i*330,easing:'cubic-bezier(.42,0,.2,1)',fill:'both'})});await sleep(4550)
  }

  async function spotlight(ps,t){
    const l=layer(),use=[ps[1],ps[5],ps[8]||ps[3]].filter(Boolean);await preload(use);if(t!==token)return;
    const cfg=MOBILE.matches?[{l:'1%',t:'15%',w:'43%',h:'58%',from:'-76vw',to:'73vw'},{l:'29%',t:'20%',w:'45%',h:'59%',from:'84vw',to:'-78vw'},{l:'59%',t:'12%',w:'40%',h:'63%',from:'-88vw',to:'63vw'}]:[{l:'3%',t:'10%',w:'28%',h:'68%',from:'-52vw',to:'82vw'},{l:'35%',t:'16%',w:'30%',h:'66%',from:'72vw',to:'-78vw'},{l:'69%',t:'8%',w:'27%',h:'70%',from:'-82vw',to:'52vw'}];
    use.forEach((p,i)=>{const b=cfg[i],el=cutout(l,p,b);el.animate([{opacity:0,transform:`translate3d(${b.from},0,0) rotate(${i%2?-10:10}deg) scale(.62)`,filter:'blur(8px)'},{opacity:1,transform:'translate3d(0,0,0) rotate(0deg) scale(1.06)',offset:.35,filter:'blur(0)'},{opacity:1,transform:'translate3d(0,0,0) scale(1)',offset:.64},{opacity:0,transform:`translate3d(${b.to},0,0) rotate(${i%2?12:-12}deg) scale(.72)`,filter:'blur(5px)'}],{duration:3500,delay:i*700,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'})});await sleep(5250)
  }

  async function animate(ps,t){while(t===token&&home()&&!REDUCED.matches){await fall(ps,t);if(t!==token)break;await cross(ps,t);if(t!==token)break;await spotlight(ps,t)}}

  async function mount(attempt=0){
    if(!home()){cleanup();return}
    style();stage=document.querySelector('.stage');if(!stage){if(attempt<40)setTimeout(()=>mount(attempt+1),100);return}
    hero=stage.closest('.hero')||stage.closest('section')||stage.parentElement;if(!hero){if(attempt<40)setTimeout(()=>mount(attempt+1),100);return}
    document.getElementById('vyrdict-mobile-current-static-layer')?.remove();hero.classList.remove('vyrdict-current-static','vyrdict-fullwidth-motion');hero.classList.add('vyrdict-hero-v8');hero.dataset.vyrdictHeroVersion='8';syncHeight();requestAnimationFrame(syncHeight);
    const t=++token,ps=await products();if(t!==token||!ps.length)return;
    if(REDUCED.matches||typeof Element.prototype.animate!=='function'){staticScene(ps);return}
    animate(ps,t)
  }

  function cleanup(){token++;document.getElementById(LAYER_ID)?.remove();if(hero){hero.classList.remove('vyrdict-hero-v8');hero.removeAttribute('data-vyrdict-hero-version');hero.style.removeProperty('--vyrdict-hero-h')}}

  const boot=()=>mount();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{syncHeight()},80)},{passive:true});
  addEventListener('popstate',()=>setTimeout(boot,30));addEventListener('hashchange',()=>setTimeout(boot,30));REDUCED.addEventListener?.('change',()=>setTimeout(boot,20));
})();