import { useState } from "react";
import select from "select-dom";

/**
 * only available for the `board`'s sidebar, since the issue's ID is displayed there.
 * Otherwise it's usually available from the URL
 */
export const useObservedIssueIid = (): number | undefined => {
	const [issueIid, setIssueIid] = useState<number | undefined | typeof NaN>(undefined);

	const observer = new MutationObserver((mutationRecords) => {
		const mutation = mutationRecords[0];

		if (mutation.type !== "characterData") {
			console.info("ignoring (1) sidebar issue id update: type didn't match `characterData`");
			return;
		}

		if (mutation.target.nodeName !== "#text") {
			console.info("ignoring (2) sidebar issue id update: target.nodeNam didn't match `#text`");
			return;
		}

		const value = mutation.target.nodeValue?.trim().replace("#", "");

		if (value === undefined) {
			console.info("ignoring (3): target.nodeValue === undefined");
			return;
		}

		const parsedVal: number = parseInt(value, 10);

		setIssueIid(parsedVal);
	});

	const issueIidElement: HTMLSpanElement | null = select(".issuable-header-text > span");

	if (!issueIidElement) {
		throw new Error("Cannot render label pickers in issue board - the `issueIidElement` was falsy");
	}

	observer.observe(issueIidElement, {
		childList: true, //
		subtree: true,
		characterData: true,
	});

	return issueIid;
};
