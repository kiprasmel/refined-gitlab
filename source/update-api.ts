import { api, createApi } from "./utils/api";

console.log("inside update-api");

function updateApi(request, sender, sendResponse) {
	const { gitlabSessionToken } = request;

	console.log("UPDATE API CALLED", request);

	if (gitlabSessionToken) {
		console.log("GITLABSESSIONTOKEN PRESENT, CREATING NEW API");
		api = createApi(gitlabSessionToken);
	}

	/** */

	// const html = document.querySelector("html");
	// const body = document.querySelector("body");

	// if (request.image) {
	// 	html.style.backgroundImage = "url(" + request.image + ")";
	// 	body.style.backgroundImage = "url(" + request.image + ")";
	// } else if (request.color) {
	// 	html.style.backgroundColor = request.color;
	// 	body.style.backgroundColor = request.color;
	// } else if (request.reset) {
	// 	html.style.backgroundImage = "";
	// 	html.style.backgroundColor = "";
	// 	body.style.backgroundImage = "";
	// 	body.style.backgroundColor = "";
	// }
}

browser.runtime.onMessage.addListener(updateApi);
browser.runtime.onMessageExternal.addListener(updateApi);

console.log("added listener");
