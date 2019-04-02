const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  let prodPlugins = [];
  if (argv.mode === 'production') {
    prodPlugins = [
      new FaviconsWebpackPlugin(path.join(__dirname, 'public', 'favicon.png')),
      new CopyWebpackPlugin([
        { from: 'public', to: './'}
      ]),
      new webpack.NamedModulesPlugin()
    ]
  }
  return {
    entry: {
      main: './src/index.tsx',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                plugins: ['react-hot-loader/babel'],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true // HMR doesn't work without this
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },
    plugins: [
      ...prodPlugins,
      new HtmlWebpackPlugin({
        title: 'nodesmith.io',
        template: path.join(__dirname, 'template.index.html'),
        chunks: ['main'],
        filename: 'index.html'
      })
    ],
    devServer: {
      contentBase: path.resolve('public'),
      port: 3330,
      headers: {
        "Set-Cookie": `apiHost=http://localhost:8081;`
      }
    },
    performance: { hints: false }
  };
};
