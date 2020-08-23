/**
 * Retrieve any previously set cookie and send to content script
 *
 * https://github.com/mdn/webextensions-examples/blob/master/cookie-bg-picker/background_scripts/background.js
 */

async function getActiveTab(): Promise<browser.tabs.Tab> {
	return await browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

interface MessagePayload {
	gitlabSessionToken: string | undefined;
	success: boolean;
	reason?: string;
}

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

		if (tab.id === undefined) {
			return;
		}

		if (!tab?.url) {
			await sendMessage(tab.id, {
				gitlabSessionToken: undefined,
				success: false,
				reason: "Cannot update cookies (tab's **URL** not found)",
			});

			return;
		}

		/** get any previously set cookie for the current tab */
		const cookie: browser.cookies.Cookie | null = await browser.cookies.get({
			url: tab.url,
			name: "_gitlab_session",
		});

		if (!cookie) {
			await sendMessage(tab.id, {
				gitlabSessionToken: undefined,
				success: false,
				reason: "Cannot update cookies (cookie was falsy)",
			});

			return;
		}

		await sendMessage(tab.id, { gitlabSessionToken: cookie.value, success: true });
	} catch (e) {
		console.error(e);
		throw e;
	}
}

/** update when the tab is updated */
browser.tabs.onUpdated.addListener(gitlabSessionCookieSync);
/** update when the tab is activated */
browser.tabs.onActivated.addListener(gitlabSessionCookieSync);
