define(["utils"], function(utils){
  function getItem(key, callback, preferSync) {
    var item = localStorage.getItem(key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  
  return {
    setItem: utils.bind(localStorage, localStorage.setItem),
    getItem: getItem,
    removeItem: utils.bind(localStorage, localStorage.removeItem)
  };
});