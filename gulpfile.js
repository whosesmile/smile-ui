var path = require('path');
var gulp = require('gulp');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var px2rem = require('gulp-smile-px2rem');

// for dist should be dist
var target = '.tmp/';

/**
 * clean .tmp and dist
 */
gulp.task('clean', function () {
  return gulp.src(['.tmp', 'dist'], {
    read: false
  }).pipe(clean());
});

/**
 * sync app to .tmp
 */
gulp.task('sync', function () {
  return gulp.src(['src/images/**/*', 'src/js/**/*', 'src/*.*'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
});

/**
 * px2rem css files
 */
gulp.task('px2rem', function () {
  return gulp.src(['src/css/**/*'], {
    base: 'src'
  }).pipe(px2rem()).pipe(gulp.dest(target)).pipe(connect.reload());
});

/**
 * angular concat all files
 */
// gulp.task('concat', function () {
//   return gulp.src(['src/css/**/*'])
//     .pipe(concat('base.css'))
//     .pipe(gulp.dest(path.join(target, 'css'))).pipe(connect.reload());
// });

/**
 * watch file change
 */
gulp.task('watch', function () {
  gulp.watch(['src/images/**/*', 'src/*.*'], ['sync']);
  gulp.watch(['src/css/**/*'], ['px2rem']);
});

/**
 * connect server
 */
gulp.task('connect', function () {
  connect.server({
    root: [target, '.'],
    port: 3000,
    livereload: true
  });
});

/**
 *  Default task clean temporaries directories and launch the main optimization build task
 */
gulp.task('default', function () {
  sequence('clean', ['sync', 'px2rem'], ['connect', 'watch']);
});
