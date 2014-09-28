define(["../helper/support", "./browser"], function(support, browser){
  if (support.Greasemonkey) {
    return GM_xmlhttpRequest;
  } else {
    return browser;
  }
});