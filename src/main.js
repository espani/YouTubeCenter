require.config({
  waitSeconds: 0
});

define(["windowReadyEvent", "player/listeners", "console", "storage", "unsafeWindow"], function(windowReadyEvent, playerListener, con, storage, unsafeWindow){
  windowReadyEvent.addEventListener("uninitialized", function(){
    con.log("[Window] At event uninitialized.");
  });
  windowReadyEvent.addEventListener("loading", function(){
    con.log("[Window] At event loading.");
  });
  windowReadyEvent.addEventListener("interactive", function(){
    con.log("[Window] At event interactive.");
  });
  windowReadyEvent.addEventListener("complete", function(){
    con.log("[Window] At event complete.");
  });
  playerListener.init();
  playerListener.setOverride("onStateChange", true);
  playerListener.addEventListener("onStateChange", function(){
    con.log("State has been changed!!!!");
  });
});