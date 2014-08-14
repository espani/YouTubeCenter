Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

var ContentScript = require("ContentScript");

function PolicyImplementation(whitelist, blacklist, filename, content) {
  this.whitelist = whitelist;
  this.blacklist = blacklist;
  
  this.filename = filename;
  this.content = content;
  
  this.classDescription = "YouTube Center Policy Implementation";
  this.classID = Components.ID("{338b51a4-0709-4971-ac89-18e82be90a93}");
  this.contractID = "${@ytcenter/ytcenter-policy-service;1}";
  this.xpcom_categories = ["content-policy"];
}

PolicyImplementation.prototype.init = function(){
  let registrar = Components.manager.QueryInterface(Ci.nsIComponentRegistrar);
  registrar.registerFactory(this.classID, this.classDescription, this.contractID, this);
  
  let catMan = Cc['@mozilla.org/categorymanager;1'].getService(Ci.nsICategoryManager);
  for each (let category in this.xpcom_categories)
    catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);

  Services.obs.addObserver(this, "document-element-inserted", true);
  Services.obs.addObserver(this, "xpcom-category-entry-removed", true);
  Services.obs.addObserver(this, "xpcom-category-cleared", true);
  unload(function(){
    Services.obs.removeObserver(this, "document-element-inserted");
    Services.obs.removeObserver(this, "xpcom-category-entry-removed");
    Services.obs.removeObserver(this, "xpcom-category-cleared");

    let catMan = Cc['@mozilla.org/categorymanager;1'].getService(Ci.nsICategoryManager);
    for each (let category in this.xpcom_categories)
      catMan.deleteCategoryEntry(category, this.contractID, false);
    
    Services.tm.currentThread.dispatch(function(){
      registrar.unregisterFactory(this.classID, this);
    }.bind(this), Ci.nsIEventTarget.DISPATCH_NORMAL);
    
  }.bind(this));
};

PolicyImplementation.prototype.QueryInterface = XPCOMUtils.generateQI([Ci.nsIObserver, Ci.nsISupports, Ci.nsISupportsWeakReference, Ci.nsIWindowMediatorListener, Ci.nsIContentPolicy]);
PolicyImplementation.prototype.shouldLoad = function(contentType, contentLocation, requestOrigin, node, mimeTypeGuess, extra) {
  return Ci.nsIContentPolicy.ACCEPT;
};
PolicyImplementation.prototype.shouldProcess = function(contentType, contentLocation, requestOrigin, insecNode, mimeType, extra) {
  return Ci.nsIContentPolicy.ACCEPT;
};

PolicyImplementation.prototype.observe = function(subject, topic, data, additional) {
  switch (topic) {
    case "document-element-inserted":
      let doc = subject;
      let win = doc && doc.defaultView;
      if (!doc || !doc.location || !win) break;
      
      let url = doc.location.href;
      if (ContentScript.isRunnable(url, this.whitelist, this.blacklist)) {
        let script = new ContentScript(this.filename, this.content, win);
        
        script.init();
        script.run();
      }
      break;
    case "xpcom-category-entry-removed":
    case "xpcom-category-cleared": {
      let category = data;
      if (this.xpcom_categories.indexOf(category) < 0)
        return;
      if (topic == "xpcom-category-entry-removed" && subject instanceof Ci.nsISupportsCString && subject.data != this.contractID)
        return;
      let catMan = categoryManager;
      catMan.addCategoryEntry(category, this.contractID, this.contractID, false, true);
      break;
    }
  }
};
PolicyImplementation.prototype.createInstance = function(outer, iid) {
  if (outer)
    throw Cr.NS_ERROR_NO_AGGREGATION;
  return this.QueryInterface(iid);
};

exports = PolicyImplementation;