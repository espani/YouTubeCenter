define(["utils"], function(utils){
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
  
  var sessionToken = (typeof consoleSessionToken === "string" ? consoleSessionToken : utils.generateToken(null, 8));
  
  var enabled = true;
  
  var con = {};
  
  con.sessionToken = sessionToken;
  
  utils.defineLockedProperty(con, "log", function(){}, log);
  utils.defineLockedProperty(con, "error", function(){}, error);
  utils.defineLockedProperty(con, "warn", function(){}, warn);
  
  return con;
});