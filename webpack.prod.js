var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var OfflinePlugin = require("offline-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "bin"),
    filename: "bundle.js",
    publicPath: "/apps"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules\/(?!(autotrack|dom-utils))/,
      loader: "babel-loader",
      include: __dirname,
      query: {
        presets: ["es2015", "react"],
        plugins: ["transform-object-rest-spread"]
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify("production") },
      BASEstuff: JSON.stringify("/"),
      FILESTACK_API_KEY: JSON.stringify(process.env.FILESTACK_API_KEY),
      SOCKET: JSON.stringify("https://www.largearcade.com")
    }),
    // TODO: add sourcemaps so it's not so hard to debug
    new webpack.optimize.UglifyJsPlugin(),
    new CopyWebpackPlugin([
      { from: "node_modules/autotrack/autotrack.js" },
      { from: "manifest.json" },
      { from: "images/launch.png" },
      { from: "images/launch-iphone.png" }
    ]),
    new HtmlWebpackPlugin({
      title: "Atomic App Store",
      template: "src/index.ejs"
    }),
    new OfflinePlugin()
  ]
};
