define(["storage/${runtime.browser.name}", "utils"], function(storageHandler, utils){
  function setItem(key, value) {
    cache[key] = value;
    storageHandler.setItem(key, value);
  }
  
  function removeItem(key) {
    delete cache[key];
    storageHandler.removeItem(key);
  }
  
  function getItemCallback(callback, value) {
    cache[key] = value;
    callback(cache[key]);
  }
  
  function getItem(key, callback) {
    if (!(key in cache)) {
      storageHandler.getItem(key, utils.bind(getItemCallback, callback));
    } else {
      utils.asyncCall(null, callback, cache[key]);
    }
  }
  
  var cache = {};
  
  return {
    setItem: setItem,
    removeItem: removeItem,
    getItem: getItem
  };
});