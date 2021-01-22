#!/usr/bin/env bash
# postinstall.bash

# https://git-scm.com/book/en/v2/Git-Tools-Submodules
git submodule update --init --recursive

cd gitbeaker/

yarn install

# see
patch -f ./node_modules/@types/jest-environment-puppeteer/index.d.ts <<EOF
--- index.d.ts
+++ index.d.ts
@@ -60,6 +60,8 @@
 }

 declare global {
+    /** upstream bug -- see https://gitlab.com/kiprasmel/refined-gitlab/-/issues/59 */
+    /** @ts-ignore */
     const browser: Browser;
     const context: BrowserContext;
     const page: Page;
EOF

# we're integrating gitbeaker into our own webpack build config!
### yarn build

cp .example.env .env

exit 0
