/**
* A group module for the element-placment module.
*
* @class SentimentActions
**/
define(["exports", "../element-placement", "../utils", "../pageload"], function(exports, placement, utils, pageload){
  function onInteractive() {
    // Retrieve the group element.
    var element = document.getElementById(id);
    
    // Create the group
    placement.createGroup(id, element);
    
    // Make sure that elements are no more added to the buffer
    groupCreated = true;
    
    // Add buffered elements to the group
    if (groupBuffer.length > 0) {
      for (var i = 0, len = groupBuffer.length; i < len; i++) {
        placement.addElement(id, groupBuffer[i][0], groupBuffer[i][1]); // Adding the element to the group
      }
      groupBuffer = []; // Remove reference for every buffered element.
    }
  }
  
  /**
  * Add an element to the group.
  *
  * @static
  * @method addElement
  * @param {String} id An unique id for the element
  * @param {HTMLElement} el A HTMLElement that will be added to the group.
  **/
  function addElement(id, el) {
    if (groupCreated) {
      placement.addElement(id, uid, el);
    } else {
      groupBuffer.push([ uid, el ]);
    }
  }
  
  /**
  * The id of the group.
  *
  * @private
  * @static
  * @property id
  * @type String
  * @readOnly
  **/
  var id = "watch8-sentiment-actions";
  
  /**
  * Indicates whether the group has been created yet.
  *
  * @private
  * @static
  * @property groupCreated
  * @type Boolean
  **/
  var groupCreated = false;
  
  /**
  * The buffered element.
  *
  * @private
  * @static
  * @property groupBuffer
  * @type HTMLElement[]
  **/
  var groupBuffer = [];
  
  // Make sure that the group is created when the page has loaded every DOM element.
  pageload.addEventListener("interactive", onInteractive);
  
  exports.addElement = addElement;
  
  return exports;
});