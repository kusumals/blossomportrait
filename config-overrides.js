const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallbacks for node core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "buffer": require.resolve("buffer/"),
    "fs": false,
    "http": false,
    "https": false,
    "url": false,
    "util": false,
    "assert": false,
    "vm": false,
    "tls": false,
    "net": false,
    "zlib": false
  };
  
  // Add ProvidePlugin for Buffer and process
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser.js'
    })
  );
  
  return config;
};