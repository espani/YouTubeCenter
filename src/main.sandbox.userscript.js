function handleXHR(data) {
  var callbackId = data.callbackId;
  var args = [];
  
  var details = data.args[0];
  
  if (support.Greasemonkey) {
    GM_xmlhttpRequest(details);
  } else {
    xhr(details);
  }
}

function handleStorageSetValue(data) {
  var callbackId = data.callbackId;
  var key = data.args[0];
  var value = data.args[1];
  
  if (support.Greasemonkey) {
    GM_setValue(key, value);
  } else {
    
  }
  
  sendMessage({
    target: ${MESSAGE.TARGET.PAGE},
    referer: ${MESSAGE.TARGET.SANDBOX},
    type: "callback",
    args: [callbackId]
  });
}

function handleStorageGetValue(data) {
  var callbackId = data.callbackId;
  var key = data.args[0];
  var value = null;
  
  if (support.Greasemonkey) {
    value = GM_getValue(key);
  } else {
    
  }
  
  sendMessage({
    target: ${MESSAGE.TARGET.PAGE},
    referer: ${MESSAGE.TARGET.SANDBOX},
    type: "callback",
    args: [callbackId, key, value]
  });
}

function handleStorageRemoveValue(data) {
  var callbackId = data.callbackId;
  var key = data.args[0];
  
  if (support.Greasemonkey) {
    value = GM_deleteValue(key);
  } else {
    
  }
  
  sendMessage({
    target: ${MESSAGE.TARGET.PAGE},
    referer: ${MESSAGE.TARGET.SANDBOX},
    type: "callback",
    args: [callbackId, key]
  });
}