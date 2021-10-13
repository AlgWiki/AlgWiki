Hi! 👋 Contributions are welcome -- feel free to open a PR for small fixes or open an issue for bigger changes, discussion or if unsure about how to implement something.

## Dev Instructions

Prerequisites:

- Node.js
- Yarn

Before starting, install dependencies with:

```sh
yarn
```

Common commands are:

```sh
yarn workspace @algwiki/website dev
yarn workspace @algwiki/infrastructure localstack
yarn workspace @algwiki/infrastructure pulumi up
yarn test:watch
yarn lint:fix
```

See [package.json](./package.json) for more.

## Releasing changes

When you run `git push` you should be prompted to add a changeset if one doesn't already exist. This will ask for a description for the change to appear in the changelog as well as the type of bump (major, minor or patch) to make to the package. A PR without a changelog will not perform a release or bump the package version.
