define(["exports", "./console"], function(exports, con){
  function isCSSElementEnabled(id) {
    for (var i = 0, len = enabledCSSElements.length; i < len; i++) {
      if (enabledCSSElements[i] === id) {
        return i;
      }
    }
    return -1;
  }
  
  function createCSSElement(id) {
    var el = document.createElement("style");
    el.setAttribute("id", prefix + id);
    el.setAttribute("type", "text\/css");
    el.appendChild(document.createTextNode(cssObject[id]));
    
    return el;
  }
  
  function appendCSSElement(id) {
    var el = cssElements[id];
    removeChildFromParent(el);
    
    if (document && document.body) {
      document.body.appendChild(el);
    } else if (document && document.head) {
      document.head.appendChild(el);
    } else if (document && document.documentElement) {
      document.documentElement.appendChild(el);
    } else if (document) {
      document.appendChild(el);
    } else {
      con.error("Browser document not found.");
    }
  }
  
  function removeChildFromParent(el) {
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }
  
  function setCSSElementEnabled(id, enabled) {
    if (!cssObject.hasOwnProperty(id)) {
      con.error("CSS Element " + id + " was not registered, make sure that it wasn't misspelled!");
      return;
    }
    
    var pos = isCSSElementEnabled(id);
    if (enabled) {
      if (pos === -1) {
        enabledCSSElements.push(id);
        if (!cssElements[id]) {
          cssElements[id] = createCSSElement(id);
        }
        appendCSSElement(id);
      }
    } else {
      if (pos !== -1) {
        enabledCSSElements.splice(pos, 1);
        removeChildFromParent(cssElements[id]);
      }
    }
  }
  
  var prefix = "ytcenter-";
  
  var cssObject = ${css-object};
  var cssElements = {};
  var enabledCSSElements = [];
  
  exports.setEnabled = setCSSElementEnabled;
  
  return exports;
});