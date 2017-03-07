var through = require('through2');
var falafel = require('falafel');
var urlTwister = require('url-twister');
var path = require('path');

var replacer = function replacer (str, options) {
  var filter = options.filter;
  var twisterOpt = {
    prepend: options.prepend,
    root: options.root,
    append: options.append
  };
  var reg = /['"]?([^'"]+\.(?:png|gif|jpg|svg|ico|eot|ttf|woff|otf))['"]?/g;
  var m = reg.exec(str);
  var urls = {};
  while (m) {
    if ((typeof filter === 'function' && filter(m[1])) ||
      (filter instanceof RegExp && filter.test(m[1]))) {
      urls[m[1]] = urlTwister(m[1], null, twisterOpt);
    }
    m = reg.exec(str);
  }
  return Object.keys(urls).reduce(function (ret, path) {
    return ret.replace(path, urls[path]);
  }, str);
};

module.exports = function (options) {
  return through.obj(function (file, enc, cb) {
    if (path.extname(file.path) !== '.js') {
      throw new Error('Only js files are supported.');
    }
    options = options || {};
    var js = falafel(file.contents.toString(), function (node) {
      if (node.type === 'Literal') {
        node.update(replacer(node.source(), options));
      }
    });
    file.contents = new Buffer(js.toString());
    this.push(file);
    cb();
  });
};
