// import React, { useState, useEffect, FC } from "react";

// import { Feature, features } from "../Features";
// import { api } from "../utils/api";
// import { isContributionGraph } from "../utils/pageDetect";
// import { renderNextTo } from "../utils/renderNextTo";

// export const showTotalCommitCount: Feature = (config) => {
// 	if (!isContributionGraph()) {
// 		/** TODO handle @ `Features` */
// 		console.log("- skipping feature because wrong page");
// 		return;
// 	}

// 	/** TODO FIXME */
// 	const { username } = config;

// 	const reactComponent: FC = () => {
// 		const [commitCount, setCommitCount] = useState<number>(0);

// 		useEffect(() => {
// 			api.Users.search(username);
// 		}, []);

// 		return <></>;
// 	};

// 	const nodeId = "total-commits";
// 	const additionalClassesForTopLevelElement = [];

// 	/** TODO simplify the `renderNextTo` util so that we don't need all of this lmao */
// 	renderNextTo(".contrib-calendar", nodeId, additionalClassesForTopLevelElement, reactComponent);
// };

// features.add({
// 	id: "show-total-commit-count",
// 	feature: showTotalCommitCount,
// 	waitForDomLoaded: true,
// });
