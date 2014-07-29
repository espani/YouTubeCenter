define([], function(){
  function setEnabled(style, enabled) {
    var element = document.getElementById(cssPrefix + style);
    if (element) {
      if (!enabled) {
        element.parentNode.removeChild(element);
      }
    } else {
      if (enabled) {
        // Add style element to document
      }
    }
  }
  var cssPrefix = "ytc-";
  
  var styles = {
    "path/to/file": "/* CSS HERE */"
  };
  
  return {
    setEnabled: setEnabled,
    listStyles: null
  };
});