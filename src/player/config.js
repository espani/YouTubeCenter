define(["utils", "unsafeWindow", "console"], function(utils, uw, con){
  function getConfig() {
    return config;
  }
  
  function setConfig(cfg, val) {
    if (typeof cfg === "string") {
      var parts = cfg.split(".");
      var cfg = config;
      for (var i = 0, len = parts.length; i < len; i++) {
        if (i === len - 1) {
          cfg[parts[i]] = val;
        } else {
          if (!(parts[i] in cfg)) {
            cfg[parts[i]] = {};
          }
          cfg = cfg[parts[i]];
        }
      }
    } else {
      config = cfg;
    }
  }
  
  function configSetter(cfg) {
    setConfig(JSON.parse(JSON.stringify(cfg))); // Let's clone it
    utils.extend(persistentConfig, cfg, true);
  }
  
  function configGetter() {
    var cfg = getConfig();
    if (!cfg) return cfg;
    cfg = JSON.parse(JSON.stringify(cfg));
    utils.extend(persistentConfig, cfg, true);
    return cfg;
  }
  
  function setPersistentConfig(cfg, val) {
    if (typeof cfg === "string") {
      var parts = cfg.split(".");
      var cfg = persistentConfig;
      for (var i = 0, len = parts.length; i < len; i++) {
        if (i === len - 1) {
          cfg[parts[i]] = val;
        } else {
          if (!(parts[i] in cfg)) {
            cfg[parts[i]] = {};
          }
          cfg = cfg[parts[i]];
        }
      }
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
  
  utils.defineLockedProperty(uw.ytplayer, "config", configSetter, configGetter);
  
  return {
    getConfig: getConfig,
    setConfig: setConfig,
    setPersistentConfig: setPersistentConfig,
    getPersistentConfig: getPersistentConfig
  };
});