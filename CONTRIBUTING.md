# Contributing

<!-- TODO FIXME ¯\_(ツ)_/¯ -->
Welcome. There's no manual so just read the source ¯\\_(ツ)_/¯

## web extension api docs

https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API

## from merging PR to publishing

use the `build:beta` if you're sending the extension to beta testers instead of uploading to the chrome/firefox stores

```sh
yarn build
# or:  yarn build:beta

yarn new-version

bash ./preupload.bash
```

the generated files are in [./distribution/](./distribution/) & [./web-ext-artifacts/](./web-ext-artifacts/).
