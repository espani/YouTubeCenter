/**
* A module for the player to repeat the video.
*
* @namespace Player
* @class Repeat
**/
define(["exports", "./listeners", "./player", "utils", "utils/Range"], function(exports, listeners, player, utils, Range){
  /**
  * Set the interval where the video should be repeated.
  *
  * @static
  * @method setRepeatInterval
  * @param {Number} start The start of the interval in seconds.
  * @param {Number} end The end of the interval in seconds.
  **/
  /**
  * Set the interval where the video should be repeated.
  *
  * @static
  * @method setRepeatInterval
  * @param {Range} range The range of the interval
  **/
  function setRepeatInterval(start, end) {
    removeRepeatIntervals(); // Clean up
    
    if (typeof start === "number" && typeof end === "number") {
      rangeIntervals.push(new Range(start, end));
      player.api.addCueRange(rangeName + "[0]", start, end);
    } else if (start instanceof Range) {
      var range = start;
      rangeIntervals.push(new Range(range.start, range.end));
      player.api.addCueRange(rangeName + "[0]", range.start, range.end);
    }
  }
  
  /**
  * Set the intervals where the video should be repeated.
  *
  * @static
  * @method setRepeatIntervals
  * @param {Range[]} intervals The repeat intervals.
  **/
  function setRepeatIntervals(intervals) {
    removeRepeatIntervals(); // Clean up
    for (var i = 0, len = intervals.length; i < len; i++) {
      var interval = new Range(intervals[i].start, intervals[i].end);
      rangeIntervals.push(interval);
      
      player.api.addCueRange(rangeName + "[" + i + "]", interval.start, interval.end);
    }
  }
  
  /**
  * Remove the cure range listeners
  *
  * @static
  * @method removeRepeatIntervals
  **/
  function removeRepeatIntervals() {
    for (var i = 0, len = rangeIntervals.length; i < len; i++) {
      player.api.removeCueRange(rangeName + "[" + i + "]");
    }
  }
  
  /**
  * Handle the range enter event
  *
  * @private
  * @static
  * @method onRangeEnterHandler
  **/
  function onRangeEnterHandler(cueName) {
    // This actually does nothing...
  }
  
  /**
  * Handle the range exit event.
  *
  * @private
  * @static
  * @method onRangeExitHandler
  **/
  function onRangeExitHandler(cueName) {
    var regex = /^ytc\:repeat\[([0-9]+)\]$/;
    var match = cueName.match(regex);
    if (match) {
      var id = match[1];
      if (!rangeIntervals[id]) throw "Registered interval does not exists!";
      
      var nextInterval = null;
      
      // Checking if there exists a next interval
      if (rangeIntervals[id + 1]) {
        nextInterval = rangeIntervals[id + 1]; // Setting the next interval
      } else {
        // The current interval was the last interval.
        // Therefore use the first interval.
        nextInterval = rangeIntervals[0];
      }
      
      // Make sure that the next interval exists
      if (nextInterval) {
        player.api.seekTo(nextInterval.start); // Seek to the next interval
      }
    }
  }
  
  /**
  * The name of the cue range entries.
  *
  * @private
  * @static
  * @property rangeName
  * @type String
  **/
  var rangeName = "ytc:repeat";
  
  /**
  * The current range intervals
  *
  * @private
  * @static
  * @property rangeIntervals
  * @type Array
  **/
  var rangeIntervals = [];
  
  //listeners.addEventListener("onCueRangeEnter", onRangeEnter);
  listeners.addEventListener("onCueRangeExit", onRangeExit);
  
  exports.setRepeatInterval = setRepeatInterval;
  exports.setRepeatIntervals = setRepeatIntervals;
  exports.removeRepeatIntervals = removeRepeatIntervals;
  
  return exports;
});