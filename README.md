# refined-gitlab

Much like [refined github](https://github.com/sindresorhus/refined-github), but for gitlab!

## I. Usage

WIP

## II. Try it from a local build

Note - downloading a `.zip` won't work - do exactly as described below (you'll need `git` and `yarn`).

Inside your terminal:

```sh
git clone https://github.com/kiprasmel/refined-gitlab.git
# or:  git clone git@github.com:kiprasmel/refined-gitlab.git

cd refined-gitlab/

yarn install
```

> wait a bit. This will install the dependencies & clone git submodules

Inside [./source/utils/config.ts](./source/utils/config.ts) add your gitlab's `host URL` & `API token` (found at `<gitlab_host>/profile/personal_access_tokens`) with scopes `api` & `read_api`);

then:

```sh
yarn build # you need to do this every time you update something inside this repository
```

And then load up the built extension:

### II.1 chrome:

navigate to

```
chrome://extensions
```

1. enable "Developer mode" (toggle @ top right)
1. click "Load unpacked" (top left)
1. navigate to the path where you cloned the repository at first step
1. navigate to the `distribution/` folder & click "Select"

done! Note that after shutting down the browser, you'll need to load the extension from the `distribution/` folder again (begin @ [#chrome](#ii.1-chrome))

### II.2 firefox:

navigate to

```
about:debugging#/runtime/this-firefox
```

1. click "Load Temporary Add-on..."
1. navigate to the path where you cloned the repository at first step
1. navigate to the `distribution/` folder
1. select any file & double-click it

done! Note that after shutting down the browser, you'll need to load the extension from the `distribution/` folder again (begin @ [#firefox](#ii.2-firefox))

## III. Contributing

Here is a short overview to get your familiar with how the project works.

In essence, this extension isn't that different from a regular react application 🤷‍♀️

We use `react` to render components and handle state logic (hooks included!).

The `source/` directory contains a few core folders - React's `components/`, the extension's `features/`, their `styles/`,  `utils/` and other necessary files. The `manifest.json` is essential to web extensions - that's where you configure stuff (though you'll touch it rarely if so).

The extension is compiled via webpack into an IIFE, ready for browsers to execute. It's source is imported in [source/refined-gitlab.ts](source/refined-gitlab.ts) and loaded inside [source/utils/globalInit.ts](source/utils/globalInit.ts), where all features get loaded by [source/Features.ts](source/Features.ts). The features end up there by adding themselves into the `Features` array, where, once loaded, get their necessary data and render the resulting JSX.

/** TODO - introduce the gitlab API, gitbeaker etc. before showing an example feature */

An example feature, which would, let's say, show the total number of commits you've made, could look like this:

```tsx
// source/features/show-total-commit-count.tsx

import React, { useState, useEffect } from "react";

import { Feature, features } from "../Features";
import { api } from "../utils/api";
import { renderNextTo } from "../utils/renderNextTo";

export const showTotalCommitCount: Feature = (config) => {

	const reactComponent = () => {
		const [commitCount, setCommitCount] = useState<number>(0);

		useEffect(() => {


		}, [])

		return (<>

		</>)
	}

	const nodeId = "total-commits";
	const additionalClassesForTopLevelElement = [];

	/** TODO simplify the `renderNextTo` util so that we don't need all of this lmao */
	renderNextTo(".contrib-calendar", nodeId, additionalClassesForTopLevelElement, reactComponent)
}

features.add({
	id: "show-total-commit-count",
	feature: changeBackgroundColor,
	waitForDomLoaded: true,
});

```

## IV. License

MIT © [Kipras Melnikovas](https://gitlab.com/kiprasmel)
