import HtmlWebpackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import { common } from "./webpack.common";

export default merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "AlgWiki",
      template: "../entry.html",
      publicPath: "/assets/",
      filename: "entry.html",
    }),
  ],
});
