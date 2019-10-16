const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  devtool: 'source-map',
  devServer: {
    open: true,
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }, {
      test: selectedPreprocessor.fileRegexp,
      use: [{
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader',
          options: {
            modules: false,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: selectedPreprocessor.loaderName,
          options: {
            sourceMap: true
          }
        },
      ]
    }, {
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
              asset(path) {
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
    }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: false,
      template: './' + src_Path + '/index.twig',
      filename: 'index.html'
    })
  ]
};
