# `@alg-wiki/electron`

This package is responsible for packaging AlgWiki into an electron application.
The purpose of this is to be able to compile/execute code on the customers computer, which is not viable to do in a Browser-only environment.

It also allows offline access to the puzzles and challenges, so that an internet connection isn't always required.

## Developing

This is a little overview of a few important items while working on this package.

#### How to run it in development mode

```bash
yarn workspace @alg-wiki/electron dev
```

This works by:

- Running the `@alg-wiki/website` package in development mode (this installs an auto-reload hook, so the renderer automatically reloads on changes there)
- Running `tsc` in watch mode to transpile all TS in this package
- Running a `nodemon` script which will run and restart the electron main process whenever `tsc` outputs new changes

#### How the app runs in production

- The `electron-builder` package handles most of the distribution
- The `@alg-wiki/website` package is built and compiled into the app

#### The `electron` dependency is pinned to a specific version

This is because `electron-builder` wants to find and be sure of an exact version.
See the discussion here: https://github.com/electron-userland/electron-builder/issues/3984#issuecomment-547115107

When installing and upgrading `electron`, we just have to be explicit about which version.
