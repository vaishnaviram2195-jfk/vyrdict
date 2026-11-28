(()=>{"use strict";
const by=id=>document.getElementById(id);
const products=JSON.parse(by("gift-data").textContent),boards=JSON.parse(by("gift-boards").textContent);
const params=new URLSearchParams(location.search);
const route=location.pathname.match(/^\/gifts\/([a-z0-9-]+)\/?$/);let board=route?.[1]||params.get("board")||"all",sign=params.get("sign")||"",criteria=params.getAll("criteria").filter(t=>/^[a-z0-9-]+$/.test(t)&&t!=="all");const collectionView=document.documentElement.classList.contains("collection-view");
let saved=new Set();try{const a=JSON.parse(localStorage.getItem("vyrdict-gift-saved-v1")||"[]");if(Array.isArray(a))saved=new Set(a.filter(x=>typeof x==="string"));}catch(e){}
const boardLabels=Object.fromEntries(boards.map(b=>[b[0],b[1]]));
Object.assign(boardLabels,{all:"All extraordinary finds.",saved:"Your saved gifts.",her:"For Her",parents:"For Parents",couple:"For Couples",family:"For Families",birthday:"Birthday gifts",anniversary:"Anniversary gifts",personal:"Make it personal.",wow:"Make them say WOW.",spoiled:"Make them feel spoiled.",laugh:"Make them laugh.",coffee:"The Coffee Obsessive",fashion:"The Fashion Girl",collector:"The Collector’s Corner",beauty:"Beauty discoveries",travel:"The Eternal Traveller",homebody:"The Homebody",foodie:"The Foodie",pets:"For Pet Lovers",colleagues:"For Colleagues","baby-shower":"Baby Shower","thank-you":"Thank You",graduation:"Graduation",vintage:"Vintage Treasures",tech:"Tech Enthusiast",kitchen:"Kitchen & Table",games:"Games & Play",decor:"Decor & Home Objects",accessories:"Distinctive Accessories"});
const validSigns=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
if(!validSigns.includes(sign))sign="";
const element=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
const mainBoards=new Set(boards.map(b=>b[0]));
function match(p,t,curated=false){if(t==="all")return true;if(t==="saved")return saved.has(p.id);if(curated&&mainBoards.has(t))return p.boards.includes(t);return p.tags.includes(t)||p.boards.includes(t);}
// Display currency is independent of the retailer's shipping market.
const currencyNames={CAD:"Canadian dollar",USD:"US dollar",GBP:"British pound",EUR:"Euro",INR:"Indian rupee",AUD:"Australian dollar",AED:"UAE dirham",SGD:"Singapore dollar"};
const budgetSteps={CAD:[25,50,100,250],USD:[25,50,100,250],GBP:[20,40,80,200],EUR:[25,50,100,250],INR:[2000,5000,10000,20000],AUD:[40,80,150,350],AED:[100,200,400,900],SGD:[35,70,150,350]};
const currencyKey="vyrdict-gift-currency-v1",fxKey="vyrdict-gift-fx-v1";
const supported=c=>Object.hasOwn(currencyNames,c);
const validPrice=v=>typeof v==="number"&&Number.isFinite(v)&&v>=0;
function detectCurrency(){
  const regionMap={CA:"CAD",US:"USD",GB:"GBP",IN:"INR",AU:"AUD",AE:"AED",SG:"SGD"};
  const euro=new Set("AT BE BG HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES".split(" "));
  const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||"";
  if(zone==="Asia/Kolkata"||zone==="Asia/Calcutta")return "INR";
  if(zone==="Asia/Dubai")return "AED";
  if(zone==="Asia/Singapore")return "SGD";
  if(zone.startsWith("Australia/"))return "AUD";
  if(zone==="Europe/London"||zone==="Europe/Jersey"||zone==="Europe/Guernsey"||zone==="Europe/Isle_of_Man")return "GBP";
  for(const lang of navigator.languages||[navigator.language]){try{const region=new Intl.Locale(lang).region;if(regionMap[region])return regionMap[region];if(euro.has(region))return "EUR";}catch{}}
  return "CAD";
}
let storedCurrency;try{storedCurrency=localStorage.getItem(currencyKey)}catch{}
let activeCurrency=[params.get("currency"),storedCurrency,detectCurrency()].find(supported)||"CAD";
let rates=null,fxDate="",fxPending=false;
const formatMoney=(v,c,whole=false)=>new Intl.NumberFormat(undefined,{style:"currency",currency:c,currencyDisplay:"code",maximumFractionDigits:whole?0:2,minimumFractionDigits:whole?0:2}).format(v);
function priceInfo(p){
  const direct=p.price?.[activeCurrency];
  if(validPrice(direct))return {value:direct,estimated:false};
  const source=Object.keys(currencyNames).find(c=>validPrice(p.price?.[c])&&rates?.[c]>0);
  if(!source||!(rates?.[activeCurrency]>0))return null;
  const value=p.price[source]/rates[source]*rates[activeCurrency];
  return validPrice(value)?{value,estimated:true,source}:null;
}
function price(p){return priceInfo(p)?.value??null}
const finderForm=by("finder-form"),finderBudget=finderForm.querySelector('select[name="budget"]');
const finderCurrency=element("select");finderCurrency.name="currency";finderCurrency.setAttribute("aria-label","Display currency");
const finderLabel=element("label","","Currency");finderLabel.append(finderCurrency);finderBudget.closest("label").before(finderLabel);
const currencyControls=[by("currency"),finderCurrency];
for(const select of currencyControls){select.replaceChildren(...Object.entries(currencyNames).map(([c,n])=>{const o=element("option","",c+" — "+n);o.value=c;return o}));select.value=activeCurrency;}
function syncBudgets(reset=false){
  for(const select of [by("budget"),finderBudget]){
    const previous=reset?"all":select.value;
    const all=element("option","","Any budget");all.value="all";
    select.replaceChildren(all,...budgetSteps[activeCurrency].map(v=>{const o=element("option","","Under "+formatMoney(v,activeCurrency,true));o.value=String(v);return o}));
    select.value=[...select.options].some(o=>o.value===previous)?previous:"all";
  }
}
const disclosure=element("p","fine","Display currency is for reference only. Converted prices are estimates; check the retailer for final pricing, taxes, duties and shipping to your country.");
by("currency").closest(".filters").after(disclosure);
const finderDisclosure=finderForm.parentElement.nextElementSibling;
if(finderDisclosure?.matches("p.fine"))finderDisclosure.textContent="Budget filters use available retailer prices and estimated conversions. Check the retailer for final pricing and delivery availability.";
const priced=products.some(p=>Object.keys(currencyNames).some(c=>validPrice(p.price?.[c])));
function updateDisclosure(){
  disclosure.textContent="Display currency is for reference only. "+(!priced?"Catalogue prices are not yet available. Check individual retailer links. ":fxDate?"Estimated conversions use reference rates dated "+fxDate+". ":"Converted prices are estimates when reference rates are available. ")+"Final prices, taxes, duties and shipping depend on the retailer.";
}
async function loadRates(){
  if(!priced||fxPending||rates)return;
  fxPending=true;
  try{
    let cached=null;try{cached=JSON.parse(localStorage.getItem(fxKey)||"null")}catch{}
    const validate=(r)=>r&&Object.keys(currencyNames).every(c=>typeof r[c]==="number"&&Number.isFinite(r[c])&&r[c]>0);
    const validDate=d=>typeof d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Date.now()-Date.parse(d)<8*86400000&&Date.parse(d)<=Date.now()+86400000;
    if(cached&&Date.now()-cached.fetchedAt<6*3600000&&validDate(cached.date)&&validate(cached.rates)){rates=cached.rates;fxDate=cached.date;}
    else{
      const response=await fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=CAD,GBP,EUR,INR,AUD,AED,SGD",{signal:AbortSignal.timeout(7000)});
      if(!response.ok)throw Error("Reference rates unavailable");
      const rows=await response.json(),next={USD:1},dates=[];
      if(!Array.isArray(rows))throw Error("Invalid reference rates");
      for(const row of rows){if(row.base==="USD"&&supported(row.quote)&&validDate(row.date)&&validPrice(row.rate)&&row.rate>0){next[row.quote]=row.rate;dates.push(row.date)}}
      if(!validate(next))throw Error("Incomplete reference rates");
      rates=next;fxDate=dates.sort()[0];try{localStorage.setItem(fxKey,JSON.stringify({rates,date:fxDate,fetchedAt:Date.now()}))}catch{}
    }
  }catch{}finally{fxPending=false;updateDisclosure();if(collectionView)render()}
}
function changeCurrency(c){
  if(!supported(c))return;
  activeCurrency=c;for(const select of currencyControls)select.value=c;
  try{localStorage.setItem(currencyKey,c)}catch{}
  syncBudgets(true);
  const url=new URL(location.href);url.searchParams.set("currency",c);url.searchParams.delete("budget");history.replaceState(null,"",url);
  updateDisclosure();if(collectionView)render();loadRates();
}
syncBudgets();updateDisclosure();
for(const select of currencyControls)select.addEventListener("change",()=>changeCurrency(select.value));
function updateSaved(){by("saved-nav").textContent="Saved ("+saved.size+")";try{localStorage.setItem("vyrdict-gift-saved-v1",JSON.stringify([...saved]));}catch(e){}}
function card(p){
const n=element("article","product");n.id="gift-"+p.id;
const im=element("img");im.src=p.image;im.alt=p.brand+" "+p.name;im.loading="lazy";im.decoding="async";
im.addEventListener("error",()=>{im.removeAttribute("src");im.alt="Image unavailable — see original guide";},{once:true});
n.append(im);
const save=element("button","save",saved.has(p.id)?"♥":"♡");save.type="button";save.setAttribute("aria-label","Save "+p.name);save.setAttribute("aria-pressed",String(saved.has(p.id)));save.addEventListener("click",()=>{saved.has(p.id)?saved.delete(p.id):saved.add(p.id);updateSaved();if(board==="saved")render();else{save.textContent=saved.has(p.id)?"♥":"♡";save.setAttribute("aria-pressed",String(saved.has(p.id)));}});n.append(save);
n.append(element("div","brand",p.brand),element("h3","",p.name));
const info=priceInfo(p);n.append(element("div","fine",info===null?"Check current retailer price":(info.estimated?"Approx. ":"")+formatMoney(info.value,activeCurrency)));
const note=element("div","gift-note");note.append(element("b","","The VYRDICT Gift Note"),document.createTextNode(p.note||"Explore the original editorial guide for our take."));n.append(note);
if(p.detail){const d=element("details");d.append(element("summary","","Shopping notes"),element("p","",p.detail));n.append(d);}
for(const link of p.links){const a=element("a","retailer",link.label+(link.paid?" (affiliate)":""));a.href=link.url;a.target="_blank";a.rel=link.paid?"sponsored noopener noreferrer":"noopener noreferrer";a.dataset.vyrdictProduct=p.id;a.dataset.productSlug=p.id;a.dataset.vyrdictRetailerSource="gift_encyclopedia";n.append(a);}
if(p.source){const source=element("a","source","Read the original edit ↗");source.href=p.source;n.append(source);}return n;
}
function render(){const q=by("query").value.trim().toLowerCase(),budget=by("budget").value;
let rows=products.filter(p=>match(p,board,!sign)&&criteria.every(t=>match(p,t))&&(!q||[p.name,p.brand,p.note,...p.tags].join(" ").toLowerCase().includes(q))&&(budget==="all"||price(p)!==null&&price(p)<Number(budget)));
by("catalogue-title").textContent=sign?sign+" — gift inspiration":criteria.length?"Your gift finder picks":boardLabels[board]||"Gift discoveries";
by("count").textContent=rows.length+" "+(rows.length===1?"find":"finds");
const grid=by("product-grid");grid.replaceChildren();
if(!rows.length){let msg=board==="saved"?"Your saved gifts will appear here. Tap the heart on a product to keep it.":budget!=="all"?"No gifts currently have an available price matching this budget. Choose Any budget to browse retailer prices.":"No matching published finds yet. Try a broader collection or clear your filters; we're growing the catalogue.";
const b=element("div","empty",msg);const a=element("a",""," Browse all gifts ↗");a.href="/gifts/all/";b.append(a);grid.append(b);}else rows.forEach(p=>grid.append(card(p)));
}
by("query").addEventListener("input",render);by("budget").addEventListener("change",render);
by("clear").addEventListener("click",()=>{criteria=[];by("query").value="";by("budget").value="all";const clearParams=new URLSearchParams({currency:activeCurrency});if(sign)clearParams.set("sign",sign);const url="/gifts/"+encodeURIComponent(board)+"/?"+clearParams.toString();history.replaceState(null,"",url);render();});
by("finder-form").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),q=new URLSearchParams();[f.get("recipient"),f.get("occasion"),f.get("vibe")].filter(x=>x&&x!=="all").forEach(t=>q.append("criteria",t));q.set("currency",activeCurrency);const budget=f.get("budget");if(budget&&budget!=="all")q.set("budget",budget);location.assign("/gifts/all/"+(q.size?"?"+q.toString():""));});
loadRates();updateSaved();if(collectionView){const requestedBudget=params.get("budget");if([...by("budget").options].some(o=>o.value===requestedBudget))by("budget").value=requestedBudget;render();document.title=by("catalogue-title").textContent+" | VYRDICT";const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href="https://vyrdict.com/gifts/"+encodeURIComponent(board)+"/";}
const legacyHash=location.hash.slice(1);
// Old social links must not reopen retired research pages. The Reel section is inserted by a later script.
const homeView=!collectionView&&!document.documentElement.classList.contains("finder-view")&&!document.documentElement.classList.contains("zodiac-view")&&!params.has("board");
if(homeView&&legacyHash){
 const reelAliases=new Set(["seen-it-shop-it","shop-the-feed","objects-of-interest","seen-on-screen"]);
 if(reelAliases.has(legacyHash.toLowerCase())){if(legacyHash!=="objects-of-interest")history.replaceState(history.state,"",location.pathname+location.search+"#objects-of-interest");}
 else if(!document.getElementById(legacyHash)){history.replaceState(history.state,"",location.pathname+location.search);}
}
})();