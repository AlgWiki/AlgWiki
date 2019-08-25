// const withImages = require('next-images');
// const withCSS = require('@zeit/next-css');
// const withMonacoEditor = require('./with-monaco-editor');

// module.exports = (_phase, { defaultConfig }) => {
//   const config = {
//     ...defaultConfig,
//     webpack: {
//       ...defaultConfig.webpack,
//       plugins: defaultConfig.webpack.plugins.filter(
//         plugin => plugin.constructor.name !== 'ForkTsCheckerWebpackPlugin',
//       ),
//     },
//   };
//   console.log({ config });
//   return withMonacoEditor(withImages(withCSS(config)));
// };

// Once https://github.com/zeit/next.js/issues/8331 is resolved, we'll be able to disable
// type-checking in Next since we're already doing it with tsc

module.exports = {
  poweredByHeader: false,
};
