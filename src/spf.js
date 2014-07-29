define(["unsafeWindow", "pageload"], function(uw, pageload){
  function setEnabled(enabled) {
    var spfEnabled = isEnabled();
    if (enabled) {
      if (!spfEnabled && uw && uw.spf && typeof uw.spf.init === "function") {
        uw.spf.init();
      }
    } else {
      if (spfEnabled && uw && uw.spf && typeof uw.spf.dispose === "function") {
        uw.spf.dispose();
      }
    }
  }
  function isEnabled() {
    return uw && uw._spf_state && uw._spf_state["history-init"];
  }
  
  function addEventListener(event, callback) {
    if (!attachedEvents[event]) attachedEvents[event] = [];
    attachedEvents[event].push(callback);
  }
  
  function removeEventListener(event, callback) {
    if (!attachedEvents[event]) return;
    for (var i = 0, len = attachedEvents[event].length; i < len; i++) {
      if (attachedEvents[event][i] === callback) {
        attachedEvents[event].splice(i, 1);
        i--; len--;
      }
    }
  }
  
  function listener(event, e) {
    var args = Array.prototype.slice.call(arguments, 1);
    con.log("[SPF] " + event, args);
    var listeners = attachedEvents[event];
    if (listeners) {
      for (var i = 0, len = listeners.length; i < len; i++) {
        listeners[i].call(this, e.detail);
      }
    }
  }
  
  function init() {
    for (var i = 0, len = spfEvents.length; i < len; i++) {
      var boundListener = bind(null, listener, spfEvents[i]);
      events.push(boundListener);
      
      document.addEventListener(customEventPrefix + spfEvents[i], boundListener, false);
    }
  }
  
  function dispose() {
    if (events.length === spfEvents.length) {
      for (var i = 0, len = spfEvents.length; i < len; i++) {
        document.removeEventListener(customEventPrefix + spfEvents[i], events[i], false);
      }
      events = [];
    }
  }
  
  var customEventPrefix = "spf";
  var spfEvents = [ "error", "requested", "partreceived", "partprocessed", "received", "processed", "ready", "jsbeforeunload", "jsunload", "cssbeforeunload", "cssunload" ];
  
  var attachedEvents = { };
  var events = [ ];
  
  init();
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    setEnabled: setEnabled,
    isEnabled: isEnabled,
    init: init,
    dispose: dispose
  };
});