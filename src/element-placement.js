define(["utils"], function(utils){
  function addElement(id, element) {
    if (!groups[id]) throw "Group " + id + " has not been created!";
    groups[id].children.push(element);
  }
  
  function createGroup(id, element, options) {
    if (groups[id]) throw "Group " + id + " has already been created!";
    groups[id] = {
      element: element, // The container element where the children resides
      options: options, // The options for that specific group
      children: []
    };
  }
  
  function getUniqueElementId(element) {
    throw "Not implemented yet!";
  }
  
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