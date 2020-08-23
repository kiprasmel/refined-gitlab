import { SetGlobalVarKind } from "../scripts-background/set-global-var";

export type SetGlobalVarMessagePayload = {
	kind: typeof SetGlobalVarKind;
	key: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
};

export const setGlobalVar = async (key: string, value: any): Promise<void> => {
	const messagePayload: SetGlobalVarMessagePayload = {
		kind: "set-var-to-window",
		key,
		value,
	};

	console.log("setGlobalVar", { messagePayload });

	await browser.runtime.sendMessage(messagePayload);
};
