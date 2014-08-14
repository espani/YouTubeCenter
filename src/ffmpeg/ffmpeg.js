define(["utils/WebWorker", "storage"], function(worker, storage){
  function createInstance() {
    if (instance !== null) throw "Instance has already been created!";
    storage.getItem("script_ffmpeg", function(ffmpegScript){
      if (ffmpegScript) {
        instance = worker.createWorker([ffmpegScript, ffmpeg], workerListener);
      } else {
        xhr({
          method: "GET",
          url: "URL_TO_FFMPEG",
          onload: function(r){
            var ffmpegScript = r.responseText;
            instance = worker.createWorker([ffmpegScript, ffmpeg], workerListener);
            storage.setItem("script_ffmpeg", ffmpegScript); // Caching the ffmpeg script
          }
        });
      }
    });
  }
  
  function ffmpeg(addEventListener, dispatchEvent) {
    function bind(scope, func) {
      var args = Array.prototype.slice.call(arguments, 2);
      return function(){
        return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
      };
    }
    
    function print(id, msg) {
      dispatchEvent("jobMessage", { id: id, args: [ msg ] });
    }
    
    function onExecute(data) {
      var stdout = bind(null, print, data.id);
      var module = {
        files: data.files || [],
        arguments: data.arguments || [],
        print: stdout,
        printErr: stdout
      };
      
      dispatchEvent("jobStart", { id: data.id, args: [ module ] });
      var result = ffmpeg_run(module);
      dispatchEvent("jobComplete", { id: data.id, args: [ result ] });
    }
    
    addEventListener("execute", onExecute);
  }
  
  function execute(args, files, jobStart, jobMessage, jobComplete) {
    var id = jobs.push({ jobStart: jobStart, jobMessage: jobMessage, jobComplete: jobComplete }) - 1;
    
    instance("execute", { id: id, arguments: args, files: files });
  }
  
  function workerListener(event, data) {
    if (event === "ready") {
      ready = data;
    }
    
    if (typeof jobs[data.id] === "object" && typeof jobs[data.id][event] === "function") {
      jobs[data.id][event].apply(null, data.args);
    }
    
    if (event === "jobComplete") {
      jobs[data.id] = null;
    }
  }
  
  function isReady() {
    return ready;
  }
  
  var instance = null;
  var ready = false;
  
  var jobs = [];
  
  return {
    isReady: isReady,
    createInstance: createInstance,
    execute: execute
  };
});