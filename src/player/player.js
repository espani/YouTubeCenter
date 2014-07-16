define(["player/api", "player/config", "unsafeWindow", "player/size"], function(playerAPI, playerConfig, uw, size){
  function getType() {
    var api = playerAPI.getAPI();
    if (api && typeof api.getPlayerType === "function") {
      return api.getPlayerType();
    }
    var cfg = playerConfig.getConfig();
    if (cfg.html5) {
      return "html5";
    } else {
      return "flash";
    }
  }
  
  function setType(type) {
    var currentType = getType();
    if (type === currentType) {
      return; // Do nothing as it's already the desired type
    } else {
      var api = playerAPI.getAPI();
      playerConfig.setConfig("html5", type);
      if (api && typeof api.loadNewVideoConfig === "function") {
        api.loadNewVideoConfig(uw.ytplayer.config);
      }
    }
  }
  
  function getControlbarHeight() {
    var none = 0;
    var onlyControlbar = 3;
    var onlyProgressbar = 30;
    var both = 35;
    
    var cfg = playerConfig.getConfig();
    var autohide = null;
    
    if (cfg && cfg.args && typeof cfg.args.autohide === "string") {
      autohide = cfg.args.autohide;
    } else if (getType() === "html5") {
      size = require("player/size");
      var ratio = size.getRatio();
      if (ratio < 1.35) {
        autohide = "3";
      }
    }
    
    switch (autohide) {
      case "0": return both;
      case "1": return none;
      case "3": return onlyControlbar;
      case "2": default: return onlyProgressbar;
    }
  }
  
  return {
    getType: getType,
    setType: setType,
    getControlbarHeight: getControlbarHeight
  };
});