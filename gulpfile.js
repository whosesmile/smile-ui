var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
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
  gulp.watch(['src/css/**/*'], ['concat:css']);
});

// connect server
gulp.task('connect', function () {
  connect.server({
    root: [target, '.'],
    port: 3000,
    livereload: true
  });
});

// Default task clean temporaries directories and launch the main optimization build task
gulp.task('default', function () {
  sequence('clean', ['sync:source', 'sync:js', 'concat:css'], ['connect', 'watch']);
});

// build project
gulp.task('dist', function () {
  target = 'dist/';
  sequence('clean', ['sync:source', 'concat:css', 'uglify:js'], ['connect', 'watch']);
});
