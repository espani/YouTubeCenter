define(["utils"], function(utils){
  /**
  * Adding an element to a defined group.
  *
  * @param {String} id The id of the group.
  * @param {HTMLElement} element The element that will be added to the group.
  **/
  function addElement(id, element) {
    if (!groups[id]) throw "Group " + id + " has not been created!";
    groups[id].children.push(element);
  }
  
  /**
  * Creating a group.
  *
  * @param {String} id The id of the group.
  * @param {HTMLElement} element The group element.
  * @param {Object} options The options for the group.
  **/
  function createGroup(id, element, options) {
    if (groups[id]) throw "Group " + id + " has already been created!";
    groups[id] = {
      element: element, // The container element where the children resides
      options: options, // The options for that specific group
      children: []
    };
  }
  
  /**
  * Returns the unique ID for the given element.
  *
  * @param {HTMLElement} element The element to get the element from.
  * @return {String} The unique ID for the element.
  **/
  function getUniqueElementId(element) {
    throw "Not implemented yet!";
  }
  
  /**
  * Returns the HTMLElement with a specific unique ID.
  *
  * @param {String} id The unique ID.
  * @return {HTMLElement} The element with the unique ID.
  **/
  function getElementByUniqueId(id) {
    throw "Not implemented yet!";
  }
  
  function getElementPositions() {
    throw "Not implemented yet!";
  }
  
  function getOrderedList() {
    var list = [];
    utils.each(groups, function(id, group){
      var childrenIds = [];
      for (var i = 0, len = group.children.length; i < len; i++) {
        childrenIds.push(getUniqueElementId(group.children[i]));
      }
      list.push({ id: id, children: childrenIds });
    });
    return list;
  }
  
  function setOrderByList(list) {
    throw "Not implemented yet!";
  }
  
  var groups = {};
  
  return {
    addElement: addElement,
    createGroup: createGroup,
    getOrderedList: getOrderedList,
    setOrderByList: setOrderByList
  };
});