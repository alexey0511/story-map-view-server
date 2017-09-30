const webpack = require('webpack');
const path = require('path');

const config = {
  devtool: 'inline-source-map',

  entry: ["webpack-hot-middleware/client", path.resolve(__dirname, 'src/client/index.js')],
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader'] }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ]

}

module.exports = config
