/**
 * `source/scripts-content/refined-gitlab.ts`:
 *
 * ```ts
   import "../features/BOILERPLATE";
 * ```
 */

import React from "react";

import select from "select-dom";
import { Feature, features } from "../Features";
import { renderNextTo } from "../utils/render";

export const BOILERPLATE: Feature = ({}) => {
	const element = select(".some-selector-that-definitely-exists");

	if (!element) {
		return;
	}

	element.innerHTML = "ayyy lmao";

	renderNextTo(
		".where-to-render",
		<>
			<h1>hello</h1>
			{element}
		</>
	);
};

features.add({
	id: "add-custom-label-pickers",
	feature: BOILERPLATE,
	waitForDomLoaded: true,
	needsApi: true,
});
