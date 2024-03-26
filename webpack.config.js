const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js', // Assuming you have an index.js file as the entry point for your JavaScript
  output: {
    filename: 'curate_bundle.js',
    path: path.resolve(__dirname, 'dist')
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
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/external/externalPlugins.html', // Path to your HTML template
      filename: 'curate_modules.html', // Output filename
      scriptLoading: 'defer' // Add 'defer' attribute to script tags
    })
  ]
};