const { default: r } = require('regexr');

// plugin to transpile specific node_modules packages
// See:
//  - https://github.com/zeit/next.js/pull/3732
module.exports = function withTranspileModules(nextConfig) {
  const internalRegExps = nextConfig.transpileModules.map(m => {
    if (typeof m === 'string') return r`${r.escape(m)}(?!.*node_modules)`;
    if (m instanceof RegExp) return m;
    throw new TypeError('transpileModules should contain strings or RegExps only.');
  });

  const externalRegExps = nextConfig.transpileModules.map(m => {
    if (typeof m === 'string') return r`node_modules(?!\/${r.escape(m)}(?!.*node_modules))`;
    return m;
  });

  let rule;

  function createRule(webpackConfig, nextOptions) {
    const { defaultLoaders } = nextOptions;

    webpackConfig.module.rules.push(
      (rule = {
        test: /\.+(js|jsx|ts|tsx)$/,
        loader: defaultLoaders.babel,
        include: [],
      }),
    );
  }

  return {
    ...nextConfig,

    webpack(config, next) {
      config.resolve.symlinks = false;

      // Next runs the dev config first, then the server config, so we reset rule
      // here when Next switches to the server config
      if (next.isServer) rule = null;
      if (!rule) createRule(config, next);

      rule.include = internalRegExps;

      config.externals = config.externals.map(external => {
        if (typeof external !== 'function') return external;
        return (ctx, req, cb) =>
          internalRegExps.some(regex => regex.test(req)) ? cb() : external(ctx, req, cb);
      });

      if (typeof nextConfig.webpack === 'function') config = nextConfig.webpack(config, next);

      return config;
    },

    webpackDevMiddleware(config) {
      const ignored = [...config.watchOptions.ignored, ...externalRegExps];
      config.watchOptions.ignored = ignored;

      if (typeof nextConfig.webpackDevMiddleware === 'function')
        config = nextConfig.webpackDevMiddleware(config);

      return config;
    },
  };
};
