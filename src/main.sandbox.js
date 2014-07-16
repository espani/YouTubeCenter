define(["utils", "storage", "message"], function(utils, storage, message){
  message.init(${MESSAGE.TARGET.SANDBOX}, ["http", "https"], ["youtube.com", "www.youtube.com", "api.google.com", "plus.googleapis.com"]);
  
  storage.getItem("${storage.settings}", function(value){
    var settings = JSON.parse(value || "{}");
    
    utils.inject(mainPage, settings); /* mainPage is injected by Grunt */
  });
});