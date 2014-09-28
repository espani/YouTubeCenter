define(["exports", "../utils", "../player/listeners", "../player/player", "../element-placement/watch8-ytcenter-buttons", "../css"], function(exports, utils, listener, player, group, css){
  function createButton() {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("role", "button");
    btn.setAttribute("onclick", ";return false;");
    btn.setAttribute("title", "Toggle repeat");
    btn.setAttribute("data-tooltip-text", "Toggle repeat");
    btn.className = "yt-uix-button yt-uix-tooltip yt-uix-button-opacity";
    
    var text = document.createElement("span");
    text.className = "yt-uix-button-content";
    text.textContent = "Repeat";
    
    btn.appendChild(text);
    
    btn.addEventListener("click", toggleRepeat, false);
    return btn;
  }
  
  function toggleRepeat(e) {
    repeat = !repeat;
    
    if (repeat) {
      utils.removeClass(repeatButton, "yt-uix-button-opacity");
      utils.addClass(repeatButton, "ytcenter-uix-button-toggled");
    } else {
      utils.addClass(repeatButton, "yt-uix-button-opacity");
      utils.removeClass(repeatButton, "ytcenter-uix-button-toggled");
    }
  }
  
  function onStateChange(state) {
    if (state === 0 && repeat) {
      player.api.playVideo();
    }
  }
  
  function getButton() {
    return repeatButton;
  }
  
  var repeat = false;
  var repeatButton = createButton();
  
  group.addElement("/*should probably have a guid here*/", repeatButton);
  
  listener.addEventListener("onStateChange", onStateChange);
  
  css.setEnabled("yt-uix", true);
  
  exports.getButton = getButton;
  
  return exports;
});