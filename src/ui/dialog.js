define(["ui/overlay", "utils", "language"], function(overlay, utils, language){
  // options.title = locale ID || null;
  // options.content = HTMLELement;
  // options.footer = HTMLELement;
  // options.position = { top, bottom, left, right } || null;
  function createElement(options) {
    var overlay = overlay.createElement(); // The overlay
    
    var dialog = document.createElement("div"); // The dialog container
    dialog.className = "ytcenter-dialog";
    
    var base = document.createElement("div"); // The base of the dialog
    base.className = "ytcenter-dialog-base";
    
    var foreground = document.createElement("div");
    foreground.className = "ytcenter-dialog-fg";
    
    var foregroundContent = document.createElement("div");
    foregroundContent.className = "ytcenter-dialog-fg-content ytcenter-dialog-show-content";
    
    foreground.appendChild(foregroundContent);
    
    // Init the position of the dialog
    var top = null;
    var bottom = null;
    var left = null;
    var right = null;
    
    if (typeof options.position === "object") {
      if (typeof options.position.top === "number") {
        top = options.position.top;
      }
      if (typeof options.position.bottom === "number") {
        bottom = options.position.bottom;
      }
      if (typeof options.position.left === "number") {
        left = options.position.left;
      }
      if (typeof options.position.right === "number") {
        right = options.position.right;
      }
    }
    
    if (typeof top !== "number" && typeof bottom !== "number") {
      // Center the dialog vertically.
      var align = document.createElement("span");
      align.className = "ytcenter-dialog-align";
      base.appendChild(align);
    } else {
      if (typeof top === "number") {
        foreground.style.setProperty("margin-top", top + "px");
      }
      if (typeof bottom === "number") {
        foreground.style.setProperty("margin-bottom", bottom + "px");
      }
    }
    
    if (typeof left !== "number" && typeof right !== "number") {
      // Center the dialog horizontally
      base.style.setProperty("text-align", "center");
    } else {
      if (typeof left === "number") {
        foreground.style.setProperty("margin-left", left + "px");
        base.style.setProperty("text-align", "left");
      }
      if (typeof right === "number") {
        foreground.style.setProperty("margin-right", right + "px");
        base.style.setProperty("text-align", "right");
      }
    }
    
    base.appendChild(foreground);
    dialog.appendChild(base);
    
    // Dialog header
    var header = document.createElement("div");
    header.className = "ytcenter-dialog-header";
    
    if (typeof options.title === "string" && options.title !== "") {
      var title = document.createElement("h2");
      title.className = "ytcenter-dialog-title";
      title.appendChild(language.createTextNode(options.title));
      
      header.appendChild(title);
    }
    
    foregroundContent.appendChild(header);
    
    // Dialog content
    if (typeof options.content !== "undefined") {
      var content = document.createElement("div");
      content.className = "ytcenter-dialog-content";
      content.appendChild(options.content);
      foregroundContent.appendChild(content);
    }
    
    // Dialog footer
    footer = document.createElement("div");
    footer.className = "ytcenter-dialog-footer";
    if (typeof options.footer !== "undefined") {
      footer.appendChild(options.footer);
    }
    foregroundContent.appendChild(footer);
    
    return dialog;
  }
  
  function setVisibility(dialog, visible) {
    if (visible) {
      if (!dialog.parentNode) {
        document.body.appendChild(dialog);
      }
      if (!overlay.parentNode) {
        document.body.appendChild(overlay);
      }
      utils.addClass(document.body, "ytcenter-dialog-active");
    } else {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      utils.removeClass(document.body, "ytcenter-dialog-active");
    }
  }
  
  var overlay = overlay.createElement();
  
  
  return {
    createElement: createElement,
    setVisibility: setVisibility
  };
});