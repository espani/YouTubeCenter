define(["storage", "UserProxy/Connection", "extensions-connection/${runtime.browser.name}", "xhr", "console"], function(storage, Connection, extension, xhr, con){
  var functionMap = {
    "setItem": storage.setItem,
    "getItem": storage.getItem,
    "removeItem": storage.removeItem,
    "xhr": xhr,
    "log": con.log
  };
  
  var connection = null;
  
  storage.getItem("${storage.settings}", function(settings){
    if (typeof settings !== "object") settings = JSON.parse(settings || "{}");
    
    connection = new Connection();
    connection.setFunctions(functionMap);
    
    extension.setPageConnection(connection);
    
    connection.inject(mainPage, settings, con.sessionToken);
  }, true);
});