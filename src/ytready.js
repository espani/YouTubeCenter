define(["exports", "./pageload", "unsafeWindow"], function(exports, pageload, uw){
  function addEventListener(path, callback) {
    if (!paths[path]) paths[path] = [];
    paths[path].push(callback);
    
    update();
  }
  
  function removeEventListener(path, callback) {
    if (!paths[path]) return;
    for (var i = 0, len = paths[path].length; i < len; i++) {
      if (paths[path][i] === callback) {
        paths[path].splice(i, 1);
        return;
      }
    }
  }
  
  /**
  * Checks if the path in unsafeWindow is defined.
  *
  * @method propertyExists
  * @param {String} path The path to the property.
  * @return {Boolean} Returns true if the property exists otherwise false.
  **/
  function propertyExists(path) {
    var tokens = path.split(".");
    
    var target = uw;
    
    for (var i = 0, len = tokens.length; i < len; i++) {
      if (target[tokens[i]]) {
        target = target[tokens[i]];
      } else {
        return false;
      }
    }
    return true;
  }
  
  /**
  * Checks if the added path listeners exist
  * and if they do then call the callbacks
  * for that specific path listener.
  *
  * @method update
  **/
  function update() {
    for (var path in paths) {
      if (paths[path]) {
        if (propertyExists(path)) {
          var callbacks = paths[path];
          for (var i = 0, len = callbacks.length; i < len; i++) {
            callbacks[i]();
          }
          paths[path] = null;
        }
      }
    }
    timerUpdate();
  }
  
  function isWorking() {
    for (var path in paths) {
      if (paths[path]) {
        return true;
      }
    }
    return false;
  }
  
  function timerUpdate() {
    clearTimeout(timer);
    if (isWorking()) {
      setTimeout(update, timerInterval);
    }
  }
  
  var timerInterval = 1000;
  
  var timer = null;
  var paths = { };
  
  // Attach the update to the page load.
  pageload.addEventListener("uninitialized", update);
  pageload.addEventListener("loading", update);
  pageload.addEventListener("interactive", update);
  pageload.addEventListener("complete", update);
  
  
  /* Exports */
  exports.addEventListener = addEventListener;
  exports.removeEventListener = removeEventListener;
  
  return exports;
});