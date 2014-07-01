define('utils',[],function(){
  function each(obj, callback) {
    if (isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        if (callback(i, obj[i]) === true) break;
      }
    } else {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (callback(key, obj[key]) === true) break;
        }
      }
    }
  }
  
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
  
  function bind(scope, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function(){
      return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
    };
  }
  
  function defineLockedProperty(obj, key, setter, getter) {
    if (typeof obj !== "object") obj = {};
    if (ie || typeof Object.defineProperty === "function") {
      Object.defineProperty(obj, key, {
        get: getter,
        set: setter
      });
      return obj;
    } else {
      obj.__defineGetter__(key, getter);
      obj.__defineSetter__(key, setter);
      return obj;
    }
  }
  
  function addEventListener(elm, event, callback, useCapture) {
    if (elm.addEventListener) {
      elm.addEventListener(event, callback, useCapture || false);
    } else if (elm.attachEvent) {
      elm.attachEvent("on" + event, callback);
    }
  }
  
  function removeEventListener(elm, event, callback, useCapture) {
    if (elm.removeEventListener) {
      elm.removeEventListener(event, callback, useCapture || false);
    } else if (elm.detachEvent) {
      elm.detachEvent("on" + event, callback);
    }
  }
  
  var ie = (function(){
    for (var v = 3, el = document.createElement('b'), all = el.all || []; el.innerHTML = '<!--[if gt IE ' + (++v) + ']><i><![endif]-->', all[0];);
    return v > 4 ? v : !!document.documentMode;
  }());
  
  return {
    each: each,
    isArray: isArray,
    bind: bind,
    defineLockedProperty: defineLockedProperty,
    ie: ie,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  };
});
define('windowReadyEvent',["utils"], function(utils){
  function addEventListener(event, callback) {
    if (!listeners.hasOwnProperty(event)) {
      listeners[event] = [];
    }
    listeners[event].push(callback);
    
    var readyState = pageStates.indexOf(document.readyState);
    if (readyState <= lastState) {
      callback();
    }
  }
  
  function removeEventListener(event, callback) {
    if (!listeners.hasOwnProperty(event)) {
      return;
    }
    var l = listeners[event];
    for (var i = 0, len = l.length; i < len; i++) {
      if (l[i] === callback) {
        l[i].splice(i, 1);
        return;
      }
    }
  }
  
  function update() {
    var readyState = pageStates.indexOf(document.readyState);
    utils.each(listeners, function(key, val){
      var eventState = pageStates.indexOf(key);
      if (lastState < eventState < readyState) {
        for (var i = 0, len = val.length; i < len; i++) {
          val[i]();
        }
      }
    });
    lastState = readyState;
  }
  
  function init() {
    utils.addEventListener(document, "readystatechange", update, true);
    utils.addEventListener(document, "DOMContentLoaded", update, true);
    update();
  }
  
  var listeners = {};
  var pageStates = ["uninitialized", "loading", "interactive", "complete"];
  var lastState = -1;
  
  init();
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener
  };
});
define('unsafeWindow',[], function(){
  return window;
});
define('player/api',["unsafeWindow", "utils"], function(unsafeWindow, utils){
  function getAPI() {
    if (!apiCache) {
      apiCache = bindPlayerAPI();
    }
    return apiCache;
  }
  function setAPI(api) {
    apiCache = api;
  }
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
  
  var apiCache = null;
  
  return {
    getAPI: getAPI,
    setAPI: setAPI
  };
});
define('console',[], function(){
  function setEnabled(b) {
    enabled = b;
  }
  
  function log() {
    if (!enabled) return;
    return console.log.apply(console, Array.prototype.slice.call(arguments));
  }
  
  function error() {
    if (!enabled) return;
    return console.error.apply(console, Array.prototype.slice.call(arguments));
  }
  
  function warn() {
    if (!enabled) return;
    return console.warn.apply(console, Array.prototype.slice.call(arguments));
  }
  
  var enabled = true;
  
  return {
    log: log,
    error: error,
    warn: warn,
    setEnabled: setEnabled
  };
});
define('player/listeners',["utils", "player/api", "unsafeWindow", "console"], function(utils, playerAPI, uw, con){
  // Get the YouTube listener for the passed event.
  function getYouTubeListener(event) {
    var ytEvent = "ytPlayer" + event + "player" + playerId;
    return ytListeners[ytEvent];
  }
  
  // The latest player id registered in the global window.
  function getNewestPlayerId() {
    var id = 1, i;
    utils.each(uw, function(key, value){
      if (key.indexOf("ytPlayer") !== -1) {
        i = parseInt(key.match(/player([0-9]+)$/)[1]);
        if (i > id) {
          id = i;
        }
      }
    });
    return id;
  }
  
  function ytListenerContainerSetter(event, func) {
    var ytEvent = "ytPlayer" + event + "player" + playerId;
    ytListeners[ytEvent] = func;
  }
  function ytListenerContainerGetter(event, func) {
    return utils.bind(null, callListener, event, 1);
  }
  
  /* Origin argument
   * If origin is equal to 0 then the origin is directly from the player (only YouTube Center's listeners get executed if override is false).
   * If origin is equal to 1 then the origin is from the global listeners (both YouTube's and YouTube Center's listeners get executed).
   */
  function callListener(event, origin) {
    function generateThisObject() {
      return {
        getOriginalListener: utils.bind(null, getYouTubeListener, event)
      };
    }
    
    var ytEvent = "ytPlayer" + event + "player" + playerId;
    var args = Array.prototype.slice.call(arguments, 2);
    var returnVal = null;
    
    if (enabled && origin === 0 && (!events.hasOwnProperty(event) || (events.hasOwnProperty(event) && !events[event].override))) {
      /* Override is false and the origin is from the player; call the YouTube Center listeners */
      if (events.hasOwnProperty(event)) {
        for (var i = 0, len = events[event].listeners.length; i < len; i++) {
          returnVal = events[event].listeners[i].apply(null, args);
        }
      }
    } else if (enabled && origin === 1) {
      if (events.hasOwnProperty(event) && events[event].override) {
        /* Override is true and the origin is from the global window; call the YouTube Center listeners */
        for (var i = 0, len = events[event].listeners.length; i < len; i++) {
          events[event].listeners[i].apply(generateThisObject(), args);
        }
        con.log("[Player Listener] Event " + event + " was called with", args);
      } else if (ytListeners[ytEvent]) {
        if (apiNotAvailable) {
          /* API is not available therefore call YouTube Center listeners as YouTube listener is called  */
          for (var i = 0, len = events[event].listeners.length; i < len; i++) {
            returnVal = events[event].listeners[i].apply(null, args);
          }
        }
        
        /* Override is false and the origin is from the global window; call the YouTube listener */
        returnVal = ytListeners[ytEvent].apply(uw, args);
        
        con.log("[Player Listener] Event " + event + " was called with", args);
      }
    } else if (!enabled) {
      /* Everything is disabled; call the YouTube listener */
      returnVal = ytListeners[ytEvent].apply(uw, args);
    }
    return returnVal;
  }
  
  function addPlayerListener() {
    var api = playerAPI.getAPI();
    var event;
    
    if (api && api.addEventListener) {
      apiNotAvailable = false;
      for (event in events) {
        if (events.hasOwnProperty(event)) {
          playerListener[event] = utils.bind(null, callListener, event, 0);
          api.addEventListener(event, playerListener[event]);
        }
      }
    } else {
      apiNotAvailable = true;
      con.error("[Player Listener] Player API is not available!");
    }
  }
  
  function initGlobalListeners() {
    if (globalListenersInitialized) return; // Make sure that this function is only called once.
    globalListenersInitialized = true;
    for (var event in events) {
      if (events.hasOwnProperty(event)) {
        var ytEvent = "ytPlayer" + event + "player" + playerId;
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
  
  function init() {
    if (enabled) return;
    con.log("[Player Listener] Has begun the init...");
    var api = playerAPI.getAPI();
    playerId = getNewestPlayerId();
    
    enabled = true; // Indicate that the it's active.

    // Add the listeners normally to the player
    addPlayerListener();
    
    // Replace the global listeners with custom listeners in case the override property is set to true
    initGlobalListeners();
  }
  
  function addEventListener(event, listener) {
    if (!events.hasOwnProperty(event)) return;
    
    removeEventListener(event, listener); // Make sure that there is only one instance of the listener registered.
    events[event].listeners.push(listener);
  }
      
  function removeEventListener(event, listener) {
    if (!events.hasOwnProperty(event)) return;
    for (var i = 0, len = events[event].listeners.length; i < len; i++) {
      if (events[event].listeners[i] === listener) {
        return events[event].listeners.splice(i, 1);
      }
    }
  }
  
  function setOverride(event, override) {
    if (!events.hasOwnProperty(event)) return;
    events[event].override = !!override;
  }
  
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
  
  function unload() {
    unloadPlayerListeners();
    enabled = false;
    apiNotAvailable = true;
  }
  
  var playerId = 1;
  var ytListeners = {};
  var playerListener = {}; // Reference for unload
  var enabled = false;
  var globalListenersInitialized = false;
  var apiNotAvailable = true;
  
  var events = {
    "onApiChange": {
      override: false,
      listeners: []
    },
    "onCueRangeEnter": {
      override: false,
      listeners: []
    },
    "onCueRangeExit": {
      override: false,
      listeners: []
    },
    "onError": {
      override: false,
      listeners: []
    },
    "onNavigate": {
      override: false,
      listeners: []
    },
    "onPlaybackQualityChange": {
      override: false,
      listeners: []
    },
    "onStateChange": {
      override: false,
      listeners: []
    },
    "onTabOrderChange": {
      override: false,
      listeners: []
    },
    "onVolumeChange": {
      override: false,
      listeners: []
    },
    "onAdStart": {
      override: false,
      listeners: []
    },
    "onReady": {
      override: false,
      listeners: []
    },
    "RATE_SENTIMENT": {
      override: false,
      listeners: []
    },
    "SHARE_CLICKED": {
      override: false,
      listeners: []
    },
    "SIZE_CLICKED": {
      override: false,
      listeners: []
    },
    "WATCH_LATER": {
      override: false,
      listeners: []
    },
    "AdvertiserVideoView": {
      override: false,
      listeners: []
    },
    "captionschanged": {
      override: false,
      listeners: []
    },
    "onRemoteReceiverSelected": {
      override: false,
      listeners: []
    }
  };
  
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    setOverride: setOverride,
    init: init,
    unload: unload
  };
});
require.config({
  waitSeconds: 0
});

define('main',["windowReadyEvent", "player/listeners", "console"], function(windowReadyEvent, playerListener, con){
  windowReadyEvent.addEventListener("uninitialized", function(){
    con.log("[Window] At event uninitialized.");
  });
  windowReadyEvent.addEventListener("loading", function(){
    con.log("[Window] At event loading.");
  });
  windowReadyEvent.addEventListener("interactive", function(){
    con.log("[Window] At event interactive.");
  });
  windowReadyEvent.addEventListener("complete", function(){
    con.log("[Window] At event complete.");
  });
  
});

// Let's run this
require(["main"], function(){ });
