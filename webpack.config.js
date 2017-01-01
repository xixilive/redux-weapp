var path = require('path')
var webpack = require('webpack')
var version = require('./package.json').version
module.exports = {
  devtool: null,

  context: path.join(__dirname, 'es6'),

  entry: {
    index: './index'
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'es6'),
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  },

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['es6', 'node_modules']
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        VERSION: JSON.stringify(version)
      }
    })
  ]
}
