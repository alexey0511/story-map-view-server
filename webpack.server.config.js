const path = require("path")
const fs = require("fs")
const CopyWebpackPlugin = require('copy-webpack-plugin')


// -- Webpack configuration --

const config = {
  entry: './src/server/index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, "dist"),
    filename: "server.js",
  },
  resolve: {
    extensions: [ ".js" ]
  },
  externals: fs.readdirSync("node_modules")
    .reduce(function(acc, mod) {
      if (mod === ".bin") {
        return acc
      }

      acc[mod] = "commonjs " + mod
      return acc
    }, {}),
    node: {
      console: false,
      global: false,
      process: false,
      Buffer: false,
      __filename: false,
      __dirname: false,
    },
    plugins: [
      new CopyWebpackPlugin([
        { from: './src/server/server-static', to: '.'},
        { from: 'package.json', to: '.'}
      ])
    ],
    module: {
      loaders: [
        {
          enforce: 'pre', // lint files before they are transformed, config in .eslintrc.json
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader' // config in .babelrc
        }
      ]
    }
}


module.exports = config
