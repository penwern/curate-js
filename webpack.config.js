const path = require("path");
const webpack = require("webpack");
const fs = require("fs-extra"); // You'll need fs-extra to copy files
const packageJson = require("./package.json");
const TerserPlugin = require("terser-webpack-plugin");
//const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "[name]_" + packageJson.version + ".js", // Include version in the filename
    path: path.resolve(__dirname, "dist", packageJson.version), // Version-specific output directory
    chunkFilename: "[name].[chunkhash].js",
    globalObject: "this",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(packageJson.version),
    }),
    //new BundleAnalyzerPlugin(),  // Include the bundle analyzer plugin

    // Custom plugin to handle the creation of the @latest folder
    {
      apply(compiler) {
        compiler.hooks.afterEmit.tapAsync(
          "CopyLatestBuild",
          (compilation, callback) => {
            const versionDir = path.resolve(
              __dirname,
              "dist",
              packageJson.version
            );
            const latestDir = path.resolve(__dirname, "dist", "@latest");

            // Make sure the @latest folder exists
            fs.emptyDirSync(latestDir); // Remove old contents if any

            // Copy the current versioned build to @latest
            fs.copy(versionDir, latestDir, { overwrite: true }, (err) => {
              if (err) {
                console.error("Error copying to @latest folder:", err);
              } else {
                console.log(
                  `Successfully updated @latest folder with version ${packageJson.version}`
                );
              }
              callback(); // Don't forget to call callback to signal Webpack we're done
            });
          }
        );
      },
    },
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, "src/js/core"),
          path.resolve(__dirname, "src/js/external"),
          path.resolve(__dirname, "src/js/workers"),
          path.resolve(__dirname, "src/js/templates"),
          path.resolve(__dirname, "src/js/web-components"),
        ],
        use: "babel-loader",
      },
      {
        test: /\.worker\.js$/,
        include: [path.resolve(__dirname, "src/js/workers")],
        use: { loader: "worker-loader" },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: {
      chunks: "all",
      maxSize: 200000, // Split chunks larger than 200KB
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
