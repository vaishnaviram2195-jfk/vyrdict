(()=>{
  if(window.__vyrdictTrendingCleanRevealV7)return;
  window.__vyrdictTrendingCleanRevealV7=1;
  const id='vyrdict-trending-clean-reveal-v7';
  if(!document.getElementById(id)){
    const s=document.createElement('style');s.id=id;s.textContent=`
      body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{padding-top:6px!important;padding-bottom:0!important;margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-head{margin-top:0!important;margin-bottom:8px!important}.vyrdict-index-claw .vti-kicker{margin-top:0!important}.vyrdict-index-claw .vti-cats{padding-bottom:6px!important}.vyrdict-index-claw .vti-grid{margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-machine-stage,.vyrdict-index-claw .vti-reveal-card{height:510px!important}.vyrdict-index-claw .vti-foot{margin-top:-6px!important;margin-bottom:0!important;padding-bottom:0!important}
      .vyrdict-index-claw .vti-reveal-card,.vyrdict-index-claw .vti-reveal-link{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
      .vyrdict-index-claw .vti-reveal-card:before,.vyrdict-index-claw .vti-reveal-card:after,.vyrdict-index-claw .vti-reveal-link:before,.vyrdict-index-claw .vti-reveal-link:after{content:none!important;display:none!important}
      .vyrdict-index-claw .vti-reveal-link{inset:50px 8px 166px 8px!important;overflow:hidden!important;align-items:center!important;justify-content:center!important}
      .vyrdict-index-claw .vti-reveal-link img{display:block!important;width:auto!important;height:auto!important;max-width:88%!important;max-height:100%!important;object-fit:contain!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important;opacity:1!important;filter:saturate(1.14) contrast(1.09) brightness(1.01) drop-shadow(0 18px 18px rgba(67,43,33,.18))!important;image-rendering:auto!important}
      .vyrdict-index-claw .vti-reveal-link img.vti-light-artwork{mix-blend-mode:multiply!important;filter:saturate(1.18) contrast(1.12) brightness(1) drop-shadow(0 18px 18px rgba(67,43,33,.18))!important}
      .vyrdict-index-claw .vti-reveal-link img.vti-book-cover{max-width:290px!important;max-height:100%!important;mix-blend-mode:normal!important;filter:contrast(1.04) saturate(1.06) drop-shadow(0 18px 18px rgba(40,30,25,.22))!important}
      .vyrdict-index-claw .vti-reveal-link img.vti-dyson-single{max-width:55%!important;max-height:100%!important;mix-blend-mode:multiply!important}
      .vyrdict-index-claw .vti-panel-copy{left:30px!important;right:30px!important;bottom:10px!important;max-width:92%!important;z-index:9!important}.vyrdict-index-claw .vti-name{display:block!important;max-width:94%!important;margin:0!important;position:relative!important;z-index:10!important;line-height:.96!important}
      @media(max-width:760px){body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{padding-top:4px!important;padding-bottom:0!important}.vyrdict-index-claw .vti-head{margin-bottom:6px!important}.vyrdict-index-claw .vti-cats{padding-bottom:5px!important}.vyrdict-index-claw .vti-machine-stage{height:505px!important}.vyrdict-index-claw .vti-reveal-card{height:500px!important}.vyrdict-index-claw .vti-reveal-link{inset:48px 8px 172px 8px!important}.vyrdict-index-claw .vti-reveal-link img{max-width:90%!important}.vyrdict-index-claw .vti-reveal-link img.vti-book-cover{max-width:245px!important}.vyrdict-index-claw .vti-reveal-link img.vti-dyson-single{max-width:62%!important}.vyrdict-index-claw .vti-panel-copy{left:24px!important;right:24px!important;bottom:10px!important}.vyrdict-index-claw .vti-foot{margin-top:-8px!important}}
    `;document.head.appendChild(s);
  }

  const cache=new Map();
  const slugOf=img=>{const h=img.closest('.vti-reveal-link')?.getAttribute('href')||'';const m=h.match(/\/product\/([^/]+)/);return m?.[1]||''};
  const isBook=img=>/books?/i.test(img.closest('.vti-reveal-card')?.querySelector('.vti-panel-cat')?.textContent||'')||['big-little-truths-liane-moriarty','yesteryear-caro-claire-burke','once-upon-a-broken-heart'].includes(slugOf(img));
  function loadImage(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url})}

  async function inspectAndPrepare(src,slug){
    const key=slug+'|'+src;if(cache.has(key))return cache.get(key);
    const job=(async()=>{
      const im=await loadImage('/vti-image?url='+encodeURIComponent(src));
      if(slug==='dyson-camerajet'){
        const w=im.naturalWidth,h=im.naturalHeight;
        const sx=Math.round(w*.27),sy=0,sw=Math.round(w*.46),sh=Math.round(h*.515);
        const c=document.createElement('canvas');c.width=sw;c.height=sh;c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,sw,sh);
        return {src:c.toDataURL('image/png'),light:true,dyson:true};
      }
      const c=document.createElement('canvas');c.width=40;c.height=40;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,40,40);const d=x.getImageData(0,0,40,40).data;
      const pts=[[1,1],[38,1],[1,38],[38,38]];let light=0;
      for(const [px,py] of pts){const i=(py*40+px)*4,r=d[i],g=d[i+1],b=d[i+2],lum=(r+g+b)/3;if(lum>218&&Math.max(r,g,b)-Math.min(r,g,b)<38)light++}
      return {src,light:light>=3,dyson:false};
    })().catch(()=>({src,light:false,dyson:false}));cache.set(key,job);return job;
  }

  function processImage(img){
    if(!img)return;const src=img.dataset.vtiOriginalSrc||img.currentSrc||img.getAttribute('src')||'';if(!/^https?:/i.test(src))return;const slug=slugOf(img);
    if(img.dataset.vtiPreparedFor===src)return;img.dataset.vtiOriginalSrc=src;img.dataset.vtiPreparedFor=src;
    img.classList.remove('vti-light-artwork','vti-book-cover','vti-dyson-single');
    if(isBook(img))img.classList.add('vti-book-cover');
    inspectAndPrepare(src,slug).then(r=>{if(img.dataset.vtiPreparedFor!==src)return;if(r.src!==src)img.src=r.src;if(!isBook(img)&&r.light)img.classList.add('vti-light-artwork');if(r.dyson)img.classList.add('vti-dyson-single')});
  }

  function mount(attempt=0){const section=document.querySelector('.vyrdict-index-claw');if(!section){if(attempt<80)setTimeout(()=>mount(attempt+1),75);return}const run=()=>processImage(section.querySelector('.vti-reveal-link img'));run();const mo=new MutationObserver(muts=>{for(const m of muts){if(m.type==='attributes'&&m.attributeName==='src'&&m.target.matches?.('.vti-reveal-link img')){const cur=m.target.getAttribute('src')||'';if(/^https?:/i.test(cur)){m.target.dataset.vtiOriginalSrc=cur;m.target.dataset.vtiPreparedFor='';processImage(m.target)}}if(m.type==='childList')run()}});mo.observe(section,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});window.addEventListener('vyrdict:trending-data',()=>setTimeout(run,30))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});else mount();
})();