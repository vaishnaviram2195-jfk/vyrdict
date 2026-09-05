(()=>{
  if(window.__vyrdictMobileHeroPrimaryV2)return;
  window.__vyrdictMobileHeroPrimaryV2=1;
  const M=matchMedia('(max-width:700px)'),HOME=()=>location.pathname==='/'||location.pathname==='';
  if(!M.matches||!HOME())return;
  const FEED='https://shmbvkjzeqqxybweyowj.supabase.co/functions/v1/vyrdict-home-feed';
  const L='vyrdict-mobile-hero-primary-layer',S='vyrdict-mobile-hero-primary-style';

  function css(){
    if(document.getElementById(S))return;
    const s=document.createElement('style');s.id=S;s.textContent=`
    @media(max-width:700px){
      .hero.vyrdict-mobile-hero-primary{position:relative!important;isolation:isolate!important;overflow:hidden!important;background:linear-gradient(108deg,#d8d5d1,#c9c6c2 55%,#bbb8b4)!important}
      .hero.vyrdict-mobile-hero-primary::before{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(90deg,rgba(218,215,211,.97) 0%,rgba(214,211,207,.90) 34%,rgba(203,200,196,.52) 58%,transparent 86%)}
      .hero.vyrdict-mobile-hero-primary>:not(#${L}):not(.stage){position:relative!important;z-index:3!important}
      .hero.vyrdict-mobile-hero-primary .stage{visibility:hidden!important;opacity:0!important;pointer-events:none!important;min-height:260px!important}
      #${L}{position:absolute;inset:0;z-index:1;overflow:hidden;pointer-events:none}
      #${L} .vmhp-group{position:absolute;inset:0;animation:vmhpGroup 15s ease-in-out infinite alternate;will-change:transform}
      #${L} .vmhp-item{position:absolute;filter:drop-shadow(0 12px 18px rgba(34,31,29,.20));animation:vmhpItem 8s ease-in-out infinite alternate;will-change:transform}
      #${L} .vmhp-item:nth-child(2){animation-duration:9.5s;animation-delay:-2s}#${L} .vmhp-item:nth-child(3){animation-duration:10.5s;animation-delay:-4s}#${L} .vmhp-item:nth-child(4){animation-duration:8.7s;animation-delay:-1.2s}#${L} .vmhp-item:nth-child(5){animation-duration:11s;animation-delay:-5s}#${L} .vmhp-item:nth-child(6){animation-duration:9.2s;animation-delay:-3s}
      #${L} img{width:100%;height:100%;display:block;object-fit:contain;background:transparent!important;border:0!important;box-shadow:none!important}
      @keyframes vmhpGroup{from{transform:translate3d(-2vw,-1vh,0) scale(1)}to{transform:translate3d(3vw,1.5vh,0) scale(1.025)}}
      @keyframes vmhpItem{from{transform:translate3d(0,-6px,0) rotate(-2deg)}to{transform:translate3d(8px,9px,0) rotate(2deg)}}
      @media(prefers-reduced-motion:reduce){#${L} .vmhp-group,#${L} .vmhp-item{animation:none!important}}
    }`;
    document.head.appendChild(s);
  }

  async function products(){
    try{
      const c=new AbortController(),t=setTimeout(()=>c.abort(),2500);
      const r=await fetch(FEED,{cache:'no-store',signal:c.signal});clearTimeout(t);if(!r.ok)return[];
      const d=await r.json(),all=[...(d.trending||[]),...(d.worth||[]),...(d.skip||[])],out=[],seen=new Set();
      for(const p of all){const u=String(p?.image_url||''),k=String(p?.slug||u);if(/^https:\/\//i.test(u)&&!seen.has(k)){out.push(p);seen.add(k);if(out.length===6)break}}
      return out;
    }catch{return[]}
  }

  function draw(hero,ps){
    if(!hero||ps.length<3)return false;css();
    hero.classList.remove('vyrdict-hero-v8','vyrdict-current-static','vyrdict-fullwidth-motion');hero.classList.add('vyrdict-mobile-hero-primary');hero.dataset.vyrdictHeroVersion='mobile-primary-2';
    document.getElementById('vyrdict-hero-v8-layer')?.remove();document.getElementById('vyrdict-mobile-current-static-layer')?.remove();document.getElementById('vyrdict-mobile-motion-layer')?.remove();document.getElementById(L)?.remove();
    const layer=document.createElement('div');layer.id=L;const group=document.createElement('div');group.className='vmhp-group';layer.appendChild(group);
    const b=[['62%','6%','32%','23%'],['70%','27%','27%','22%'],['49%','47%','31%','22%'],['72%','60%','27%','20%'],['43%','70%','27%','19%'],['67%','82%','29%','16%']];
    ps.forEach((p,i)=>{const w=document.createElement('div');w.className='vmhp-item';Object.assign(w.style,{left:b[i][0],top:b[i][1],width:b[i][2],height:b[i][3]});const img=document.createElement('img');img.src=p.image_url;img.alt='';img.setAttribute('aria-hidden','true');img.decoding='async';img.loading='eager';img.onerror=()=>w.remove();w.appendChild(img);group.appendChild(w)});
    hero.appendChild(layer);document.documentElement.dataset.vyrdictCurrentHero='mobile-primary';document.documentElement.classList.add('vyrdict-ready');requestAnimationFrame(()=>document.getElementById('vyrdict-bundle-loader')?.remove());return true;
  }

  async function mount(n=0){
    if(!M.matches||!HOME())return;const hero=document.querySelector('.hero');if(!hero){if(n<40)setTimeout(()=>mount(n+1),75);return}
    const ps=await products();if(draw(hero,ps))return;if(n<8)setTimeout(()=>mount(n+1),400);
  }
  const boot=()=>mount();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  addEventListener('pageshow',()=>setTimeout(boot,40));addEventListener('hashchange',()=>setTimeout(boot,40));addEventListener('popstate',()=>setTimeout(boot,40));
})();
