// // import { Gitlab } from "@gitbeaker/core"; /** all imports utterly broken */
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src";
import { NativeAuth as GitbeakerNativeAuth } from "../../gitbeaker/packages/gitbeaker-core/src/infrastructure/BaseService";
// // eslint-disable-next-line import/no-cycle
// import { getConfig } from "./config";

/**
 * https://github.com/jdalrymple/gitbeaker
 */

export interface NativeAuth {
	kind: "native";
	options: {
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

export const createApi = (auth: Auth) => {
	console.log("createApi, auth = ", auth);

	return new Gitlab({ ...auth.options });
};

export const updateApiVariable = (auth: Auth) => {
	console.log("updateApiVariable");

	api = createApi(auth);

	(window as any).api = api;

	return api;
};

/** --- */

export { api };
