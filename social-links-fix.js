(()=>{
  if(window.__vyrdictSocialLinksV9)return;
  window.__vyrdictSocialLinksV9=1;
  const TIKTOK_URL='https://www.tiktok.com/@vyrdict';
  const SNOOPY_STICKER_URL='https://about.starbucks.com/uploads/2026/09/PeanutsMerchFall2026-03031-scaled.jpg';
  let timer=0;

  function patchTikTokLinks(root=document){
    for(const a of root.querySelectorAll?.('a')||[]){
      const href=(a.getAttribute('href')||'').toLowerCase();
      const text=(a.textContent||'').trim().toLowerCase();
      const aria=(a.getAttribute('aria-label')||'').toLowerCase();
      const title=(a.getAttribute('title')||'').toLowerCase();
      if(href.includes('tiktok.com')||text==='tiktok'||aria.includes('tiktok')||title.includes('tiktok')){
        a.href=TIKTOK_URL;a.target='_blank';a.rel='noopener noreferrer';a.dataset.vyrdictSocialLink='tiktok';
      }
    }
  }

  function addEditorialStickerStyle(){
    if(document.getElementById('vyrdict-editorial-sticker-style'))return;
    const s=document.createElement('style');
    s.id='vyrdict-editorial-sticker-style';
    s.textContent=`
      .vyrdict-editorial-sticker-panel{position:relative!important}
      .vyrdict-snoopy-sticker{position:absolute;right:20px;top:18px;width:132px;height:132px;object-fit:cover;object-position:54% 48%;border-radius:999px;border:4px solid #fff;box-shadow:0 10px 24px rgba(34,27,20,.16);background:#fff;z-index:4;pointer-events:none;user-select:none}
      @media(max-width:700px){.vyrdict-snoopy-sticker{width:88px;height:88px;right:12px;top:12px;border-width:3px;box-shadow:0 7px 17px rgba(34,27,20,.14)}}
    `;
    document.head.appendChild(s);
  }

  function norm(v){return String(v||'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim()}

  function findEditorialPanel(){
    const nodes=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,span,div')];
    const labels=nodes.filter(el=>{const t=norm(el.textContent);return t.includes("why it's trending now")||t.includes('why its trending now')});
    if(!labels.length)return null;
    labels.sort((a,b)=>norm(a.textContent).length-norm(b.textContent).length);
    const label=labels[0];

    let current=label;
    let leftPanel=null;
    for(let i=0;i<10&&current?.parentElement;i++){
      const parent=current.parentElement;
      const pt=norm(parent.textContent);
      if(pt.includes('starbucks')&&pt.includes('snoopy')&&pt.includes("what we're watching")){
        leftPanel=current;
        break;
      }
      current=parent;
    }

    if(leftPanel){
      const lt=norm(leftPanel.textContent);
      if(lt.includes('starbucks')&&lt.includes('snoopy')&&!lt.includes("what we're watching"))return leftPanel;
    }

    const headline=nodes.find(el=>norm(el.textContent).includes('starbucks just made snoopy the main character of fall'));
    if(headline){
      let candidate=headline;
      for(let i=0;i<7&&candidate?.parentElement;i++){
        const parent=candidate.parentElement;
        const pt=norm(parent.textContent);
        if(pt.includes("what we're watching"))break;
        candidate=parent;
      }
      if(candidate&&candidate!==document.body&&candidate!==document.documentElement)return candidate;
    }
    return null;
  }

  function patchEditorialSticker(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    const panel=findEditorialPanel();
    if(!panel)return;

    document.querySelectorAll('.vyrdict-snoopy-sticker').forEach(el=>{if(el.parentElement!==panel)el.remove()});
    document.querySelectorAll('.vyrdict-editorial-sticker-panel').forEach(el=>{if(el!==panel)el.classList.remove('vyrdict-editorial-sticker-panel')});

    if(panel.querySelector(':scope > .vyrdict-snoopy-sticker'))return;
    addEditorialStickerStyle();
    panel.classList.add('vyrdict-editorial-sticker-panel');
    const img=document.createElement('img');
    img.className='vyrdict-snoopy-sticker';
    img.src=SNOOPY_STICKER_URL;
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.decoding='async';
    img.loading='eager';
    panel.appendChild(img);
  }

  function queue(delay=80){clearTimeout(timer);timer=setTimeout(()=>{patchTikTokLinks();patchEditorialSticker()},delay)}
  function loadFeedback(){
    if(document.getElementById('vyrdict-launch-feedback-loader'))return;
    const s=document.createElement('script');s.id='vyrdict-launch-feedback-loader';s.src='/launch-feedback.js?v=inline-actions-1';s.defer=true;document.head.appendChild(s);
  }
  function deferFeedback(){
    if('requestIdleCallback' in window)requestIdleCallback(loadFeedback,{timeout:2500});
    else setTimeout(loadFeedback,1800);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{patchTikTokLinks();patchEditorialSticker();deferFeedback()},{once:true});
  else{patchTikTokLinks();patchEditorialSticker();deferFeedback()}
  addEventListener('popstate',()=>queue(80));addEventListener('hashchange',()=>queue(80));
  const observe=()=>{const app=document.getElementById('app');if(app)new MutationObserver(()=>queue(100)).observe(app,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();