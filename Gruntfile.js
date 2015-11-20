module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      min: {
          files: grunt.file.expandMapping(['source/**/*.js'],
            'public', {
              rename: function(destBase, destPath) {
                  return destPath.replace('source', 'public').replace('.js', '.js');
              }
          })
      }
    },
    watch : {
      scripts:{
        files: ['source/**/*.js'],
        tasks: ['uglify'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['uglify','watch']);

};
