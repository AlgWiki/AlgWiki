const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = function withMonacoEditor(nextConfig) {
  return {
    ...nextConfig,

    webpack(config, next) {
      // if (!config.plugins) config.plugins = [];
      config.plugins.push(
        new MonacoWebpackPlugin({
          output: 'static/monaco',
          languages: ['javascript', 'typescript', 'css', 'html', 'json'],
        }),
      );

      if (typeof nextConfig.webpack === 'function') config = nextConfig.webpack(config, next);

      return config;
    },
  };
};
