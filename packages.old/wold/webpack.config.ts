import { Configuration } from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
// @ts-ignore
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
// @ts-ignore
import WebpackBuildNotifierPlugin from 'webpack-build-notifier';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config: Configuration = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  mode,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json', '.css', '.gif', '.png', '.jpg', '.jpeg', '.svg'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(?:gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  target: 'web',
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
    new MonacoWebpackPlugin(),
    new ProgressBarPlugin(),
    new WebpackBuildNotifierPlugin(),
    new CleanWebpackPlugin(['dist']),
  ],
  node: {
    fs: 'empty',
  },
};

export default config;
