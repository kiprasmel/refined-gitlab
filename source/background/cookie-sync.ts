/**
 * https://github.com/mdn/webextensions-examples/blob/master/cookie-bg-picker/background_scripts/background.js
 */

/* Retrieve any previously set cookie and send to content script */

function getActiveTab() {
	return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => tabs[0]);
}

function cookieUpdate() {
	try {
		console.log("\n\tFUCKIGN COOKEI UPDATE");

		getActiveTab().then((tab) => {
			console.log("tab", tab);

			browser.tabs.sendMessage(tab.id, { tabId: tab.id, gitlabSessionToken: "FUCK_YOU" });

			if (!tab?.url) {
				browser.tabs.sendMessage(tab.id, { tabId: tab.id, gitlabSessionToken: "TAB_URL_WAS_FALSY" });
				console.error("[Refined GitLab] Cannot update cookies (tab's **URL** not found)");
				return;
			}

			// get any previously set cookie for the current tab
			const gettingCookies = browser.cookies.get({
				url: tab.url,
				name: "_gitlab_session",
			});

			browser.tabs.sendMessage(tab.id, { tabId: tab.id, gitlabSessionToken: "FUCK_YOU_2" });

			gettingCookies.then((cookie) => {
				browser.tabs.sendMessage(tab.id, {
					tabId: tab.id,
					gitlabSessionToken: "FUCK_YOU_3",
					cookie,
					isFalsy: !cookie,
				});

				if (!cookie) {
					return;
				}

				browser.tabs.sendMessage(tab.id, {
					tabId: tab.id,
					gitlabSessionToken: "FUCK_YOU_4",
					cookie,
					value: cookie.value,
					isFalsy: !cookie,
				});

				browser.tabs.sendMessage(tab.id, {
					tabId: tab.id,
					gitlabSessionToken: "FUCK_YOU_5",
					cookie,
					value: cookie.value,
					isFalsy: !cookie,
				});

				browser.tabs.sendMessage(tab.id, {
					AAA: "FUCK_YOU_SUCCESS",
					gitlabSessionToken: cookie.value,
					SUCESS: true,
				});
			});
		});
	} catch (e) {
		console.error(e);
		throw e;
	}
}

browser.tabs.onUpdated.addListener((tabid, changeinfo, tab) => {
	console.log("test onUpdated", { tabid, changeinfo, tab });
});

// update when the tab is updated
browser.tabs.onUpdated.addListener(cookieUpdate);
// update when the tab is activated
browser.tabs.onActivated.addListener(cookieUpdate);

browser.tabs.onCreated.addListener((activeInfo) => {
	console.log("\n\tonActivated!", { activeInfo });
});

getActiveTab().then(({ id }) => {
	browser.tabs.sendMessage(id, { gitlabSessionToken: "FAKE_NEWS_YOU_BASTARD" });
});
