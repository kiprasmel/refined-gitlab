import React, { FC } from "react";

import select from "select-dom";
import { useObservedIssueIid } from "../hooks/useObservedIssueIid";
import { Feature, features } from "../Features";
import { CustomLabelPicker } from "../components/CustomLabelPicker";
import { renderBefore } from "../utils/render";

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
