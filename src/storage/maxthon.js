define(["storage/browser.js", "utils", "con", "support"], function(browser, utils, con, support){
  function removeItem(key) {
    con.warn("Maxthon does not support removeItem! Using setItem with no value.");
    storage.setConfig(key, "");
  }
  
  function getItem(key, callback, preferSync) {
    var item = storage.getConfig(key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  var storage = null;
  
  if (support.maxthonRuntimeStorage) {
    storage = window.external.mxGetRuntime().storage;
    
    return {
      setItem: utils.bind(storage, storage.setConfig),
      getItem: getItem,
      removeItem: removeItem
    };
  } else {
    return browser;
  }
});