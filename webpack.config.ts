import { Configuration } from 'webpack';
import { resolve } from 'path';
import nodeExternals from 'webpack-node-externals';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

interface ConfigurationOptions {
  entry: Configuration['entry'];
  target: Configuration['target'];
  [otherOptions: string]: any;
}
const createConfiguration = (
  tsConfigFile: string,
  options: ConfigurationOptions,
): Configuration => ({
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
            configFile: tsConfigFile,
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
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dist'),
  },
  ...options,
});

export default <Configuration[]>[
  createConfiguration('tsconfig.server.json', {
    entry: {
      server: './src/server/index.ts',
    },
    target: 'node',
    externals: [nodeExternals()],
    node: {
      __filename: false,
      __dirname: false,
    },
  }),
  createConfiguration('tsconfig.client.json', {
    entry: {
      client: './src/client/index.tsx',
    },
    target: 'web',
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM',
    // },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/client/index.html',
        inject: 'body',
        filename: 'client.html',
        chunks: ['client'],
      }),
      new MonacoWebpackPlugin(),
    ],
    node: {
      fs: 'empty',
    },
    output: {
      filename: '[name].js',
      path: resolve(__dirname, 'dist', 'client'),
      publicPath: '/',
    },
  }),
];
