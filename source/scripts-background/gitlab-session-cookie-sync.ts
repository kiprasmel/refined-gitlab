/**
 * Retrieve any previously set cookie and send to content script
 *
 * https://github.com/mdn/webextensions-examples/blob/master/cookie-bg-picker/background_scripts/background.js
 */

// import domLoaded from "dom-loaded";
// import select from "select-dom";
// import { apiLoaded } from "../utils/apiLoaded";
// import { pageLoaded } from "../utils/pageLoaded";
import { AuthPackage } from "../utils/api";

async function getActiveTab(): Promise<browser.tabs.Tab> {
	return await browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

export type MessagePayload =
	| {
			gitlabSessionToken: string | undefined;
			sessionCookie: browser.cookies.Cookie | null;
			isSignedInCookie: browser.cookies.Cookie | null;
			success: false;
			reason?: string;
	  }
	| {
			gitlabSessionToken: string;
			sessionCookie: browser.cookies.Cookie | null;
			isSignedInCookie: browser.cookies.Cookie | null;
			success: true;
			reason?: string;
	  };

async function sendMessage(
	tabId: number,
	messagePayload: MessagePayload,
	options?: browser.tabs._SendMessageOptions | undefined
): Promise<void> {
	await browser.tabs.sendMessage(tabId, messagePayload, options);
}

async function gitlabSessionCookieSync(): Promise<void> {
	try {
		const tab = await getActiveTab();
		console.log("tab", tab);

		if (tab.id === undefined) {
			console.error("tab.id undefined");
			return;
		}

		if (!tab?.url) {
			const msg = "Cannot update cookies (tab's **URL** not found)";
			console.error(msg);

			await sendMessage(tab.id, {
				gitlabSessionToken: undefined,
				sessionCookie: null,
				isSignedInCookie: null,
				success: false,
				reason: msg,
			});

			return;
		}

		/** get any previously set cookie for the current tab */
		const cookie: browser.cookies.Cookie | null = await browser.cookies.get({
			url: tab.url,
			name: "_gitlab_session",
		});

		if (!cookie) {
			const msg = "Cannot update cookies (`_gitlab_session` cookie was falsy)";
			console.error(msg);

			await sendMessage(tab.id, {
				gitlabSessionToken: undefined,
				sessionCookie: null,
				isSignedInCookie: null,
				success: false,
				reason: msg,
			});

			return;
		}

		const isSignedInCookie: browser.cookies.Cookie | null = await browser.cookies.get({
			url: tab.url,
			name: "known_sign_in",
		});

		console.log("successfully retrieved cookie 'gitlabSessionToken'");
		await sendMessage(tab.id, {
			gitlabSessionToken: cookie.value,
			isSignedInCookie,
			sessionCookie: cookie,
			success: true,
		});
	} catch (e) {
		console.error(JSON.stringify(e));
		throw e;
	}
}

/** update when the tab is updated */
browser.tabs.onUpdated.addListener(gitlabSessionCookieSync);
/** update when the tab is activated */
browser.tabs.onActivated.addListener(gitlabSessionCookieSync);

/**
 * inject cookies into browser if retrieved from cache (only in development)
 *
 * listens to messages from content scripts -- should receive a response
 * after the auth is successfully cached
 */
if (__DEV__) {
	browser.runtime.onMessage.addListener(
		async (
			message: {
				kind: "inject-auth-from-cache" | any;
				authPkg: AuthPackage;
			},
			_sender,
			_sendResponse
		) => {
			try {
				console.log("inject-auth-from-cache LISTENER, msg kind:", message?.kind);

				if (message?.kind !== "inject-auth-from-cache") {
					return;
				}

				const tab = await getActiveTab();
				console.log("tab @ listener", tab);

				if (tab.id === undefined) {
					console.error("tab.id undefined");
					return;
				}

				if (!tab?.url) {
					const msg = "Cannot update cookies (tab's **URL** not found)";
					console.error(msg);
					return;
				}

				const { authPkg } = message;

				console.log("listener: message ", message);

				// await browser.cookies.set({
				// 	url: tab.url,
				// 	...authPkg.sessionCookie,
				// });

				// await browser.cookies.set({
				// 	url: tab.url,
				// 	// name: "known_sign_in",
				// 	...authPkg.sessionCookie,
				// });

				await browser.cookies.remove({
					url: tab.url, //
					name: authPkg.sessionCookie.name,
				});

				await browser.cookies.set({
					url: tab.url,
					domain: authPkg.sessionCookie.domain,
					httpOnly: authPkg.sessionCookie.httpOnly,
					name: authPkg.sessionCookie.name,
					path: authPkg.sessionCookie.path,
					sameSite: authPkg.sessionCookie.sameSite,
					secure: authPkg.sessionCookie.secure,
					// storeId: authPkg.sessionCookie.storeId,
					value: authPkg.sessionCookie.value,
				});

				await browser.cookies.remove({
					url: tab.url, //
					name: authPkg.isSignedInCookie.name,
				});

				await browser.cookies.set({
					url: tab.url,
					domain: authPkg.isSignedInCookie.domain,
					expirationDate: authPkg.isSignedInCookie.expirationDate,
					httpOnly: authPkg.isSignedInCookie.httpOnly,
					name: authPkg.isSignedInCookie.name,
					path: authPkg.isSignedInCookie.path,
					sameSite: authPkg.isSignedInCookie.sameSite,
					secure: authPkg.isSignedInCookie.secure,
					// storeId: authPkg.isSignedInCookie.storeId,
					value: authPkg.isSignedInCookie.value,
				});

				console.log("!!! done injecting cookies back from cache!");

				/**
				 * reload page to finish auto sign-in
				 *
				 * observing sign in button, waiting for dom-/page-/api-loaded
				 * didn't work, this does, whatever lol
				 */
				setTimeout(async () => {
					if (tab.id !== undefined) {
						await browser.tabs.reload(tab.id);
					}
				}, 3000);

				// await Promise.allSettled([pageLoaded, domLoaded, apiLoaded]);

				// // pageLoaded.then(async () => {
				// // domLoaded.then(async () => {
				// const signInBtn: HTMLAnchorElement | null = select(".btn-sign-in");

				// console.log("singInBtn", signInBtn);

				// observe(signInBtn as any, (mutRec) => {
				// 	console.log("mutRec", mutRec);
				// 	// mutRec.forEach((mut) => {
				// 	// 	//
				// 	// 	console.log("mut", mut);
				// 	// });
				// });

				// // document.arrive(".btn-sign-in", async () => {
				// if (!signInBtn) {
				// 	console.log("no sign in button found - done");
				// } else {
				// 	console.log("sign in button found - attempting to sign in hehe");

				// 	signInBtn.click();

				// 	if (tab.id !== undefined) {
				// 		await browser.tabs.reload(tab.id);
				// 	}

				// 	console.log("we're in.");
				// }
				// // });

				// // });
				// // });
				// // sendResponse((res) => {
				// // 	console.log(":O received response!", res);
				// // });
			} catch (e) {
				console.error("!!! error injecting cookies back from cache!", e);
			}
		}
	);
}
