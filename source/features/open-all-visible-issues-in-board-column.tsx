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
	select.all("ul[data-board]").forEach((b) => {
		const bid = b.attributes["data-board"].value;
		console.log("bid", bid);

		// const issues = select.all(`ul[data-board="${bid}"] li`);
		const issueHrefs = select.all(`ul[data-board="${bid}"] li a`) as HTMLAnchorElement[];

		renderNextTo(
			select(`div[data-id="${bid}"] header .board-title`).lastChild, //
			<button
				type="button"
				title="open all"
				onClick={async (): Promise<void> => {
					// const windowRes: browser.windows.Window | false = await browser.runtime.sendMessage({ kind: "window-creator", url: issueHrefs.splice(0, 1)[0].href });;
					console.log("onClick bid", bid);

					const windowRes: browser.windows.Window | false = await browser.runtime.sendMessage({
						kind: "window-creator",
						url: issueHrefs.map((a) => a.href),
					});
					console.log("windowRes", windowRes);

					// await Promise.all(
					// 	issueHrefs.map(async (anchor) => {
					// 		try {
					// 			if (windowRes) {
					// 				browser.runtime.sendMessage({ kind: "tab-creator", url: anchor.href, windowId: windowRes.id });
					// 			} else {
					// 				browser.runtime.sendMessage({ kind: "tab-creator", url: anchor.href});
					// 			}
					// 	} catch (e) {
					// 		console.error(e);
					// 			}
					// }))
				}}
				// className="no-drag"
				className="no-drag btn-default btn-md gl-button btn-icon btn"
			>
				{/* <span title="open all">↗️</span> */}
				<span title="open all">:o</span>
			</button>,
			{
				rootNodeClassName: "no-drag",
			}
		);
	});
};

features.add({
	id: "BOILERPLATE",
	feature: BOILERPLATE,
	waitForDomLoaded: true,
	waitForPageLoaded: true,
	needsApi: true,
});
