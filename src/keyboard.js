define(["unsafeWindow", "utils", "console"], function(uw, utils, con){
  function addKeyboardAction(id, name, defaultKey, eventOn, action) {
    if (typeof defaultKey === "string") {
      defaultKey = [defaultKey];
      con.warn("Pass defaultKey as an array!");
    }
    if (typeof eventOn === "string") {
      eventOn = [eventOn];
      con.warn("Pass eventOn as an array!");
    }
    
    details[id] = {
      name: name, // The name of the action (will be used to describe the action).
      defaultKey: defaultKey, // The default keys
      eventOn: eventOn, // The events that the action should be executed on
      action: action // The action that should be executed when every condition is met.
    };
  }
  
  function keyListener(eventName, e) {
    e = e || uw.event;
    
    var keyCode = e.keyCode;
    
    for (var i = 0, len = listeners.length; i < len; i++) {
      var listener = listeners[i];
      var detail = details[listener.key];
      
      var keys = listener.keys || detail.defaultKey;
      if (detail.eventOn === eventName) {
        if (utils.inArray(keyCode, keys)) {
          detail.action();
        }
      }
    }
  }
  
  var details = {};
  var listeners = [];
  
  uw.addEventListener("keydown", utils.bind(null, keyListener, "keydown"), false);
  uw.addEventListener("keypress", utils.bind(null, keyListener, "keypress"), false);
  
  return {
    addKeyboardAction: addKeyboardAction
  };
});