define(["storage/browser.js"], function(sBrowser){
  function messageListener(e) {
    
  }
  
  function setItem(key, value) {
    opera.extension.postMessage();
  }
  
  function getItem(key, callback) {
    
  }
  
  function removeItem(key) {
    
  }
  
  opera.extension.onmessage = messageListener;
  
  return {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
  };
});