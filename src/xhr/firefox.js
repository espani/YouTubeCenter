define(["../helper/support", "xhr/browser"], function(support, browser){
  if (support.firefoxPort) {
    return port.request;
  } else {
    return browser;
  }
});