/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, FC } from "react";
import cx from "classnames";

import { api } from "../utils/api";

type LabelUpdateIntent = "add" | "replace" | "remove";

const determineLabelUpdateIntent = (
	newLabel: string, //
	currentlySelectedLabels: string[],
	isMultiSelect: boolean
): LabelUpdateIntent => {
	let intent: LabelUpdateIntent;

	const includes = currentlySelectedLabels.includes(newLabel);

	if (isMultiSelect) {
		if (includes) {
			intent = "remove";
		} else {
			intent = "add";
		}
	} else {
		if (includes) {
			intent = "remove";
		} else {
			intent = "replace";
		}
	}

	return intent;
};

const fetchIssueLabels = async (projectId: number, issueIid: number): Promise<string[]> => {
	const res = await api.Issues.show(projectId, issueIid);
	return (res.labels as string[]) ?? [];
};

const useCurrentlySelectedLabels = (
	projectId: number, //
	issueIid: number,
	allowedLabels: string[]
) => {
	const [currentlySelectedLabels, __setCurrentlySelectedLabels] = useState<string[]>([]);

	const [selectionStatus, setSelectionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

	useEffect(() => {
		(async (): Promise<void> => {
			try {
				const labels: string[] = await fetchIssueLabels(projectId, issueIid);
				const matchingLabels: string[] = labels.filter((label: string) => allowedLabels.includes(label));

				__setCurrentlySelectedLabels(matchingLabels);
				console.log("currentlySelectedLabels", currentlySelectedLabels);
			} catch (e) {
				console.error(e);
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setCurrentlySelectedLabels = async (labelInQuestion: string, intent: LabelUpdateIntent) => {
		setSelectionStatus("loading");

		try {
			if (intent === "add") {
				//
			} else if (intent === "replace") {
				/**
				 * only happens in single-select component
				 * (in multi select, things are always express via `add` & `replace`)
				 */

				console.log("removing label since it's identical and the shift key was held");

				// setCurrentlySelectedLabels(newLabel);
				// setSelectionStatus("loading");

				const res = await api.Issues.edit(projectId, issueIid, {
					remove_labels: currentlySelectedLabels[0],
					add_labels: labelInQuestion,
				});

				console.log("res", res);
				setSelectionStatus("success");
			} else if (intent === "remove") {
				const res = await api.Issues.edit(projectId, issueIid, {
					remove_labels: currentlySelectedLabels /** TODO make sure this is the old one xd */,
				});

				console.log("res", res);

				// setCurrentlySelectedLabels(null);
				setSelectionStatus("success");
			}
		} catch (e) {
			console.error(e);
			setSelectionStatus("error");
		}
	};

	return { currentlySelectedLabels, setCurrentlySelectedLabels, selectionStatus };
};

interface Props {
	projectId: number;
	issueIid: number;
	title: string;
	allowedLabels: string[];
	isMultiSelect: boolean;
}

export const CustomLabelPicker: FC<Props> = ({
	projectId = -1,
	issueIid = -1,
	isMultiSelect = false,
	title = "",
	allowedLabels = [],
}) => {
	const { currentlySelectedLabels, setCurrentlySelectedLabels, selectionStatus } = useCurrentlySelectedLabels(
		projectId,
		issueIid,
		allowedLabels
	);

	const handleLabelChange = async (
		newLabel: string,
		_e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): Promise<void> => {
		const intent: LabelUpdateIntent = determineLabelUpdateIntent(newLabel, currentlySelectedLabels, isMultiSelect);
		setCurrentlySelectedLabels(newLabel, intent);
	};

	return (
		<div
			className={cx({
				"cursor-loading": selectionStatus === "loading",
			})}
		>
			{/* <div className="block"> */}
			<div className="title hide-collapsed">
				{title}{" "}
				{selectionStatus === "loading" ? (
					<span title="Updating">🔁</span>
				) : selectionStatus === "success" || selectionStatus === "idle" ? (
					currentlySelectedLabels ? (
						<span title="Column successfully selected">✅</span>
					) : (
						<span title="No column selected">–</span>
					)
				) : (
					<span title="Something went wrong (perhaps the wifi is gone?) - check the console & report the issue">
						❌
					</span>
				)}
			</div>

			<div className="cluster">
				<ul className="story-point-label-grid">
					{allowedLabels.map((allowedLabel) => (
						<li key={allowedLabel}>
							<button
								type="button"
								data-x-label={allowedLabel}
								// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
								onClick={async (e) => await handleLabelChange(allowedLabel, e)}
								// className="btn story-point-label-grid__list-item-button"

								className={cx("btn story-point-label-grid__list-item-button", {
									"cursor-loading": selectionStatus === "loading",
									//
									"select-initiated":
										selectionStatus === "loading" && currentlySelectedLabels.includes(allowedLabel),
									"select-confirmed":
										selectionStatus === "success" && currentlySelectedLabels.includes(allowedLabel),
									"select-idle":
										selectionStatus === "idle" && currentlySelectedLabels.includes(allowedLabel),
								})}
							>
								{allowedLabel}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
