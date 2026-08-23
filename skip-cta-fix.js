(()=>{
  if(window.__vyrdictSkipCtaFix)return;
  window.__vyrdictSkipCtaFix=1;

  const STYLE_ID='vyrdict-skip-cta-fix-style';
  const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();

  function isHome(){return location.pathname==='/'||location.pathname===''}

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=`
      body .v-skip-discovery-card{box-sizing:border-box;display:flex!important;flex-direction:column!important;justify-content:space-between!important;align-self:stretch!important;overflow:hidden!important;border:1px solid rgba(23,21,17,.14)!important;border-radius:28px!important;background:#fffdf8!important;color:#171511!important;padding:28px!important;box-shadow:none!important;min-width:250px!important;cursor:pointer!important;text-decoration:none!important;visibility:visible!important;opacity:1!important;transition:transform .16s ease,border-color .16s ease!important}
      body .v-skip-discovery-card:hover{transform:translateY(-2px);border-color:rgba(23,21,17,.34)!important}
      body .v-skip-discovery-top{display:flex;align-items:center;gap:8px;font:950 9px/1 Arial,Helvetica,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#6d675f;text-align:left}
      body .v-skip-discovery-dot{width:7px;height:7px;background:#d94d73;border-radius:2px;flex:0 0 auto}
      body .v-skip-discovery-copy{display:block;margin:auto 0;padding:28px 0;text-align:left}
      body .v-skip-discovery-card h3{font:700 clamp(27px,3vw,38px)/1 Georgia,serif;letter-spacing:-.035em;margin:0 0 12px;color:#171511;text-align:left}
      body .v-skip-discovery-card p{font:12px/1.55 Arial,Helvetica,sans-serif;color:#6d675f;margin:0;max-width:230px;text-align:left}
      body .v-skip-discovery-action{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #d8cec4;padding-top:16px;font:950 10px/1 Arial,Helvetica,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:#171511;text-align:left}
      body .v-skip-discovery-arrow{font-size:17px;line-height:1;font-weight:400}
      body .v-skip-collapse{appearance:none;border:0;background:transparent;color:#171511;padding:0 0 2px;margin:20px 0 0;border-bottom:1px solid #171511;font:900 9px/1.3 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
      @media(max-width:700px){body .v-skip-discovery-card{padding:22px!important;border-radius:24px!important}body .v-skip-discovery-copy{padding:22px 0}body .v-skip-discovery-card h3{font-size:28px}}
    `;
    document.head.appendChild(s);
  }

  function findSection(){
    let sec=document.getElementById('skip-list')||document.querySelector('section.skiplist,.section.skiplist');
    if(sec)return sec;
    const marker=[...document.querySelectorAll('.skipflag,h1,h2,h3,h4,div,span')].find(el=>{
      const t=norm(el.textContent);
      return t==='the skip list'||t.includes('viral worth it')||t.includes('the skip list');
    });
    return marker?.closest('section')||marker?.closest('.section')||null;
  }

  function cards(rail){
    return [...rail.children].filter(el=>!el.matches('script,style,.v-home-discovery-card,.v-skip-discovery-card'));
  }

  function apply(){
    if(!isHome())return false;
    addStyle();
    const section=findSection();
    if(!section)return false;
    const rail=section.querySelector('.rail,[data-rail]');
    if(!rail)return false;

    section.querySelectorAll('.v-home-rail-more,.v-home-collapse,.v-skip-collapse').forEach(x=>x.remove());
    const items=cards(rail);
    if(items.length<3)return false;

    items.forEach((el,i)=>{
      if(i<3){
        el.hidden=false;
        if(el.dataset.vSkipForcedHidden==='1'){
          el.style.removeProperty('display');
          delete el.dataset.vSkipForcedHidden;
        }
      }else{
        el.hidden=true;
        el.dataset.vSkipForcedHidden='1';
        el.style.setProperty('display','none','important');
      }
    });

    let card=rail.querySelector('.v-skip-discovery-card');
    if(!card){
      rail.querySelector('.v-home-discovery-card')?.remove();
      card=document.createElement('button');
      card.type='button';
      card.className='v-skip-discovery-card';
      card.innerHTML='<span class="v-skip-discovery-top"><span class="v-skip-discovery-dot"></span>Keep scrolling</span><span class="v-skip-discovery-copy"><h3>More hype to skip</h3><p>See what else is getting attention without earning the spend.</p></span><span class="v-skip-discovery-action"><span>See all skips</span><span class="v-skip-discovery-arrow">→</span></span>';
      items[2].insertAdjacentElement('afterend',card);
      card.addEventListener('click',()=>{
        items.forEach(el=>{
          el.hidden=false;
          el.style.removeProperty('display');
          delete el.dataset.vSkipForcedHidden;
        });
        card.style.setProperty('display','none','important');
        let collapse=section.querySelector('.v-skip-collapse');
        if(!collapse){
          collapse=document.createElement('button');
          collapse.type='button';
          collapse.className='v-skip-collapse';
          collapse.textContent='Show less';
          collapse.addEventListener('click',()=>{
            items.forEach((el,i)=>{
              if(i>=3){
                el.hidden=true;
                el.dataset.vSkipForcedHidden='1';
                el.style.setProperty('display','none','important');
              }
            });
            collapse.remove();
            card.style.removeProperty('display');
          });
          rail.insertAdjacentElement('afterend',collapse);
        }
      });
    }else if(card.previousElementSibling!==items[2]){
      items[2].insertAdjacentElement('afterend',card);
    }

    card.hidden=false;
    card.style.removeProperty('display');
    requestAnimationFrame(()=>{
      const r=items[0]?.getBoundingClientRect();
      if(!r)return;
      if(r.width>0){
        card.style.setProperty('flex',`0 0 ${Math.round(r.width)}px`,'important');
        card.style.setProperty('width',`${Math.round(r.width)}px`,'important');
      }
      if(r.height>0)card.style.setProperty('min-height',`${Math.round(r.height)}px`,'important');
    });
    return true;
  }

  function schedule(){[0,80,180,350,700,1200,2200,3500,5200].forEach(ms=>setTimeout(apply,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('popstate',schedule);
  addEventListener('hashchange',schedule);
  addEventListener('resize',()=>{clearTimeout(window.__vyrdictSkipCtaResize);window.__vyrdictSkipCtaResize=setTimeout(apply,120)});
  new MutationObserver(()=>{clearTimeout(window.__vyrdictSkipCtaMutation);window.__vyrdictSkipCtaMutation=setTimeout(apply,120)}).observe(document.documentElement,{childList:true,subtree:true});
})();
