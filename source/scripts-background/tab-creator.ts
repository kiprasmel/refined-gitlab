interface MessagePayload extends browser.tabs._CreateCreateProperties {
	kind: "tab-creator";
}

const tabCreator = (messagePayload: MessagePayload, _sender): void => {
	browser.tabs
		.create({ url: messagePayload.url, ...messagePayload })
		.then((tab) => console.log("tab", tab))
		.catch((e) => console.error("e", e));
};

browser.runtime.onMessage.addListener(tabCreator);
