define(["exports", "./utils", "./placement-dragdrop", "./pageload"], function(exports, utils, dragdrop, pageload){
  /**
  * Adding an element to a defined group.
  *
  * @static
  * @method addElement
  * @param {String} id The id of the group.
  * @param {HTMLElement} element The element that will be added to the group.
  **/
  function addElement(id, elementId, element) {
    if (!groups[id]) throw "Group " + id + " has not been created!";
    groups[id].children.push({ id: elementId, element: element });
    
    // Append the element to the group element
    groups[id].element.appendChild(element);
  }
  
  /**
  * Creating a group where the elements will be placed in.
  *
  * @statc
  * @method createGroup
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
  * @private
  * @static
  * @method getElementUniqueId
  * @param {HTMLElement} element The element to get the element from.
  * @return {String} The unique ID for the element.
  **/
  function getElementUniqueId(element) {
    var classes = utils.listClass(element);
    for (var i = 0, len = classes.length; i < len; i++) {
      if (classes[i] !== "") {
        classes[i] = encodeURIComponent(classes[i]);
      }
    }
    
    if (classes.length > 0) {
      classes = "." + classes.join(".");
      if (classes[classes.length - 1] === ".") {
        classes = classes.substring(0, classes.length - 1);
      }
    } else {
      classes = "";
    }
    
    var id = getGroupIdByElement(element);
    if (typeof id === "string") {
      id = "@" + encodeURIComponent(id);
    } else {
      id = element.getAttribute("id");
      if (id) {
        id = "#" + encodeURIComponent(id);
      } else {
        id = "";
      }
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
      return getElementUniqueId(element.parentNode) + " " + uid;
    } else {
      return uid;
    }
  }
  
  /**
  * Returns the HTMLElement with a specific unique ID.
  *
  * @private
  * @static
  * @method getElementByUniqueId
  * @param {String} id The unique ID.
  * @return {HTMLElement} The element with the unique ID.
  **/
  function getElementByUniqueId(uid) {
    var tokens = uid.split(" ");
    var element = null;
    for (var i = 0, len = tokens.length; i < len; i++) {
      var match = /([a-zA-Z0-9_%\-]+)(\[[0-9]+\])?((\#|\@)[a-zA-Z0-9_%\-]+)?((\.[a-zA-Z0-9_%\-]+)*)/g.exec(tokens[i]);
      var tagName = decodeURIComponent(match[1]);
      var childIndex = null;
      if (match[2]) {
        childIndex = parseInt(match[2].substring(1, match[2].length - 1), 10);
      }
      var id = null;
      var regId = false;
      if (match[3]) {
        if (match[3].substring(0, 1) === "@") {
          // The element is a registered group.
          regId = true;
        }
        id = decodeURIComponent(match[3].substring(1));
      }
      
      var classes = [];
      if (match[5]) {
        classes = match[5].substring(1).split(".");
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
        if (regId) {
          element = getGroupElementByUniqueId(id);
        } else {
          element = document.getElementById(id);
        }
      } else if (classes.length > 0) {
        var elements = doc.getElementsByClassName(classes.join(" "));
        for (var j = 0, lenj = elements.length; j < lenj; j++) {
          if (elements[j].tagName.toLowerCase() === tagName.toLowerCase()) {
            element = elements[j];
            continues = true;
            break;
          }
        }
        if (!continues) return null;
      } else if (typeof childIndex === "number") {
        var elements = doc.getElementsByTagName(tagName);
        for (var j = 0, lenj = elements.length; j < lenj; j++) {
          if (elements[j] && elements[j].parentNode && elements[j].parentNode instanceof HTMLElement && elements[j].parentNode.children[childIndex] === elements[j]) {
            element = elements[j];
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
  
  /**
  * Get the group element by an unique ID.
  *
  * @private
  * @static
  * @method getGroupElementByUniqueId
  * @param {String} id The unique Id of the group element.
  * @return {HTMLElement} The group element.
  **/
  function getGroupElementByUniqueId(id) {
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        if (key === id) {
          return groups[key].element;
        }
      }
    }
    return null;
  }
  
  /**
  * Get the group ID by element.
  *
  * @private
  * @static
  * @method getGroupIdByElement
  * @param {HTMLElement} el The group element.
  * @return {String} The unique Id of the group element.
  **/
  function getGroupIdByElement(el) {
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        if (groups[key].element === el) {
          return key;
        }
      }
    }
    return null;
  }
  
  /**
  * Get a registered element's unique ID.
  *
  * @private
  * @static
  * @method getRegisteredElementUniqueId
  * @param {HTMLElement} el The registered element.
  * @return {String} Returns the unique ID of registered element.
  **/
  function getRegisteredElementUniqueId(el) {
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        var children = groups[key].children;
        for (var i = 0, len = children.length; i < len; i++) {
          if (el === children[i].element) {
            return children[i].id;
          }
        }
      }
    }
    return null;
  }
  
  /**
  * Get a registered element by its unique ID.
  *
  * @private
  * @static
  * @method getRegisteredElementByUniqueId
  * @param {String} id The unique ID of the element.
  * @return {HTMLElement} Returns the element.
  **/
  function getRegisteredElementByUniqueId(id) {
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        var children = groups[key].children;
        for (var i = 0, len = children.length; i < len; i++) {
          if (id === children[i].id) {
            return children[i].element;
          }
        }
      }
    }
    return null;
  }
  
  /**
  * Check if an element is registered.
  *
  * @private
  * @static
  * @method isElementRegistered
  * @param {HTMLElement} el The element to check if its registered.
  * @return {Boolean} Returns true if element is registered otherwise return false.
  **/
  function isElementRegistered(el) {
    for (var id in groups) {
      if (groups.hasOwnProperty(id)) {
        if (isElementInGroup(el, id)) {
          return true;
        }
      }
    }
    return false;
  }
  
  /**
  * Check if an element is registered in a specific group.
  *
  * @private
  * @static
  * @method isElementRegistered
  * @param {HTMLElement} el The element to check if its registered.
  * @param {String} groupId The group ID.
  * @return {Boolean} Returns true if element is registered in specified group otherwise return false.
  **/
  function isElementInGroup(el, groupId) {
    if (!groups[groupId]) return false;
    
    var children = groups[groupId].children;
    for (var i = 0, len = children.length; i < len; i++) {
      if (children[i].element === el) {
        return true;
      }
    }
    return false;
  }
  
  /**
  * Create a reference state to use as an reference when elements have been moved.
  *
  * @static
  * @method createReferenceState
  * @return {Object} The reference state.
  **/
  function createReferenceState() {
    var map = {};
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        var group = groups[key];
        
        var groupElements = [];
        var el = group.element;
        if (el && el.children) {
          var children = el.children;
          for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var data = { };
            if (isElementRegistered(child)) {
              data.type = REGISTERED;
              data.uniqueId = getRegisteredElementUniqueId(child);
              data.element = child;
            } else {
              data.type = NONREGISTERED;
              data.uniqueId = getElementUniqueId(child);
              data.element = child;
            }
            groupElements.push(data);
          }
        }
        map[key] = groupElements;
      }
    }
    return map;
  }
  
  /**
  * Get the unique ID of an referenced element.
  *
  * @private
  * @static
  * @method getReferencedUniqueId
  * @param {HTMLElement} el The element.
  * @return {String} Returns the unique ID of element.
  **/
  function getReferencedUniqueId(el) {
    if (!referenceState) return null;
    
    for (var key in referenceState) {
      if (referenceState.hasOwnProperty(key)) {
        var group = referenceState[key];
        for (var i = 0, len = group.length; i < len; i++) {
          if (el === group[i].element) {
            return group[i].uniqueId;
          }
        }
      }
    }
    return null;
  }
  
  /**
  * Get the reference element by the unique ID.
  *
  * @private
  * @static
  * @method getReferencedElement
  * @param {String} el The unique ID.
  * @return {String} Returns the element given by the unique ID.
  **/
  function getReferencedElement(id) {
    if (!referenceState) return null;
    
    for (var key in referenceState) {
      if (referenceState.hasOwnProperty(key)) {
        var group = referenceState[key];
        for (var i = 0, len = group.length; i < len; i++) {
          if (id === group[i].uniqueId) {
            return group[i].element;
          }
        }
      }
    }
    return null;
  }
  
  /**
  * Get the current state.
  *
  * @static
  * @method getState
  * @return {Object} Returns the state object.
  **/
  function getState() {
    var map = {};
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        var group = groups[key];
        
        var groupElements = [];
        var el = group.element;
        if (el && el.children) {
          var children = el.children;
          for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            var data = { };
            if (isElementRegistered(child)) {
              data.type = REGISTERED;
              data.uniqueId = getRegisteredElementUniqueId(child);
            } else {
              data.type = NONREGISTERED;
              data.uniqueId = getReferencedUniqueId(child, referenceState) || getElementUniqueId(child);
            }
            groupElements.push(data);
          }
        }
        map[key] = groupElements;
      }
    }
    return map;
  }
  
  /**
  * Set the state.
  *
  * @static
  * @method setState
  * @param {Object} state The state to be applied.
  **/
  function setState(state) {
    utils.each(state, function(groupId, elements){
      if (!groups[groupId]) con.warn("Group " + groupId + " does not exist!");
      
      var group = groups[groupId];
      for (var i = 0, len = elements.length; i < len; i++) {
        var element = elements[i];
        var el = null;
        if (element.type === REGISTERED) {
          el = getRegisteredElementByUniqueId(element.uniqueId);
        } else if (element.type === NONREGISTERED) {
          el = getReferencedElement(element.uniqueId, referenceState) || getElementByUniqueId(element.uniqueId);
        }
        
        if (el !== null) {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
          
          group.element.appendChild(el);
        } else {
          con.warn("Unknown element in settings", element);
        }
      }
    });
  }
  
  /**
  * Enable/disable the drag 'n' drop.
  *
  * @static
  * @method setMoveable
  * @param {Boolean} enabled Whether the drag 'n' drop should be enabled.
  **/
  function setMoveable(enabled) {
    dragdrop.setGroupElements(getGroupElements());
    dragdrop.setEnabled(enabled);
  }
  
  /**
  * Get every registered element in every group.
  *
  * @private
  * @static
  * @method getGroupElements
  * @return {HTMLElement[]} Returns every registered element in every registered group.
  **/
  function getGroupElements() {
    var groupElements = [];
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        groupElements.push(groups[key].element);
      }
    }
    return groupElements;
  }
  
  /**
  * Clear every registered group and registered elements.
  *
  * @static
  * @method clearGroups
  **/
  function clearGroups() {
    groups = {};
  }
  
  /**
  * Set the reference state.
  *
  * @static
  * @method setReferenceState
  * @param {Object} state The reference state.
  **/
  function setReferenceState(state) {
    referenceState = state;
  }
  
  /**
  * Initialize the reference state and move elements.
  *
  * @private
  * @static
  * @method init
  **/
  function init() {
    setReferenceState(createReferenceState());
    
    
  }
  
  /**
  * Value given to registered elements.
  *
  * @private
  * @static
  * @property REGISTERED
  * @type {Number}
  * @default 0
  **/
  var REGISTERED = 0;
  
  /**
  * Value given to not registered elements.
  *
  * @private
  * @static
  * @property NONREGISTERED
  * @type {Number}
  * @default 1
  **/
  var NONREGISTERED = 1;
  
  /**
  * The registered groups and its registered element children
  *
  * @private
  * @static
  * @property groups
  * @type {Object}
  **/
  var groups = {};
  
  /**
  * The reference state.
  *
  * @private
  * @static
  * @property referenceState
  * @type {Object}
  **/
  var referenceState = null;
  
  pageload.addEventListener("interactive", init);
  
  /* Make the API public */
  exports.setMoveable = setMoveable;
  exports.addElement = addElement;
  exports.createGroup = createGroup;
  exports.getState = getState;
  exports.setState = setState;
  exports.createReferenceState = createReferenceState;
  exports.setReferenceState = setReferenceState;
  exports.clearGroups = clearGroups;
  
  return exports;
});