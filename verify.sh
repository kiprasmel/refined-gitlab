#!/usr/bin/env bash

set -e

USAGE='\
usage: ./verify.sh <path-to-xpi-file> <version>"

e.g.:
./verify.sh "$HOME/Library/Application Support/Firefox/Profiles/foo-bar-baz.dev-edition-default/extensions/refined-gitlab@kipras.org.xpi" 0.8.2

'

if test $# -lt 2; then
	>&2 echo "$USAGE"
	exit 1
fi

# in macos:
# $HOME/Library/Application Support/Firefox/Profiles/<YOUR_PROFILE>/extensions/refined-gitlab@kipras.org.xpi
XPI_TO_VERIFY="$1"
shift

VERSION="$1"
shift

if ! test -f "$XPI_TO_VERIFY"; then
	>&2 echo "provided xpi file not found."
	exit 1
fi

OUTDIR="verify/$VERSION"
rm -rf "$OUTDIR" # clean
mkdir -p "$OUTDIR"

ORIG_XPI="$OUTDIR/uploaded.xpi"
VERIFY_OUT="$OUTDIR/uploaded"
cp "$XPI_TO_VERIFY" "$ORIG_XPI"
unzip "$ORIG_XPI" -d "$VERIFY_OUT"

git checkout "v$VERSION"

yarn install --check-files --frozen-lockfile

bash ./build-distribution.sh
bash ./build-web-ext-artifacts.sh "$VERSION"

BUILT_XPI="$OUTDIR/built.zip"
BUILT_OUT="$OUTDIR/built"
mv "web-ext-artifacts/refined_gitlab-$VERSION.zip" "$BUILT_XPI"
mv "web-ext-artifacts/refined_gitlab-source.zip" "$OUTDIR/source.zip"
rm -rf web-ext-artifacts
unzip "$BUILT_XPI" -d "$BUILT_OUT"

DIFF_OUT="$OUTDIR/built-vs-uploaded.diff"
diff -u -r "$VERIFY_OUT" "$BUILT_OUT" > "$DIFF_OUT" || :
printf "\n\n\nverify.sh: created %s\n\n" "$DIFF_OUT"

git checkout - 2>/dev/null

test -n "$VERBOSE" && cat "$DIFF_OUT"
