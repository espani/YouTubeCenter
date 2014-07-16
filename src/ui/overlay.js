define([], function(){
  function createElement() {
    var overlay = document.createElement("div");
    overlay.setAttribute("id", "ytcenter-overlay");
    overlay.className = "ytcenter-overlay";
    overlay.style.height = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) + "px";
    return overlay;
  }
  
  return {
    createElement: createElement
  };
});