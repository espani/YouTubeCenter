define(["exports", "unsafeWindow", "utils", "console"], function(exports, uw, utils, con){
  /**
  * Add a keyboard action
  *
  * @static
  * @method addKeyboardAction
  * @param {String} id An unique id for the keyboard action
  * @param {String} name A descriptive name to identify the action.
  * @param {Number[]} defaultKeys An array of the default bound keys (these should be rebindable).
  * @param {String} event The event where the keyboard action should be executed.
  * @param {Function} fn The keyboard action function that will be called for every event.
  **/
  function addKeyboardAction(id, name, defaultKeys, event, fn) {
    keyboardActions[id] = {
      name: name, // The name of the action (will be used to describe the action).
      defaultKeys: defaultKeys, // The default keys
      event: event, // The events that the action should be executed on
      fn: fn // The action that should be executed when every condition is met.
    };
  }
  
  function removeKeyboardAction(id) {
    if (keyboardActions.hasOwnProperty(id)) {
      delete keyboardActions[id];
    }
  }
  
  function isKeyPressed(keys, keyCode, e) {
    // Iterate through the keys array.
    for (var i = 0, len = keys.length; i < len; i++) {
      var key = keys[i];
      
      // Checking modifiers
      if (key.shiftKey === e.shiftKey && key.ctrlKey === e.ctrlKey && key.altKey == e.altKey && key.metaKey === e.metaKey) {
        // Checking key code
        if (key.keyCode === keyCode) {
          return true;
        }
      }
    }
    return false;
  }
  
  function keyListener(eventName, e) {
    e = e || uw.event;
    
    var keyCode = e.keyCode;
    
    for (var key in keyboardActions) {
      if (keyboardActions.hasOwnProperty(key)) {
        var detail = keyboardActions[key];
        var keys = boundKeys[key] || detail.defaultKeys;
        if (detail.event === eventName && isKeyPressed(keys, keyCode, e)) {
          detail.fn(eventName, keyCode);
        }
      }
    }
  }
  
  function getKeyName(keyCode) {
    return String.fromCharCode(keyCode);
  }
  
  function getKeyboardActions() {
    return keyboardActions;
  }
  
  function getBoundKeys(id) {
    if (boundKeys[id]) {
      return boundKeys[id];
    }
    return null;
  }
  
  function bindKey(id, key) {
    if (!boundKeys[id]) {
      boundKeys[id] = [];
    }
    boundKeys[id].push(key);
  }
  
  function setBoundKeys(id, keys) {
    boundKeys[id] = keys;
  }
  
  var keyboardActions = {};
  var boundKeys = {};
  
  uw.addEventListener("keydown", utils.bind(null, keyListener, "keydown"), false);
  uw.addEventListener("keypress", utils.bind(null, keyListener, "keypress"), false);
  
  exports.addKeyboardAction = addKeyboardAction;
  exports.removeKeyboardAction = removeKeyboardAction;
  exports.getKeyName = getKeyName;
  exports.getBoundKeys = getBoundKeys;
  exports.bindKey = bindKey;
  exports.setBoundKeys = setBoundKeys;
  
  return exports;
});