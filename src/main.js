require.config({
  waitSeconds: 0
});

define(["windowReadyEvent", "player/listeners", "console"], function(windowReadyEvent, playerListener, con){
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
  
});

// Let's run this
require(["main"], function(){ });