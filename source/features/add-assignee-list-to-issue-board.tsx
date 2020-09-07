/**
 * WARNING
 *
 * The code in this file is absolute trash!!
 *
 * I pulled an all-nighter to make it work
 * and it's certainly not the greatest.
 *
 * Proceed with caution; perhaps we'll refactor it l8r
 *
 * See also:
 *
 * - a crazy bug with vimium - a different browser extension, and firing events manually: https://github.com/philc/vimium/issues/3651
 */

import React, { FC, useEffect, useState } from "react";
import select from "select-dom";

import { Feature, features } from "../Features";
import { renderNextTo } from "../utils/render";
import { wait } from "../utils/wait";

export type Assignee = {
	/** username */
	u: string;
	/** image source */
	s: string;
	/** frequency */
	f: number;
};

type Intent = "add" | "remove" | "replace";

const currentAssKey = "assignee_username";
const availableAssKey = "additional_assignees";

// const shouldUseCache = (): boolean => {
// 	const urlParams = new URLSearchParams(window.location.search);
// 	return !!urlParams.has(currentAssKey);
// };

// const shouldPurgeTheCache = (): boolean => !new URLSearchParams(window.location.search).has(currentAssKey);

// const replaceSearchParams = (searchParams: URLSearchParams): void => {
// 	window.history.replaceState(
// 		null,
// 		"",
// 		window.location.href.split("?")[0] + (searchParams.toString().trim().length > 0)
// 			? "?" + searchParams.toString()
// 			: ""
// 	);
// };

const removeAvailableAssigneesFromQuery = (): void => {
	const searchParams: URLSearchParams = new URLSearchParams(window.location.search);

	searchParams.delete(availableAssKey);

	const stringSearchParams: string = searchParams.toString().trim().length > 0 ? "?" + searchParams.toString() : "";
	window.history.replaceState(null, "", window.location.href.split("?")[0] + stringSearchParams);
};

const addAvailableAssigneesToQuery = (availableAssignees: Assignee[]): void => {
	const searchParams: URLSearchParams = new URLSearchParams(window.location.search);

	searchParams.set(availableAssKey, JSON.stringify(availableAssignees));

	const stringSearchParams: string = searchParams.toString().trim().length > 0 ? "?" + searchParams.toString() : "";
	window.history.replaceState(null, "", window.location.href.split("?")[0] + stringSearchParams);
};

const takeUniq = <T, K extends keyof T>(arr: T[], key: K): T[] => {
	// const seen = new Set();

	// return arr.filter((item) => {
	// 	if (seen.has(item[key])) {
	// 		return false;
	// 	}

	// 	seen.add(item[key]);
	// 	return true;
	// });

	const map: Map<T[K], T> = new Map();

	arr.forEach((item) => {
		if (map.has(item[key])) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const currItem: T = map.get(item[key])!;

			map.set(item[key], currItem[key] <= item[key] ? currItem : item);
		}
		map.set(item[key], item);
	});

	return [...map.values()];
};

const uniqAssignees = (assignees: Assignee[], searchParams: URLSearchParams): Assignee[] =>
	takeUniq([...assignees, ...(JSON.parse(searchParams.get(availableAssKey) ?? "[]") as Assignee[])], "u").sort(
		(A, B) => A.f - B.f || A.u.localeCompare(B.u)
	);

const getAssignees = (): Assignee[] => {
	const assigneeToFrequencyMap: Map<Assignee["u"], Assignee> = new Map();

	const els = select.all(".board-card-assignee a.user-avatar-link");

	// console.log("els", els);

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

	// console.log("ass to freq map", assigneeToFrequencyMap);

	let sortedAssignees: Assignee[] = [...assigneeToFrequencyMap.entries()]
		.sort(([, A], [, B]) => A.f - B.f || A.u.localeCompare(B.u)) // A.f - B.f)
		.map(([, assignee]) => assignee);

	// console.log("sorted", sortedAssignees);

	const searchParams = new URLSearchParams(window.location.search);

	// if (searchParams?.has(availableAssKey)) {
	// 	if (searchParams.has(currentAssKey)) {
	// 		sortedAssignees = [
	// 			...new Set([...sortedAssignees, ...JSON.parse(searchParams.get(availableAssKey) ?? "[]")]),
	// 		];
	// 	}
	// } else {
	// 	// searchParams.set(availableAssKey, JSON.stringify(sortedAssignees ?? []));
	// 	// window.location.search = searchParams.toString();
	// 	window.history.replaceState(null, "", window.location.href.split("?")[0] + searchParams.toString());
	// }

	if (searchParams.has(currentAssKey)) {
		// sortedAssignees = [...new Set([...sortedAssignees, ...JSON.parse(searchParams.get(availableAssKey) ?? "[]")])];
		// sortedAssignees = [...new Set([...JSON.parse(searchParams.get(availableAssKey) ?? "[]"), ...sortedAssignees])];

		// sortedAssignees = takeUniq(
		// 	[...sortedAssignees, ...(JSON.parse(searchParams.get(availableAssKey) ?? "[]") as Assignee[])],
		// 	"u"
		// );

		sortedAssignees = uniqAssignees(sortedAssignees, searchParams);
	}

	sortedAssignees = sortedAssignees.sort((A, B) => A.f - B.f || A.u.localeCompare(B.u));

	searchParams.set(availableAssKey, JSON.stringify(sortedAssignees));
	// replaceSearchParams(searchParams);

	// // searchParams.set(availableAssKey, JSON.stringify(sortedAssignees ?? []));
	// // window.location.search = searchParams.toString();

	return sortedAssignees;
};

