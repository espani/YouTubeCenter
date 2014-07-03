require.config({
  waitSeconds: 0
});

define(["windowReadyEvent", "player/listeners", "console", "settings", "unsafeWindow", "player/onYouTubePlayerReady", "player/config", "unsafeYouTubeCenter"],
        function(windowReadyEvent, playerListener, con, settings, unsafeWindow, onReady, config, unsafeYouTubeCenter){
  onReady.addListener(function(api){
    con.log("Player is ready", api);
  });
  con.log("YouTube Center settings", settings.getOptions());
  playerListener.setOverride("onStateChange", true);
  playerListener.addEventListener("onStateChange", function(state){
    con.log("State has been changed to " + state + ".");
  });
  unsafeYouTubeCenter.settings = settings;
});