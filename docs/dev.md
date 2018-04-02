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
  * Once it is installed, there are a few extensions you will want to install:
    * **Prettier - Code formatter**
      * Once it is installed, open settings and set `editor.formatOnType` and `editor.formatOnSave` to `true`
      * This will enforce and automatically format your code correctly as you type
* Install [nvm](https://github.com/creationix/nvm)
  * This is a version manager for [Node.js](https://nodejs.org/en/)
  * Node.js runs JavaScript outside of a browser
  * EC and all of the build tools associated with it run using Node.js
* Install [avn](https://github.com/wbyoung/avn)
  * This will automatically add the correct version of Node.js to your path when you enter the EC directory in a terminal
* Install [Yarn](https://yarnpkg.com/en/docs/install)
  * Yarn is a package manager for Node.js
  * NPM is the default package manager but Yarn is faster and generally better
  * _Note for MacOS users: If you install Yarn using `brew`, make sure you add the `--without-node` option!_
* Download the source code of the project: `git clone https://github.com/jakzo/edgecase.git`
  * You probably know what [Git](https://git-scm.com/) is if you're reading this...
  * But Git can be confusing, so Git commands will be shown throughout this guide
* Install dependencies by running `yarn` in the root folder of the project
  * All the packages which EC uses to build and run will be installed inside the `node_modules` folder
* Launch the EC web server locally by running `yarn start`
  * If everything works you should see a link in your terminal!

## Technologies

**TypeScript**

* Both the client (web pages) and server are written in the TypeScript programming language
* Basically it is JavaScript with types (helps catch errors and makes it clear what certain variables are used for)
* It is transpiled into JavaScript at the build step

**Node.js**

* The engine which runs the server and runs the build tools
* It's Google Chrome's V8 JavaScript engine but runs locally without HTML support and has bindings for JS to access OS level operations

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
  * `git stage -A` will add _all_ of your local changes to the commit
* Run `yarn commit "message"` (TODO: Or maybe add a Git hook with `husky`?)
  * Remember to write your message in the _imperative_ mood (eg. `change background color to green`, not `changed background...` or `changing background...`)
  * It will run all the tests and code quality checks
  * These tests make sure your code will conform to the style and quality of the rest of the EC codebase and should prevent accidentally breaking things
  * ...
  * If you've gotten to here then you can be pretty confident that your changes meet the respository's code standards. Congratulations!
