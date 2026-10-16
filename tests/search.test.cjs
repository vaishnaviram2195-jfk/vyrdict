const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const handler=require('../lib/search-handler');

async function render(q,reply){
  const original=global.fetch;
  global.fetch=async()=>{if(reply instanceof Error)throw reply;return {ok:true,json:async()=>reply}};
  const response={headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.code=code;return this},send(html){this.html=html;return this}};
  try{return await handler({method:'GET',query:{q}},response)}finally{global.fetch=original}
}

test('zero results include an immediate, safe suggestion link preserving the exact query',async()=>{
  const q='A&B "<special>" comb';
  const response=await render(q,[]);
  assert.equal(response.code,200);
  assert.match(response.html,/Can’t find the product you’re looking for\?/);
  assert.ok(response.html.includes('href="/suggest-product.html?q='+encodeURIComponent(q).replaceAll("'",'&#39;')+'"'));
  assert.ok(!response.html.includes('<special>'));
  assert.match(response.html,/<div id="search-result-list"[^>]*><div class="search-empty" data-search-empty>/);
});

test('matching products do not show the missing-product prompt',async()=>{
  const response=await render('Medicube',[{slug:'medicube-zero-pore-pad-2',brand:'Medicube',name:'Zero Pore Pad 2.0',viral_score:92,worth_score:74}]);
  assert.equal(response.code,200);
  assert.match(response.html,/href="\/product\/medicube-zero-pore-pad-2\/"/);
  assert.ok(!response.html.includes('data-search-empty'));
});

test('a catalog failure does not claim a product is missing',async()=>{
  const response=await render('Medicube',new Error('Network unavailable'));
  assert.equal(response.code,503);
  assert.match(response.html,/Search is temporarily unavailable/);
  assert.ok(!response.html.includes('data-search-empty'));
});

function liveSearch(){
  const handlers={},timers=new Map(),requests=[];
  let timerId=0;
  const form={action:'https://vyrdict.com/search/',addEventListener:(key,fn)=>handlers['form:'+key]=fn};
  const input={value:'',closest:()=>form,addEventListener:(key,fn)=>handlers[key]=fn};
  const results={innerHTML:'initial products',hidden:false,attributes:{},setAttribute(k,v){this.attributes[k]=v}};
  const summary={textContent:'Explore scored products.'};
  const location=new URL('https://vyrdict.com/search/?qa=test');
  const fetch=(_,options)=>new Promise((resolve,reject)=>requests.push({options,resolve,reject}));
  vm.runInNewContext(fs.readFileSync('search-live.js','utf8'),{
    window:{fetch,AbortController},fetch,AbortController,URL,URLSearchParams,location,
    document:{getElementById:id=>({'product-search':input,'search-result-list':results,'search-summary':summary}[id])},
    DOMParser:class{parseFromString(text){const parsed=JSON.parse(text);return {getElementById:id=>parsed[id]}}},
    history:{state:null,replaceState(_,__,path){location.href=new URL(path,location.href).href}},
    addEventListener:(key,fn)=>handlers[key]=fn,
    setTimeout:fn=>{timers.set(++timerId,fn);return timerId},clearTimeout:id=>timers.delete(id)
  });
  return {input,results,summary,location,requests,
    type(value){input.value=value;handlers.input();const [id,fn]=[...timers].at(-1);timers.delete(id);return fn()},
    reply(i,html,label){requests[i].resolve({ok:true,text:async()=>JSON.stringify({'search-result-list':{innerHTML:html},'search-summary':{textContent:label}})})}
  };
}

test('typing alone replaces results with the suggestion prompt as soon as no matches return',async()=>{
  const ui=liveSearch(),pending=ui.type('A missing product');
  assert.equal(ui.results.hidden,true);
  assert.equal(ui.summary.textContent,'Searching…');
  ui.reply(0,'<a href="/suggest-product.html?q=A%20missing%20product">Suggest a product</a>','0 matches');
  await pending;
  assert.equal(ui.results.hidden,false);
  assert.equal(ui.results.attributes['aria-busy'],'false');
  assert.match(ui.results.innerHTML,/Suggest a product/);
  assert.equal(ui.location.searchParams.get('q'),'A missing product');
  assert.equal(ui.location.searchParams.get('qa'),'test');
});

test('late empty responses cannot overwrite a newer matching query, and clearing restores products',async()=>{
  const ui=liveSearch(),old=ui.type('missing'),latest=ui.type('Medicube');
  assert.equal(ui.requests[0].options.signal.aborted,true);
  ui.reply(1,'Medicube product card','1 match');await latest;
  ui.reply(0,'Stale suggestion prompt','0 matches');await old;
  assert.equal(ui.results.innerHTML,'Medicube product card');
  const cleared=ui.type('');ui.reply(2,'Explore products','Explore scored products.');await cleared;
  assert.equal(ui.results.innerHTML,'Explore products');
  assert.equal(ui.location.searchParams.has('q'),false);
});

test('live request failure shows retry feedback without a false suggestion prompt',async()=>{
  const ui=liveSearch(),pending=ui.type('Medicube');
  ui.requests[0].reject(new Error('Offline'));await pending;
  assert.equal(ui.results.innerHTML,'');
  assert.equal(ui.results.hidden,false);
  assert.match(ui.summary.textContent,/temporarily unavailable/);
});
