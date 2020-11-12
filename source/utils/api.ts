// // import { Gitlab } from "@gitbeaker/core"; /** all imports utterly broken */
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src";
import { NativeAuth as GitbeakerNativeAuth } from "../../gitbeaker/packages/gitbeaker-requester-utils/src/BaseService";
// import { setGlobalVar } from "./setGlobalVar";

/**
 * https://github.com/jdalrymple/gitbeaker
 */

export interface NativeAuth {
	kind: "native";
	options: {
		host: string /** use `window.location.origin` (see  https://stackoverflow.com/a/54691801/9285308) */;
		nativeAuth: GitbeakerNativeAuth;
	};
}

export interface APITokenAuth {
	kind: "apiToken";
	options: {
		oauthToken: string;
		host: string;
	};
}

export type Auth = NativeAuth | APITokenAuth;

export type AuthKind = Auth["kind"];

// eslint-disable-next-line import/no-mutable-exports
let api: ReturnType<typeof createApi>;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createApi = (auth: Auth) => new Gitlab({ ...auth.options });

export const updateApiVariable = (auth: Auth) => {
	api = createApi(auth);

	console.log("updateApiVariable", auth, api);

	/** broken */
	// (window as any).api = api;

	// // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// // @ts-ignore
	// (window as any).api = cloneInto(api, window, { cloneFunctions: true });

	return api;
};

export { api };
