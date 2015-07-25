'use strict';

var concat = require('gulp-concat');
var gulp = require('gulp');
var jade = require('gulp-jade');
var ridecss = require('ride-css');
var stylus = require('gulp-stylus');

gulp.task('default', ['stylus'], function () {
  console.log('I\'ve done everything.');
});

gulp.task('make-datagrid', function () {
  gulp.src([
    'lib/$wrapper-start.js',
    'lib/directives/octod-datagrid.js',
    'lib/services/Cell.js',
    'lib/services/Row.js',
    'lib/services/Pagination.js',
    'lib/services/Datagrid.js',
    'lib/$wrapper-end.js'
  ])
  .pipe(concat('octod-datagrid.js'))
  .pipe(gulp.dest(__dirname))
});

gulp.task('stylus', function () {
  gulp.src('lib/stylus/octod-datagrid.styl')
  .pipe(stylus({
    use: [ridecss()]
  }))
  .pipe(gulp.dest(__dirname));
});

module.exports = gulp;
