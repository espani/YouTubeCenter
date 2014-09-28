/**
* @class SPF
**/
define(["exports", "unsafeWindow", "pageload"], function(exports, uw, pageload){
  /**
  * Enables SPF for the page.
  *
  * @static
  * @method setEnabled
  * @param {Boolean} enabled SPF will be enabled if true otherwise it will be disabled.
  **/
  function setEnabled(enabled) {
    var spfEnabled = isEnabled();
    if (enabled) {
      if (!spfEnabled && uw && uw.spf && typeof uw.spf.init === "function") {
        uw.spf.init();
      }
    } else {
      if (spfEnabled && uw && uw.spf && typeof uw.spf.dispose === "function") {
        uw.spf.dispose();
      }
    }
  }
  
  /**
  * Returns true if SPF is enabled otherwise returns false.
  *
  * @static
  * @method isEnabled
  * @return {Boolean} If true SPF is enabled, otherwise SPF is disabled.
  **/
  function isEnabled() {
    return uw && uw._spf_state && uw._spf_state["history-init"];
  }
  
  /**
  * Add an event listener to SPF.
  *
  * @static
  * @method addEventListener
  * @param {String} event The name of the event.
  * @param {Function} listener The listener that will be called when the event is fired.
  **/
  function addEventListener(event, listener) {
    if (!attachedEvents[event]) attachedEvents[event] = [];
    attachedEvents[event].push(listener);
  }
  
  /**
  * Removes an existing event listener that have been added to SPF.
  *
  * @static
  * @method removeEventListener
  * @param {String} event The name of the event.
  * @param {Function} listener The listener that will be called when the event is fired.
  **/
  function removeEventListener(event, listener) {
    if (!attachedEvents[event]) return;
    for (var i = 0, len = attachedEvents[event].length; i < len; i++) {
      if (attachedEvents[event][i] === listener) {
        attachedEvents[event].splice(i, 1);
        i--; len--;
      }
    }
  }
  
  /**
  * Handles every attached listener to a specific event.
  *
  * @private
  * @static
  * @method listener
  * @param {String} event The name of the event.
  * @param {Object} e The event object.
  **/
  function listener(event, e) {
    var args = Array.prototype.slice.call(arguments, 1);
    con.log("[SPF] " + event, args);
    var listeners = attachedEvents[event];
    if (listeners) {
      for (var i = 0, len = listeners.length; i < len; i++) {
        listeners[i].call(this, e.detail);
      }
    }
  }
  
  /**
  * Initialize the SPF wrapper.
  *
  * @static
  * @method init
  **/
  function init() {
    for (var i = 0, len = spfEvents.length; i < len; i++) {
      var boundListener = bind(null, listener, spfEvents[i]);
      events.push(boundListener);
      
      document.addEventListener(customEventPrefix + spfEvents[i], boundListener, false);
    }
  }
  
  /**
  * Uninitializes the SPF wrapper.
  *
  * @static
  * @method dispose
  **/
  function dispose() {
    if (events.length === spfEvents.length) {
      for (var i = 0, len = spfEvents.length; i < len; i++) {
        document.removeEventListener(customEventPrefix + spfEvents[i], events[i], false);
      }
      events = [];
    }
  }
  
  /**
  * The SPF prefix.
  *
  * @private
  * @static
  * @property customEventPrefix
  * @type String
  **/
  var customEventPrefix = "spf";
  
  /**
  * Every SPF event that's possible to subscribe to.
  *
  * @private
  * @static
  * @property spfEvents
  * @type String
  **/
  var spfEvents = [ "error", "requested", "partreceived", "partprocessed", "received", "processed", "ready", "jsbeforeunload", "jsunload", "cssbeforeunload", "cssunload" ];
  
  /**
  * The attached listeners to the events.
  *
  * @private
  * @static
  * @property attachedEvents
  * @type Object
  **/
  var attachedEvents = { };
  
  /**
  * The event handlers that is attached to the document element.
  *
  * @private
  * @static
  * @property events
  * @type Function[]
  **/
  var events = [ ];
  
  init();
  
  exports.addEventListener = addEventListener;
  exports.removeEventListener = removeEventListener;
  exports.setEnabled = setEnabled;
  exports.isEnabled = isEnabled;
  exports.init = init;
  exports.dispose = dispose;
  
  return exports;
});