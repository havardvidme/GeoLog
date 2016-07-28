'use strict';

var prefixUrls = function (arr, prefix) {
  for (var i = 0, j = arr.length; i < j; i++) {
    arr[i] = prefix + arr[i];
  }
  return arr;
};

var connect = require('gulp-connect');
var gulp = require('gulp');
var pug = require('gulp-pug');

var config = {
  vendorjs: [
    'bower_components/lodash/dist/lodash.min.js',
    'bower_components/react/react.min.js',
    'bower_components/react/react-dom.min.js'
  ],
  vendorcss: [
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
  ]
}

gulp.task('connect', function () {
  connect.server();
});

gulp.task('pug-build', function () {
  var locals = {
    styles: prefixUrls(config.vendorcss, '../'),
    scripts: prefixUrls(config.vendorjs, '../')
  };
  gulp.src('src/pug/*.pug')
    .pipe(pug({
      locals: locals,
      pretty: true
    }))
    .pipe(gulp.dest('build/'));
});
gulp.task('pug-dist', function () {
  gulp.src('src/pug/*.pug')
    .pipe(pug({
      pretty: false
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['pug-build', 'pug-dist', 'connect'], function () {
  gulp.watch('src/pug/**/*.pug', ['pug-build', 'pug-dist']);
});
