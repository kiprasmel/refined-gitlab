import select from "select-dom";
import { removeUndefined } from "../../utils/removeUndefined";

export type IssueCard = {
	/** unique id */
	id: string;
	/** unique id in the context of the current repo */
	iid: string;
	labelElements: HTMLSpanElement[];
	labelNames: string[];
};

export type IssueBoardList = {
	listEl: HTMLElement;
	listTitleEl: HTMLElement | null;
	elementBeforeStoryPointCount: HTMLElement | null;
	listId: string;
	listIssueElements: HTMLLIElement[];
	listIssues: IssueCard[];
};

export const parseBoardList = (listEl: HTMLElement): IssueBoardList => {
	const listId: string = listEl.attributes["data-board"].value;

	const listTitleEl: HTMLElement | null = select(`div[data-id="${listId}"] header .board-title`);
	const elementBeforeStoryPointCount: HTMLElement | null = select(
		`div[data-id="${listId}"] header .board-title .issue-count-badge span`
	);

	const listIssueElements: HTMLLIElement[] = select.all(`ul[data-board="${listId}"] li`);

	const listIssues: IssueCard[] = listIssueElements.map((el) => {
		const issueIdKey: string = "data-issue-id";
		const issueId: string = el.attributes[issueIdKey].value;

		return {
			id: issueId,
			iid: el.attributes["data-issue-iid"].value,
			labelElements: select.all(`ul[data-board="${listId}"] li .board-card-labels span`),
			labelNames: select
				.all(`ul[data-board="${listId}"] li[${issueIdKey}="${issueId}"] .board-card-labels .gl-label-text`)
				.map((l) => l.textContent?.trim())
				.filter(removeUndefined),
		};
	});

	// console.log("listEl", listEl, "listIssueElements", listIssueElements, "listIssues", listIssues);

	return {
		listEl,
		listTitleEl,
		elementBeforeStoryPointCount,
		listId,
		listIssueElements,
		listIssues,
	};
};

export const countStoryPointsInsideBoardList = (boardList: IssueBoardList, storyPointLabelPrefix: string): number => {
	let storyPointSumInList: number = 0;

	if (!boardList.listTitleEl) {
		throw new Error("List title element was falsy - cannot render story point sum in list");
	}

	boardList.listIssues.forEach((issue) => {
		for (const label of issue.labelNames) {
			const wantedPrefix = storyPointLabelPrefix.toLowerCase();
			const wantedLength: number = wantedPrefix.length;
			const providedPrefix = label.slice(0, wantedLength).toLowerCase();

			if (providedPrefix !== wantedPrefix) {
				continue;
			}

			let parsedStoryPointValue: number = 0;

			const storyPointValue: string = label.slice(0 + wantedLength);
			if (!storyPointValue.includes("/")) {
				parsedStoryPointValue = parseFloat(storyPointValue);
			} else {
				const fraction = storyPointValue.split("/");

				if (fraction.length !== 2) {
					throw new Error(
						`Story point label "${label}" (turned into "${storyPointValue}") cannot be parsed as a number`
					);
				}

				const [num, denum] = fraction;

				parsedStoryPointValue = parseInt(num) / parseInt(denum);
			}

			// console.log("parsedStoryPointValue", parsedStoryPointValue, "label", label);

			storyPointSumInList += parsedStoryPointValue;
		}
	});

	return storyPointSumInList;
};
