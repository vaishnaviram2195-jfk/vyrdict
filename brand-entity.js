(()=>{
  if(window.__vyrdictBrandEntityV1)return;
  window.__vyrdictBrandEntityV1=1;
  const D='VYRDICT is a viral product intelligence and discovery platform that tracks what is trending, separates hype from value, and helps shoppers decide what is actually worth buying.';
  document.title='VYRDICT — Viral Product Intelligence & Discovery';
  const meta=(sel,attr,val)=>{let el=document.querySelector(sel);if(!el){el=document.createElement('meta');for(const [k,v] of Object.entries(attr))el.setAttribute(k,v);document.head.appendChild(el)}el.setAttribute('content',val)};
  meta('meta[name="description"]',{name:'description'},D);
  meta('meta[property="og:type"]',{property:'og:type'},'website');
  meta('meta[property="og:site_name"]',{property:'og:site_name'},'VYRDICT');
  meta('meta[property="og:title"]',{property:'og:title'},'VYRDICT — Viral Product Intelligence & Discovery');
  meta('meta[property="og:description"]',{property:'og:description'},D);
  meta('meta[property="og:url"]',{property:'og:url'},'https://vyrdict.com/');
  meta('meta[property="og:image"]',{property:'og:image'},'https://vyrdict.com/vyrdict-logo.svg');
  meta('meta[name="twitter:card"]',{name:'twitter:card'},'summary');
  meta('meta[name="twitter:title"]',{name:'twitter:title'},'VYRDICT — Viral Product Intelligence & Discovery');
  meta('meta[name="twitter:description"]',{name:'twitter:description'},D);
  let canon=document.querySelector('link[rel="canonical"]');if(!canon){canon=document.createElement('link');canon.rel='canonical';document.head.appendChild(canon)}canon.href='https://vyrdict.com/';
  let icon=document.querySelector('link[rel~="icon"]');if(!icon){icon=document.createElement('link');icon.rel='icon';icon.type='image/svg+xml';icon.href='/vyrdict-logo.svg';document.head.appendChild(icon)}
  if(!document.getElementById('vyrdict-brand-entity-schema')){
    const s=document.createElement('script');s.id='vyrdict-brand-entity-schema';s.type='application/ld+json';s.textContent=JSON.stringify({
      '@context':'https://schema.org','@graph':[
        {'@type':'Organization','@id':'https://vyrdict.com/#organization',name:'VYRDICT',alternateName:'Vyrdict',url:'https://vyrdict.com/',logo:{'@type':'ImageObject',url:'https://vyrdict.com/vyrdict-logo.svg',width:512,height:512},description:D,slogan:"The verdict on what's trending.",sameAs:['https://www.tiktok.com/@vyrdict']},
        {'@type':'WebSite','@id':'https://vyrdict.com/#website',url:'https://vyrdict.com/',name:'VYRDICT',alternateName:'Vyrdict',publisher:{'@id':'https://vyrdict.com/#organization'}},
        {'@type':'WebPage','@id':'https://vyrdict.com/#webpage',url:'https://vyrdict.com/',name:'VYRDICT — Viral Product Intelligence & Discovery',isPartOf:{'@id':'https://vyrdict.com/#website'},about:{'@id':'https://vyrdict.com/#organization'},description:D}
      ]
    });document.head.appendChild(s)
  }
})();
