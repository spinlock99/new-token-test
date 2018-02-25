var path = require("path");
var webpack = require("webpack");
var OfflinePlugin = require("offline-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  devtool: 'inline-source-map',
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: __dirname,
    publicPath: "/apps"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      include: __dirname,
      query: {
        presets: ["es2015", "react"],
        plugins: ["transform-object-rest-spread"]
      }
    }]
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      BASEstuff: JSON.stringify("/"),
      FILESTACK_API_KEY: JSON.stringify(process.env.FILESTACK_API_KEY),
      SOCKET: JSON.stringify("http://localhost:8000")
    }),
    new HtmlWebpackPlugin({
      title: "Atomic App Store",
      template: "src/index.ejs"
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map'
    }),
    new OfflinePlugin()
  ],
  devServer: {
    historyApiFallback: true
  }
};
