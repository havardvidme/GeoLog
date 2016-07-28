'use strict';

var connect = require('gulp-connect');
var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('connect', function () {
  connect.server();
});

gulp.task('pug-build', function () {
  gulp.src('src/pug/*.pug')
    .pipe(pug({
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
