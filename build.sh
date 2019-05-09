#!/bin/bash

set -e
set -x

echo "## Building Hugo website for docs.redpoint.games ..."

if [ -f ./hugo ]; then
  PATH=$(pwd):$PATH
fi

if [ -d dist-docs ]; then
  rm -Rf dist-docs
fi
mkdir dist-docs
git clean -xdf docs.redpoint.games/
cd docs.redpoint.games
yarn --frozen-lockfile
OUTPUT_DIR=../dist-docs yarn gulp build-server
OUTPUT_DIR=../dist-docs yarn gulp generate-page-screenshots
cd ..