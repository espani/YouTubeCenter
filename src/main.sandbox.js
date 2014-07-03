define(["utils", "storage", "message"], function(utils, storage, message){
  message.init(${MESSAGE.TARGET.SANDBOX}, ["http", "https"], ["youtube.com", "www.youtube.com", "api.google.com", "plus.googleapis.com"]);
  
  var storedSettings = storage.getItem("${storage.settings}");
  var settings = JSON.parse(storedSettings || "{}");
  
  utils.inject(mainPage, settings); /* mainPage is injected by Grunt */
});