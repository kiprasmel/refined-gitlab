export const getGitlabSessionCookie = async (): Promise<string | undefined> => {
	console.log("document.cookie", document.cookie);

	try {
		const chromeCookies = await browser.cookies.getAll({});
		return chromeCookies["_gitlab_session"];
	} catch (e) {
		console.error(e);
		throw e;
	}
};
