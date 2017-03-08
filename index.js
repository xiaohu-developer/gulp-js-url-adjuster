var through = require('through2');
var falafel = require('falafel');
var urlTwister = require('url-twister');
var path = require('path');
var gutil = require('gulp-util');

var PluginName = 'gulp-js-url-adjuster';
var REG = /(?:['"]|url *\() *([^ ()'"]+\.(?:png|gif|jpg|svg|ico|eot|ttf|woff|otf)) *[)'"]/;

var replacer = function replacer (str, opt) {
  var filter = opt.filter;
  var reg = new RegExp(REG, 'g');
  var m = reg.exec(str);
  var urls = {};
  while (m) {
    if ((typeof filter === 'function' && filter(m[1])) ||
      (filter instanceof RegExp && filter.test(m[1]))) {
      urls[m[1]] = urlTwister(m[1], null, opt.twisterOpt);
    }
    m = reg.exec(str);
  }
  return Object.keys(urls).reduce(function (ret, path) {
    return ret.replace(path, urls[path]);
  }, str);
};

module.exports = function (options) {
  options = options || {};
  var replacerOpt = {
    filter: options.filter,
    twisterOpt: {
      prepend: options.prepend,
      root: options.root,
      append: options.append
    }
  };

  return through.obj(function (file, enc, cb) {
    if (path.extname(file.path) !== '.js') {
      throw new gutil.PluginError(PluginName, `[${file.path}] is not a js file.`);
    }
    var js = falafel(file.contents.toString(), function (node) {
      if (node.type === 'Literal' && REG.test(node.source())) {
        node.update(replacer(node.source(), replacerOpt));
      }
    });
    file.contents = new Buffer(js.toString());
    this.push(file);
    cb();
  });
};
