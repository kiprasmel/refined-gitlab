import { Config, getConfig } from "../config";
import { features } from "../Features";
import { updateApiVariable } from "./api";
import { implies } from "./implies";
import { isGitlab } from "./pageDetect";

export const globalInit = async (): Promise<void> => {
	console.log("[Refined GitLab] Initializing");

	if ((window as any).hasRun) {
		return;
	}
	(window as any).hasRun = true;

	if (!isGitlab()) {
		console.log("[Refined GitLab] This ain't GitLab - we'll cancel ourselves now.");
		return;
	}

	const config: Config = getConfig();
	if (config.authKind === "apiToken") {
		implies<Config<"apiToken">>(config, config.authKind === "apiToken");

		updateApiVariable({
			auth: {
				kind: "apiToken",
				options: { host: config.hostUrl, oauthToken: config.apiToken, token: config.apiToken } as any,
			},
		});
	}

	await features.loadAll();

	console.log("[Refined GitLab] Loaded!", new Date().toISOString());
};
