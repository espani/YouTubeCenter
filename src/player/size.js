define(["player/listeners", "player/player", "window", "utils"], function(listeners, player, win, utils){
  function onPlayerSizeChange(large) {
    if (large) {
      setSize(largeSize);
    } else {
      setSize(smallSize);
    }
    update();
  }
  
  function setSize(nSize) {
    size = nSize;
    update();
  }
  
  function update() {
    var playerEl = document.getElementById("player");
    var playerAPIEl = document.getElementById("player-api");
    var playerTheaterBackgroundEl = document.getElementById("theater-background");
    
    utils.removeClass(playerEl, "watch-small watch-medium watch-large");
    if (size.large) {
      utils.addClass(playerEl, "watch-large");
    } else {
      utils.addClass(playerEl, "watch-small");
    }
    
    var dim = getPlayerDimension();
    if (size.large) {
      playerEl.style.width = dim.width + "px";
    } else {
      playerEl.style.width = "auto";
    }
    playerTheaterBackgroundEl.style.height = dim.height + "px";
    
    playerAPIEl.style.width = dim.width + "px";
    playerAPIEl.style.height = dim.height + "px";
    
    var contentContainerEl = document.getElementById("watch7-container");
    if (size.large) {
      utils.addClass(contentContainerEl, "watch-wide");
    } else {
      utils.removeClass(contentContainerEl, "watch-wide");
    }
    
    var sidebarEl = document.getElementById("watch7-sidebar");
    if (size.large) {
      sidebarEl.style.top = "";
    } else {
      sidebarEl.style.top = "-" + dim.height + "px";
    }
  }
  
  function getPlayerDimension() {
    var playerEl = document.getElementById("player");
    
    var width = null;
    var height = null;
    
    if (typeof size.width === "number") {
      if (size.widthUnit === "%") {
        width = size.width/100*win.getClientWidth();
      } else {
        width = size.width;
      }
    }
    
    if (typeof size.width === "number") {
      if (size.heightUnit === "%") {
        height = size.height/100*win.getClientHeight();
        // if (something.isTopBar())
        height -= 50;
      } else {
        height = size.height;
      }
    }
    
    var ratio = getRatio();
    
    if (typeof width !== "number") {
      if (typeof height === "number") {
        width = height*ratio;
      } else {
        width = getDefaultWidth();
      }
    }
    
    if (typeof height !== "number") {
      if (typeof width === "number") {
        height = width/ratio;
      } else {
        height = getDefaultHeight();
      }
    }
    
    // Controlbar + Progressbar height
    var controlbarHeight = player.getControlbarHeight();
    height += controlbarHeight;
    
    // Multi camera additional height
    if (utils.hasClass(playerEl, "watch-multicamera") && player.getType === "flash") {
      height += 80;
    }
    
    return {
      width: Math.floor(width),
      height: Math.floor(height)
    };
  }
  
  function setSmallPlayerSize(small) {
    smallSize = small;
  }
  
  function setLargePlayerSize(large) {
    largeSize = large;
  }
  
  function getRatio() {
    return 16/9;
  }
  
  function getDefaultWidth() {
    return 640;
  }
  
  function getDefaultHeight() {
    return getDefaultWidth()/getRatio();
  }
  
  var smallSize = {
    width: 640,
    widthUnit: "px",
    large: false
  };
  var largeSize = {
    width: 1280,
    widthUnit: "px",
    large: true
  };
  
  var size = {
    width: 1280,
    height: 720,
    widthUnit: "px",
    heightUnit: "px",
    large: true
  };
  
  listeners.setOverride("SIZE_CLICKED", true);
  listeners.addEventListener("SIZE_CLICKED", onPlayerSizeChange);
  
  win.addEventListener("resize", utils.throttle(update, 100));
  
  return {
    setSize: setSize,
    getRatio: getRatio
  };
});