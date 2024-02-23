#!/usr/bin/env bash

set -e

NEW_VERSION="${NEW_VERSION:-0}"
test "$NEW_VERSION" -ne 0 && yarn new-version

bash ./build-distribution.sh
bash ./build-web-ext-artifacts.sh
