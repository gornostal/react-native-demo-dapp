#!/bin/sh

cd ethereum
../node_modules/.bin/truffle $@

# copy compiled contracts into the React app
cp build/contracts/* ../src/contracts
