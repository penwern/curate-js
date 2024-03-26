const path = require('path');

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
        include: [
          path.resolve(__dirname, 'src/js/core'),
          path.resolve(__dirname, 'src/js/external'),
          path.resolve(__dirname, 'src/js/workers')
        ],
        use: 'babel-loader' // Add any other loaders you need for JavaScript files
      }
    ]
  }
};
