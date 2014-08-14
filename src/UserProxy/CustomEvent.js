define(["utils"], function(utils){
  function addEventListener(event, listener) {
    if (!events[event]) {
      // Creating the array of listeners for event
      events[event] = [];
      
      docListeners[event] = utils.bind(null, eventListener, event, events[event]);
      
      // Adding the event listener.
      window.addEventListener(event, docListeners[event], false);
    }
    
    // Adding listener to array.
    events[event].push(listener);
  }
  
  function removeEventListener(event, listener) {
    if (event in events) {
      for (var i = 0, len = events[event].length; i < len; i++) {
        if (events[event][i] === listener) {
          events[event].splice(i, 1);
          i--; len--;
        }
      }
      if (events[event].length === 0) {
        window.removeEventListener(event, docListeners[event], false);
        
        events[event] = null;
        docListeners[event] = null;
      }
    }
  }
  
  function eventListener(event, listeners, e) {
    e = e || window.event;
    
    // Parse the detail to the original object.
    var data = JSON.parse(e.detail);
    
    if (typeof data.detail === "object" && data.token !== token) {
      var detail = data.detail;
      for (var i = 0, len = listeners.length; i < len; i++) {
        // Call the listener with the event name and the parsed detail.
        listeners[i](detail);
      }
      
      // Prevent propagation
      if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
    }
  }
  
  function fireEvent(event, detail) {
    // Creating the event
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent(event, true, true, JSON.stringify({ detail: detail, token: token }));
    
    // Firing the event
    document.documentElement.dispatchEvent(e);
  }
  
  var token = utils.generateToken(); // The token is used to identify itself and prevent calling its own listeners.
  var events = {};
  var docListeners = {};
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    fireEvent: fireEvent
  };
});