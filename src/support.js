define([], function(){
  function localStorageTest() {
    var mod = "support.test";
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  return {
    localStorage: localStorageTest(),
    Greasemonkey: (typeof GM_setValue !== "undefined" && (typeof GM_setValue.toString === "undefined" || GM_setValue.toString().indexOf("not supported") === -1))
  };
});