define(["utils"], function(utils){
  function setItem(key, value) {
    utils.setCookie(prefix + key, value, null, "/", 1000*24*60*60*1000);
  }
  
  function getItem(key) {
    return utils.getCookie(prefix + key);
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