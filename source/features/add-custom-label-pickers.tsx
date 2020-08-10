/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import React from "react";

// eslint-disable-next-line import/no-cycle
import { Feature, features } from "../Features";
// eslint-disable-next-line import/no-cycle
import { CustomLabelPicker } from "../components/CustomLabelPicker";
import { renderNextTo } from "../utils/renderNextTo";

export interface SidebarFeatureFromLabels {
	title: string;
	isEnabled: boolean;
	labelLayoutType: "grid" | "select";
	isMultiSelect: boolean;
	labels: string[];
}

export const addCustomLabelPickers: Feature = async ({ sidebarFeaturesFromLabels }) => {
	// const { enabled, labelLayoutType, labels: columnLabels /** TODO */, title } = sidebarFeaturesFromLabels[0];

	if (!/\/issues\/\d+/.test(window.location.href)) {
		/** TODO handle @ `Features` */
		console.log("- skipping feature because wrong page");
		return;
	}

	console.log("window.location", window.location, document.location);

	/** TODO */
	const projectId: number = parseInt(
		document.querySelectorAll(`[data-project-id]`)[0].attributes["data-project-id"].value!,
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
	} of sidebarFeaturesFromLabels.reverse()) {
		if (!isEnabled) {
			continue;
		}

		renderNextTo(
			".labels",
			`ayyy-lmao-${title}`,
			["block"] /** TODO FIXME (should receive from the thing we tryna render) */,
			<CustomLabelPicker
				projectId={projectId}
				issueIid={(issueIid as unknown) as number}
				title={title}
				allowedLabels={labels}
				isMultiSelect={isMultiSelect}
			/>
		);
	}
};

features.add({
	id: "add-custom-label-pickers",
	feature: addCustomLabelPickers,
	waitForDomLoaded: true,
});
