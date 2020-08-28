import select from "select-dom";

import { features } from "../Features";

export const alwaysExpandSidebar = (): void => {
	// const rightSidebar = select(".right-sidebar-collapsed");
	const rightSidebarToggle = select(".gutter-toggle");

	console.log("rightSidebar", rightSidebarToggle);

	// eslint-disable-next-line no-unused-expressions
	rightSidebarToggle?.click();

	// // eslint-disable-next-line no-unused-expressions
	// rightSidebar?.classList.add("right-sidebar-expanded");
	// // eslint-disable-next-line no-unused-expressions
	// rightSidebar?.classList.remove("right-sidebar-collapsed");
};

features.add({
	id: __filebasename,
	feature: alwaysExpandSidebar,
	waitForDomLoaded: false,
});
