define(["storage/browser.js"], function(sBrowser){
  function setItem(key, value) {
    var details = { };
    details[key] = value;
    
    storage.set(details);
  }
  
  function getItem(key, callback) {
    storage.get(key, function(result) {
      var details = {};
      if (details.hasOwnProperty(key)) {
        details = details[key];
      }
      
      callback(details);
    });
  }
  
  function removeItem(key) {
    
  }
  
  var storage = chrome.storage.local;
  
  return {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
  };
});