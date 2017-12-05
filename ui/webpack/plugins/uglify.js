'use strict';

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = ({env}) => env === 'production' && new UglifyJSPlugin({
  uglifyOptions: {
    ecma: 8,
  },
  mangle: {
    except: ['$super', '$', 'exports', 'require', 'angular']
  },
  compress: {
    warnings: false,
    screw_ie8: true,
    conditionals: true,
    unused: true,
    comparisons: true,
    sequences: true,
    dead_code: true,
    evaluate: true,
    if_return: true,
    join_vars: true,
    collapse_vars: true,
    reduce_vars: false
  },
  output: {
    comments: false,
  },
});
