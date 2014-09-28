define(["../helper/support", "./localStorage", "./cookies", "console"], function(support, localStorage, cookies){
  if (support.localStorage) {
    return localStorage;
  } else {
    return cookies;
  }
});