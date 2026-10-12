/* Preview-only background texture picker. The three pages share a preference. */
(function(){
  "use strict";
  var key="vyrdict_studio_newsletter_pattern";
  var allowed=["dots","grid","stripes"];
  var buttons=[].slice.call(document.querySelectorAll("[data-pattern-choice]"));
  var selected="dots";
  try {
    var saved=window.localStorage.getItem(key);
    if(allowed.indexOf(saved)>=0) selected=saved;
  } catch(e){}
  function apply(pattern){
    if(allowed.indexOf(pattern)<0)return;
    selected=pattern;
    document.body.setAttribute("data-paper-pattern",pattern);
    buttons.forEach(function(button){button.setAttribute("aria-pressed",String(button.getAttribute("data-pattern-choice")===pattern));});
  }
  buttons.forEach(function(button){
    button.addEventListener("click",function(){
      var pattern=button.getAttribute("data-pattern-choice");
      apply(pattern);
      try{window.localStorage.setItem(key,pattern)}catch(e){}
    });
  });
  apply(selected);
})();