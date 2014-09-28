/**
* The player API
*
* @namespace Player
* @class API
**/
define(["exports", "utils"], function(exports, utils){
  /**
  * Get the player API.
  *
  * @static
  * @method getAPI
  * @return {Object} The player API.
  **/
  function getAPI() {
    if (!apiCache) {
      apiCache = bindPlayerAPI();
    }
    return apiCache;
  }
  
  /**
  * Set the player API.
  *
  * @static
  * @method setAPI
  * @param {Object} api The player API.
  **/
  function setAPI(api) {
    apiCache = api;
  }
  
  /**
  * Bind the player API from the #movie_player element
  * into an object.
  *
  * @private
  * @static
  * @method bindPlayerAPI
  * @return {Object} The player API.
  **/
  function bindPlayerAPI() {
    var player = document.getElementById("movie_player");
    var api = {};
    
    if (player && player.getApiInterface) {
      var apiInterface = player.getApiInterface();
      for (var i = 0, len = apiInterface.length; i < len; i++) {
        api[apiInterface[i]] = utils.bind(player, player[apiInterface[i]]);
      }
    }
    return api;
  }
  
  /**
  * The cached player API.
  *
  * @private
  * @static
  * @property apiCache
  * @type Object
  **/
  var apiCache = null;
  
  exports.getAPI = getAPI;
  exports.setAPI = setAPI;
  
  return exports;
});