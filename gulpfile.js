var path = require('path');
var gulp = require('gulp');
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
 * concat all css files
 */
gulp.task('concat', ['px2rem'], function () {
  return gulp.src([
    target + '/css/widget/reset.css',
    target + '/css/widget/global.css',
    target + '/css/widget/flexbox.css',
    target + '/css/widget/space.css',
    target + '/css/widget/text.css',
    target + '/css/widget/**/*',
  ]).pipe(concat('css/ui.css')).pipe(gulp.dest(target)).pipe(connect.reload());
});

/**
 * watch file change
 */
gulp.task('watch', function () {
  gulp.watch(['src/images/**/*', 'src/*.*'], ['sync']);
  gulp.watch(['src/css/**/*'], ['concat']);
  gulp.watch(['src/*.*'], ['sync']);
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
  sequence('clean', ['sync', 'concat'], ['connect', 'watch']);
});
