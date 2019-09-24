# Alg.Wiki

_Computer science algorithm database_

**Attention: This project is still in early development and is not yet usable.**

## Developing locally

**Prerequisites:**

- Docker

```sh
docker
```

Or install:

- Node.js
- Yarn

**Running:**

On first run: `bolt`

```sh
# Start local development server (web frontend, all platform backends, watches for changes)
# bolt dev # TODO
bolt dev:build
bolt dev:run

# Start mock AWS in Docker:
npm run dev:docker

# In a new terminal:
npm run dev:docker:terminal
pulumi stack init local
bolt w @alg/infrastructure deploy -y
```

## Other Commands

```sh
# Start watching for changes and running in development mode
npm run dev
# Or: npm run dev <package_name>

# Developing frontend components (watches React components in an isolated environment)
npm run dev:storybook
```

To do development on multiple at once (eg. `common` and `web`) run the dependency's dev command first, then the next package's dev command once the dependency is built.

```sh
npm run dev common
# Wait until common is built then in a new terminal:
npm run dev web
```

If these commands are foreign to you, see the [dev guide](https://github.com/jakzo/alg-wiki/wiki/Setting-Up-an-Efficient-Dev-Environment) for detailed instructions.
