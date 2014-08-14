define(["utils", "console"], function(utils, con){
  function addEventListener(event, callback) {
    if (!listeners.hasOwnProperty(event)) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
    
    // Make sure the added event listener is executed!
    var readyState = pageStates.indexOf(event);
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
  
  function callListeners(event) {
    var list = listeners[event];
    for (var i = 0, len = list.length; i < len; i++) {
      list[i]();
    }
  }
  
  function update() {
    var readyState = pageStates.indexOf(document.readyState);
    
    for (var i = 0, len = pageStates.length; i < len; i++) {
      if (lastState < i && i <= readyState && utils.isArray(listeners[pageStates[i]])) {
        callListeners(pageStates[i]);
      }
    }
    
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