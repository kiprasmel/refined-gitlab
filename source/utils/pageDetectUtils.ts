/** Get the logged-in user’s username */
const getUsername = () => document.querySelector('meta[name="user-login"]')!.getAttribute("content")!;

/** Drop leading and trailing slashes */
const getCleanPathname = (url: URL | Location = location): string => url.pathname.replace(/^\/|\/$/g, "");

/** Parses a repo's subpage
@example '/user/repo/issues/' -> 'issues'
@example '/user/repo/' -> ''
@example '/settings/token/' -> undefined
*/
// const getRepoPath = (url: URL | Location = location): string | undefined => {
// 	if (isRepo(url)) {
// 		return getCleanPathname(url)
// 			.split("/")
// 			.slice(2)
// 			.join("/");
// 	}

// 	return undefined;
// };

/** Get the 'user/repo' part from an URL. Tries using the canonical URL to avoid capitalization errors in the `location` URL */
const getRepoURL = (url?: URL | Location): string => {
	if (!url) {
		const canonical = document.querySelector<HTMLMetaElement>('[property="og:url"]'); // `rel=canonical` doesn't appear on every page
		url = canonical ? new URL(canonical.content, location.origin) : location;
	}

	return url.pathname
		.slice(1)
		.split("/", 2)
		.join("/");
};

export {
	getUsername, //
	getCleanPathname,
	// getRepoPath,
	getRepoURL,
};
