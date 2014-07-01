define(["utils"], function(utils){
  function setEnabled(b) {
    enabled = b;
  }
  
  function log() {
    if (!enabled) return function(){};
    return console.log.bind(console);
  }
  
  function error() {
    if (!enabled) return function(){};
    return console.error.bind(console);
  }
  
  function warn() {
    if (!enabled) return function(){};
    return console.warn.bind(console);
  }
  
  var enabled = true;
  
  var retObj = {};
  utils.defineLockedProperty(retObj, "log", function(){}, log);
  utils.defineLockedProperty(retObj, "error", function(){}, error);
  utils.defineLockedProperty(retObj, "warn", function(){}, warn);
  
  return retObj;
});