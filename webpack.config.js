const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: `[name]_${packageJson.version}.js`,
    path: path.resolve(__dirname, `dist/${packageJson.version}`),
    chunkFilename: '[name].[chunkhash].js',
    globalObject: 'self'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(packageJson.version),
    }),
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
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: 'all',
      maxSize: 200000,
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
  experiments: {
    outputModule: true,
  }
};