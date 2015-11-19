module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      /*
      build: {
        src: 'source/js/** /*.js',
        dest: 'public/js/build.min.js'
      }
    }*/
      min: {
          files: grunt.file.expandMapping(['source/**/*.js'],
            'public', {
              rename: function(destBase, destPath) {
                  return destPath.replace('source', 'public').replace('.js', '.js');
              }
          })
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
