define([], function(){
  function stringify(obj) {
    return JSON.stringify(obj);
  }
  
  function parse(str) {
    return JSON.parse(str, parseReplacer);
  }
  
  function stringifyReplacer(key, value) {
    
  }
  
  function parseReplacer(key, value) {
    
  }
  
  return {
    stringify: stringify,
    parse: parse
  };
});