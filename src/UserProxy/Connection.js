define(["./CustomEvent", "./Message", "utils", "./support", "./memFunction"], function(customEvent, message, utils, support, mem){
  function listenerProxy(functions, token, type, detail) {
    setTimeout(utils.bind(null, listener, functions, token, type, detail), 4);
  }
  
  function listener(functions, token, type, detail) {
    var keys = utils.getKeys(functions);
    var index = utils.indexOfArray(detail.method, keys);
    if (index > -1) {
      var result = functions[keys[index]].apply(null, mem.restoreObject(detail.args, token, type));
      if (typeof detail.id === "number") {
        var memResult = mem.parseObject(result, token, type);
        var detail = { callbackId: detail.id, args: [ memResult ] };
        if (support.CustomEvent) {
          customEvent.fireEvent(token + "-page", detail);
        } else {
          message.addEventListener(token + "-page", detail);
        }
      }
    } else {
      throw "Method " + detail.method + " has not been set!";
    }
  }
  
  function Connection(pageProxy) {
    this.token = utils.generateToken();
    this.functions = {};
    this.namespace = "UserProxy";
    this.pageProxy = pageProxy;
  }
  
  Connection.prototype.setFunctions = function setFunctions(functions) {
    this.functions = functions;
  }
  
  Connection.prototype.setNamespace = function setFunctions(namespace) {
    this.namespace = namespace;
  }
  
  Connection.prototype.inject = function inject(code) {
    var parent = (document.body || document.head || document.documentElement);
    if (!parent) throw "Parent was not found!";
    
    var script = document.createElement("script")
    script.setAttribute("type", "text/javascript");

    this.connect();
    
    var args = [ false, this.token, utils.getKeys(this.functions) ];
    args = args.concat(Array.prototype.slice.call(arguments, 1));
    
    var content = "(" + code + ")(" + utils.buildArgumentList.apply(null, args) + ");";
    
    script.appendChild(document.createTextNode(content));
    
    parent.appendChild(script);
    parent.removeChild(script);
  }
  
  Connection.prototype.connect = function connect() {
    if (this.establishedConnectionListener) this.disconnect();
    
    this.establishedConnectionListener = utils.bind(null, listenerProxy, this.functions, this.token, "content");
    if (support.CustomEvent) {
      customEvent.addEventListener(this.token + "-content", this.establishedConnectionListener);
    } else {
      message.addEventListener(this.token + "-content", this.establishedConnectionListener);
    }
  }
  
  Connection.prototype.disconnect = function connect() {
    if (!this.establishedConnectionListener) return;
    if (support.CustomEvent) {
      customEvent.removeEventListener(this.token + "-content", this.establishedConnectionListener);
    } else {
      message.removeEventListener(this.token + "-content", this.establishedConnectionListener);
    }
    this.establishedConnectionListener = null;
  }
  
  return Connection;
});