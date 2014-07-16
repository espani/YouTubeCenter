// TODO  Add easy function calling.
define(["utils", "support", "storage", "url", "console"], function(utils, support, storage, url, con){
  function sendMessage(data) {
    data.referer = referer_;
    if (typeof data.originalReferer !== "number") data.originalReferer = referer_;
    if (data.target === ${MESSAGE.TARGET.PAGE} || data.target === ${MESSAGE.TARGET.SANDBOX} || (referer_ === ${MESSAGE.TARGET.PAGE} && data.target === ${MESSAGE.TARGET.ADDON})) {
      window.postMessage(JSON.stringify(data), url.getProtocol() + "//" + document.domain);
    } else if (data.target === ${MESSAGE.TARGET.ADDON}) {
      // Specific addon function
      throw "Not implemented yet!";
    }
  }

  function isOriginAllowed(origin) {
    if (origin.indexOf("://") !== -1) {
      var originParts = origin.split("://");
      
      var protocol = originParts[0];
      var domain = originParts[1];
      
      if (protocols.indexOf(protocol) === -1) return false;
      if (domains.indexOf(domain) === -1) return false;
      
      return true;
    }
    return false;
  }
  function callbackFunction(callbackId, target, referer) {
    sendMessage({
      target: target,
      type: "callback",
      args: [callbackId].concat(Array.prototype.slice.call(arguments, 3))
    });
  }

  function handleCommand(data) {
    var callbackId = parseInt(data.callbackId || "-1", 10);
    var args = [];
    
    switch(data.type) {
      case "callback":
        con.log(data);
        throw "Not implemented yet!";
        break;
      case "xhr":
        var details = data.args[0];
        bindFunctionCallbacks(details, callbackFunction, ${MESSAGE.TARGET.PAGE}, ${MESSAGE.TARGET.SANDBOX});
        
        if (support.Greasemonkey) {
          GM_xmlhttpRequest(details);
        } else {
          utils.xhr(details);
        }
        break;
      case "storage.setItem":
        var key = data.args[0];
        var value = data.args[1];
        storage.setItem(key, value);
        
        args.push(key);
        break;
      case "storage.getItem":
        var value = storage.getItem(data.args[0]);
        
        args.push(data.args[0]);
        args.push(value);
        break;
      case "storage.removeItem":
        storage.removeItem(data.args[0], data.args[1]);
        
        args.push(data.args[0]);
        break;
    }
    
    if (callbackId > -1) {
      sendMessage({
        target: data.originalReferer,
        type: "callback",
        args: [callbackId].concat(args)
      });
    }
  }

  function handleIncomingMessages(e) {
    e = e || window.event;
    if (!isOriginAllowed(e.origin)) return;
    
    var data;
    
    if (utils.isJSONString(e.data)) {
      data = JSON.parse(e.data);
      if (data.referer !== referer_ && typeof data.type === "string") {
        if (data.target !== referer_) {
          // Resend this message to the page or the addon.
          data.referer = referer_;
          sendMessage(data);
        } else {
          // Correct target.
          handleCommand(data)
        }
      }
    }
  }
  
  function init(ref, prot, dom) {
    referer_ = ref;
    protocols = prot;
    domains = dom;

    // Init the message listeners
    window.addEventListener("message", handleIncomingMessages, false);
  }
  
  var referer_ = -1;
  
  var callbackListeners = [];

  var protocols = [];
  var domains = [];
  
  return {
    init: init,
    sendMessage: sendMessage
  };
});