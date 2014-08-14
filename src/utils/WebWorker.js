define(["utils"], function(utils){
  function onMessage(url, listener, e) {
    var detail = (typeof e.data === "string" ? JSON.parse(e.data) : e.data);
    
    if (detail.event === "ready") {
      utils.revokeObjectURL(url);
    }
    
    listener(detail.event, detail.data);
  }
  
  function dispatchEvent(worker, event, data) {
    worker.postMessage(JSON.stringify({ event: event, data: data }));
  }
  
  function createWorker(func, listener) {
    if (utils.isArray(func)) {
      func = func.join(";");
    }
    
    var blob = utils.toBlob("(" + workerScript + ")(" + func + ");");
    var url = utils.createObjectURL(blob);
    var worker = new Worker(url);
    worker.addEventListener("message", utils.bind(null, onMessage, url, listener));
    
    return utils.bind(null, dispatchEvent, worker);
  }
  
  function workerScript(callback) {
    function dispatchEvent(event, data) {
      postMessage(JSON.stringify({ event: event, data: data }));
    }
    
    function addEventListener(event, listener) {
      if (!events.hasOwnProperty(event)) events[event] = [];
      events[event].push(listener);
    }
    
    function messageListener(e) {
      var detail = (typeof e.data === "string" ? JSON.parse(e.data) : e.data);
      
      if (events.hasOwnProperty(detail.event)) {
        var listeners = events[detail.event];
        for (var i = 0, len = listeners.length; i < len; i++) {
          listeners[i](detail.data);
        }
      }
    }
    
    var events = { };
    
    onmessage = messageListener; // Attaching the message listener
    
    callback(addEventListener, dispatchEvent);
    
    dispatchEvent("ready", true); // Worker is ready.
  }
  
  return {
    createWorker: createWorker
  };
});