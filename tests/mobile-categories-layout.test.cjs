const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const {readFileSync}=require('node:fs');
const path=require('node:path');

// Run the real category-bar script with document-flow geometry. A spacer before
// the header shifts that header down, reproducing the overlap in the phone report.
function page(headerHeight=108){
  const ids=new Map(),events={};let resize,desktop=false;
  class Element{
    constructor(tag){this.tagName=tag;this.children=[];this.style={};this.classList={contains:()=>false,remove(){}};}
    set id(id){this._id=id;ids.set(id,this)}get id(){return this._id}
    setAttribute(){}addEventListener(){}
    get isConnected(){return !!this.parentElement}
    get previousElementSibling(){const c=this.parentElement?.children||[];return c[c.indexOf(this)-1]}
    appendChild(el){el.remove();this.children.push(el);el.parentElement=this;return el}
    prepend(el){el.remove();this.children.unshift(el);el.parentElement=this}
    insertAdjacentElement(where,el){el.remove();const p=this.parentElement;const n=p.children.indexOf(this)+(where==='afterend'?1:0);p.children.splice(n,0,el);el.parentElement=p}
    remove(){if(this.parentElement){const c=this.parentElement.children;c.splice(c.indexOf(this),1);this.parentElement=null}}
    querySelector(){return new Element('button')}
    getBoundingClientRect(){
      const c=this.parentElement?.children||[];
      const top=c.slice(0,c.indexOf(this)).reduce((sum,e)=>sum+(e===header?headerHeight:e.id==='vyrdict-mobile-categories-spacer'?44:0),0);
      return {top,bottom:top+(this===header?headerHeight:44),height:this===header?headerHeight:44,width:390};
    }
  }
  const body=new Element('body'),head=new Element('head'),header=new Element('header'),main=new Element('main');body.appendChild(header);body.appendChild(main);
  const document={body,head,readyState:'complete',createElement:t=>new Element(t),getElementById:id=>{const e=ids.get(id);return e?.isConnected?e:null},querySelector:()=>null,querySelectorAll:()=>[header],addEventListener:(t,f)=>{events[t]=f}};
  vm.runInNewContext(readFileSync(path.join(__dirname,'../mobile-categories-hardfix.js'),'utf8'),{document,window:{},getComputedStyle:()=>({display:'block',visibility:'visible'}),matchMedia:()=>({matches:!desktop}),addEventListener:(t,f)=>{events[t]=f},setTimeout(){},ResizeObserver:class{constructor(f){resize=f}observe(){}disconnect(){resize=null}}});
  return {body,header,main,ids,events,setHeight(h){headerHeight=h;resize?.()},desktop(){desktop=true;events.resize()}};
}

test('the mobile bar follows the whole tab header and leaves its own space',()=>{
  for(const height of [66,108,152,187.5]){
    const p=page(height),bar=p.ids.get('vyrdict-mobile-categories-bar'),spacer=p.ids.get('vyrdict-mobile-categories-spacer');
    assert.equal(p.header.getBoundingClientRect().top,0,'the spacer must not move the header down');
    assert.equal(spacer.previousElementSibling,p.header);
    assert.equal(parseFloat(bar.style.top),Math.ceil(height),'no old 110px cap may cover the tab row');
    assert.ok(p.main.getBoundingClientRect().top>=parseFloat(bar.style.top)+43.5,'content clears the categories bar');
  }
});

test('the bar tracks late header size changes and leaves desktop navigation clear',()=>{
  const p=page(108),bar=p.ids.get('vyrdict-mobile-categories-bar');
  p.setHeight(164);
  assert.equal(bar.style.top,'164px');
  assert.equal(p.ids.get('vyrdict-mobile-categories-menu').style.top,'214px');
  p.desktop();
  assert.equal(bar.isConnected,false);
  assert.equal(p.ids.get('vyrdict-mobile-categories-spacer').isConnected,false);
});
