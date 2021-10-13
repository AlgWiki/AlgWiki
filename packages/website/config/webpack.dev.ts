import HtmlWebpackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";
import "webpack-dev-server";

import { common } from "./webpack.common";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: { publicPath: "/assets/", directory: "../dist" },
    historyApiFallback: { index: "/assets/entry.html" },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "AlgWiki (DEV)",
      template: "../entry.html",
      publicPath: "/assets/",
      filename: "entry.html",
    }),
  ],
});
