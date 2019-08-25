const path = require('path');
const TSDocgenPlugin = require('react-docgen-typescript-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (baseConfig, env, config) => {
  // TODO: Add this less hackily
  config.module.rules[0].use[0].options.plugins.push('@babel/plugin-transform-modules-commonjs');
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('ts-loader'),
    options: {
      configFile: path.resolve(__dirname, '../tsconfig/storybook.json'),
    },
  });
  config.plugins.push(new TSDocgenPlugin());
  config.resolve.extensions.push('.ts', '.tsx');
  config.plugins.push(new MonacoWebpackPlugin());
  return config;
};
