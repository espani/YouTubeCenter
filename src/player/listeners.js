/**
* Handles the player listeners.
*
* @namespace player
* @class Listeners
**/
define(["exports", "utils", "./api", "unsafeWindow", "console", "./onYouTubePlayerReady", "ytready", "./listeners/origins", "./listeners/events"],
function(exports, utils, playerAPI, uw, con, onReady, ytready, Origin, Events){
  /**
  * Get the YouTube listener for the passed event.
  *
  * @private
  * @static
  * @method getYouTubeListener
  * @param {String} event The event name.
  * @return {Function} Returns the YouTube listener with the given event name.
  **/
  function getYouTubeListener(event) {
    var ytEvent = getListenerName(event);
    return ytListeners[ytEvent];
  }
  
  /**
  * The latest player id and player uid registered in the global window.
  *
  * @private
  * @static
  * @method getPlayerListenerDetails
  * @return {Object} An object with the `id` property and the `uid` property.
  **/
  function getPlayerListenerDetails() {
    var id = 1;
    var uid = null;
    
    utils.each(uw, function(key, value){
      if (key.indexOf("ytPlayer") === 0) {
        if (key.indexOf("player_uid_") !== -1) {
          var uidMatch = key.match(/player_uid_([0-9]+)_([0-9]+)$/);
          
          uid = parseInt(uidMatch[1], 10);
          i = parseInt(uidMatch[2], 10);
          
          if (i > id) {
            id = i;
          }
        } else {
          var idMatch = key.match(/player([0-9]+)$/);
          i = parseInt(idMatch[1], 10);
          if (i > id) {
            id = i;
          }
        }
      }
    });
    
    return { id: id, uid: uid };
  }
  
  /**
  * The property name of the event in the global window.
  *
  * @private
  * @static
  * @method getListenerName
  * @param {String} event The event name.
  * @return {String} The property name of the event.
  **/
  function getListenerName(event) {
    if (playerListenerDetails.uid !== null) {
      return "ytPlayer" + event + "player_uid_" + playerListenerDetails.uid + "_" + playerListenerDetails.id;
    } else {
      return "ytPlayer" + event + "player" + playerListenerDetails.id;
    }
  }
  
  /**
  * The setter function for the event property in the global window.
  *
  * @private
  * @static
  * @method ytListenerContainerSetter
  * @param {String} event The event name.
  * @param {Function} func The event listener.
  **/
  function ytListenerContainerSetter(event, func) {
    var ytEvent = getListenerName(event);
    ytListeners[ytEvent] = func;
  }
  
  /**
  * The getter function for the event property in the global window.
  *
  * @private
  * @static
  * @method ytListenerContainerGetter
  * @param {String} event The event name.
  * @return {Function} The event listener.
  **/
  function ytListenerContainerGetter(event) {
    return utils.bind(null, callListener, event, Origin.PROPERTY);
  }
  
  /**
  * Handles the added listeners and YouTube's listeners.
  *
  * @private
  * @static
  * @method callListener
  * @param {String} event The event name.
  * @param {PlayerListenersOrigin} origin The call origin.
  * @return {any} The return value of the called listeners.
  **/
  function callListener(event, origin) {
    function generateThisObject() {
      return {
        getOriginalListener: utils.bind(null, getYouTubeListener, event)
      };
    }
    
    var ytEvent = getListenerName(event);
    var args = Array.prototype.slice.call(arguments, 2);
    var returnVal = null;
    
    if (enabled && origin === Origin.PLAYER && (!events.hasOwnProperty(event) || (events.hasOwnProperty(event) && !events[event].override))) {
      /* Override is false and the origin is from the player; call the YouTube Center listeners */
      if (events.hasOwnProperty(event)) {
        for (var i = 0, len = events[event].listeners.length; i < len; i++) {
          returnVal = events[event].listeners[i].apply(null, args);
        }
      }
    } else if (enabled && origin === Origin.PROPERTY) {
      if (events.hasOwnProperty(event) && events[event].override) {
        /* Override is true and the origin is from the global window; call the YouTube Center listeners */
        for (var i = 0, len = events[event].listeners.length; i < len; i++) {
          events[event].listeners[i].apply(generateThisObject(), args);
        }
      } else if (ytListeners[ytEvent]) {
        if (apiNotAvailable) {
          /* API is not available therefore call YouTube Center listeners as YouTube listener is called  */
          for (var i = 0, len = events[event].listeners.length; i < len; i++) {
            returnVal = events[event].listeners[i].apply(null, args);
          }
        }
        
        /* Override is false and the origin is from the global window; call the YouTube listener */
        returnVal = ytListeners[ytEvent].apply(uw, args);
      }
    } else if (!enabled) {
      /* Everything is disabled; call the YouTube listener */
      returnVal = ytListeners[ytEvent].apply(uw, args);
    }
    return returnVal;
  }
  
  /**
  * Adding the listeners to the player.
  *
  * @private
  * @static
  * @method addPlayerListener
  **/
  function addPlayerListener() {
    var api = playerAPI.getAPI();
    var event;
    
    if (api && api.addEventListener) {
      apiNotAvailable = false;
      for (event in events) {
        if (events.hasOwnProperty(event)) {
          playerListener[event] = utils.bind(null, callListener, event, Origin.PLAYER);
          api.addEventListener(event, playerListener[event]);
        }
      }
    } else {
      apiNotAvailable = true;
      con.error("[Player Listener] Player API is not available!");
    }
  }
  
  /**
  * Initializing the global listeners.
  *
  * @private
  * @static
  * @method initGlobalListeners
  **/
  function initGlobalListeners() {
    if (globalListenersInitialized) return; // Make sure that this function is only called once.
    globalListenersInitialized = true;
    for (var event in events) {
      if (events.hasOwnProperty(event)) {
        var ytEvent = getListenerName(event);
        if (uw[ytEvent]) {
          ytListeners[ytEvent] = uw[ytEvent];
        }
        utils.defineLockedProperty(uw, ytEvent,
          utils.bind(null, ytListenerContainerSetter, event),
          utils.bind(null, ytListenerContainerGetter, event)
        );
      }
    }
  }
  
  /**
  * Initializing the player listener wrapper.
  *
  * @static
  * @method init
  **/
  function init() {
    if (enabled) return;
    var api = playerAPI.getAPI();
    playerListenerDetails = getPlayerListenerDetails();
    
    enabled = true; // Indicate that the it's active.

    // Add the listeners normally to the player
    addPlayerListener();
    
    // Replace the global listeners with custom listeners in case the override property is set to true
    initGlobalListeners();
  }
  
  /**
  * Adding an event listener.
  *
  * @static
  * @method addEventListener
  * @param {String} event The event name.
  * @param {Function} listener The listener.
  **/
  function addEventListener(event, listener) {
    if (!events.hasOwnProperty(event)) return;
    
    removeEventListener(event, listener); // Make sure that there is only one instance of the listener registered.
    events[event].listeners.push(listener);
  }
  
  /**
  * Removing an event listener.
  *
  * @static
  * @method removeEventListener
  * @param {String} event The event name.
  * @param {Function} listener The listener.
  **/
  function removeEventListener(event, listener) {
    if (!events.hasOwnProperty(event)) return;
    for (var i = 0, len = events[event].listeners.length; i < len; i++) {
      if (events[event].listeners[i] === listener) {
        return events[event].listeners.splice(i, 1);
      }
    }
  }
  
  /**
  * Set the event to override the YouTube's event listener
  * so that they won't be called except if done so manually.
  *
  * @static
  * @method setOverride
  * @param {String} event The event name.
  * @param {Boolean} override Whether the event should be set to override.
  **/
  function setOverride(event, override) {
    if (!events.hasOwnProperty(event)) return;
    events[event].override = !!override;
  }
  
  /**
  * Unload the player listeners added to the player
  * through the player API.
  *
  * @private
  * @static
  * @method unloadPlayerListeners
  **/
  function unloadPlayerListeners() {
    var api = playerAPI.getAPI();
    var event;
    
    if (api && api.removeEventListener) {
      for (event in events) {
        if (events.hasOwnProperty(event)) {
          api.removeEventListener(event, playerListener[event]);
          delete playerListener[event];
        }
      }
    } else {
      con.error("[Player Listener] Player API is not available!");
    }
  }
  
  /**
  * Unload the player listener wrapper.
  *
  * @static
  * @method unload
  **/
  function unload() {
    unloadPlayerListeners();
    enabled = false;
    apiNotAvailable = true;
  }
  
  /**
  * The cached player id and uid.
  *
  * @private
  * @static
  * @property playerListenerDetails
  * @type Object
  **/
  var playerListenerDetails = { id: 1, uid: null };
  
  /**
  * The leaked YouTube listeners.
  *
  * @private
  * @static
  * @property ytListeners
  * @type Object
  **/
  var ytListeners = {};
  
  /**
  * The cached player listeners.
  *
  * @private
  * @static
  * @property playerListener
  * @type Object
  **/
  var playerListener = {};
  
  /**
  * If the player listeners handler is enabled.
  *
  * @private
  * @static
  * @property enabled
  * @type Boolean
  **/
  var enabled = false;
  
  /**
  * If the global listeners are initialized.
  *
  * @private
  * @static
  * @property globalListenersInitialized
  * @type Boolean
  **/
  var globalListenersInitialized = false;
  
  /**
  * If the player API is available.
  *
  * @private
  * @static
  * @property apiNotAvailable
  * @type Boolean
  **/
  var apiNotAvailable = true;
  
  /**
  * The event listeners and options.
  *
  * @private
  * @static
  * @property events
  * @type Object
  **/
  var events = {};
  for (var event in Events) {
    if (Event.hasOwnProperty(event)) {
      events[event] = { override: false, listeners: [] };
    }
  }
  
  // Intialize the player listeners at player on ready.
  onReady.addListener(init);
  
  /* Exports */
  exports.addEventListener = addEventListener;
  exports.removeEventListener = removeEventListener;
  exports.setOverride = setOverride;
  exports.init = init;
  exports.unload = unload;
  
  return exports;
});