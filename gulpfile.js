'use strict';

var prefixUrls = function (arr, prefix) {
  var res = [];
  for (var i = 0, j = arr.length; i < j; i++) {
    res.push(prefix + arr[i]);
  }
  return res;
};

var concat = require('gulp-concat');
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
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('./dist/js/'));
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
  var locals = {
    styles: ['css/vendor.min.css'],
    scripts: ['js/vendor.min.js']
  };
  gulp.src('src/pug/*.pug')
    .pipe(pug({
      locals: locals,
      pretty: false
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['vendor-css', 'vendor-fonts', 'vendor-js', 'pug-build', 'pug-dist', 'connect'], function () {
  gulp.watch('src/pug/**/*.pug', ['pug-build', 'pug-dist']);
});
