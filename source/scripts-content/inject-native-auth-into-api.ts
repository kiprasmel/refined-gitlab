import { updateApiVariable } from "../utils/api";
import { getConfig } from "../config";
import { getCSRFData } from "../utils/getCSRFData";
import { MessagePayload } from "../scripts-background/gitlab-session-cookie-sync";

async function injectNativeAuthIntoApi(request: MessagePayload, _sender, sendResponse): Promise<void> {
	console.log("injecting native auth");

	const { authKind } = getConfig();

	if (authKind !== "native") {
		return;
	}

	const { gitlabSessionToken, sessionCookie, isSignedInCookie } = request;

	if (gitlabSessionToken) {
		console.log("`gitlabSessionToken` present - creating new api");
		const { key: gitlabCSRFTokenKey, value: gitlabCSRFTokenValue } = getCSRFData();

		await updateApiVariable(
			{
				sessionCookie: sessionCookie ?? undefined,
				isSignedInCookie: isSignedInCookie ?? undefined,
				auth: {
					kind: "native",
					options: {
						host: window.location.origin,
						nativeAuth: {
							gitlabSessionCookieValue: gitlabSessionToken,

							gitlabCSRFTokenKey,
							gitlabCSRFTokenValue,
						},
					},
				},
			},
			sendResponse
		);
	}
}

browser.runtime.onMessage.addListener(injectNativeAuthIntoApi);
