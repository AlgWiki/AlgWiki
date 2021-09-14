import HtmlWebpackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import { common } from "./webpack.common";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "../dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Alg.Wiki (DEV)",
      template: "../entry.html",
    }),
  ],
});
