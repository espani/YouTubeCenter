define(["support", "storage/browser"], function(support, sBrowser){
  function setItem(key, value) {
    //GM_setValue(key, value);
  }
  
  function getItem(key) {
    //return GM_getValue(key);
  }
  
  function removeItem(key) {
    //GM_deleteValue(key);
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