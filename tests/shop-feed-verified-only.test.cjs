const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function product(id,name,changes={}){
  return {
    id,slug:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,brand:'Test Brand',category:'Perfume',
    image_url:'https://retailer.example/'+id+'.jpg',viral_score:66,worth_score:81,
    last_verified_at:'2026-11-04T08:00:00Z',published_at:'2026-11-04T08:00:00Z',
    linked_score_inputs:11,evidence_source_domains:5,...changes
  };
}
const sample={
  ok:true,
  products:[
    product(1,'Verified Perfume'),
    product(2,'Verified Shoe',{category:'Shoes'}),
    product(3,'Unscored Product',{worth_score:null}),
    product(4,'Weak Evidence',{linked_score_inputs:0}),
    product(5,'No Original Photo',{image_url:null})
  ],
  edits:[{slug:'november-perfume-edit',title:'Unverified Perfume Edit',product_count:5,product_ids:[9094,9095,9096,9097,9098]}]
};
async function render(route,edits=sample.edits){
  const nodes=Object.create(null);
  for(const id of ['feed-hero','feed-list','detail','verified-edits','verified-edits-grid','grid','count','filters','search','state','shop-show-more']){
    nodes[id]={innerHTML:'',textContent:'',hidden:id==='detail'||id==='verified-edits',addEventListener(event,cb){this['on_'+event]=cb}};
  }
  const fakeDocument={readyState:'complete',getElementById:id=>nodes[id]};
  const fakeWindow={};
  const fakeLocation={pathname:route,search:''};
  const calls=[];
  const fetch=async url=>{calls.push(String(url));return {ok:true,json:async()=>({...sample,edits})}};
  const src=read('shop-verified.js');
  new Function('window','document','location','fetch','URL','URLSearchParams',src)(
    fakeWindow,fakeDocument,fakeLocation,fetch,URL,URLSearchParams
  );
  await tick();
  return {nodes,calls};
}
test('Original design remains and the legacy unscored fallback is removed',()=>{
  const html=read('shop-the-feed/index.html');
  assert.match(html,/<h1>Seen it\.<br><em>Shop it\.<\/em><\/h1>/);
  assert.match(html,/shop-verified\.js/);
  assert.doesNotMatch(html,/var editorialFallback=/);
  assert.match(html,/id="shop-show-more"/);
});
test('Only fully scored evidence-backed products appear, with both scores',async()=>{
  const {nodes,calls}=await render('/shop-the-feed/');
  const html=nodes.grid.innerHTML;
  assert.match(html,/Verified Perfume/);
  assert.match(html,/Verified Shoe/);
  assert.match(html,/VIRAL SCORE/);
  assert.match(html,/WORTH SCORE/);
  assert.match(html,/66<small>\/100/);
  assert.match(html,/81<small>\/100/);
  assert.match(html,/11 evidence inputs/);
  assert.match(html,/Full evidence \+ where to buy/);
  assert.doesNotMatch(html,/Unscored Product|Weak Evidence|No Original Photo/);
  assert.match(nodes.count.textContent,/2 evidence-verified products/);
  assert.equal(nodes['verified-edits'].hidden,true);
  assert.equal(calls.length,1);
});
test('An unapproved Instagram edit cannot appear as a scored Shop the Feed edit',async()=>{
  const {nodes}=await render('/shop-the-feed/november-perfume-edit/');
  assert.match(nodes.detail.innerHTML,/not fully verified/i);
  assert.doesNotMatch(nodes.detail.innerHTML,/Unverified Perfume Edit|Unscored Product/);
  assert.equal(nodes['feed-list'].hidden,true);
});
test('An edit appears if and only if all its product IDs are verified',async()=>{
  const edits=[{slug:'fully-verified-edit',title:'Fully Verified Edit',product_count:2,product_ids:[1,2]}];
  const {nodes}=await render('/shop-the-feed/fully-verified-edit/',edits);
  assert.match(nodes.detail.innerHTML,/Fully Verified Edit/);
  assert.match(nodes.detail.innerHTML,/Verified Perfume/);
  assert.match(nodes.detail.innerHTML,/Verified Shoe/);
  assert.match(nodes.detail.innerHTML,/VIRAL SCORE/);
  assert.match(nodes.detail.innerHTML,/WORTH SCORE/);
});
test('Database views require proof of scores, evidence and a valid retailer, without anon view access',()=>{
  const sql=read('supabase/migrations/20261115090000_shop_feed_verified_only.sql');
  assert.match(sql,/security_invoker = true/);
  assert.match(sql,/evidence_status = 'verified'/);
  assert.match(sql,/linked_score_inputs'\)::integer,0\) = 11/);
  assert.match(sql,/product_retailers/);
  assert.match(sql,/COUNT\(ep\.product_id\)=COUNT\(vp\.id\)/);
  assert.match(sql,/REVOKE ALL ON public\.vyrdict_shop_verified_products FROM PUBLIC, anon, authenticated/);
  assert.match(sql,/GRANT SELECT ON public\.vyrdict_shop_verified_products TO service_role/);
});
test('Published Edge API reads only the gated catalog and all-approved edits views',()=>{
  const source=read('supabase/functions/vyrdict-shop-verified/index.ts');
  assert.match(source,/vyrdict_shop_verified_products/);
  assert.match(source,/vyrdict_shop_feed_verified_edits/);
  assert.match(source,/linked_score_inputs===11/);
  assert.match(source,/verified_edits_http_/);
});
