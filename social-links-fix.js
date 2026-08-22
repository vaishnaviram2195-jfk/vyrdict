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

  function patchFeedbackCopy(root=document){
    const label=root.querySelector?.('#vyrdict-product-feedback .vpf-label')||document.querySelector('#vyrdict-product-feedback .vpf-label');
    if(label&&/was this vyrdict helpful\?/i.test((label.textContent||'').trim()))label.textContent='Was this helpful?';
  }

  function patchAll(){
    patchTikTokLinks();
    patchVerifiedCount();
    patchFeedbackCopy();
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
#vyrdict-product-feedback{box-sizing:border-box!important;width:min(560px,calc(100% - 48px))!important;margin:20px auto 32px!important;background:#fffaf4!important;border:1px solid #d8cec4!important;border-radius:18px!important;padding:16px 18px 17px!important;color:#171511!important;font-family:Arial,Helvetica,sans-serif!important}
#vyrdict-product-feedback *{box-sizing:border-box}
#vyrdict-product-feedback .vpf-row{display:block!important}
#vyrdict-product-feedback .vpf-label{margin:0 0 4px!important;color:#171511!important;font-family:Georgia,"Times New Roman",serif!important;font-size:clamp(28px,2.7vw,34px)!important;font-weight:400!important;font-style:normal!important;line-height:1.04!important;letter-spacing:-.03em!important}
#vyrdict-product-feedback .vpf-sub{margin:0!important;color:#746b64!important;font-size:11px!important;line-height:1.45!important}
#vyrdict-product-feedback .vpf-actions{display:flex!important;align-items:center!important;gap:8px!important;width:100%!important;margin-top:11px!important}
#vyrdict-product-feedback .vpf-vote{appearance:none!important;-webkit-appearance:none!important;flex:1 1 0!important;min-height:36px!important;border:1px solid #d8cec4!important;border-radius:999px!important;background:#fffdf9!important;color:#171511!important;padding:0 14px!important;font:800 10.5px/1 Arial,Helvetica,sans-serif!important;text-align:center!important;cursor:pointer!important;box-shadow:none!important}
#vyrdict-product-feedback .vpf-vote:hover,#vyrdict-product-feedback .vpf-vote:focus-visible{border-color:#e65f72!important;outline:none!important}
#vyrdict-product-feedback .vpf-vote:disabled{opacity:.55!important;cursor:default!important}
#vyrdict-product-feedback .vpf-report{appearance:none!important;-webkit-appearance:none!important;display:inline-block!important;margin:11px 0 0!important;padding:0 0 2px!important;border:0!important;border-bottom:1px solid #5f5750!important;border-radius:0!important;background:transparent!important;color:#5f5750!important;font:800 9.5px/1.35 Arial,Helvetica,sans-serif!important;text-decoration:none!important;cursor:pointer!important;box-shadow:none!important}
#vyrdict-product-feedback .vpf-thanks{color:#5f5750!important;font:800 10.5px/1.4 Arial,Helvetica,sans-serif!important}
@media(max-width:600px){#vyrdict-product-feedback{width:calc(100% - 36px)!important;margin:18px auto 30px!important;padding:15px 16px 16px!important;border-radius:18px!important}#vyrdict-product-feedback .vpf-label{font-size:27px!important;line-height:1.04!important}#vyrdict-product-feedback .vpf-sub{font-size:11px!important}#vyrdict-product-feedback .vpf-actions{gap:7px!important;margin-top:10px!important}#vyrdict-product-feedback .vpf-vote{min-height:36px!important;font-size:10.5px!important}#vyrdict-product-feedback .vpf-report{margin-top:10px!important;font-size:9.5px!important}}
@media(max-width:390px){#vyrdict-product-feedback{width:calc(100% - 28px)!important;padding:14px 14px 15px!important}#vyrdict-product-feedback .vpf-label{font-size:26px!important}}
`;

  if(document.getElementById('vyrdict-launch-feedback-loader'))return;
  const s=document.createElement('script');
  s.id='vyrdict-launch-feedback-loader';
  s.src='/launch-feedback.js?v=3';
  s.defer=true;
  document.head.appendChild(s);
})();
