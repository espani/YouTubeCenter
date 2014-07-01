define(function(){
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