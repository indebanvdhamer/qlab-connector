'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = ({devServer}) => [
  {
    test: /\.js$/,
    exclude: [/node_modules/],
    use: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          compact: false,
          cacheDirectory: true,
          presets: ['stage-0', ['es2015', {modules: false, loose: true}]],
          plugins: [
            'syntax-decorators',
            ['angularjs-annotate', {explicitOnly: true}],
            'lodash'
          ]
        }
      }
    ]
  },
  {
    test: /\.html$/,
    use: [
      {loader: 'raw-loader'}
    ]
  },
  {
    test: /\.ejs$/,
    loader: 'ejs-loader'
  },
  {
    test: /\.md$/,
    use: [
      {
        loader: 'html-loader'
      },
      {
        loader: 'markdown-loader',
      }
    ]
  },
  {
    test: /\.css$/,
    use: [
      {loader: 'style-loader'},
      {loader: 'css-loader'},
    ]
  },
  {
    test: /\.scss$/,
    use: devServer
      ? [
        {loader: 'style-loader'},
        {loader: 'css-loader', options: {url: false, importLoaders: 1}},
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer('last 2 versions', 'ie 11')]
          }
        },
        {loader: 'sass-loader'},
      ] : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {loader: 'css-loader', options: {url: false, importLoaders: 1}},
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer('last 2 versions', 'ie 11')]
            }
          },
          {loader: 'sass-loader'},
        ]
      })
  },
  {
    test: /\.(png|jpg|gif|svg)$/,
    use: [
      {loader: 'url-loader', options: {limit: 8192}},
    ]
  }
];
