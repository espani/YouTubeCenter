define(["unsafeWindow", "utils"], function(unsafeWindow, utils){
  // Get the YouTube page type: watch, channel, embed, ...
  function getPage() {
    var domain = getDomain();
    var path = getPath();
    
    if (utils.endsWith(domain, "youtube.com")) {
      if (path.indexOf("/watch?") === 0) {
        return "watch";
      } else if (path === "/" || path === "/feed/what_to_watch") {
        return "feed_what_to_watch";
      } else if (path.indexOf("/embed/") === 0 || path.indexOf("/watch_popup?") === 0) {
        return "embed";
      } else if (path.indexOf("/results") === 0) {
        return "search";
      }
    } else if (utils.endsWith(domain, "api.google.com") || utils.endsWith(domain, "plus.googleapis.com")) {
      if (path.indexOf("/widget/render/comments?") !== -1) {
        return "comments";
      }
    }
    return "unknown";
  }
  
  // Get the url domain: www.example.com
  function getDomain() {
    var loc = getLocation();
    if (loc.hostname) {
      return loc.hostname;
    } else {
      return /^.*?:\/\/(.*?)\/.*$/.exec(loc.href)[1];
    }
  }
  
  // Get the url path: /example/path
  function getPath() {
    var loc = getLocation();
    if (loc.pathname) {
      return loc.pathname;
    } else {
      return /^.*?:\/\/.*?(\/.*)$/.exec(loc.href)[1];
    }
  }
  
  // Get the url path: /example/path
  function getProtocol() {
    var loc = getLocation();
    if (loc.protocol) {
      return loc.protocol;
    } else {
      return /^(.*?:)\/\//.exec(loc.href)[1];
    }
  }
  
  // Get the location object provided by the window object.
  function getLocation() {
    return location || window.location || unsafeWindow.location;
  }
  
  return {
    location: getLocation(),
    getProtocol: getProtocol,
    getDomain: getDomain,
    getPath: getPath,
    getPage: getPage,
    page: getPage()
  };
});