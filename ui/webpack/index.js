'use strict';

/* eslint-disable no-console */
const chalk = require('chalk');
const path = require('path');
const loaders = require('./loaders');
const fs = require('fs');

const cwd = path.join(__dirname, '../client');
const pluginsDir = path.join(__dirname, 'plugins');

//Control log levels
const stats = {
  excludeAssets: name => !name.includes('bundle.js'),
  chunks: false,
  children: false,
  colors: true,
  errors: true,
  hash: false,
  maxModules: 0,
  modules: false,
  moduleTrace: false,
  timings: true,
  version: true,
  warnings: true,
};

module.exports = argv => {

  const config = Object.assign({
    env: 'development',
    stats: false,
    devServer: false,
    cwd
  }, argv);

  console.log(chalk.white.bgBlack(`Building for ${chalk.bold(config.env)} environment`), '\n');

  const plugins = fs.readdirSync(pluginsDir).map(file =>
    require(`${pluginsDir}/${file}`)(config)
  ).filter(Boolean);

  const entry = {
    app: ['babel-polyfill', path.join(cwd, '/app/app.js')],
  };

  return {
    devtool: config.devServer && 'sourcemap',
    entry,
    output: {
      filename: `[name].bundle.js`,
      publicPath: '/',
      path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      contentBase: cwd,
      compress: true,
      historyApiFallback: true,
      publicPath: '/',
      host: '0.0.0.0',
      disableHostCheck: true,
      port: 4000,
      stats
    },
    stats,
    plugins,
    module: {
      rules: loaders(config),
    }
  };
};
