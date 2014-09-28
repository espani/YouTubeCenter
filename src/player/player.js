/**
* The YouTube player.
*
* @namespace Player
* @class Player
**/
define(["exports", "./api", "./config", "unsafeWindow", "./size", "./ElementType", "../utils"], function(exports, playerAPI, playerConfig, uw, size, ElementType, utils){
  function getElementType() {
    
  }
  
  /**
  * Get the current player type, which can either be HTML5 or flash.
  *
  * @static
  * @method getType
  * @return {String} The player type.
  **/
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
  
  /**
  * Setting the player type to either HTML5 or flash
  *
  * @static
  * @method setType
  * @param {String} type The desired player type (HTML5 or flash).
  **/
  function setType(type) {
    var currentType = getType();
    if (type === currentType) {
      return; // Do nothing as it's already the desired player type
    } else {
      var api = playerAPI.getAPI();
      playerConfig.setConfig("html5", (type === "html5" ? true : false)); // Setting the property html5 to either true or false
      
      // Soft-reloading the player. If YouTube detects that the html5 property has changed it will change the player.
      if (api && typeof api.loadNewVideoConfig === "function") {
        api.loadNewVideoConfig(uw.ytplayer.config);
      }
    }
  }
  
  /**
  * Get the controlbar height.
  *
  * @static
  * @method getControlbarHeight
  * @return {Number} The height of the controlbar on the player.
  **/
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
  
  /**
  * Calling yt.player.Application.create to tell YouTube to
  * create the YouTube player again and dispose of the old
  * player.
  *
  * @static
  * @method reload
  **/
  function reload() {
    if (uw && uw.yt && uw.yt.player && uw.yt.player.Application && typeof uw.yt.player.Application.create === "function") {
      uw.yt.player.Application.create("player-api", playerConfig.getConfig());
    }
  }
  
  /**
  * An object that contains the player's API.
  *
  * @static
  * @property api
  * @type Object
  * @readOnly
  **/
  utils.defineProperty(exports, "api", playerAPI.getAPI, function(){});
  
  /**
  * Get the player API.
  *
  * @static
  * @method getAPI
  * @return {Object} The player api.
  * @deprecated Use `player.api` instead.
  **/
  exports.getAPI = playerAPI.getAPI;
  
  exports.getType = getType;
  exports.setType = setType;
  exports.getControlbarHeight = getControlbarHeight;
  exports.getConfig = playerConfig.getConfig;
  exports.setConfig = playerConfig.setConfig;
  exports.reload = reload;
  return exports;
});