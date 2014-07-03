define(["utils", "unsafeWindow", "console"], function(utils, uw, con){
  function getConfig() {
    return config;
  }
  
  function setConfig(cfg) {
    con.log("[Player/Config] setConfig", cfg);
    config = cfg;
  }
  
  function configSetter(cfg) {
    setConfig(JSON.parse(JSON.stringify(cfg))); // Let's clone it
    merge(cfg, persistentConfig);
  }
  
  function configGetter() {
    var cfg = getConfig();
    if (!cfg) return cfg;
    cfg = JSON.parse(JSON.stringify(cfg));
    merge(cfg, persistentConfig);
    return cfg;
  }
  
  function setPersistentConfig(cfg) {
    persistentConfig = cfg;
  }
  
  function getPersistentConfig() {
    return persistentConfig;
  }
  
  function merge(cfg, persistent) {
    utils.each(persistent, function(key, value){
      if (typeof persistent === "object") {
        if (!(key in cfg)) {
          cfg[key] = JSON.parse(JSON.stringify(value));
        } else {
          merge(cfg[key], persistent[key]);
        }
      } else {
        cfg[key] = value;
      }
    });
    return cfg;
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