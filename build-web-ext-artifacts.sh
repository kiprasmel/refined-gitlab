#!/usr/bin/env bash

# depends on ./build-distribution

set -e

if test $# -gt 0; then
	newVer="v$1"
	shift
else
	newVer="v$(node -pe 'require("./package.json").version')"
fi

# create prepared extension zip
rm -rf web-ext-artifacts/
yarn web-ext build --source-dir distribution/

# create source code zip
git archive -o web-ext-artifacts/refined_gitlab-source.zip @

printf "\n\n"
printf " https://addons.mozilla.org/en-US/developers/addon/refined-gitlab/versions/submit/ \n"
printf " https://gitlab.com/kiprasmel/refined-gitlab/-/compare/vOLD...$newVer \n"
printf "\n\n"
