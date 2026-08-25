(()=>{
  if(window.__vyrdictCardAlignmentV2)return;
  window.__vyrdictCardAlignmentV2=1;

  const STYLE_ID='vyrdict-card-alignment-style';
  const isCTA=el=>/see\s+vyrdict/i.test((el?.textContent||'').trim());
  let queued=0;

  function addStyle(){
    if(document.getElementById(STYLE_ID))return;
    const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.vyrdict-equal-card{display:flex!important;flex-direction:column!important;align-self:stretch!important;height:auto!important}
.vyrdict-equal-card>.vyrdict-card-content{display:flex!important;flex-direction:column!important;flex:1 1 auto!important}
.vyrdict-equal-card .vyrdict-card-actions{margin-top:auto!important}
.vyrdict-equal-card .vyrdict-card-title{box-sizing:border-box!important}
`;document.head.appendChild(s)
  }
  function findCard(cta){let n=cta;while(n?.parentElement){const parent=n.parentElement;if(parent.matches('.rail,[data-rail]'))return n;const ctas=[...parent.querySelectorAll('a,button')].filter(isCTA);if(ctas.length>1)return n;n=parent}return cta.closest('article,.card,[class*="card"]')}
  function findTitle(card){const heads=[...card.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>{const t=(h.textContent||'').trim();return t&&!/^(viral|worth|mixed|skip it|worth the hype|mostly worth it|exceptional)$/i.test(t)});return heads.sort((a,b)=>(parseFloat(getComputedStyle(b).fontSize)||0)-(parseFloat(getComputedStyle(a).fontSize)||0))[0]||null}
  function immediateChildWithin(card,node){let n=node;while(n?.parentElement&&n.parentElement!==card)n=n.parentElement;return n?.parentElement===card?n:null}
  function actionWrap(card,cta){let n=cta.parentElement,last=cta;while(n&&n!==card){last=n;const controls=[...n.querySelectorAll(':scope > a,:scope > button')];if(controls.some(isCTA))return n;n=n.parentElement}return last}
  function collect(){const ctas=[...document.querySelectorAll('a,button')].filter(isCTA).filter(el=>el.offsetParent!==null),cards=[];for(const cta of ctas){const card=findCard(cta);if(!card||cards.some(x=>x.card===card))continue;cards.push({card,title:findTitle(card),content:immediateChildWithin(card,cta),actions:actionWrap(card,cta)})}return cards}
  function railFor(card,cards){let p=card.parentElement;while(p&&p!==document.body){if(cards.filter(x=>p.contains(x.card)).length>=2)return p;p=p.parentElement}return card.parentElement}
  function align(){
    addStyle();const cards=collect();if(cards.length<2)return;
    for(const x of cards){x.card.classList.add('vyrdict-equal-card');x.content?.classList.add('vyrdict-card-content');x.actions?.classList.add('vyrdict-card-actions');x.title?.classList.add('vyrdict-card-title');if(x.title)x.title.style.minHeight='';x.card.style.minHeight=''}
    const rails=[];for(const x of cards){const rail=railFor(x.card,cards);if(rail&&!rails.includes(rail))rails.push(rail)}
    requestAnimationFrame(()=>{for(const rail of rails){const group=cards.filter(x=>rail.contains(x.card));if(group.length<2)continue;const maxTitle=Math.max(...group.map(x=>x.title?Math.ceil(x.title.getBoundingClientRect().height):0),0);if(maxTitle)group.forEach(x=>{if(x.title)x.title.style.minHeight=maxTitle+'px'});requestAnimationFrame(()=>{const maxCard=Math.max(...group.map(x=>Math.ceil(x.card.getBoundingClientRect().height)),0);if(maxCard)group.forEach(x=>x.card.style.minHeight=maxCard+'px')})}})
  }
  function queue(delay=60){clearTimeout(queued);queued=setTimeout(align,delay)}
  function schedule(){[0,180,650].forEach(ms=>setTimeout(align,ms))}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  addEventListener('resize',()=>queue(140));addEventListener('popstate',schedule);addEventListener('hashchange',schedule);
  document.addEventListener('click',()=>queue(260),{passive:true});
  const observe=()=>{const app=document.getElementById('app');if(app)new MutationObserver(()=>queue(80)).observe(app,{childList:true,subtree:false})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observe,{once:true});else observe();
})();
