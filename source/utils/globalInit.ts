import { features } from "../Features";
import { isGitlab } from "./pageDetect";

export const globalInit = (): void => {
	if ((window as any).hasRun) {
		return;
	}
	(window as any).hasRun = true;

	if (!isGitlab()) {
		console.log("[Refined GitLab] This ain't GitLab - we ain't loading");
		return;
	}

	features.loadAll();

	console.log("[Refined GitLab] Loaded!", new Date().toISOString());
};
