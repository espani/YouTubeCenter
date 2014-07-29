define(["utils"], function(utils){
  function setItem(key, value) {
    utils.setCookie(prefix + key, value, null, "/", 1000*24*60*60*1000);
  }
  
  function getItem(key, callback, preferSync) {
    var item = utils.getCookie(prefix + key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  
  function removeItem(key) {
    utils.setCookie(prefix + key, "", null, "/", 0);
  }
  
  var prefix = "${appName}.";
  
  return {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
  };
});