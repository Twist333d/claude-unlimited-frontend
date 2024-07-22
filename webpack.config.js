const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addWebpackModuleRule({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  })
);