'use strict'

const path = require('path')
const webpack = require('webpack')
const MinifyPlugin = require("babel-minify-webpack-plugin")

const { dependencies } = require('../package.json')

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/env"],
              plugins: ['@babel/transform-runtime']
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  optimization: {
    minimizer: []
  },
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  mainConfig.devtool = ''
/*
  mainConfig.optimization.minimizer.push(new UglifyJsPlugin({
    cache: true,
    parallel: true,
    sourceMap: false
  }))*/
  mainConfig.plugins.push(new MinifyPlugin())
}

module.exports = mainConfig
