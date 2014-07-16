define([], function(){
  function getInnerWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }
  function getInnerHeight() {
    return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  }
  
  function getClientWidth() {
    return document.documentElement.clientWidth || window.innerWidth || document.body.clientWidth;
  }
  
  function getClientHeight() {
    return document.documentElement.clientHeight || window.innerHeight || document.body.clientHeight;
  }
  
  function addEventListener(event, callback, capture) {
    window.addEventListener(event, callback, capture);
  }
  
  return {
    getClientWidth: getClientWidth,
    getClientHeight: getClientHeight,
    getInnerWidth: getInnerWidth,
    getInnerHeight: getInnerHeight,
    addEventListener: addEventListener
  }
});