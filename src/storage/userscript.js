define(["support", "storage/browser", "utils"], function(support, browser, utils){
  function setItem(key, value) {
    GM_setValue(key, value);
  }
  
  function getItem(key, callback, preferSync) {
    var item = GM_getValue(key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  
  function removeItem(key) {
    GM_deleteValue(key);
  }
  
  if (support.Greasemonkey) {
    return {
      setItem: setItem,
      removeItem: removeItem,
      getItem: getItem
    };
  } else {
    return browser;
  }
});