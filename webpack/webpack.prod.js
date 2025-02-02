const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const {
  prod_Path,
  src_Path
} = require('./path');
const {
  selectedPreprocessor
} = require('./loader');

module.exports = {
  entry: {
    main: './' + src_Path + '/index.ts'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, prod_Path),
    filename: '[name].[chunkhash].js'
  },
  //devtool: 'source-map',
  module: {
    rules: [{
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: selectedPreprocessor.fileRegexp,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: selectedPreprocessor.loaderName
          }
        ]
      },  {
        test: /\.twig$/,
        use: [
          {
            loader:'html-loader',
            options: {
              attrs: ['link:href', ':data-src', ':src']
            }
          },
          {
            loader: 'twig-html-loader',
            options: {
              functions: {
                src(path) {
                  // const img = require('./'+src_Path+path);
                  // console.log('./'+src_Path+path, img);
                  return path;
                }
              },
            },
          },
        ]
      }, {
        test: /.*\.(gif|png|jpe?g)$/i,
        use:  [
          {
            loader: 'file-loader?name=[name].[ext]'
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, prod_Path), {
      root: process.cwd()
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      template: './' + src_Path + '/index.twig',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new WebpackMd5Hash()
  ]
};
