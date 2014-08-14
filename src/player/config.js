define(["utils", "unsafeWindow", "console"], function(utils, uw, con){
  function getConfig() {
    return config;
  }
  
  function setConfig(cfg, val) {
    if (typeof cfg === "string") {
      utils.setProperty(config, cfg, val, true);
    } else {
      config = cfg;
    }
  }
  
  function configSetter(cfg) {
    setConfig(cfg); // set the configuration. Keep the reference
  }
  
  function configGetter() {
    var cfg = getConfig();
    if (!cfg) return cfg;
    cfg = utils.clone(cfg);
    var persistentCfg = utils.clone(persistentConfig);
    utils.extend(persistentCfg, cfg, true);
    return persistentCfg;
  }
  
  function setPersistentConfig(cfg, val) {
    if (typeof cfg === "string") {
      utils.setProperty(persistentConfig, cfg, val, true);
    } else {
      persistentConfig = cfg;
    }
  }
  
  function getPersistentConfig() {
    return persistentConfig;
  }
  
  var config = {};
  var persistentConfig = {};
  
  // Make sure that ytplayer variable is set
  uw.ytplayer = uw.ytplayer || {};
  
  config = uw.ytplayer.config || {};
  
  // Make sure that YouTube doesn't override the ytplayer variable or adding an unwanted property to ytplayer.
  utils.defineLockedProperty(uw.ytplayer, "config", configSetter, configGetter);
  
  return {
    getConfig: getConfig,
    setConfig: setConfig,
    setPersistentConfig: setPersistentConfig,
    getPersistentConfig: getPersistentConfig
  };
});