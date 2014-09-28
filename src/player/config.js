/**
* Handles the player configuration.
*
* @namespace Player
* @class Config
**/
define(["exports", "utils", "unsafeWindow", "console"], function(exports, utils, uw, con){
  /**
  * Get the configuration for the player.
  *
  * @static
  * @method getConfig
  * @return {Object} The player configuration.
  **/
  function getConfig() {
    return config;
  }
  
  /**
  * Set the configuration of the player.
  *
  * @static
  * @method SetConfig
  * @param {Object} cfg The configuration object.
  **/
  
  /**
  * Set a property for the configuration of the player.
  *
  * @static
  * @method SetConfig
  * @param {String} key The name of the property.
  * @param {any} value The value of the property.
  **/
  function setConfig(cfg, value) {
    if (typeof cfg === "string") {
      utils.setProperty(config, cfg, value, true);
    } else {
      config = cfg;
    }
  }
  
  /**
  * Set the persistent configuration of the player.
  *
  * @static
  * @method setPersistentConfig
  * @param {Object} cfg The configuration object.
  **/
  
  /**
  * Set a property for the persistent configuration of the player.
  *
  * @static
  * @method setPersistentConfig
  * @param {String} key The name of the property.
  * @param {any} value The value of the property.
  **/
  function setPersistentConfig(cfg, value) {
    if (typeof cfg === "string") {
      utils.setProperty(persistentConfig, cfg, value, true);
    } else {
      persistentConfig = cfg;
    }
  }
  
  /**
  * Get the persistent configuration for the player.
  *
  * @static
  * @method getPersistentConfig
  * @return {Object} The persistent player configuration.
  **/
  function getPersistentConfig() {
    return persistentConfig;
  }
  
  /**
  * The config setter function for `uw.ytplayer`.
  *
  * @private
  * @static
  * @method configSetter
  * @param {Object} cfg The configuration object.
  **/
  function configSetter(cfg) {
    setConfig(cfg); // set the configuration. Keep the reference
  }
  
  /**
  * The config getter function for `uw.ytplayer`.
  *
  * @private
  * @static
  * @method configGetter
  * @return {Object} Returns persistent config and the default config merged.
  **/
  function configGetter() {
    var cfg = getConfig();
    if (!cfg) return cfg;
    cfg = utils.clone(cfg);
    var persistentCfg = utils.clone(persistentConfig);
    utils.extend(persistentCfg, cfg, true);
    return persistentCfg;
  }
  
  /**
  * The configuration of the player.
  *
  * @private
  * @static
  * @property config
  * @type Object
  **/
  var config = {};
  
  /**
  * The persistent configuration of the player.
  *
  * @private
  * @static
  * @property persistentConfig
  * @type Object
  **/
  var persistentConfig = {};
  
  // Make sure that ytplayer variable is set
  uw.ytplayer = uw.ytplayer || {};
  
  config = uw.ytplayer.config || {};
  
  // Make sure that YouTube doesn't override the ytplayer variable or adding an unwanted property to ytplayer.
  utils.defineLockedProperty(uw.ytplayer, "config", configSetter, configGetter);
  
  exports.getConfig = getConfig;
  exports.setConfig = setConfig;
  exports.setPersistentConfig = setPersistentConfig;
  exports.getPersistentConfig = getPersistentConfig;
  
  return exports;
});