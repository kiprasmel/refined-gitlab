import axios from "axios";

// // import { Gitlab } from "@gitbeaker/core"; /** all imports utterly broken */
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src";
import { NativeAuth as GitbeakerNativeAuth } from "../../gitbeaker/packages/gitbeaker-requester-utils/src/BaseService";

import { gitlabAuthCacheEnable, cacheAuthUrl } from "../../local-dev-server/config.shared";
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

export const updateApiVariable = async (_authPkg: Partial<AuthPackage>): Promise<GitlabAPI | undefined> => {
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

	implies<Auth>(authPkg.auth, !!authPkg.isSignedInCookie || retrievedAuthFromCache);
	implies<browser.cookies.Cookie>(authPkg.isSignedInCookie, !!authPkg.isSignedInCookie || retrievedAuthFromCache);

	api = createApi(authPkg.auth);

	/** broken */
	// (window as any).api = api;

	// // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// // @ts-ignore
	// (window as any).api = cloneInto(api, window, { cloneFunctions: true });

	if (__DEV__ && gitlabAuthCacheEnable) {
		/**
		 * if we received the auth package from cache -- inject it,
		 * otherwise we were already authenticated, thus send it over
		 * to the local-dev-server for caching instead
		 */
		if (retrievedAuthFromCache) {
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
