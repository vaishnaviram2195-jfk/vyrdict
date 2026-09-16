(()=>{
  if(window.__vyrdictSocialLinksV7)return;
  window.__vyrdictSocialLinksV7=1;
  const TIKTOK_URL='https://www.tiktok.com/@vyrdict';
  const SNOOPY_STICKER_URL='https://about.starbucks.com/uploads/2026/08/PeanutsMerchFall2026-02995-1024x710.jpg';
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
      .vyrdict-editorial-with-sticker{position:relative!important}
      .vyrdict-snoopy-sticker{position:absolute;right:18px;top:18px;width:92px;height:92px;object-fit:cover;object-position:52% 38%;border-radius:999px;border:3px solid #fff;box-shadow:0 8px 22px rgba(34,27,20,.15);background:#fff;z-index:3;pointer-events:none;user-select:none}
      @media(max-width:700px){.vyrdict-snoopy-sticker{width:66px;height:66px;right:12px;top:12px;border-width:2px;box-shadow:0 6px 16px rgba(34,27,20,.14)}}
    `;
    document.head.appendChild(s);
  }

  function norm(v){return String(v||'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim()}
  function patchEditorialSticker(){
    if(location.pathname!=='/'&&location.pathname!=='')return;
    if(document.querySelector('.vyrdict-snoopy-sticker'))return;
    const candidates=[...document.querySelectorAll('h1,h2,h3,h4,h5,p,span,div')];
    const label=candidates.find(el=>{const t=norm(el.textContent);return t.includes("why it's trending now")||t.includes('why its trending now')});
    if(!label)return;
    let root=label;
    for(let i=0;i<7&&root;i++,root=root.parentElement){
      const t=norm(root.textContent);
      if(t.includes('starbucks')&&t.includes('snoopy'))break;
    }
    if(!root)root=label.parentElement;
    if(!root||root===document.body||root===document.documentElement)return;
    addEditorialStickerStyle();
    root.classList.add('vyrdict-editorial-with-sticker');
    const img=document.createElement('img');
    img.className='vyrdict-snoopy-sticker';
    img.src=SNOOPY_STICKER_URL;
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.decoding='async';
    img.loading='eager';
    root.appendChild(img);
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