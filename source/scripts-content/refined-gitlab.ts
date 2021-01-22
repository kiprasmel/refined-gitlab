import select from "select-dom";

// import "./utils/api";
import { globalInit } from "../utils/globalInit";

import "../styles/default.scss";
import "../styles/cluster.scss";

/** leggo */
import "../features/add-custom-label-pickers";
import "../features/add-custom-label-pickers-for-board-sidebar";
import "../features/always-expand-sidebar";
import "../features/highlight-assign-yourself";
import "../features/add-assignee-list-to-issue-board";
import "../features/notify-when-cws-approves-extension";
import "../features/story-points/show-story-point-count-in-issue-board-lists";
// import "../features/show-total-commit-count";

(async (): Promise<void> => {
	await globalInit();
})();

/**
 * debugging
 *
 * though might not work - see:
 *
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
 * & https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
 *
 */
(window as any).select = select;
