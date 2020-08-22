import OptionsSync from "webext-options-sync";

export const optionsStorage = new OptionsSync({
	defaults: {
		configVersion: "0",
		// hostUrl: "https://gitlab.com", // "<YOUR_GITLAB_HOST_URL>", /** TODO FIXME - why are there errors if the url is without `https?://` ? */
		// apiToken: "<YOUR_GITLAB_API_TOKEN>" /** TODO provide link to get the API token @ popup */,

		// hostUrl: "https://gitlab.com", // "<YOUR_GITLAB_HOST_URL>", /** TODO FIXME - why are there errors if the url is without `https?://` ? */
		// apiToken: "wzvZ499Z17TYyosFVtJ5" /** TODO provide link to get the API token @ popup */,

		hostUrl: "https://bucket.digitalarsenal.net", // "<YOUR_GITLAB_HOST_URL>", /** TODO FIXME - why are there errors if the url is without `https?://` ? */
		apiToken: "QkAACpGN-YhggqG4pyoQ" /** TODO provide link to get the API token @ popup */,
	},
	migrations: [
		(_savedOptions, _defaults) => {
			//
		},
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});

(window as any).optionsStorage = optionsStorage;
