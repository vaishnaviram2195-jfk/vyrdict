(()=>{
  if(document.getElementById('vyrdict-seen-on-screen-image-fit'))return;
  const style=document.createElement('style');
  style.id='vyrdict-seen-on-screen-image-fit';
  style.textContent=`
    img[data-vyrdict-screen-main="1"]{
      object-fit:contain !important;
      object-position:center center !important;
      max-width:100% !important;
      max-height:100% !important;
    }
    .productHero .media img[data-vyrdict-screen-main="1"]{
      object-fit:contain !important;
      object-position:center center !important;
    }
    [data-vyrdict-screen] img[data-vyrdict-screen-main="1"]{
      object-fit:contain !important;
      object-position:center center !important;
    }
  `;
  document.head.appendChild(style);
})();
