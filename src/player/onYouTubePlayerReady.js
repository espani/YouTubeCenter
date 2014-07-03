define(["unsafeWindow", "player/api", "player/config", "utils", "unsafeYouTubeCenter"], function(uw, playerAPI, config, utils, uytc){
  function onPlayerReady(api) {
    playerAPI.setAPI(api);
    
    if (typeof api === "object") {
      for (var i = 0, len = listeners.length; i < len; i++) {
        listeners[i].apply(null, arguments);
      }
    }
  }
  
  function addListener(callback) {
    listeners.push(callback);
  }
  
  function removeListener(callback) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i] === callback) {
        listeners.splice(i, 1);
        break;
      }
    }
  }
  
  var listeners = [];
  
  config.setPersistentConfig("args.jsapicallback", "ytcenter.player.onReady");
  uytc.player.onReady = utils.bind(this, onPlayerReady)
  
  return {
    addListener: addListener,
    removeListener: removeListener
  };
});