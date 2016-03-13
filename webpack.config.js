//***
//*** server-side webpack configuration

var webpack = require('webpack');
var path    = require('path');
var fs      = require('fs');

// identify all external node_modules (supplied to externals [below])
// ... unlike client-side, we do NOT wish to package these modules in our server bundle
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/server/main.js',
  target: 'node', // do NOT touch any built-in modules (like fs, path, etc.)
  node: { // configure how webpack deals with node variable ... http://webpack.github.io/docs/configuration.html#node
    __dirname:  true,
    __filename: true
  },
  output: {
    path:     path.join(__dirname, 'dist'),
    filename: 'server.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel'] },
    ]
  },
  externals: nodeModules,
  plugins: [
    // server-side ignores css, etc.
    new webpack.IgnorePlugin(/\.(css|less)$/),
    // utilize source maps
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ],
  devtool: 'sourcemap'
}
