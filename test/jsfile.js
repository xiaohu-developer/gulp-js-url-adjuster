const falafel = require('falafel');
const pageDmo = {};
pageDmo.html("<span><img src='/absolute.jpg' class='/bar.jpg' alt='产品加载中' title='产品加载中'  /></span>产品加载中……</h2>");

const replacer = function replacer (str) {
  console.log(str);
  const reg = /(['"])([^'"]+\.(?:png|gif|css|jpg)['"])/g;
  return str.replace(reg, '$1good$2');
};
const out = falafel(js, function (node) {
  if (node.type === 'Literal') {
    node.update(replacer(node.source('/absolute.jpg')));
  }
});
console.log(out);
