(()=>{"use strict";
const by=id=>document.getElementById(id);
const products=JSON.parse(by("gift-data").textContent),boards=JSON.parse(by("gift-boards").textContent);
const params=new URLSearchParams(location.search);
const route=location.pathname.match(/^\/gifts\/([a-z0-9-]+)\/?$/);let board=route?.[1]||params.get("board")||"all",sign=params.get("sign")||"",criteria=params.getAll("criteria").filter(t=>/^[a-z0-9-]+$/.test(t)&&t!=="all");const collectionView=document.documentElement.classList.contains("collection-view");
let saved=new Set();try{const a=JSON.parse(localStorage.getItem("vyrdict-gift-saved-v1")||"[]");if(Array.isArray(a))saved=new Set(a.filter(x=>typeof x==="string"));}catch(e){}
const boardLabels=Object.fromEntries(boards.map(b=>[b[0],b[1]]));
Object.assign(boardLabels,{all:"All extraordinary finds.",saved:"Your saved gifts.",her:"For Her",parents:"For Parents",couple:"For Couples",family:"For Families",birthday:"Birthday gifts",anniversary:"Anniversary gifts",personal:"Make it personal.",wow:"Make them say WOW.",spoiled:"Make them feel spoiled.",laugh:"Make them laugh.",coffee:"The Coffee Obsessive",fashion:"The Fashion Girl",collector:"The Collector’s Corner",beauty:"Beauty discoveries",travel:"The Eternal Traveller",homebody:"The Homebody",foodie:"The Foodie",pets:"For Pet Lovers",colleagues:"For Colleagues","baby-shower":"Baby Shower","thank-you":"Thank You",graduation:"Graduation",vintage:"Vintage Treasures",tech:"Tech Enthusiast"});
const validSigns=["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
if(!validSigns.includes(sign))sign="";
const element=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n};
const mainBoards=new Set(boards.map(b=>b[0]));
function match(p,t,curated=false){if(t==="all")return true;if(t==="saved")return saved.has(p.id);if(curated&&mainBoards.has(t))return p.boards.includes(t);return p.tags.includes(t)||p.boards.includes(t);}
function price(p){const v=p.price?.[by("currency").value];return typeof v==="number"&&Number.isFinite(v)?v:null;}
function updateSaved(){by("saved-nav").textContent="Saved ("+saved.size+")";try{localStorage.setItem("vyrdict-gift-saved-v1",JSON.stringify([...saved]));}catch(e){}}
function card(p){
const n=element("article","product");n.id="gift-"+p.id;
const im=element("img");im.src=p.image;im.alt=p.brand+" "+p.name;im.loading="lazy";im.decoding="async";
im.addEventListener("error",()=>{im.removeAttribute("src");im.alt="Image unavailable — see original guide";},{once:true});
n.append(im);
const save=element("button","save",saved.has(p.id)?"♥":"♡");save.type="button";save.setAttribute("aria-label","Save "+p.name);save.setAttribute("aria-pressed",String(saved.has(p.id)));save.addEventListener("click",()=>{saved.has(p.id)?saved.delete(p.id):saved.add(p.id);updateSaved();if(board==="saved")render();else{save.textContent=saved.has(p.id)?"♥":"♡";save.setAttribute("aria-pressed",String(saved.has(p.id)));}});n.append(save);
n.append(element("div","brand",p.brand),element("h3","",p.name));
const v=price(p);n.append(element("div","fine",v===null?"Check current retailer price":new Intl.NumberFormat(undefined,{style:"currency",currency:by("currency").value}).format(v)));
const note=element("div","gift-note");note.append(element("b","","The VYRDICT Gift Note"),document.createTextNode(p.note||"Explore the original editorial guide for our take."));n.append(note);
if(p.detail){const d=element("details");d.append(element("summary","","Shopping notes"),element("p","",p.detail));n.append(d);}
for(const link of p.links){const a=element("a","retailer",link.label+(link.paid?" (affiliate)":""));a.href=link.url;a.target="_blank";a.rel=link.paid?"sponsored noopener noreferrer":"noopener noreferrer";a.dataset.vyrdictProduct=p.id;a.dataset.productSlug=p.id;a.dataset.vyrdictRetailerSource="gift_encyclopedia";n.append(a);}
const source=element("a","source","Read the original edit ↗");source.href=p.source;n.append(source);return n;
}
function render(){const q=by("query").value.trim().toLowerCase(),budget=by("budget").value;
let rows=products.filter(p=>match(p,board,!sign)&&criteria.every(t=>match(p,t))&&(!q||[p.name,p.brand,p.note,...p.tags].join(" ").toLowerCase().includes(q))&&(budget==="all"||price(p)!==null&&price(p)<Number(budget)));
by("catalogue-title").textContent=sign?sign+" — gift inspiration":criteria.length?"Your gift finder picks":boardLabels[board]||"Gift discoveries";
by("count").textContent=rows.length+" "+(rows.length===1?"find":"finds");
const grid=by("product-grid");grid.replaceChildren();
if(!rows.length){let msg=board==="saved"?"Your saved gifts will appear here. Tap the heart on a product to keep it.":budget!=="all"?"No gifts currently have a confirmed price matching this budget and currency. Choose Any budget to browse retailer prices.":"No matching published finds yet. Try a broader collection or clear your filters; we're growing the catalogue.";
const b=element("div","empty",msg);const a=element("a",""," Browse all gifts ↗");a.href="/gifts/all/";b.append(a);grid.append(b);}else rows.forEach(p=>grid.append(card(p)));
}
by("query").addEventListener("input",render);by("budget").addEventListener("change",render);by("currency").addEventListener("change",render);
by("clear").addEventListener("click",()=>{criteria=[];by("query").value="";by("budget").value="all";const url="/gifts/"+encodeURIComponent(board)+"/"+(sign?"?sign="+encodeURIComponent(sign):"");history.replaceState(null,"",url);render();});
by("finder-form").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget),q=new URLSearchParams();[f.get("recipient"),f.get("occasion"),f.get("vibe")].filter(x=>x&&x!=="all").forEach(t=>q.append("criteria",t));const budget=f.get("budget");if(budget&&budget!=="all")q.set("budget",budget);location.assign("/gifts/all/"+(q.size?"?"+q.toString():""));});
updateSaved();if(collectionView){const requestedBudget=params.get("budget");if([...by("budget").options].some(o=>o.value===requestedBudget))by("budget").value=requestedBudget;render();document.title=by("catalogue-title").textContent+" | VYRDICT";const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href="https://vyrdict.com/gifts/"+encodeURIComponent(board)+"/";}
const legacyHash=location.hash.slice(1);
if(legacyHash&&!document.getElementById(legacyHash)&&!collectionView&&!params.has("board")&&/^[a-z0-9_-]+$/i.test(legacyHash)){location.replace("/research/"+location.hash);}
})();