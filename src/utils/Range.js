define(["exports"], function(exports){
  /**
  * An object that contains a start value and an end value.
  *
  * @namespace utils
  * @class Range
  * @constructor
  **/
  function Range(start, end) {
    this.start = start;
    this.end = end;
  }
  
  /**
  * The start value of the range.
  *
  * @property start
  * @type Number
  **/
  Range.prototype.start = null;
  
  /**
  * The end value of the range.
  *
  * @property end
  * @type Number
  **/
  Range.prototype.end = null;
  
  exports = Range;
  return exports;
});