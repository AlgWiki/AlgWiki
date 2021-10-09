import HtmlWebpackPlugin from "html-webpack-plugin";
import merge from "webpack-merge";

import { common } from "./webpack.common";

export default merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Alg.Wiki",
      template: "../entry.html",
      publicPath: "/assets/",
      filename: "entry.html",
    }),
  ],
});
