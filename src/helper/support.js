/**
* A helper class to help checking for features that are supported by the browser.
* @namespace helper
* @class Support
**/
define(["exports", "unsafeWindow"], function(exports, uw){
  /**
  * Performing a simple LocalStorage set, get test.
  *
  * @private
  * @static
  * @method localStorageTest
  * @return {Boolean} Returns true if LocalStorage is supported otherwise returns false.
  **/
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
  
  /**
  * Checking if `webkitURL` is an object.
  *
  * @private
  * @static
  * @property isWebkitURL
  * @type Boolean
  **/
  var isWebkitURL = typeof uw.webkitURL === "object";
  
  /**
  * Checking if `URL` is an object.
  *
  * @private
  * @static
  * @property isURL
  * @type Boolean
  **/
  var isURL = typeof uw.URL === "object";
  
  /**
  * Checking if Maxthon runtime is accessible.
  *
  * @private
  * @static
  * @property maxthonRuntime
  * @type Boolean
  **/
  var maxthonRuntime = window && window.external && window.external.mxGetRuntime && typeof window.external.mxGetRuntime === "function";
  
  /**
  * Checking if `createObjectURL` is supported.
  *
  * @private
  * @static
  * @property isCreateObjectURL
  * @type Boolean
  **/
  var isCreateObjectURL = false;
  
  /**
  * Checking if `revokeObjectURL` is supported.
  *
  * @private
  * @static
  * @property isRevokeObjectURL
  * @type Boolean
  **/
  var isRevokeObjectURL = false;
  if (isWebkitURL) {
    isCreateObjectURL = typeof uw.webkitURL.createObjectURL === "function";
    isRevokeObjectURL = typeof uw.webkitURL.revokeObjectURL === "function";
  } else if (isURL) {
    isCreateObjectURL = typeof uw.URL.createObjectURL === "function";
    isRevokeObjectURL = typeof uw.URL.revokeObjectURL === "function";
  }
  
  /**
  * Checking if LocalStorage is supported.
  *
  * @static
  * @property localStorage
  * @type Boolean
  **/
  exports.localStorage = localStorageTest();
  
  /**
  * Checking if the Greasemonkey API is supported.
  *
  * @static
  * @property Greasemonkey
  * @type Boolean
  **/
  exports.Greasemonkey = (typeof GM_setValue !== "undefined" && (typeof GM_setValue.toString === "undefined" || GM_setValue.toString().indexOf("not supported") === -1));
  
  /**
  * Checking if `createObjectUR` is supported.
  *
  * @static
  * @property createObjectURL
  * @type Boolean
  **/
  exports.createObjectURL = isCreateObjectURL;
  
  /**
  * Checking if `revokeObjectURL` is supported.
  *
  * @static
  * @property revokeObjectURL
  * @type Boolean
  **/
  exports.revokeObjectURL = isRevokeObjectURL;
  
  /**
  * Checking if the `webkitURL` object is supported.
  *
  * @static
  * @property webkitURL
  * @type Boolean
  **/
  exports.webkitURL = isWebkitURL;
  
  /**
  * Checking if the `URL` object is supported.
  *
  * @static
  * @property URL
  * @type Boolean
  **/
  exports.URL = isURL;
  
  /**
  * Checking if Maxthon runtime is supported.
  *
  * @static
  * @property maxthonRuntime
  * @type Boolean
  **/
  exports.maxthonRuntime = maxthonRuntime;
  
  /**
  * Checking if Maxthon runtime Storage object is supported.
  *
  * @static
  * @property maxthonRuntimeStorage
  * @type Boolean
  **/
  exports.maxthonRuntimeStorage = maxthonRuntime && window.external.mxGetRuntime() && window.external.mxGetRuntime().storage;
  
  /**
  * Checking if Firefox extension port is accessible.
  *
  * @static
  * @property firefoxPort
  * @type Boolean
  **/
  exports.firefoxPort = this.port && typeof this.port.request === "function" && this.port.storage && typeof this.port.on === "function";
  
  return exports;
});