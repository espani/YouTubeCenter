define(["exports", "./utils"], function(exports, utils){
  function getTargetedGroup(x, y, groups) {
    var distance = null;
    var heightGroup = null;
    
    for (var i = 0, len = groups.length; i < len; i++) {
      // Group element
      var group = groups[i];
      
      // Getting the absolute position of the group element
      var absolutePosition = utils.getAbsolutePosition(group);
      
      /*
      * The points on the rectangle, which represents the group element.
      * px is 1 and 2,
      * py is 1 and 3,
      * pWidth is 2 and 4,
      * pHeight is 3 and 4
      * 1------------2
      * |            |
      * |            |
      * 3------------4
      */
      var px = absolutePosition.left;
      var py = absolutePosition.top;
      var pWidth = absolutePosition.left + group.offsetWidth;
      var pHeight = absolutePosition.top + group.offsetHeight;
      
      // Detecting if the (x, y) point is inside or touches the group element (rectangle)
      if (x >= px && x <= pWidth && y >= py && y <= pHeight) {
        return group;
      } else if (y >= py && y <= pHeight) {
        var tmpDist = null;
        if (x < px) {
          // Left side
          tmpDist = px - x;
        } else if (x > pWidth) {
          // Right side
          tmpDist = x - pWidth;
        } else {
          continue; // This should never happen.
        }
        if (distance === null || tmpDist < distance) {
          heightGroup = group;
          distance = tmpDist;
        }
      }
    }
    
    return heightGroup;
  }
  
  function getRelativeGroupChild(x, y, group) {
    // The cursor is inside a group element.
    if (group !== null) {
      var groupChildren = group.children;
      
      // Iterate through every child of group
      for (var i = 0, len = groupChildren.length; i < len; i++) {
        var child = groupChildren[i];
        // Making sure that an element is not placed beside itself.
        if (child !== refMoveableElement && child !== refTargetedElement) {
          // Get the child's absolute position on the page
          var absolutePosition = utils.getAbsolutePosition(child);
          
          // The for loop iterates through the children chronological, which means that
          // it only needs to look if the x-value of the cursor is before half of the
          // child element.
          if (x <= child.offsetWidth/2 + absolutePosition.left && y <= child.offsetHeight + absolutePosition.top) {
            return child;
          }
        }
      }
    }
    
    // No child was found, return null
    return null;
  }
  
  function mousemoveListener(e) {
    if (!mousedown || !moduleEnabled) return;
    e = e || window.event;
    
    // If user is using touch, make sure that it detects the touch instead of mouse.
    if (e && e.type.indexOf("touch") !== -1 && e.changedTouches && e.changedTouches.length > 0 && e.changedTouches[0]) {
      e = e.changedTouches[0];
    }
    
    // The (x, y) coordinate of the mouse cursor on the page
    var x = e.pageX;
    var y = e.pageY;
    
    // Update the moveable element position
    refMoveableElement.style.top = (y - (relativeMousePosition.y || 0)) + "px";
    refMoveableElement.style.left = (x - (relativeMousePosition.x || 0)) + "px";
    
    // Get the targeted group with the (x, y) coordinate of the cursor
    var group = getTargetedGroup(x, y, groupElements);
    
    if (group) {
      // Get the relative group child element
      var child = getRelativeGroupChild(x, y, group);
      
      // Make sure that targeted element does have a parent to remove
      // the element from
      if (refTargetedElement.parentNode) {
        refTargetedElement.parentNode.removeChild(refTargetedElement);
      }
      
      if (child) {
        // A child was found insert the targeted element before said child
        group.insertBefore(refTargetedElement, child);
      } else {
        // A child was not found just append the element to the group
        group.appendChild(refTargetedElement);
      }
    }
    
    // Prevent default action
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
    }
    return false;
  }
  
  function mousedownListener(e) {
    if (mousedown || !moduleEnabled) return;
    
    e = e || window.event;
    
    var targetedElement = e.target;
    while (targetedElement) {
      if (!targetedElement.parentNode) return; // Targeted element not in a container
      
      // Is the targeted element a child of groupElements
      // and if so then we break out of this loop
      if (utils.inArray(groupElements, targetedElement.parentNode)) {
        break;
      }
      
      // The desired element is a child to one of the containers.
      targetedElement = targetedElement.parentNode;
    }
    
    mousedown = true;
    
    // Relative position to targeted element
    var absolutePosition = utils.getAbsolutePosition(targetedElement);
    relativeMousePosition = {
      x: e.pageX - absolutePosition.left,
      y: e.pageY - absolutePosition.top
    };
    
    // Create the moveable element
    var moveableElement = createMoveableElement(targetedElement);
    
    // Make the targeted element invisible
    utils.addClass(targetedElement, "placementsystem-target");
    //targetedElement.style.visibility = "hidden";
    
    // Store two references for later use
    refMoveableElement = moveableElement;
    refTargetedElement = targetedElement;
    
    document.body.appendChild(moveableElement);
    
    // Add mouseup, mousemove, touchend and touchmove event listener
    utils.addEventListener(document, "mousemove", mousemoveListener, false);
    utils.addEventListener(document, "touchmove", mousemoveListener, false);
    
    // Prevent default action
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
    }
    return false;
  }
  
  function mouseupListener(e) {
    if (!mousedown || !moduleEnabled || !refTargetedElement) return;
    mousedown = false;
    
    e = e || window.event;
    
    // Make the targeted element visible
    utils.removeClass(refTargetedElement, "placementsystem-target");
    //refTargetedElement.style.visibility = "";
    
    // Remove the moveable element from the DOM
    refMoveableElement.parentNode.removeChild(refMoveableElement);
    
    // Remove relative mouse position
    relativeMousePosition = null;
    
    // Remove stored references
    refMoveableElement = null;
    refTargetedElement = null;
    
    // Remove mousemove and touchmove event listener
    utils.removeEventListener(document, "mousemove", mousemoveListener, false);
    utils.removeEventListener(document, "touchmove", mousemoveListener, false);
    
    // Prevent default action
    if (e && e.preventDefault) {
      e.preventDefault();
    } else {
      window.event.returnValue = false;
    }
    return false;
  }
  
  function setGroupElements(groups) {
    groupElements = groups;
  }
  
  function setMoveableElementPosition(el, moveableElement) {
    var absolutePosition = utils.getAbsolutePosition(el);
    
    // Give the moveable an absolute position, which will be
    // on top of the original element.
    moveableElement.style.position = "absolute";
    moveableElement.style.top = absolutePosition.top + "px";
    moveableElement.style.left = absolutePosition.left + "px";
    moveableElement.style.zIndex = "1999999999999";
  }
  
  function createMoveableElement(el) {
    function removeTooltip(el) {
      // Removes tooltip from element
      el.title = "";
      el.setAttribute("data-button-action", "");
      el.setAttribute("data-tooltip-text", "");
      utils.removeClass(el, "yt-uix-tooltip");
      
      // Removes tooltip from children
      var children = el.children;
      for (var i = 0, len = children.length; i < len; i++) {
        removeTooltip(children[i]);
      }
    }
    var moveableElement = el.cloneNode(true);
    
    // Move the moveable element on top of the targeted element
    setMoveableElementPosition(el, moveableElement);
    
    // Removes tooltip from the moveable element
    removeTooltip(moveableElement);
    
    return moveableElement;
  }
  
  function setEnabled(enabled) {
    moduleEnabled = enabled;
    
    utils.removeEventListener(document, "mousemove", mousemoveListener, false);
    utils.removeEventListener(document, "touchmove", mousemoveListener, false);
    
    utils.removeEventListener(document, "mousedown", mousedownListener, false);
    utils.removeEventListener(document, "touchstart", mousedownListener, false);
    
    utils.removeEventListener(document, "mouseup", mouseupListener, false);
    utils.removeEventListener(document, "touchend", mouseupListener, false);
    
    if (enabled) {
      utils.addEventListener(document, "mousedown", mousedownListener, false);
      utils.addEventListener(document, "touchstart", mousedownListener, false);
      
      utils.addEventListener(document, "mouseup", mouseupListener, false);
      utils.addEventListener(document, "touchend", mouseupListener, false);
    }
  }
  
  /**
  * An array of where the moveable elements can be placed in.
  *
  * @property groupElements
  * @type HTMLElement[]
  **/
  var groupElements = [ ];
  
  // A reference to the moveable and targeted elements for use in mousemove
  var relativeMousePosition = null;
  var refMoveableElement = null;
  var refTargetedElement = null;
  
  // Local properties
  /**
  * Used to check if the drag 'n' drop is enabled.
  *
  * @private
  * @static
  * @property moduleEnabled
  * @type Boolean
  **/
  var moduleEnabled = false;
  
  /**
  * Used to check if the left mouse button is pressed,
  * and if it is then it should move the element.
  *
  * @private
  * @static
  * @property mousedown
  * @type Boolean
  **/
  var mousedown = false;
  
  // Throttle the listener as it can be taxing for the users system.
  mousemoveListener = utils.throttle(mousemoveListener, 50);
  
  exports.setGroupElements = setGroupElements;
  exports.setEnabled = setEnabled;
  
  return exports;
});