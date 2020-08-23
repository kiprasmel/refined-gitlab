/** TODO FIXME broken */
/** TODO don't forget to import @ `background.ts` */

// let assignedVarsMap = new Map<string, any>;

export const SetGlobalVarKind = "set-var-to-window";

// browser.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
// 	if (message?.kind !== SetGlobalVarKind) {
// 		return;
// 	}

// 	// (window as any)[message.key] = message.value;
// });

(window as any).test1 = "lmao";

console.log("window", window);
