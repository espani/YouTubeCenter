define(["support", "storage/localStorage", "storage/cookies", "console"], function(support, localStorage, cookies){
  if (support.localStorage) {
    return localStorage;
  } else {
    return cookies;
  }
});