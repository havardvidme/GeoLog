'use strict';

var _ = require('lodash');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var gulp = require('gulp');
var pug = require('gulp-pug');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var config = {
  reactjs: [
    'Modal.js',
    'PositionItem.js',
    'GeoLog.js'
  ],
  vendorjs: [
    'bower_components/lodash/dist/lodash.js',
    'bower_components/react/react.js',
    'bower_components/react/react-dom.js'
  ],
  vendorcss: [
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
  ],
  vendorfonts: 'bower_components/bootstrap/dist/fonts/*'
}

gulp.task('connect', function () {
  connect.server();
});

gulp.task('vendor-css', function () {
  gulp.src(config.vendorcss)
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('./dist/css/'));
});
gulp.task('vendor-fonts', function () {
  gulp.src(config.vendorfonts)
    .pipe(gulp.dest('./dist/fonts/'));
});
gulp.task('vendor-js', function () {
  gulp.src(config.vendorjs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/js/'));
  var src = _.map(config.vendorjs, function (s) { return s.replace('.js', '.min.js'); });
  gulp.src(src)
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('pug-build', function () {
  var locals = {};
  locals.styles = _.map(config.vendorcss, function (s) { return '../' + s; });
  locals.scripts = _.concat(
    _.map(config.vendorjs, function (s) { return '../' + s; }),
    _.map(config.reactjs, function (s) { return 'js/' + s; })
  );
  gulp.src('src/pug/*.pug')
    .pipe(pug({
      locals: locals,
      pretty: true
    }))
    .pipe(gulp.dest('build/'));
});
gulp.task('pug-dist', function () {
  var locals = {
    styles: ['css/vendor.min.css'],
    scripts: ['js/vendor.min.js', 'js/local.min.js']
  };
  gulp.src('src/pug/*.pug')
    .pipe(pug({
      locals: locals,
      pretty: false
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('react-build', function () {
  var src = _.map(config.reactjs, function (s) { return './src/react/' + s; });
  gulp.src(src)
    .pipe(babel({
      presets: ['react']
    }))
    .pipe(gulp.dest('./build/js/'))
});
gulp.task('react-dist', function () {
  var src = _.map(config.reactjs, function (s) { return './build/js/' + s; });
  gulp.src(src)
    .pipe(concat('local.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});

gulp.task('default', ['vendor-css', 'vendor-fonts', 'vendor-js', 'react-build', 'react-dist', 'pug-build', 'pug-dist', 'connect'], function () {
  gulp.watch('src/pug/**/*.pug', ['pug-build', 'pug-dist']);
  gulp.watch('src/react/**/*.js', ['react-build', 'react-dist']);
});
