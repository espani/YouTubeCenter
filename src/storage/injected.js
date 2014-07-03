define(["message"], function(message){
  function setItem(key, value) {
    message.sendMessage({
      target: ${MESSAGE.TARGET.SANDBOX},
      type: "storage.setItem",
      args: [key, value]
    });
  }
  function getItem(key, callback) {
    var callbackId = callbackListeners.push(callback) - 1;
    message.sendMessage({
      target: ${MESSAGE.TARGET.SANDBOX},
      type: "storage.getItem",
      args: [key],
      callbackId: callbackId
    });
  }
  function removeItem(key) {
    message.sendMessage({
      target: ${MESSAGE.TARGET.SANDBOX},
      type: "storage.removeItem",
      args: [key]
    });
  }
  
  var callbackListeners = [];
  
  message.init(${MESSAGE.TARGET.PAGE}, ["http", "https"], ["youtube.com", "www.youtube.com", "api.google.com", "plus.googleapis.com"]);
  
  return {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
  };
});