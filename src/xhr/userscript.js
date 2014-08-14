define(["support", "xhr/browser"], function(support, browser){
  if (support.Greasemonkey) {
    return GM_xmlhttpRequest;
  } else {
    return browser;
  }
});