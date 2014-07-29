define(["utils", "libs/UserProxy/proxy"], function(utils, UserProxy){
  return {
    setItem: utils.bind(null, UserProxy.call, "setItem"),
    getItem: utils.bind(null, UserProxy.call, "getItem"),
    removeItem: utils.bind(null, UserProxy.call, "removeItem")
  };
});