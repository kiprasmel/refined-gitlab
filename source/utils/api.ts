// // import { Gitlab } from "@gitbeaker/core"; /** all imports utterly broken */
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src";
// eslint-disable-next-line import/no-cycle
import { getConfig } from "./config";

/**
 * https://github.com/jdalrymple/gitbeaker
 */

export const api = new Gitlab({
	token: getConfig().apiToken,
	host: getConfig().hostUrl,
});
