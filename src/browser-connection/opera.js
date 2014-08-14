define(["libs/UserProxy/memFunction", "utils"], function(mem, utils){
  function listener(detail) {
    if (typeof detail === "string") detail = JSON.parse(detail);
    
    if (typeof detail.callbackId === "number" && utils.isArray(detail.args) && detail.mem) {
      var args = mem.restoreObject(detail.args, token, "page");
      var func = mem.getCacheFunction(detail.callbackId);
      if (typeof func === "function") {
        func.apply(null, args);
      }
    } else if (typeof detail.callbackId === "number" && utils.isArray(detail.args)) {
      var args = mem.restoreObject(detail.args, token, "page");
      if (typeof callbackCache[detail.callbackId] === "function") {
        callbackCache[detail.callbackId].apply(null, args);
      }
    } else {
      throw Error("Malformed detail!", detail);
    }
  }
  
  function call(method, args) {
    function setCallback(callback) {
      clearTimeout(timer);
      if (typeof callback === "function") {
        detail.id = callbackCache.push(callback) - 1;
      }
      execute();
    }
    
    function execute() {
      opera.extension.postMessage(JSON.stringify(detail));
    }
    
    args = Array.prototype.slice.call(arguments, 1);
    
    args = mem.parseObject(args, token, "page");
    var detail = {
      method: method,
      args: args
    };
    
    var timer = setTimeout(execute, 4);
    
    return {
      then: setCallback
    };
  }
  
  var callbackCache = [];
  
  opera.extension.onmessage = listener;
  
  return {
    call: call
  };
});