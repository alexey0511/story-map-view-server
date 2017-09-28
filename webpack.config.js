const path = require("path")
const fs = require("fs")
const CopyWebpackPlugin = require('copy-webpack-plugin')


// -- Webpack configuration --

const config = {}

// Application entry point
config.entry = "./src/server/index.js"

// We build for node
config.target = "node"

// Node module dependencies should not be bundled
config.externals = fs.readdirSync("node_modules")
  .reduce(function(acc, mod) {
    if (mod === ".bin") {
      return acc
    }

    acc[mod] = "commonjs " + mod
    return acc
  }, {})

// We are outputting a real node app!
config.node = {
  console: false,
  global: false,
  process: false,
  Buffer: false,
  __filename: false,
  __dirname: false,
}

// Output files in the build/ folder
config.output = {
  path: path.join(__dirname, "dist"),
  filename: "server.js",
}

config.resolve = {
  extensions: [ ".js" ]
}

config.plugins = [
    new CopyWebpackPlugin([{ from: './src/server/server-static', to: '.'}])
]
config.module = {}

config.module.loaders = [
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

module.exports = config
