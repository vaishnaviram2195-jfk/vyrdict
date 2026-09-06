(()=>{
  if(window.__vyrdictTrendingCleanRevealV8)return;
  window.__vyrdictTrendingCleanRevealV8=1;
  const id='vyrdict-trending-clean-reveal-v8';
  if(!document.getElementById(id)){
    const s=document.createElement('style');s.id=id;s.textContent=`
      body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{padding-top:6px!important;padding-bottom:0!important;margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-head{margin-top:0!important;margin-bottom:8px!important}.vyrdict-index-claw .vti-kicker{margin-top:0!important}.vyrdict-index-claw .vti-cats{padding-bottom:6px!important}.vyrdict-index-claw .vti-grid{margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-machine-stage,.vyrdict-index-claw .vti-reveal-card{height:510px!important}.vyrdict-index-claw .vti-foot{margin-top:-6px!important;margin-bottom:0!important;padding-bottom:0!important}
      .vyrdict-index-claw .vti-reveal-card,.vyrdict-index-claw .vti-reveal-link{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
      .vyrdict-index-claw .vti-reveal-card:before,.vyrdict-index-claw .vti-reveal-card:after,.vyrdict-index-claw .vti-reveal-link:before,.vyrdict-index-claw .vti-reveal-link:after{content:none!important;display:none!important}
      .vyrdict-index-claw .vti-reveal-link{inset:50px 8px 166px 8px!important;overflow:hidden!important;align-items:center!important;justify-content:center!important}
      .vyrdict-index-claw .vti-reveal-link img{display:block!important;width:auto!important;height:auto!important;max-width:88%!important;max-height:100%!important;object-fit:contain!important;background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;transform:none!important;opacity:1!important;mix-blend-mode:normal!important;filter:saturate(1.14) contrast(1.09) brightness(1.01) drop-shadow(0 18px 18px rgba(67,43,33,.18))!important;image-rendering:auto!important}
      .vyrdict-index-claw .vti-reveal-link img.vti-book-cover{max-width:290px!important;max-height:100%!important;filter:contrast(1.04) saturate(1.06) drop-shadow(0 18px 18px rgba(40,30,25,.22))!important}
      .vyrdict-index-claw .vti-reveal-link img.vti-dyson-single{max-width:55%!important;max-height:100%!important}
      .vyrdict-index-claw .vti-panel-copy{left:30px!important;right:30px!important;bottom:10px!important;max-width:92%!important;z-index:9!important}.vyrdict-index-claw .vti-name{display:block!important;max-width:94%!important;margin:0!important;position:relative!important;z-index:10!important;line-height:.96!important}
      @media(max-width:760px){body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{padding-top:4px!important;padding-bottom:0!important}.vyrdict-index-claw .vti-head{margin-bottom:6px!important}.vyrdict-index-claw .vti-cats{padding-bottom:5px!important}.vyrdict-index-claw .vti-machine-stage{height:505px!important}.vyrdict-index-claw .vti-reveal-card{height:500px!important}.vyrdict-index-claw .vti-reveal-link{inset:48px 8px 172px 8px!important}.vyrdict-index-claw .vti-reveal-link img{max-width:90%!important}.vyrdict-index-claw .vti-reveal-link img.vti-book-cover{max-width:245px!important}.vyrdict-index-claw .vti-reveal-link img.vti-dyson-single{max-width:62%!important}.vyrdict-index-claw .vti-panel-copy{left:24px!important;right:24px!important;bottom:10px!important}.vyrdict-index-claw .vti-foot{margin-top:-8px!important}}
    `;document.head.appendChild(s);
  }

  const cache=new Map();
  const slugOf=img=>{const h=img.closest('.vti-reveal-link')?.getAttribute('href')||'';const m=h.match(/\/product\/([^/]+)/);return m?.[1]||''};
  const isBook=img=>/books?/i.test(img.closest('.vti-reveal-card')?.querySelector('.vti-panel-cat')?.textContent||'')||['big-little-truths-liane-moriarty','yesteryear-caro-claire-burke','once-upon-a-broken-heart'].includes(slugOf(img));
  function loadImage(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url})}
  const median=a=>{if(!a.length)return 255;a.sort((x,y)=>x-y);return a[Math.floor(a.length/2)]};
  const saturation=(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx?((mx-mn)/mx):0};

  function transparentBackground(sourceCanvas){
    const w=sourceCanvas.width,h=sourceCanvas.height,ctx=sourceCanvas.getContext('2d',{willReadFrequently:true});
    const image=ctx.getImageData(0,0,w,h),d=image.data,n=w*h;
    const rs=[],gs=[],bs=[];let transparentEdge=0,totalEdge=0;
    const sample=(x,y)=>{const i=(y*w+x)*4;totalEdge++;if(d[i+3]<20){transparentEdge++;return}rs.push(d[i]);gs.push(d[i+1]);bs.push(d[i+2])};
    const step=Math.max(1,Math.floor(Math.min(w,h)/100));
    for(let x=0;x<w;x+=step){sample(x,0);sample(x,h-1)}
    for(let y=0;y<h;y+=step){sample(0,y);sample(w-1,y)}
    if(totalEdge&&transparentEdge/totalEdge>.55)return sourceCanvas;
    const br=median(rs),bg=median(gs),bb=median(bs),bLum=(br+bg+bb)/3,bSat=saturation(br,bg,bb);
    const threshold=bLum>235?54:bLum>215?46:38,threshold2=threshold*threshold,satLimit=Math.max(.20,bSat+.12);
    const isBg=p=>{const i=p*4;if(d[i+3]<20)return true;const r=d[i],g=d[i+1],b=d[i+2],dr=r-br,dg=g-bg,db=b-bb,lum=(r+g+b)/3;if(dr*dr+dg*dg+db*db>threshold2)return false;if(Math.abs(lum-bLum)>54)return false;if(saturation(r,g,b)>satLimit)return false;return true};
    const seen=new Uint8Array(n),q=new Int32Array(n);let qh=0,qt=0;
    const push=p=>{if(p<0||p>=n||seen[p]||!isBg(p))return;seen[p]=1;q[qt++]=p};
    for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}
    for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
    while(qh<qt){const p=q[qh++],x=p%w;if(p>=w)push(p-w);if(p<n-w)push(p+w);if(x>0)push(p-1);if(x<w-1)push(p+1)}
    for(let p=0;p<n;p++)if(seen[p])d[p*4+3]=0;
    ctx.putImageData(image,0,0);
    return sourceCanvas;
  }

  async function prepare(src,slug,book){
    const key=slug+'|'+src+'|'+book;if(cache.has(key))return cache.get(key);
    const job=(async()=>{
      if(book)return {src,dyson:false};
      const im=await loadImage('/vti-image?url='+encodeURIComponent(src));
      let sx=0,sy=0,sw=im.naturalWidth,sh=im.naturalHeight,dyson=false;
      if(slug==='dyson-camerajet'){
        sx=Math.round(im.naturalWidth*.27);sy=0;sw=Math.round(im.naturalWidth*.46);sh=Math.round(im.naturalHeight*.515);dyson=true;
      }
      const maxDim=1100,scale=Math.min(1,maxDim/Math.max(sw,sh));
      const w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
      const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,sx,sy,sw,sh,0,0,w,h);
      transparentBackground(c);
      return {src:c.toDataURL('image/png'),dyson};
    })().catch(()=>({src,dyson:false}));cache.set(key,job);return job;
  }

  function processImage(img){
    if(!img)return;const src=img.dataset.vtiOriginalSrc||img.currentSrc||img.getAttribute('src')||'';if(!/^https?:/i.test(src))return;const slug=slugOf(img),book=isBook(img);
    if(img.dataset.vtiPreparedFor===src)return;img.dataset.vtiOriginalSrc=src;img.dataset.vtiPreparedFor=src;
    img.classList.remove('vti-book-cover','vti-dyson-single');if(book)img.classList.add('vti-book-cover');
    prepare(src,slug,book).then(r=>{if(img.dataset.vtiPreparedFor!==src)return;if(r.src!==src)img.src=r.src;if(r.dyson)img.classList.add('vti-dyson-single')});
  }

  function mount(attempt=0){const section=document.querySelector('.vyrdict-index-claw');if(!section){if(attempt<80)setTimeout(()=>mount(attempt+1),75);return}const run=()=>processImage(section.querySelector('.vti-reveal-link img'));run();const mo=new MutationObserver(muts=>{for(const m of muts){if(m.type==='attributes'&&m.attributeName==='src'&&m.target.matches?.('.vti-reveal-link img')){const cur=m.target.getAttribute('src')||'';if(/^https?:/i.test(cur)){m.target.dataset.vtiOriginalSrc=cur;m.target.dataset.vtiPreparedFor='';processImage(m.target)}}if(m.type==='childList')run()}});mo.observe(section,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});window.addEventListener('vyrdict:trending-data',()=>setTimeout(run,30))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});else mount();
})();