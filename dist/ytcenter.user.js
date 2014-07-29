// ==UserScript==
// @id              YouTubeCenter
// @name            YouTube Center
// @namespace       http://www.facebook.com/YouTubeCenter
// @version         3.0.0
// @author          Jeppe Rune Mortensen <jepperm@gmail.com>
// @description     YouTube Center contains all kind of different useful functions which makes your visit on YouTube much more entertaining.
// @icon            https://raw.github.com/YePpHa/YouTubeCenter/master/assets/logo-48x48.png
// @icon64          https://raw.github.com/YePpHa/YouTubeCenter/master/assets/logo-64x64.png
// @domain          yeppha.github.io
// @domain          youtube.com
// @domain          www.youtube.com
// @domain          gdata.youtube.com
// @domain          apis.google.com
// @domain          plus.googleapis.com
// @domain          googleapis.com
// @domain          raw.github.com
// @domain          raw2.github.com
// @domain          s.ytimg.com
// @match           http://*.youtube.com/*
// @match           https://*.youtube.com/*
// @match           https://yeppha.github.io/downloads/YouTubeCenter.meta.js
// @match           http://s.ytimg.com/yts/jsbin/*
// @match           https://s.ytimg.com/yts/jsbin/*
// @match           https://raw.github.com/YePpHa/YouTubeCenter/master/*
// @match           http://apis.google.com/*/widget/render/comments?*
// @match           https://apis.google.com/*/widget/render/comments?*
// @match           http://plus.googleapis.com/*/widget/render/comments?*
// @match           https://plus.googleapis.com/*/widget/render/comments?*
// @include         http://*.youtube.com/*
// @include         https://*.youtube.com/*
// @include         http://apis.google.com/*/widget/render/comments?*
// @include         https://apis.google.com/*/widget/render/comments?*
// @include         http://plus.googleapis.com/*/widget/render/comments?*
// @include         https://plus.googleapis.com/*/widget/render/comments?*
// @exclude         http://apiblog.youtube.com/*
// @exclude         https://apiblog.youtube.com/*
// @exclude         http://*.youtube.com/subscribe_embed?*
// @exclude         https://*.youtube.com/subscribe_embed?*
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @grant           GM_log
// @grant           GM_registerMenuCommand
// @grant           unsafeWindow
// @updateURL       https://github.com/YePpHa/YouTubeCenter/raw/master/dist/YouTubeCenter.meta.js
// @downloadURL     https://github.com/YePpHa/YouTubeCenter/raw/master/dist/YouTubeCenter.user.js
// @updateVersion   1
// @run-at          document-start
// @priority        9001
// @contributionURL https://github.com/YePpHa/YouTubeCenter/wiki/Donate
// ==/UserScript==


