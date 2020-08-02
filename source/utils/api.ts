/** all imports utterly broken */
// import { Gitlab } from "@gitbeaker/core";
import { Gitlab } from "../../gitbeaker/packages/gitbeaker-browser/src/index";
import { apiToken, hostUrl } from "../config.json";

/**
 * https://github.com/jdalrymple/gitbeaker
 */

export const api = new Gitlab({
	token: apiToken,
	host: hostUrl,
});
