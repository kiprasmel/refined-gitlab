import { updateApiVariable } from "../utils/api";
import { getConfig } from "../utils/config";
import { getCSRFData } from "../utils/getCSRFData";

function injectNativeAuthIntoApi(request, _sender, _sendResponse): void {
	const { authKind } = getConfig();

	if (authKind !== "native") {
		return;
	}

	const { gitlabSessionToken } = request;

	if (gitlabSessionToken) {
		console.log("`gitlabSessionToken` present - creating new api");

		const { key: gitlabCSRFTokenKey, value: gitlabCSRFTokenValue } = getCSRFData();

		updateApiVariable({
			kind: "native",
			options: {
				nativeAuth: {
					gitlabSessionCookieValue: gitlabSessionToken,
					gitlabCSRFTokenKey,
					gitlabCSRFTokenValue,
				},
			},
		});
	}
}

browser.runtime.onMessage.addListener(injectNativeAuthIntoApi);
