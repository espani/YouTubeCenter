define(["storage/${runtime.browser.name}"], function(storageHandler){
  function setItem(key, value) {
    cache[key] = value;
    storageHandler.setItem(key, value);
  }
  
  function removeItem(key) {
    delete cache[key];
    storageHandler.removeItem(key);
  }
  
  function getItem(key) {
    if (!(key in cache)) {
      cache[key] = storageHandler.getItem(key);
    }
    return cache[key];
  }
  
  var cache = {};
  
  
  return {
    setItem: setItem,
    removeItem: removeItem,
    getItem: getItem
  };
});