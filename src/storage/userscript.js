define(["support", "storage/browser", "utils"], function(support, sBrowser, utils){
  function setItem(key, value) {
    GM_setValue(key, value);
  }
  
  function getItem(key, callback) {
    utils.asyncCall(null, callback, GM_getValue(key));
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
    return sBrowser;
  }
});