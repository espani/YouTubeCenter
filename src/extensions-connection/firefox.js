define(["support", "console", "utils"], function(support, con, utils){
  function setPageConnection(connection) {
    if (unloaded) {
      connection.disconnect();
    } else {
      pageConnection = connection;
    }
  }
  
  var pageConnection = null;
  
  var unloaded = false;
  
  port.on("unload", function(){
    con.log("Unloading...");
    
    if (pageConnection) pageConnection.disconnect(); // Disconnect the sandbox from the page.
    
    unloaded = true;
  });
  
  return {
    setPageConnection: setPageConnection
  };
});