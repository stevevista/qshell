'use strict'

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const { dependencies } = require('../package.json')

let whiteListedModules = ['react', 'vue']

const rendererConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: {},
  output: {
    filename: 'renderer.[name].js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '../dist/electron')
  },
  externals: [
    ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
  ],
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  module: {
    rules: [
      {
        test: /\.(yml|yaml)$/,
        loader: 'yml-loader'
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              modifyVars: {
                'body-background': '#333333',
                'component-background': '#333333',
                'text-color': 'fade(#eee, 65%)',
                'text-color-secondary': 'fade(#eee, 45%)',
                'layout-header-background': '#333333',
                'layout-trigger-background': '#3f3f46',
                'layout-body-background': '#333333',
                'btn-default-color': 'fade(#000, 75%)',
                'input-color': 'fade(#000, 75%)',
                'menu-dark-submenu-bg': '#1e1e1e'
              },
              javascriptEnabled: true,
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /(node_modules|fonts)/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react', '@babel/env'],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        ],
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: process.env.NODE_ENV === 'production',
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['dist/electron'], {root: path.resolve(__dirname , '..')}),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  optimization: {
    minimizer: []
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.json', '.css', '.node', '.vue']
  },
  mode: process.env.NODE_ENV,
  target: 'electron-renderer'
}

function getEntries () {
  const entries = []
  const base = path.resolve(__dirname, '../src/renderer')
  for (const name of fs.readdirSync(base)) {
    const entryPath = path.join(base, name, 'index.js')
    if (fs.existsSync(entryPath)) {
      entries.push({name, entryPath})
    }
  }
  return entries
}

getEntries().forEach(entry => {
  rendererConfig.entry[entry.name] = entry.entryPath

  rendererConfig.plugins.push(new HtmlWebpackPlugin({
    filename: entry.name + '.html',
    chunks: [entry.name],
    template: path.resolve(__dirname, '../src/renderer/index.ejs'),
    minify: {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true
    },
    nodeModules: process.env.NODE_ENV !== 'production'
      ? path.resolve(__dirname, '../node_modules')
      : false
  }))
})

/**
 * Adjust rendererConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = ''

  rendererConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/electron/static'),
        ignore: ['.*']
      }
    ])
  )
/*
  rendererConfig.optimization.minimizer.push(new UglifyJsPlugin({
    cache: true,
    parallel: true,
    sourceMap: false
  }))*/
  rendererConfig.plugins.push(new MinifyPlugin())
  rendererConfig.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}))
}

module.exports = rendererConfig
