# Development Guide

This page is designed for people who are new to JS development or unfamiliar with the technologies used in EC. It will give a high-level overview of the tools and technologies used and get you ready to start hacking at the code!

It looks like a lot to get started, but investing a little time to install these tools and learn vaguely what the different technologies do will make things _a lot_ easier to make changes.

However if you are already a JavaScript and Git veteran, the sections which will interest you most are:

* [Directory Structure](#directory-structure)
* [Code Style](#code-style)
* [Committing](#committing)

## Setting Up an Efficient Dev Environment

* Install [VS Code](https://code.visualstudio.com/)
  * This is a fairly new free and open-source IDE made by Microsoft
  * It is a solid choice for programming in general but is definitely the best for writing [TypeScript](https://www.typescriptlang.org/) (the language EC is written in)
  * Once it is installed, there are a few extensions you will want to install. Go to the _extensions_ page inside VS Code and type the names of the following extensions into the search and install them:
    * **Prettier - Code formatter**
      * Once it is installed, open settings and set `editor.formatOnType` and `editor.formatOnSave` to `true`
      * This is used to enforce correct code formatting and can also automatically format your code as you type
* Install [nvm](https://github.com/creationix/nvm)
  * This is a version manager for [Node.js](https://nodejs.org/en/)
  * It will let you install the correct version of Node.js for this project
* Install [avn](https://github.com/wbyoung/avn)
  * This will automatically add the correct version of Node.js to your path when you enter the EC directory in a terminal
* Install [Yarn](https://yarnpkg.com/en/docs/install)
  * Yarn is a package manager for Node.js
  * NPM is the default package manager but Yarn is faster and generally better
  * _Note for MacOS users: If you install Yarn using `brew`, make sure you add the `--without-node` option!_
* Download the source code of the project: `git clone https://github.com/jakzo/edgecase.git`
  * Install [Git](https://git-scm.com/) first if it is not already installed
* Install dependencies by running `yarn` in the root folder of the project
  * All the packages which EC uses to build and run will be installed inside the `node_modules` folder
* Launch the EC web server locally by running `yarn dev`
  * VS Code users can also use the _"Dev Server"_ command from the _debug_ tab to start it with the debugger enabled
  * If everything works you should see a link in your terminal!

## Technologies

**TypeScript**

* Both the client (web pages) and server are written in the TypeScript programming language
* Basically it is JavaScript with types (which helps catch errors and makes it clear what certain variables contain)
* It is transpiled into JavaScript at build time

**Node.js**

* The engine which runs the server and most of the build tools
* It's Google Chrome's V8 JavaScript engine but runs locally without HTML/DOM support and has bindings for JS to access OS level operations

## Making changes

* Before you change anything, make a new branch for your changes with `git checkout -b my-branch` (where `my-branch` is replaced with the name you want to give your branch)
* TODO

## Directory Structure

* Follows the Ducks proposal (TODO: Maybe? Review later...)

## Code Style

* The code adheres to the Airbnb style guidelines
* Prettier and eslint will automatically enforce correct code style
* Use American English in code and comments (eg. name variables `color` not `colour`)
  * Prevents typos due to unexpected spellings
  * Consistency with other APIs (eg. CSS names)

## Committing

When you are ready to add your changes to the main repository:

* Stage your changes
  * `git add -A` will add _all_ of your local changes to the commit
* Run `git commit -m "message"`
  * Remember to write your message in the _imperative_ mood (eg. `change background color`, not `changed background color` or `changing background color`)
  * It will run all the tests and code quality checks for the modified files
  * These tests make sure your code will conform to the style and quality of the rest of the EC codebase and should prevent accidentally breaking things
  * If you really need to bypass the commit hooks, you can run `git commit -n -m "message"` but remember that the pipeline will also run the checks when you push your changes, preventing you from merging it in a pull request
* ...
* If you've gotten to here and passed the previous tests then you can be pretty confident that your changes meet the respository's code standards. Congratulations!
