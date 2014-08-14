define(["exports", "unsafeWindow", "./api", "./config", "utils", "unsafeYouTubeCenter", "console"], function(exports, uw, playerAPI, config, utils, uytc, con){
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
  uytc.player.onReady = utils.bind(this, onPlayerReady);
  uw.onYouTubePlayerReady = onPlayerReady;
  
  exports.addListener = addListener;
  exports.removeListener = removeListener;
  
  return exports;
});