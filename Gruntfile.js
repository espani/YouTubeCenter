module.exports = function(grunt) {
  var appConfig = grunt.file.readJSON("./config.json");
  
  grunt.initConfig({
    requirejs: {
      normal: {
        options: {
          baseUrl: "./build",
          name: "../vendor/almond",
          optimize: "uglify2",
          include: ["main.page"],
          insertRequire: ["main.page"],
          out: "./dist/main.page.min.js",
          wrap: true,
          preserveLicenseComments: false,
          generateSourceMaps: true,
          useSourceUrl: true
        }
      }
    },
    uglify: {
      userscript: {
        options: {
          preserveComments: true
        },
        files: {
          "dist/ytcenter.min.user.js": [
            "./dist/ytcenter.user.js"
          ]
        }
      }
    },
    copy: {
      all: {
        files: [
          { expand: true, cwd: "./src/", dest: "./build/", src: ["**/*.js"] }
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
              match: /\$\{([0-9a-zA-Z.-_]+)\}/g,
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
      }
    },
    concat: {
      userscript: {
        files: {
          "./dist/ytcenter.user.js": [
            "./build/main.userscript.meta.js",
            "./dist/main.page.named.min.js",
            "./build/main.sandbox.js"
          ]
        }
      }
    },
    clean: {
      pre: ["./build/", "./dist/"],
      after: ["./build/", "./dist/main.page.named.min.js"]
    }
  });
  
  grunt.registerTask("wrapInFunction", "Wraps file into a function.", function() {
    var inPath = "./dist/main.page.min.js";
    var outPath = "./dist/main.page.named.min.js";
    var before = "function mainPage() {\n";
    var after = "\n}";
    var content = grunt.file.read(inPath);

    grunt.file.write(outPath, before + content + after);
  });
  
  grunt.registerTask("sourceMapToDataURI", "Convert the sourcemap url to a data uri.", function() {
    var path = "./dist/main.page.named.min.js";
    var mapPath = "./dist/main.page.min.js.map";
    
    var sourceMap = grunt.file.read(mapPath);
    var dataURI = new Buffer(sourceMap).toString("base64");
    var data = "data:application/json;base64," + dataURI;
    
    var content = grunt.file.read(path);
    content = content.replace("main.page.min.js.map", data);

    grunt.file.write(path, content);
  });
  
  grunt.registerTask("run:page", "Setting the correct variables", function() {
    grunt.task.run("page");
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
  
  grunt.loadNpmTasks("grunt-contrib-requirejs");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-replace");
  
  grunt.registerTask("page", [
    "copy:all",
    "replace:config",
    "requirejs:normal"
  ]);
  
  grunt.registerTask("userscript", [
    "setupConfig:userscript",
    "run:page",
    "wrapInFunction",
    //"sourceMapToDataURI",
    "concat:userscript",
    "uglify:userscript",
    "clean:after"
  ]);
};