const path = require("path")

const HTMLWebpackPlugin = require("html-webpack-plugin")
const HTMLWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin")

module.exports = {
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  entry: [path.resolve(__dirname, "demo.tsx")],
  output: {
    path: path.resolve(__dirname, "../docs"),
    filename: "[name].[chunkhash].js",
    chunkFilename: "[name].[chunkhash].js",
  },
  plugins: [
    new HTMLWebpackPlugin({
      alwaysWriteToDisk: true,
      minify: true,
      template: path.resolve(__dirname, "demo.html"),
      filename: path.resolve(__dirname, "../docs/index.html"),
    }),
    new HTMLWebpackHarddiskPlugin(),
  ],
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ],
  },
}
