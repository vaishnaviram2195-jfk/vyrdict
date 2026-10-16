const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');const {webcrypto}=require('node:crypto');
const source=fs.readFileSync('hub-analytics.js','utf8');
const storage=()=>{const values=new Map();return {getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,String(v))}};
function run(href,{local=storage(),session=storage(),referrer='',links=[],hasMainTracker=false,gpc=false}={}){
 const events=[],handlers={},location=new URL(href),history={state:null,replaceState(_,__,path){const next=new URL(path,location.href);for(const k of ['href','pathname','search','hash'])location[k]=next[k]}};
 const window={};const document={referrer,querySelector:()=>hasMainTracker?{}:null,querySelectorAll:()=>links};
 vm.runInNewContext(source,{window,document,location,history,localStorage:local,sessionStorage:session,navigator:{globalPrivacyControl:gpc},crypto:webcrypto,URL,Date,console,setTimeout:()=>{},addEventListener:(k,f)=>handlers[k]=f,fetch:(u,o)=>{events.push(JSON.parse(o.body));return Promise.resolve({status:204})}});
 return {events,window,local,session,handlers,location};
}
function link(href){const h={};return {getAttribute:()=>href,setAttribute:(k,v)=>{if(k==='href')href=v},addEventListener:(k,f)=>h[k]=f,handlers:h,url:()=>href}}
test('hub arrival, each destination click, and corresponding page arrival share correlation IDs',()=>{
 for(const [section,dest] of [['products','https://vyrdict.com/'],['products','https://vyrdict.com/edit/haunted-antiques/'],['studio','/links/studio/'],['work','/links/work/'],['news','/#news']]){
 const l=link(dest),a=run('https://vyrdict.com/links/?utm_source=ig',{referrer:'https://l.instagram.com/',links:[l]});
 assert.deepEqual(a.events.map(e=>e.event_name),['page_view','hub_view']);assert.equal(a.events[1].hub_is_entry,true);
 l.handlers.click({button:0,defaultPrevented:false});const click=a.events.at(-1);assert.equal(click.hub_section,section);
 const b=run(l.url(),{local:a.local,session:a.session,referrer:'https://vyrdict.com/links/',hasMainTracker:section==='products'||section==='news'});
 const arrival=b.events.find(e=>e.event_name==='hub_destination_view');assert.ok(arrival);assert.equal(arrival.hub_click_id,click.hub_click_id);assert.equal(arrival.hub_visit_id,a.events[1].hub_visit_id);assert.equal(arrival.visitor_id,click.visitor_id);assert.equal(arrival.session_id,click.session_id);assert.equal(arrival.landing_referrer,'https://l.instagram.com/');assert.equal(b.location.search,'');if(section==='news')assert.equal(b.location.hash,'#news');
 }
});
test('hub refresh keeps one browser/session; later hub view is a new view',()=>{const a=run('https://vyrdict.com/links/');const b=run('https://vyrdict.com/links/',{local:a.local,session:a.session});assert.equal(a.events[1].visitor_id,b.events[1].visitor_id);assert.equal(a.events[1].session_id,b.events[1].session_id);assert.notEqual(a.events[1].hub_visit_id,b.events[1].hub_visit_id)});
test('marked tests and privacy opt-outs do not emit events',()=>{for(const path of ['?qa=1','?nav-health=1','?studio_nav=20'])assert.equal(run('https://vyrdict.com/links/'+path).events.length,0);assert.equal(run('https://vyrdict.com/links/',{gpc:true}).events.length,0)});
test('direct destination loads do not invent hub conversions; forged destinations do not confirm',()=>{assert.equal(run('https://vyrdict.com/links/studio/').events.some(e=>e.event_name==='hub_destination_view'),false);const r=run('https://vyrdict.com/links/work/?vyrdict_hub_section=studio&vyrdict_hub_click=c_123456789&vyrdict_hub_visit=h_123456789');assert.equal(r.events.some(e=>e.event_name==='hub_destination_view'),false)});
test('external links record click only, and canceled clicks do not count',()=>{const l=link('mailto:hello@vyrdict.com'),r=run('https://vyrdict.com/links/',{links:[l]});l.handlers.click({button:0,defaultPrevented:true});assert.equal(r.events.length,2);l.handlers.click({button:0,defaultPrevented:false});assert.equal(r.events.at(-1).hub_section,'email');assert.equal(l.url(),'mailto:hello@vyrdict.com')});
test('old browser identity and idle sessions rotate',()=>{const a=run('https://vyrdict.com/links/');const saved=JSON.parse(a.local.getItem('vyrdict:hub:visitor:v1'));saved.started=Date.now()-31*86400000;a.local.setItem('vyrdict:hub:visitor:v1',JSON.stringify(saved));const sess=JSON.parse(a.session.getItem('vyrdict:hub:session:v1'));sess.last=Date.now()-31*60000;a.session.setItem('vyrdict:hub:session:v1',JSON.stringify(sess));const b=run('https://vyrdict.com/links/',{local:a.local,session:a.session});assert.notEqual(a.events[1].visitor_id,b.events[1].visitor_id);assert.notEqual(a.events[1].session_id,b.events[1].session_id)});
