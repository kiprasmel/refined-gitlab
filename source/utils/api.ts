import axios from "axios";

// // import { Gitlab } from "@gitbeaker/core"; /** all imports utterly broken */
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src";
import { NativeAuth as GitbeakerNativeAuth } from "../../gitbeaker/packages/gitbeaker-requester-utils/src/BaseService";

import { gitlabAuthCacheEnable, cacheAuthUrl } from "../../local-dev-server/local-dev-config";
import { implies } from "./implies";

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

export type AuthPackage = {
	auth: Auth;
	sessionCookie: browser.cookies.Cookie;
	isSignedInCookie: browser.cookies.Cookie;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createApi = (auth: Auth) => new Gitlab({ ...auth.options });

export type GitlabAPI = ReturnType<typeof createApi>;

// eslint-disable-next-line import/no-mutable-exports
let api: GitlabAPI;

export const updateApiVariable = async (
	_authPkg: Partial<AuthPackage>,
	sendResponse: (response?: any) => void
): Promise<GitlabAPI | undefined> => {
	// eslint-disable-next-line
	let authPkg: Partial<AuthPackage> = { ..._authPkg };

	let retrievedAuthFromCache: boolean = false;

	if (!authPkg.isSignedInCookie) {
		if (!__DEV__) {
			return;
		} else {
			if (!gitlabAuthCacheEnable) {
				console.log("not signed in and auth caching disabled - ignoring");
				return;
			} else {
				try {
					const res = await axios.get(cacheAuthUrl);

					retrievedAuthFromCache = true;
					authPkg = res.data.authPkg;

					console.log("succ got cached auth", res.data.authPkg);
				} catch (e) {
					console.log("auth not cached - ignoring");
					return;
				}
			}
		}
	}

	console.log("after check");

	implies<Auth>(authPkg.auth, !!authPkg.isSignedInCookie || retrievedAuthFromCache);
	implies<browser.cookies.Cookie>(authPkg.isSignedInCookie, !!authPkg.isSignedInCookie || retrievedAuthFromCache);

	console.log("begin createApi", authPkg);
	api = createApi(authPkg.auth);
	console.log("end createApi", authPkg, api);

	/** broken */
	// (window as any).api = api;

	// // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// // @ts-ignore
	// (window as any).api = cloneInto(api, window, { cloneFunctions: true });

	if (__DEV__ && gitlabAuthCacheEnable) {
		console.log("retrievedAuthFromCache", retrievedAuthFromCache);
		if (retrievedAuthFromCache) {
			// sendResponse({
			// 	kind: "inject-auth-from-cache",
			// 	authPkg,
			// });

			// await browser.tabs.sendMessage(tab.id, {
			// 	kind: "inject-auth-from-cache",
			// 	authPkg,
			// });

			await browser.runtime.sendMessage({
				kind: "inject-auth-from-cache",
				authPkg,
			});
		} else {
			axios.post(cacheAuthUrl, { authPkg });
		}
	}

	return api;
};

export { api };
