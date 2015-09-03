'use strict';

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var fs = require("fs");
var gulp = require('gulp');
var gulpJsdoc2md = require("gulp-jsdoc-to-markdown");
var gutil = require("gulp-util");
var jade = require('gulp-jade');
var ridecss = require('ride-css');
var stylus = require('gulp-stylus');

gulp.task('default', ['jade', 'make-datagrid', 'stylus'], function () {
  gulp.src([
    'octod-datagrid.css',
    'octod-datagrid.js',
    'octod-datagrid.html'
  ])
  .pipe(gulp.dest('./test'));
});

gulp.task('docs', function() {
  gulp.src('./octod-datagrid.js')
  .pipe(concat('docs.md'))
  .pipe(gulpJsdoc2md({ template: fs.readFileSync('./lib/readme.hbs', 'utf8') }))
  .on('error', function(err){
    gutil.log('Building docs failed due to:', err.message);
  })
  .pipe(gulp.dest('docs'));
});

gulp.task('jade', function () {
  gulp.src('lib/jade/partials/octod-datagrid.jade')
  .pipe(jade({
    basedir: __dirname
  }))
  .pipe(gulp.dest(__dirname))
  .pipe(gulp.dest('./test/partials'));
});

gulp.task('make-datagrid', function () {
  gulp.src([
    'lib/$wrapper-start.js',
    'lib/directives/octod-datagrid.js',
    'lib/directives/octod-enter.js',
    'lib/directives/octod-esc.js',
    'lib/directives/octod-style.js',
    'lib/providers/$octodDatagrid.js',
    'lib/services/Cell.js',
    'lib/services/Row.js',
    'lib/services/Pagination.js',
    'lib/services/Limiter.js',
    'lib/services/Datagrid.js',
    'lib/services/DatagridAsync.js',
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
  .pipe(autoprefixer({
    browser: ['last 2 versions'],
    cascade: false
  }))
  .pipe(gulp.dest(__dirname));
});

module.exports = gulp;
