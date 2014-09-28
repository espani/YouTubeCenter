define(["exports", "unsafeWindow", "./api", "./config", "utils", "unsafeYouTubeCenter", "../console"], function(exports, uw, playerAPI, config, utils, uytc, con){
  function onPlayerReady(api) {
    con.debug("Player is ready");
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
  
  function onDelayed() {
    con.debug("Using delayed method");
    var api = playerAPI.getAPI();
    if (api && typeof api.getPlayerState === "function") {
      try {
        api.getPlayerState();
      } catch (e) {
        setTimeout(onDelayed, 500);
        return;
      }
      onPlayerReady(api);
    }
  }
  
  var listeners = [];
  
  config.setPersistentConfig("args.jsapicallback", "ytcenter.player.onReady");
  uytc.player.onReady = utils.bind(this, onPlayerReady);
  uw.onYouTubePlayerReady = onPlayerReady;
  
  var cfg = config.getConfig();
  if (cfg.loaded) {
    onDelayed();
  }
  
  exports.addListener = addListener;
  exports.removeListener = removeListener;
  
  return exports;
});