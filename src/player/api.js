define(["unsafeWindow", "utils"], function(unsafeWindow, utils){
  function getAPI() {
    if (!apiCache) {
      apiCache = bindPlayerAPI();
    }
    return apiCache;
  }
  function setAPI(api) {
    apiCache = api;
  }
  function bindPlayerAPI() {
    var player = document.getElementById("movie_player");
    var api = {};
    
    if (player && player.getApiInterface) {
      var apiInterface = player.getApiInterface();
      for (var i = 0, len = apiInterface.length; i < len; i++) {
        api[apiInterface[i]] = utils.bind(player, player[apiInterface[i]]);
      }
    }
    return api;
  }
  
  var apiCache = null;
  
  return {
    getAPI: getAPI,
    setAPI: setAPI
  };
});