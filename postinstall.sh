#!/usr/bin/env bash

set -e

# https://git-scm.com/book/en/v2/Git-Tools-Submodules
git submodule update --init --recursive

cd gitbeaker/

yarn install

# we're integrating gitbeaker into our own webpack build config!
### yarn build

exit 0
