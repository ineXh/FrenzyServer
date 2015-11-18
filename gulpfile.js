/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    jshint = require('gulp-jshint'),
	//obfuscate = require('gulp-obfuscate'),
	uglify = require('gulp-uglify');

// define the default task and add the watch task to it
//gulp.task('default', ['watch']);
gulp.task('default', function () {
    return gulp.src('source/js/**/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('public/js'));
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('source/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('uglify', function() {
  return gulp.src('source/js/**/*.js')
  //return gulp.src(['source/js/**/*.js', 'source/js/**/*.jsx'])
  .pipe(uglify())
	.pipe(gulp.dest('public/js'));
});
gulp.task('obfuscate', function() {
  return gulp.src('source/js/**/*.js')
  //return gulp.src(['source/js/**/*.js', 'source/js/**/*.jsx'])
    .pipe(obfuscate())
	.pipe(uglify())
	.pipe(gulp.dest('public/js'));
});


// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
  gulp.watch('source/js/**/*.js', ['uglify']);
});
