define(["./config", "./player", "./signatureDecipher"], function(config, player, signatureDecipher){
  function parseStream(rawStream) {
    var tokens = rawStream.split("&");
    var stream = {};
    
    for (var i = 0, len = tokens.length; i < len; i++) {
      var keys = tokens[i].split("=");
      stream[keys[0]] = decodeURIComponent(keys[1]);
      if (keys[0] === "type") stream[keys[0]] = stream[keys[0]].replace(/\+/g, " ");
    }
    return stream;
  }
  
  function parseStreams(rawStreams) {
    var tokens = rawStreams.split(",");
    var streams = [];
    for (var i = 0, len = tokens.length; i < len; i++) {
      streams.push(parseStream(tokens[i]));
    }
    return streams;
  }
  
  function parseDetails(rawDetails, map) {
    var tokens = rawDetails.split(",");
    var details = [];
    
    for (var i = 0, len = tokens.length; i < len; i++) {
      var subtokens = tokens[i].split("/");
      var detail = {};
      for (var j = 0, lenj = map.length; j < lenj; i++) {
        var key = map[j];
        if (key.indexOf(":") !== -1) {
          var keytokens = key.split(":");
          var parent = keytokens[0];
          key = keytokens[1];
          
          if (!detail[parent]) {
            detail[parent] = {};
          }
          detail[parent][key] = subtokens.shift();
        } else {
          detail[map[j]] = subtokens.shift();
        }
      }
      details.push(detail);
    }
    return details;
  }
  
  function getDetailedStreams(streams, details) {
    var detailedStreams = [];
    for (var i = 0, len = streams.length; i < len; i++) {
      for (var j = 0, lenj = details.length; j < lenj; j++) {
        if (streams[i].itag === details[j].itag) {
          detailedStreams.push(utils.extend(utils.clone(streams[i]), utils.clone(details[j]), true));
          break;
        }
      }
    }
    return detailedStreams;
  }
  
  function getDASHStreams() {
    var cfg = config.getConfig();
    if (!(cfg && cfg.args && cfg.args.adaptive_fmts)) throw "DASH streams not found!";
    var adaptive_streams = cfg.args.adaptive_fmts;
    
    var streams = parseStreams(adaptive_streams);
    
    if (signatureDecipher.isReady()) {
      for (var i = 0, len = streams.length; i < len; i++) {
        if (streams[i].s) {
          streams[i].sig = signatureDecipher.decipherSignature(streams[i].s);
        }
      }
    }
    
    return streams;
  }
  
  function getStreams() {
    var cfg = config.getConfig();
    if (!(cfg && cfg.args && cfg.args.url_encoded_fmt_stream_map && cfg.args.fmt_list)) throw "Streams not found!";
    var streams = parseStreams(cfg.args.url_encoded_fmt_stream_map);
    var details = parseDetails(cfg.args.fmt_list);
    
    var detailedStreams = getDetailedStreams(streams, details);
    
    if (signatureDecipher.isReady()) {
      for (var i = 0, len = detailedStreams.length; i < len; i++) {
        if (detailedStreams[i].s) {
          detailedStreams[i].sig = signatureDecipher.decipherSignature(detailedStreams[i].s);
        }
      }
    }
    
    return detailedStreams;
  }
  
  function StreamURL(detail) {
    this.filename = "filename.mp4";
    this.detail = detail;
    
    if (!this.detail.sig) {
      if (this.detail.s) {
        con.log("Checking if the signature decipher is ready...");
        if (signatureDecipher.isReady()) {
          con.log("Deciphering signature");
          this.detail.sig = signatureDecipher.decipherSignature(this.detail.s);
        }
      } else {
        con.warn("Stream does not have a valid signature and will likely not be downloadable!");
      }
    }
  }
  
  StreamURL.prototype.setFilename = function setFilename(filename) {
    this.filename = filename
  }
  
  StreamURL.prototype.toURI = function toURI() {
    if (this.detail.sig) {
      return this.detail.url + "&title=" + encodeURIComponent(this.filename) + "&signature=" + encodeURIComponent(this.detail.sig);
    } else {
      con.error("No signature were found!");
      return this.detail.url + "&title=" + encodeURIComponent(this.filename);
    }
  }
  
  return {
    getDASHStreams: getDASHStreams,
    getStreams: getStreams,
    URL: StreamURL
  };
});