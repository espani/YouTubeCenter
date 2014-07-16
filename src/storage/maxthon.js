define(["storage/browser.js", "utils", "con"], function(sBrowser, utils, con){
  function removeItem(key) {
    con.warn("Maxthon does not support removeItem! Using setItem with no value.");
    storage.setConfig(key, "");
  }
  
  function getItem(key, callback) {
    utils.asyncCall(null, callback, storage.getConfig(key));
  }
  
  var storage = window.external.mxGetRuntime().storage;
  return {
    setItem: utils.bind(storage, storage.setConfig),
    getItem: getItem,
    removeItem: removeItem
  };
});