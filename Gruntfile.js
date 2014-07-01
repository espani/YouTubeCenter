module.exports = function(grunt) {
  grunt.initConfig({
    requirejs: {
      compile: {
        options: {
          baseUrl: "./src",
          name: "main",
          optimize: "none",
          out: "dist/ytcenter.js"
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
    }
  });
  
  grunt.registerTask("wrap", "Wraps files in an IIFE.", function() {
    var path = "ytcenter.js";
    var before = "(function() {\n";
    var after = "\n})();";
    var content = grunt.file.read(path);

    grunt.file.write(path, before + content + after);
  });
  
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  
  grunt.registerTask("default", [
    "requirejs",
    "uglify:production",
    "concat:production",
    "wrap"
  ]);
  grunt.registerTask("dev", [
    "requirejs",
    "concat:dev",
    "wrap"
  ]);
};