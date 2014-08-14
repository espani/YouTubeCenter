define(["utils", "UserProxy/proxy"], function(utils, UserProxy){
  return utils.bind(null, UserProxy.call, "xhr");
});