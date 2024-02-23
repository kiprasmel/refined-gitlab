#!/usr/bin/env bash

set -e

rm -rf ./distribution

NODE_ENV=production yarn webpack --mode=production
yarn bump-manifest
