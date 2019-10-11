# Alg.Wiki

_Computer science algorithm database_

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/jakzo/alg-wiki)

**Attention: This project is still in early development and is not yet usable.**

## Development

There are three methods of development:

1. Gitpod - Pre-configured environment, cloud IDE
2. Docker - Pre-configured environment
3. Local

**Gitpod**

Gitpod runs a modified version of VSCode in the browser connected to the project's Docker image running in the cloud. This approach is recommended since it sets everything up for development with minimal effort, least chance of running into issues and all changes are automatically backed up.

To develop using Gitpod, simply open: [gitpod.io#https://github.com/jakzo/alg-wiki](https://gitpod.io/#https://github.com/jakzo/alg-wiki)

**Docker**

You can also run the Docker image on your machine if you'd like to develop locally instead of in Gitpod. This is the recommended approach for local development.

To start it, run:

```sh
docker-compose up --build
```

When this finishes, Docker will be running the project's environment and showing the logs for Localstack (AWS mock).

Exiting this command will stop the container.

To run other commands in the project, open a terminal session inside the container:

```sh
docker-compose exec -u gitpod alg-wiki-dev /bin/bash
# Now you can run commands. Eg: pnpm install some-library
```

Node dependencies are installed to `node_modules_docker` inside Docker (since it's likely a different OS/environment than the local machine meaning some modules may be installed differently) and the correct versions of development tools (like pnpm) are installed inside the Docker container. For these reasons you should run all commands inside the Docker containers instead of directly in the terminal running on your base system.

**Local**

Alternatively you can set up the development environment yourself. This is not recommended as it can be time consuming to set up, prone to error and likely to have environment mistmatches causing issues which are not reproducible on other machines.

See the `Dockerfile` and run these commands as required to install dependencies, set up the environment and run in the background during development.

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
