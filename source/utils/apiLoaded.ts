// eslint-disable-next-line import/no-cycle
import { needsToWaitForApi } from "./needsToWaitForApi";

export const apiLoaded = new Promise<void>((resolve, reject) => {
	if (!needsToWaitForApi()) {
		resolve();
	}

	browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
		const { gitlabSessionToken } = request;

		if (gitlabSessionToken) {
			resolve();
		} else {
			reject();
		}
	});
});
