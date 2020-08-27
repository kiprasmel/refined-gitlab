/**
 * `source/scripts-content/refined-gitlab.ts`:
 *
 * ```ts
   import "../features/BOILERPLATE";
 * ```
 */

import React from "react";

import "arrive";
import select from "select-dom";
import { Feature, features } from "../Features";
import { renderNextTo } from "../utils/render";
import { wait } from "../utils/wait";

export type Assignee = {
	/** Username */
	u: string;
	/** image Source */
	s: string; // HTMLImageElement;
	/** Frequency */
	f: number;
};

export const addAssigneeListToIssueBoard: Feature = ({}) => {
	const getAssignees = (): Assignee[] => {
		// const assigneeToFrequencyMap: Map<Assignee["username"], Assignee> = new Map();
		const assigneeToFrequencyMap: Map<Assignee["u"], Assignee> = new Map();

		const els = select.all(".board-card-assignee a.user-avatar-link");

		console.log("els", els);

		els.forEach((a: HTMLAnchorElement) => {
			const hrefSplit = a.href.split("/");
			const username: string = hrefSplit[hrefSplit.length - 1];

			const img: HTMLImageElement = a?.children?.[0]?.children?.[0] as HTMLImageElement; /** TODO FIXME */

			const newAssignee: Assignee = {
				u: username,
				s: img.src,
				f: 1,
			};

			if (!assigneeToFrequencyMap.has(newAssignee.u)) {
				assigneeToFrequencyMap.set(newAssignee.u, newAssignee);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, prefer-const
				let updatedAssignee: Assignee = assigneeToFrequencyMap.get(newAssignee.u)!;
				updatedAssignee.f++;

				assigneeToFrequencyMap.set(updatedAssignee.u, updatedAssignee);
			}
		});

		console.log("ass to freq map", assigneeToFrequencyMap);

		let sortedAssignees: Assignee[] = [...assigneeToFrequencyMap.entries()]
			// .sort(([, A], [, B]) => A.frequency - B.frequency)
			.sort(([, A], [, B]) => A.f - B.f)
			.map(([, assignee]) => assignee);

		console.log("sorted", sortedAssignees);

		const availUsernamesKey = "available_usernames";

		/** TODO ENABLE */

		const searchParams = new URLSearchParams(window.location.search);

		if (searchParams?.has(availUsernamesKey)) {
			sortedAssignees = [
				...new Set([...sortedAssignees, ...JSON.parse(searchParams.get(availUsernamesKey) ?? "[]")]),
			];
		}

		/** */

		// const availUsernames: string[] = new URLSearchParams(window.location.search).get(availUsernamesKey)?.split(",") ?? [];

		// availUsernamesKey.forEach(u => {
		// 	if (!sortedAssignees.map())
		// })

		// const theNodeWeRenderItemsNextTo = select(".breadcrumbs-links")?.nextElementSibling;
		// if (!theNodeWeRenderItemsNextTo) {
		// 	throw new Error("Cannot render label pickers - the `$('.labels')[0].nextElementSibling` was falsy");
		// }

		/** remove the flex styling from the parent */
		// eslint-disable-next-line no-unused-expressions
		// select(".breadcrumbs-links")?.style.removeProperty("flex");

		// select(".breadcrumbs-list")?.style["flex"] = 1;

		const rootNode = document.createElement("ul");
		rootNode.style["marginBottom"] = "0";
		// rootNode.style["marginLeft"] = "1rem";
		// rootNode.style["flex"] = "1";
		// rootNode.style["width"] = "100%";

		renderNextTo(
			// // theNodeWeRenderItemsNextTo, //
			// ".breadcrumbs-links",
			".breadcrumbs-links .breadcrumbs-list",
			<>
				{/* {sortedAssignees.reverse().map(({ username, img: { src, alt, width, height } }) => ( */}
				{sortedAssignees.reverse().map(({ u, s }) => (
					<button
						type="button"
						key={s}
						onClick={async (): Promise<void> => {
							const urlParams = new URLSearchParams(window.location.search);
							const key = "assignee_username";
							// if (urlParams.has(key) && urlParams.get(key) === u) {

								const oldAssignee = urlParams.get(key);

							if (urlParams.has(key)) {

								// urlParams.delete(key);
								select(`.value-container[data-original-value="${oldAssignee}"] div[role="button"]`)?.click();
								await wait(10)
							}

							if (u === oldAssignee) {
								return;
							}

							// // else {
							// // 	urlParams.set(key, u);
							// // 	urlParams.set(availUsernamesKey, JSON.stringify(sortedAssignees));
							// // }
							// // // (window.location.search as any) = urlParams;
							// const newRelativePathQuery = window.location.pathname + "?" + urlParams.toString();
							// // history.pushState({ sortedAssignees }, "", newRelativePathQuery);
							// history.replaceState(null, "", newRelativePathQuery);

							/** --- */

							// eslint-disable-next-line no-unused-expressions
							select(".input-token input")?.click();
							wait(10);

							// eslint-disable-next-line no-unused-expressions
							select('[data-tag=":@assignee"]')?.click();
							wait(10);

							// eslint-disable-next-line no-unused-expressions
							select('.filter-dropdown-item[data-value="="] button')?.click();
							wait(10);

							(select("input.filtered-search") as HTMLInputElement | undefined)?.value = u;
							wait(10);

							select("body")?.click()
							wait(10)

							const ev1 = new KeyboardEvent("keydown", {
								isTrusted: true,
								view: window,
								composed: true,
								bubbles: true,
								target: "input#filtered-search-boards.form-control.filtered-search",
								key: "Enter",
								charCode: 0,
								keyCode: 13,
							});

							select("input.filtered-search")?.dispatchEvent(ev1);

							/** --- */

							// const ev2 = new KeyboardEvent("keyup", {
							// 	view: window,
							// 	composed: true,
							// 	bubbles: true,
							// 	target:
							// 		"body.ui-indigo.tab-width-8.gl-browser-firefox.gl-platform-mac.rgl-feature__highlight-assign-yourself.page-initialised",
							// 	key: "Enter",
							// 	charCode: 0,
							// 	keyCode: 13,
							// });

							// select("body").dispatchEvent(ev2);

							/** --- */

							//
						}}
						style={{ background: "none", border: "none", padding: "0", marginRight: 24 / 4 }}
					>
						<img
							src={s}
							alt=""
							width="24px"
							height="24px"
							style={{ borderRadius: "100%", border: "1px solid #000" }}
						/>
					</button>
				))}
			</>,
			{
				rootNode,
		);

		return sortedAssignees;
	};

	setTimeout(getAssignees, 2000);
};

features.add({
	id: "add-assignee-list-to-issue-board",
	feature: addAssigneeListToIssueBoard,
	waitForDomLoaded: true,
});
