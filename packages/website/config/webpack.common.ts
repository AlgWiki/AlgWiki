import path from "path";

import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import webpack from "webpack";
import "webpack-dev-server";

const PACKAGE_DIR = path.join(__dirname, "..");

export const common: webpack.Configuration = {
  entry: "../entry.ts",
  output: {
    filename: "index.js",
    path: path.join(PACKAGE_DIR, "dist"),
  },
  cache: {
    type: "filesystem",
  },
  plugins: [
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
