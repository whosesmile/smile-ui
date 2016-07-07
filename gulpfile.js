var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var insert = require('gulp-insert');
var minify = require('gulp-minify-css');
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

// sync source
gulp.task('sync:source', function () {
  return gulp.src(['src/images/**/*', 'src/*.*'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
});

// sync js
gulp.task('sync:js', function () {
  return gulp.src(['src/js/**/*'], {
    base: 'src'
  }).pipe(gulp.dest(target)).pipe(connect.reload());
});

// px2rem css files
gulp.task('px2rem', function () {
  return gulp.src(['src/css/**/*'], {
    base: 'src'
  }).pipe(px2rem()).pipe(gulp.dest(target)).pipe(connect.reload());
});

// concat all css files
gulp.task('concat:css', ['px2rem'], function () {
  return gulp.src([
    target + '/css/widget/reset.css',
    target + '/css/widget/global.css',
    target + '/css/widget/flexbox.css',
    target + '/css/widget/space.css',
    target + '/css/widget/text.css',
    target + '/css/widget/list.css',
    target + '/css/widget/form.css',
    target + '/css/widget/checkbox.css',
    target + '/css/widget/**/*',
  ]).pipe(concat('css/ui.css')).pipe(gulp.dest(target)).pipe(connect.reload());
});

// insert debug css
gulp.task('concat:debug', ['concat:css'], function () {
  return gulp.src(target + '/css/ui.css')
    .pipe(insert.prepend('/*! 警告：调试使用 线上需删除 */\n@media only screen and (min-device-width:1366px) {body { max-width: 750px; margin-left: auto !important; margin-right: auto !important; }}\n\n'))
    .pipe(gulp.dest(target + '/css'))
    .pipe(connect.reload());
});

// minify css
gulp.task('minify:css', ['concat:css'], function () {
  return gulp.src(target + '/css/**/*')
    .pipe(minify({
      advanced: false
    }))
    .pipe(gulp.dest(target + '/css'))
    .pipe(connect.reload());
});

// uglify js
gulp.task('uglify:js', function () {
  return gulp.src(['src/js/**/*'], {
    base: 'src'
  }).pipe(uglify()).pipe(gulp.dest(target)).pipe(connect.reload());
});

// watch file change
gulp.task('watch', function () {
  gulp.watch(['src/images/**/*', 'src/*.*'], ['sync:source']);
  gulp.watch(['src/css/**/*'], ['concat:debug']);
});

// connect server
gulp.task('connect', function () {
  connect.server({
    root: [target, '.'],
    port: 3200,
    livereload: true
  });
});

// Default task clean temporaries directories and launch the main optimization build task
gulp.task('default', function () {
  sequence('clean', ['sync:source', 'sync:js', 'concat:debug'], ['connect', 'watch']);
});

// build project
gulp.task('dist', function () {
  target = 'dist/';
  sequence('clean', ['sync:source', 'minify:css', 'uglify:js'], ['connect']);
});
