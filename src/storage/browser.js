define(["support", "storage/localStorage", "storage/cookies"], function(support, localStorage, cookies){
  if (support.localStorage) {
    return localStorage;
  } else {
    return cookies;
  }
});