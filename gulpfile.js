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
    'angular-datagrid.css',
    'angular-datagrid.js',
    'angular-datagrid.html'
  ])
  .pipe(gulp.dest('./test'));
});

gulp.task('docs', function() {
  gulp.src('./angular-datagrid.js')
  .pipe(concat('docs.md'))
  .pipe(gulpJsdoc2md({ template: fs.readFileSync('./lib/readme.hbs', 'utf8') }))
  .on('error', function(err){
    gutil.log('Building docs failed due to:', err.message);
  })
  .pipe(gulp.dest('docs'));
});

gulp.task('jade', function () {
  gulp.src('lib/jade/partials/angular-datagrid.jade')
  .pipe(jade({
    basedir: __dirname
  }))
  .pipe(gulp.dest(__dirname))
  .pipe(gulp.dest('./test/partials'));
});

gulp.task('make-datagrid', function () {
  gulp.src([
    'lib/$wrapper-start.js',
    'lib/directives/angular-datagrid.js',
    'lib/directives/angular-enter.js',
    'lib/directives/angular-esc.js',
    'lib/directives/angular-style.js',
    'lib/providers/$angularDatagrid.js',
    'lib/services/Cell.js',
    'lib/services/Row.js',
    'lib/services/Pagination.js',
    'lib/services/Limiter.js',
    'lib/services/Datagrid.js',
    'lib/services/DatagridAsync.js',
    'lib/$wrapper-end.js'
  ])
  .pipe(concat('angular-datagrid.js'))
  .pipe(gulp.dest(__dirname))
});

gulp.task('stylus', function () {
  gulp.src('lib/stylus/angular-datagrid.styl')
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
