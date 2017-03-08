# gulp-js-url-adjuster

Find the urls in your js files, and prepend and append strings of that url.

---

```js
// example gulpfile.js
var gulp = require('gulp');
var urlAdjuster = require('gulp-js-url-adjuster');

var options = {
  prepend: 'http://prepend/', // prepend /foo/bar
  append: '?@MD5',// resolve the url and append the md5 of that file to the url
  root: 'test', // use the root path to resolve the file
  filter: function (url) {
    return /^\/foo/.test(url);
  } // only change the absolute url start with /foo
};

gulp.task('default', function () {
  gulp.src('jsfile.js')
    .pipe(urlAdjuster(options))
    .pipe(gulp.dest('./'));
});
```

```js
// jsfile.js

var a = '/some/url.png';
var b = '/foo/bar.jpg';
var c = 'foo/bar.jpg';
function d (x, y) {
  return x + y + '/foo/some/other/url.gif';
}
```

```js
// result js file
var a = '/some/url.png';
var b = 'http://prepend/foo/bar.jpg?<jpg md5 value>';
var c = 'foo/bar.jpg';
function d (x, y) {
  return x + y + 'http://prepend/foo/some/other/url.gif?<gif md5 value>';
}
```

# Note
- currently only work for absolute urls
- use the same url adjuster as [gulp-ex-css-url-adjuster](https://github.com/xiaohu-developer/gulp-ex-css-url-adjuster)

# Todo
- [ ]Support relative url
