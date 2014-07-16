define(["utils"], function(utils){
  function getItem(key, callback) {
    utils.asyncCall(null, callback, localStorage.getItem(key));
  }
  return {
    setItem: utils.bind(localStorage, localStorage.setItem),
    getItem: getItem,
    removeItem: utils.bind(localStorage, localStorage.removeItem)
  };
});