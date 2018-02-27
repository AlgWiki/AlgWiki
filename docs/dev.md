# Development Guide
This page is designed for people who are new to JS development or unfamiliar with the technologies used in EC. It will give a high-level overview of the tools and technologies used and get you ready to start hacking at the code!

If you are a JavaScript and Git veteran, the sections which will interest you most are:
- [Directory Structure](#directory-structure)
- [Code Style](#code-style)
- [Committing](#committing)


## Setting Up an Efficient Dev Environment
- Install [VS Code](https://code.visualstudio.com/)
  - This is a fairly new free and open-source IDE made by Microsoft
  - It is a solid choice for programming in general but is definitely the best for writing [TypeScript](https://www.typescriptlang.org/) (the language EC is written in)
- Install [nvm](https://github.com/creationix/nvm)
  - This is a version manager for [Node.js](https://nodejs.org/en/)
  - Node.js runs JavaScript outside of a browser
  - EC and all of the build tools associated with it run using Node.js
- Install [avn](https://github.com/wbyoung/avn)
  - This will automatically add the correct version of Node.js to your path when you enter the EC directory in a terminal
- Install [Yarn](https://yarnpkg.com/en/docs/install)
  - Yarn is a package manager for Node.js
  - NPM is the default package manager but Yarn is faster and generally better
  - *Note for MacOS users: If you install Yarn using `brew`, make sure you add the `--without-node` option!*
- Download the source code of the project: `git clone ...`
  - You probably know what [Git](https://git-scm.com/) is if you're reading this...
  - But Git can be confusing, so Git commands will be shown throughout this guide
- Install dependencies by running `yarn` in the root folder of the project
  - All the packages which EC uses to build and run will be installed inside the `node_modules` folder
- Launch the EC web server locally by running `yarn start`
  - If everything works you should see a link in your terminal!


## Technologies
__TypeScript__
- Both the client and server are written in TypeScript
- Basically it is JavaScript with types
- It is transpiled into JavaScript at the build step

__Node.js__
- The engine which runs the server and runs the build tools
- It's Google Chrome's V8 JavaScript engine but runs locally and has bindings for JS to access OS level operations


## Making changes
- Before you change anything, make a new branch for your changes with `git checkout -b my-branch` (where `my-branch` is replaced with the name you want to give your branch)


## Directory Structure
- Follows the Ducks proposal


## Code Style
- The code adheres to the Airbnb style guidelines
- Prettier and eslint will automatically enforce correct code style
- Use American English in code and comments (eg. name variables `color` not `colour`)
  - Prevents typos due to unexpected spellings
  - Consistency with other APIs (eg. CSS names)


## Committing
When you are ready to add your changes to the main repository:
- Stage your changes
  - `git stage -A` will add *all* of your local changes to the commit
- Run `yarn commit "message"`
  - Remember to write your message in the *imperative* mood (eg. `change background color to green`, not `changed background...` or `changing background...`)
  - It will run all the tests and code quality checks
  - These tests make sure your code will conform to the style and quality of the rest of the EC codebase and should prevent accidentally breaking things
- To 