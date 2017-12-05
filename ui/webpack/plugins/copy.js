'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = ({cwd}) => new CopyWebpackPlugin([
  {
    context: path.join(cwd, 'fonts'),
    from: '**/*',
    to: 'fonts'
  },
  {
    context: path.join(cwd, 'img'),
    from: '**/*',
    to: 'img'
  },
  {
    context: path.join(cwd, '../../node_modules/font-awesome/fonts'),
    from: '**/*.ttf',
    to: 'fonts'
  },
]);
