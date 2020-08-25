/* eslint-disable indent */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect, FC } from "react";
import cx from "classnames";

import "./CustomLabelPicker.scss";

// eslint-disable-next-line import/no-cycle
import { api } from "../utils/api";
// eslint-disable-next-line import/no-cycle
import { SelectionStatusIndicator } from "./SelectionStatusIndicator";
// eslint-disable-next-line import/no-cycle
import { LabelLayoutType, SidebarFeatureFromLabels } from "../features/add-custom-label-pickers";

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
	return ((res as any).labels as string[]) ?? [];
};

export type SelectionStatus = "idle" | "loading" | "success" | "error";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useCurrentlySelectedLabels = (
	projectId: number, //
	issueIid: number,
	allowedLabels: string[]
) => {
	const [isFetchingLabels, setIsFetchingLabels] = useState<boolean>(false);

	const [currentlySelectedLabels, __setCurrentlySelectedLabels] = useState<string[]>([]);

	const [currentLabelsInQuestion, setCurrentLabelsInQuestion] = useState<string[]>([]);
	const [selectionStatuses, setSelectionStatuses] = useState<Record<string, SelectionStatus>>();

	const findMatchingLabelsFor = (labels: string[]): string[] =>
		labels.filter((label: string) => allowedLabels.includes(label));

	useEffect(() => {
		(async (): Promise<void> => {
			try {
				setIsFetchingLabels(true);

				const fetchedLabels: string[] = await fetchIssueLabels(projectId, issueIid);
				const matchingLabels: string[] = findMatchingLabelsFor(fetchedLabels);

				__setCurrentlySelectedLabels(matchingLabels);
				setIsFetchingLabels(false);
			} catch (e) {
				console.error(e);
			}
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const setCurrentlySelectedLabels = async (labelInQuestion: string, intent: LabelUpdateIntent) => {
		setCurrentLabelsInQuestion((current) => [...current, labelInQuestion]);
		setSelectionStatuses((current) => ({ ...current, [labelInQuestion]: "loading" }));

		/**
		 * TODO
		 * These two `onX` need to be different for each `intent`
		 * so that the mimiced state is always correct.
		 */
		const onSuccess = (res) => {
			__setCurrentlySelectedLabels(findMatchingLabelsFor(res.labels ?? []));
			setSelectionStatuses((current) => ({ ...current, [labelInQuestion]: "success" }));
			setCurrentLabelsInQuestion((current) => [...current].filter((label) => label !== labelInQuestion));
		};

		const onFailure = (e) => {
			console.error(e);
			// __setCurrentlySelectedLabels(findMatchingLabelsFor(res.labels ?? []));
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
					remove_labels: allowedLabels.filter((l) => l !== labelInQuestion), // currentlySelectedLabels, // currentlySelectedLabels[0],
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

	/**
	 * TODO
	 * hacky but works; we'll refactor later
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const determineSelectionStatus = (): SelectionStatus => {
		if (isFetchingLabels) {
			return "loading";
		}

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

	return {
		isFetchingLabels,
		currentlySelectedLabels, //
		setCurrentlySelectedLabels,
		selectionStatuses,
		selectionStatus,
		currentLabelsInQuestion,
	};
};

export type CustomPickerProps = SidebarFeatureFromLabels & {
	projectId: number;
	issueIid: number;
	labelLayoutType: LabelLayoutType;
};

export const CustomLabelPicker: FC<CustomPickerProps> = ({
	projectId = -1,
	issueIid = -1,
	isMultiSelect = false,
	labelLayoutType = "grid",
	title = "",
	labels = [],
}) => {
	const {
		isFetchingLabels,
		currentlySelectedLabels, //
		setCurrentlySelectedLabels,
		selectionStatus,
		currentLabelsInQuestion,
	} = useCurrentlySelectedLabels(projectId, issueIid, labels);

	const handleLabelChange = async (newLabel: string): Promise<void> => {
		const intent: LabelUpdateIntent = determineLabelUpdateIntent(newLabel, currentlySelectedLabels, isMultiSelect);
		await setCurrentlySelectedLabels(newLabel, intent);
	};

	return (
		<div
			className={cx({
				"cursor-loading": selectionStatus === "loading" && !isMultiSelect,
			})}
		>
			<div className="title hide-collapsed">
				{title}{" "}
				<SelectionStatusIndicator
					selectionStatus={selectionStatus}
					isInitializing={isFetchingLabels}
					hasElements={!!currentlySelectedLabels.length}
				/>
			</div>

			<div className="cluster">
				{labelLayoutType === "grid" ? (
					<ul className="story-point-label-grid">
						{labels.map((label) => (
							<li key={label}>
								<button
									type="button"
									data-x-label={label}
									onClick={async (): Promise<void> => await handleLabelChange(label)}
									className={cx("btn story-point-label-grid__list-item-button", {
										"cursor-loading": selectionStatus === "loading" && !isMultiSelect,

										"select-initiated":
											selectionStatus === "loading" && currentLabelsInQuestion.includes(label),
										"select-confirmed":
											currentlySelectedLabels.includes(label) &&
											!currentLabelsInQuestion.includes(label),
										"select-idle":
											currentlySelectedLabels.includes(label) &&
											!currentLabelsInQuestion.includes(label),
									})}
								>
									{label}
								</button>
							</li>
						))}
					</ul>
				) : labelLayoutType === "select" ? (
					<select
						defaultValue={isMultiSelect ? currentlySelectedLabels : currentlySelectedLabels[0]}
						multiple={isMultiSelect}
						onChange={async (e): Promise<void> => await handleLabelChange(e.target.value)}
					>
						<option
							key=""
							value=""
							aria-label="not selected"
							data-x-label=""
							selected={!currentlySelectedLabels.length}
						/>
						{labels.map((label) => (
							<option
								key={label} //
								value={label}
								data-x-label={label}
								selected={currentlySelectedLabels.includes(label)}
							>
								{label}
							</option>
						))}
					</select>
				) : null}
			</div>
		</div>
	);
};
