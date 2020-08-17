// // import { Gitlab } from "@gitbeaker/core"; /** all imports utterly broken */
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src";
// eslint-disable-next-line import/no-cycle
import { getConfig } from "./config";

/**
 * https://github.com/jdalrymple/gitbeaker
 */

export const createApi = (token = getConfig().apiToken, host = getConfig().hostUrl) => {
	console.log("creating API with", { token, host });

	return new Gitlab({
		oauthToken: token,
		host,
	});
};

// eslint-disable-next-line import/no-mutable-exports, prefer-const
let api = createApi();

/** --- */

export { api };
