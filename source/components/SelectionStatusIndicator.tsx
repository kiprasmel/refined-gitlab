import React, { FC } from "react";

export type SelectionStatus = "idle" | "loading" | "success" | "error";

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
