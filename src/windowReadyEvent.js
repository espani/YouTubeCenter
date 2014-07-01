define(["utils"], function(utils){
  function addEventListener(event, callback) {
    if (!listeners.hasOwnProperty(event)) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
    
    // Make sure the added event listener is executed!
    var readyState = pageStates.indexOf(document.readyState);
    if (readyState <= lastState) {
      callback();
    }
  }
  
  function removeEventListener(event, callback) {
    if (!listeners.hasOwnProperty(event)) {
      return;
    }
    var l = listeners[event];
    for (var i = 0, len = l.length; i < len; i++) {
      if (l[i] === callback) {
        l[i].splice(i, 1);
        return;
      }
    }
  }
  
  function update() {
    var readyState = pageStates.indexOf(document.readyState);
    utils.each(listeners, function(key, val){
      var eventState = pageStates.indexOf(key);
      if (lastState < eventState < readyState) {
        for (var i = 0, len = val.length; i < len; i++) {
          val[i]();
        }
      }
    });
    lastState = readyState;
  }
  
  function init() {
    utils.addEventListener(document, "readystatechange", update, true);
    utils.addEventListener(document, "DOMContentLoaded", update, true);
    update();
  }
  
  var listeners = {};
  var pageStates = ["uninitialized", "loading", "interactive", "complete"];
  var lastState = -1;
  
  init();
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  };
});