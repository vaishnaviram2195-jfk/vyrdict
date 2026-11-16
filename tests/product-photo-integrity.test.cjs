const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

function cover(){
 const html=read('shop-the-feed/index.html');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script,'shop script exists');
 new Function(script);
 const begin=script.indexOf('var cover=function(e){');
 const end=script.indexOf('\n var categories=',begin);
 assert.ok(begin>=0&&end>begin,'cover renderer exists');
 const source=script.slice(begin,end);
 const loc={origin:'https://vyrdict.com'};
 const validImg=u=>{try{const p=new URL(String(u||''),loc.origin);return ['https:','http:'].includes(p.protocol)?p.href:''}catch{return''}};
 const esc=u=>String(u??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 return new Function('validImg','esc','location',source+';return cover;')(validImg,esc,loc);
}
test('Shop the Feed cover selects an actual linked product image over a Verdict card',()=>{
 const html=cover()({title:'Test edit',cover_url:'https://vyrdict.com/vyrdict-social-preview.jpg',products:[
  {image_url:'https://brand.example/actual-product.jpg'},
  {image_url:'https://brand.example/second-product.jpg'}
 ]});
 assert.match(html,/actual-product.jpg/);
 assert.match(html,/data-alternative="https:\/\/brand\.example\/second-product\.jpg"/);
 assert.doesNotMatch(html,/vyrdict-social-preview|VYRDICT \/ THE EDIT/);
});
test('A real photo is used for editorial-only edits too',()=>{
 const html=cover()({title:'Perfume Edit',cover_url:'https://retailer.example/perfume.jpg',products:[]});
 assert.match(html,/perfume.jpg/);
 assert.match(html,/data-original="https:\/\/retailer\.example\/perfume\.jpg"/);
 assert.doesNotMatch(html,/VYRDICT \/ THE EDIT/);
});
test('Missing photos never turn into fabricated branded product-image tiles',()=>{
 const html=cover()({title:'Missing',cover_url:'https://vyrdict.com/vyrdict-social-preview.jpg',products:[]});
 assert.match(html,/Product photography unavailable/);
 assert.doesNotMatch(html,/<svg|VYRDICT \/ THE EDIT|vyrdict-social-preview/);
});
test('Shared image failure handler retries original images, never generates SVG branding',()=>{
 const script=read('image-fallback.js');
 assert.doesNotThrow(()=>new Function(script));
 assert.match(script,/img\.dataset\.original/);
 assert.match(script,/img\.dataset\.vyrdictAlternate/);
 assert.doesNotMatch(script,/data:image\/svg\+xml|viewBox="0 0 800 800"/);
});
test('Product SEO hero never uses the social preview as merchandise photography',()=>{
 const src=read('api/product-seo.js');
 assert.doesNotThrow(()=>new Function('module',src));
 assert.match(src,/const image=secureImage\(p\.image_url\);/);
 assert.match(src,/const shareImage=image\|\|'https:\/\/vyrdict\.com\/vyrdict-social-preview\.jpg'/);
 assert.ok(src.includes('displayImage?'));
 assert.doesNotMatch(src,/const image=secureImage\(p\.image_url\)\|\|'https:\/\/vyrdict\.com\/vyrdict-social-preview\.jpg'/);
});
