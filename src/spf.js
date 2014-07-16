define([], function(){
  function addEventListener(event, callback) {
    throw "Not implemented yet!";
  }
  
  function removeEventListener(event, callback) {
    throw "Not implemented yet!";
  }
  
  function isEnabled() {
    return enabled;
  }
  
  function setEnabled(b) {
    enabled = b;
    throw "Not impleneted yet!";
  }
  
  var eventSet = {
    "error": "navigate-error-callback",
    "part-processed": "navigate-part-processed-callback",
    "part-received": "navigate-part-received-callback",
    "processed": "navigate-processed-callback",
    "received": "navigate-received-callback",
    "requested": "navigate-requested-callback"
  };
  
  var enabled = false;
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    isEnabled: isEnabled,
    setEnabled: setEnabled
  };
});