var webpack   = require('webpack');
var path      = require('path');
var fs        = require('fs');
var DeepMerge = require('deep-merge');

//***
//*** shared configuration to both client/server
//***

var sharedConfig = {
  module: {
    loaders: [
      {
        test:    /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel'],
      },
    ]
  }
};

// apply development options (i.e. non-production)
if (process.env.NODE_ENV !== 'production') {
  // more efficient than 'source-map' for bigger projects
  // ... webpack will process source-maps individually for each module 
  //     by eval-ing each module at runtime with it's own sourcemap
  // ... prefixing with # uses the //# comment instead of the older //@ style
  // TODO: better understand #eval-source-map ... is does NOT emit clientBundle.js.map/serverBundle.js.map
  //?sharedConfig.devtool = '#eval-source-map'; 
  sharedConfig.devtool = 'source-map';  // punt for now and use regular source-map (see TODO above)
  sharedConfig.debug   = true;
}

// utility to merge specific configurations with sharedConfig
var deepmerge = DeepMerge(function(target, source, key) {
  if (target instanceof Array) {
    return [].concat(target, source);
  }
  return source;
});

function applySharedConfig(specificConfig) {
  return deepmerge(sharedConfig, specificConfig || {});
}


//***
//*** client-side configuration
//***

var clientConfig = applySharedConfig({
  name:   'client',
  entry:  './src/client/main.js',
  output: {
    path:       path.join(__dirname, 'public/dist'),
    filename:   'clientBundle.js',
    // publicPath: path.join(__dirname, 'public/dist'), ... attempted to use this in conjunction with ... path: path.join(__dirname, 'dist'),
  },
  // TODO: add css to the client-side modules (loaders is our only common point)
  // loaders: [
  //   {test: /\.js$/, exclude: /node_modules/, loader: 'babel!eslint'},
  //   {test: /\.css$/, exclude: /node_modules/, loader: 'style!css'}
  // ],

  // code minify production builds
  // TODO: figure out how to target a *.min.js (e.g. clientBundle.min.js)
  plugins: process.env.NODE_ENV === 'production'
    ? [ new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin() ]
    : [],
});


//***
//*** server-side configuration
//***

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


var serverConfig = applySharedConfig({
  name:   'server',
  entry:  './src/server/main.js',
  target: 'node', // do NOT touch any built-in modules (like fs, path, etc.)
  node: { // configure how webpack deals with node variable ... http://webpack.github.io/docs/configuration.html#node
    __dirname:  true,
    __filename: true
  },
  output: {
    path:     path.join(__dirname, 'dist'),
    filename: 'serverBundle.js'
  },
  externals: nodeModules,
  plugins: [
    // server-side ignores css, etc.
    new webpack.IgnorePlugin(/\.(css|less)$/),
    // utilize source maps
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ],
});



//***
//*** webpack configuration (THIS IS IT)!
//***

// we use an array configurations (server/client) which are processed in parallel
module.exports = [serverConfig, clientConfig];
