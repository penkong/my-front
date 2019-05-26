var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const VENDOR_LIBS = [
  'axios',
  'body-parser',
  'cookie-session',
  'express',
  'history',
  'normalize.css',
  'react',
  'react-dom',
  'react-modal',
  'react-redux',
  'react-router-dom',
  'redux',
  'redux-form',
  'redux-thunk',
  'validator'
];



module.exports = {
  entry: {
    bundle: './src/client.js',
    vendor: VENDOR_LIBS //it produce vendor.js
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].[chunkhash].js'
  },
  module: {
    rules: [{
      loader: 'babel-loader', 
      test: /\.js$/,
      exclude: /node_modules/
    },
    {
      test: /\.s?css$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            // you can specify a publicPath here
            // by default it uses publicPath in webpackOptions.output
            publicPath: '../',
            hmr: process.env.NODE_ENV === 'development',
          },
        },
        'css-loader',
        'sass-loader'
      ],
    }],
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'public'),
    historyApiFallback: true,
    publicPath: '/public/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new webpack.optimization.splitChunks({
      names: ['vendor', 'manifest'] //cause of hashing add it for browser ustand vendor change or not by manifest
    }), //pull out duplicate and erase them.
    new HtmlWebpackPlugin({ //we make new html in src and she use as template make new html in dist
      template: 'src/index.html'
    }), //produce new html with all new vendor and stuff
    new webpack.DefinePlugin({ //this is for deploy
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }) //reactjs search for porcessenvnodeenv , dont do error checking so much in prod
  //DEFINEPLUGIN make it available on window scope > add script of node to package 
  ]
};
