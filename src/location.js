/**
* A polyfill class for the Location object.
*
* @class Location
**/
define(["exports", "./spf", "./unsafeWindow"], function(exports, spf, uw){
  /**
  * Updates the location polyfill to be up-to date with the Location object.
  *
  * @private
  * @static
  * @method update
  **/
  function update() {
    
  }
  
  var loc = uw.location;
  
  exports.href = null;
  exports.protocol = null;
  exports.host = null;
  exports.hostname = null;
  exports.port = null;
  exports.pathname = null;
  exports.search = null;
  exports.searchParams = null;
  exports.hash = null;
  exports.username = null;
  exports.password = null;
  exports.origin = null;
  
  exports.assign = null;
  exports.reload = null;
  exports.replace = null;
  exports.toString = null;
  
  // Subscribe to the processed event for SPF to make sure that the custom location object is updated.
  spf.addEventListener("processed", update);
  
  return exports;
});