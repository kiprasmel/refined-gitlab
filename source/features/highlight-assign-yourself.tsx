import select from "select-dom";

import { Feature, features } from "../Features";

import "./highlight-assign-yourself.scss";

export const highlightAssignYourself: Feature = () => {
	// eslint-disable-next-line no-unused-expressions
	select("body")?.classList.add("rgl-feature__highlight-assign-yourself");
};

features.add({
	id: "highlight-assign-yourself",
	feature: highlightAssignYourself,
});
