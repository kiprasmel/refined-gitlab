import { needsToWaitForApi } from "./needsToWaitForApi";

export const apiLoaded = new Promise((resolve) => {
	if (!needsToWaitForApi()) {
		resolve();
	}

	browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
		const { gitlabSessionToken } = request;

		if (gitlabSessionToken) {
			resolve();
		}
	});
});
