define(["storage", "settings.default", "utils"], function(storage, defaultSettings, utils){
  function setOption(key, value) {
    cache[key] = value;
    storage.setItem("${storage.settings}", JSON.stringify(cache));
  }
  
  function getOption(key) {
    return cache[key];
  }
  
  function getOptions() {
    return cache;
  }
  
  function reset() {
    cache = {};
    storage.setItem("${storage.settings}", JSON.stringify(cache));
  }
  
  function getKeys() {
    var keys = [];
    for (var key in cache) {
      if (cache.hasOwnProperty(key)) {
        keys.push(key);
      }
    }
    return keys;
  }
  
  var cache = utils.extend(JSON.parse(JSON.stringify(globalSettings || {})), defaultSettings, true);
  
  return {
    setOption: setOption,
    getOption: getOption,
    getOptions: getOptions,
    getKeys: getKeys,
    reset: reset
  };
});