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
  function getElementUniqueId(element) {
    var classes = utils.listClass(element);
    for (var i = 0, len = classes.length; i < len; i++) {
      classes[i] = encodeURIComponent(classes[i]);
    }
    
    if (classes.length > 0) {
      classes = "." + classes.join(".");
    } else {
      classes = "";
    }
    
    var id = element.getAttribute("id");
    if (id) {
      id = "#" + encodeURIComponent(id);
    } else {
      id = "";
    }
    
    var tagName = encodeURIComponent(element.tagName);
    
    var uid = null;
    
    var parent = element.parentNode && element.parentNode instanceof HTMLElement;
    
    if (!id && !classes && parent) {
      var parentNode = element.parentNode;
      for (var i = 0, len = parentNode.children.length; i < len; i++) {
        if (parentNode.children[i] === element) {
          uid = tagName + "[" + i + "]"
          break;
        }
      }
    } else {
      uid = tagName + id + classes;
    }
    
    if (!id && parent) {
      return getUniqueElementId(element.parentNode) + " " + uid;
    } else {
      return uid;
    }
  }
  
  /**
  * Returns the HTMLElement with a specific unique ID.
  *
  * @param {String} id The unique ID.
  * @return {HTMLElement} The element with the unique ID.
  **/
  function getElementByUniqueId(uid) {
    var tokens = uid.split(" ");
    var element = null;
    for (var i = 0, len = tokens.length; i < len; i++) {
      var match = /([a-zA-Z0-9_%\-]+)(\[[0-9]+\])?(\#[a-zA-Z0-9_%\-]+)?((\.[a-zA-Z0-9_%\-]+)*)/g.exec(tokens[i]);
      var tagName = decodeURIComponent(match[1]);
      var childIndex = null;
      if (match[2]) {
        childIndex = parseInt(match[2].substring(1, match[2].length - 1), 10);
      }
      var id = null;
      if (match[3]) {
        id = decodeURIComponent(match[3].substring(1));
      }
      
      var classes = [];
      if (match[4]) {
        classes = match[4].substring(1).split(".");
      }
      for (var j = 0, lenj = classes.length; j < lenj; j++) {
        classes[j] = decodeURIComponent(classes[j]);
      }
      
      var doc = document;
      if (element) {
        doc = element;
      }
      var continues = false;
      if (id) {
        element = document.getElementById(id);
      } else if (classes.length > 0) {
        var elements = doc.getElementsByClassName(classes.join(" "));
        for (var j = 0, lenj = elements.length; j < lenj; j++) {
          if (elements[i].tagName.toLowerCase() === tagName.toLowerCase()) {
            element = elements[i];
            continues = true;
            break;
          }
        }
        if (!continues) return null;
      } else if (typeof childIndex === "number") {
        var elements = doc.getElementsByTagName(tagName);
        for (var j = 0, lenj = elements.length; j < lenj; j++) {
          if (elements[i] && elements[i].parentNode && elements[i].parentNode instanceof HTMLElement && elements[i].parentNode.children[childIndex] === elements[i]) {
            element = elements[i];
            continues = true;
            break;
          }
        }
        if (!continues) return null;
      } else {
        element = doc.getElementsByTagName(tagName)[0];
      }
      
      if (!element) {
        return null;
      }
    }
    
    return element;
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