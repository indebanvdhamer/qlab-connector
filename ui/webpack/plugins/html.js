'use strict';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = ({cwd, devServer}) => new HtmlWebpackPlugin({
  template: path.join(cwd, 'index.ejs'),
  chunks: ['app'],
  hash: false,
});
