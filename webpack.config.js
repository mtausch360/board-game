const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'client/public');
const APP_DIR = path.resolve(__dirname, 'client/app');

const config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
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
    }]
  },
  devServer: {
    contentBase: './',
    port: 8000
  }
};

module.exports = config;