(function(){function mainPage(UserProxy_token, UserProxy_functions, globalSettings) {
(function () {/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../vendor/almond", function(){});

define('unsafeWindow',[], function(){
  return window;
});
define('support',["unsafeWindow"], function(uw){
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
define('utils',["support", "unsafeWindow"], function(support, uw){
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
  
  function asyncCall(scope, callback) {
    return setTimeout(bind.apply(null, [scope, callback].concat(Array.prototype.slice.call(arguments, 2))), 0);
  }
  
  function bind(scope, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function(){
      return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
    };
  }
  function trimLeft(obj){
    return obj.replace(/^\s+/, "");
  }
  function trimRight(obj){
    return obj.replace(/\s+$/, "");
  }
  function map(obj, callback, thisArg) {
    for (var i = 0, n = obj.length, a = []; i < n; i++) {
      if (i in obj) a[i] = callback.call(thisArg, obj[i]);
    }
    return a;
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
  
  var now = Date.now || function () {
    return +new Date;
  };
  
  /* Cookies */
  function setCookie(name, value, domain, path, expires) {
    domain = domain ? ";domain=" + encodeURIComponent(domain) : "";
    path = path ? ";path=" + encodeURIComponent(path) : "";
    expires = 0 > expires ? "" : 0 == expires ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(now() + 1E3 * expires)).toUTCString();
    
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + domain + path + expires;
  }
  
  function getCookie(key) {
    return getCookies()[key];
  }
  
  function getCookies() {
    var c = document.cookie, v = 0, cookies = {};
    if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
      c = RegExp.$1;
      v = 1;
    }
    if (v === 0) {
      map(c.split(/[,;]/), function(cookie) {
        var parts = cookie.split(/=/, 2),
            name = decodeURIComponent(trimLeft(parts[0])),
            value = parts.length > 1 ? decodeURIComponent(trimRight(parts[1])) : null;
        cookies[name] = value;
      });
    } else {
      map(c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g), function($0, $1) {
        var name = $0, value = $1.charAt(0) === '"' ? $1.substr(1, -1).replace(/\\(.)/g, "$1") : $1;
        cookies[name] = value;
      });
    }
    return cookies;
  }
  
  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
  
  function inject(func) {
    var script = document.createElement("script"),
        p = (document.body || document.head || document.documentElement);
    if (!p) {
      throw "Could not inject!!!";
    }
    script.setAttribute("type", "text/javascript");
    script.appendChild(document.createTextNode("(" + func + ")(" + buildArgumentList.apply(null, [false].concat(Array.prototype.slice.call(arguments, 1))) + ");"));
    p.appendChild(script);
    p.removeChild(script);
  }
  
  function buildArgumentList(wrap) {
    var list = [];
    var args = Array.prototype.slice.call(arguments, 1);
    
    for (var i = 0, len = args.length; i < len; i++) {
      if (typeof args[i] === "string") {
        list.push("\"" + args[i].replace(/\\/, "\\\\").replace(/"/g, "\\\"") + "\"");
      } else if (typeof args[i] === "object") {
        list.push(JSON.stringify(args[i]));
      } else {
        list.push(args[i]);
      }
    }
    if (wrap) {
      return "(" + list.join(",") + ")";
    } else {
      return list.join(",");
    }
  }
  
  function isJSONString(json) {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }
  
  function xhr(details) {
    var xmlhttp;
    if (typeof XMLHttpRequest !== "undefined") {
      xmlhttp = new XMLHttpRequest();
    } else if (typeof opera !== "undefined" && typeof opera.XMLHttpRequest !== "undefined") {
      xmlhttp = new opera.XMLHttpRequest();
    } else {
      if (details["onerror"]) {
        details["onerror"]();
      }
      
      return;
    }
    xmlhttp.onreadystatechange = function(){
      var responseState = {
        responseXML:(xmlhttp.readyState == 4 ? xmlhttp.responseXML : ''),
        responseText:(xmlhttp.readyState == 4 ? xmlhttp.responseText : ''),
        readyState:xmlhttp.readyState,
        responseHeaders:(xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
        status:(xmlhttp.readyState == 4 ? xmlhttp.status : 0),
        statusText:(xmlhttp.readyState == 4 ? xmlhttp.statusText : ''),
        finalUrl:(xmlhttp.readyState == 4 ? xmlhttp.finalUrl : '')
      };
      if (details["onreadystatechange"]) {
        details["onreadystatechange"](responseState);
      }
      if (xmlhttp.readyState == 4) {
        if (details["onload"] && xmlhttp.status >= 200 && xmlhttp.status < 300) {
          details["onload"](responseState);
        }
        if (details["onerror"] && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
          details["onerror"](responseState);
        }
      }
    };
    try {
      xmlhttp.open(details.method, details.url);
    } catch(e) {
      if(details["onerror"]) {
        details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
      }
      return;
    }
    if (details.headers) {
      for (var prop in details.headers) {
        xmlhttp.setRequestHeader(prop, details.headers[prop]);
      }
    }
    xmlhttp.send((typeof(details.data) != 'undefined') ? details.data : null);
  }
  
  // Used for the message module (should probably move to another place)
  // It replaces a property in the obj to a predefined function, where the arguments will be callbackId, target, referer
  function bindFunctionCallbacks(obj, func, target, referer) {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "obj") {
          bindFunctionCallbacks(obj[key]);
        } else if (typeof obj[key] === "string") {
          if (obj[key].indexOf("@/(message.callback)/") === 0) {
            var callbackId = obj[key].split("@/(message.callback)/")[1];
            obj[key] = bind(null, func, callbackId, target, referer);
          }
        }
      }
    }
  }
  
  function extend(obj, defaults, deep) {
    if (typeof obj !== "object") throw new TypeError("Unsupported type for obj.");
    if (typeof defaults !== "object") throw new TypeError("Unsupported type for defaults.");
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && typeof defaults[key] === "object" && deep) {
          extend(obj[key], defaults[key], deep);
        } else if (!obj.hasOwnProperty(key)) {
          obj[key] = defaults[key];
        }
      }
    }
    return obj;
  }
  
  function inArray(key, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === key) {
        return true;
      }
    }
    return false;
  }
  
  function listClasses(el) {
    if (!el || !el.className) return [];
    return el.className.split(" ");
  }
  
  function addClass(el, className) {
    var classes = listClasses(el);
    var addList = className.split(" ");
    
    for (var i = 0, len = addList.length; i < len; i++) {
      if (!inArray(addList[i], classes)) {
        el.className += " " + addList[i];
      }
    }
    return el.className;
  }
  
  function removeClass(el, className) {
    var classes = listClasses(el);
    var removeList = className.split(" ");
    
    var buffer = [];
    for (var i = 0, len = classes.length; i < len; i++) {
      if (!inArray(classes[i], removeList)) {
        buffer.push(classes[i]);
      }
    }
    return el.className = buffer.join(" ");
  }
  
  function hasClass(el, className) {
    return inArray(className, listClasses(el));
  }
  
  function throttle(func, delay, options){
    function timeout() {
      previous = options.leading === false ? 0 : new Date;
      timer = null;
      result = func.apply(context, args);
    }
    var context, args, result, timer = null, previous = 0;
    options = options || {};
    return function(){
      var now = new Date, dt;
      
      context = this;
      args = arguments;
      
      if (!previous && options.leading === false) previous = now;
      dt = delay - (now - previous);
      
      if (dt <= 0) {
        clearTimeout(timer);
        timer = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timer && options.trailing !== false) {
        timer = setTimeout(timeout, dt);
      }
      return result;
    };
  }
  
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  function removeDuplicates(arr) {
    var uniqueArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (!inArray(uniqueArr, arr[i])) {
        uniqueArr.push(arr[i]);
      }
    }
    
    return uniqueArr;
  }
  
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  
  function toBlob(bytes, contentType) {
    contentType = contentType || "text/plain";
    var sliceSize = 512;
    
    var bytesLength = bytes.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    
    var byteArrays = new Array(slicesCount);
    
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      
      var sliceBytes = new Array(end - begin);
      for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
        sliceBytes[i] = bytes[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(sliceBytes);
    }
    
    return new Blob(byteArrays, { type: contentType });
  }
  
  function createObjectURL(blob) {
    if (support.createObjectURL) {
      if (support.webkitURL) {
        return uw.webkitURL.createObjectURL(blob);
      } else {
        return uw.URL.createObjectURL(blob);
      }
    } else {
      throw "createObjectURL is not supported by the browser!";
    }
  }
  
  function revokeObjectURL(url) {
    if (support.revokeObjectURL) {
      if (support.webkitURL) {
        return uw.webkitURL.revokeObjectURL(url);
      } else {
        return uw.URL.revokeObjectURL(url);
      }
    } else {
      throw "revokeObjectURL is not supported by the browser!";
    }
  }
  
  // Returns a random number between min and max
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Returns a random integer between min (included) and max (excluded)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Returns a random string of characters of chars with the length of length
  function generateToken(chars, length) {
    if (typeof chars !== "string") chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    if (typeof length !== "number") length = 64;
    
    var charsLength = chars.length;
    
    var token = "";
    for (var i = 0; i < length; i++) {
      token += chars[getRandomInt(0, charsLength)];
    }
    
    return token;
  }
  
  return {
    hasClass: hasClass,
    removeClass: removeClass,
    addClass: addClass,
    each: each,
    isArray: isArray,
    inArray: inArray,
    bind: bind,
    asyncCall: asyncCall,
    defineLockedProperty: defineLockedProperty,
    ie: ie,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    now: now,
    trimLeft: trimLeft,
    trimRight: trimRight,
    map: map,
    setCookie: setCookie,
    getCookie: getCookie,
    getCookies: getCookies,
    endsWith: endsWith,
    inject: inject,
    isJSONString: isJSONString,
    xhr: xhr,
    buildArgumentList: buildArgumentList,
    bindFunctionCallbacks: bindFunctionCallbacks,
    extend: extend,
    throttle: throttle,
    clone: clone,
    removeDuplicates: removeDuplicates,
    escapeRegExp: escapeRegExp,
    toBlob: toBlob,
    createObjectURL: createObjectURL,
    revokeObjectURL: revokeObjectURL,
    generateToken: generateToken
  };
});
define('console',["utils"], function(utils){
  function setEnabled(b) {
    enabled = b;
  }
  
  function log() {
    if (!enabled) return function(){};
    return console.log.bind(console, "injected[" + sessionToken + "]");
  }
  
  function error() {
    if (!enabled) return function(){};
    return console.error.bind(console, "injected[" + sessionToken + "]");
  }
  
  function warn() {
    if (!enabled) return function(){};
    return console.warn.bind(console, "injected[" + sessionToken + "]");
  }
  
  var sessionToken = utils.generateToken(null, 8);
  
  var enabled = true;
  
  var retObj = {};
  utils.defineLockedProperty(retObj, "log", function(){}, log);
  utils.defineLockedProperty(retObj, "error", function(){}, error);
  utils.defineLockedProperty(retObj, "warn", function(){}, warn);
  
  return retObj;
});
define('UserProxy/support',[], function(){
  function customEvent() {
    try {
      var e = document.createEvent('CustomEvent');
      if (e && typeof e.initCustomEvent === "function") {
        e.initCustomEvent(mod, true, true, { mod: mod });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  
  var mod = "support.test";
  
  return {
    CustomEvent: customEvent
  };
});
define('UserProxy/utils',[], function(){
  function bind(scope, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function(){
      return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
    };
  }
  
  // Iterate through obj with the callback function.
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
  
  function getKeys(obj) {
    var keys = [];
    each(obj, function(key){
      keys.push(key);
    });
    return keys;
  }
  
  // Returns a boolean indicating if object arr is an array.
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
  
  // Returns a boolean indicating if the value is in the array.
  function inArray(value, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === value) {
        return true;
      }
    }
    return false;
  }
  
  function indexOfArray(value, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === value) {
        return i;
      }
    }
    return -1;
  }
  
  function indexOf(value, arr) {
    if (isArray(value, arr)) {
      return indexOfArray(value, arr);
    }
  }
  
  // Returns a random number between min and max
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Returns a random integer between min (included) and max (excluded)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Returns a random string of characters of chars with the length of length
  function generateToken(chars, length) {
    if (typeof chars !== "string") chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    if (typeof length !== "number") length = 64;
    
    var charsLength = chars.length;
    
    var token = "";
    for (var i = 0; i < length; i++) {
      token += chars[getRandomInt(0, charsLength)];
    }
    
    return token;
  }
  
  function escapeECMAVariable(key, defaultKey) {
    key = key.replace(/[^0-9a-zA-Z_\$]/g, "");
    while (/$[0-9]/g.test(key)) {
      if (key === "") return defaultKey;
      key = key.substring(1);
    }
    return key;
  }
  
  function buildArgumentList(wrap) {
    var list = [];
    var args = Array.prototype.slice.call(arguments, 1);
    
    for (var i = 0, len = args.length; i < len; i++) {
      if (typeof args[i] === "string") {
        list.push("\"" + args[i].replace(/\\/, "\\\\").replace(/"/g, "\\\"") + "\"");
      } else if (typeof args[i] === "object") {
        list.push(JSON.stringify(args[i]));
      } else {
        list.push(args[i]);
      }
    }
    if (wrap) {
      return "(" + list.join(",") + ")";
    } else {
      return list.join(",");
    }
  }
  
  return {
    bind: bind,
    each: each,
    getKeys: getKeys,
    isArray: isArray,
    inArray: inArray,
    indexOf: indexOf,
    indexOfArray: indexOfArray,
    getRandomArbitrary: getRandomArbitrary,
    getRandomInt: getRandomInt,
    generateToken: generateToken,
    escapeECMAVariable: escapeECMAVariable,
    buildArgumentList: buildArgumentList
  };
});
define('UserProxy/CustomEvent',["./utils"], function(utils){
  function addEventListener(event, listener) {
    if (!events[event]) {
      // Creating the array of listeners for event
      events[event] = [];
      
      docListeners[event] = utils.bind(null, eventListener, event, events[event]);
      
      // Adding the event listener.
      window.addEventListener(event, docListeners[event], false);
    }
    
    // Adding listener to array.
    events[event].push(listener);
  }
  
  function removeEventListener(event, listener) {
    if (event in events) {
      for (var i = 0, len = events[event].length; i < len; i++) {
        if (events[event][i] === listener) {
          events[event].splice(i, 1);
          i--; len--;
        }
      }
      if (events[event].length === 0) {
        window.removeEventListener(event, docListeners[event], false);
        
        events[event] = null;
        docListeners[event] = null;
      }
    }
  }
  
  function eventListener(event, listeners, e) {
    e = e || window.event;
    
    // Parse the detail to the original object.
    var data = JSON.parse(e.detail);
    
    if (typeof data.detail === "object" && data.token !== token) {
      var detail = data.detail;
      for (var i = 0, len = listeners.length; i < len; i++) {
        // Call the listener with the event name and the parsed detail.
        listeners[i](detail);
      }
      
      // Prevent propagation
      if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
    }
  }
  
  function fireEvent(event, detail) {
    // Creating the event
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent(event, true, true, JSON.stringify({ detail: detail, token: token }));
    
    // Firing the event
    document.documentElement.dispatchEvent(e);
  }
  
  var token = utils.generateToken(); // The token is used to identify itself and prevent calling its own listeners.
  var events = {};
  var docListeners = {};
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    fireEvent: fireEvent
  };
});
define('UserProxy/Message',["./utils"], function(utils){
  function addEventListener(event, listener) {
    initMessage(); // Init the message event listener if not already initialized.
    
    if (!events[event]) events[event] = [];
    
    // Bind the event name to the listener as an argument.
    var boundListener = utils.bind(null, listener, event);
    
    // Add the boundListener to the event
    events[event].push(boundListener);
  }
  
  function fireEvent(event, detail) {
    window.postMessage(JSON.stringify({ token: token, event: event, detail: detail }), "*");
  }
  
  function messageListener(e) {
    e = e || window.event;
    
    // Parse the detail to the original object.
    var data = JSON.parse(e.data);
    
    // Verify that the retrieved information is correct and that it didn't call itself.
    if (typeof data.event === "string" && typeof data.detail === "object" && data.token !== token) {
      
      // Iterate through every listener for data.event.
      if (utils.isArray(events[data.event])) {
        var listeners = events[data.event];
        
        var detail = data.detail;
        for (var i = 0, len = listeners.length; i < len; i++) {
          listeners(detail);
        }
    
        // Prevent propagation only if everything went well.
        if (e && typeof e.stopPropagation === "function") {
          e.stopPropagation();
        }
      }
    }
  }
  
  function initMessage() {
    if (!messageEventAdded) {
      // Adding the message event listener.
      window.addEventListener("message", messageListener, false);
    }
  }
  
  var messageEventAdded = false;
  var token = utils.generateToken(); // The token is used to identify itself and prevent calling its own listeners.
  
  var events = {};
  
  return {
    addEventListener: addEventListener,
    fireEvent: fireEvent
  };
});
define('UserProxy/memFunction',["./utils", "./CustomEvent", "./Message", "./support"], function(utils, customEvent, message, support){
  function parseObject(obj, token, type) {
    if (typeof obj === "object") {
      utils.each(obj, function(key, value){
        if (typeof value === "object") {
          obj[key] = parseObject(value, token, type);
        } else if (typeof value === "string") {
          obj[key] = parseString(value);
        } else if (typeof value === "function") {
          var id = cache.push(value) - 1;
          obj[key] = "${" + token + "/" + type + "/" + id + "}";
        }
      });
    } else if (typeof value === "string") {
      obj = parseString(obj);
    } else if (typeof obj === "function") {
      var id = cache.push(obj) - 1;
      obj = "${" + token + "/" + type + "/" + id + "}";
    }
    return obj;
  }
  
  function parseString(str) {
    if (/^\$[\\]*\{([0-9a-zA-Z\.\-_\/\\]+)\}$/g.test(str)) {
      return "$\\" + str.substring(1);
    }
    return str;
  }
  
  function restoreString(str, token, type) {
    if (/^\$\{([0-9a-zA-Z\.\-_]+)\/([0-9a-zA-Z\.\-_]+)\/([0-9]+)\}$/g.test(str)) {
      var parsed = str.substring(2, str.length - 1).split("/"); // " + token + "/" + type + "/" + id + "
      var id = parseInt(parsed[2], 10);
      if (parsed[0] === token && parsed[1] === type) {
        return cache[id];
      } else {
        return utils.bind(null, functionPlaceholder, parsed[0] + "-" + parsed[1], id);
      }
    } else if (/^\$[\\]+\{([0-9a-zA-Z\.\-_\/\\]+)\}$/g.test(str)) {
      return "$" + str.substring(2);
    }
    return str;
  }
  
  function restoreObject(obj, token, type) {
    if (typeof obj === "object") {
      utils.each(obj, function(key, value){
        if (typeof value === "object") {
          obj[key] = restoreObject(value, token, type);
        } else if (typeof value === "string") {
          obj[key] = restoreString(value, token, type);
        } else if (typeof value === "function") {
          throw Error("Function was found!");
        }
      });
    } else if (typeof value === "string") {
      return restoreString(value, token, type);
    } else if (typeof value === "function") {
      throw Error("Function was found!");
    }
    return obj;
  }
  
  function functionPlaceholder(event, id) {
    var args = Array.prototype.slice.call(arguments, 2);
    if (support.CustomEvent) {
      return customEvent.fireEvent(event, { callbackId: id, args: args, mem: true });
    } else {
      return message.fireEvent(event, { callbackId: id, args: args, mem: true });
    }
  }
  
  function getCacheFunction(id) {
    return cache[id];
  }
  
  var cache = [];
  
  return {
    parseObject: parseObject,
    restoreObject: restoreObject,
    getCacheFunction: getCacheFunction
  };
});
define('UserProxy/proxy',["./support", "./CustomEvent", "./Message", "./utils", "./memFunction"], function(support, customEvent, message, utils, mem){
  function listener(detail) {
    if (typeof detail.callbackId === "number" && utils.isArray(detail.args) && detail.mem) {
      var args = mem.restoreObject(detail.args, token, "page");
      var func = mem.getCacheFunction(detail.callbackId);
      if (typeof func === "function") {
        func.apply(null, args);
      }
    } else if (typeof detail.callbackId === "number" && utils.isArray(detail.args)) {
      var args = mem.restoreObject(detail.args, token, "page");
      if (typeof callbackCache[detail.callbackId] === "function") {
        callbackCache[detail.callbackId].apply(null, args);
      }
    } else {
      throw Error("Malformed detail!", detail);
    }
  }
  
  function prepareCall(method, callback) {
    if (!has(method)) {
      throw Error(method + " is not a defined function!");
    }
    
    if (typeof callback !== "function") {
      throw Error("The callback is not a function!");
    }
    
    var id = callbackCache.push(callback) - 1;
    var args = Array.prototype.slice.call(arguments, 2);
    
    return function() {
      args = args.concat(Array.prototype.slice.call(arguments, 0));
      
      args = mem.parseObject(args, token, "page");
      var detail = {
        method: method,
        args: args,
        id: id
      };
      
      if (support.CustomEvent) {
        customEvent.fireEvent(token + "-content", detail);
      } else {
        message.fireEvent(token + "-content", detail);
      }
    };
  }
  
  function call(method, args) {
    function setCallback(callback) {
      clearTimeout(timer);
      if (typeof callback === "function") {
        detail.id = callbackCache.push(callback) - 1;
      }
      execute();
    }
    function execute() {
      if (support.CustomEvent) {
        customEvent.fireEvent(token + "-content", detail);
      } else {
        message.fireEvent(token + "-content", detail);
      }
    }
    args = Array.prototype.slice.call(arguments, 1);
    
    if (!has(method)) {
      throw Error(method + " is not a defined function!");
    }
    
    args = mem.parseObject(args, token, "page");
    var detail = {
      method: method,
      args: args
    };
    
    var timer = setTimeout(execute, 4);
    
    return {
      then: setCallback
    };
  }
  
  function has(method) {
    return utils.indexOfArray(method, functions) !== -1;
  }
  
  function getFunction(method) {
    if (has(method)) {
      return utils.bind(null, call, method);
    } else {
      throw Error(method + " is not defined!");
    }
  }
  
  function listFunctions() {
    return JSON.parse(JSON.stringify(functions));
  }
  
  var token = UserProxy_token;
  var functions = UserProxy_functions;
  
  var callbackCache = [];
  
  if (support.CustomEvent) {
    customEvent.addEventListener(token + "-page", listener);
  } else {
    message.addEventListener(token + "-page", listener);
  }
  
  return {
    call: call,
    prepareCall: prepareCall,
    getFunction: getFunction,
    isDefined: has,
    listFunctions: listFunctions
  };
});
define('xhr/injected',["utils", "UserProxy/proxy"], function(utils, UserProxy){
  return utils.bind(null, UserProxy.call, "xhr");
});
define('xhr',["xhr/injected"], function(xhr){
  return xhr;
});
define('main',["console", "utils", "xhr"], function(con, utils, request){
  // Let's do some initialization
});

