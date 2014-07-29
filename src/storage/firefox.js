define(["storage/browser.js", "support", "utils"], function(browser, support, utils){
  function setItem(key, value) {
    port.storage.setItem(key);
  }
  
  function getItem(key, callback, preferSync) {
    var item = port.storage.getItem(key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback,  item);
    }
  }
  
  function removeItem(key) {
    port.storage.removeItem(key);
  }
  
  if (support.firefoxPort) {
    return {
      setItem: setItem,
      getItem: getItem,
      removeItem: removeItem
    };
  } else {
    return browser;
  }
});