const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

const {Services} = Cu.import("resource://gre/modules/Services.jsm", null);

var addonData = null;
var filename = "chrome://ytcenter/content/content-script.min.js";

var modules = {}; // The loaded modules
var unloadListeners = []; // The unload listeners which will be called when the add-on needs to be unloaded (uninstall, reinstall, shutdown).

/* Add an unload listener to the queue
 * Optional: index - insert listener into queue at index
 */
function unload(listener, index) {
  if (typeof index === "number") {
    unloadListeners.splice(index, 0, listener);
  } else {
    unloadListeners.push(listener);
  }
}

function nukeSandbox(module) {
  if ("nukeSandbox" in Cu) {
    Cu.nukeSandbox(module);
  } else {
    for (let key in module) {
      module[key] = null;
    }
  }
}

/* Load a file */
function loadFile(scriptName, onload) {
  let request = Cc["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Ci.nsIXMLHttpRequest);
  request.open("GET", scriptName, true);
  request.overrideMimeType("text/plain");
  request.onload = onload;
  
  request.send(null);
}

/* Require a library file (like CommonJS) */
function require(module) {
  if (!(module in modules)) {
    let principal = Components.classes["@mozilla.org/systemprincipal;1"].getService(Components.interfaces.nsIPrincipal);
    let url = addonData.resourceURI.spec + "lib/" + module + ".js";
    modules[module] = Components.utils.Sandbox(principal, {
      sandboxName: url,
      sandboxPrototype: {
        require: require,
        exports: {},
        Cc: Cc,
        Ci: Ci,
        Cr: Cr,
        Cu: Cu,
        unload: unload
      },
      wantXrays: false
    });
    Services.scriptloader.loadSubScript(url, modules[module]);
  }
  return modules[module].exports;
}

/* Initialize YouTube Center */
function init() {
  loadFile(filename, function initPolicy(e) {
    let content = e.target.responseText;
    
    let PolicyImplementation = require("PolicyImplementation");
    
    let policy = new PolicyImplementation(
      [ /^http(s)?:\/\/(www\.)?youtube\.com\//, /^http(s)?:\/\/((apis\.google\.com)|(plus\.googleapis\.com))\/([0-9a-zA-Z-_\/]+)\/widget\/render\/comments\?/ ],
      [ ],
      filename,
      content
    );
    policy.init();
  });
}

/* On add-on startup */
function startup(data, reason) {
  addonData = data;
  
  Services.tm.currentThread.dispatch(function(){
    init();
  }, Ci.nsIEventTarget.DISPATCH_NORMAL);
}

/* On add-on shutdown */
function shutdown(data, reason) {
  if (reason == APP_SHUTDOWN)
    return;
  
  /* Call the unload listeners and remove them afterwards */
  for (let i = 0; i < unloadListeners.length; i++) {
    try { unloadListeners[i](); } catch (e) { }
  }
  unloadListeners = null; // Remove references to the unload listeners
  
  let utils = require("utils");
  
  /* Only nuke the modules after everything else */
  utils.runAsync(this, function(){
    /* Remove all the loaded modules and their exported variables */
    for (let key in modules) {
      nukeSandbox(modules[key]);
    }
    
    modules = null; // Remove all references to the module
  });
}

/* On add-on install */
function install(data, reason) { }

/* On add-on uninstall */
function uninstall(data, reason) { }