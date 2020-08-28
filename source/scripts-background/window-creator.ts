/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows
 */

interface MessagePayload extends browser.windows._CreateCreateData {
	kind: "window-creator";
}

const windowCreator = async (
	messagePayload: MessagePayload,
	_sender
): Promise<Promise<browser.windows.Window> | false> => {
	if (messagePayload.kind === "window-creator") {
		await browser.windows.create({ url: messagePayload.url, ...messagePayload });
	}

	browser.runtime.sendMessage({ kind: "window-creator", msg: "LMAO" });
};

browser.runtime.onMessage.addListener(windowCreator);
