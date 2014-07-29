define(["storage/${runtime.browser.name}", "utils"], function(storageHandler, utils){
  function setItem(key, value) {
    cache[key] = value;
    storageHandler.setItem(key, value);
  }
  
  function removeItem(key) {
    delete cache[key];
    storageHandler.removeItem(key);
  }
  
  function getItemCallback(callback, key, value) {
    cache[key] = value;
    callback(cache[key]);
  }
  
  function getItem(key, callback, sync) {
    if (!(key in cache)) {
      storageHandler.getItem(key, utils.bind(null, getItemCallback, callback, key));
    } else {
      if (sync) {
        callback(cache[key]);
      } else {
        utils.asyncCall(null, callback, cache[key]);
      }
    }
  }
  
  var cache = {};
  
  return {
    setItem: setItem,
    removeItem: removeItem,
    getItem: getItem
  };
});