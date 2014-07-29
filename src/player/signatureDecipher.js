define(["player/config", "utils", "xhr"], function(config, utils, request){
  function swapHeadAndPosition(arr, pos) {
    var head = arr[0];
    var other = arr[pos % arr.length];
    arr[0] = other;
    arr[pos] = head;
    return arr;
  }
      
  function setDecipherRecipe(aRecipe) {
    recipe = aRecipe;
  }
  
  function getDecipherRecipe() {
    return recipe;
  }
  
  function decipherSignature(cipheredSignature) {
    var cipherArray = cipheredSignature.split("");
    var definedFunctions = {};
    for (var i = 0, len = recipe.length; i < len; i++) {
      if (recipe[i].func === "function") {
        definedFunctions[recipe[i].name] = new Function("a", "b", recipe[i].value);
      } else if (recipe[i].func === "call") {
        cipherArray = definedFunctions[recipe[i].name](cipherArray, recipe[i].value);
      } if (recipe[i].func === "code") {
        cipherArray = new Function("a", recipe[i].value + ";return a;")(cipherArray);
      } else if (recipe[i].func === "swapHeadAndPosition") {
        cipherArray = swapHeadAndPosition(cipherArray, recipe[i].value);
      } else if (recipe[i].func === "slice") {
        cipherArray = cipherArray.slice(recipe[i].value);
      } else if (recipe[i].func === "reverse") {
        cipherArray = cipherArray.reverse();
      }
    }
    return cipherArray.join("");
  }
  
  function loadDecipherRecipe(callback, error) {
    var cfg = config.getConfig();
    if (cfg && cfg.assets && cfg.assets.js) {
      var url = cfg.assets.js;
      
      var regexCode = /function [a-zA-Z$0-9]+\(a\){a=a\.split\(""\);(.*?)return a\.join\(""\)}/g;
      var regexCodeFunctions = /a=([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)\(a,([0-9]+)\)/g;
      var regexCodeFunctions2 = /([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)\(a,([0-9]+)\)/g;
      var regexParts = /function [a-zA-Z$0-9]+\(a\){a=a\.split\(""\);(((a=([a-zA-Z$0-9]+)\(a,([0-9]+)\);)|(a=a\.slice\([0-9]+\);)|(a=a\.reverse\(\);)|(var b=a\[0\];a\[0\]=a\[[0-9]+%a\.length\];a\[[0-9]+\]=b;)))*return a\.join\(""\)}/g;

      request({
        method: "GET",
        url: url,
        onload: function(r) {
          var text = r.responseText;
          var decipherRecipe = [];
          if (text.match(regexParts)) {
            var arr = regexParts.exec(text)[0].split("{")[1].split("}")[0].split(";");
            
            for (var i = 1, len = arr.length - 1; i len; i++) {
              var token = arr[i];
              if (token.indexOf("a.slice") !== -1) {
                var value = token.split("(")[1].split(")")[0];
                decipherRecipe.push({ func: "slice", value: parseInt(value, 10) }); // Slice
              } else if (token.indexOf("a.reverse") !== -1) {
                decipherRecipe.push({ func: "reverse", value: null }); // Reverse
              } else if ((arr[i] + ";" + arr[i+1] + ";" + arr[i+2]).indexOf("var b=a[0];a[0]=a[") !== -1) {
                var value = (arr[i] + ";" + arr[i+1] + ";" + arr[i+2]).split("var b=a[0];a[0]=a[")[1].split("%")[0];
                decipherRecipe.push({ func: "swapHeadAndPosition", value: parseInt(value, 10) }); // swapHeadAndPosition
                i = i+2;
              } else { // swapHeadAndPosition (maybe it's deprecated by YouTube)
                var value = b.split("(a,")[1].split(")")[0];
                decipherRecipe.push({ func: "swapHeadAndPosition", value: parseInt(value, 10) });
              }
            }
          } else if (text.match(regexCode)) {
            var value = regexCode.exec(text)[1];
            var reg = regexCodeFunctions2;
            var noReturn = true;
            if (value.match(regexCodeFunctions)) {
              reg = regexCodeFunctions;
              noReturn = false;
            }
            
            if (value.match(reg)) {
              var commonObject = null;
              var functions = value.split(";");
              
              var methods = [];
              var methodValues = [];
              
              for (var i = 0, len = functions.length - 1; i < len; i++) {
                var tokens = reg.exec(functions[i]);
                if (commonObject !== tokens[1] && commonObject !== null) {
                  throw "Unknown cipher method!";
                } else {
                  commonObject = tokens[1];
                }
                methods.push(tokens[2]);
                methodValues.push(tokens[3]);
              }
              
              var functionRegex = "var " + utils.escapeRegExp(commonObject) + "=\\{";
              
              var uniqueMethods = utils.removeDuplicates(methods);
              for (var i = 0, len = uniqueMethods.length; i < len; i++) {
                if (i > 0) prefix += ",";
                functionRegex += utils.escapeRegExp(uniqueMethods[i]) + ":function\\(([a-zA-Z0-9,]+)\\)\\{(.*?)\\}";
              }
              
              functionRegex += "\\}";
              
              var regexMethod = new RegExp(functionRegex, "g");
              var definedFunctions = regexMethod.exec(text);
              
              ytcenter.settings['signatureDecipher'] = [];
              
              for (var i = 0, len = uniqueMethods.length; i < len; i++) {
                var func = definedFunctions[i*2 + 2];
                decipherRecipe.push({ func: "function", name: uniqueMethods[i], value: func + (noReturn ? ";return a;" : "") });
              }
              
              for (var i = 0, len = methods.length; i < len; i++) {
                decipherRecipe.push({ func: "call", name: methods[i], value: methodValues[i] });
              }
            } else {
              decipherRecipe.push({ func: "code", value: value });
            }
            
            callback(decipherRecipe);
          } else {
            if (typeof error === "function") {
              error("Could not parse signature decipher.");
            }
          }
        },
        onerror: function() {
          if (typeof error === "function") {
            error("Could not load the HTML5 player javascript file.");
          }
        }
      });
    } else {
      if (typeof error === "function") {
        error("HTML5 player javascript file were not found!");
      }
    }
  }
  
  function isReady() {
    return utils.isArray(recipe);
  }
  
  var recipe = null;
  
  return {
    setDecipherRecipe: setDecipherRecipe,
    getDecipherRecipe: getDecipherRecipe,
    decipherSignature: decipherSignature,
    loadDecipherRecipe: loadDecipherRecipe,
    isReady: isReady
  };
});