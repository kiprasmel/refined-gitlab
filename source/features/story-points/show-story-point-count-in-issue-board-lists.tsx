import React from "react";
import select from "select-dom";

// eslint-disable-next-line import/no-cycle
import { Feature, features } from "../../Features";
import { renderNextTo } from "../../utils/render";
import { observedValueFactory } from "../../hooks/useObservedValue";

import { countStoryPointsInsideBoardList, parseBoardList } from "./issueBoardList";

export type StoryPointsConfig = {
	labelPrefix: string;
	// // shouldShowTotalCountInEachBoardColumn: boolean;
	// 	shouldShowHowManyCardsAreMissingTheLabelInEachBoardColumn: boolean;
	// } & {
	// 	shouldHighlightCardBackgroundIfDoesNotHaveLabel: boolean;
	// 	highlightedCardBackgroundColor: "rgba(255, 0, 0, 1.0)";
};

/**
 * **story points**
 *
 * we could use the API:
 * + more reliable
 * - harder to keep track of what changes inside the UI without constant polling for updates
 * - way bigger network usage - we'd have to duplicate each request that the UI makes
 *
 * so instead, we'll use the user interface (much like in other features)
 * to reflect what the user sees.
 *
 * and if we need extra info - we'll abuse the UI to do so
 * so that the user benefits from it at the same time aswell.
 *
 * this has an added bonus:
 * since we use mutation observers, the changes are reactive 🤑🤑
 *
 */
export const storyPoints: Feature = ({ storyPoints: storyPointsConfig }) => {
	const boardIssueLists: HTMLElement[] = select.all(`ul[data-board]`);

	boardIssueLists.forEach((list) => {
		const listId: string = list.attributes["data-board"].value;

		const ReactiveStoryPointsIndicator = () => {
			const handleMutation = (): number => {
				// // const updatedList = mutationRecords[0].target;
				// // console.log("mutationRecords", mutationRecords);

				/**
				 * re-select the updated list, because even though we have access to mutationRecords,
				 * they do not necessarily give back the `list` element we need
				 */
				const updatedList: HTMLElement | null = select(`ul[data-board="${listId}"]`);

				if (!updatedList) {
					throw new Error("[refined-gitlab] [error] selected element falsy - probably selector mismatch :/");
				}

				return countStoryPointsInsideBoardList(
					parseBoardList(updatedList), //
					storyPointsConfig.labelPrefix
				);
			};

			const useObservedValue = observedValueFactory(handleMutation);
			const storyPointCount = useObservedValue(list);

			return (
				<>
					<span className="gl-display-inline-flex gl-ml-3">
						{storyPointsConfig.labelPrefix} {storyPointCount}
					</span>
				</>
			);
		};

		const elementBeforeStoryPointCount: HTMLElement | null = select(
			`div[data-id="${listId}"] header .board-title .issue-count-badge span`
		);

		if (!elementBeforeStoryPointCount) {
			throw new Error("[refined-gitlab] [error] selected element falsy - probably selector mismatch :/");
		}

		renderNextTo(
			elementBeforeStoryPointCount, //
			<ReactiveStoryPointsIndicator />,
			{}
		);
	});
};

features.add({
	id: __filebasename,
	feature: storyPoints,
	waitForDomLoaded: true,
	waitForPageLoaded: true,
});
