var {getFirebugConsole, runAsync, callUnsafeJSObject} = require("utils");
var {getChromeWinForContentWin} = require("getChromeWinForContentWin");

var request = require("request");
var storage = require("storage");

var contentScripts = [];

function unloadContentScript() {
  while (contentScripts.length > 0) {
    try {
      contentScripts[0].unload();
    } catch (e) {
      Cu.reportError(e);
    }
  }
}

unload(unloadContentScript, 0);

function ContentScript(filename, content, wrappedContentWin) {
  this.wrappedContentWin = wrappedContentWin;
  this.chromeWin = getChromeWinForContentWin(wrappedContentWin);
  
  this.unloadBound = this.unload.bind(this);
  
  this.filename = filename;
  this.content = content;
  
  this.events = { };
  
  contentScripts.push(this);
}

/* Static public functions */
ContentScript.isEmbeddedAllowed = function(url) {
  let settings = storage.getItem("YouTubeCenterSettings");
  let embedded = /^http(s)?:\/\/(www\.)?youtube\.com\/embed\//.test(url);
  
  return !(settings && settings.embed_enabled === false && embedded);
}

ContentScript.isRunnable = function(url, whitelist, blacklist) {
  if (!ContentScript.isEmbeddedAllowed(url)) return false;
  
  // Making sure that the url is not in the blacklist.
  for (var i = 0; i < blacklist.length; i++) {
    if (blacklist[i].test(url + "/")) {
      return false;
    }
  }
  
  // Checking if the url is in the whitelist.
  for (var i = 0; i < whitelist.length; i++) {
    if (whitelist[i].test(url + "/")) {
      return true;
    }
  }
  
  return false;
}

/* Public functions */
ContentScript.prototype.on = function(event, listener) {
  if (!(event in this.events)) {
    this.events[event] = [];
  }
  
  var args = Cu.waiveXrays(arguments);
  listener = args[1];
  
  this.events[event].push(listener);
}

ContentScript.prototype.dispatchLocalEvent = function(event) {
  let args = Array.prototype.slice.call(arguments, 1);
  if (event in this.events) {
    for (let i = 0, len = this.events[event].length; i < len; i++) {
      callUnsafeJSObject.apply(null, [this.wrappedContentWin, this.events[event][i]].concat(args));
    }
  }
};

ContentScript.prototype.dispatchEvent = function(event) {
  for (let i = 0, len = contentScripts.length; i < len; i++) {
    if (contentScripts[i] !== this) {
      contentScripts[i].dispatchLocalEvent.apply(contentScripts[i], arguments);
    }
  }
};

ContentScript.prototype.setToken = function(token) {
  this.token = token;
};

ContentScript.prototype.init = function() {
  this.sandbox = new Cu.Sandbox(
    this.wrappedContentWin, {
      "sandboxName": "YouTube Center",
      "sandboxPrototype": this.wrappedContentWin,
      "wantXrays": true
    }
  );
  
  this.firebugConsole = getFirebugConsole(this.wrappedContentWin, this.chromeWin);
  if (this.firebugConsole) {
    this.sandbox.console = this.firebugConsole;
  }
  
  this.sandbox.unsafeWindow = this.wrappedContentWin.wrappedJSObject;
  
  this.port = {
    __exposedProps__: {
      on: "r",
      dispatchEvent: "r",
      dispatchLocalEvent: "r",
      storage: "r",
      request: "r",
      setToken: "r"
    }
  };
  
  // Event listeners
  this.port.on = this.on.bind(this);
  this.port.dispatchEvent = this.dispatchEvent.bind(this);
  this.port.dispatchLocalEvent = this.dispatchLocalEvent.bind(this);
  this.port.setToken = this.setToken.bind(this);
  
  // Add storage object to sandbox
  this.storage = {
    __exposedProps__: {
      setItem: "r",
      getItem: "r",
      removeItem: "r"
    }
  };
  
  this.storage.setItem = storage.setItem.bind(this);
  this.storage.getItem = storage.getItem.bind(this);
  this.storage.removeItem = storage.removeItem.bind(this);
  
  this.port.storage = this.storage;
  
  // Add request object to sandbox
  this.request = request.bind(this, this.wrappedContentWin, this.chromeWin);
  this.port.request = this.request;
  
  // Add the port object to the content script
  this.sandbox.port = this.port;
}

ContentScript.prototype.run = function() {
  // Add an unload event listener to the window.
  this.wrappedContentWin.addEventListener("unload", this.unloadBound, false);
  
  // Run the content script in the page.
  this.runtime = Cu.evalInSandbox(this.content, this.sandbox, "ECMAv5", this.filename, 0);
}

ContentScript.prototype.unload = function() {
  // Remove reference from contentScripts
  for (let i = 0, len = contentScripts.length; i < len; i++) {
    if (contentScripts[i] === this) {
      contentScripts.splice(i, 1);
      i--; len--;
    }
  }
  
  // Remove the event listener
  this.wrappedContentWin.removeEventListener("unload", this.unloadBound, false);
  this.unloadBound = null;
  
  // Execute every listener attached by the content script
  this.dispatchLocalEvent("unload"); // This is ran async
  
  // Nuke the sandbox
  runAsync(this, function() {
    if ("nukeSandbox" in Cu) {
      Cu.nukeSandbox(this.sandbox);
    } else {
      for (let key in this.sandbox) {
        this.sandbox[key] = null;
      }
    }
  
    for (let key in this) {
      this[key] = null;
    }
  });
}

exports = ContentScript;