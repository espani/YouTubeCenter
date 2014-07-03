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
  
  var cache = utils.merge(defaultSettings, globalSettings || {});
  
  return {
    setOption: setOption,
    getOption: getOption,
    getOptions: getOptions,
    reset: reset
  };
});