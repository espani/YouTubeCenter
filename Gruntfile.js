module.exports = function(grunt) {
  /* Utils */
  function escapeXML(xml) {
    return String(xml).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  
  /* Libraries */
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-compress');
  
  /* Loading YouTube Center configurations */
  var appConfig = grunt.file.readJSON("./config.json");
  
  grunt.initConfig({
    requirejs: {
      page: {
        options: {
          baseUrl: "./build",
          name: "../vendor/almond",
          optimize: "none",
          include: ["main"],
          insertRequire: ["main"],
          out: "./build/main-all.js",
          wrap: true,
          generateSourceMaps: true,
          useSourceUrl: true
        }
      },
      sandbox: {
        options: {
          baseUrl: "./build",
          name: "../vendor/almond",
          optimize: "none",
          include: ["main-wrapper"],
          insertRequire: ["main-wrapper"],
          out: "./build/main-wrapper-all.js",
          wrap: true,
          generateSourceMaps: true,
          useSourceUrl: true
        }
      }
    },
    uglify: {
      userscript: {
        options: {
          preserveComments: false
        },
        files: {
          "dist/ytcenter.min.user.js": [ "./dist/ytcenter.user.js" ]
        }
      },
      extension: {
        options: {
          preserveComments: false
        },
        files: {
          "./build/content-script.min.js": [ "./build/content-script.js" ]
        }
      }
    },
    copy: {
      all: {
        files: [
          { expand: true, cwd: "./src/", dest: "./build/", src: ["**/*.js"] }
        ]
      },
      userscript: {
        files: [
          { expand: true, cwd: "./src/.extensions/userscript/", dest: "./build/", src: ["**/*.js"] }
        ]
      },
      firefox: {
        files: [
          { expand: true, cwd: "./src/.extensions/firefox/", dest: "./build/", src: ["**"] }
        ]
      },
      extension: {
        files: [
          { expand: true, cwd: "./assets/", "dest": "./build/data/", src: ["**"] },
          { expand: true, cwd: "./build/", "dest": "./build/data/", src: ["content-script.min.js"] }
        ]
      }
    },
    watch: {
      scripts: {
        files: ["./src/**/*.js"],
        tasks: ["userscript"]
      }
    },
    replace: {
      config: {
        options: {
          patterns: [
            {
              match: /\$\{([0-9a-zA-Z\.\-\_]+)\}/g,
              replacement: function(match, $1){
                if ($1 in appConfig) {
                  return appConfig[$1];
                } else {
                  return "${" + $1 + "}";
                }
              }
            }
          ]
        },
        files: [
          { expand: true, flatten: false, cwd: "./build/", src: "**/*.js", dest: "./build/" }
        ]
      },
      extension: {
        options: {
          patterns: [
            {
              match: /\$\{([0-9a-zA-Z\.\-\_]+)\}/g,
              replacement: function(match, $1){
                if ($1 in appConfig) {
                  return appConfig[$1];
                } else {
                  return "${" + $1 + "}";
                }
              }
            }
          ]
        },
        files: [
          { expand: true, flatten: false, cwd: "./build/", src: ["**", "!data/**"], dest: "./build/" }
        ]
      }
    },
    concat: {
      userscript: {
        files: {
          "./dist/ytcenter.user.js": [ "./build/meta.js", "./build/content-script.js" ],
          "./dist/ytcenter.min.user.js": [ "./build/meta.js", "./build/content-script.min.js" ]
        }
      },
      extension: {
        files: {
          "./build/content-script.js": [ "./build/main-all.js", "./build/main-wrapper-all.js" ]
        }
      }
    },
    clean: {
      pre: ["./build/", "./dist/"],
      after: ["./build/"],
      build: ["./build/"],
      "build-before": ["./build/*", "!./build/content-script.js", "!./build/content-script.min.js"],
      "build-after": ["./build/*", "!./build/data"]
    },
    exec: {
      language: {
        cmd: "java -Dfile.encoding=UTF-8 -jar " + appConfig["language-bin"] + " " + appConfig["language-bin-key"] + " " + appConfig["language-json-file"]
      }
    },
    compress: {
      firefox: {
        options: {
          archive: "./dist/firefox.xpi",
          mode: "zip"
        },
        expand: true,
        cwd: "./build/",
        src: "**/*",
        dest: "./"
      }
    }
  });
  
  grunt.registerTask("wrapInFunction", "Wraps file into a function.", function() {
    var inPath = "./build/main-all.js";
    var outPath = "./build/main-all.js";
    var before = "function mainPage(UserProxy_token, UserProxy_functions, globalSettings, consoleSessionToken) {\n";
    var after = "\n}";
    var content = grunt.file.read(inPath);

    grunt.file.write(outPath, before + content + after);
  });
  
  grunt.registerTask("wrap-contentscript", "Wraps file into a function.", function() {
    var path = "./build/content-script.js";
    
    var before = "(function(){\n";
    var content = grunt.file.read(path);
    var after = "\n})();";

    grunt.file.write(path, before + content + after);
  });
  
  grunt.registerTask("includeSourceMappingFile", "Importign the .map file into the .js file", function() {
    var files = [ "./build/main-all.js", "./build/main-wrapper-all.js" ];
    var cwd = "./build/"
    
    for (var i = 0, len = files.length; i < len; i++) {
      var file = files[i];
      if (grunt.file.isFile(file)) {
        var pattern = /\/\/\# sourceMappingURL=([\w\.\-\_]+)/g;
        var content = grunt.file.read(file);
        
        content = content.replace(pattern, function(match, $1){
          var mapFile = grunt.file.read(cwd + $1);
          
          return "//# sourceMappingURL=data:application/json;base64," + new Buffer(mapFile).toString("base64");
        });
        
        grunt.file.write(file, content);
      }
    }
  });
  
  grunt.registerTask("loadLanguageFile", "Load the language.json file into the memory.", function() {
    appConfig["language-locales"] = grunt.file.read(appConfig["language-json-file"]);
  });
  
  /* Firefox */
  grunt.registerTask("firefox", [
    "build-before-contentscript",
    "setupConfig:firefox",
    "contributors:firefox",
    "build-after-contentscript",
    "prepare-extension",
    "copy:firefox",
    "replace:extension",
    "compress:firefox",
    "clean:build"
  ]);
  
  /* Extension building */
  grunt.registerTask("prepare-extension", [
    "clean:build-before",
    "copy:extension",
    "clean:build-after"
  ]);
  
  grunt.registerTask("build-before-contentscript", [
    "loadLanguageFile",
    "setupConfig:page",
    "copy:all",
    "replace:config",
    "requirejs:page"
  ]);
  
  grunt.registerTask("build-after-contentscript", [
    "copy:all",
    "replace:config",
    "wrapInFunction",
    "requirejs:sandbox",
    "includeSourceMappingFile",
    "concat:extension",
    "wrap-contentscript",
    "uglify:extension",
  ]);
  
  /* Build the userscript */
  grunt.registerTask("userscript", [
    "build-before-contentscript",
    "setupConfig:userscript",
    "copy:userscript",
    "build-after-contentscript",
    "uglify:userscript",
    "concat:userscript",
    "clean:build"
  ]);
  
  /* Compile variables */
  grunt.registerTask("setupConfig:page", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.INJECTED"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.INJECTED.NAME"];
  });
  grunt.registerTask("setupConfig:userscript", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.USERSCRIPT"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.USERSCRIPT.NAME"];
  });
  grunt.registerTask("setupConfig:firefox", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.FIREFOX"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.FIREFOX.NAME"];
  });
  grunt.registerTask("setupConfig:chrome", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.CHROME"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.CHROME.NAME"];
  });
  grunt.registerTask("setupConfig:safari", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.SAFARI"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.SAFARI.NAME"];
  });
  grunt.registerTask("setupConfig:opera", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.OPERA"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.OPERA.NAME"];
  });
  grunt.registerTask("setupConfig:maxthon", "Setting the correct variables", function() {
    appConfig["runtime.browser"] = appConfig["BROWSER.MAXTHON"];
    appConfig["runtime.browser.name"] = appConfig["BROWSER.MAXTHON.NAME"];
  });
  
  grunt.registerTask("contributors:firefox", "Wraps file into a function.", function() {
    var contrib = grunt.file.readJSON("./contributors.json");
    
    if (contrib.translators) {
      var xml = "";
      var translators = contrib.translators;
      for (var i = 0, len = translators.length; i < len; i++) {
        xml += "    <em:translator>" + escapeXML(translators[i].name) + "</em:translator>\n";
      }
      appConfig["translators:xml"] = xml;
    }
    
    if (contrib.contributors) {
      var xml = "";
      var contributors = contrib.contributors;
      for (var i = 0, len = contributors.length; i < len; i++) {
        xml += "    <em:contributor>" + escapeXML(contributors[i].name) + "</em:contributor>\n";
      }
      appConfig["contributors:xml"] = xml;
    }
  });
};