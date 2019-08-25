#!/bin/bash

# Launches dev loop.
# Pass `-b` argument to force rebuild Docker image.

# TODO: Rewrite as TS script for OS compatibility

set -e

if [[ "$(docker images -q alg-wiki-dev:0.0.1 2> /dev/null)" == "" || $1 == "-b" ]]; then
  docker build -t alg-wiki-dev:0.0.1 .
fi

docker run --rm -it -v $(pwd):/root/alg-wiki -v $(pwd)/node_modules_docker:/root/alg-wiki/node_modules -p 11037:11037 --name alg-wiki-dev alg-wiki-dev:0.0.1 bash
