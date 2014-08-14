define(["exports", "./api"], function(exports, api){
  function setQualityRange(range) {
    api.setPlaybackQualityRange(range);
  }
  
  exports.setQualityRange = setQualityRange;
  
  return exports;
});