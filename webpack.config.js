const path = require('path');
const webpack = require('webpack');
const packageJson = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: `[name]_${packageJson.version}.js`,
    path: path.resolve(__dirname, `dist/${packageJson.version}`),
    chunkFilename: '[name].[chunkhash].js',
    globalObject: 'this'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VERSION': JSON.stringify(packageJson.version),
    }),
    // new BundleAnalyzerPlugin(),
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
      maxSize: 200000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      'spark-md5': path.resolve(__dirname, 'node_modules/spark-md5/spark-md5.js')
    }
  }
};