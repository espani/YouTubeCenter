define(["utils"], function(utils){
  return {
    setItem: utils.bind(localStorage, localStorage.setItem),
    getItem: utils.bind(localStorage, localStorage.getItem),
    removeItem: utils.bind(localStorage, localStorage.removeItem)
  };
});