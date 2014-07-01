module.exports = function(grunt) {
  var appConfig = grunt.file.readJSON("./config.json");
  
  
  grunt.initConfig({
    requirejs: {
      normal: {
        options: {
          baseUrl: "./build",
          name: "../vendor/almond",
          optimize: "uglify2",
          include: ["main"],
          insertRequire: ["main"],
          out: "./dist/ytcenter.js",
          wrap: true,
          generateSourceMaps: true,
          preserveLicenseComments: false,
          useSourceUrl: true
        }
      }
    },
    concat: {
      dev: {
        src: [
          "vendor/require.js",
          "dist/ytcenter.js"
        ],
        dest: "ytcenter.js"
      },
      production: {
        src: [
          "dist/ytcenter.min.js"
        ],
        dest: "ytcenter.js"
      }
    },
    uglify: {
      production: {
        src: [
          "vendor/require.js",
          "dist/ytcenter.js"
        ],
        dest: "dist/ytcenter.min.js"
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
        tasks: ["default"]
      }
    },
    replace: {
      userscript: {
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
    clean: {
      pre: ["./build/", "./dist/"],
      after: ["./build/"]
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  
  grunt.registerTask("default", [
    "clean:pre",
    "copy:all",
    "replace:userscript",
    "requirejs:normal",
    "clean:after"
  ]);
};