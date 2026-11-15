const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const NOW=Date.parse('2026-11-15T22:30:00Z');
const ago=d=>new Date(NOW-d*86400000).toISOString();
class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]))}static now(){return NOW}}
const product=(slug,days,rest={})=>({
 slug,name:slug,brand:'Brand',category:'Skincare',image_url:'https://brand.example/product.jpg',
 viral_score:90,worth_score:80,trend_score:80,evidence_status:'verified',
 current_signal:true,newest_mention_at:ago(days),last_verified_at:ago(80),published_at:ago(80),...rest
});
async function run(products,{limit=24,mode=null,fail=false,invalid=false}={}){
 const calls=[],headers={};let status,body;
 const context=vm.createContext({
  module:{exports:{}},Date:Clock,URLSearchParams,AbortSignal:{timeout:()=>({})},
  fetch:async url=>{
   calls.push(String(url));if(fail)throw Error('upstream down');
   return {ok:true,json:async()=>invalid?{}:mode==='recent'?products:{products,window_days:7,calculated_at:ago(0)}};
  }
 });
 vm.runInContext(readFileSync(path.join(__dirname,'../api/viral-now.js'),'utf8'),context);
 const res={setHeader(k,v){headers[k]=v},status(n){status=n;return this},json(j){body=JSON.parse(JSON.stringify(j))}};
 await context.module.exports({query:{limit,...(mode?{mode}:{})}},res);
 return {status,body,calls,headers};
}
test('current viral feed includes source-backed live mentions, even when original review is old',async()=>{
 const items=[product('coach-current',3,{trend_score:92,last_verified_at:ago(90)}),product('newer',1,{trend_score:80,last_verified_at:ago(5)})];
 const r=await run(items);
 assert.equal(r.status,200);assert.deepEqual(r.body.products.map(x=>x.slug),['coach-current','newer']);
 assert.equal(r.body.products[0].last_verified_at,ago(90));
 assert.equal(r.body.window_days,7);
 assert(r.calls[0].includes('vyrdict-weekly-rankings'));
});
test('stale mentions, products without live pulse or unverified rows are excluded',async()=>{
 const r=await run([product('good',2),product('old-source',9),product('no-pulse',1,{current_signal:false}),product('unverified',1,{evidence_status:'pending'}),product('missing-image',1,{image_url:''})]);
 assert.deepEqual(r.body.products.map(x=>x.slug),['good']);
});
test('legitimate no-current-products case stays empty, with no stale fallback',async()=>{
 const r=await run([]);
 assert.equal(r.status,200);assert.deepEqual(r.body.products,[]);
 assert.equal(r.body.window_days,7);
});
test('a failed or invalid source does not reintroduce old products',async()=>{
 const fail=await run([], {fail:true});assert.equal(fail.status,500);assert.deepEqual(fail.body.products,[]);
 const invalid=await run([], {invalid:true});assert.equal(invalid.status,200);assert.deepEqual(invalid.body.products,[]);
});
test('newly published mode still requires a verified product published in the last seven days',async()=>{
 const rows=[product('fresh-publication',1,{published_at:ago(1)}),product('old-review',1,{published_at:ago(40)}),product('not-verified',1,{evidence_status:'pending'})];
 const r=await run(rows,{mode:'recent'});
 assert.equal(r.status,200);assert.deepEqual(r.body.products.map(x=>x.slug),['fresh-publication']);
});
async function renderPage(rows,stories=[]){
 const ids=new Map(['grid','stamp','news-grid','latest-news'].map(id=>[id,{innerHTML:'',textContent:'',hidden:id==='latest-news'}]));
 const html=readFileSync(path.join(__dirname,'../viral-now.html'),'utf8');
 const script=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
 const tasks=[];
 vm.runInNewContext(script,{
  document:{getElementById:id=>ids.get(id)},
  Date:Clock,URL,location:{origin:'https://vyrdict.com'},
  sessionStorage:{getItem:()=>null,setItem(){}},
  fetch:async url=>{tasks.push(url);return {ok:true,json:async()=>String(url).startsWith('/api/stories')?{stories}:{products:rows,generated_at:ago(0),window_days:7}}}
 });
 await new Promise(resolve=>setImmediate(resolve));
 return ids;
}
test('viral page shows current signal date and actual historical review date',async()=>{
 const ids=await renderPage([product('current',2,{last_verified_at:ago(80)})]);
 assert.match(ids.get('grid').innerHTML,/Current mention/);
 assert.match(ids.get('grid').innerHTML,/Original review checked/);
 assert.match(ids.get('grid').innerHTML,/SOURCE-BACKED THIS WEEK/);
 assert.match(ids.get('stamp').textContent,/1 source-backed trends/);
});
test('viral page displays an honest empty state instead of a perpetual skeleton',async()=>{
 const ids=await renderPage([]);
 assert.match(ids.get('grid').innerHTML,/No product currently meets/);
 assert.doesNotMatch(ids.get('grid').innerHTML,/class="skeleton"/);
});
for(const [filename,slug] of [['seen-on-screen.html','seen-on-screen'],['celebrity-effect.html','celebrity-effect']]){
 test(filename+' archives older reviews and preserves latest signals',async()=>{
  const html=readFileSync(path.join(__dirname,'..',filename),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  const ids=new Map(['products','signals','archived-products','stamp','archive-section','archive-count'].map(id=>[id,{innerHTML:'',hidden:id==='archive-section',textContent:''}]));
  const old=product('older',90),newer=product('recent',10,{last_verified_at:ago(10)});
  vm.runInNewContext(script,{
   document:{getElementById:id=>ids.get(id)},location:{pathname:'/collection/'+slug+'/',origin:'https://vyrdict.com'},
   Date:Clock,URL,console,fetch:async()=>({ok:true,json:async()=>({products:[old,newer],signals:[],generated_at:ago(0)})})
  });
  await new Promise(resolve=>setImmediate(resolve));
  assert.match(ids.get('products').innerHTML,/\/product\/recent\//);
  assert.doesNotMatch(ids.get('products').innerHTML,/\/product\/older\//);
  assert.match(ids.get('archived-products').innerHTML,/\/product\/older\//);
  assert.equal(ids.get('archive-section').hidden,false);
  assert.equal(ids.get('archive-count').textContent,'(1)');
  assert.match(ids.get('signals').innerHTML,/No new/);
 });
}
