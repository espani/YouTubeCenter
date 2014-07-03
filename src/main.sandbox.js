function inject(func, settings) {
  var script = document.createElement("script"),
      p = (document.body || document.head || document.documentElement);
  if (!p) {
    throw "Could not inject YouTube Center!!!";
  }
  script.setAttribute("type", "text/javascript");
  script.appendChild(document.createTextNode("(" + func + ")(" + JSON.stringify(settings) + ");"));
  p.appendChild(script);
  p.removeChild(script);
}

function isJSONString(json) {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
}

function sendMessage(data) {
  if (target === ${MESSAGE.TARGET.PAGE}) {
    window.postMessage(JSON.stringify(data), "*");
  } else if (target === ${MESSAGE.TARGET.ADDON}) {
    // Specific addon function
  }
}

function handleIncomingMessages(e) {
  e = e || window.event;
  
  // e.origin TODO check if correct domain
  
  var data;
  
  if ((data = isJSONString(e.data))) {
    if (data.referer !== ${MESSAGE.TARGET.SANDBOX}) {
      if (data.target === ${MESSAGE.TARGET.PAGE}) {
        // Resend this message to the page.
        data.referer = ${MESSAGE.TARGET.SANDBOX};
        sendMessage(data);
      } else if (data.target === ${MESSAGE.TARGET.SANDBOX}) {
        // Correct target.
      } else if (data.target === ${MESSAGE.TARGET.ADDON}) {
        // Resend this message to the addon.
      } else {
        throw "Incorrect target!";
      }
    }
  }
}

window.addEventListener("message", handleIncomingMessages, false);


inject(mainPage, { tmp: 1 }); /* mainPage is injected by Grunt */