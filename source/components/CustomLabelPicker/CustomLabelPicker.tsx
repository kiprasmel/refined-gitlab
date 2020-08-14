/* eslint-disable import/no-cycle */
import React, { FC } from "react";

import { LabelLayoutType } from "../../features/add-custom-label-pickers";
import { CustomLabelPickerGrid } from "./CustomLabelPickerGrid";
import { CustomLabelPickerSelect } from "./CustomLabelPickerSelect";

export interface CustomPickerProps<LabelLayoutType> {
	projectId: number;
	issueIid: number;
	title: string;
	allowedLabels: string[];
	isMultiSelect: LabelLayoutType extends "select" ? false : boolean;
}

interface Props extends CustomPickerProps<LabelLayoutType> {
	labelLayoutType: LabelLayoutType;
}

const availablePickers: Record<Props["labelLayoutType"], React.FC<CustomPickerProps<Props["labelLayoutType"]>>> = {
	grid: CustomLabelPickerGrid,
	select: CustomLabelPickerSelect,
};

export const CustomLabelPicker: FC<Props> = ({ labelLayoutType, ...props }) => {
	const Picker = availablePickers[labelLayoutType];
	console.log("Picker", Picker, "labelLayoutType", labelLayoutType);

	return <Picker {...props} />;
};
