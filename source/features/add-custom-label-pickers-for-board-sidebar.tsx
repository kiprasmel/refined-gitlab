import React, { FC } from "react";

import select from "select-dom";
import { observedValueFactory } from "../hooks/useObservedValue";
import { Feature, features } from "../Features";
import { CustomLabelPicker } from "../components/CustomLabelPicker";
import { renderBefore } from "../utils/render";

const useObservedIssueIid = observedValueFactory((mutationRecords) => {
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
	return parsedVal;
});

export const addCustomLabelPickersForBoardSidebar: Feature = ({ sidebarFeaturesFromLabels }) => {
	if (!/\/boards?\/?\d*/.test(window.location.href)) {
		/** TODO handle @ `Features` */
		console.log("- skipping feature because wrong page (issue board ‼‼)");
		return;
	}

	console.log("window.location", window.location, document.location);

	/** TODO */
	const projectId: number = parseInt(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		select.all(`[data-project-id]`)[0].attributes[`data-project-id`].value!,
		10
	);
	console.log("projectId", projectId);

	const theNodeWeRenderItemsBefore = select(".labels")?.nextElementSibling;
	console.log("theNodeWeRenderItemsBefore", theNodeWeRenderItemsBefore);

	if (!theNodeWeRenderItemsBefore) {
		throw new Error("Cannot render label pickers - the `$('.labels')[0].nextElementSibling` was falsy");
	}

	for (const {
		title = "", //
		labels = [],
		isEnabled = true,
		isMultiSelect = false,
		labelLayoutType = "grid",
	} of sidebarFeaturesFromLabels) {
		if (!isEnabled) {
			continue;
		}

		const ReactiveCustomLabelPicker: FC = () => {
			const issueIid = useObservedIssueIid();

			if (!issueIid && issueIid !== 0) {
				return null;
			}

			return (
				<CustomLabelPicker
					key={`${isEnabled}_${projectId}_${issueIid}`}
					isEnabled={isEnabled}
					projectId={projectId}
					issueIid={(issueIid as unknown) as number}
					title={title}
					labels={labels}
					labelLayoutType={labelLayoutType}
					isMultiSelect={isMultiSelect}
				/>
			);
		};

		renderBefore(
			theNodeWeRenderItemsBefore, //
			<ReactiveCustomLabelPicker />,
			{
				rootNodeClassName: "block",
			}
		);
	}
};

features.add({
	id: __filebasename,
	feature: addCustomLabelPickersForBoardSidebar,
	waitForDomLoaded: true,
	waitForPageLoaded: true,
	needsApi: true,
});
