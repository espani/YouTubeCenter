define(["unsafeWindow"], function(uw){
  function localStorageTest() {
    var mod = "support.test";
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  var isWebkitURL = typeof uw.webkitURL === "object";
  var isURL = typeof uw.URL === "object";
  var isCreateObjectURL = false;
  var isRevokeObjectURL = false;
  
  var maxthonRuntime = window && window.external && window.external.mxGetRuntime && typeof window.external.mxGetRuntime === "function";
  
  if (isWebkitURL) {
    isCreateObjectURL = typeof uw.webkitURL.createObjectURL === "function";
    isRevokeObjectURL = typeof uw.webkitURL.revokeObjectURL === "function";
  } else if (isURL) {
    isCreateObjectURL = typeof uw.URL.createObjectURL === "function";
    isRevokeObjectURL = typeof uw.URL.revokeObjectURL === "function";
  }
  
  return {
    localStorage: localStorageTest(),
    Greasemonkey: (typeof GM_setValue !== "undefined" && (typeof GM_setValue.toString === "undefined" || GM_setValue.toString().indexOf("not supported") === -1)),
    createObjectURL: isCreateObjectURL,
    revokeObjectURL: isRevokeObjectURL,
    webkitURL: isWebkitURL,
    URL: isURL,
    maxthonRuntime: maxthonRuntime,
    maxthonRuntimeStorage: maxthonRuntime && window.external.mxGetRuntime() && window.external.mxGetRuntime().storage,
    firefoxPort: this.port && typeof this.port.request === "function" && this.port.storage && typeof this.port.on === "function"
  };
});