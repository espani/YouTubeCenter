var fileAccess = require("fileaccess");

var cache = {}, event = "storage";

function getItem(key){
  if (!cache[key]) {
    let data = fileAccess.readFile(key);
    cache[key] = data;
  }
  return cache[key];
};
function setItem(key, value){
  cache[key] = value;
  
  fileAccess.writeFile(key, value);
}

function listValues() {
  throw new Error("Not implemented!");
}

function exists(key) {
  return fileAccess.exists(key);
}

function removeItem(key) {
  delete cache[key];
  fileAccess.removeFile(key);
}

unload(function(){ cache = null; event = null; });

exports["setItem"] = setItem;
exports["getItem"] = getItem;
exports["removeItem"] = removeItem;