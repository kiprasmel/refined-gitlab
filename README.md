# refined-gitlab

Much like [refined-github](https://github.com/sindresorhus/refined-github), but for gitlab!

## I. Install


- **Chrome** extension | status = waiting for review 👀

- [**Firefox** add-on <img valign="middle" src="https://img.shields.io/amo/v/refined-gitlab.svg?label=%20">](https://addons.mozilla.org/en-US/firefox/addon/refined-gitlab/)

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

Some features need the API. Either

a) be logged-in to gitlab, or

b) provider a custom API token - inside [./source/utils/config.ts](./source/utils/config.ts) add your gitlab's `host URL` & `API token` (found at `<gitlab_host>/profile/personal_access_tokens`) with scopes `api` & `read_api`);

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

In essence, this extension isn't that different from a regular react application 🤷‍♀️ (except it isn't as complex ☠️☠️)

We use `react` to render components and handle state logic (hooks included!).

The `source/` directory contains a few core folders - react's `components/`, the extension's `features/`, their `styles/`,  `utils/` and other necessary files.

There are also the `background-scripts/` and `content-scripts/` directories - they hold & import their respective scripts, which are later loaded by the browser, as defined in the `manifest.json` file (which is essential to web extensions - that's where you configure stuff (though you'll rarely touch it, if so)).

The extension is compiled via webpack into an IIFE, ready for browsers to execute. It's source is imported in [source/scripts-content/refined-gitlab.ts](source/scripts-content/refined-gitlab.ts) and loaded inside [source/utils/globalInit.ts](source/utils/globalInit.ts), where all features get loaded by [source/Features.ts](source/Features.ts). The features end up there by adding themselves into the `Features` array, where, once loaded, get their necessary data and render the resulting JSX.

We'll provide some examples soon™️. For now - feel free to explore the source, especially `features/`, `components/` and `utils/`

<!--
TODO - introduce the gitlab API, gitbeaker etc. before showing an example feature
-->

<!--
TODO - provide an example feature

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
	**waitForDom**Loaded: true,
});

``` -->

## IV. Meta

- [refined-gitlab](https://gitlab.com/kiprasmel/refined-gitlab) project ID on gitlab: `20434942`

- [refined-gitlab-playground](https://gitlab.com/kiprasmel/refined-gitlab-playground) project ID on gitlab: `20690630`


## V. See also

- [Gitbeaker](https://github.com/jdalrymple/gitbeaker/) - GitLab's API wrapper we use here & often contribute to.
- [Figma assets](https://www.figma.com/file/PyOJIJOClNV2dZs4QWU7Pa/Refined-GitLab) - icons, feature screenshots etc.

## VI. License

MIT © [Kipras Melnikovas](https://gitlab.com/kiprasmel)
