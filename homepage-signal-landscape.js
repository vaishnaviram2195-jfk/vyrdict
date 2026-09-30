(()=>{
  if(window.__vyrdictSignalLandscapeV6)return;
  window.__vyrdictSignalLandscapeV6=1;
  if((location.pathname||'/')!=='/')return;

  const OLD_STYLE_IDS=['ve-signal-landscape-style','ve-signal-landscape-style-v2','ve-signal-landscape-style-v3','ve-signal-landscape-style-v4','ve-signal-landscape-style-v5'];
  const STYLE_ID='ve-signal-landscape-style-v6';
  const FALLBACK=[
    'https://se-cdn.djiits.com/tpc/uploads/spu/cover/35d158a1f3d1a3a48ec4cf2220cfc426%40small.png',
    'https://assets.sharkninja.com/image/upload/f_auto/q_auto/SharkNinja-NA/FN101C-MASTER_01.jpg',
    'https://multimedia.bbycastatic.ca/multimedia/products/500x500/198/19805/19805226.jpg',
    'https://images.puma.com/image/upload/f_auto%2Cq_auto%2Cb_rgb%3Afafafa%2Cw_600%2Ch_600/global/406144/03/sv01/fnd/PNA/fmt/png/Speedcat-Ballet-Women%27s-Sneakers',
    'https://image.uniqlo.com/UQ/ST3/us/imagesgoods/478708/feature/usgoods_478708_feature1.jpg',
    'https://www.tower28beauty.com/cdn/shop/files/SOS_20Spray_20_E2_80_94_C2_A04_20oz.webp?v=1762649181&width=2000',
    'https://chomchomforpets.com/cdn/shop/files/BlackRoller9.jpg?v=1761874946',
    'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781668236550/theo-of-golden-9781668236550_hr.jpg'
  ];

  function ensureStyle(){
    OLD_STYLE_IDS.forEach(id=>document.getElementById(id)?.remove());
    let s=document.getElementById(STYLE_ID);
    if(!s){
      s=document.createElement('style');
      s.id=STYLE_ID;
      s.textContent=`
        /* Signal, not noise — 2x2 editorial motion collage. */
        #vyrdict-editorial-home .ve-story{
          width:100%!important;margin:0!important;height:500px!important;min-height:0!important;
          grid-template-columns:1.08fr .92fr!important;background:#c8cac7!important;border:0!important;overflow:hidden!important;
        }
        #vyrdict-editorial-home .ve-story .ve-story-media{
          min-height:0!important;height:100%!important;aspect-ratio:auto!important;background:#bfc2bf!important;
          display:grid!important;place-items:center!important;position:relative!important;overflow:hidden!important;
        }
        #vyrdict-editorial-home .ve-story .ve-story-media:after{display:none!important}
        #vyrdict-editorial-home .ve-story .ve-story-media>img{display:none!important}
        #vyrdict-editorial-home .ve-signal-motion{
          width:min(100%,500px);height:100%;aspect-ratio:1/1;display:grid;grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr);
          gap:7px;padding:7px;background:#d5d6d2;overflow:hidden;isolation:isolate;
        }
        #vyrdict-editorial-home .ve-signal-tile{position:relative;overflow:hidden;background:#e7e7e2;min-width:0;min-height:0}
        #vyrdict-editorial-home .ve-signal-tile:after{content:"";position:absolute;inset:0;border:1px solid rgba(20,20,20,.055);pointer-events:none;z-index:2}
        #vyrdict-editorial-home .ve-signal-tile img{
          display:block!important;position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
          object-fit:cover!important;object-position:center!important;filter:none!important;transform:scale(1)!important;
          opacity:1!important;transition:opacity .34s ease,transform .48s cubic-bezier(.2,.72,.2,1)!important;
        }
        #vyrdict-editorial-home .ve-signal-tile.ve-signal-out img{opacity:0!important;transform:scale(.955)!important}
        #vyrdict-editorial-home .ve-signal-tile.ve-signal-in img{animation:veSignalPop .5s cubic-bezier(.18,.8,.18,1) both}
        @keyframes veSignalPop{0%{opacity:0;transform:scale(.95)}100%{opacity:1;transform:scale(1)}}
        #vyrdict-editorial-home .ve-story .ve-story-copy{
          height:100%!important;padding-top:46px!important;padding-bottom:46px!important;background:#c8cac7!important;
        }
        @media(max-width:980px){
          #vyrdict-editorial-home .ve-story{height:auto!important;grid-template-columns:1fr!important}
          #vyrdict-editorial-home .ve-story .ve-story-media{height:auto!important;min-height:0!important;aspect-ratio:1/1!important}
          #vyrdict-editorial-home .ve-signal-motion{width:100%;height:auto;aspect-ratio:1/1;max-width:none}
          #vyrdict-editorial-home .ve-story .ve-story-copy{height:auto!important;padding-top:42px!important;padding-bottom:42px!important}
        }
        @media(max-width:620px){
          #vyrdict-editorial-home .ve-signal-motion{gap:5px;padding:5px}
          #vyrdict-editorial-home .ve-story .ve-story-copy{padding-top:34px!important;padding-bottom:36px!important}
        }
        @media(prefers-reduced-motion:reduce){
          #vyrdict-editorial-home .ve-signal-tile img{transition:none!important;animation:none!important}
        }
      `;
      document.head.appendChild(s);
    }
    return s;
  }

  function imagePool(media){
    const out=[];
    const push=src=>{src=String(src||'').trim();if(src&&/^https?:\/\//i.test(src)&&!out.includes(src))out.push(src)};
    try{
      const c=JSON.parse(localStorage.getItem('vyrdict:catalog-cache:v5')||'null');
      (c?.p||[]).filter(p=>p?.image_url&&Number(p?.viral_score||0)>=88).slice(0,18).forEach(p=>push(p.image_url));
    }catch{}
    document.querySelectorAll('#vyrdict-editorial-home a[href*="/product/"] img,#vyrdict-editorial-home .ve-motion-img').forEach(el=>{
      if(media.contains(el))return;
      if(el.tagName==='IMG')push(el.currentSrc||el.src);
      else{
        const bg=getComputedStyle(el).backgroundImage||'';
        const m=bg.match(/url\(["']?(.*?)["']?\)/);if(m)push(m[1]);
      }
    });
    FALLBACK.forEach(push);
    return out;
  }

  function makeTile(src,i){
    const tile=document.createElement('div');tile.className='ve-signal-tile ve-signal-in';tile.dataset.veSignalTile=String(i);
    const img=document.createElement('img');img.alt='';img.loading=i<4?'eager':'lazy';img.decoding='async';img.src=src;
    tile.appendChild(img);return tile;
  }

  function mountMotion(media){
    if(media.querySelector('.ve-signal-motion'))return media.querySelector('.ve-signal-motion');
    const pool=imagePool(media);if(pool.length<4)return null;
    const grid=document.createElement('div');grid.className='ve-signal-motion';grid.setAttribute('aria-hidden','true');
    grid.dataset.pool=JSON.stringify(pool);
    for(let i=0;i<4;i++)grid.appendChild(makeTile(pool[i%pool.length],i));
    media.replaceChildren(grid);
    if(matchMedia('(prefers-reduced-motion: reduce)').matches)return grid;

    const tiles=[...grid.querySelectorAll('.ve-signal-tile')];
    tiles.forEach((tile,i)=>{
      let index=i;
      const step=()=>{
        if(!grid.isConnected)return;
        const p=JSON.parse(grid.dataset.pool||'[]');if(p.length<2)return;
        index=(index+4+(i%3)+1)%p.length;
        const next=p[index];
        const preload=new Image();
        preload.onload=()=>{
          if(!grid.isConnected)return;
          tile.classList.remove('ve-signal-in');tile.classList.add('ve-signal-out');
          setTimeout(()=>{
            const img=tile.querySelector('img');if(!img)return;
            img.src=next;tile.classList.remove('ve-signal-out');tile.classList.add('ve-signal-in');
            setTimeout(()=>tile.classList.remove('ve-signal-in'),540);
          },300);
        };
        preload.onerror=()=>{};
        preload.src=next;
      };
      const delay=1800+i*620;
      setTimeout(()=>{step();const id=setInterval(step,3100+i*370);tile.dataset.interval=String(id)},delay);
    });
    return grid;
  }

  function apply(){
    const story=document.querySelector('#vyrdict-editorial-home .ve-story');if(!story)return false;
    ensureStyle();
    const media=story.querySelector('.ve-story-media');if(!media)return false;
    mountMotion(media);
    return true;
  }

  let n=0;const tick=()=>{n++;if(!apply()&&n<80)setTimeout(tick,120)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tick,{once:true});else tick();

  new MutationObserver(()=>{
    if(!document.getElementById(STYLE_ID)&&document.querySelector('#vyrdict-editorial-home .ve-story'))ensureStyle();
    const media=document.querySelector('#vyrdict-editorial-home .ve-story .ve-story-media');
    if(media&&!media.querySelector('.ve-signal-motion'))setTimeout(apply,20);
  }).observe(document.documentElement,{childList:true,subtree:true});

  addEventListener('pageshow',()=>setTimeout(apply,40));
})();
