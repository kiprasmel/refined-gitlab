/**
 * one can always refer to https://github.com/fregante/github-url-detection
 */

import {
	// getUsername, //
	getCleanPathname,
	// getRepoPath,
	// getRepoURL,
} from "./pageDetectUtils";

export const exists = (selector: string) => Boolean(document.querySelector(selector));

export const isGitlab = (): boolean =>
	!!(
		document.querySelectorAll(`[property="og:site_name"]`)[0]?.attributes?.getNamedItem("content")?.value ===
		"GitLab"
	);

export const is404 = (): boolean => document.title === "Not Found";

// export const is500 = (): boolean => document.title === ""

export const isIssue = (): boolean => /\/issues\/\d+/.test(getCleanPathname());

export const isBoard = (): boolean => /\/boards\/\d+/.test(getCleanPathname());
