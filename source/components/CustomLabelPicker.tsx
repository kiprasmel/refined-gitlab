/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, FC } from "react";
import cx from "classnames";

import "./CustomLabelPicker.scss";

// eslint-disable-next-line import/no-cycle
import { api } from "../utils/api";

type LabelUpdateIntent = "add" | "replace" | "remove";

const determineLabelUpdateIntent = (
	newLabel: string, //
	currentlySelectedLabels: string[],
	isMultiSelect: boolean
): LabelUpdateIntent => {
	let intent: LabelUpdateIntent;

	const includes = currentlySelectedLabels.includes(newLabel);

	if (includes) {
		intent = "remove";
	} else {
		if (isMultiSelect) {
			intent = "add";
		} else {
			if (currentlySelectedLabels.length > 0) {
				intent = "replace";
			} else {
				intent = "add";
			}
		}
	}

	console.log("intent", intent);

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

	const [currentLabelsInQuestion, setCurrentLabelsInQuestion] = useState<string[]>([]);
	const [selectionStatuses, setSelectionStatuses] = useState<
		Record<string, "idle" | "loading" | "success" | "error">
	>();

	const findMatchingLabelsFor = (labels: string[]): string[] =>
		labels.filter((label: string) => allowedLabels.includes(label));

	useEffect(() => {
		(async (): Promise<void> => {
			try {
				const labels: string[] = await fetchIssueLabels(projectId, issueIid);
				const matchingLabels: string[] = findMatchingLabelsFor(labels);

				__setCurrentlySelectedLabels(matchingLabels);
			} catch (e) {
				console.error(e);
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setCurrentlySelectedLabels = async (labelInQuestion: string, intent: LabelUpdateIntent) => {
		setCurrentLabelsInQuestion((current) => [...current, labelInQuestion]);
		setSelectionStatuses((current) => ({ ...current, [labelInQuestion]: "loading" }));

		const onSuccess = (res) => {
			__setCurrentlySelectedLabels(findMatchingLabelsFor(res.labels ?? []));
			setSelectionStatuses((current) => ({ ...current, [labelInQuestion]: "success" }));
			setCurrentLabelsInQuestion((current) => [...current].filter((label) => label !== labelInQuestion));
		};

		const onFailure = (e) => {
			console.error(e);
			// // __setCurrentlySelectedLabels(findMatchingLabelsFor(res.labels ?? []));
			setSelectionStatuses((current) => ({ ...current, [labelInQuestion]: "error" }));
			setCurrentLabelsInQuestion((current) => [...current].filter((label) => label !== labelInQuestion));
		};

		try {
			if (intent === "add") {
				const res = await api.Issues.edit(projectId, issueIid, {
					add_labels: labelInQuestion,
				});

				onSuccess(res);
			} else if (intent === "replace") {
				const res = await api.Issues.edit(projectId, issueIid, {
					/**
					 * it's safe to do this because the `replace` intent
					 * only happens in the single-select component variation
					 * (in multi select, things are always expressed via `add` & `replace`)
					 */
					remove_labels: currentlySelectedLabels[0],
					add_labels: labelInQuestion,
				});

				onSuccess(res);
			} else if (intent === "remove") {
				const res = await api.Issues.edit(projectId, issueIid, {
					remove_labels: labelInQuestion /** TODO make sure this is the old one xd */,
				});

				onSuccess(res);
			}
		} catch (e) {
			onFailure(e);
		}
	};

	return { currentlySelectedLabels, setCurrentlySelectedLabels, selectionStatuses, currentLabelsInQuestion };
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
	const {
		currentlySelectedLabels, //
		setCurrentlySelectedLabels,
		selectionStatuses,
		currentLabelsInQuestion,
	} = useCurrentlySelectedLabels(projectId, issueIid, allowedLabels);

	const handleLabelChange = async (
		newLabel: string,
		_e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	): Promise<void> => {
		const intent: LabelUpdateIntent = determineLabelUpdateIntent(newLabel, currentlySelectedLabels, isMultiSelect);
		await setCurrentlySelectedLabels(newLabel, intent);
	};

	const determineSelectionStatus = () => {
		console.log("selectionStatuses", selectionStatuses);
		const vals = Object.values(selectionStatuses ?? {});

		if (vals.some((v) => v === "error")) {
			return "error";
		} else if (vals.some((v) => v === "loading")) {
			return "loading";
		} else if (vals.some((v) => v === "success")) {
			return "success";
		} else if (vals.some((v) => v === "idle")) {
			return "idle";
		}

		return "idle";
	};

	const selectionStatus = determineSelectionStatus();

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
					{allowedLabels.map((label) => (
						<li key={label}>
							<button
								type="button"
								data-x-label={label}
								// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
								onClick={async (e) => await handleLabelChange(label, e)}
								// className="btn story-point-label-grid__list-item-button"

								className={cx("btn story-point-label-grid__list-item-button", {
									"cursor-loading": selectionStatus === "loading",

									...(isMultiSelect
										? {
												"select-initiated":
													selectionStatus === "loading" &&
													currentLabelsInQuestion.includes(label),
												"select-confirmed":
													currentlySelectedLabels.includes(label) &&
													!currentLabelsInQuestion.includes(label),
											"select-idle":
													currentlySelectedLabels.includes(label) &&
													!currentLabelsInQuestion.includes(label),
										  }
										: {
												"select-initiated":
													selectionStatus === "loading" &&
													currentLabelsInQuestion.includes(label),
												"select-confirmed":
													currentlySelectedLabels.includes(label) &&
													!currentLabelsInQuestion.includes(label),
											"select-idle":
													currentlySelectedLabels.includes(label) &&
													!currentLabelsInQuestion.includes(label),
										  }),
									//
								})}
							>
								{label}
							</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
