const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const NOW=Date.parse('2026-10-17T07:00:00Z');
const ago=days=>new Date(NOW-days*86400000).toISOString();
class Clock extends Date{constructor(...args){super(...(args.length?args:[NOW]))}static now(){return NOW}}
const product=(slug,days,extra={})=>({slug,name:slug,brand:'Brand',category:'Tech',image_url:'https://brand.example/product.jpg',viral_score:90,worth_score:80,momentum_score:90,viral_status:'rising',viral_confidence:90,evidence_status:'verified',evidence_confidence:'high',created_at:ago(60),last_verified_at:ago(days),...extra});

async function run(rows,limit=24,fail=false){
  const calls=[],headers={};let status,body;
  const context=vm.createContext({module:{exports:{}},Date:Clock,URLSearchParams,fetch:async url=>{
    calls.push(new URL(url));
    if(fail)throw new Error('upstream unavailable');
    return {ok:true,json:async()=>rows};
  }});
  vm.runInContext(readFileSync(path.join(__dirname,'../api/viral-now.js'),'utf8'),context);
  const res={setHeader(k,v){headers[k]=v},status(n){status=n;return this},json(j){body=JSON.parse(JSON.stringify(j))}};
  await context.module.exports({query:{limit}},res);
  return {status,body,calls,headers};
}

test('a sparse fortnight expands to a recent month without changing review dates',async()=>{
  const rows=[product('newer',10),product('recent',13),...Array.from({length:16},(_,i)=>product('month-'+i,15+i*.8,{viral_score:99,momentum_score:99}))];
  const result=await run(rows);
  assert.equal(result.status,200);
  assert.equal(result.body.products.length,18);
  assert.equal(result.body.window_days,30);
  assert.deepEqual(result.body.products.slice(0,2).map(p=>p.slug),['newer','recent']);
  for(const p of result.body.products)assert.equal(p.last_verified_at,rows.find(r=>r.slug===p.slug).last_verified_at);
  assert(result.calls[0].searchParams.get('or').includes(ago(30)));
});

test('the fuller edit still excludes stale, unverified and weak-evidence products',async()=>{
  const rows=[product('eligible',20),product('too-old',31),product('low-confidence',10,{evidence_confidence:'low'}),product('not-verified',10,{evidence_status:'pending'}),product('mainstay',10,{viral_status:'mainstay'}),product('weak-momentum',10,{momentum_score:40}),product('',10),product('no-image',10,{image_url:' '})];
  const {body}=await run(rows);
  assert.deepEqual(body.products.map(p=>p.slug),['eligible']);
});

test('fresh products fill a small request without pulling in older cards',async()=>{
  const rows=[...Array.from({length:30},(_,i)=>product('fresh-'+i,2)),product('older-high-score',20,{viral_score:100,momentum_score:100})];
  const small=await run(rows,8);
  assert.equal(small.body.window_days,7);
  assert.equal(small.body.products.length,8);
  assert(small.body.products.every(p=>p.slug.startsWith('fresh-')));
  assert.equal((await run(rows,999)).body.products.length,24);
  assert.equal((await run(rows,'invalid')).body.products.length,12);
});

test('an upstream failure returns an honest unavailable response',async()=>{
  const r=await run([],24,true);
  assert.equal(r.status,500);
  assert.equal(r.headers['Cache-Control'],'no-store');
  assert.deepEqual(r.body.products,[]);
});

async function renderPage(products,stories,{productFailure=false,newsFailure=false}={}){
  const ids=new Map(['grid','stamp','news-grid','latest-news'].map(id=>[id,{innerHTML:'',textContent:'',hidden:id==='latest-news'}]));
  const script=readFileSync(path.join(__dirname,'../viral-now.html'),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script,{document:{getElementById:id=>ids.get(id)},location:{origin:'https://vyrdict.com'},URL,Date:Clock,sessionStorage:{getItem:()=>null,setItem(){}},fetch:async url=>{
    const news=url.startsWith('/api/stories');
    return {ok:!(news?newsFailure:productFailure),json:async()=>news?{stories}:{products,window_days:30,generated_at:ago(0)}};
  }});
  await new Promise(resolve=>setImmediate(resolve));
  return ids;
}

const story={headline:'Brand <drop>',image_url:'https://brand.example/story.jpg',source_url:'https://brand.example/story',source_label:'Brand',published_at:ago(1)};
test('Explore renders a full product feed and separately credited news, filtering unsafe links',async()=>{
  const ids=await renderPage(Array.from({length:18},(_,i)=>product('product-'+i,20)),[story,{...story,source_url:'javascript:alert(1)'}]);
  assert.equal((ids.get('grid').innerHTML.match(/class="card"/g)||[]).length,18);
  assert.match(ids.get('stamp').textContent,/18 verified products/);
  assert.equal(ids.get('latest-news').hidden,false);
  assert.equal((ids.get('news-grid').innerHTML.match(/class="card"/g)||[]).length,1);
  assert.match(ids.get('news-grid').innerHTML,/Brand &lt;drop&gt;/);
  assert.match(ids.get('news-grid').innerHTML,/https:\/\/brand.example\/story/);
});

test('news and product requests can fail independently',async()=>{
  const products=await renderPage([product('product',10)],[story],{newsFailure:true});
  assert.match(products.get('grid').innerHTML,/\/product\/product\//);
  assert.equal(products.get('latest-news').hidden,true);
  const news=await renderPage([], [story],{productFailure:true});
  assert.match(news.get('grid').innerHTML,/class="empty"/);
  assert.equal(news.get('latest-news').hidden,false);
});
