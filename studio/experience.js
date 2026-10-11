/* Studio motion. No network calls or changes to inquiry submission. */
(()=>{
  "use strict";
  const body=document.body;
  if(!body.classList.contains("studio-motion"))return;
  const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer=window.matchMedia("(hover: hover) and (pointer: fine)");
  const scenes=[
    {id:"studio",label:"Studio",accent:"#b2768f",a:"172 88 119",b:"111 143 158",c:"104 149 132"},
    {id:"why-vyrdict",label:"Why Vyrdict",accent:"#577c70",a:"130 170 151",b:"168 186 202",c:"193 153 170",from:[234,238,224],to:[217,232,230]},
    {id:"approach",label:"Our approach",accent:"#95b4bf",a:"73 124 133",b:"146 93 126",c:"129 146 180",from:[29,49,56],to:[49,45,64]},
    {id:"scoring",label:"How we score",accent:"#9c6389",a:"189 147 175",b:"161 150 190",c:"161 185 179",from:[239,221,230],to:[224,225,237]},
    {id:"work",label:"Our work",accent:"#648674",a:"141 180 154",b:"195 157 173",c:"153 183 201",from:[242,235,229],to:[218,232,220]},
    {id:"culture-sprint",label:"72-hour sprint",accent:"#c997ac",a:"179 103 132",b:"129 165 190",c:"158 135 178"},
    {id:"packages",label:"Packages",accent:"#557f8d",a:"110 157 168",b:"189 134 164",c:"126 168 140",from:[234,239,231],to:[210,228,234]},
    {id:"contact",label:"Get in touch",accent:"#a96888",a:"195 148 172",b:"145 169 191",c:"160 182 157"}
  ].map(scene=>({...scene,el:document.getElementById(scene.id)})).filter(scene=>scene.el);
  // Use authentic campaign imagery already shown in the Studio work section.
  // Decorative only: never changes the existing service cards, copy, or CTAs.
  const packages=document.getElementById("packages");
  const images=[...document.querySelectorAll("#work .work-card-media img")].slice(0,3);
  if(packages&&images.length===3&&!packages.querySelector(".package-motion")){
    const layer=document.createElement("div");
    layer.className="package-motion";
    layer.setAttribute("aria-hidden","true");
    images.forEach(source=>{
      const card=document.createElement("figure");
      card.className="package-motion-card";
      const image=document.createElement("img");
      image.src=source.getAttribute("src")||"";
      image.alt="";
      image.loading="lazy";
      image.decoding="async";
      card.append(image);
      layer.append(card);
    });
    packages.prepend(layer);
  }
  const rail=document.createElement("nav");
  rail.className="studio-rail";
  rail.setAttribute("aria-label","Studio sections");
  scenes.forEach((scene,index)=>{
    // The abstract ring/orbit atmosphere is intentionally retired; retain the\n    // section navigation, palette, scene scroll, and photo-card motion.\n    scene.el.style.setProperty("--scene-a",scene.a);
    scene.el.style.setProperty("--scene-b",scene.b);
    scene.el.style.setProperty("--scene-c",scene.c);
    scene.el.style.setProperty("--scene-angle",(-27+index%3*11)+"deg");
    const link=document.createElement("a");
    link.href="#"+scene.id;
    link.setAttribute("aria-label",scene.label);
    link.dataset.label=scene.label;
    link.style.setProperty("--rail-color",scene.accent);
    const dot=document.createElement("span");
    dot.setAttribute("aria-hidden","true");
    link.append(dot);rail.append(link);scene.link=link;
  });
  body.append(rail);
  const selectors=".hero-copy,.statement .reveal,.method article,.sc-home-intro,.sc-home-question,.sc-home-bottom,.work-head>div,.work-head>p,.work-card,.sprint .wrap,.module,.package-head>div,.package-head>p,.package-card,.package-pricing,#contact .reveal";
  const items=[...document.querySelectorAll(selectors)];
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add("scene-visible");
      revealObserver.unobserve(entry.target);
    });
  },{threshold:.1,rootMargin:"0px 0px -24px 0px"});
  items.forEach(item=>{
    item.classList.add("scene-item");
    const siblings=[...item.parentElement.children].filter(el=>el.matches(selectors));
    item.style.setProperty("--enter-delay",Math.min(siblings.indexOf(item)*90,360)+"ms");
    if(reducedMotion.matches)item.classList.add("scene-visible");
    else revealObserver.observe(item);
  });
  body.classList.add("studio-ready");
  const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,value));
  const mix=(from,to,t)=>"rgb("+from.map((value,index)=>Math.round(value+(to[index]-value)*t)).join(",")+")";
  let scrollFrame=0,activeScene=null;
  function updateScroll(){
    scrollFrame=0;
    const viewport=window.innerHeight;
    const rows=scenes.map(scene=>({scene,rect:scene.el.getBoundingClientRect()}));
    const pivot=viewport*.4;
    let current=rows.find(row=>row.rect.top<=pivot&&row.rect.bottom>pivot);
    if(!current)current=rows.find(row=>row.rect.bottom>70)||rows[rows.length-1];
    const maxScroll=Math.max(1,document.documentElement.scrollHeight-viewport);
    body.style.setProperty("--studio-progress",clamp(window.scrollY/maxScroll).toFixed(4));
    rows.forEach(({scene,rect})=>{
      const visible=rect.bottom>0&&rect.top<viewport;
      scene.el.classList.toggle("scene-active",visible);
      if(!visible)return;
      const progress=clamp((viewport-rect.top)/(viewport+rect.height));
      if(!reducedMotion.matches){
        scene.el.style.setProperty("--scene-shift",((progress-.5)*100).toFixed(1)+"px");
        if(scene.from)scene.el.style.setProperty("--scene-bg",mix(scene.from,scene.to,clamp((progress-.18)/.64)));
      }
    });
    if(current&&current.scene!==activeScene){
      if(activeScene)activeScene.link.removeAttribute("aria-current");
      activeScene=current.scene;
      activeScene.link.setAttribute("aria-current","location");
      body.style.setProperty("--studio-accent",activeScene.accent);
    }
  }
  function scheduleScroll(){
    if(!scrollFrame)scrollFrame=window.requestAnimationFrame(updateScroll);
  }
  window.addEventListener("scroll",scheduleScroll,{passive:true});
  window.addEventListener("resize",scheduleScroll,{passive:true});
  window.addEventListener("load",scheduleScroll,{once:true});
  document.addEventListener("toggle",scheduleScroll,true);
  if(document.fonts)document.fonts.ready.then(scheduleScroll);
  scheduleScroll();
  let pointerFrame=0,pointer=null,lastSection=null,lastCard=null;
  function clearCard(){
    if(!lastCard)return;
    lastCard.classList.remove("is-hovered");
    lastCard.style.removeProperty("--card-tilt-x");
    lastCard.style.removeProperty("--card-tilt-y");
    lastCard=null;
  }
  function updatePointer(){
    pointerFrame=0;
    if(!pointer||!finePointer.matches||reducedMotion.matches)return;
    const target=pointer.target;
    const section=target.closest("section");
    const card=target.closest(".package-card,.work-card");
    const sectionRect=section&&section.getBoundingClientRect();
    const cardRect=card&&card.getBoundingClientRect();
    if(lastSection!==section){
      if(lastSection)lastSection.classList.remove("scene-pointer");
      lastSection=section;
      if(section)section.classList.add("scene-pointer");
    }
    if(sectionRect){
      section.style.setProperty("--pointer-x",((pointer.x-sectionRect.left)/sectionRect.width*100).toFixed(2)+"%");
      section.style.setProperty("--pointer-y",((pointer.y-sectionRect.top)/sectionRect.height*100).toFixed(2)+"%");
    }
    if(lastCard!==card){clearCard();lastCard=card;}
    if(cardRect){
      const x=clamp((pointer.x-cardRect.left)/cardRect.width),y=clamp((pointer.y-cardRect.top)/cardRect.height);
      card.classList.add("is-hovered");
      card.style.setProperty("--card-x",(x*100).toFixed(2)+"%");
      card.style.setProperty("--card-y",(y*100).toFixed(2)+"%");
      card.style.setProperty("--card-tilt-x",((.5-y)*3).toFixed(2)+"deg");
      card.style.setProperty("--card-tilt-y",((x-.5)*3).toFixed(2)+"deg");
    }
  }
  document.addEventListener("pointermove",event=>{
    if(!finePointer.matches||reducedMotion.matches||!(event.target instanceof Element))return;
    pointer={target:event.target,x:event.clientX,y:event.clientY};
    if(!pointerFrame)pointerFrame=window.requestAnimationFrame(updatePointer);
  },{passive:true});
  document.addEventListener("pointerleave",()=>{
    pointer=null;clearCard();
    if(lastSection)lastSection.classList.remove("scene-pointer");
    lastSection=null;
  });
  reducedMotion.addEventListener("change",()=>{
    if(reducedMotion.matches){
      items.forEach(item=>item.classList.add("scene-visible"));
      scenes.forEach(scene=>scene.el.style.removeProperty("--scene-shift"));
      clearCard();
      if(lastSection)lastSection.classList.remove("scene-pointer");
    }
    scheduleScroll();
  });
})();
