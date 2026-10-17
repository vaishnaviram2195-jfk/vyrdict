const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const path=require('node:path');

function setup(hash='#meet-the-founder'){
  const events={},frames=new Map(),timers=new Map(),scrolls=[];
  let next=0,targetTop=2000,resize;
  const win={scrollY:0,addEventListener:(type,fn)=>{events[type]=fn},scrollTo(options){scrolls.push(options);this.scrollY=options.top}};
  const context={window:win,location:{hash},document:{readyState:'complete',body:{},getElementById:id=>id==='meet-the-founder'?{getBoundingClientRect:()=>({top:targetTop-win.scrollY})}:null,querySelector:()=>({getBoundingClientRect:()=>({height:96})})},ResizeObserver:class{constructor(fn){resize=fn}observe(){}disconnect(){}},requestAnimationFrame:fn=>{frames.set(++next,fn);return next},cancelAnimationFrame:id=>frames.delete(id),setTimeout:fn=>{timers.set(++next,fn);return next},clearTimeout:id=>timers.delete(id)};
  vm.runInNewContext(readFileSync(path.join(__dirname,'../founder-anchor.js'),'utf8'),context);
  const flush=()=>{for(const [id,fn] of [...frames]){frames.delete(id);fn()}};
  return {events,scrolls,context,flush,shift(top){targetTop=top;resize?.()},expire(){for(const fn of [...timers.values()])fn()}};
}

test('the founder hash aligns the heading below the actual sticky header',()=>{
  const r=setup();r.flush();
  assert.equal(r.scrolls.length,1);
  assert.equal(r.scrolls[0].top,2000-96-18);
  assert.equal(r.scrolls[0].behavior,'instant');
});

test('late layout changes realign the heading until the visitor interacts',()=>{
  const r=setup();r.flush();r.shift(2400);r.flush();
  assert.equal(r.scrolls.at(-1).top,2400-96-18);
  const count=r.scrolls.length;
  r.events.touchstart();r.shift(2800);r.flush();r.events.load();r.flush();
  assert.equal(r.scrolls.length,count);
});

test('alignment ends after the short settling window and ignores unrelated hashes',()=>{
  const r=setup();r.flush();r.expire();r.shift(2500);r.flush();
  assert.equal(r.scrolls.length,1);
  const other=setup('#news');other.flush();
  assert.equal(other.scrolls.length,0);
});
