import React, { FC } from "react";

// eslint-disable-next-line import/no-cycle
import { SelectionStatus } from "./CustomLabelPicker";
import { LoadingIndicator } from "./LoadingIndicator";

interface Props {
	selectionStatus: SelectionStatus;
	isInitializing: boolean;
	hasElements: boolean;
}

export const SelectionStatusIndicator: FC<Props> = ({ selectionStatus, isInitializing, hasElements }) => (
	<>
		{isInitializing ? (
			<span title="Initializing">
				<LoadingIndicator />
			</span>
		) : selectionStatus === "loading" ? (
			<span title="Updating">
				<LoadingIndicator />
			</span>
		) : selectionStatus === "success" || selectionStatus === "idle" ? (
			hasElements ? (
				<span title="Column successfully selected">✅</span>
			) : (
				<span title="No column selected">–</span>
			)
		) : (
			<span title="Something went wrong (perhaps the wifi is gone?) - check the console & report the issue">
				❌
			</span>
		)}
	</>
);
