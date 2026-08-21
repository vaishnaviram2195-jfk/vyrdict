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
  const STYLE_ID='vyrdict-feedback-prime-style';
  let st=document.getElementById(STYLE_ID);
  if(!st){st=document.createElement('style');st.id=STYLE_ID;document.head.appendChild(st)}
  st.textContent=`
#vyrdict-product-feedback{box-sizing:border-box;width:min(1040px,calc(100% - 56px));margin:28px auto 46px;background:#fffaf4;border:1px solid #d8cec4;border-radius:30px;padding:28px 30px 30px;color:#171511;font-family:Arial,Helvetica,sans-serif}
#vyrdict-product-feedback *{box-sizing:border-box}
#vyrdict-product-feedback .vpf-row{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap}
#vyrdict-product-feedback .vpf-label{margin:0 0 8px;color:#171511;font:700 31px/1.03 Georgia,"Times New Roman",serif;letter-spacing:-.035em}
#vyrdict-product-feedback .vpf-sub{margin:0;color:#746b64;font-size:13px;line-height:1.5}
#vyrdict-product-feedback .vpf-actions{display:flex;align-items:center;gap:12px;flex:1 1 100%;width:100%;margin-top:14px}
#vyrdict-product-feedback .vpf-vote{appearance:none;-webkit-appearance:none;flex:1 1 0;min-height:52px;border:1px solid #d8cec4;border-radius:999px;background:#fffdf9;color:#171511;padding:0 18px;font:800 13px/1 Arial,Helvetica,sans-serif;text-align:center;cursor:pointer;box-shadow:none}
#vyrdict-product-feedback .vpf-vote:hover,#vyrdict-product-feedback .vpf-vote:focus-visible{border-color:#e65f72;outline:none}
#vyrdict-product-feedback .vpf-vote:disabled{opacity:.55;cursor:default}
#vyrdict-product-feedback .vpf-report{appearance:none;-webkit-appearance:none;display:inline-block;margin:20px 0 0;padding:0 0 3px;border:0;border-bottom:1px solid #5f5750;border-radius:0;background:transparent;color:#5f5750;font:800 11px/1.35 Arial,Helvetica,sans-serif;text-decoration:none;cursor:pointer;box-shadow:none}
#vyrdict-product-feedback .vpf-thanks{color:#5f5750;font:800 12px/1.4 Arial,Helvetica,sans-serif}
@media(max-width:600px){#vyrdict-product-feedback{width:calc(100% - 56px);margin:28px auto 46px;padding:28px 30px 29px;border-radius:30px}#vyrdict-product-feedback .vpf-label{font-size:30px;line-height:1.03}#vyrdict-product-feedback .vpf-sub{font-size:13px}#vyrdict-product-feedback .vpf-actions{gap:12px;margin-top:16px}#vyrdict-product-feedback .vpf-vote{min-height:52px;font-size:12px}#vyrdict-product-feedback .vpf-report{margin-top:20px;font-size:10.5px}}
@media(max-width:390px){#vyrdict-product-feedback{width:calc(100% - 34px);padding:24px 22px}#vyrdict-product-feedback .vpf-label{font-size:27px}}
`;

  if(document.getElementById('vyrdict-launch-feedback-loader'))return;
  const s=document.createElement('script');
  s.id='vyrdict-launch-feedback-loader';
  s.src='/launch-feedback.js?v=3';
  s.defer=true;
  document.head.appendChild(s);
})();
