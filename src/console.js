define(["exports", "utils"], function(exports, utils){
  function setEnabled(b) {
    enabled = b;
  }
  
  function log() {
    if (!enabled) return function(){};
    return console.log.bind(console, "${runtime.browser.name}[" + sessionToken + "]");
  }
  
  function error() {
    if (!enabled) return function(){};
    return console.error.bind(console, "${runtime.browser.name}[" + sessionToken + "]");
  }
  
  function warn() {
    if (!enabled) return function(){};
    return console.warn.bind(console, "${runtime.browser.name}[" + sessionToken + "]");
  }
  
  function debug() {
    if (!enabled) return function(){};
    return console.debug.bind(console, "${runtime.browser.name}[" + sessionToken + "]");
  }
  
  var sessionToken = (typeof consoleSessionToken === "string" ? consoleSessionToken : utils.generateToken(null, 8));
  
  var enabled = true;
  
  exports.sessionToken = sessionToken;
  
  utils.defineLockedProperty(exports, "log", function(){}, log);
  utils.defineLockedProperty(exports, "error", function(){}, error);
  utils.defineLockedProperty(exports, "warn", function(){}, warn);
  utils.defineLockedProperty(exports, "debug", function(){}, debug);
  
  return exports;
});