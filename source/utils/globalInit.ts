import { features } from "../Features";
import { getCSRFData } from "./getCSRFData";
import { isGitlab } from "./pageDetect";

export const globalInit = (): void => {
	if ((window as any).hasRun) {
		return;
	}
	(window as any).hasRun = true;

	if (!isGitlab()) {
		console.log("[Refined GitLab] This ain't GitLab - we'll cancell ourselves now.");
		return;
	}

	getCSRFData();

	features.loadAll();

	console.log("[Refined GitLab] Loaded!", new Date().toISOString());
};
