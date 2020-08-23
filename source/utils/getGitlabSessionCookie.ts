import Cookies from "js-cookie";

export const getGitlabSessionCookie = async () => {
	console.log("document.cookie", document.cookie);

	(window as any).Cookies = Cookies;

	console.log("sesh cook", Cookies.get("_gitlab_session"));

	try {
		console.log(browser, browser);
		const chromeCookies = await browser.cookies.getAll({});
		console.log("chrome cookies", chromeCookies);
	} catch (e) {
		console.error(e);
		throw e;
	}

	console.log("GG EZ");
};
