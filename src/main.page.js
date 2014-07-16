require.config({
  waitSeconds: 0
});

define(["windowReadyEvent", "player/listeners", "console", "player/size"], function(windowReadyEvent, playerListener, con, size){
  playerListener.setOverride("onStateChange", true);
  playerListener.addEventListener("onStateChange", function(state){
    con.log("State has been changed to " + state + ".");
  });
});