const determineIntent = (oldAssignee: string | null, newAssignee: string): Intent => {
	console.log("det intent", oldAssignee, newAssignee);
	// const currentAssignee: string | null = new URLSearchParams(window.location.search).get(currentAssKey);

	if (!oldAssignee?.trim()) {
		return "add";
	}

	if (oldAssignee === newAssignee) {
		return "remove";
	}

	return "replace";
};

const Component: FC = () => {
	const [sortedAssignees, setSortedAssignees] = useState<Assignee[]>(() => getAssignees());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setSortedAssignees(getAssignees());
		}, 1000);

		console.log("NEW INTERVAL", intervalId);

		return (): void => clearInterval(intervalId);
	}, []);

	const handleAssigneeSelection = (newAssignee: string): void => {
		const searchParams: URLSearchParams = new URLSearchParams(window.location.search);
		const oldAssignee: string | null = searchParams.get(currentAssKey);

		const intent: Intent = determineIntent(oldAssignee, newAssignee);

		console.log("old", oldAssignee, "new", newAssignee, "intent", intent);

		const addAssignee = (which) => {
			// eslint-disable-next-line no-unused-expressions
			select(".input-token input")?.click();
			wait(10);

			// eslint-disable-next-line no-unused-expressions
			select('[data-tag=":@assignee"]')?.click();
			wait(10);

			// eslint-disable-next-line no-unused-expressions
			select('.filter-dropdown-item[data-value="="] button')?.click();
			wait(10);

			// @ts-ignore
			(select("input.filtered-search") as HTMLInputElement | undefined)?.value = which;
			wait(10);

			// eslint-disable-next-line no-unused-expressions
			select("body")?.click();
			wait(10);
		};

		const removeAssignee = (which) => {
			/** remove old assignee from search bar (& query?) - does NOT cause an update */
			// eslint-disable-next-line no-unused-expressions
			(
				select(`.value-container[data-original-value="${which}"] div[role="button"]`) ??
				select(`.value-container[data-original-value="@${which}"] div[role="button"]`)
			)?.click();

			/** confirm removal */
			// eslint-disable-next-line no-unused-expressions
			select(".input-token input")?.click();

			// eslint-disable-next-line no-unused-expressions
			select("body")?.click();
		};

		const confirmAction = () => {
			const enterEvent = new KeyboardEvent("keydown", {
				isTrusted: true,
				view: window,
				composed: true,
				bubbles: true,
				target: "input#filtered-search-boards.form-control.filtered-search",
				key: "Enter",
				charCode: 0,
				keyCode: 13,
				/**
				 * typescript complains that we're adding too much
				 * but it works and if we remove some props it breaks
				 */
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} as any);

			// eslint-disable-next-line no-unused-expressions
			select("input.filtered-search")?.dispatchEvent(enterEvent);
		};

		if (intent === "add") {
			// searchParams.set(currentAssKey, newAssignee);
			console.log("add", sortedAssignees);

			addAssignee(newAssignee);
			confirmAction();

			searchParams.set(
				availableAssKey,
				JSON.stringify([
					// ...new Set([...sortedAssignees, ...JSON.parse(searchParams.get(availableAssKey) ?? "[]")]),
					// ...new Set([...JSON.parse(searchParams.get(availableAssKey) ?? "[]"), ...sortedAssignees]),

					...uniqAssignees(sortedAssignees, searchParams),
				])
			);

			addAvailableAssigneesToQuery(sortedAssignees);
			// replaceSearchParams(searchParams);
		} else if (intent === "remove") {
			// searchParams.delete(availableAssKey);
			// replaceSearchParams(searchParams);

			// removeAssignee(oldAssignee); /** same as `newAssignee` */
			removeAssignee(newAssignee); /** same as `oldAssignee` */

			confirmAction();

			removeAvailableAssigneesFromQuery();
		} else if (intent === "replace") {
			removeAssignee(oldAssignee);
			confirmAction();
			addAssignee(newAssignee);
			confirmAction();

			searchParams.set(
				availableAssKey,
				JSON.stringify([
					// ...new Set([...sortedAssignees, ...JSON.parse(searchParams.get(availableAssKey) ?? "[]")]),
					// ...new Set([...JSON.parse(searchParams.get(availableAssKey) ?? "[]"), ...sortedAssignees]),

					...uniqAssignees(sortedAssignees, searchParams),
				])
			);

			addAvailableAssigneesToQuery(sortedAssignees);
		}
	};

	return (
		<>
			{sortedAssignees.reverse().map(({ u, s }) => (
				<button
					type="button"
					key={s}
					onClick={(): void => handleAssigneeSelection(u)}
					style={{ background: "none", border: "none", padding: "0", marginRight: 24 / 4 }}
				>
					<img
						src={s}
						title={u}
						alt={u}
						width="24px"
						height="24px"
						style={{
							borderRadius: "100%",
							border:
								new URLSearchParams(window.location.search).get(currentAssKey) === u
									? "2px solid rgb(62 212 0)"
									: "1px solid #000",
						}}
					/>
				</button>
			))}
		</>
	);
};

export const addAssigneeListToIssueBoard: Feature = ({}) => {
	const rootNode = document.createElement("div");
	rootNode.style["marginBottom"] = "0";
	rootNode.style["marginLeft"] = "1rem";
	rootNode.style["flex"] = "1";
	rootNode.style["width"] = "100%";

	setTimeout(
		() =>
			renderNextTo(
				".breadcrumbs-list", //
				<Component />,
				{
					rootNode,
				}
			),
		1
	);
};

features.add({
	id: __filebasename,
	feature: addAssigneeListToIssueBoard,
	waitForDomLoaded: true,
});
