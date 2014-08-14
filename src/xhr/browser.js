define([], function(){
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