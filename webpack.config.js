const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'client/build');
const APP_DIR = path.resolve(__dirname, 'client/app');

const DEV_SERVER_PORT = 8000;

const config = {
  entry: [
    APP_DIR + '/index.jsx',
    APP_DIR + '/index.less'
  ],
  output: {
    path: BUILD_DIR,
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx$/,
      include: APP_DIR,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    },{
      test: /\.less$/,
      loader: "style!css!less",
    }, {
      test: /\.css$/,
      loader: "style!css",
    }]
  },

  devServer: {
    //serves files structure from here, gives proper HTML
    contentBase: './client/',
    port: DEV_SERVER_PORT
  }
};

module.exports = config;