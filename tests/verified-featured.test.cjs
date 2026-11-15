const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');
const daysAgo = days => new Date(Date.now() - days * 86400000).toISOString();
const product = (slug, age, changes = {}) => ({
  slug, name: slug, brand: 'Test Brand', category: 'Shoes', image_url: 'https://example.com/'+slug+'.jpg',
  evidence_status: 'verified', evidence_confidence: 'high',
  viral_score: 62, worth_score: 68, published_at: daysAgo(age), last_verified_at: daysAgo(age),
  ...changes
});
const items = [
  product('current-reviewed', 3),
  product('verified-second', 17),
  product('old-dyson', 92),
  product('unverified', 2, {evidence_status: 'pending'}),
  product('low-confidence', 2, {evidence_confidence: 'low'}),
  product('no-scores', 1, {viral_score: null, worth_score: null})
];
const tick = () => new Promise(resolve => setImmediate(resolve));

test('Viral API only returns recent, high-confidence fully scored reviews', async () => {
  const mod = {exports:{}};
  const mockFetch = async () => ({ok:true,json:async()=>items});
  new Function('module','fetch','AbortSignal',source('api/viral-now.js'))(mod,mockFetch,{timeout:()=>null});
  let response, statusCode;
  await mod.exports({query:{mode:'recent',limit:'12'}},{
    setHeader(){},status(n){statusCode=n;return this},json(x){response=x}
  });
  assert.equal(statusCode,200);
  assert.deepEqual(response.products.map(p=>p.slug),['current-reviewed','verified-second']);
  assert.equal(response.window_days,30);
});
test('Actual routed stable homepage excludes old/pending items and displays both scores', async () => {
  const stable = source('stable-home.html');
  const routes = JSON.parse(source('vercel.json')).routes;
  assert.ok(routes.some(x => x.src === '^/$' && x.dest === '/api/home-stable'));
  const script = stable.match(/<script id="vyrdict-home-product-engagement-js-20261006">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const track = {innerHTML:''},images=[{style:{}},{style:{}},{style:{}}];
  const doc={
    getElementById(id){return id==='home-trending-track'?track:null},
    querySelectorAll(sel){return sel==='.motion .mimg'?images:[]}
  };
  const mockFetch = async url => ({
    ok:true,json:async()=>String(url).includes('culture-feed')?{products:[],signals:[]}:{products:items}
  });
  new Function('window','document','fetch',script)({},doc,mockFetch);
  await tick();
  assert.match(track.innerHTML,/current-reviewed/);
  assert.match(track.innerHTML,/verified-second/);
  assert.match(track.innerHTML,/Viral <b>62/);
  assert.match(track.innerHTML,/Worth <b>68/);
  assert.doesNotMatch(track.innerHTML,/old-dyson|unverified|no-scores|low-confidence/);
  assert.match(images[0].style.backgroundImage,/vti-image/);
});
test('Viral collection uses latest reviews rather than unfinished discovery cards', async () => {
  const page=source('viral-now.html');
  const script=page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const elements=new Map(['grid','stamp','latest-news','news-grid'].map(id=>[id,{innerHTML:'',textContent:'',hidden:true}]));
  const doc={getElementById:id=>elements.get(id)};
  const mockFetch=async url=>({ok:true,json:async()=>String(url).includes('/api/stories')?{stories:[]}:{products:items,window_days:30}});
  new Function('document','fetch','sessionStorage','location',script)(doc,mockFetch,{getItem:()=>null,setItem(){}},{origin:'https://vyrdict.com'});
  await tick();
  const html=elements.get('grid').innerHTML;
  assert.match(html,/current-reviewed/);
  assert.match(html,/Worth <b>68/);
  assert.doesNotMatch(html,/old-dyson|unverified|no-scores|low-confidence|Verdict pending/i);
});
test('All featured surfaces and the source feed have strict verification gates', () => {
  const home=source('homepage-moment-top.js');
  const featured=source('fresh-arrivals.js');
  const backend=source('supabase/functions/vyrdict-fresh-arrivals/index.ts');
  for(const content of [home,featured,backend]){
    assert.doesNotMatch(content,/verdict pending|score pending/i);
  }
  assert.match(backend,/evidence_status:"eq.verified"/);
  assert.match(backend,/evidence_confidence:"eq.high"/);
  assert.match(backend,/viral_score/);
  assert.match(backend,/worth_score/);
});
