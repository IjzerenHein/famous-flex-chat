/*global module, process*/
/*eslint no-use-before-define:0 */

var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');
var path = require('path');

// Support for extra commandline arguments
var argv = require('optimist')
            //--env=XXX: sets a global ENV variable (i.e. window.ENV='XXX')
            .alias('e','env').default('e','dev')
            //--minify:  minifies output
            .alias('m','minify')
            .argv;

var config = {
  context: path.join(__dirname, 'src'),
  entry: ['./main'],
  output:{
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: isDevServer() ? '/' : ''
  },
  devServer: {
    publicPath: '/'
  },
  reload: isDevServer() ? 'localhost' : null,
  module:{
    loaders:[
      { test: /\.json$/,            loader: 'json-loader' },
      { test: /\.css$/,             loader: 'style-loader!css-loader' },
      { test: /\.handlebars$/,      loader: 'handlebars-loader' },
      { test: /\.(png|jpg|gif)$/,   loader: 'url-loader?limit=5000&name=[path][name].[ext]&context=./src' },
      { test: /\.eot$/,             loader: 'file-loader?name=[path][name].[ext]&context=./src' },
      { test: /\.ttf$/,             loader: 'file-loader?name=[path][name].[ext]&context=./src' },
      { test: /\.svg$/,             loader: 'file-loader?name=[path][name].[ext]&context=./src' },
      { test: /\.woff$/,            loader: 'file-loader?name=[path][name].[ext]&context=./src' },
      { test: /index\.html$/,       loader: 'file-loader?name=[path][name].[ext]&context=./src' }
    ]
  },
  resolve: {
    alias: {
      'famous-flex': 'famous-flex/src',
      'famous': 'famous/src'
    }
  },
  plugins:[
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
      ENV: JSON.stringify(argv.env)
    })
  ]
};

if (argv.minify) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({mangle:false}));
}

function isDevServer() {
  return process.argv.join('').indexOf('webpack-dev-server') > -1;
}

module.exports = config;
