(()=>{
  const TIKTOK_URL='https://www.tiktok.com/@vyrdict';

  function patchTikTokLinks(root=document){
    const links=[...root.querySelectorAll('a')];
    for(const a of links){
      const href=(a.getAttribute('href')||'').toLowerCase();
      const text=(a.textContent||'').trim().toLowerCase();
      const aria=(a.getAttribute('aria-label')||'').toLowerCase();
      const title=(a.getAttribute('title')||'').toLowerCase();
      if(href.includes('tiktok.com')||text==='tiktok'||aria.includes('tiktok')||title.includes('tiktok')){
        a.href=TIKTOK_URL;
        a.target='_blank';
        a.rel='noopener noreferrer';
        a.dataset.vyrdictSocialLink='tiktok';
      }
    }
  }

  function patchVerifiedCount(root=document){
    const walker=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(/247\+\s*verified\s*products/i.test(node.nodeValue||'')){
        node.nodeValue=(node.nodeValue||'').replace(/247\+\s*verified\s*products/gi,'200+ verified products');
      }
    }
  }

  function patchAll(){
    patchTikTokLinks();
    patchVerifiedCount();
  }

  function schedule(){[0,80,250,600,1200].forEach(ms=>setTimeout(patchAll,ms));}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>setTimeout(patchAll,40),{passive:true});
  new MutationObserver(patchAll).observe(document.documentElement,{subtree:true,childList:true});
})();
(()=>{
  if(!document.getElementById('vyrdict-feedback-prime-style')){
    const st=document.createElement('style');
    st.id='vyrdict-feedback-prime-style';
    st.textContent=`
#vyrdict-product-feedback{width:min(1040px,calc(100% - 34px));margin:28px auto 46px;background:#fffaf4;border:1px solid #d8cec4;border-radius:22px;padding:22px 24px;color:#171511;font-family:Arial,sans-serif;box-sizing:border-box}
#vyrdict-product-feedback *{box-sizing:border-box}
#vyrdict-product-feedback .vpf-row{display:flex;align-items:center;justify-content:space-between;gap:22px;flex-wrap:wrap}
#vyrdict-product-feedback .vpf-label{font:700 24px/1.05 Georgia,serif;letter-spacing:-.025em;margin:0 0 5px}
#vyrdict-product-feedback .vpf-sub{font-size:11px;line-height:1.5;color:#726860;margin:0}
#vyrdict-product-feedback .vpf-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#vyrdict-product-feedback .vpf-vote{appearance:none;border:1px solid #d8cec4;background:#fffdf9;color:#171511;border-radius:999px;padding:10px 14px;font:800 11px/1 Arial,sans-serif;cursor:pointer}
#vyrdict-product-feedback .vpf-vote:hover{border-color:#e65f72}
#vyrdict-product-feedback .vpf-vote:disabled{opacity:.55;cursor:default}
#vyrdict-product-feedback .vpf-report{appearance:none;display:inline-block;margin-top:14px;color:#5f5750;text-decoration:underline;text-underline-offset:3px;font:800 10px/1.4 Arial,sans-serif;cursor:pointer;background:none;border:0;padding:0}
#vyrdict-product-feedback .vpf-thanks{font:800 11px/1.4 Arial,sans-serif;color:#5f5750}
@media(max-width:600px){#vyrdict-product-feedback{padding:19px;margin-top:22px}#vyrdict-product-feedback .vpf-actions{width:100%}#vyrdict-product-feedback .vpf-vote{flex:1;text-align:center}}
`;
    document.head.appendChild(st);
  }
  if(document.getElementById('vyrdict-launch-feedback-loader'))return;
  const s=document.createElement('script');
  s.id='vyrdict-launch-feedback-loader';
  s.src='/launch-feedback.js?v=2';
  s.defer=true;
  document.head.appendChild(s);
})();
