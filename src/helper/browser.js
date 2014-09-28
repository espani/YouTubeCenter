/**
* This is a helper class to help identifying the user"s browser.
*
* @namespace helper
* @class Browser
**/
define(["exports", "utils"], function(exports, utils){
  /**
  * Checking if the browser is any version of Internet Explorer.
  *
  * @private
  * @static
  * @method isIE
  * @return {Boolean} Returns true if the browser is any version of IE otherwise returns false.
  **/
  function isIE() {
    for (var v = 3, el = document.createElement("b"), all = el.all || []; el.innerHTML = "<!--[if gt IE " + (++v) + "]><i><![endif]-->", all[0];);
    return v > 4 ? v : !!document.documentMode;
  }
  
  /**
  * Checking if the browser is Opera (not Opera Next).
  *
  * @private
  * @static
  * @method isOpera
  * @return {Boolean} Returns true if the browser is Opera otherwise returns false.
  **/
  function isOpera() {
    return !!window.opera;
  }
  
  /**
  * Checking if the browser is Opera Next.
  *
  * @private
  * @static
  * @method isOperaNext
  * @return {Boolean} Returns true if the browser is Opera Next otherwise returns false.
  **/
  function isOperaNext() {
    return ua.indexOf(" OPR/") !== -1;
  }
  
  /**
  * Checking if the browser is Firefox.
  *
  * @private
  * @static
  * @method isFirefox
  * @return {Boolean} Returns true if the browser is Firefox otherwise returns false.
  **/
  function isFirefox() {
    return typeof InstallTrigger !== "undefined";
  }
  
  /**
  * Checking if the browser is Safari.
  *
  * @private
  * @static
  * @method isSafari
  * @return {Boolean} Returns true if the browser is Safari otherwise returns false.
  **/
  function isSafari() {
    return Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
  }
  
  /**
  * Checking if the browser is Chrome.
  *
  * @private
  * @static
  * @method isChrome
  * @return {Boolean} Returns true if the browser is Chrome otherwise returns false.
  **/
  function isChrome() {
    return !!window.chrome && !isOpera() && !isOperaNext(); 
  }
  
  /**
  * Checking if the browser is Maxthon.
  *
  * @private
  * @static
  * @method isMaxthon
  * @return {Boolean} Returns true if the browser is Maxthon otherwise returns false.
  **/
  function isMaxthon() {
    return ua.indexOf(" Maxthon/") !== -1 || ua.indexOf(" Maxthon 2.0") !== -1 || ua.indexOf(" Maxthon;") !== -1; 
  }
  
  /**
  * Determing the browser.
  *
  * @private
  * @static
  * @method determineBrowser
  * @return {Number} Returns the browser value.
  **/
  function determineBrowser() {
    if (isChrome()) {
      return CHROME;
    } else if (isFirefox()) {
      return FIREFOX;
    } else if (isOpera()) {
      return OPERA;
    } else if (isOperaNext()) {
      return OPERA_NEXT;
    } else if (isMaxthon()) {
      return MAXTHON;
    } else if (isSafari()) {
      return SAFARI;
    } else if (isIE()) {
      return IE;
    } else {
      return UNKNOWN
    }
  }
  
  /**
  * A user agent reference
  *
  * @private
  * @static
  * @property ua
  * @type String
  **/
  var ua = (navigator && navigator.userAgent) || "";
  
  /**
  * The browser value for unknown browsers.
  *
  * @static
  * @property UNKNOWN
  * @type Number
  **/
  var UNKNOWN = -1;
  
  /**
  * The browser value for Chrome.
  *
  * @static
  * @property CHROME
  * @type Number
  **/
  var CHROME = 0;
  
  /**
  * The browser value for Firefox.
  *
  * @static
  * @property FIREFOX
  * @type Number
  **/
  var FIREFOX = 1;
  
  /**
  * The browser value for Opera.
  *
  * @static
  * @property OPERA
  * @type Number
  **/
  var OPERA = 2;
  
  /**
  * The browser value for Opera Next.
  *
  * @static
  * @property OPERA_NEXT
  * @type Number
  **/
  var OPERA_NEXT = 3;
  
  /**
  * The browser value for Maxthon.
  *
  * @static
  * @property MAXTHON
  * @type Number
  **/
  var MAXTHON = 4;
  
  /**
  * The browser value for Safari.
  *
  * @static
  * @property SAFARI
  * @type Number
  **/
  var SAFARI = 5;
  
  /**
  * The browser value for IE.
  *
  * @static
  * @property IE
  * @type Number
  **/
  var IE = 6;
  
  exports.determineBrowser = determineBrowser;
  
  exports.UNKNOWN = UNKNOWN;
  exports.CHROME = CHROME;
  exports.FIREFOX = FIREFOX;
  exports.OPERA = OPERA;
  exports.OPERA_NEXT = OPERA_NEXT;
  exports.MAXTHON = MAXTHON;
  exports.SAFARI = SAFARI;
  exports.IE = IE;
  
  return exports;
});