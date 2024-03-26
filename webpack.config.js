const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production', // Set mode to production
  entry: './src/js/index.js', // Assuming you have an index.js file as the entry point for your JavaScript
  output: {
    filename: 'curate_bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true, // Enable minimization
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true // Exclude function names from being mangled
          // Add any other options you need
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js/core'),
        use: 'babel-loader' // Add any other loaders you need for JavaScript files
      },
      {
        test: /\.html$/,
        include: path.resolve(__dirname, 'src/templates'),
        use: 'html-loader'
      }
    ]
  }
};
