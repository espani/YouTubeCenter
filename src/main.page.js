require.config({
  waitSeconds: 0
});

define(["windowReadyEvent", "player/listeners", "console", "storage", "unsafeWindow", "player/onYouTubePlayerReady", "player/config"], function(windowReadyEvent, playerListener, con, storage, unsafeWindow, onReady, config){
  onReady.addListener(function(api){
    con.log("Player is ready", api);
  });
  con.log("YouTube Center settings", storage.getItem("${storage.settings}"));
  playerListener.setOverride("onStateChange", true);
  playerListener.addEventListener("onStateChange", function(state){
    con.log("State has been changed to " + state + ".");
  });
});