require(["main"]);
}());
}
(function () {/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../vendor/almond", function(){});

define('unsafeWindow',[], function(){
  return window;
});
define('support',["unsafeWindow"], function(uw){
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
define('utils',["support", "unsafeWindow"], function(support, uw){
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
  
  function asyncCall(scope, callback) {
    return setTimeout(bind.apply(null, [scope, callback].concat(Array.prototype.slice.call(arguments, 2))), 0);
  }
  
  function bind(scope, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function(){
      return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
    };
  }
  function trimLeft(obj){
    return obj.replace(/^\s+/, "");
  }
  function trimRight(obj){
    return obj.replace(/\s+$/, "");
  }
  function map(obj, callback, thisArg) {
    for (var i = 0, n = obj.length, a = []; i < n; i++) {
      if (i in obj) a[i] = callback.call(thisArg, obj[i]);
    }
    return a;
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
  
  var now = Date.now || function () {
    return +new Date;
  };
  
  /* Cookies */
  function setCookie(name, value, domain, path, expires) {
    domain = domain ? ";domain=" + encodeURIComponent(domain) : "";
    path = path ? ";path=" + encodeURIComponent(path) : "";
    expires = 0 > expires ? "" : 0 == expires ? ";expires=" + (new Date(1970, 1, 1)).toUTCString() : ";expires=" + (new Date(now() + 1E3 * expires)).toUTCString();
    
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + domain + path + expires;
  }
  
  function getCookie(key) {
    return getCookies()[key];
  }
  
  function getCookies() {
    var c = document.cookie, v = 0, cookies = {};
    if (document.cookie.match(/^\s*\$Version=(?:"1"|1);\s*(.*)/)) {
      c = RegExp.$1;
      v = 1;
    }
    if (v === 0) {
      map(c.split(/[,;]/), function(cookie) {
        var parts = cookie.split(/=/, 2),
            name = decodeURIComponent(trimLeft(parts[0])),
            value = parts.length > 1 ? decodeURIComponent(trimRight(parts[1])) : null;
        cookies[name] = value;
      });
    } else {
      map(c.match(/(?:^|\s+)([!#$%&'*+\-.0-9A-Z^`a-z|~]+)=([!#$%&'*+\-.0-9A-Z^`a-z|~]*|"(?:[\x20-\x7E\x80\xFF]|\\[\x00-\x7F])*")(?=\s*[,;]|$)/g), function($0, $1) {
        var name = $0, value = $1.charAt(0) === '"' ? $1.substr(1, -1).replace(/\\(.)/g, "$1") : $1;
        cookies[name] = value;
      });
    }
    return cookies;
  }
  
  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }
  
  function inject(func) {
    var script = document.createElement("script"),
        p = (document.body || document.head || document.documentElement);
    if (!p) {
      throw "Could not inject!!!";
    }
    script.setAttribute("type", "text/javascript");
    script.appendChild(document.createTextNode("(" + func + ")(" + buildArgumentList.apply(null, [false].concat(Array.prototype.slice.call(arguments, 1))) + ");"));
    p.appendChild(script);
    p.removeChild(script);
  }
  
  function buildArgumentList(wrap) {
    var list = [];
    var args = Array.prototype.slice.call(arguments, 1);
    
    for (var i = 0, len = args.length; i < len; i++) {
      if (typeof args[i] === "string") {
        list.push("\"" + args[i].replace(/\\/, "\\\\").replace(/"/g, "\\\"") + "\"");
      } else if (typeof args[i] === "object") {
        list.push(JSON.stringify(args[i]));
      } else {
        list.push(args[i]);
      }
    }
    if (wrap) {
      return "(" + list.join(",") + ")";
    } else {
      return list.join(",");
    }
  }
  
  function isJSONString(json) {
    try {
      JSON.parse(json);
    } catch (e) {
      return false;
    }
    return true;
  }
  
  function xhr(details) {
    var xmlhttp;
    if (typeof XMLHttpRequest !== "undefined") {
      xmlhttp = new XMLHttpRequest();
    } else if (typeof opera !== "undefined" && typeof opera.XMLHttpRequest !== "undefined") {
      xmlhttp = new opera.XMLHttpRequest();
    } else {
      if (details["onerror"]) {
        details["onerror"]();
      }
      
      return;
    }
    xmlhttp.onreadystatechange = function(){
      var responseState = {
        responseXML:(xmlhttp.readyState == 4 ? xmlhttp.responseXML : ''),
        responseText:(xmlhttp.readyState == 4 ? xmlhttp.responseText : ''),
        readyState:xmlhttp.readyState,
        responseHeaders:(xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
        status:(xmlhttp.readyState == 4 ? xmlhttp.status : 0),
        statusText:(xmlhttp.readyState == 4 ? xmlhttp.statusText : ''),
        finalUrl:(xmlhttp.readyState == 4 ? xmlhttp.finalUrl : '')
      };
      if (details["onreadystatechange"]) {
        details["onreadystatechange"](responseState);
      }
      if (xmlhttp.readyState == 4) {
        if (details["onload"] && xmlhttp.status >= 200 && xmlhttp.status < 300) {
          details["onload"](responseState);
        }
        if (details["onerror"] && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
          details["onerror"](responseState);
        }
      }
    };
    try {
      xmlhttp.open(details.method, details.url);
    } catch(e) {
      if(details["onerror"]) {
        details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
      }
      return;
    }
    if (details.headers) {
      for (var prop in details.headers) {
        xmlhttp.setRequestHeader(prop, details.headers[prop]);
      }
    }
    xmlhttp.send((typeof(details.data) != 'undefined') ? details.data : null);
  }
  
  // Used for the message module (should probably move to another place)
  // It replaces a property in the obj to a predefined function, where the arguments will be callbackId, target, referer
  function bindFunctionCallbacks(obj, func, target, referer) {
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "obj") {
          bindFunctionCallbacks(obj[key]);
        } else if (typeof obj[key] === "string") {
          if (obj[key].indexOf("@/(message.callback)/") === 0) {
            var callbackId = obj[key].split("@/(message.callback)/")[1];
            obj[key] = bind(null, func, callbackId, target, referer);
          }
        }
      }
    }
  }
  
  function extend(obj, defaults, deep) {
    if (typeof obj !== "object") throw new TypeError("Unsupported type for obj.");
    if (typeof defaults !== "object") throw new TypeError("Unsupported type for defaults.");
    for (var key in defaults) {
      if (defaults.hasOwnProperty(key)) {
        if (typeof obj[key] === "object" && typeof defaults[key] === "object" && deep) {
          extend(obj[key], defaults[key], deep);
        } else if (!obj.hasOwnProperty(key)) {
          obj[key] = defaults[key];
        }
      }
    }
    return obj;
  }
  
  function inArray(key, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === key) {
        return true;
      }
    }
    return false;
  }
  
  function listClasses(el) {
    if (!el || !el.className) return [];
    return el.className.split(" ");
  }
  
  function addClass(el, className) {
    var classes = listClasses(el);
    var addList = className.split(" ");
    
    for (var i = 0, len = addList.length; i < len; i++) {
      if (!inArray(addList[i], classes)) {
        el.className += " " + addList[i];
      }
    }
    return el.className;
  }
  
  function removeClass(el, className) {
    var classes = listClasses(el);
    var removeList = className.split(" ");
    
    var buffer = [];
    for (var i = 0, len = classes.length; i < len; i++) {
      if (!inArray(classes[i], removeList)) {
        buffer.push(classes[i]);
      }
    }
    return el.className = buffer.join(" ");
  }
  
  function hasClass(el, className) {
    return inArray(className, listClasses(el));
  }
  
  function throttle(func, delay, options){
    function timeout() {
      previous = options.leading === false ? 0 : new Date;
      timer = null;
      result = func.apply(context, args);
    }
    var context, args, result, timer = null, previous = 0;
    options = options || {};
    return function(){
      var now = new Date, dt;
      
      context = this;
      args = arguments;
      
      if (!previous && options.leading === false) previous = now;
      dt = delay - (now - previous);
      
      if (dt <= 0) {
        clearTimeout(timer);
        timer = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timer && options.trailing !== false) {
        timer = setTimeout(timeout, dt);
      }
      return result;
    };
  }
  
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  
  function removeDuplicates(arr) {
    var uniqueArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      if (!inArray(uniqueArr, arr[i])) {
        uniqueArr.push(arr[i]);
      }
    }
    
    return uniqueArr;
  }
  
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  
  function toBlob(bytes, contentType) {
    contentType = contentType || "text/plain";
    var sliceSize = 512;
    
    var bytesLength = bytes.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    
    var byteArrays = new Array(slicesCount);
    
    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);
      
      var sliceBytes = new Array(end - begin);
      for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
        sliceBytes[i] = bytes[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(sliceBytes);
    }
    
    return new Blob(byteArrays, { type: contentType });
  }
  
  function createObjectURL(blob) {
    if (support.createObjectURL) {
      if (support.webkitURL) {
        return uw.webkitURL.createObjectURL(blob);
      } else {
        return uw.URL.createObjectURL(blob);
      }
    } else {
      throw "createObjectURL is not supported by the browser!";
    }
  }
  
  function revokeObjectURL(url) {
    if (support.revokeObjectURL) {
      if (support.webkitURL) {
        return uw.webkitURL.revokeObjectURL(url);
      } else {
        return uw.URL.revokeObjectURL(url);
      }
    } else {
      throw "revokeObjectURL is not supported by the browser!";
    }
  }
  
  // Returns a random number between min and max
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Returns a random integer between min (included) and max (excluded)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Returns a random string of characters of chars with the length of length
  function generateToken(chars, length) {
    if (typeof chars !== "string") chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    if (typeof length !== "number") length = 64;
    
    var charsLength = chars.length;
    
    var token = "";
    for (var i = 0; i < length; i++) {
      token += chars[getRandomInt(0, charsLength)];
    }
    
    return token;
  }
  
  return {
    hasClass: hasClass,
    removeClass: removeClass,
    addClass: addClass,
    each: each,
    isArray: isArray,
    inArray: inArray,
    bind: bind,
    asyncCall: asyncCall,
    defineLockedProperty: defineLockedProperty,
    ie: ie,
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    now: now,
    trimLeft: trimLeft,
    trimRight: trimRight,
    map: map,
    setCookie: setCookie,
    getCookie: getCookie,
    getCookies: getCookies,
    endsWith: endsWith,
    inject: inject,
    isJSONString: isJSONString,
    xhr: xhr,
    buildArgumentList: buildArgumentList,
    bindFunctionCallbacks: bindFunctionCallbacks,
    extend: extend,
    throttle: throttle,
    clone: clone,
    removeDuplicates: removeDuplicates,
    escapeRegExp: escapeRegExp,
    toBlob: toBlob,
    createObjectURL: createObjectURL,
    revokeObjectURL: revokeObjectURL,
    generateToken: generateToken
  };
});
define('storage/localStorage',["utils"], function(utils){
  function getItem(key, callback, preferSync) {
    var item = localStorage.getItem(key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  
  return {
    setItem: utils.bind(localStorage, localStorage.setItem),
    getItem: getItem,
    removeItem: utils.bind(localStorage, localStorage.removeItem)
  };
});
define('storage/cookies',["utils"], function(utils){
  function setItem(key, value) {
    utils.setCookie(prefix + key, value, null, "/", 1000*24*60*60*1000);
  }
  
  function getItem(key, callback, preferSync) {
    var item = utils.getCookie(prefix + key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  
  function removeItem(key) {
    utils.setCookie(prefix + key, "", null, "/", 0);
  }
  
  var prefix = "ytcenter.";
  
  return {
    setItem: setItem,
    getItem: getItem,
    removeItem: removeItem
  };
});
define('console',["utils"], function(utils){
  function setEnabled(b) {
    enabled = b;
  }
  
  function log() {
    if (!enabled) return function(){};
    return console.log.bind(console, "userscript[" + sessionToken + "]");
  }
  
  function error() {
    if (!enabled) return function(){};
    return console.error.bind(console, "userscript[" + sessionToken + "]");
  }
  
  function warn() {
    if (!enabled) return function(){};
    return console.warn.bind(console, "userscript[" + sessionToken + "]");
  }
  
  var sessionToken = utils.generateToken(null, 8);
  
  var enabled = true;
  
  var retObj = {};
  utils.defineLockedProperty(retObj, "log", function(){}, log);
  utils.defineLockedProperty(retObj, "error", function(){}, error);
  utils.defineLockedProperty(retObj, "warn", function(){}, warn);
  
  return retObj;
});
define('storage/browser',["support", "storage/localStorage", "storage/cookies", "console"], function(support, localStorage, cookies){
  if (support.localStorage) {
    return localStorage;
  } else {
    return cookies;
  }
});
define('storage/userscript',["support", "storage/browser", "utils"], function(support, browser, utils){
  function setItem(key, value) {
    GM_setValue(key, value);
  }
  
  function getItem(key, callback, preferSync) {
    var item = GM_getValue(key);
    if (preferSync) {
      callback(item);
    } else {
      utils.asyncCall(null, callback, item);
    }
  }
  
  function removeItem(key) {
    GM_deleteValue(key);
  }
  
  if (support.Greasemonkey) {
    return {
      setItem: setItem,
      removeItem: removeItem,
      getItem: getItem
    };
  } else {
    return browser;
  }
});
define('storage',["storage/userscript", "utils"], function(storageHandler, utils){
  function setItem(key, value) {
    cache[key] = value;
    storageHandler.setItem(key, value);
  }
  
  function removeItem(key) {
    delete cache[key];
    storageHandler.removeItem(key);
  }
  
  function getItemCallback(callback, key, value) {
    cache[key] = value;
    callback(cache[key]);
  }
  
  function getItem(key, callback, sync) {
    if (!(key in cache)) {
      storageHandler.getItem(key, utils.bind(null, getItemCallback, callback, key));
    } else {
      if (sync) {
        callback(cache[key]);
      } else {
        utils.asyncCall(null, callback, cache[key]);
      }
    }
  }
  
  var cache = {};
  
  return {
    setItem: setItem,
    removeItem: removeItem,
    getItem: getItem
  };
});
define('UserProxy/utils',[], function(){
  function bind(scope, func) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function(){
      return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
    };
  }
  
  // Iterate through obj with the callback function.
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
  
  function getKeys(obj) {
    var keys = [];
    each(obj, function(key){
      keys.push(key);
    });
    return keys;
  }
  
  // Returns a boolean indicating if object arr is an array.
  function isArray(arr) {
    return Object.prototype.toString.call(arr) === "[object Array]";
  }
  
  // Returns a boolean indicating if the value is in the array.
  function inArray(value, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === value) {
        return true;
      }
    }
    return false;
  }
  
  function indexOfArray(value, arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === value) {
        return i;
      }
    }
    return -1;
  }
  
  function indexOf(value, arr) {
    if (isArray(value, arr)) {
      return indexOfArray(value, arr);
    }
  }
  
  // Returns a random number between min and max
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Returns a random integer between min (included) and max (excluded)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  
  // Returns a random string of characters of chars with the length of length
  function generateToken(chars, length) {
    if (typeof chars !== "string") chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_";
    if (typeof length !== "number") length = 64;
    
    var charsLength = chars.length;
    
    var token = "";
    for (var i = 0; i < length; i++) {
      token += chars[getRandomInt(0, charsLength)];
    }
    
    return token;
  }
  
  function escapeECMAVariable(key, defaultKey) {
    key = key.replace(/[^0-9a-zA-Z_\$]/g, "");
    while (/$[0-9]/g.test(key)) {
      if (key === "") return defaultKey;
      key = key.substring(1);
    }
    return key;
  }
  
  function buildArgumentList(wrap) {
    var list = [];
    var args = Array.prototype.slice.call(arguments, 1);
    
    for (var i = 0, len = args.length; i < len; i++) {
      if (typeof args[i] === "string") {
        list.push("\"" + args[i].replace(/\\/, "\\\\").replace(/"/g, "\\\"") + "\"");
      } else if (typeof args[i] === "object") {
        list.push(JSON.stringify(args[i]));
      } else {
        list.push(args[i]);
      }
    }
    if (wrap) {
      return "(" + list.join(",") + ")";
    } else {
      return list.join(",");
    }
  }
  
  return {
    bind: bind,
    each: each,
    getKeys: getKeys,
    isArray: isArray,
    inArray: inArray,
    indexOf: indexOf,
    indexOfArray: indexOfArray,
    getRandomArbitrary: getRandomArbitrary,
    getRandomInt: getRandomInt,
    generateToken: generateToken,
    escapeECMAVariable: escapeECMAVariable,
    buildArgumentList: buildArgumentList
  };
});
define('UserProxy/CustomEvent',["./utils"], function(utils){
  function addEventListener(event, listener) {
    if (!events[event]) {
      // Creating the array of listeners for event
      events[event] = [];
      
      docListeners[event] = utils.bind(null, eventListener, event, events[event]);
      
      // Adding the event listener.
      window.addEventListener(event, docListeners[event], false);
    }
    
    // Adding listener to array.
    events[event].push(listener);
  }
  
  function removeEventListener(event, listener) {
    if (event in events) {
      for (var i = 0, len = events[event].length; i < len; i++) {
        if (events[event][i] === listener) {
          events[event].splice(i, 1);
          i--; len--;
        }
      }
      if (events[event].length === 0) {
        window.removeEventListener(event, docListeners[event], false);
        
        events[event] = null;
        docListeners[event] = null;
      }
    }
  }
  
  function eventListener(event, listeners, e) {
    e = e || window.event;
    
    // Parse the detail to the original object.
    var data = JSON.parse(e.detail);
    
    if (typeof data.detail === "object" && data.token !== token) {
      var detail = data.detail;
      for (var i = 0, len = listeners.length; i < len; i++) {
        // Call the listener with the event name and the parsed detail.
        listeners[i](detail);
      }
      
      // Prevent propagation
      if (e && typeof e.stopPropagation === "function") {
        e.stopPropagation();
      }
    }
  }
  
  function fireEvent(event, detail) {
    // Creating the event
    var e = document.createEvent("CustomEvent");
    e.initCustomEvent(event, true, true, JSON.stringify({ detail: detail, token: token }));
    
    // Firing the event
    document.documentElement.dispatchEvent(e);
  }
  
  var token = utils.generateToken(); // The token is used to identify itself and prevent calling its own listeners.
  var events = {};
  var docListeners = {};
  
  return {
    addEventListener: addEventListener,
    removeEventListener: removeEventListener,
    fireEvent: fireEvent
  };
});
define('UserProxy/Message',["./utils"], function(utils){
  function addEventListener(event, listener) {
    initMessage(); // Init the message event listener if not already initialized.
    
    if (!events[event]) events[event] = [];
    
    // Bind the event name to the listener as an argument.
    var boundListener = utils.bind(null, listener, event);
    
    // Add the boundListener to the event
    events[event].push(boundListener);
  }
  
  function fireEvent(event, detail) {
    window.postMessage(JSON.stringify({ token: token, event: event, detail: detail }), "*");
  }
  
  function messageListener(e) {
    e = e || window.event;
    
    // Parse the detail to the original object.
    var data = JSON.parse(e.data);
    
    // Verify that the retrieved information is correct and that it didn't call itself.
    if (typeof data.event === "string" && typeof data.detail === "object" && data.token !== token) {
      
      // Iterate through every listener for data.event.
      if (utils.isArray(events[data.event])) {
        var listeners = events[data.event];
        
        var detail = data.detail;
        for (var i = 0, len = listeners.length; i < len; i++) {
          listeners(detail);
        }
    
        // Prevent propagation only if everything went well.
        if (e && typeof e.stopPropagation === "function") {
          e.stopPropagation();
        }
      }
    }
  }
  
  function initMessage() {
    if (!messageEventAdded) {
      // Adding the message event listener.
      window.addEventListener("message", messageListener, false);
    }
  }
  
  var messageEventAdded = false;
  var token = utils.generateToken(); // The token is used to identify itself and prevent calling its own listeners.
  
  var events = {};
  
  return {
    addEventListener: addEventListener,
    fireEvent: fireEvent
  };
});
define('UserProxy/support',[], function(){
  function customEvent() {
    try {
      var e = document.createEvent('CustomEvent');
      if (e && typeof e.initCustomEvent === "function") {
        e.initCustomEvent(mod, true, true, { mod: mod });
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
  
  var mod = "support.test";
  
  return {
    CustomEvent: customEvent
  };
});
define('UserProxy/memFunction',["./utils", "./CustomEvent", "./Message", "./support"], function(utils, customEvent, message, support){
  function parseObject(obj, token, type) {
    if (typeof obj === "object") {
      utils.each(obj, function(key, value){
        if (typeof value === "object") {
          obj[key] = parseObject(value, token, type);
        } else if (typeof value === "string") {
          obj[key] = parseString(value);
        } else if (typeof value === "function") {
          var id = cache.push(value) - 1;
          obj[key] = "${" + token + "/" + type + "/" + id + "}";
        }
      });
    } else if (typeof value === "string") {
      obj = parseString(obj);
    } else if (typeof obj === "function") {
      var id = cache.push(obj) - 1;
      obj = "${" + token + "/" + type + "/" + id + "}";
    }
    return obj;
  }
  
  function parseString(str) {
    if (/^\$[\\]*\{([0-9a-zA-Z\.\-_\/\\]+)\}$/g.test(str)) {
      return "$\\" + str.substring(1);
    }
    return str;
  }
  
  function restoreString(str, token, type) {
    if (/^\$\{([0-9a-zA-Z\.\-_]+)\/([0-9a-zA-Z\.\-_]+)\/([0-9]+)\}$/g.test(str)) {
      var parsed = str.substring(2, str.length - 1).split("/"); // " + token + "/" + type + "/" + id + "
      var id = parseInt(parsed[2], 10);
      if (parsed[0] === token && parsed[1] === type) {
        return cache[id];
      } else {
        return utils.bind(null, functionPlaceholder, parsed[0] + "-" + parsed[1], id);
      }
    } else if (/^\$[\\]+\{([0-9a-zA-Z\.\-_\/\\]+)\}$/g.test(str)) {
      return "$" + str.substring(2);
    }
    return str;
  }
  
  function restoreObject(obj, token, type) {
    if (typeof obj === "object") {
      utils.each(obj, function(key, value){
        if (typeof value === "object") {
          obj[key] = restoreObject(value, token, type);
        } else if (typeof value === "string") {
          obj[key] = restoreString(value, token, type);
        } else if (typeof value === "function") {
          throw Error("Function was found!");
        }
      });
    } else if (typeof value === "string") {
      return restoreString(value, token, type);
    } else if (typeof value === "function") {
      throw Error("Function was found!");
    }
    return obj;
  }
  
  function functionPlaceholder(event, id) {
    var args = Array.prototype.slice.call(arguments, 2);
    if (support.CustomEvent) {
      return customEvent.fireEvent(event, { callbackId: id, args: args, mem: true });
    } else {
      return message.fireEvent(event, { callbackId: id, args: args, mem: true });
    }
  }
  
  function getCacheFunction(id) {
    return cache[id];
  }
  
  var cache = [];
  
  return {
    parseObject: parseObject,
    restoreObject: restoreObject,
    getCacheFunction: getCacheFunction
  };
});
define('UserProxy/Connection',["./CustomEvent", "./Message", "./utils", "./support", "./memFunction"], function(customEvent, message, utils, support, mem){
  function listenerProxy(functions, token, type, detail) {
    setTimeout(utils.bind(null, listener, functions, token, type, detail), 4);
  }
  
  function listener(functions, token, type, detail) {
    var keys = utils.getKeys(functions);
    var index = utils.indexOfArray(detail.method, keys);
    if (index > -1) {
      var result = functions[keys[index]].apply(null, mem.restoreObject(detail.args, token, type));
      if (typeof detail.id === "number") {
        var memResult = mem.parseObject(result, token, type);
        var detail = { callbackId: detail.id, args: [ memResult ] };
        if (support.CustomEvent) {
          customEvent.fireEvent(token + "-page", detail);
        } else {
          message.addEventListener(token + "-page", detail);
        }
      }
    } else {
      throw "Method " + detail.method + " has not been set!";
    }
  }
  
  function Connection(pageProxy) {
    this.token = utils.generateToken();
    this.functions = {};
    this.namespace = "UserProxy";
    this.pageProxy = pageProxy;
  }
  
  Connection.prototype.setFunctions = function setFunctions(functions) {
    this.functions = functions;
  }
  
  Connection.prototype.setNamespace = function setFunctions(namespace) {
    this.namespace = namespace;
  }
  
  Connection.prototype.inject = function inject(code) {
    var parent = (document.body || document.head || document.documentElement);
    if (!parent) throw "Parent was not found!";
    
    var script = document.createElement("script")
    script.setAttribute("type", "text/javascript");

    this.connect();
    
    script.appendChild(document.createTextNode("(" + code + ")(" + utils.buildArgumentList.apply(null, [false, this.token, utils.getKeys(this.functions)].concat(Array.prototype.slice.call(arguments, 1))) + ");"));
    
    parent.appendChild(script);
    parent.removeChild(script);
  }
  
  Connection.prototype.connect = function connect() {
    if (this.establishedConnectionListener) this.disconnect();
    
    this.establishedConnectionListener = utils.bind(null, listenerProxy, this.functions, this.token, "content");
    if (support.CustomEvent) {
      customEvent.addEventListener(this.token + "-content", this.establishedConnectionListener);
    } else {
      message.addEventListener(this.token + "-content", this.establishedConnectionListener);
    }
  }
  
  Connection.prototype.disconnect = function connect() {
    if (!this.establishedConnectionListener) return;
    if (support.CustomEvent) {
      customEvent.removeEventListener(this.token + "-content", this.establishedConnectionListener);
    } else {
      message.removeEventListener(this.token + "-content", this.establishedConnectionListener);
    }
    this.establishedConnectionListener = null;
  }
  
  return Connection;
});
define('extensions-connection/userscript',[], function(){
  function empty() { }
  return {
    setPageConnection: empty
  };
});
define('xhr/browser',[], function(){
  function xhr(details) {
    var xmlhttp;
    if (typeof XMLHttpRequest != "undefined") {
      xmlhttp = new XMLHttpRequest();
    } else {
      details["onerror"](responseState);
    }
    xmlhttp.onreadystatechange = function(){
      var responseState = {
        responseXML: '',
        responseText: (xmlhttp.readyState == 4 ? xmlhttp.responseText : ''),
        readyState: xmlhttp.readyState,
        responseHeaders: (xmlhttp.readyState == 4 ? xmlhttp.getAllResponseHeaders() : ''),
        status: (xmlhttp.readyState == 4 ? xmlhttp.status : 0),
        statusText: (xmlhttp.readyState == 4 ? xmlhttp.statusText : ''),
        finalUrl: (xmlhttp.readyState == 4 ? xmlhttp.finalUrl : '')
      };
      if (details["onreadystatechange"]) {
        details["onreadystatechange"](responseState);
      }
      if (xmlhttp.readyState == 4) {
        if (details["onload"] && xmlhttp.status >= 200 && xmlhttp.status < 300) {
          details["onload"](responseState);
        }
        if (details["onerror"] && (xmlhttp.status < 200 || xmlhttp.status >= 300)) {
          details["onerror"](responseState);
        }
      }
    };
    try {
      xmlhttp.open(details.method, details.url);
    } catch(e) {
      details["onerror"]();
    }
    if (details.headers) {
      for (var prop in details.headers) {
        xmlhttp.setRequestHeader(prop, details.headers[prop]);
      }
    }
    xmlhttp.send((typeof(details.data) !== 'undefined') ? details.data : null);
  }
  
  return xhr;
});
define('xhr/userscript',["support", "xhr/browser"], function(support, browser){
  if (support.Greasemonkey) {
    return GM_xmlhttpRequest;
  } else {
    return browser;
  }
});
define('xhr',["xhr/userscript"], function(xhr){
  return xhr;
});
define('main-wrapper',["storage", "UserProxy/Connection", "extensions-connection/userscript", "xhr"], function(storage, Connection, extension, xhr){
  var functionMap = {
    "setItem": storage.setItem,
    "getItem": storage.getItem,
    "removeItem": storage.removeItem,
    "xhr": xhr
  };
  
  var connection = null;
  
  storage.getItem("YouTubeCenterSettings", function(settings){
    if (typeof settings === "string") settings = JSON.parse(settings || "{}");
    connection = new Connection();
    connection.setFunctions(functionMap);
    
    extension.setPageConnection(connection);
    
    connection.inject(mainPage, settings);
  }, true);
});

require(["main-wrapper"]);
}());})();