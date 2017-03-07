var gulp = require('gulp');
var urlAdjuster = require('..');
var rename = require('gulp-rename');

var options = {
  prepend: '/addd/good',
  append: '?@MD5',
  root: 'test',
  filter: function (url) {
    return /^\//.test(url);
  } // absolute url only
};

gulp.task('default', function () {
  gulp.src('jsfile.js')
    .pipe(urlAdjuster(options))
    .pipe(rename(function (path) {
      path.basename += '-vert';
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('throw', function () {
  gulp.src('jsfile.css')
    .pipe(urlAdjuster(options))
    .pipe(rename(function (path) {
      path.basename += '-vert';
    }))
    .pipe(gulp.dest('./'));
});
