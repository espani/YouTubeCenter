/**
* A group module for the element-placment module.
*
* @module element-placement/sentiment-actions
**/
define(["element-placement", "utils"], function(placement, utils){
  /**
  * Returns a boolean to indicate whether a HTMLELement has passed the condition.
  *
  * @method condition
  * @param {HTMLElement} elm A HTMLElement to check if it passes the condition.
  * @return {Boolean} Whether the condition is met or not.
  **/
  function condition(elm) {
    if (elm.parentNode === element) {
      if (utils.hasClass(elm, "yt-uix-button-group")) {
        return true;
      } else if (utils.hasClass(elm, "yt-uix-button")) {
        return true;
      }
    }
    return false;
  }
  
  /**
  * The id of the group.
  *
  * @type String
  * @readOnly
  **/
  var id = "sentiment-actions";
  
  var element = document.getElementById("watch7-sentiment-actions");
  
  placement.createGroup(id, element, {
    condition: condition
  });
  
  /**
  * This is a bound function from element-placement.addElement,
  * with the id param set to sentiment-actions.
  * @param {HTMLElement} A HTMLElement that will be added to the group.
  **/
  var addElement = utils.bind(null, placement.addElement, id);
  
  return {
    addElement: addElement
  }
});