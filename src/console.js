define([], function(){
  function setEnabled(b) {
    enabled = b;
  }
  
  function log() {
    if (!enabled) return;
    return console.log.apply(console, Array.prototype.slice.call(arguments));
  }
  
  function error() {
    if (!enabled) return;
    return console.error.apply(console, Array.prototype.slice.call(arguments));
  }
  
  function warn() {
    if (!enabled) return;
    return console.warn.apply(console, Array.prototype.slice.call(arguments));
  }
  
  var enabled = true;
  
  return {
    log: log,
    error: error,
    warn: warn,
    setEnabled: setEnabled
  };
});