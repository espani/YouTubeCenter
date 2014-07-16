define(["utils"], function(utils){ // TODO  make it support token replacing.
  // Set the current language.
  function setLanguage(langCode) {
    if (!locales[langCode]) {
      throw "Language " + langCode + " was not found!";
    }
    currentLang = locales[langCode];
    handleListeners();
  }
  
  // Updating all the language details for the listeners.
  function handleListeners() {
    for (var i = 0, len = listeners.length; i < len; i++) {
      var listener = listeners[i];
      var el = listener.element;
      
      if (typeof listener.textContent === "string") {
        el.textContent = getLocaleText(listener.textContent);
      }
      
      if (typeof listener.attr === "object") {
        utils.each(listener.attr, function(key, value){
          el.setAttribute(key, getLocaleText(value));
        });
      }
    }
  }
  
  // Get the locale text by the locale ID
  function getLocaleText(localeId) {
    return currentLang[localeId];
  }
  
  // Create a text node with a listener attached.
  function createTextNode(localeId) {
    var textNode = document.createTextNode(getLocaleText(localeId));
    addLanguageListener(textNode, localeId);
    
    return textNode;
  }
  
  // Add a listener, where textContent is a string with the locale ID
  // and attr is an object with the key as the attribute name
  // and the value with the locale ID.
  function addLanguageListener(el, textContent, attr) {
    listeners.push({element: el, textContent: textContent, attr: attr});
  }
  
  // Remove a listener
  function removeLanguageListener(el, textContent, attr) {
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (listeners[i].element === el && listeners[i].textContent === textContent && listeners[i].attr === attr) {
        listeners.splice(i, 1);
        break;
      }
    }
  }
  
  // Remove all listeners or only for specific element
  function removeLanguageListeners(el) {
    if (el) {
      for (var i = 0, len = listeners.length; i < len; i++) {
        if (listeners[i].element === el) {
          listeners.splice(i, 1);
          i--; len--;
        }
      }
    } else {
      listeners = [];
    }
  }
  
  // Init
  function init() {
    currentLang = locales[defaultLanguage];
  }
  
  var defaultLanguage = "en";
  
  var locales = ${language-locales}; // TODO  add the language-locales object to the build file.
  var currentLang = null;
  
  var listeners = [];
  
  init();
  
  return {
    setLanguage: setLanguage,
    createTextNode: createTextNode,
    addLanguageListener: addLanguageListener,
    removeLanguageListener: removeLanguageListener,
    removeLanguageListeners: removeLanguageListeners
  };
});