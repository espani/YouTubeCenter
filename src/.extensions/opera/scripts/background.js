/* Utils */
function bind(scope, func) {
  var args = Array.prototype.slice.call(arguments, 2);
  return function(){
    return func.apply(scope, args.concat(Array.prototype.slice.call(arguments)))
  };
}

/* Message API */
function onMessage(e) {
  var data = JSON.parse(e.data);
  
  switch (data.type) {
    "setItem":
      setItem.apply(null, data.args);
      break;
    "removeItem":
      removeItem.apply(null, data.args);
      break;
    "getItem":
      getItem(data.args[0], bind(null, sendMessage, e, data.args[1]));
      break;
    "xhr":
      throw "Not supported!";
  }
}

function sendMessage(e, id) {
  var args = Array.prototype.slice.call(arguments, 2);
  e.source.postMessage(JSON.stringify({ id: id, args: args }));
}

/* API */
function setItem(key, value) {
  if (typeof value === "object") value = JSON.stringify(value)
  storage.setItem(key, value);
}

function getItem(key, callback) {
  var value = storage.getItem(key)
  callback(value);
}

function removeItem(key) {
  storage.removeItem(key);
}

var storage = widget.preferences;

opera.extension.onmessage = onMessage;