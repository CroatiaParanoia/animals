const fabric = require('@umijs/fabric');

module.exports = {
  ...fabric.prettier,
  // 一行最多 100 字符
  printWidth: 100,
  // 使用 2 个空格缩进
  tabWidth: 2,
};
