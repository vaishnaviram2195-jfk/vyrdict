(()=>{
  if(window.__vyrdictTrendingCleanRevealV5)return;
  window.__vyrdictTrendingCleanRevealV5=1;

  const id='vyrdict-trending-clean-reveal-v5';
  if(!document.getElementById(id)){
    const s=document.createElement('style');
    s.id=id;
    s.textContent=`
      /* Tight section: no wasted top/bottom whitespace. */
      body.vyrdict-home-calm .vyrdict-index-claw.section,
      .vyrdict-index-claw{
        padding-top:6px!important;
        padding-bottom:0!important;
        margin-top:0!important;
        margin-bottom:0!important;
      }
      .vyrdict-index-claw .vti-head{margin-top:0!important;margin-bottom:8px!important}
      .vyrdict-index-claw .vti-kicker{margin-top:0!important}
      .vyrdict-index-claw .vti-cats{padding-bottom:6px!important}
      .vyrdict-index-claw .vti-grid{margin-top:0!important;margin-bottom:0!important}
      .vyrdict-index-claw .vti-machine-stage,
      .vyrdict-index-claw .vti-reveal-card{height:510px!important}
      .vyrdict-index-claw .vti-foot{margin-top:-6px!important;margin-bottom:0!important;padding-bottom:0!important}

      /* Right reveal is ONLY the product. Never a card, panel, tile, or white rectangle. */
      .vyrdict-index-claw .vti-reveal-card,
      .vyrdict-index-claw .vti-reveal-link{
        background:transparent!important;
        border:0!important;
        border-radius:0!important;
        box-shadow:none!important;
      }
      .vyrdict-index-claw .vti-reveal-card:before,
      .vyrdict-index-claw .vti-reveal-card:after,
      .vyrdict-index-claw .vti-reveal-link:before,
      .vyrdict-index-claw .vti-reveal-link:after{
        content:none!important;
        display:none!important;
        background:none!important;
        box-shadow:none!important;
      }
      .vyrdict-index-claw .vti-reveal-link{
        inset:54px 0 174px 0!important;
        overflow:visible!important;
        align-items:center!important;
        justify-content:center!important;
      }
      .vyrdict-index-claw .vti-reveal-link img{
        background:transparent!important;
        border:0!important;
        border-radius:0!important;
        box-shadow:none!important;
        width:100%!important;
        height:100%!important;
        max-width:500px!important;
        object-fit:contain!important;
        transform:scale(1.10)!important;
        transform-origin:center center!important;
        filter:saturate(1.18) contrast(1.09) brightness(1.035) drop-shadow(0 22px 24px rgba(67,43,33,.20))!important;
      }
      /* While processing, or if processing fails, multiply makes white artwork disappear into the grid instead of showing a box. */
      .vyrdict-index-claw .vti-reveal-link img.vti-cutout-pending,
      .vyrdict-index-claw .vti-reveal-link img.vti-cutout-fallback{
        mix-blend-mode:multiply!important;
      }
      .vyrdict-index-claw .vti-reveal-link img.vti-cutout-ready{
        mix-blend-mode:normal!important;
      }
      .vyrdict-index-claw .vti-panel-copy{
        left:30px!important;
        right:30px!important;
        bottom:12px!important;
        max-width:92%!important;
        z-index:9!important;
      }
      .vyrdict-index-claw .vti-name{display:block!important;max-width:94%!important;margin:0!important;position:relative!important;z-index:10!important}
      .vyrdict-index-claw .vti-momentum-copy,
      .vyrdict-index-claw .vti-open{position:relative!important;z-index:10!important}

      @media(max-width:760px){
        body.vyrdict-home-calm .vyrdict-index-claw.section,
        .vyrdict-index-claw{padding-top:4px!important;padding-bottom:0!important}
        .vyrdict-index-claw .vti-head{margin-bottom:6px!important}
        .vyrdict-index-claw .vti-cats{padding-bottom:5px!important}
        .vyrdict-index-claw .vti-machine-stage{height:505px!important}
        .vyrdict-index-claw .vti-reveal-card{height:500px!important}
        .vyrdict-index-claw .vti-reveal-link{inset:52px 0 176px 0!important}
        .vyrdict-index-claw .vti-reveal-link img{width:100%!important;max-width:390px!important;transform:scale(1.09)!important}
        .vyrdict-index-claw .vti-panel-copy{left:24px!important;right:24px!important;bottom:10px!important;max-width:92%!important}
        .vyrdict-index-claw .vti-foot{margin-top:-8px!important}
      }
    `;
    document.head.appendChild(s);
  }

  const cache=new Map();
  const median=a=>{a.sort((x,y)=>x-y);return a[Math.floor(a.length/2)]||255};
  const sat=(r,g,b)=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx?((mx-mn)/mx):0};

  function loadImage(url){
    return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=url});
  }

  async function makeCutout(src){
    if(cache.has(src))return cache.get(src);
    const job=(async()=>{
      const im=await loadImage('/vti-image?url='+encodeURIComponent(src));
      const maxDim=900;
      const scale=Math.min(1,maxDim/Math.max(im.naturalWidth||1,im.naturalHeight||1));
      const w=Math.max(1,Math.round(im.naturalWidth*scale)),h=Math.max(1,Math.round(im.naturalHeight*scale));
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0,w,h);
      const image=ctx.getImageData(0,0,w,h),d=image.data,n=w*h;

      const rs=[],gs=[],bs=[],step=Math.max(1,Math.floor(Math.min(w,h)/120));
      const grab=(x,y)=>{const i=(y*w+x)*4;if(d[i+3]>0){rs.push(d[i]);gs.push(d[i+1]);bs.push(d[i+2])}};
      for(let x=0;x<w;x+=step){grab(x,0);grab(x,h-1)}
      for(let y=0;y<h;y+=step){grab(0,y);grab(w-1,y)}
      const br=median(rs),bg=median(gs),bb=median(bs),bSat=sat(br,bg,bb),bLum=(br+bg+bb)/3;
      const threshold=bLum>235?76:bLum>215?62:50,threshold2=threshold*threshold,satLimit=Math.max(.18,bSat+.12);
      const ok=p=>{const i=p*4,r=d[i],g=d[i+1],b=d[i+2],dr=r-br,dg=g-bg,db=b-bb;if(dr*dr+dg*dg+db*db>threshold2)return false;if(Math.abs((r+g+b)/3-bLum)>78)return false;return sat(r,g,b)<=satLimit};

      const seen=new Uint8Array(n),q=new Int32Array(n);let qh=0,qt=0;
      const push=p=>{if(p<0||p>=n||seen[p]||!ok(p))return;seen[p]=1;q[qt++]=p};
      for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1)}
      while(qh<qt){const p=q[qh++],x=p%w;if(p>=w)push(p-w);if(p<n-w)push(p+w);if(x>0)push(p-1);if(x<w-1)push(p+1)}
      for(let p=0;p<n;p++)if(seen[p])d[p*4+3]=0;
      ctx.putImageData(image,0,0);

      let minX=w,minY=h,maxX=-1,maxY=-1;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>18){if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y}
      if(maxX<minX||maxY<minY)return src;
      const pad=Math.max(4,Math.round(Math.max(maxX-minX,maxY-minY)*.035));
      minX=Math.max(0,minX-pad);minY=Math.max(0,minY-pad);maxX=Math.min(w-1,maxX+pad);maxY=Math.min(h-1,maxY+pad);
      const cw=maxX-minX+1,ch=maxY-minY+1,out=document.createElement('canvas');out.width=cw;out.height=ch;out.getContext('2d').drawImage(c,minX,minY,cw,ch,0,0,cw,ch);
      return out.toDataURL('image/png');
    })().catch(()=>src);
    cache.set(src,job);return job;
  }

  function processImage(img){
    if(!img)return;
    const src=img.dataset.vtiOriginalSrc||img.currentSrc||img.getAttribute('src')||'';
    if(!/^https?:/i.test(src))return;
    if(img.dataset.vtiCutoutFor===src||img.dataset.vtiBusy===src)return;
    img.dataset.vtiOriginalSrc=src;img.dataset.vtiBusy=src;
    img.classList.remove('vti-cutout-ready','vti-cutout-fallback');img.classList.add('vti-cutout-pending');
    makeCutout(src).then(result=>{
      if(img.dataset.vtiBusy!==src)return;
      img.dataset.vtiBusy='';img.dataset.vtiCutoutFor=src;
      img.classList.remove('vti-cutout-pending');
      if(result!==src){img.src=result;img.classList.add('vti-cutout-ready')}
      else img.classList.add('vti-cutout-fallback');
    });
  }

  function tighten(section){
    section.style.setProperty('padding-top','6px','important');
    section.style.setProperty('padding-bottom','0px','important');
    section.style.setProperty('margin-top','0px','important');
    section.style.setProperty('margin-bottom','0px','important');
  }

  function mount(attempt=0){
    const section=document.querySelector('.vyrdict-index-claw');
    if(!section){if(attempt<80)setTimeout(()=>mount(attempt+1),75);return}
    tighten(section);
    const run=()=>{tighten(section);processImage(section.querySelector('.vti-reveal-link img'))};
    run();
    const mo=new MutationObserver(muts=>{for(const m of muts){if(m.type==='attributes'&&m.attributeName==='src'&&m.target.matches?.('.vti-reveal-link img')){const current=m.target.getAttribute('src')||'';if(/^https?:/i.test(current)){m.target.dataset.vtiOriginalSrc=current;m.target.dataset.vtiCutoutFor='';processImage(m.target)}}if(m.type==='childList')run()} });
    mo.observe(section,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});
    window.addEventListener('vyrdict:trending-data',()=>setTimeout(run,30));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(),{once:true});else mount();
})();
