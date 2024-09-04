const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
//const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: `[name]_${packageJson.version}.js`,
    path: path.resolve(__dirname, `dist/${packageJson.version}`),  // Version-specific output directory
    chunkFilename: '[name].[chunkhash].js',
    globalObject: 'this'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(packageJson.version),
    }),
    //new BundleAnalyzerPlugin(),  // Include the bundle analyzer plugin
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js/core'),
          path.resolve(__dirname, 'src/js/external'),
          path.resolve(__dirname, 'src/js/workers'),
          path.resolve(__dirname, 'src/js/templates'),
          path.resolve(__dirname, 'src/js/web-components'),
        ],
        use: 'babel-loader'
      },

    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      maxSize: 200000,  // Split chunks larger than 200KB
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
