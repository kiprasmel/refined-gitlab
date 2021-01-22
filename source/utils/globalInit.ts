import { features } from "../Features";
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

	await features.loadAll();

	console.log("[Refined GitLab] Loaded!", new Date().toISOString());
};
