const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./__dev__/index.ts",
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "alg.wiki dev",
      template: "./__dev__/index.html",
    }),
    new MonacoWebpackPlugin(),
    // Required because we're using the browserify util module which relies on this
    // Remove it once judgement happens server-side
    new webpack.DefinePlugin({
      "process.env.NODE_DEBUG": JSON.stringify(process.env.NODE_DEBUG),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
};
