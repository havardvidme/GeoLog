'use strict';

var connect = require('gulp-connect');
var gulp = require('gulp');

gulp.task('connect', function () {
  connect.server();
});

gulp.task('default', ['connect'], function () {
});
