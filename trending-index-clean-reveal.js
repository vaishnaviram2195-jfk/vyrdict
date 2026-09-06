(()=>{
  if(window.__vyrdictTrendingCleanRevealV6)return;
  window.__vyrdictTrendingCleanRevealV6=1;
  const id='vyrdict-trending-clean-reveal-v6';
  if(!document.getElementById(id)){
    const s=document.createElement('style');s.id=id;s.textContent=`
      body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{padding-top:6px!important;padding-bottom:0!important;margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-head{margin-top:0!important;margin-bottom:8px!important}.vyrdict-index-claw .vti-kicker{margin-top:0!important}.vyrdict-index-claw .vti-cats{padding-bottom:6px!important}.vyrdict-index-claw .vti-grid{margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-machine-stage,.vyrdict-index-claw .vti-reveal-card{height:510px!important}.vyrdict-index-claw .vti-foot{margin-top:-6px!important;margin-bottom:0!important;padding-bottom:0!important}
      .vyrdict-index-claw .vti-reveal-card,.vyrdict-index-claw .vti-reveal-link{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important}
      .vyrdict-index-claw .vti-reveal-card:before,.vyrdict-index-claw .vti-reveal-card:after,.vyrdict-index-claw .vti-reveal-link:before,.vyrdict-index-claw .vti-reveal-link:after{content:none!important;display:none!important}
      .vyrdict-index-claw .vti-reveal-link{inset:52px 0 164px 0!important;overflow:visible!important;align-items:center!important;justify-content:center!important}
      .vyrdict-index-claw .vti-reveal-link img{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;width:100%!important;height:100%!important;max-width:520px!important;object-fit:contain!important;transform:scale(1.13)!important;transform-origin:center!important;filter:saturate(1.12) contrast(1.07) brightness(1.02) drop-shadow(0 18px 18px rgba(67,43,33,.18))!important;mix-blend-mode:normal!important}
      .vyrdict-index-claw .vti-reveal-link img.vti-book-cover{width:auto!important;max-width:300px!important;transform:scale(1)!important;filter:drop-shadow(0 18px 18px rgba(40,30,25,.22))!important}
      .vyrdict-index-claw .vti-panel-copy{left:30px!important;right:30px!important;bottom:12px!important;max-width:92%!important;z-index:9!important}.vyrdict-index-claw .vti-name{display:block!important;max-width:94%!important;margin:0!important;position:relative!important;z-index:10!important}
      @media(max-width:760px){body.vyrdict-home-calm .vyrdict-index-claw.section,.vyrdict-index-claw{padding-top:4px!important;padding-bottom:0!important}.vyrdict-index-claw .vti-head{margin-bottom:6px!important}.vyrdict-index-claw .vti-cats{padding-bottom:5px!important}.vyrdict-index-claw .vti-machine-stage{height:505px!important}.vyrdict-index-claw .vti-reveal-card{height:500px!important}.vyrdict-index-claw .vti-reveal-link{inset:50px 0 170px 0!important}.vyrdict-index-claw .vti-reveal-link img{max-width:400px!important;transform:scale(1.11)!important}.vyrdict-index-claw .vti-reveal-link img.vti-book-cover{max-width:250px!important;transform:none!important}.vyrdict-index-claw .vti-panel-copy{left:24px!important;right:24px!important;bottom:10px!important}.vyrdict-index-claw .vti-foot{margin-top:-8px!important}}
    `;document.head.appendChild(s);
  }
  const cache=new Map();
  const median=a=>{a.sort((x,y)=>x-y);return a[Math.floor(a.length/2)]||255};
  const sat=(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx?((mx-mn)/mx):0};
  const slugOf=img=>{const h=img.closest('.vti-reveal-link')?.getAttribute('href')||'';const m=h.match(/\/product\/([^/]+)/);return m?.[1]||''};
  const isBook=img=>/books?/i.test(img.closest('.vti-reveal-card')?.querySelector('.vti-panel-cat')?.textContent||'')||['big-little-truths-liane-moriarty','yesteryear-caro-claire-burke','the-calamity-club','once-upon-a-broken-heart'].includes(slugOf(img));
  function loadImage(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url})}
  async function makeCutout(src,slug){
    const key=slug+'|'+src;if(cache.has(key))return cache.get(key);
    const job=(async()=>{
      const im=await loadImage('/vti-image?url='+encodeURIComponent(src));
      let sx=0,sy=0,sw=im.naturalWidth,sh=im.naturalHeight;
      if(slug==='dyson-camerajet'){sx=Math.round(sw*.285);sy=Math.round(sh*.005);sw=Math.round(sw*.43);sh=Math.round(sh*.515)}
      const maxDim=900,scale=Math.min(1,maxDim/Math.max(sw,sh)),w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
      const c=document.createElement('canvas');c.width=w;c.height=h;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,sx,sy,sw,sh,0,0,w,h);
      const image=ctx.getImageData(0,0,w,h),d=image.data,n=w*h,rs=[],gs=[],bs=[],step=Math.max(1,Math.floor(Math.min(w,h)/100));
      const grab=(x,y)=>{const i=(y*w+x)*4;if(d[i+3]){rs.push(d[i]);gs.push(d[i+1]);bs.push(d[i+2])}};for(let x=0;x<w;x+=step){grab(x,0);grab(x,h-1)}for(let y=0;y<h;y+=step){grab(0,y);grab(w-1,y)}
      const br=median(rs),bg=median(gs),bb=median(bs),bLum=(br+bg+bb)/3,bSat=sat(br,bg,bb),distMax=bLum>230?48:38,dist2=distMax*distMax,satMax=Math.max(.14,bSat+.07);
      const ok=p=>{const i=p*4,r=d[i],g=d[i+1],b=d[i+2],dr=r-br,dg=g-bg,db=b-bb,lum=(r+g+b)/3;return dr*dr+dg*dg+db*db<=dist2&&Math.abs(lum-bLum)<=42&&sat(r,g,b)<=satMax};
      const seen=new Uint8Array(n),q=new Int32Array(n);let qh=0,qt=0;const push=p=>{if(p<0||p>=n||seen[p]||!ok(p))return;seen[p]=1;q[qt++]=p};for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}while(qh<qt){const p=q[qh++],x=p%w;if(p>=w)push(p-w);if(p<n-w)push(p+w);if(x>0)push(p-1);if(x<w-1)push(p+1)}for(let p=0;p<n;p++)if(seen[p])d[p*4+3]=0;ctx.putImageData(image,0,0);
      let minX=w,minY=h,maxX=-1,maxY=-1;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>25){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}if(maxX<minX||maxY<minY)return src;
      const pad=Math.max(4,Math.round(Math.max(maxX-minX,maxY-minY)*.045));minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);const cw=maxX-minX+1,ch=maxY-minY+1,out=document.createElement('canvas');out.width=cw;out.height=ch;out.getContext('2d').drawImage(c,minX,minY,cw,ch,0,0,cw,ch);return out.toDataURL('image/png');
    })().catch(()=>src);cache.set(key,job);return job;
  }
  function processImage(img){if(!img)return;const src=img.dataset.vtiOriginalSrc||img.currentSrc||img.getAttribute('src')||'';if(!/^https?:/i.test(src))return;const slug=slugOf(img);if(isBook(img)){img.classList.add('vti-book-cover');img.dataset.vtiCutoutFor=src;return}img.classList.remove('vti-book-cover');if(img.dataset.vtiCutoutFor===src||img.dataset.vtiBusy===src)return;img.dataset.vtiOriginalSrc=src;img.dataset.vtiBusy=src;makeCutout(src,slug).then(result=>{if(img.dataset.vtiBusy!==src)return;img.dataset.vtiBusy='';img.dataset.vtiCutoutFor=src;if(result!==src)img.src=result})}
  function mount(attempt=0){const section=document.querySelector('.vyrdict-index-claw');if(!section){if(attempt<80)setTimeout(()=>mount(attempt+1),75);return}const run=()=>processImage(section.querySelector('.vti-reveal-link img'));run();const mo=new MutationObserver(muts=>{for(const m of muts){if(m.type==='attributes'&&m.attributeName==='src'&&m.target.matches?.('.vti-reveal-link img')){const cur=m.target.getAttribute('src')||'';if(/^https?:/i.test(cur)){m.target.dataset.vtiOriginalSrc=cur;m.target.dataset.vtiCutoutFor='';processImage(m.target)}}if(m.type==='childList')run()}});mo.observe(section,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});window.addEventListener('vyrdict:trending-data',()=>setTimeout(run,30))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});else mount();
})();