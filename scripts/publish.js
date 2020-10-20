var ghpages = require('gh-pages');

ghpages.publish('build', function (err) {
  if (!err) {
    console.log('上传成功');
  }
});
