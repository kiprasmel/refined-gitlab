import React from "react";

// eslint-disable-next-line import/no-cycle
import { Feature, features } from "../Features";
// eslint-disable-next-line import/no-cycle
import { CustomLabelPicker } from "../components/CustomLabelPicker";
import { renderNextToInReverseOrder } from "../utils/render";

export type LabelLayoutType = "grid" | "select";

export type SidebarFeatureFromLabels = {
	title: string;
	isEnabled: boolean;
	labels: string[];
	isMultiSelect: boolean;
	labelLayoutType: LabelLayoutType;
};

export const addCustomLabelPickers: Feature = async ({ sidebarFeaturesFromLabels }) => {
	if (!/\/issues\/\d+/.test(window.location.href)) {
		/** TODO handle @ `Features` */
		console.log("- skipping feature because wrong page");
		return;
	}

	console.log("window.location", window.location, document.location);

	/** TODO */
	const projectId: number = parseInt(
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		document.querySelectorAll(`[data-project-id]`)[0].attributes[`data-project-id`].value!,
		10
	);

	console.log("projectId", projectId);

	/** TODO */
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const issueIid: string | number = window.location.href.match(/\/issues\/(\d+)/)?.[1]!;

	console.log("issueIid", issueIid);

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

		renderNextToInReverseOrder(
			".labels",
			<CustomLabelPicker
				isEnabled={isEnabled}
				projectId={projectId}
				issueIid={(issueIid as unknown) as number}
				title={title}
				labels={labels}
				labelLayoutType={labelLayoutType}
				isMultiSelect={isMultiSelect}
			/>,
			{
				extraClassesForRootNode: ["block"],
			}
		);
	}

	// const jsxArr = sidebarFeaturesFromLabels.map(
	// 	({
	// 		title = "", //
	// 		labels = [],
	// 		isEnabled = true,
	// 		isMultiSelect = false,
	// 		labelLayoutType = "grid",
	// 	}) => {
	// 		if (!isEnabled) {
	// 			return null;
	// 		}

	// 		return (
	// 			<CustomLabelPicker
	// 				isEnabled={isEnabled}
	// 				projectId={projectId}
	// 				issueIid={(issueIid as unknown) as number}
	// 				title={title}
	// 				labels={labels}
	// 				labelLayoutType={labelLayoutType}
	// 				isMultiSelect={isMultiSelect}
	// 				className="block"
	// 			/>
	// 		);
	// 	}
	// );

	// renderNextToInReverseOrder(".labels", <>{jsxArr}</>, {
	// 	extraClassesForRootNode: ["block"],
	// });
};

features.add({
	id: "add-custom-label-pickers",
	feature: addCustomLabelPickers,
	waitForDomLoaded: true,
	needsApi: true,
});
