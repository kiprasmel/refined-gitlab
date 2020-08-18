import React, { FC } from "react";

// eslint-disable-next-line import/no-cycle
import { SelectionStatus } from "./CustomLabelPicker";

interface Props {
	selectionStatus: SelectionStatus;
	hasElements: boolean;
}

export const SelectionStatusIndicator: FC<Props> = ({ selectionStatus, hasElements }) => (
	<>
		{selectionStatus === "loading" ? (
			<span title="Updating">🔁</span>
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
